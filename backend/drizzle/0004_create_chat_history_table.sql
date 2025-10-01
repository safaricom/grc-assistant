-- Create message_role enum
DO $$ BEGIN
 CREATE TYPE "public"."message_role" AS ENUM('user', 'assistant');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS "chat_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chat_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS "chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"content" text NOT NULL,
	"role" "message_role" NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chat_messages_session_id_chat_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "chat_sessions"("id") ON DELETE CASCADE
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS "chat_sessions_user_id_idx" ON "chat_sessions" ("user_id");
CREATE INDEX IF NOT EXISTS "chat_sessions_created_at_idx" ON "chat_sessions" ("created_at" DESC);
CREATE INDEX IF NOT EXISTS "chat_messages_session_id_idx" ON "chat_messages" ("session_id");
CREATE INDEX IF NOT EXISTS "chat_messages_timestamp_idx" ON "chat_messages" ("timestamp");
