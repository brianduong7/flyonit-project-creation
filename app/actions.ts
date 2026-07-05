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
import { ERPNEXT_PROJECT_TYPES } from "@/lib/naming/constants";
import { addProject, getNextSequence, projectCodeExists, type ProjectRecord } from "@/lib/store";

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
  if (!ERPNEXT_PROJECT_TYPES.includes(erpNextProjectType as (typeof ERPNEXT_PROJECT_TYPES)[number])) {
    return { status: "error", message: "Select a valid ERPNext project type." };
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

  const workArea = sharePointWorkArea(erpNextProjectType);
  const record: ProjectRecord = {
    projectCode,
    displayName: buildDisplayName(projectCode, scopeTitle),
    clientOrDeptCode,
    clientOrDeptName,
    region,
    service,
    engagementType,
    sequence,
    scopeTitle,
    erpNextProjectType,
    sharePointPath: sharePointPath(workArea, region, projectCode),
    createdAt: new Date().toISOString(),
  };

  await addProject(record);
  revalidatePath("/");

  return { status: "success", project: record };
}
