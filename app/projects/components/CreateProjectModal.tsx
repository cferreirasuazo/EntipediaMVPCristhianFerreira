// /components/CreateProjectModal.tsx
"use client";

import { useCreateProject } from "@/app/hooks/projects/useCreateProject";
import { useState } from "react";
import { ProjectFormValues } from "../types";
import { PROJECT_PRIORITIES, PROJECT_STATUSES } from "@/lib/constants";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (projectId: string) => void; // allow parent to insert the created project
};

export default function CreateProjectModal({
  open,
  onClose,
  onCreated,
}: Props) {
  const [form, setForm] = useState<ProjectFormValues>({
    name: "",
    description: "",
    status: "BACKLOG",
    priority: "MEDIUM",
  });

  const { createProject, loading, error } = useCreateProject();

  if (!open) return null;

  function handleChange<T extends keyof ProjectFormValues>(
    key: T,
    value: ProjectFormValues[T]
  ) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  async function handleSave() {
    const res = await createProject(form);
    if (res.success) {
      onCreated(res.project.id);
      onClose();
      // reset form
      setForm({
        name: "",
        description: "",
        status: "BACKLOG",
        priority: "MEDIUM",
      });
    } else {
      // error state is handled by hook; optionally show toast
      alert(res.error);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow max-w-lg w-full p-6">
        <h3 className="text-lg font-semibold mb-4">Crear proyecto</h3>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Nombre del proyecto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Descripción
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full border rounded px-3 py-2"
              rows={3}
              placeholder="Descripción"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Estatus</label>
              <select
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value as any)}
                className="w-full border rounded px-3 py-2"
              >
                {PROJECT_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Prioridad
              </label>
              <select
                value={form.priority}
                onChange={(e) =>
                  handleChange("priority", e.target.value as any)
                }
                className="w-full border rounded px-3 py-2"
              >
                {PROJECT_PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
