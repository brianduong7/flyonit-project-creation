import {
  REGIONS,
  SERVICES,
  ENGAGEMENT_TYPES,
  type RegionCode,
  type ServiceCode,
  type EngagementTypeCode,
} from "./constants";

const CLIENT_CODE_PATTERN = /^[A-Z0-9]{3,8}$/;

export function isValidClientOrDeptCode(code: string): boolean {
  return CLIENT_CODE_PATTERN.test(code);
}

export function isValidRegion(code: string): code is RegionCode {
  return REGIONS.some((r) => r.code === code);
}

export function isValidService(code: string): code is ServiceCode {
  return SERVICES.some((s) => s.code === code);
}

export function isValidEngagementType(code: string): code is EngagementTypeCode {
  return ENGAGEMENT_TYPES.some((e) => e.code === code);
}

/** Official project code: [CLIENT_OR_DEPT]-[REGION]-[SERVICE]-[ENG_TYPE]-[###] */
export function buildProjectCode(params: {
  clientOrDeptCode: string;
  region: string;
  service: string;
  engagementType: string;
  sequence: number;
}): string {
  const seq = String(params.sequence).padStart(3, "0");
  return `${params.clientOrDeptCode}-${params.region}-${params.service}-${params.engagementType}-${seq}`;
}

/** Project display name: [ProjectCode] - [ShortScopeTitle] */
export function buildDisplayName(projectCode: string, scopeTitle: string): string {
  return `${projectCode} - ${scopeTitle}`;
}

/** SharePoint work area folder by ERPNext project type, per File_Folder_Naming / Naming_Convention sheets. */
export function sharePointWorkArea(projectType: string): string {
  switch (projectType) {
    case "Managed Service":
      return "02_Managed_Services";
    case "Internal":
      return "03_Internal_Projects";
    default:
      return "01_Client_Projects";
  }
}

/** Region folders under 01_Client_Projects (and Managed Services). */
export const SHAREPOINT_REGION_FOLDERS: Record<string, string> = {
  AU: "01_AU",
  IN: "02_IN",
  UAE: "03_UAE",
  US: "04_US",
  GLB: "05_GLB",
};

/** Department folders under 03_Internal_Projects (from live library layout). */
export const SHAREPOINT_DEPT_FOLDERS: Record<string, string> = {
  MKT: "01_MKT",
  OPS: "02_OPS",
  PMO: "03_PMO",
  PPL: "04_PPL",
  FIN: "05_FIN",
  RND: "06_RND",
  CS: "07_CS",
  FOIT: "FOIT",
  INT: "08_INT",
};

export function sharePointRegionFolder(region: string): string {
  return SHAREPOINT_REGION_FOLDERS[region] ?? region;
}

export function sharePointDeptFolder(deptCode: string): string {
  return SHAREPOINT_DEPT_FOLDERS[deptCode.toUpperCase()] ?? deptCode.toUpperCase();
}

/**
 * Parent folder under the work area:
 * - Client / Managed Service → region (01_AU, …)
 * - Internal → department (FOIT, 02_OPS, …)
 */
export function sharePointParentFolder(params: {
  projectType: string;
  region: string;
  clientOrDeptCode: string;
}): string {
  if (params.projectType === "Internal") {
    return sharePointDeptFolder(params.clientOrDeptCode);
  }
  return sharePointRegionFolder(params.region);
}

/** SharePoint rejects " * : < > ? / \\ | in folder names. */
export function sharePointFolderName(displayName: string): string {
  return displayName
    .replace(/["*:<>?/\\|]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 255);
}

export function sharePointPath(workArea: string, parentFolder: string, folderName: string): string {
  return `/Shared Documents/${workArea}/${parentFolder}/${folderName}`;
}
