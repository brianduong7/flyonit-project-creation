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

export function sharePointPath(workArea: string, region: string, projectCode: string): string {
  return `/Shared Documents/${workArea}/${region}/${projectCode}`;
}
