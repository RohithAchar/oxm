-- Supplier Bank Details Table (Fixed for Supabase)
-- This table stores bank account information for suppliers to receive payments

CREATE TABLE IF NOT EXISTS supplier_bank_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_business_id UUID NOT NULL REFERENCES supplier_businesses(id) ON DELETE CASCADE,
  
  -- Core Bank Details (Required)
  account_holder_name VARCHAR(100) NOT NULL,
  account_number VARCHAR(20) NOT NULL,
  ifsc_code VARCHAR(11) NOT NULL,
  bank_name VARCHAR(100) NOT NULL,
  branch_name VARCHAR(100),
  account_type VARCHAR(20) CHECK (account_type IN ('savings', 'current')) NOT NULL DEFAULT 'current',
  
  -- Cashfree Integration
  cashfree_beneficiary_id VARCHAR(100) UNIQUE,
  verification_status VARCHAR(30) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'failed', 'suspended')),
  verification_message TEXT,
  last_verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Status & Metadata
  is_primary BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Audit Fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id),
  
  -- Basic Constraints
  UNIQUE(supplier_business_id, account_number)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_supplier_bank_details_supplier_id ON supplier_bank_details(supplier_business_id);
CREATE INDEX IF NOT EXISTS idx_supplier_bank_details_verification_status ON supplier_bank_details(verification_status);
CREATE INDEX IF NOT EXISTS idx_supplier_bank_details_cashfree_id ON supplier_bank_details(cashfree_beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_supplier_bank_details_active ON supplier_bank_details(supplier_business_id, is_active) WHERE is_active = TRUE;

-- Create partial unique constraint for primary account (only one primary per supplier)
CREATE UNIQUE INDEX IF NOT EXISTS idx_supplier_bank_details_primary_unique 
ON supplier_bank_details(supplier_business_id) 
WHERE is_primary = TRUE AND is_active = TRUE;

-- Bank Details Audit Log
CREATE TABLE IF NOT EXISTS supplier_bank_details_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_details_id UUID NOT NULL REFERENCES supplier_bank_details(id) ON DELETE CASCADE,
  action VARCHAR(20) NOT NULL CHECK (action IN ('created', 'updated', 'deleted', 'verified', 'suspended')),
  old_data JSONB,
  new_data JSONB,
  changed_by UUID REFERENCES profiles(id),
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Create indexes for audit table
CREATE INDEX IF NOT EXISTS idx_bank_details_audit_bank_id ON supplier_bank_details_audit(bank_details_id);
CREATE INDEX IF NOT EXISTS idx_bank_details_audit_action ON supplier_bank_details_audit(action);
CREATE INDEX IF NOT EXISTS idx_bank_details_audit_date ON supplier_bank_details_audit(changed_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_supplier_bank_details_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_update_supplier_bank_details_updated_at
  BEFORE UPDATE ON supplier_bank_details
  FOR EACH ROW
  EXECUTE FUNCTION update_supplier_bank_details_updated_at();

-- Function to log bank details changes
CREATE OR REPLACE FUNCTION log_supplier_bank_details_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO supplier_bank_details_audit (
      bank_details_id, action, new_data, changed_by
    ) VALUES (
      NEW.id, 'created', to_jsonb(NEW), NEW.created_by
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO supplier_bank_details_audit (
      bank_details_id, action, old_data, new_data, changed_by
    ) VALUES (
      NEW.id, 'updated', to_jsonb(OLD), to_jsonb(NEW), NEW.updated_by
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO supplier_bank_details_audit (
      bank_details_id, action, old_data
    ) VALUES (
      OLD.id, 'deleted', to_jsonb(OLD)
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to log all changes
CREATE TRIGGER trigger_log_supplier_bank_details_changes
  AFTER INSERT OR UPDATE OR DELETE ON supplier_bank_details
  FOR EACH ROW
  EXECUTE FUNCTION log_supplier_bank_details_changes();

-- Enable Row Level Security (RLS)
ALTER TABLE supplier_bank_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_bank_details_audit ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Suppliers can only access their own bank details
CREATE POLICY supplier_bank_details_supplier_policy ON supplier_bank_details
  FOR ALL USING (
    supplier_business_id IN (
      SELECT id FROM supplier_businesses 
      WHERE profile_id = auth.uid()
    )
  );

-- RLS Policy: Suppliers can only access their own audit logs
CREATE POLICY supplier_bank_details_audit_supplier_policy ON supplier_bank_details_audit
  FOR SELECT USING (
    bank_details_id IN (
      SELECT id FROM supplier_bank_details
      WHERE supplier_business_id IN (
        SELECT id FROM supplier_businesses 
        WHERE profile_id = auth.uid()
      )
    )
  );

-- Note: Admin policies removed since 'role' column doesn't exist in profiles table
-- You can add admin policies later if needed by creating a role/permission system

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON supplier_bank_details TO authenticated;
GRANT SELECT ON supplier_bank_details_audit TO authenticated;

-- Sample data for development (optional - uncomment to use)
/*
INSERT INTO supplier_bank_details (
  supplier_business_id,
  account_holder_name,
  account_number,
  ifsc_code,
  bank_name,
  branch_name,
  account_type,
  is_primary,
  verification_status
) VALUES (
  (SELECT id FROM supplier_businesses LIMIT 1),
  'Sample Business Pvt Ltd',
  '1234567890123456',
  'HDFC0001234',
  'HDFC Bank',
  'Koramangala Branch',
  'current',
  true,
  'verified'
) ON CONFLICT DO NOTHING;
*/
