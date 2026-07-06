// Source: FLYONIT_Project_Portfolio_Naming_ERPNext_Templates_Final.xlsx —
// ERPNext_Templates + Tasks_* / Combined_Task_Import sheets.

export type TaskDefinition = {
  taskNo: number;
  phase: string;
  subject: string;
  taskType: string;
  beginOnDay: number;
  durationDays: number;
  priority: "High" | "Medium" | "Low";
  role: string;
  dependsOnTaskNo: number | null;
  weightPct: number;
  deliverableFolder: string;
  description: string;
};

export type ProjectTemplate = {
  code: string;
  name: string;
  /** "MULTI" matches any service - only used as a fallback, checked last. */
  services: string[] | "MULTI";
  engagementTypes: string[];
  tasks: TaskDefinition[];
};

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    code: "TPL-EXT-AI-IMP",
    name: "AI Implementation Template",
    services: ["AI"],
    engagementTypes: ["IMP", "POC"],
    tasks: [
      { taskNo: 1, phase: "Initiation", subject: "Kickoff and governance setup", taskType: "Documentation", beginOnDay: 1, durationDays: 2, priority: "High", role: "Project Manager", dependsOnTaskNo: null, weightPct: 5, deliverableFolder: "01_Admin", description: "Project initiation, RACI, cadence, communications" },
      { taskNo: 2, phase: "Discovery", subject: "Discovery workshop", taskType: "Assessment", beginOnDay: 1, durationDays: 3, priority: "High", role: "Solution Lead", dependsOnTaskNo: 1, weightPct: 10, deliverableFolder: "03_Planning", description: "Requirements, users, data, success criteria" },
      { taskNo: 3, phase: "Discovery", subject: "Current state assessment", taskType: "Assessment", beginOnDay: 2, durationDays: 4, priority: "High", role: "Consultant", dependsOnTaskNo: 2, weightPct: 10, deliverableFolder: "03_Planning", description: "Licensing, security, readiness, data sources" },
      { taskNo: 4, phase: "Design", subject: "Solution design", taskType: "Documentation", beginOnDay: 5, durationDays: 5, priority: "High", role: "Solution Architect", dependsOnTaskNo: 3, weightPct: 12, deliverableFolder: "04_Design", description: "Architecture, controls, rollout plan" },
      { taskNo: 5, phase: "Build", subject: "Build and configuration", taskType: "Implementation", beginOnDay: 10, durationDays: 7, priority: "High", role: "Engineer", dependsOnTaskNo: 4, weightPct: 18, deliverableFolder: "05_Delivery", description: "Tenant configuration, prompts, policies, integrations" },
      { taskNo: 6, phase: "Pilot", subject: "Pilot / POC", taskType: "Implementation", beginOnDay: 17, durationDays: 5, priority: "High", role: "Engineer", dependsOnTaskNo: 5, weightPct: 12, deliverableFolder: "05_Delivery", description: "Controlled pilot and feedback" },
      { taskNo: 7, phase: "Validate", subject: "UAT and remediation", taskType: "Assessment", beginOnDay: 22, durationDays: 4, priority: "High", role: "QA / Consultant", dependsOnTaskNo: 6, weightPct: 10, deliverableFolder: "06_Testing", description: "Testing and issue closure" },
      { taskNo: 8, phase: "Enablement", subject: "Training and adoption", taskType: "User Training", beginOnDay: 24, durationDays: 3, priority: "Medium", role: "Trainer", dependsOnTaskNo: 5, weightPct: 8, deliverableFolder: "07_Training_Handover", description: "Admin and end-user enablement" },
      { taskNo: 9, phase: "Go-live", subject: "Go-live", taskType: "Milestone", beginOnDay: 27, durationDays: 1, priority: "High", role: "Project Manager", dependsOnTaskNo: 7, weightPct: 8, deliverableFolder: "05_Delivery", description: "Production launch" },
      { taskNo: 10, phase: "Close", subject: "Handover and hypercare", taskType: "Support", beginOnDay: 28, durationDays: 5, priority: "Medium", role: "Support Lead", dependsOnTaskNo: 9, weightPct: 7, deliverableFolder: "07_Training_Handover", description: "Handover pack and initial support" },
    ],
  },
  {
    code: "TPL-EXT-CYB-AUD",
    name: "Cybersecurity Assessment Template",
    services: ["CYB"],
    engagementTypes: ["AUD", "OPT"],
    tasks: [
      { taskNo: 1, phase: "Initiation", subject: "Kickoff and scope confirmation", taskType: "Documentation", beginOnDay: 1, durationDays: 2, priority: "High", role: "Project Manager", dependsOnTaskNo: null, weightPct: 8, deliverableFolder: "01_Admin", description: "Confirm scope, stakeholders, evidence requirements" },
      { taskNo: 2, phase: "Evidence", subject: "Information request", taskType: "Documentation", beginOnDay: 2, durationDays: 3, priority: "High", role: "Consultant", dependsOnTaskNo: 1, weightPct: 8, deliverableFolder: "03_Planning", description: "Collect policies, configs, architecture" },
      { taskNo: 3, phase: "Assessment", subject: "Assessment execution", taskType: "Assessment", beginOnDay: 4, durationDays: 7, priority: "High", role: "Security Consultant", dependsOnTaskNo: 2, weightPct: 25, deliverableFolder: "05_Delivery", description: "Technical and procedural review" },
      { taskNo: 4, phase: "Analysis", subject: "Gap analysis", taskType: "Assessment", beginOnDay: 10, durationDays: 4, priority: "High", role: "Security Consultant", dependsOnTaskNo: 3, weightPct: 20, deliverableFolder: "05_Delivery", description: "Prioritised findings and risk assessment" },
      { taskNo: 5, phase: "Report", subject: "Draft report", taskType: "Documentation", beginOnDay: 13, durationDays: 3, priority: "High", role: "Security Consultant", dependsOnTaskNo: 4, weightPct: 15, deliverableFolder: "05_Delivery", description: "Executive and technical report" },
      { taskNo: 6, phase: "Review", subject: "Client review workshop", taskType: "Workshop", beginOnDay: 16, durationDays: 1, priority: "Medium", role: "Solution Lead", dependsOnTaskNo: 5, weightPct: 10, deliverableFolder: "07_Training_Handover", description: "Review results and action plan" },
      { taskNo: 7, phase: "Close", subject: "Final report and roadmap", taskType: "Documentation", beginOnDay: 17, durationDays: 2, priority: "High", role: "Project Manager", dependsOnTaskNo: 6, weightPct: 14, deliverableFolder: "07_Training_Handover", description: "Final deliverables and roadmap" },
    ],
  },
  {
    code: "TPL-EXT-CLD-MIG",
    name: "Cloud Migration Template",
    services: ["CLD"],
    engagementTypes: ["MIG"],
    tasks: [
      { taskNo: 1, phase: "Initiation", subject: "Kickoff and migration planning", taskType: "Documentation", beginOnDay: 1, durationDays: 2, priority: "High", role: "Project Manager", dependsOnTaskNo: null, weightPct: 8, deliverableFolder: "01_Admin", description: "Initiation and migration governance" },
      { taskNo: 2, phase: "Discovery", subject: "Discovery and inventory", taskType: "Assessment", beginOnDay: 1, durationDays: 5, priority: "High", role: "Cloud Consultant", dependsOnTaskNo: 1, weightPct: 12, deliverableFolder: "03_Planning", description: "Users, data, workloads, dependencies" },
      { taskNo: 3, phase: "Design", subject: "Target state design", taskType: "Documentation", beginOnDay: 5, durationDays: 4, priority: "High", role: "Solution Architect", dependsOnTaskNo: 2, weightPct: 12, deliverableFolder: "04_Design", description: "Architecture and landing zone" },
      { taskNo: 4, phase: "Pilot", subject: "Pilot migration", taskType: "Implementation", beginOnDay: 9, durationDays: 4, priority: "High", role: "Engineer", dependsOnTaskNo: 3, weightPct: 12, deliverableFolder: "05_Delivery", description: "Pilot users or workloads" },
      { taskNo: 5, phase: "Remediate", subject: "Remediation and tuning", taskType: "Implementation", beginOnDay: 13, durationDays: 3, priority: "Medium", role: "Engineer", dependsOnTaskNo: 4, weightPct: 8, deliverableFolder: "05_Delivery", description: "Fix issues before main move" },
      { taskNo: 6, phase: "Migrate", subject: "Production migration", taskType: "Implementation", beginOnDay: 16, durationDays: 5, priority: "High", role: "Engineer", dependsOnTaskNo: 5, weightPct: 20, deliverableFolder: "05_Delivery", description: "Main migration wave" },
      { taskNo: 7, phase: "Validate", subject: "Validation and cutover", taskType: "Assessment", beginOnDay: 21, durationDays: 3, priority: "High", role: "QA / Consultant", dependsOnTaskNo: 6, weightPct: 14, deliverableFolder: "06_Testing", description: "Validation and sign-off" },
      { taskNo: 8, phase: "Close", subject: "Handover and SOPs", taskType: "Documentation", beginOnDay: 24, durationDays: 3, priority: "Medium", role: "Support Lead", dependsOnTaskNo: 7, weightPct: 14, deliverableFolder: "07_Training_Handover", description: "Operational documents and knowledge transfer" },
    ],
  },
  {
    code: "TPL-EXT-ERP-IMP",
    name: "ERP Implementation Template",
    services: ["ERP"],
    engagementTypes: ["IMP"],
    tasks: [
      { taskNo: 1, phase: "Initiation", subject: "Kickoff and scope baseline", taskType: "Documentation", beginOnDay: 1, durationDays: 2, priority: "High", role: "Project Manager", dependsOnTaskNo: null, weightPct: 5, deliverableFolder: "01_Admin", description: "Project start and delivery controls" },
      { taskNo: 2, phase: "Discovery", subject: "Business process discovery", taskType: "Assessment", beginOnDay: 1, durationDays: 5, priority: "High", role: "Business Analyst", dependsOnTaskNo: 1, weightPct: 12, deliverableFolder: "03_Planning", description: "Current state mapping and requirements" },
      { taskNo: 3, phase: "Design", subject: "Solution design and workflows", taskType: "Documentation", beginOnDay: 6, durationDays: 5, priority: "High", role: "Solution Architect", dependsOnTaskNo: 2, weightPct: 12, deliverableFolder: "04_Design", description: "To-be processes and design decisions" },
      { taskNo: 4, phase: "Data", subject: "Master data preparation", taskType: "Documentation", beginOnDay: 8, durationDays: 5, priority: "Medium", role: "Data Lead", dependsOnTaskNo: 2, weightPct: 10, deliverableFolder: "05_Delivery", description: "Data templates and cleansing" },
      { taskNo: 5, phase: "Configuration", subject: "System configuration", taskType: "Implementation", beginOnDay: 11, durationDays: 8, priority: "High", role: "ERP Consultant", dependsOnTaskNo: 3, weightPct: 18, deliverableFolder: "05_Delivery", description: "Core setup and customizations" },
      { taskNo: 6, phase: "Development", subject: "Forms, reports and automations", taskType: "Development", beginOnDay: 15, durationDays: 6, priority: "High", role: "Developer", dependsOnTaskNo: 5, weightPct: 10, deliverableFolder: "05_Delivery", description: "Custom forms, scripts, reports and automations" },
      { taskNo: 7, phase: "Data", subject: "Data migration", taskType: "Implementation", beginOnDay: 19, durationDays: 4, priority: "High", role: "Data Lead", dependsOnTaskNo: 4, weightPct: 10, deliverableFolder: "05_Delivery", description: "Master and transactional data" },
      { taskNo: 8, phase: "Testing", subject: "UAT", taskType: "Assessment", beginOnDay: 23, durationDays: 5, priority: "High", role: "Project Manager", dependsOnTaskNo: 5, weightPct: 12, deliverableFolder: "06_Testing", description: "Testing and issue closure" },
      { taskNo: 9, phase: "Enablement", subject: "Training and SOP", taskType: "User Training", beginOnDay: 26, durationDays: 4, priority: "Medium", role: "Trainer", dependsOnTaskNo: 8, weightPct: 5, deliverableFolder: "07_Training_Handover", description: "User training and operational SOP" },
      { taskNo: 10, phase: "Go-live", subject: "Go-live and hypercare", taskType: "Support", beginOnDay: 30, durationDays: 5, priority: "High", role: "Support Lead", dependsOnTaskNo: 9, weightPct: 6, deliverableFolder: "08_Operations", description: "Launch and support" },
    ],
  },
  {
    code: "TPL-EXT-WEB-APP",
    name: "Web/App Delivery Template",
    services: ["WEB"],
    engagementTypes: ["IMP", "PRJ"],
    tasks: [
      { taskNo: 1, phase: "Initiation", subject: "Kickoff and brief", taskType: "Documentation", beginOnDay: 1, durationDays: 2, priority: "High", role: "Project Manager", dependsOnTaskNo: null, weightPct: 8, deliverableFolder: "01_Admin", description: "Objectives, scope, stakeholders" },
      { taskNo: 2, phase: "Discovery", subject: "Discovery and content inputs", taskType: "Assessment", beginOnDay: 1, durationDays: 4, priority: "High", role: "Business Analyst", dependsOnTaskNo: 1, weightPct: 10, deliverableFolder: "03_Planning", description: "Requirements, content and assets" },
      { taskNo: 3, phase: "Design", subject: "IA / UX / wireframes", taskType: "Documentation", beginOnDay: 5, durationDays: 4, priority: "High", role: "UX Lead", dependsOnTaskNo: 2, weightPct: 12, deliverableFolder: "04_Design", description: "Structure and user journeys" },
      { taskNo: 4, phase: "Design", subject: "Creative design", taskType: "Development", beginOnDay: 8, durationDays: 5, priority: "High", role: "Designer", dependsOnTaskNo: 3, weightPct: 15, deliverableFolder: "04_Design", description: "UI design" },
      { taskNo: 5, phase: "Build", subject: "Development build", taskType: "Development", beginOnDay: 13, durationDays: 8, priority: "High", role: "Developer", dependsOnTaskNo: 4, weightPct: 20, deliverableFolder: "05_Delivery", description: "CMS/app build" },
      { taskNo: 6, phase: "Content", subject: "Content population", taskType: "Documentation", beginOnDay: 18, durationDays: 4, priority: "Medium", role: "Content Lead", dependsOnTaskNo: 5, weightPct: 8, deliverableFolder: "05_Delivery", description: "Content and media load" },
      { taskNo: 7, phase: "Testing", subject: "QA / UAT", taskType: "Assessment", beginOnDay: 22, durationDays: 4, priority: "High", role: "QA / Project Manager", dependsOnTaskNo: 6, weightPct: 12, deliverableFolder: "06_Testing", description: "Testing and issue closure" },
      { taskNo: 8, phase: "Launch", subject: "Launch and handover", taskType: "Implementation", beginOnDay: 26, durationDays: 2, priority: "High", role: "Project Manager", dependsOnTaskNo: 7, weightPct: 15, deliverableFolder: "07_Training_Handover", description: "Deployment and handover" },
    ],
  },
  {
    code: "TPL-EXT-MSP-MGT",
    name: "Managed Service / AMC Template",
    services: ["MSP"],
    engagementTypes: ["MGT", "SUP"],
    tasks: [
      { taskNo: 1, phase: "Initiation", subject: "Kickoff and scope", taskType: "Documentation", beginOnDay: 1, durationDays: 2, priority: "High", role: "Project Manager", dependsOnTaskNo: null, weightPct: 8, deliverableFolder: "01_Admin", description: "Onboarding control and scope" },
      { taskNo: 2, phase: "Discovery", subject: "Environment discovery", taskType: "Assessment", beginOnDay: 1, durationDays: 5, priority: "High", role: "MSP Lead", dependsOnTaskNo: 1, weightPct: 12, deliverableFolder: "03_Planning", description: "Current tools, devices, risks" },
      { taskNo: 3, phase: "Access", subject: "Access and credential baseline", taskType: "Documentation", beginOnDay: 3, durationDays: 4, priority: "High", role: "MSP Lead", dependsOnTaskNo: 1, weightPct: 10, deliverableFolder: "03_Planning", description: "Access validation and secure storage" },
      { taskNo: 4, phase: "Transition", subject: "Tool deployment / transition", taskType: "Implementation", beginOnDay: 6, durationDays: 6, priority: "High", role: "Engineer", dependsOnTaskNo: 2, weightPct: 18, deliverableFolder: "05_Delivery", description: "RMM, AV, backup, monitoring" },
      { taskNo: 5, phase: "Documentation", subject: "Documentation baseline", taskType: "Documentation", beginOnDay: 8, durationDays: 4, priority: "Medium", role: "Support Lead", dependsOnTaskNo: 2, weightPct: 12, deliverableFolder: "07_Training_Handover", description: "Asset list, SOP, support map" },
      { taskNo: 6, phase: "Service Desk", subject: "Service desk setup", taskType: "Implementation", beginOnDay: 12, durationDays: 2, priority: "Medium", role: "Support Lead", dependsOnTaskNo: 4, weightPct: 10, deliverableFolder: "08_Operations", description: "Queues, contacts, SLAs, escalation rules" },
      { taskNo: 7, phase: "Handover", subject: "Knowledge transfer and handover", taskType: "User Training", beginOnDay: 14, durationDays: 2, priority: "Medium", role: "Support Lead", dependsOnTaskNo: 5, weightPct: 10, deliverableFolder: "07_Training_Handover", description: "Internal and client knowledge transfer" },
      { taskNo: 8, phase: "Operate", subject: "Steady-state handoff", taskType: "Support", beginOnDay: 16, durationDays: 3, priority: "Medium", role: "Service Manager", dependsOnTaskNo: 7, weightPct: 10, deliverableFolder: "08_Operations", description: "Transition to BAU" },
      { taskNo: 9, phase: "Review", subject: "First service review", taskType: "Review", beginOnDay: 19, durationDays: 1, priority: "Medium", role: "Service Manager", dependsOnTaskNo: 8, weightPct: 10, deliverableFolder: "08_Operations", description: "First review and improvement backlog" },
    ],
  },
  {
    code: "TPL-INT-TRANSFORMATION",
    name: "Internal Transformation Template",
    services: ["OPS", "ERP"],
    engagementTypes: ["OPT", "PRJ"],
    tasks: [
      { taskNo: 1, phase: "Initiation", subject: "Initiation and sponsor alignment", taskType: "Documentation", beginOnDay: 1, durationDays: 2, priority: "High", role: "Sponsor / PM", dependsOnTaskNo: null, weightPct: 10, deliverableFolder: "01_Admin", description: "Internal program setup and approval" },
      { taskNo: 2, phase: "Discovery", subject: "Current state review", taskType: "Assessment", beginOnDay: 1, durationDays: 4, priority: "High", role: "Business Analyst", dependsOnTaskNo: 1, weightPct: 15, deliverableFolder: "03_Planning", description: "Pain points and process map" },
      { taskNo: 3, phase: "Design", subject: "Future state design", taskType: "Documentation", beginOnDay: 5, durationDays: 4, priority: "High", role: "Solution Lead", dependsOnTaskNo: 2, weightPct: 15, deliverableFolder: "04_Design", description: "Target processes and controls" },
      { taskNo: 4, phase: "Build", subject: "Build / configure", taskType: "Implementation", beginOnDay: 9, durationDays: 6, priority: "High", role: "Owner Team", dependsOnTaskNo: 3, weightPct: 25, deliverableFolder: "05_Delivery", description: "Implement improvements" },
      { taskNo: 5, phase: "Validate", subject: "Pilot / internal UAT", taskType: "Assessment", beginOnDay: 15, durationDays: 4, priority: "Medium", role: "Process Owner", dependsOnTaskNo: 4, weightPct: 12, deliverableFolder: "06_Testing", description: "Validation" },
      { taskNo: 6, phase: "Rollout", subject: "Rollout and adoption", taskType: "User Training", beginOnDay: 18, durationDays: 3, priority: "Medium", role: "Change Lead", dependsOnTaskNo: 5, weightPct: 15, deliverableFolder: "07_Training_Handover", description: "Process rollout and adoption" },
      { taskNo: 7, phase: "Close", subject: "Closure and lessons learned", taskType: "Documentation", beginOnDay: 21, durationDays: 2, priority: "Low", role: "PMO", dependsOnTaskNo: 6, weightPct: 8, deliverableFolder: "99_Archive", description: "Closeout" },
    ],
  },
  {
    code: "TPL-INT-MKT-CAMPAIGN",
    name: "Marketing Campaign Template",
    services: ["MKT"],
    engagementTypes: ["CAM"],
    tasks: [
      { taskNo: 1, phase: "Plan", subject: "Campaign brief", taskType: "Documentation", beginOnDay: 1, durationDays: 1, priority: "High", role: "Marketing Lead", dependsOnTaskNo: null, weightPct: 10, deliverableFolder: "01_Admin", description: "Objectives, audience, channels" },
      { taskNo: 2, phase: "Plan", subject: "Creative plan", taskType: "Documentation", beginOnDay: 1, durationDays: 2, priority: "High", role: "Marketing Lead", dependsOnTaskNo: 1, weightPct: 10, deliverableFolder: "03_Planning", description: "Assets and messaging" },
      { taskNo: 3, phase: "Build", subject: "Content production", taskType: "Development", beginOnDay: 2, durationDays: 5, priority: "High", role: "Content Owner", dependsOnTaskNo: 2, weightPct: 25, deliverableFolder: "05_Delivery", description: "Content creation" },
      { taskNo: 4, phase: "Build", subject: "Channel setup", taskType: "Implementation", beginOnDay: 4, durationDays: 3, priority: "Medium", role: "Marketing Ops", dependsOnTaskNo: 1, weightPct: 15, deliverableFolder: "05_Delivery", description: "Ads, landing pages, UTM, lists" },
      { taskNo: 5, phase: "Launch", subject: "Launch", taskType: "Milestone", beginOnDay: 7, durationDays: 1, priority: "High", role: "Marketing Lead", dependsOnTaskNo: 3, weightPct: 10, deliverableFolder: "05_Delivery", description: "Go live" },
      { taskNo: 6, phase: "Optimise", subject: "Performance review and optimisation", taskType: "Assessment", beginOnDay: 8, durationDays: 5, priority: "Medium", role: "Marketing Ops", dependsOnTaskNo: 5, weightPct: 20, deliverableFolder: "08_Operations", description: "Review and optimise" },
      { taskNo: 7, phase: "Close", subject: "Wrap-up report", taskType: "Documentation", beginOnDay: 13, durationDays: 2, priority: "Low", role: "Marketing Lead", dependsOnTaskNo: 6, weightPct: 10, deliverableFolder: "99_Archive", description: "Results and learnings" },
    ],
  },
  {
    // Checked last: matches any service, so more specific templates above must be
    // checked first or this would steal their POC/AUD/PRJ combos.
    code: "TPL-PRESALES-PROPOSAL-DISCOVERY",
    name: "Proposal / Discovery Template",
    services: "MULTI",
    engagementTypes: ["POC", "AUD", "PRJ"],
    tasks: [
      { taskNo: 1, phase: "Qualification", subject: "Opportunity qualification", taskType: "Assessment", beginOnDay: 1, durationDays: 1, priority: "High", role: "Sales Lead", dependsOnTaskNo: null, weightPct: 10, deliverableFolder: "01_Qualification", description: "Confirm client, opportunity, decision owner, budget, and fit" },
      { taskNo: 2, phase: "Qualification", subject: "Go / no-go decision", taskType: "Approval", beginOnDay: 1, durationDays: 1, priority: "High", role: "Sales Lead / Sponsor", dependsOnTaskNo: 1, weightPct: 8, deliverableFolder: "01_Qualification", description: "Approve whether to invest in proposal/discovery work" },
      { taskNo: 3, phase: "Discovery", subject: "Discovery workshop", taskType: "Assessment", beginOnDay: 2, durationDays: 2, priority: "High", role: "Solution Lead", dependsOnTaskNo: 2, weightPct: 12, deliverableFolder: "02_Discovery", description: "Capture requirements, stakeholders, outcomes and constraints" },
      { taskNo: 4, phase: "Discovery", subject: "Requirements and success criteria", taskType: "Documentation", beginOnDay: 3, durationDays: 2, priority: "High", role: "Business Analyst", dependsOnTaskNo: 3, weightPct: 15, deliverableFolder: "02_Discovery", description: "Document scope, assumptions, acceptance measures and risks" },
      { taskNo: 5, phase: "Solution", subject: "Solution outline and options", taskType: "Documentation", beginOnDay: 5, durationDays: 2, priority: "High", role: "Solution Architect", dependsOnTaskNo: 4, weightPct: 15, deliverableFolder: "03_Proposal", description: "Prepare solution approach, architecture and delivery options" },
      { taskNo: 6, phase: "Estimate", subject: "Estimate, assumptions and risks", taskType: "Planning", beginOnDay: 6, durationDays: 2, priority: "High", role: "Delivery Lead", dependsOnTaskNo: 5, weightPct: 12, deliverableFolder: "03_Proposal", description: "Estimate effort, roles, dependencies, exclusions and risk assumptions" },
      { taskNo: 7, phase: "Proposal", subject: "Proposal draft", taskType: "Documentation", beginOnDay: 7, durationDays: 3, priority: "High", role: "Proposal Lead", dependsOnTaskNo: 6, weightPct: 12, deliverableFolder: "03_Proposal", description: "Prepare proposal/RFP response, SoW draft or discovery outcome" },
      { taskNo: 8, phase: "Approval", subject: "Internal review and pricing approval", taskType: "Approval", beginOnDay: 10, durationDays: 2, priority: "High", role: "PMO / Sponsor", dependsOnTaskNo: 7, weightPct: 8, deliverableFolder: "03_Proposal", description: "Review scope, pricing, risk, legal and delivery feasibility" },
      { taskNo: 9, phase: "Client", subject: "Client submission / presentation", taskType: "Milestone", beginOnDay: 12, durationDays: 1, priority: "High", role: "Sales Lead", dependsOnTaskNo: 8, weightPct: 5, deliverableFolder: "04_Submission", description: "Submit proposal or present recommendation" },
      { taskNo: 10, phase: "Closure", subject: "Outcome update and close/convert", taskType: "Closure", beginOnDay: 13, durationDays: 1, priority: "Medium", role: "Portfolio Manager", dependsOnTaskNo: 9, weightPct: 3, deliverableFolder: "99_Archive", description: "Update portfolio as Approved, Not Approved, Lost, On Hold or convert to project" },
    ],
  },
];

/** Matches a project's Service + EngagementType against the curated template list. */
export function matchProjectTemplate(service: string, engagementType: string): ProjectTemplate | null {
  return (
    PROJECT_TEMPLATES.find((t) => {
      const serviceMatches = t.services === "MULTI" || t.services.includes(service);
      return serviceMatches && t.engagementTypes.includes(engagementType);
    }) ?? null
  );
}
