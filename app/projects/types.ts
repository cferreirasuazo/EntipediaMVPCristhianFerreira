// /types/projects.ts
export type ProjectStatus =
  | "BACKLOG"
  | "TODO"
  | "IN_PROGRESS"
  | "REVIEW"
  | "DONE";
export type ProjectPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  created_at: string; // ISO string
};

export type ProjectFormValues = {
  name: string;
  description: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
};
