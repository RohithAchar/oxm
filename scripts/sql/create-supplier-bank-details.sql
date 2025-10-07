-- Create Supplier Bank Details Table for Cashfree Integration
-- This table stores bank account information for suppliers to receive payments

-- Create the supplier_bank_details table
CREATE TABLE IF NOT EXISTS public.supplier_bank_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_business_id UUID NOT NULL REFERENCES public.supplier_businesses(id) ON DELETE CASCADE,
    
    -- Bank Account Details
    account_holder_name VARCHAR(100) NOT NULL,
    account_number VARCHAR(20) NOT NULL,
    ifsc_code VARCHAR(11) NOT NULL,
    bank_name VARCHAR(100),
    branch_name VARCHAR(100),
    account_type VARCHAR(20) CHECK (account_type IN ('savings', 'current')) NOT NULL DEFAULT 'savings',
    
    -- Contact Information for Verification
    phone VARCHAR(15),
    
    -- Cashfree Integration Fields
    cashfree_reference_id VARCHAR(50) UNIQUE,
    cashfree_user_id VARCHAR(50),
    verification_status VARCHAR(30) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'validating', 'valid', 'invalid', 'failed')),
    verification_message TEXT,
    name_at_bank VARCHAR(100),
    bank_city VARCHAR(100),
    bank_branch VARCHAR(100),
    micr_code VARCHAR(9),
    name_match_score DECIMAL(5,2),
    name_match_result VARCHAR(20),
    account_status VARCHAR(30),
    account_status_code VARCHAR(50),
    
    -- IFSC Details (from Cashfree response)
    ifsc_details JSONB,
    
    -- Status & Metadata
    is_primary BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_verified_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_supplier_account UNIQUE (supplier_business_id, account_number),
    CONSTRAINT valid_account_number CHECK (account_number ~ '^[0-9]+$' AND length(account_number) >= 9),
    CONSTRAINT valid_ifsc CHECK (ifsc_code ~ '^[A-Z]{4}0[A-Z0-9]{6}$'),
    CONSTRAINT valid_phone CHECK (phone IS NULL OR phone ~ '^[0-9]{10}$')
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_supplier_bank_details_supplier_id ON public.supplier_bank_details(supplier_business_id);
CREATE INDEX IF NOT EXISTS idx_supplier_bank_details_verification_status ON public.supplier_bank_details(verification_status);
CREATE INDEX IF NOT EXISTS idx_supplier_bank_details_cashfree_ref ON public.supplier_bank_details(cashfree_reference_id);
CREATE INDEX IF NOT EXISTS idx_supplier_bank_details_is_primary ON public.supplier_bank_details(supplier_business_id, is_primary) WHERE is_primary = TRUE;

-- Create unique index to ensure only one primary account per supplier
CREATE UNIQUE INDEX IF NOT EXISTS idx_supplier_bank_details_unique_primary 
ON public.supplier_bank_details(supplier_business_id) 
WHERE is_primary = TRUE;

-- Enable Row Level Security
ALTER TABLE public.supplier_bank_details ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Suppliers can only access their own bank details
CREATE POLICY "Suppliers can view own bank details" ON public.supplier_bank_details
    FOR SELECT USING (
        supplier_business_id IN (
            SELECT id FROM public.supplier_businesses 
            WHERE profile_id = auth.uid()
        )
    );

CREATE POLICY "Suppliers can insert own bank details" ON public.supplier_bank_details
    FOR INSERT WITH CHECK (
        supplier_business_id IN (
            SELECT id FROM public.supplier_businesses 
            WHERE profile_id = auth.uid()
        )
    );

CREATE POLICY "Suppliers can update own bank details" ON public.supplier_bank_details
    FOR UPDATE USING (
        supplier_business_id IN (
            SELECT id FROM public.supplier_businesses 
            WHERE profile_id = auth.uid()
        )
    );

CREATE POLICY "Suppliers can delete own bank details" ON public.supplier_bank_details
    FOR DELETE USING (
        supplier_business_id IN (
            SELECT id FROM public.supplier_businesses 
            WHERE profile_id = auth.uid()
        )
    );

-- Note: Admin access can be added later when proper role system is implemented
-- For now, only suppliers can access their own bank details

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_supplier_bank_details_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_supplier_bank_details_updated_at
    BEFORE UPDATE ON public.supplier_bank_details
    FOR EACH ROW
    EXECUTE FUNCTION update_supplier_bank_details_updated_at();

-- Add comments for documentation
COMMENT ON TABLE public.supplier_bank_details IS 'Stores bank account details for suppliers to receive payments via Cashfree';
COMMENT ON COLUMN public.supplier_bank_details.cashfree_reference_id IS 'Reference ID returned by Cashfree for bank verification';
COMMENT ON COLUMN public.supplier_bank_details.verification_status IS 'Current verification status: pending, validating, valid, invalid, failed';
COMMENT ON COLUMN public.supplier_bank_details.ifsc_details IS 'Complete IFSC details returned by Cashfree verification API';
COMMENT ON COLUMN public.supplier_bank_details.is_primary IS 'Whether this is the primary bank account for the supplier';
