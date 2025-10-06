-- CLEANUP SCRIPT: Remove all bank details related tables and functions
-- Run this in your Supabase SQL editor to completely remove the bank details system

-- Drop triggers first
DROP TRIGGER IF EXISTS trigger_update_supplier_bank_details_updated_at ON supplier_bank_details;
DROP TRIGGER IF EXISTS trigger_log_supplier_bank_details_changes ON supplier_bank_details;

-- Drop functions
DROP FUNCTION IF EXISTS update_supplier_bank_details_updated_at();
DROP FUNCTION IF EXISTS log_supplier_bank_details_changes();
DROP FUNCTION IF EXISTS nuclear_delete_bank_details(UUID);

-- Drop indexes
DROP INDEX IF EXISTS idx_supplier_bank_details_supplier_id;
DROP INDEX IF EXISTS idx_supplier_bank_details_verification_status;
DROP INDEX IF EXISTS idx_supplier_bank_details_cashfree_id;
DROP INDEX IF EXISTS idx_supplier_bank_details_active;
DROP INDEX IF EXISTS idx_supplier_bank_details_primary_unique;
DROP INDEX IF EXISTS idx_bank_details_audit_bank_id;
DROP INDEX IF EXISTS idx_bank_details_audit_action;
DROP INDEX IF EXISTS idx_bank_details_audit_date;

-- Drop tables (audit table first due to foreign key)
DROP TABLE IF EXISTS supplier_bank_details_audit CASCADE;
DROP TABLE IF EXISTS supplier_bank_details CASCADE;

-- Verify cleanup
SELECT 'Cleanup completed!' as status;

