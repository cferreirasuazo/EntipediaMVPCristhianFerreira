CREATE TABLE "clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"value" numeric(14, 2) DEFAULT 0,
	"since_date" date,
	"until_date" date,
	"created_at" timestamp DEFAULT now()
);
