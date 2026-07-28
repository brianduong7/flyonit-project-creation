function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * CSV templates have no BeginOnDay/DurationDays. Schedule sequentially:
 * task at index 0 starts on project start day, each following task +1 day, duration 1.
 */
export function scheduleTaskSequential(
  projectStart: Date,
  index: number
): { expStartDate: string; expEndDate: string } {
  const start = addDays(projectStart, index);
  return { expStartDate: formatDate(start), expEndDate: formatDate(start) };
}
