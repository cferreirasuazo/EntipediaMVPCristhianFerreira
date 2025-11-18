import {
  pgTable,
  serial,
  text,
  numeric,
  date,
  varchar,
  timestamp,
  uuid,
  bigint,
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

export const files = pgTable("files", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 50 }).notNull(),
  size: bigint("size", { mode: "number" }).notNull(),
  key: varchar("key", { length: 500 }).notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
