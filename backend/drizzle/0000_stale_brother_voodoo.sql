ALTER TABLE IF EXISTS "users" DROP CONSTRAINT IF EXISTS "users_microsoft_id_unique";--> statement-breakpoint
ALTER TABLE IF EXISTS "users" DROP COLUMN IF EXISTS "microsoft_id";