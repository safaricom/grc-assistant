ALTER TABLE IF EXISTS "users" ADD COLUMN IF NOT EXISTS "di_id" text;--> statement-breakpoint
ALTER TABLE IF EXISTS "users" ADD COLUMN IF NOT EXISTS "di_refresh_token" text;--> statement-breakpoint
-- create a unique index if the users table exists and index does not already exist
DO $$
BEGIN
	IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'users') THEN
		IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'users' AND indexname = 'users_di_id_unique') THEN
			CREATE UNIQUE INDEX users_di_id_unique ON users (di_id);
		END IF;
	END IF;
END$$;