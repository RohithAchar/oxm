-- Create RFQ (Request for Quote) Tables for Supabase
-- This script creates the buy_leads and buy_lead_responses tables based on the existing UI and API code

-- 1. Create buy_leads table (main RFQ table)
CREATE TABLE IF NOT EXISTS buy_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    supplier_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT,
    supplier_name TEXT,
    quantity_required INTEGER,
    target_price DECIMAL(10,2),
    delivery_pincode VARCHAR(10),
    delivery_city VARCHAR(100),
    customization JSONB, -- For color, branding, packaging customizations
    notes TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    tier_pricing_snapshot JSONB, -- Snapshot of tier pricing at time of RFQ
    currency VARCHAR(3) DEFAULT 'INR',
    status rfq_status DEFAULT 'submitted',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_quantity CHECK (quantity_required IS NULL OR quantity_required > 0),
    CONSTRAINT valid_price CHECK (target_price IS NULL OR target_price > 0),
    CONSTRAINT valid_currency CHECK (currency IN ('INR', 'USD', 'EUR', 'GBP'))
);

-- 2. Create buy_lead_responses table (supplier responses to RFQs)
CREATE TABLE IF NOT EXISTS buy_lead_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    buy_lead_id UUID NOT NULL REFERENCES buy_leads(id) ON DELETE CASCADE,
    supplier_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    quoted_price DECIMAL(10,2),
    min_qty INTEGER,
    message TEXT,
    currency VARCHAR(3) DEFAULT 'INR',
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected, expired
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_quoted_price CHECK (quoted_price IS NULL OR quoted_price > 0),
    CONSTRAINT valid_min_qty CHECK (min_qty IS NULL OR min_qty > 0),
    CONSTRAINT valid_response_currency CHECK (currency IN ('INR', 'USD', 'EUR', 'GBP')),
    CONSTRAINT valid_response_status CHECK (status IN ('pending', 'accepted', 'rejected', 'expired'))
);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_buy_leads_buyer_id ON buy_leads(buyer_id);
CREATE INDEX IF NOT EXISTS idx_buy_leads_supplier_id ON buy_leads(supplier_id);
CREATE INDEX IF NOT EXISTS idx_buy_leads_product_id ON buy_leads(product_id);
CREATE INDEX IF NOT EXISTS idx_buy_leads_status ON buy_leads(status);
CREATE INDEX IF NOT EXISTS idx_buy_leads_created_at ON buy_leads(created_at);
CREATE INDEX IF NOT EXISTS idx_buy_leads_supplier_status ON buy_leads(supplier_id, status);
CREATE INDEX IF NOT EXISTS idx_buy_leads_buyer_status ON buy_leads(buyer_id, status);

CREATE INDEX IF NOT EXISTS idx_buy_lead_responses_lead_id ON buy_lead_responses(buy_lead_id);
CREATE INDEX IF NOT EXISTS idx_buy_lead_responses_supplier_id ON buy_lead_responses(supplier_id);
CREATE INDEX IF NOT EXISTS idx_buy_lead_responses_status ON buy_lead_responses(status);
CREATE INDEX IF NOT EXISTS idx_buy_lead_responses_created_at ON buy_lead_responses(created_at);

-- 4. Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Create triggers for updated_at
DROP TRIGGER IF EXISTS update_buy_leads_updated_at ON buy_leads;
CREATE TRIGGER update_buy_leads_updated_at
    BEFORE UPDATE ON buy_leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_buy_lead_responses_updated_at ON buy_lead_responses;
CREATE TRIGGER update_buy_lead_responses_updated_at
    BEFORE UPDATE ON buy_lead_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Enable Row Level Security (RLS)
ALTER TABLE buy_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE buy_lead_responses ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies for buy_leads
-- Buyers can view their own RFQs
CREATE POLICY "Buyers can view their own RFQs" ON buy_leads
    FOR SELECT USING (auth.uid() = buyer_id);

-- Suppliers can view RFQs directed to them
CREATE POLICY "Suppliers can view RFQs directed to them" ON buy_leads
    FOR SELECT USING (auth.uid() = supplier_id);

-- Buyers can insert their own RFQs
CREATE POLICY "Buyers can create RFQs" ON buy_leads
    FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Buyers can update their own RFQs (for status changes)
CREATE POLICY "Buyers can update their own RFQs" ON buy_leads
    FOR UPDATE USING (auth.uid() = buyer_id);

-- Suppliers can update RFQs directed to them (for status changes)
CREATE POLICY "Suppliers can update RFQs directed to them" ON buy_leads
    FOR UPDATE USING (auth.uid() = supplier_id);

