import {
  pgTable,
  serial,
  text,
  numeric,
  date,
  timestamp,
} from "drizzle-orm/pg-core";

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  value: numeric("value", { precision: 14, scale: 2 }).default(0),
  since_date: date("since_date"),
  until_date: date("until_date"),
  created_at: timestamp("created_at").defaultNow(),
});
