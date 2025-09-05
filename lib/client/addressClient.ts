import {
  UserAddress,
  CreateUserAddressInput,
  UpdateUserAddressInput,
} from "@/types/address";

const API_BASE = "/api/addresses";

export async function fetchAddresses(): Promise<UserAddress[]> {
  const response = await fetch(API_BASE);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch addresses");
  }

  const data = await response.json();
  return data.addresses;
}

export async function fetchAddressById(id: string): Promise<UserAddress> {
  const response = await fetch(`${API_BASE}/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch address");
  }

  const data = await response.json();
  return data.address;
}

export async function createAddress(
  addressData: CreateUserAddressInput
): Promise<UserAddress> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(addressData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create address");
  }

  const data = await response.json();
  return data.address;
}

export async function updateAddress(
  addressData: UpdateUserAddressInput
): Promise<UserAddress> {
  const { id, ...updateData } = addressData;

  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update address");
  }

  const data = await response.json();
  return data.address;
}

export async function deleteAddress(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete address");
  }
}

export async function setPrimaryAddress(id: string): Promise<UserAddress> {
  const response = await fetch(`${API_BASE}/${id}/primary`, {
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to set primary address");
  }

  const data = await response.json();
  return data.address;
}

export async function setDefaultShippingAddress(
  id: string
): Promise<UserAddress> {
  const response = await fetch(`${API_BASE}/${id}/default-shipping`, {
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to set default shipping address");
  }

  const data = await response.json();
  return data.address;
}

export async function setDefaultBillingAddress(
  id: string
): Promise<UserAddress> {
  const response = await fetch(`${API_BASE}/${id}/default-billing`, {
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to set default billing address");
  }

  const data = await response.json();
  return data.address;
}