-- 8. Create RLS policies for buy_lead_responses
-- Suppliers can view their own responses
CREATE POLICY "Suppliers can view their own responses" ON buy_lead_responses
    FOR SELECT USING (auth.uid() = supplier_id);

-- Buyers can view responses to their RFQs
CREATE POLICY "Buyers can view responses to their RFQs" ON buy_lead_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM buy_leads 
            WHERE buy_leads.id = buy_lead_responses.buy_lead_id 
            AND buy_leads.buyer_id = auth.uid()
        )
    );

-- Suppliers can insert responses to RFQs directed to them
CREATE POLICY "Suppliers can create responses" ON buy_lead_responses
    FOR INSERT WITH CHECK (
        auth.uid() = supplier_id AND
        EXISTS (
            SELECT 1 FROM buy_leads 
            WHERE buy_leads.id = buy_lead_responses.buy_lead_id 
            AND buy_leads.supplier_id = auth.uid()
        )
    );

-- Suppliers can update their own responses
CREATE POLICY "Suppliers can update their own responses" ON buy_lead_responses
    FOR UPDATE USING (auth.uid() = supplier_id);

-- Buyers can update responses to their RFQs (for acceptance/rejection)
CREATE POLICY "Buyers can update responses to their RFQs" ON buy_lead_responses
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM buy_leads 
            WHERE buy_leads.id = buy_lead_responses.buy_lead_id 
            AND buy_leads.buyer_id = auth.uid()
        )
    );

-- 9. Create a view for enriched buy leads (optional - for easier querying)
CREATE OR REPLACE VIEW enriched_buy_leads AS
SELECT 
    bl.*,
    p.name as product_name_full,
    p.description as product_description,
    p.brand as product_brand,
    p.price_per_unit as product_price,
    p.quantity as product_available_qty,
    p.is_active as product_is_active,
    -- Buyer information
    buyer.full_name as buyer_name,
    buyer.email as buyer_email,
    buyer.phone_number as buyer_phone,
    buyer.avatar_url as buyer_avatar,
    buyer.business_type as buyer_business_type,
    -- Supplier information
    supplier.full_name as supplier_name_full,
    supplier.email as supplier_email,
    supplier.phone_number as supplier_phone,
    supplier.avatar_url as supplier_avatar,
    supplier.business_type as supplier_business_type,
    -- Supplier business information
    sb.business_name as supplier_business_name,
    sb.city as supplier_city,
    sb.state as supplier_state,
    sb.gst_number as supplier_gst,
    sb.is_verified as supplier_verified
FROM buy_leads bl
LEFT JOIN products p ON bl.product_id = p.id
LEFT JOIN profiles buyer ON bl.buyer_id = buyer.id
LEFT JOIN profiles supplier ON bl.supplier_id = supplier.id
LEFT JOIN supplier_businesses sb ON supplier.id = sb.profile_id;

-- 10. Create a view for enriched buy lead responses
CREATE OR REPLACE VIEW enriched_buy_lead_responses AS
SELECT 
    blr.*,
    bl.buyer_id,
    bl.product_id,
    bl.product_name,
    bl.supplier_name,
    bl.quantity_required,
    bl.target_price,
    bl.currency as rfq_currency,
    -- Supplier information
    supplier.full_name as supplier_name_full,
    supplier.email as supplier_email,
    supplier.phone_number as supplier_phone,
    supplier.avatar_url as supplier_avatar,
    supplier.business_type as supplier_business_type,
    -- Supplier business information
    sb.business_name as supplier_business_name,
    sb.city as supplier_city,
    sb.state as supplier_state,
    sb.gst_number as supplier_gst,
    sb.is_verified as supplier_verified
FROM buy_lead_responses blr
LEFT JOIN buy_leads bl ON blr.buy_lead_id = bl.id
LEFT JOIN profiles supplier ON blr.supplier_id = supplier.id
LEFT JOIN supplier_businesses sb ON supplier.id = sb.profile_id;

-- 11. Add comments for documentation
COMMENT ON TABLE buy_leads IS 'Stores RFQ (Request for Quote) submissions from buyers to suppliers';
COMMENT ON TABLE buy_lead_responses IS 'Stores supplier responses to RFQ submissions';
COMMENT ON COLUMN buy_leads.customization IS 'JSON object containing customization requirements (color, branding, packaging)';
COMMENT ON COLUMN buy_leads.tier_pricing_snapshot IS 'Snapshot of tier pricing structure at time of RFQ submission';
COMMENT ON COLUMN buy_leads.status IS 'Current status of the RFQ: submitted, viewed, responded, closed, cancelled';
COMMENT ON COLUMN buy_lead_responses.status IS 'Status of the response: pending, accepted, rejected, expired';
