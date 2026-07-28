// Source: Project Template.csv — ERPNext Project Template → Task subjects.
// Regenerated from the CSV; subjects only (no phase/duration/deps in source).

export type TaskDefinition = {
  subject: string;
  /** ERPNext Task / template task id from the CSV (informational). */
  sourceTaskId: string;
};

export type ProjectTemplate = {
  /** Display name from the CSV "Project Template" column — also used as the form value. */
  name: string;
  tasks: TaskDefinition[];
};

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    name: "HR Work Template",
    tasks: [
      { sourceTaskId: "TASK-2026-01402", subject: "Screen Candidates" },
      { sourceTaskId: "TASK-2026-01403", subject: "Interview" },
      { sourceTaskId: "TASK-2026-01404", subject: "Onboarding" },
      { sourceTaskId: "TASK-2026-01405", subject: "Document Submission" },
    ],
  },
  {
    name: "D365 Cloud Migration Template",
    tasks: [
      { sourceTaskId: "TPL-EXT-CLD-MIG-D365-0001", subject: "Kickoff & Scope Finalization" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-D365-0002", subject: "Environment Provisioning" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-D365-0003", subject: "Identity & Security Model" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-D365-0004", subject: "Core Data Model" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-D365-0005", subject: "Forms, Views & Dashboard Skeleton" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-D365-0006", subject: "Business Rules & Assignment Logic" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-D365-0007", subject: "Phase 1 UAT" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-D365-0008", subject: "Server-Side Sync for Outlook" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-D365-0009", subject: "Deploy Dynamics 365 App for Outlook" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-D365-0010", subject: "Teams Collaboration Setup" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-D365-0011", subject: "SharePoint Server-Based Integration" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-D365-0012", subject: "SharePoint Site & Library Build" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-D365-0013", subject: "Folder Structure & Document Governance" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-D365-0014", subject: "Phase 2 UAT" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-D365-0015", subject: "Enable Sales Accelerator" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-D365-0016", subject: "Design Sequences" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-D365-0017", subject: "Work Assignment Rules" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-D365-0018", subject: "Power Automate Flow 1 - Lead Triage" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-D365-0019", subject: "Power Automate Flow 2 - Opportunity Stage" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-D365-0020", subject: "Power Automate Flow 3 - Stale Pipeline" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-D365-0021", subject: "Phase 3 UAT" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-D365-0022", subject: "LinkedIn Sales Navigator Integration" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-D365-0023", subject: "Apollo Integration Pilot" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-D365-0024", subject: "Kaseya PSP Lead Ingestion" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-D365-0025", subject: "Reporting & Dashboard Build" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-D365-0026", subject: "Data Cleanup & Cutover Prep" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-D365-0027", subject: "Training & Sales Playbook Rollout" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-D365-0028", subject: "Go-Live & Hypercare" },
    ],
  },
  {
    name: "Marketing Campaign Template",
    tasks: [
      { sourceTaskId: "TPL-INT-MKT-CAMPAIGN-0001", subject: "Campaign brief" },
      { sourceTaskId: "TPL-INT-MKT-CAMPAIGN-0002", subject: "Creative plan" },
      { sourceTaskId: "TPL-INT-MKT-CAMPAIGN-0003", subject: "Content production" },
      { sourceTaskId: "TPL-INT-MKT-CAMPAIGN-0004", subject: "Channel setup" },
      { sourceTaskId: "TPL-INT-MKT-CAMPAIGN-0005", subject: "Launch" },
      { sourceTaskId: "TPL-INT-MKT-CAMPAIGN-0006", subject: "Performance review and optimisation" },
      { sourceTaskId: "TPL-INT-MKT-CAMPAIGN-0007", subject: "Wrap-up report" },
    ],
  },
  {
    name: "Internal Transformation Template",
    tasks: [
      { sourceTaskId: "TPL-INT-TRANSFORMATION-001", subject: "Initiation and sponsor alignment" },
      { sourceTaskId: "TPL-INT-TRANSFORMATION-002", subject: "Current state review" },
      { sourceTaskId: "TPL-INT-TRANSFORMATION-003", subject: "Future state design" },
      { sourceTaskId: "TPL-INT-TRANSFORMATION-004", subject: "Build / configure" },
      { sourceTaskId: "TPL-INT-TRANSFORMATION-005", subject: "Pilot / internal UAT" },
      { sourceTaskId: "TPL-INT-TRANSFORMATION-006", subject: "Rollout and adoption" },
      { sourceTaskId: "TPL-INT-TRANSFORMATION-007", subject: "Closure and lessons learned" },
    ],
  },
  {
    name: "Managed Service / AMC Template",
    tasks: [
      { sourceTaskId: "TPL-EXT-MSP-MGT-0001", subject: "Kickoff and scope" },
      { sourceTaskId: "TPL-EXT-MSP-MGT-0002", subject: "Environment discovery" },
      { sourceTaskId: "TPL-EXT-MSP-MGT-0003", subject: "Access and credential baseline" },
      { sourceTaskId: "TPL-EXT-MSP-MGT-0004", subject: "Tool deployment / transition" },
      { sourceTaskId: "TPL-EXT-MSP-MGT-0005", subject: "Documentation baseline" },
      { sourceTaskId: "TPL-EXT-MSP-MGT-0006", subject: "Service desk setup" },
      { sourceTaskId: "TPL-EXT-MSP-MGT-0007", subject: "Knowledge transfer and handover" },
      { sourceTaskId: "TPL-EXT-MSP-MGT-0008", subject: "Steady-state handoff" },
      { sourceTaskId: "TPL-EXT-MSP-MGT-0009", subject: "First service review" },
    ],
  },
  {
    name: "Web/App Delivery Template",
    tasks: [
      { sourceTaskId: "TPL-EXT-WEB-APP-0001", subject: "Kickoff and brief" },
      { sourceTaskId: "TPL-EXT-WEB-APP-0002", subject: "Discovery and content inputs" },
      { sourceTaskId: "TPL-EXT-WEB-APP-0003", subject: "IA / UX / wireframes" },
      { sourceTaskId: "TPL-EXT-WEB-APP-0004", subject: "Creative design" },
      { sourceTaskId: "TPL-EXT-WEB-APP-0005", subject: "Development build" },
      { sourceTaskId: "TPL-EXT-WEB-APP-0006", subject: "Content population" },
      { sourceTaskId: "TPL-EXT-WEB-APP-0007", subject: "QA / UAT" },
      { sourceTaskId: "TPL-EXT-WEB-APP-0008", subject: "Launch and handover" },
    ],
  },
  {
    name: "ERP Implementation Template",
    tasks: [
      { sourceTaskId: "TPL-EXT-ERP-IMP-0001", subject: "Kickoff and scope baseline" },
      { sourceTaskId: "TPL-EXT-ERP-IMP-0002", subject: "Business process discovery" },
      { sourceTaskId: "TPL-EXT-ERP-IMP-0003", subject: "Solution design and workflows" },
      { sourceTaskId: "TPL-EXT-ERP-IMP-0004", subject: "Master data preparation" },
      { sourceTaskId: "TPL-EXT-ERP-IMP-0005", subject: "System configuration" },
      { sourceTaskId: "TPL-EXT-ERP-IMP-0006", subject: "Forms, reports and automations" },
      { sourceTaskId: "TPL-EXT-ERP-IMP-0007", subject: "Data migration" },
      { sourceTaskId: "TPL-EXT-ERP-IMP-0008", subject: "UAT" },
      { sourceTaskId: "TPL-EXT-ERP-IMP-0009", subject: "Training and SOP" },
      { sourceTaskId: "TPL-EXT-ERP-IMP-0010", subject: "Go-live and hypercare" },
    ],
  },
  {
    name: "Cloud Migration Template",
    tasks: [
      { sourceTaskId: "TPL-EXT-CLD-MIG-0001", subject: "Kickoff and migration planning" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-0002", subject: "Discovery and inventory" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-0003", subject: "Target state design" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-0004", subject: "Pilot migration" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-0005", subject: "Remediation and tuning" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-0006", subject: "Production migration" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-0007", subject: "Validation and cutover" },
      { sourceTaskId: "TPL-EXT-CLD-MIG-0008", subject: "Handover and SOPs" },
    ],
  },
  {
    name: "AI Implementation Template",
    tasks: [
      { sourceTaskId: "TPL-EXT-AI-IMP-0001", subject: "Kickoff and governance setup" },
      { sourceTaskId: "TPL-EXT-AI-IMP-0002", subject: "Discovery workshop" },
      { sourceTaskId: "TPL-EXT-AI-IMP-0003", subject: "Current state assessment" },
      { sourceTaskId: "TPL-EXT-AI-IMP-0004", subject: "Solution design" },
      { sourceTaskId: "TPL-EXT-AI-IMP-0005", subject: "Build and configuration" },
      { sourceTaskId: "TPL-EXT-AI-IMP-0006", subject: "Pilot / POC" },
      { sourceTaskId: "TPL-EXT-AI-IMP-0007", subject: "UAT and remediation" },
      { sourceTaskId: "TPL-EXT-AI-IMP-0008", subject: "Training and adoption" },
      { sourceTaskId: "TPL-EXT-AI-IMP-0009", subject: "Go-live" },
      { sourceTaskId: "TPL-EXT-AI-IMP-0010", subject: "Handover and hypercare" },
    ],
  },
  {
    name: "Proposal / Discovery Template",
    tasks: [
      { sourceTaskId: "TPL-PRESALES-PROPOSAL-DISCOVERY-0001", subject: "Opportunity qualification" },
      { sourceTaskId: "TPL-PRESALES-PROPOSAL-DISCOVERY-0002", subject: "Go / no-go decision" },
      { sourceTaskId: "TPL-PRESALES-PROPOSAL-DISCOVERY-0003", subject: "Discovery workshop" },
      { sourceTaskId: "TPL-PRESALES-PROPOSAL-DISCOVERY-0004", subject: "Requirements and success criteria" },
      { sourceTaskId: "TPL-PRESALES-PROPOSAL-DISCOVERY-0005", subject: "Solution outline and options" },
      { sourceTaskId: "TPL-PRESALES-PROPOSAL-DISCOVERY-0006", subject: "Estimate, assumptions and risks" },
      { sourceTaskId: "TPL-PRESALES-PROPOSAL-DISCOVERY-0007", subject: "Proposal draft" },
      { sourceTaskId: "TPL-PRESALES-PROPOSAL-DISCOVERY-0008", subject: "Internal review and pricing approval" },
      { sourceTaskId: "TPL-PRESALES-PROPOSAL-DISCOVERY-0009", subject: "Client submission / presentation" },
      { sourceTaskId: "TPL-PRESALES-PROPOSAL-DISCOVERY-0010", subject: "Outcome update and close/convert" },
    ],
  },
  {
    name: "Marketing template",
    tasks: [
      { sourceTaskId: "TASK-2026-00529", subject: "Approve campaign scope and goals" },
      { sourceTaskId: "TASK-2026-00530", subject: "Confirm target ICP and account criteria" },
      { sourceTaskId: "TASK-2026-00531", subject: "Finalize offer and CTA" },
      { sourceTaskId: "TASK-2026-00532", subject: "Define F3/ERPNext source fields and routing" },
      { sourceTaskId: "TASK-2026-00533", subject: "Audit current landing page for conversion gaps" },
      { sourceTaskId: "TASK-2026-00534", subject: "Confirm tracking requirements (GA4/GTM/Ads/Meta)" },
      { sourceTaskId: "TASK-2026-00535", subject: "Rewrite hero section and above-the-fold copy" },
      { sourceTaskId: "TASK-2026-00536", subject: "Build benefits/comparison section" },
      { sourceTaskId: "TASK-2026-00537", subject: "Add process section (Assessment to Cutover)" },
      { sourceTaskId: "TASK-2026-00538", subject: "Add FAQ and objection-handling content" },
      { sourceTaskId: "TASK-2026-00539", subject: "Add proof/trust blocks" },
      { sourceTaskId: "TASK-2026-00540", subject: "Improve form fields and CTA placement" },
      { sourceTaskId: "TASK-2026-00541", subject: "Create Google Ads copy set by market" },
      { sourceTaskId: "TASK-2026-00542", subject: "Create LinkedIn content pack" },
      { sourceTaskId: "TASK-2026-00543", subject: "Create Apollo outbound sequence" },
      { sourceTaskId: "TASK-2026-00544", subject: "Create Meta retargeting creatives" },
      { sourceTaskId: "TASK-2026-00545", subject: "Create webinar topic and invite pack" },
      { sourceTaskId: "TASK-2026-00546", subject: "Publish updated landing page" },
      { sourceTaskId: "TASK-2026-00547", subject: "Launch Google Search campaigns" },
      { sourceTaskId: "TASK-2026-00548", subject: "Launch LinkedIn authority campaign" },
      { sourceTaskId: "TASK-2026-00549", subject: "Launch Apollo outbound wave 1" },
      { sourceTaskId: "TASK-2026-00550", subject: "Launch Meta retargeting" },
      { sourceTaskId: "TASK-2026-00551", subject: "Launch webinar promotion" },
      { sourceTaskId: "TASK-2026-00552", subject: "Daily lead review and assignment" },
      { sourceTaskId: "TASK-2026-00553", subject: "Same-business-day form follow-up" },
      { sourceTaskId: "TASK-2026-00554", subject: "Weekly Google Ads optimization" },
      { sourceTaskId: "TASK-2026-00555", subject: "Weekly landing page CRO review" },
      { sourceTaskId: "TASK-2026-00556", subject: "Weekly Apollo and outreach review" },
      { sourceTaskId: "TASK-2026-00557", subject: "Weekly channel performance report" },
      { sourceTaskId: "TASK-2026-00558", subject: "Convert qualified leads to opportunities" },
      { sourceTaskId: "TASK-2026-00559", subject: "Attach assessment notes and proposal inputs" },
      { sourceTaskId: "TASK-2026-00560", subject: "Run objection-handling follow-up sequence" },
      { sourceTaskId: "TASK-2026-00561", subject: "Weekly pipeline review meeting" },
      { sourceTaskId: "TASK-2026-00562", subject: "End-of-cycle review and template update" },
    ],
  },
  {
    name: "WordPress Performance Optimization",
    tasks: [
      { sourceTaskId: "TASK-2026-01187", subject: "Database and Code base full backup" },
      { sourceTaskId: "TASK-2026-00509", subject: "Make up-to-date WordPress Core, Themes and Plugins" },
      { sourceTaskId: "TASK-2026-00510", subject: "Disable unused Plugins, delete unused Plugins and Themes, use minimal Plugins" },
      { sourceTaskId: "TASK-2026-00511", subject: "Remove spam, deleted, and unapproved comments" },
      { sourceTaskId: "TASK-2026-00512", subject: "Enable Cache and configuration properly" },
      { sourceTaskId: "TASK-2026-00513", subject: "Used recommended PHP and MySQL version" },
      { sourceTaskId: "TASK-2026-00514", subject: "Enable recommended PHP Extensions" },
      { sourceTaskId: "TASK-2026-00515", subject: "Database Cleanup" },
      { sourceTaskId: "TASK-2026-00516", subject: "Use CDN" },
      { sourceTaskId: "TASK-2026-00517", subject: "Image optimization" },
      { sourceTaskId: "TASK-2026-00518", subject: "Minify and Optimize CSS and JavaScript files" },
      { sourceTaskId: "TASK-2026-00519", subject: "Use Compress components with gzip" },
      { sourceTaskId: "TASK-2026-00520", subject: "Check performance issue and fix them, online tools - Google PageSpeed Insights, GTmetrix, Pingdom" },
    ],
  },
  {
    name: "Standard Network Engineer Deployment",
    tasks: [
      { sourceTaskId: "TASK-2026-00266", subject: "Initial Cloud/Network Audit." },
      { sourceTaskId: "TASK-2026-00267", subject: "Environment Configuration (Azure/On-Prem)." },
      { sourceTaskId: "TASK-2026-00268", subject: "Security Patching & Compliance Check." },
      { sourceTaskId: "TASK-2026-00269", subject: "Backup & DR Implementation." },
      { sourceTaskId: "TASK-2026-00270", subject: "Final Handover & Documentation." },
    ],
  },
  {
    name: "Webinar Template",
    tasks: [
      { sourceTaskId: "TASK-2026-00083", subject: "Select webinar topic & target audience" },
      { sourceTaskId: "TASK-2026-00084", subject: "Confirm webinar date & time" },
      { sourceTaskId: "TASK-2026-00085", subject: "Create Teams Webinar" },
      { sourceTaskId: "TASK-2026-00086", subject: "Add internal & external presenters" },
      { sourceTaskId: "TASK-2026-00087", subject: "Configure webinar settings & recording" },
      { sourceTaskId: "TASK-2026-00088", subject: "Prepare webinar banner & logos" },
      { sourceTaskId: "TASK-2026-00089", subject: "Apply branding to webinar" },
      { sourceTaskId: "TASK-2026-00090", subject: "Share registration link" },
      { sourceTaskId: "TASK-2026-00091", subject: "Launch email & social campaign" },
      { sourceTaskId: "TASK-2026-00092", subject: "Prepare presentation" },
      { sourceTaskId: "TASK-2026-00093", subject: "Prepare demo" },
      { sourceTaskId: "TASK-2026-00094", subject: "Run live webinar" },
      { sourceTaskId: "TASK-2026-00095", subject: "Run attendee incentive / giveaway" },
      { sourceTaskId: "TASK-2026-00096", subject: "Save & archive recording" },
      { sourceTaskId: "TASK-2026-00097", subject: "Send follow-up email" },
      { sourceTaskId: "TASK-2026-00098", subject: "Reuse content for marketing" },
    ],
  },
];

