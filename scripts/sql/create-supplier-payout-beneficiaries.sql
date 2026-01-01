-- Create Supplier Payout Beneficiaries Table for Cashfree Payout Integration
-- This table stores payout beneficiary information registered with Cashfree for suppliers to receive payments

CREATE TABLE IF NOT EXISTS public.supplier_payout_beneficiaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Link to supplier business
    supplier_business_id UUID NOT NULL REFERENCES public.supplier_businesses(id) ON DELETE CASCADE,
    
    -- Cashfree beneficiary identifiers
    cashfree_beneficiary_id VARCHAR(100) NOT NULL UNIQUE,
    beneficiary_status VARCHAR(30) NOT NULL,              -- e.g. 'VERIFIED', 'PENDING', 'FAILED'
    added_on TIMESTAMPTZ NOT NULL,                        -- from Cashfree response
    
    -- Name & instrument details
    beneficiary_name VARCHAR(150) NOT NULL,
    bank_account_number VARCHAR(32),
    bank_ifsc VARCHAR(11),
    vpa VARCHAR(255),                                     -- UPI VPA (optional)
    
    -- Contact details
    beneficiary_email VARCHAR(255),
    beneficiary_phone VARCHAR(20),
    beneficiary_country_code VARCHAR(10),
    beneficiary_address TEXT,
    beneficiary_city VARCHAR(100),
    beneficiary_state VARCHAR(100),
    beneficiary_postal_code VARCHAR(20),
    
    -- Raw payload for debugging / future fields
    raw_response JSONB,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_supplier_payout_beneficiaries_supplier 
    ON public.supplier_payout_beneficiaries(supplier_business_id);
CREATE INDEX IF NOT EXISTS idx_supplier_payout_beneficiaries_cashfree_id 
    ON public.supplier_payout_beneficiaries(cashfree_beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_supplier_payout_beneficiaries_status 
    ON public.supplier_payout_beneficiaries(beneficiary_status);

-- Enable Row Level Security
ALTER TABLE public.supplier_payout_beneficiaries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Suppliers can only access their own payout beneficiaries
CREATE POLICY "Suppliers can view own payout beneficiaries" ON public.supplier_payout_beneficiaries
    FOR SELECT USING (
        supplier_business_id IN (
            SELECT id FROM public.supplier_businesses 
            WHERE profile_id = auth.uid()
        )
    );

CREATE POLICY "Suppliers can insert own payout beneficiaries" ON public.supplier_payout_beneficiaries
    FOR INSERT WITH CHECK (
        supplier_business_id IN (
            SELECT id FROM public.supplier_businesses 
            WHERE profile_id = auth.uid()
        )
    );

CREATE POLICY "Suppliers can update own payout beneficiaries" ON public.supplier_payout_beneficiaries
    FOR UPDATE USING (
        supplier_business_id IN (
            SELECT id FROM public.supplier_businesses 
            WHERE profile_id = auth.uid()
        )
    );

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_supplier_payout_beneficiaries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_supplier_payout_beneficiaries_updated_at
    BEFORE UPDATE ON public.supplier_payout_beneficiaries
    FOR EACH ROW
    EXECUTE FUNCTION update_supplier_payout_beneficiaries_updated_at();

-- Add comments for documentation
COMMENT ON TABLE public.supplier_payout_beneficiaries IS 'Stores payout beneficiary information registered with Cashfree for suppliers to receive payments';
COMMENT ON COLUMN public.supplier_payout_beneficiaries.cashfree_beneficiary_id IS 'Unique beneficiary ID returned by Cashfree payout API';
COMMENT ON COLUMN public.supplier_payout_beneficiaries.beneficiary_status IS 'Status from Cashfree: VERIFIED, PENDING, FAILED, etc.';
COMMENT ON COLUMN public.supplier_payout_beneficiaries.raw_response IS 'Complete JSON response from Cashfree for reference and debugging';



