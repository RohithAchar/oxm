-- Add business_type column to profiles table
-- This migration adds a business_type field to store the user's business type

-- Add the business_type column to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN business_type TEXT;

-- Add a check constraint to ensure only valid business types are allowed
ALTER TABLE public.profiles 
ADD CONSTRAINT check_business_type 
CHECK (business_type IS NULL OR business_type IN (
    'Ecommerce seller',
    'Dropshipper', 
    'Reseller / wholesaler',
    'Retailer',
    'Others'
));

-- Add an index for better query performance on business_type
CREATE INDEX IF NOT EXISTS idx_profiles_business_type ON public.profiles(business_type);

-- Add a comment to document the column
COMMENT ON COLUMN public.profiles.business_type IS 'Type of business the user operates (Ecommerce seller, Dropshipper, Reseller/wholesaler, Retailer, Others)';
