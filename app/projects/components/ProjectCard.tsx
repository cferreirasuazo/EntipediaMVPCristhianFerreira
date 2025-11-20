// /components/ProjectCard.tsx
"use client";

import { Project } from "../types";

type Props = {
  project: Project;
  onDelete: (id: string) => void;
};

export default function ProjectCard({ project, onDelete }: Props) {
  return (
    <div className="bg-white border rounded-md shadow-sm p-3">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h4 className="font-medium">{project.name}</h4>
          <p className="text-sm text-gray-600 mt-1">{project.description}</p>
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-500 space-y-1">
        <div>
          <span className="font-medium">Estatus: </span>
          <span>{project.status}</span>
        </div>
        <div>
          <span className="font-medium">Prioridad: </span>
          <span>{project.priority}</span>
        </div>
        <div>
          <span className="font-medium">Creado: </span>
          <span>{new Date(project.created_at).toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          data-no-dnd
          onClick={(e) => {
            e.stopPropagation();
            onDelete(project.id);
          }}
          className="text-red-600 text-sm hover:underline"
        >
          <span data-no-dnd>Eliminar</span>
        </button>
      </div>
    </div>
  );
}
