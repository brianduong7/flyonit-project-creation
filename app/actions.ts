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
import { matchProjectTemplate } from "@/lib/tasks/templates";
import { scheduleTask } from "@/lib/tasks/schedule";

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

  const template = matchProjectTemplate(service, engagementType);
  let tasksCreated = 0;
  let tasksError: string | undefined;
  if (template) {
    try {
      const projectStart = new Date();
      const createdTaskIds = new Map<number, string>();
      for (const task of template.tasks) {
        const { expStartDate, expEndDate } = scheduleTask(projectStart, task);
        const dependsOn = task.dependsOnTaskNo
          ? [{ task: createdTaskIds.get(task.dependsOnTaskNo)! }]
          : undefined;
        const created = await createErpNextTask({
          subject: task.subject,
          project: erpNextName,
          custom_task_phase: task.phase,
          priority: task.priority,
          exp_start_date: expStartDate,
          exp_end_date: expEndDate,
          task_weight: task.weightPct / 100,
          description: `${task.description}\n\nRole: ${task.role}\nTask type: ${task.taskType}\nDeliverable folder: ${task.deliverableFolder}`,
          depends_on: dependsOn,
        });
        createdTaskIds.set(task.taskNo, created.name);
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
    taskTemplateCode: template?.code,
    tasksError,
  };

  // Best-effort local register — must not fail the request after ERPNext create.
  await addProject(record);
  revalidatePath("/");

  return { status: "success", project: record };
}
