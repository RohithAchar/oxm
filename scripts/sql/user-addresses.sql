-- User Addresses Table for RapidShip Integration
-- This table stores user shipping and billing addresses following RapidShip data standards

-- Create the user_addresses table
CREATE TABLE IF NOT EXISTS public.user_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Address Type (shipping, billing, both)
    address_type TEXT NOT NULL CHECK (address_type IN ('shipping', 'billing', 'both')) DEFAULT 'shipping',
    
    -- Contact Information
    full_name TEXT NOT NULL,
    phone_number TEXT,
    email TEXT,
    
    -- Address Details (RapidShip compatible)
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    landmark TEXT,
    area TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'India',
    
    -- Additional RapidShip Fields
    pincode TEXT, -- Alternative to postal_code for Indian addresses
    district TEXT,
    locality TEXT,
    
    -- Address Status and Preferences
    is_primary BOOLEAN DEFAULT FALSE,
    is_default_shipping BOOLEAN DEFAULT FALSE,
    is_default_billing BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    
    -- Delivery Instructions
    delivery_instructions TEXT,
    landmark_description TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Soft delete
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMPTZ
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON public.user_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_addresses_profile_id ON public.user_addresses(profile_id);
CREATE INDEX IF NOT EXISTS idx_user_addresses_address_type ON public.user_addresses(address_type);
CREATE INDEX IF NOT EXISTS idx_user_addresses_is_primary ON public.user_addresses(is_primary);
CREATE INDEX IF NOT EXISTS idx_user_addresses_is_default_shipping ON public.user_addresses(is_default_shipping);
CREATE INDEX IF NOT EXISTS idx_user_addresses_is_default_billing ON public.user_addresses(is_default_billing);
CREATE INDEX IF NOT EXISTS idx_user_addresses_city ON public.user_addresses(city);
CREATE INDEX IF NOT EXISTS idx_user_addresses_state ON public.user_addresses(state);
CREATE INDEX IF NOT EXISTS idx_user_addresses_postal_code ON public.user_addresses(postal_code);
CREATE INDEX IF NOT EXISTS idx_user_addresses_is_active ON public.user_addresses(is_active);

-- Create a composite index for common queries
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_active ON public.user_addresses(user_id, is_active);

-- Enable Row Level Security
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only access their own addresses
CREATE POLICY "Users can view their own addresses" ON public.user_addresses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addresses" ON public.user_addresses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses" ON public.user_addresses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses" ON public.user_addresses
    FOR DELETE USING (auth.uid() = user_id);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_user_addresses_updated_at 
    BEFORE UPDATE ON public.user_addresses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to ensure only one primary address per user
CREATE OR REPLACE FUNCTION ensure_single_primary_address()
RETURNS TRIGGER AS $$
BEGIN
    -- If setting this address as primary, unset all other primary addresses for this user
    IF NEW.is_primary = TRUE THEN
        UPDATE public.user_addresses 
        SET is_primary = FALSE 
        WHERE user_id = NEW.user_id 
        AND id != NEW.id 
        AND is_active = TRUE;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to ensure only one primary address per user
CREATE TRIGGER ensure_single_primary_address_trigger
    BEFORE INSERT OR UPDATE ON public.user_addresses
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_primary_address();

-- Function to ensure only one default shipping address per user
CREATE OR REPLACE FUNCTION ensure_single_default_shipping()
RETURNS TRIGGER AS $$
BEGIN
    -- If setting this address as default shipping, unset all other default shipping addresses for this user
    IF NEW.is_default_shipping = TRUE THEN
        UPDATE public.user_addresses 
        SET is_default_shipping = FALSE 
        WHERE user_id = NEW.user_id 
        AND id != NEW.id 
        AND is_active = TRUE;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to ensure only one default shipping address per user
CREATE TRIGGER ensure_single_default_shipping_trigger
    BEFORE INSERT OR UPDATE ON public.user_addresses
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_default_shipping();

-- Function to ensure only one default billing address per user
CREATE OR REPLACE FUNCTION ensure_single_default_billing()
RETURNS TRIGGER AS $$
BEGIN
    -- If setting this address as default billing, unset all other default billing addresses for this user
    IF NEW.is_default_billing = TRUE THEN
        UPDATE public.user_addresses 
        SET is_default_billing = FALSE 
        WHERE user_id = NEW.user_id 
        AND id != NEW.id 
        AND is_active = TRUE;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to ensure only one default billing address per user
CREATE TRIGGER ensure_single_default_billing_trigger
    BEFORE INSERT OR UPDATE ON public.user_addresses
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_default_billing();

-- Add comments for documentation
COMMENT ON TABLE public.user_addresses IS 'Stores user shipping and billing addresses compatible with RapidShip integration';
COMMENT ON COLUMN public.user_addresses.address_type IS 'Type of address: shipping, billing, or both';
COMMENT ON COLUMN public.user_addresses.pincode IS 'Indian postal code (alternative to postal_code)';
COMMENT ON COLUMN public.user_addresses.district IS 'District information for Indian addresses';
COMMENT ON COLUMN public.user_addresses.locality IS 'Locality/neighborhood information';
COMMENT ON COLUMN public.user_addresses.is_primary IS 'Primary address for the user (only one allowed)';
COMMENT ON COLUMN public.user_addresses.is_default_shipping IS 'Default shipping address (only one allowed)';
COMMENT ON COLUMN public.user_addresses.is_default_billing IS 'Default billing address (only one allowed)';
COMMENT ON COLUMN public.user_addresses.is_verified IS 'Whether the address has been verified';
COMMENT ON COLUMN public.user_addresses.delivery_instructions IS 'Special delivery instructions';
COMMENT ON COLUMN public.user_addresses.landmark_description IS 'Description of nearby landmarks';
