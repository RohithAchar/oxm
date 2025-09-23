-- Add an "about" field to store supplier business description/profile
-- Idempotent: only adds the column if it does not already exist

ALTER TABLE IF EXISTS public.supplier_businesses
ADD COLUMN IF NOT EXISTS about TEXT;


