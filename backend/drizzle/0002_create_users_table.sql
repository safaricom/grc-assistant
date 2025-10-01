-- Create user_role enum and users table if not exists
-- This migration aligns the database with backend/src/lib/db/schema.ts

BEGIN;

-- Ensure pgcrypto for gen_random_uuid is available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create enum type for user roles if it does not exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin', 'user');
  END IF;
END$$;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text,
  password_hash text,
  role user_role NOT NULL DEFAULT 'user',
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

COMMIT;
