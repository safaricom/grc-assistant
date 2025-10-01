-- Create documents table
-- This migration creates the documents table for file metadata storage

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL,
  storage_key text NOT NULL UNIQUE,
  uploaded_by_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint

-- Create index on uploaded_by_id for faster queries
CREATE INDEX IF NOT EXISTS documents_uploaded_by_id_idx ON documents(uploaded_by_id);--> statement-breakpoint

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS documents_created_at_idx ON documents(created_at DESC);
