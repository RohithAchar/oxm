-- Improve RFQ System: Add product details and user/supplier information visibility
-- This script enhances the RFQ system to provide better context for both suppliers and buyers

-- 1. Add product snapshot to buy_leads table for better product context
ALTER TABLE buy_leads 
ADD COLUMN IF NOT EXISTS product_snapshot JSONB;

-- 2. Add buyer information snapshot to buy_leads table
ALTER TABLE buy_leads 
ADD COLUMN IF NOT EXISTS buyer_snapshot JSONB;

-- 3. Add supplier information to buy_lead_responses table
ALTER TABLE buy_lead_responses 
ADD COLUMN IF NOT EXISTS supplier_snapshot JSONB;

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_buy_leads_supplier_status ON buy_leads(supplier_id, status);
CREATE INDEX IF NOT EXISTS idx_buy_leads_buyer_status ON buy_leads(buyer_id, status);
CREATE INDEX IF NOT EXISTS idx_buy_lead_responses_lead_id ON buy_lead_responses(buy_lead_id);

-- 5. Create a view for enriched buy leads with product and buyer information
CREATE OR REPLACE VIEW enriched_buy_leads AS
SELECT 
    bl.*,
    p.name as product_name_full,
    p.description as product_description,
    p.brand as product_brand,
    p.price_per_unit as product_price,
    p.quantity as product_available_qty,
    p.is_active as product_is_active,
    p.created_at as product_created_at,
    p.updated_at as product_updated_at,
    -- Product images
    COALESCE(
        (SELECT json_agg(pi.image_url ORDER BY pi.display_order) 
         FROM product_images pi 
         WHERE pi.product_id = bl.product_id),
        '[]'::json
    ) as product_images,
    -- Product specifications
    COALESCE(
        (SELECT json_agg(
            json_build_object(
                'name', ps.spec_name,
                'value', ps.spec_value,
                'unit', ps.spec_unit
            ) ORDER BY ps.spec_name
        )
         FROM product_specifications ps 
         WHERE ps.product_id = bl.product_id),
        '[]'::json
    ) as product_specifications,
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

-- 6. Create a view for enriched buy lead responses with supplier information
CREATE OR REPLACE VIEW enriched_buy_lead_responses AS
SELECT 
    blr.*,
    -- Supplier information
    supplier.full_name as supplier_name,
    supplier.email as supplier_email,
    supplier.phone_number as supplier_phone,
    supplier.avatar_url as supplier_avatar,
    supplier.business_type as supplier_business_type,
    -- Supplier business information
    sb.business_name as supplier_business_name,
    sb.city as supplier_city,
    sb.state as supplier_state,
    sb.gst_number as supplier_gst,
    sb.is_verified as supplier_verified,
    sb.business_address as supplier_address,
    sb.phone as supplier_business_phone,
    sb.alternate_phone as supplier_alternate_phone
FROM buy_lead_responses blr
LEFT JOIN profiles supplier ON blr.supplier_id = supplier.id
LEFT JOIN supplier_businesses sb ON supplier.id = sb.profile_id;

