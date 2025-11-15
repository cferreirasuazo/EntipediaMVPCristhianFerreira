import { z } from "zod";

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
