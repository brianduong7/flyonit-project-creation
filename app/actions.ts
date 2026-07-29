"use server";

import { revalidatePath } from "next/cache";
import {
  isValidClientOrDeptCode,
  isValidRegion,
  isValidService,
  isValidEngagementType,
  buildProjectCode,
  buildDisplayName,
  sharePointWorkArea,
  sharePointPath,
} from "@/lib/naming/generate";
import { addProject, getNextSequence, projectCodeExists, type ProjectRecord } from "@/lib/store";
import {
  createErpNextProject,
  createErpNextTask,
  getMaxSequenceFromErpNext,
  listPortfolios,
  listProjectTypes,
  projectCodeExistsInErpNext,
} from "@/lib/erpnext/client";
import { createGroupChat, DEFAULT_CHAT_OWNERS } from "@/lib/msgraph/client";
import {
  getProjectTemplateByName,
  matchProjectTemplate,
  unionTemplateTasks,
} from "@/lib/tasks/templates";
import { scheduleTaskSequential } from "@/lib/tasks/schedule";

export type CreateProjectState = {
  status: "idle" | "error" | "success";
  message?: string;
  project?: ProjectRecord;
};

export async function createProject(
  _prevState: CreateProjectState,
  formData: FormData
): Promise<CreateProjectState> {
  const clientOrDeptCode = String(formData.get("clientOrDeptCode") ?? "")
    .trim()
    .toUpperCase();
  const clientOrDeptName = String(formData.get("clientOrDeptName") ?? "").trim();
  const region = String(formData.get("region") ?? "");
  const service = String(formData.get("service") ?? "");
  const engagementType = String(formData.get("engagementType") ?? "");
  const scopeTitle = String(formData.get("scopeTitle") ?? "").trim();
  const erpNextProjectType = String(formData.get("erpNextProjectType") ?? "");
  const portfolio = String(formData.get("portfolio") ?? "");
  const projectTemplateNames = formData
    .getAll("projectTemplates")
    .map((v) => String(v).trim())
    .filter(Boolean);

  if (!isValidClientOrDeptCode(clientOrDeptCode)) {
    return { status: "error", message: "Client/dept code must be 3-8 letters or numbers." };
  }
  if (!clientOrDeptName) {
    return { status: "error", message: "Client/department name is required." };
  }
  if (!isValidRegion(region)) {
    return { status: "error", message: "Select a valid region." };
  }
  if (!isValidService(service)) {
    return { status: "error", message: "Select a valid service." };
  }
  if (!isValidEngagementType(engagementType)) {
    return { status: "error", message: "Select a valid engagement type." };
  }
  if (!scopeTitle) {
    return { status: "error", message: "Scope title is required." };
  }
  const selectedTemplates = projectTemplateNames.map((name) => getProjectTemplateByName(name));
  if (selectedTemplates.some((t) => !t)) {
    return { status: "error", message: "One or more project templates are invalid." };
  }
  const resolvedSelected = selectedTemplates.filter(
    (t): t is NonNullable<typeof t> => t != null
  );
  const validProjectTypes = await listProjectTypes();
  if (!validProjectTypes.includes(erpNextProjectType)) {
    return { status: "error", message: "Select a valid ERPNext project type." };
  }
  const validPortfolios = await listPortfolios();
  if (!validPortfolios.includes(portfolio)) {
    return { status: "error", message: "Select a valid Portfolio." };
  }

  // Prefer the higher of local register + ERPNext so sequences stay unique on
  // Vercel, where data/projects.json cannot be written.
  const [localNext, erpMax] = await Promise.all([
    getNextSequence(clientOrDeptCode),
    getMaxSequenceFromErpNext(clientOrDeptCode).catch(() => 0),
  ]);
  const sequence = Math.max(localNext, erpMax + 1);
  const projectCode = buildProjectCode({
    clientOrDeptCode,
    region,
    service,
    engagementType,
    sequence,
  });

  // Guard against a race where two submissions land on the same sequence number.
  const [localExists, erpExists] = await Promise.all([
    projectCodeExists(projectCode),
    projectCodeExistsInErpNext(projectCode).catch(() => false),
  ]);
  if (localExists || erpExists) {
    return {
      status: "error",
      message: `${projectCode} already exists. Please try again.`,
    };
  }

  const displayName = buildDisplayName(projectCode, scopeTitle);
  const workArea = sharePointWorkArea(erpNextProjectType);

  let erpNextName: string;
  try {
    const created = await createErpNextProject({
      project_name: displayName,
      project_type: erpNextProjectType,
      custom_work_domain: portfolio,
    });
    erpNextName = created.name;
  } catch (err) {
    return {
      status: "error",
      message: `ERPNext create failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  const chatTopic = displayName;
  let chatError: string | undefined;
  try {
    await createGroupChat({
      topic: chatTopic,
      members: DEFAULT_CHAT_OWNERS,
    });
  } catch (err) {
    // Best-effort: the ERPNext project is the record that matters, so a chat
    // creation hiccup shouldn't fail the whole submission.
    chatError = err instanceof Error ? err.message : String(err);
  }

  // Tasks only when at least one project template is selected. Then union
  // all selected templates + service/engagement auto-match (deduped by subject).
  let tasksCreated = 0;
  let tasksError: string | undefined;
  let taskTemplateCode: string | undefined;
  if (resolvedSelected.length > 0) {
    const matched = matchProjectTemplate(service, engagementType);
    const toUnion = [...resolvedSelected];
    if (matched && !toUnion.some((t) => t.name === matched.name)) {
      toUnion.push(matched);
    }
    const { tasks, sources } = unionTemplateTasks(toUnion);
    taskTemplateCode = sources.join(" + ");
    try {
      const projectStart = new Date();
      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const { expStartDate, expEndDate } = scheduleTaskSequential(projectStart, i);
        await createErpNextTask({
          subject: task.subject,
          project: erpNextName,
          exp_start_date: expStartDate,
          exp_end_date: expEndDate,
          description: `Source task: ${task.sourceTaskId}`,
        });
        tasksCreated++;
      }
    } catch (err) {
      // Best-effort, same reasoning as the chat: the ERPNext project already
      // exists, so a task-creation hiccup shouldn't fail the whole submission.
      tasksError = err instanceof Error ? err.message : String(err);
    }
  }

  const record: ProjectRecord = {
    projectCode,
    displayName,
    clientOrDeptCode,
    clientOrDeptName,
    region,
    service,
    engagementType,
    sequence,
    scopeTitle,
    erpNextProjectType,
    portfolio,
    sharePointPath: sharePointPath(workArea, region, projectCode),
    createdAt: new Date().toISOString(),
    erpNextName,
    chatTopic: chatError ? undefined : chatTopic,
    chatError,
    tasksCreated: tasksCreated || undefined,
    taskTemplateCode,
    tasksError,
  };

  // Best-effort local register — must not fail the request after ERPNext create.
  await addProject(record);
  revalidatePath("/");

  return { status: "success", project: record };
}
