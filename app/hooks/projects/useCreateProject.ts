// /hooks/useCreateProject.ts
"use client";

import { Project, ProjectFormValues } from "@/app/projects/types";
import { useState } from "react";

export function useCreateProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createProject(
    form: ProjectFormValues
  ): Promise<
    { success: true; project: Project } | { success: false; error: string }
  > {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        const msg = json?.error ?? "Error creando proyecto";
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

  return { createProject, loading, error };
}
