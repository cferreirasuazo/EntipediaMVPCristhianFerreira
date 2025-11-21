// /hooks/useUpdateProject.ts
"use client";

import { Project, ProjectFormValues } from "@/app/projects/types";
import { useState } from "react";

export function useUpdateProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateProject(
    id: string,
    data: Partial<ProjectFormValues>
  ): Promise<
    { success: true; project: Project } | { success: false; error: string }
  > {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        const msg = json?.error ?? "Error actualizando proyecto";
        setError(msg);
        return { success: false, error: msg };
      }
      return { success: true, project: json };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = err?.message ?? "Network error";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }

  return { updateProject, loading, error };
}
