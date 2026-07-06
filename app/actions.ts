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
import { createErpNextProject, listPortfolios, listProjectTypes } from "@/lib/erpnext/client";

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

  const sequence = await getNextSequence(clientOrDeptCode);
  const projectCode = buildProjectCode({
    clientOrDeptCode,
    region,
    service,
    engagementType,
    sequence,
  });

  // Guard against a race where two submissions land on the same sequence number.
  if (await projectCodeExists(projectCode)) {
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
  };

  await addProject(record);
  revalidatePath("/");

  return { status: "success", project: record };
}
