import { z } from "zod";

// Clients

export const clientCreateSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["Persona", "Compañía"]),
  value: z.number().nonnegative(),
  since_date: z.string().optional(), // ISO date
  until_date: z.string().optional(),
});

export type ClientCreate = z.infer<typeof clientCreateSchema>;

export const clientUpdateSchema = clientCreateSchema
  .partial()
  .extend({ id: z.number() });
export type ClientUpdate = z.infer<typeof clientUpdateSchema>;

// Projects

export const ProjectCreate = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1),
  status: z
    .enum(["BACKLOG", "TODO", "IN_PROGRESS", "REVIEW", "DONE"])
    .optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
});

export const ProjectUpdate = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  status: z
    .enum(["BACKLOG", "TODO", "IN_PROGRESS", "REVIEW", "DONE"])
    .optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
});
