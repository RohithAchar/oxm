// Address types for user addresses table
// Compatible with RapidShip integration

export type AddressType = "shipping" | "billing" | "both";

export interface UserAddress {
  id: string;
  user_id: string;
  profile_id: string;

  // Address Type
  address_type: AddressType;

  // Contact Information
  full_name: string;
  phone_number?: string | null;
  email?: string | null;

  // Address Details (RapidShip compatible)
  address_line_1: string;
  address_line_2?: string | null;
  landmark?: string | null;
  area?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;

  // Additional RapidShip Fields
  pincode?: string | null;
  district?: string | null;
  locality?: string | null;

  // Address Status and Preferences
  is_primary: boolean;
  is_default_shipping: boolean;
  is_default_billing: boolean;
  is_verified: boolean;

  // Delivery Instructions
  delivery_instructions?: string | null;
  landmark_description?: string | null;

  // Timestamps
  created_at: string;
  updated_at: string;

  // Soft delete
  is_active: boolean;
  deleted_at?: string | null;
}

export interface CreateUserAddressInput {
  address_type?: AddressType;
  full_name: string;
  phone_number?: string;
  email?: string;
  address_line_1: string;
  address_line_2?: string;
  landmark?: string;
  area?: string;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
  pincode?: string;
  district?: string;
  locality?: string;
  is_primary?: boolean;
  is_default_shipping?: boolean;
  is_default_billing?: boolean;
  delivery_instructions?: string;
  landmark_description?: string;
}

export interface UpdateUserAddressInput
  extends Partial<CreateUserAddressInput> {
  id: string;
}

export interface AddressFormData {
  full_name: string;
  phone_number: string;
  email: string;
  address_line_1: string;
  address_line_2: string;
  landmark: string;
  area: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  pincode: string;
  district: string;
  locality: string;
  address_type: AddressType;
  is_primary: boolean;
  is_default_shipping: boolean;
  is_default_billing: boolean;
  delivery_instructions: string;
  landmark_description: string;
}

// RapidShip specific types for integration
export interface RapidShipAddress {
  name: string;
  phone: string;
  email?: string;
  address_line_1: string;
  address_line_2?: string;
  landmark?: string;
  area?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  district?: string;
  locality?: string;
  delivery_instructions?: string;
}

// Utility type for address validation
export interface AddressValidation {
  isValid: boolean;
  errors: {
    full_name?: string;
    phone_number?: string;
    email?: string;
    address_line_1?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
}

// Address selection types for checkout
export interface AddressSelection {
  shipping_address_id?: string;
  billing_address_id?: string;
  use_same_for_billing: boolean;
}

// Address statistics for user dashboard
export interface AddressStats {
  total_addresses: number;
  primary_address?: UserAddress;
  default_shipping_address?: UserAddress;
  default_billing_address?: UserAddress;
  verified_addresses: number;
}
