// /hooks/useDeleteProject.ts
"use client";

import { useState } from "react";

export function useDeleteProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function deleteProject(
    id: string
  ): Promise<{ success: true } | { success: false; error: string }> {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        const msg = json?.error ?? "Error borrando proyecto";
        setError(msg);
        return { success: false, error: msg };
      }
      return { success: true };
    } catch (err: any) {
      const msg = err?.message ?? "Network error";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }

  return { deleteProject, loading, error };
}