-- 7. Create function to update product snapshot when buy lead is created
CREATE OR REPLACE FUNCTION update_buy_lead_product_snapshot()
RETURNS TRIGGER AS $$
BEGIN
    -- Update product snapshot with current product information
    NEW.product_snapshot = (
        SELECT json_build_object(
            'id', p.id,
            'name', p.name,
            'description', p.description,
            'brand', p.brand,
            'price_per_unit', p.price_per_unit,
            'quantity', p.quantity,
            'is_active', p.is_active,
            'images', COALESCE(
                (SELECT json_agg(pi.image_url ORDER BY pi.display_order) 
                 FROM product_images pi 
                 WHERE pi.product_id = p.id),
                '[]'::json
            ),
            'specifications', COALESCE(
                (SELECT json_agg(
                    json_build_object(
                        'name', ps.spec_name,
                        'value', ps.spec_value,
                        'unit', ps.spec_unit
                    ) ORDER BY ps.spec_name
                )
                 FROM product_specifications ps 
                 WHERE ps.product_id = p.id),
                '[]'::json
            ),
            'category', c.name,
            'subcategory', sc.name
        )
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN categories sc ON p.subcategory_id = sc.id
        WHERE p.id = NEW.product_id
    );
    
    -- Update buyer snapshot with current buyer information
    NEW.buyer_snapshot = (
        SELECT json_build_object(
            'id', buyer.id,
            'full_name', buyer.full_name,
            'email', buyer.email,
            'phone_number', buyer.phone_number,
            'avatar_url', buyer.avatar_url,
            'business_type', buyer.business_type
        )
        FROM profiles buyer
        WHERE buyer.id = NEW.buyer_id
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Create trigger to automatically update snapshots
DROP TRIGGER IF EXISTS trigger_update_buy_lead_snapshots ON buy_leads;
CREATE TRIGGER trigger_update_buy_lead_snapshots
    BEFORE INSERT OR UPDATE ON buy_leads
    FOR EACH ROW
    EXECUTE FUNCTION update_buy_lead_product_snapshot();

-- 9. Create function to update supplier snapshot when response is created
CREATE OR REPLACE FUNCTION update_buy_lead_response_supplier_snapshot()
RETURNS TRIGGER AS $$
BEGIN
    -- Update supplier snapshot with current supplier information
    NEW.supplier_snapshot = (
        SELECT json_build_object(
            'id', supplier.id,
            'full_name', supplier.full_name,
            'email', supplier.email,
            'phone_number', supplier.phone_number,
            'avatar_url', supplier.avatar_url,
            'business_type', supplier.business_type,
            'business_name', sb.business_name,
            'city', sb.city,
            'state', sb.state,
            'gst_number', sb.gst_number,
            'is_verified', sb.is_verified,
            'business_address', sb.business_address,
            'phone', sb.phone,
            'alternate_phone', sb.alternate_phone
        )
        FROM profiles supplier
        LEFT JOIN supplier_businesses sb ON supplier.id = sb.profile_id
        WHERE supplier.id = NEW.supplier_id
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. Create trigger to automatically update supplier snapshots
DROP TRIGGER IF EXISTS trigger_update_buy_lead_response_supplier_snapshots ON buy_lead_responses;
CREATE TRIGGER trigger_update_buy_lead_response_supplier_snapshots
    BEFORE INSERT OR UPDATE ON buy_lead_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_buy_lead_response_supplier_snapshot();

-- 11. Update existing records with snapshots (run this after the triggers are created)
UPDATE buy_leads 
SET product_snapshot = (
    SELECT json_build_object(
        'id', p.id,
        'name', p.name,
        'description', p.description,
        'brand', p.brand,
        'price_per_unit', p.price_per_unit,
        'quantity', p.quantity,
        'is_active', p.is_active,
        'images', COALESCE(
            (SELECT json_agg(pi.image_url ORDER BY pi.display_order) 
             FROM product_images pi 
             WHERE pi.product_id = p.id),
            '[]'::json
        ),
        'specifications', COALESCE(
            (SELECT json_agg(
                json_build_object(
                    'name', ps.spec_name,
                    'value', ps.spec_value,
                    'unit', ps.spec_unit
                ) ORDER BY ps.spec_name
            )
             FROM product_specifications ps 
             WHERE ps.product_id = p.id),
            '[]'::json
        ),
        'category', c.name,
        'subcategory', sc.name
    )
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN categories sc ON p.subcategory_id = sc.id
    WHERE p.id = buy_leads.product_id
),
buyer_snapshot = (
    SELECT json_build_object(
        'id', buyer.id,
        'full_name', buyer.full_name,
        'email', buyer.email,
        'phone_number', buyer.phone_number,
        'avatar_url', buyer.avatar_url,
        'business_type', buyer.business_type
    )
    FROM profiles buyer
    WHERE buyer.id = buy_leads.buyer_id
)
WHERE product_snapshot IS NULL OR buyer_snapshot IS NULL;

-- 12. Update existing responses with supplier snapshots
UPDATE buy_lead_responses 
SET supplier_snapshot = (
    SELECT json_build_object(
        'id', supplier.id,
        'full_name', supplier.full_name,
        'email', supplier.email,
        'phone_number', supplier.phone_number,
        'avatar_url', supplier.avatar_url,
        'business_type', supplier.business_type,
        'business_name', sb.business_name,
        'city', sb.city,
        'state', sb.state,
        'gst_number', sb.gst_number,
        'is_verified', sb.is_verified,
        'business_address', sb.business_address,
        'phone', sb.phone,
        'alternate_phone', sb.alternate_phone
    )
    FROM profiles supplier
    LEFT JOIN supplier_businesses sb ON supplier.id = sb.profile_id
    WHERE supplier.id = buy_lead_responses.supplier_id
)
WHERE supplier_snapshot IS NULL;

-- 13. Add comments for documentation
COMMENT ON COLUMN buy_leads.product_snapshot IS 'Snapshot of product information at the time of RFQ creation';
COMMENT ON COLUMN buy_leads.buyer_snapshot IS 'Snapshot of buyer information at the time of RFQ creation';
COMMENT ON COLUMN buy_lead_responses.supplier_snapshot IS 'Snapshot of supplier information at the time of response creation';
COMMENT ON VIEW enriched_buy_leads IS 'Buy leads with enriched product and user information';
COMMENT ON VIEW enriched_buy_lead_responses IS 'Buy lead responses with enriched supplier information';
