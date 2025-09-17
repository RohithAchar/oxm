# Enhanced RFQ System

This document describes the improvements made to the RFQ (Request for Quote) system to provide better visibility and context for both suppliers and buyers.

## Problems Solved

### Before the Enhancement

1. **Missing Product Information**: Suppliers couldn't see detailed product information (images, specifications, description)
2. **Missing User Information**: Suppliers couldn't see who sent the RFQ (buyer details)
3. **Missing Supplier Information**: Buyers couldn't see detailed supplier information in responses
4. **Limited Context**: No product images, specifications, or detailed product information in RFQ views

### After the Enhancement

1. **Complete Product Context**: Suppliers can see product images, specifications, description, and all relevant details
2. **Buyer Information**: Suppliers can see buyer name, business type, contact information, and avatar
3. **Supplier Information**: Buyers can see detailed supplier information including business details, verification status, and contact information
4. **Rich Data Display**: Enhanced UI components with better organization and visual hierarchy

## Database Changes

### New Columns Added

#### `buy_leads` table

- `product_snapshot` (JSONB): Snapshot of product information at the time of RFQ creation
- `buyer_snapshot` (JSONB): Snapshot of buyer information at the time of RFQ creation

#### `buy_lead_responses` table

- `supplier_snapshot` (JSONB): Snapshot of supplier information at the time of response creation

### Database Views Created

#### `enriched_buy_leads`

A comprehensive view that joins buy leads with:

- Product information (name, description, brand, price, images, specifications)
- Buyer information (name, email, phone, avatar, business type)
- Supplier information (name, email, phone, avatar, business type, business details)

#### `enriched_buy_lead_responses`

A view that joins buy lead responses with:

- Supplier information (name, email, phone, avatar, business type)
- Supplier business information (business name, address, GST, verification status)

### Automatic Snapshots

Database triggers automatically create snapshots when:

- A buy lead is created (product and buyer snapshots)
- A buy lead response is created (supplier snapshot)

This ensures that even if product or user information changes later, the RFQ context is preserved.

## New Components

### `EnhancedBuyLeadCard`

A comprehensive card component that displays:

- **Product Information**: Images, specifications, description, brand
- **Buyer Information**: Name, business type, avatar
- **RFQ Details**: Quantity, target price, delivery location, customization, notes
- **Contact Information**: Email and phone
- **Timestamps**: When the RFQ was submitted

### `EnhancedResponseCard`

A detailed response card that shows:

- **Supplier Information**: Business name, contact person, avatar, verification status
- **Response Details**: Quoted price, minimum quantity, message
- **Business Details**: Address, GST number, contact information
- **Timestamps**: When the response was sent

## API Endpoints

### GET `/api/rfq/leads`

- Fetches buy leads with enriched data (product and buyer snapshots)
- Supports filtering by type (buyer/supplier) and status
- Returns complete product and user context

### POST `/api/rfq/leads`

- Creates new buy leads with automatic snapshot generation
- Validates required fields and user permissions

### GET `/api/rfq/leads/[id]`

- Fetches individual buy lead with full context
- Includes access control (only buyer or supplier can view)

### PATCH `/api/rfq/leads/[id]`

- Updates buy lead status
- Includes access control and validation

### GET `/api/rfq/responses`

- Fetches buy lead responses with supplier snapshots
- Supports filtering by buy_lead_id
- Returns complete supplier context

### POST `/api/rfq/responses`

- Creates new responses with automatic supplier snapshot generation
- Updates buy lead status to "responded"
- Includes validation and access control

## Usage Examples

### For Suppliers

```typescript
// Fetch buy leads with product and buyer information
const { data } = await supabase
  .from("buy_leads")
  .select(
    `
    *,
    product_snapshot,
    buyer_snapshot
  `
  )
  .eq("supplier_id", user.id);
```

### For Buyers

```typescript
// Fetch responses with supplier information
const { data } = await supabase
  .from("buy_lead_responses")
  .select(
    `
    *,
    supplier_snapshot
  `
  )
  .eq("buy_lead_id", leadId);
```

## Benefits

1. **Better Decision Making**: Suppliers can see complete product context and buyer information
2. **Improved Trust**: Buyers can see detailed supplier information and verification status
3. **Enhanced User Experience**: Rich, informative UI with better visual hierarchy
4. **Data Integrity**: Snapshots preserve context even when underlying data changes
5. **Scalability**: Database views and triggers handle data enrichment automatically

## Migration

To apply these changes to your database:

1. Run the SQL script: `scripts/sql/improve-rfq-system.sql`
2. Update your TypeScript types: `utils/supabase/database.types.ts`
3. Deploy the new components and API endpoints
4. Update existing RFQ pages to use the enhanced components

The system is backward compatible - existing RFQs will work, and new ones will automatically include the enhanced data.
