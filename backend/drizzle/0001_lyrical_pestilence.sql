ALTER TABLE "users" ADD COLUMN "di_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "di_refresh_token" text;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_di_id_unique" UNIQUE("di_id");