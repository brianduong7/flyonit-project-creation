import type { TaskDefinition } from "./templates";

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** BeginOnDay/DurationDays are 1-based offsets from the project start date. */
export function scheduleTask(
  projectStart: Date,
  task: Pick<TaskDefinition, "beginOnDay" | "durationDays">
): { expStartDate: string; expEndDate: string } {
  const start = addDays(projectStart, task.beginOnDay - 1);
  const end = addDays(start, task.durationDays - 1);
  return { expStartDate: formatDate(start), expEndDate: formatDate(end) };
}
