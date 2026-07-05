import { readFile, writeFile } from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "projects.json");

export type ProjectRecord = {
  projectCode: string;
  displayName: string;
  clientOrDeptCode: string;
  clientOrDeptName: string;
  region: string;
  service: string;
  engagementType: string;
  sequence: number;
  scopeTitle: string;
  erpNextProjectType: string;
  sharePointPath: string;
  createdAt: string;
  /** ERPNext's own internal document id (e.g. PROJ-0007), returned after a successful create. */
  erpNextName?: string;
};

export async function listProjects(): Promise<ProjectRecord[]> {
  const raw = await readFile(DATA_FILE, "utf-8");
  const records = JSON.parse(raw) as ProjectRecord[];
  return records.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

/** Sequence increments per ClientOrDeptCode only, regardless of region/service/engagement type. */
export async function getNextSequence(clientOrDeptCode: string): Promise<number> {
  const records = await listProjects();
  const highest = records
    .filter((r) => r.clientOrDeptCode === clientOrDeptCode)
    .reduce((max, r) => Math.max(max, r.sequence), 0);
  return highest + 1;
}

export async function projectCodeExists(projectCode: string): Promise<boolean> {
  const records = await listProjects();
  return records.some((r) => r.projectCode === projectCode);
}

export async function addProject(record: ProjectRecord): Promise<void> {
  const records = await listProjects();
  records.push(record);
  await writeFile(DATA_FILE, JSON.stringify(records, null, 2), "utf-8");
}
