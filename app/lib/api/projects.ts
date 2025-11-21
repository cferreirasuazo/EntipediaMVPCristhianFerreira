import { ProjectFormValues } from "@/app/projects/types";

export async function createProject(payload: ProjectFormValues) {
  const res = await fetch("/api/projects", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to create project");
  }

  return res.json();
}
