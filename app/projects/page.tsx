// /app/projects/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useUpdateProject } from "../hooks/projects/useUpdateProject";
import { useDeleteProject } from "../hooks/projects/useDeleteProject";
import { Project } from "./types";
import KanbanBoard from "./components/KanbanBoard";
import CreateProjectModal from "./components/CreateProjectModal";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const { updateProject } = useUpdateProject();
  const { deleteProject } = useDeleteProject();

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const json = await res.json();
      setProjects(json);
    } catch (err) {
      console.error(err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleStatusChange(
    projectId: string,
    newStatus: Project["status"]
  ) {
    // optimistic update locally
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status: newStatus } : p))
    );

    const res = await updateProject(projectId, { status: newStatus });
    if (!res.success) {
      // rollback if failed
      await load();
      alert(res.error);
    } else {
      // ensure server timestamp/state synced (optional)
      // replace project with updated response
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? res.project : p))
      );
    }
  }

  async function handleDelete(projectId: string) {
    const ok = confirm("¿Eliminar proyecto?");
    if (!ok) return;

    const res = await deleteProject(projectId);
    if (res.success) {
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } else {
      alert(res.error);
    }
  }

  async function handleCreated() {
    // after create, fetch the created project (or refetch all)
    // simplest: re-fetch all
    await load();
  }

  if (loading) {
    return <div className="p-6">Cargando proyectos...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Proyectos</h1>
        <div className="flex items-center gap-3">
          <button className="px-3 py-2 rounded border" onClick={() => load()}>
            Refrescar
          </button>
          <button
            className="px-3 py-2 bg-blue-600 text-white rounded"
            onClick={() => setShowCreate(true)}
          >
            Crear proyecto
          </button>
        </div>
      </div>

      <KanbanBoard
        projects={projects}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />

      <CreateProjectModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
