// /components/KanbanBoard.tsx
"use client";
import React from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  closestCenter,
} from "@dnd-kit/core";
import { Project, ProjectStatus } from "../types";
import { PROJECT_STATUSES } from "@/lib/constants";
import ProjectCard from "./ProjectCard";
import { useMemo } from "react";

type Props = {
  projects: Project[];
  onStatusChange: (
    projectId: string,
    newStatus: ProjectStatus
  ) => Promise<void>;
  onDelete: (projectId: string) => Promise<void> | void;
};

function DraggableProject({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x ?? 0}px, ${transform.y ?? 0}px, 0)`
      : undefined,
    opacity: isDragging ? 0.9 : 1,
    cursor: "grab",
  };

  // Filter out drag listeners if user clicked something with data-no-dnd
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-no-dnd]")) {
      // prevent starting the drag
      e.stopPropagation();
      return;
    }

    // otherwise allow dragging
    listeners?.onPointerDown?.(e);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      onPointerDown={handlePointerDown}
    >
      {children}
    </div>
  );
}

function Column({
  status,
  title,
  items,
  children,
}: {
  status: string;
  title: string;
  items: Project[];
  children?: React.ReactNode;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: status });
  return (
    <div
      ref={setNodeRef}
      className={`min-w-[260px] rounded-md p-3 bg-gray-50 border ${
        isOver ? "border-blue-300" : "border-transparent"
      }`}
    >
      <h4 className="font-semibold mb-2">
        {title} <span className="text-sm text-gray-500">({items.length})</span>
      </h4>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

export default function KanbanBoard({
  projects,
  onStatusChange,
  onDelete,
}: Props) {
  const sensors = useSensors(useSensor(PointerSensor));

  const grouped = useMemo(() => {
    const base: Record<string, Project[]> = {};

    PROJECT_STATUSES.forEach((s) => {
      base[s.value] = [];
    });

    projects.forEach((p) => {
      if (base[p.status]) {
        base[p.status].push(p);
      } else {
        base[p.status] = [p];
      }
    });

    return base;
  }, [projects]);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const projectId = active.id as string;
    const target = over.id as string;

    // only handle if dropped on a column (status)
    if (["BACKLOG", "TODO", "IN_PROGRESS", "REVIEW", "DONE"].includes(target)) {
      const newStatus = target as ProjectStatus;
      const project = projects.find((p) => p.id === projectId);
      if (!project) return;
      if (project.status === newStatus) return;

      // call parent handler to update server and local state
      await onStatusChange(projectId, newStatus);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto p-4">
        {PROJECT_STATUSES.map((s) => (
          <Column
            key={s.value}
            status={s.value}
            title={s.label}
            items={grouped[s.value]}
          >
            {grouped[s.value].map((project) => (
              <DraggableProject key={project.id} id={project.id}>
                <ProjectCard
                  project={project}
                  onDelete={(id) => onDelete(id)}
                />
              </DraggableProject>
            ))}
          </Column>
        ))}
      </div>
    </DndContext>
  );
}