/** Template names for the form dropdown (CSV order). */
export const PROJECT_TEMPLATE_NAMES = PROJECT_TEMPLATES.map((t) => t.name);

export function getProjectTemplateByName(name: string): ProjectTemplate | null {
  return PROJECT_TEMPLATES.find((t) => t.name === name) ?? null;
}

/**
 * Service + EngagementType → CSV template name.
 * MULTI matches any service; checked last so specific templates win.
 */
const SERVICE_ENGAGEMENT_MATCHES: {
  name: string;
  services: string[] | "MULTI";
  engagementTypes: string[];
}[] = [
  { name: "AI Implementation Template", services: ["AI"], engagementTypes: ["IMP", "POC"] },
  { name: "Cloud Migration Template", services: ["CLD"], engagementTypes: ["MIG"] },
  { name: "ERP Implementation Template", services: ["ERP"], engagementTypes: ["IMP"] },
  { name: "Web/App Delivery Template", services: ["WEB"], engagementTypes: ["IMP", "PRJ"] },
  { name: "Managed Service / AMC Template", services: ["MSP"], engagementTypes: ["MGT", "SUP"] },
  { name: "Internal Transformation Template", services: ["OPS", "ERP"], engagementTypes: ["OPT", "PRJ"] },
  { name: "Marketing Campaign Template", services: ["MKT"], engagementTypes: ["CAM"] },
  { name: "Standard Network Engineer Deployment", services: ["NET"], engagementTypes: ["IMP", "PRJ"] },
  // Checked last
  { name: "Proposal / Discovery Template", services: "MULTI", engagementTypes: ["POC", "AUD", "PRJ"] },
];

/** Matches Service + EngagementType to a CSV template (or null). */
export function matchProjectTemplate(service: string, engagementType: string): ProjectTemplate | null {
  const match = SERVICE_ENGAGEMENT_MATCHES.find((t) => {
    const serviceMatches = t.services === "MULTI" || t.services.includes(service);
    return serviceMatches && t.engagementTypes.includes(engagementType);
  });
  return match ? getProjectTemplateByName(match.name) : null;
}

/**
 * Union tasks from selected + service/engagement templates, deduped by subject
 * (case-insensitive). Selected-template order first, then matched extras.
 */
export function unionTemplateTasks(
  selected: ProjectTemplate | null,
  matched: ProjectTemplate | null
): { tasks: TaskDefinition[]; sources: string[] } {
  const sources: string[] = [];
  const seen = new Set<string>();
  const tasks: TaskDefinition[] = [];
  for (const tpl of [selected, matched]) {
    if (!tpl) continue;
    sources.push(tpl.name);
    for (const task of tpl.tasks) {
      const key = task.subject.trim().toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      tasks.push(task);
    }
  }
  return { tasks, sources };
}
