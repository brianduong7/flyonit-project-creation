// Source: FLYONIT_Project_Portfolio_Naming_ERPNext_Templates_Final.xlsx — Code_Dictionary sheet

export const REGIONS = [
  { code: "AU", label: "Australia / ANZ" },
  { code: "US", label: "United States / North America" },
  { code: "IN", label: "India" },
  { code: "UAE", label: "United Arab Emirates / Middle East" },
  { code: "GLB", label: "Global / cross-region" },
] as const;

export const SERVICES = [
  { code: "AI", label: "Artificial Intelligence / Copilot / automation" },
  { code: "CYB", label: "Cybersecurity" },
  { code: "CLD", label: "Cloud / M365 / Azure" },
  { code: "ERP", label: "ERPNext / business apps" },
  { code: "WEB", label: "Web / app / digital" },
  { code: "MSP", label: "Managed Services / AMC" },
  { code: "NET", label: "Network / infrastructure" },
  { code: "MKT", label: "Marketing" },
  { code: "OPS", label: "Operations / internal process" },
  { code: "DATA", label: "Data / analytics" },
] as const;

export const ENGAGEMENT_TYPES = [
  { code: "IMP", label: "Implementation / deployment" },
  { code: "MIG", label: "Migration" },
  { code: "MGT", label: "Managed service operations" },
  { code: "SUP", label: "Support" },
  { code: "AUD", label: "Audit / assessment" },
  { code: "OPT", label: "Optimisation / improvement" },
  { code: "POC", label: "Proof of concept" },
  { code: "PRJ", label: "General project / program" },
  { code: "CAM", label: "Campaign / event" },
  { code: "OPS", label: "Operations" },
] as const;

// Internal department codes. External clients use a free-typed 3-8 char code instead.
export const DEPARTMENTS = [
  { code: "FOIT", label: "FOIT / cross-department" },
  { code: "PMO", label: "Project Management Office / Governance" },
  { code: "MKT", label: "Sales & Marketing" },
  { code: "PPL", label: "People & Culture" },
  { code: "FIN", label: "Finance & Admin" },
  { code: "OPS", label: "Infrastructure & Operations" },
  { code: "RND", label: "KPI & Innovation / R&D" },
  { code: "CS", label: "Customer Success" },
] as const;

export type RegionCode = (typeof REGIONS)[number]["code"];
export type ServiceCode = (typeof SERVICES)[number]["code"];
export type EngagementTypeCode = (typeof ENGAGEMENT_TYPES)[number]["code"];
