"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  UserAddress,
  CreateUserAddressInput,
  AddressType,
} from "@/types/address";
import { createAddress, updateAddress } from "@/lib/client/addressClient";

interface AddressFormProps {
  address?: UserAddress;
}

export function AddressForm({ address }: AddressFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateUserAddressInput>({
    full_name: address?.full_name || "",
    phone_number: address?.phone_number || "",
    email: address?.email || "",
    address_line_1: address?.address_line_1 || "",
    address_line_2: address?.address_line_2 || "",
    landmark: address?.landmark || "",
    area: address?.area || "",
    city: address?.city || "",
    state: address?.state || "",
    postal_code: address?.postal_code || "",
    country: address?.country || "India",
    pincode: address?.pincode || "",
    district: address?.district || "",
    locality: address?.locality || "",
    address_type: address?.address_type || "shipping",
    is_primary: address?.is_primary || false,
    is_default_shipping: address?.is_default_shipping || false,
    is_default_billing: address?.is_default_billing || false,
    delivery_instructions: address?.delivery_instructions || "",
    landmark_description: address?.landmark_description || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (address) {
        await updateAddress({ id: address.id, ...formData });
        toast.success("Address updated successfully");
      } else {
        await createAddress(formData);
        toast.success("Address created successfully");
      }
      router.push("/addresses");
    } catch (error) {
      toast.error("Failed to save address");
      console.error("Address save error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof CreateUserAddressInput,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{address ? "Edit Address" : "Add New Address"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) =>
                    handleInputChange("full_name", e.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) =>
                    handleInputChange("phone_number", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
          </div>

          {/* Address Type */}
          <div className="space-y-2">
            <Label htmlFor="address_type">Address Type *</Label>
            <Select
              value={formData.address_type}
              onValueChange={(value: AddressType) =>
                handleInputChange("address_type", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select address type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shipping">Shipping</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="both">Both Shipping & Billing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Address Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Address Details</h3>

            <div className="space-y-2">
              <Label htmlFor="address_line_1">Address Line 1 *</Label>
              <Input
                id="address_line_1"
                value={formData.address_line_1}
                onChange={(e) =>
                  handleInputChange("address_line_1", e.target.value)
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_line_2">Address Line 2</Label>
              <Input
                id="address_line_2"
                value={formData.address_line_2}
                onChange={(e) =>
                  handleInputChange("address_line_2", e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="landmark">Landmark</Label>
                <Input
                  id="landmark"
                  value={formData.landmark}
                  onChange={(e) =>
                    handleInputChange("landmark", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  value={formData.area}
                  onChange={(e) => handleInputChange("area", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal Code *</Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(e) =>
                    handleInputChange("postal_code", e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange("pincode", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) =>
                    handleInputChange("district", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="locality">Locality</Label>
                <Input
                  id="locality"
                  value={formData.locality}
                  onChange={(e) =>
                    handleInputChange("locality", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
              />
            </div>
          </div>

          {/* Delivery Instructions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Delivery Instructions</h3>

            <div className="space-y-2">
              <Label htmlFor="delivery_instructions">
                Delivery Instructions
              </Label>
              <Textarea
                id="delivery_instructions"
                value={formData.delivery_instructions}
                onChange={(e) =>
                  handleInputChange("delivery_instructions", e.target.value)
                }
                placeholder="Any special delivery instructions..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="landmark_description">Landmark Description</Label>
              <Textarea
                id="landmark_description"
                value={formData.landmark_description}
                onChange={(e) =>
                  handleInputChange("landmark_description", e.target.value)
                }
                placeholder="Describe nearby landmarks for easy delivery..."
              />
            </div>
          </div>

          {/* Address Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Address Preferences</h3>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_primary"
                  checked={formData.is_primary}
                  onCheckedChange={(checked) =>
                    handleInputChange("is_primary", checked as boolean)
                  }
                />
                <Label htmlFor="is_primary">Set as primary address</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_default_shipping"
                  checked={formData.is_default_shipping}
                  onCheckedChange={(checked) =>
                    handleInputChange("is_default_shipping", checked as boolean)
                  }
                />
                <Label htmlFor="is_default_shipping">
                  Set as default shipping address
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_default_billing"
                  checked={formData.is_default_billing}
                  onCheckedChange={(checked) =>
                    handleInputChange("is_default_billing", checked as boolean)
                  }
                />
                <Label htmlFor="is_default_billing">
                  Set as default billing address
                </Label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : address
                ? "Update Address"
                : "Add Address"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
