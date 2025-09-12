"use client";

import { useState, useEffect } from "react";
import { MapPin, Plus, Edit, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerOverlay,
} from "@/components/ui/drawer";
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
import { UserAddress, CreateUserAddressInput } from "@/types/address";
import { createAddress, updateAddress, getUserAddresses } from "@/lib/client/addressClient";

interface ShippingAddressProps {
  onAddressSelect?: (address: UserAddress) => void;
  selectedAddressId?: string;
}

export default function ShippingAddress({ onAddressSelect, selectedAddressId }: ShippingAddressProps) {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateUserAddressInput>({
    full_name: "",
    phone_number: "",
    email: "",
    address_line_1: "",
    address_line_2: "",
    landmark: "",
    area: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    pincode: "",
    district: "",
    locality: "",
    address_type: "shipping",
    is_primary: false,
    is_default_shipping: true,
    is_default_billing: false,
    delivery_instructions: "",
    landmark_description: "",
  });

  // Load addresses on component mount
  useEffect(() => {
    loadAddresses();
  }, []);

  // Set selected address when selectedAddressId changes
  useEffect(() => {
    if (selectedAddressId && addresses.length > 0) {
      const address = addresses.find(addr => addr.id === selectedAddressId);
      if (address) {
        setSelectedAddress(address);
      }
    }
  }, [selectedAddressId, addresses]);

  const loadAddresses = async () => {
    try {
      setIsLoading(true);
      const userAddresses = await getUserAddresses();
      setAddresses(userAddresses);
      
      // Set default shipping address if available
      const defaultShipping = userAddresses.find(addr => addr.is_default_shipping);
      if (defaultShipping) {
        setSelectedAddress(defaultShipping);
        onAddressSelect?.(defaultShipping);
      }
    } catch (error) {
      console.error("Error loading addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSelect = (address: UserAddress) => {
    setSelectedAddress(address);
    onAddressSelect?.(address);
    setIsOpen(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormLoading(true);

    try {
      const newAddress = await createAddress(formData);
      setAddresses(prev => [...prev, newAddress]);
      setSelectedAddress(newAddress);
      onAddressSelect?.(newAddress);
      setShowForm(false);
      setIsOpen(false);
      toast.success("Address added successfully");
      
      // Reset form
      setFormData({
        full_name: "",
        phone_number: "",
        email: "",
        address_line_1: "",
        address_line_2: "",
        landmark: "",
        area: "",
        city: "",
        state: "",
        postal_code: "",
        country: "India",
        pincode: "",
        district: "",
        locality: "",
        address_type: "shipping",
        is_primary: false,
        is_default_shipping: true,
        is_default_billing: false,
        delivery_instructions: "",
        landmark_description: "",
      });
    } catch (error) {
      console.error("Error creating address:", error);
      toast.error("Failed to create address");
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof CreateUserAddressInput,
    value: string | boolean
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatAddress = (address: UserAddress) => {
    const parts = [
      address.address_line_1,
      address.address_line_2,
      address.area,
      address.city,
      address.state,
      address.postal_code
    ].filter(Boolean);
    
    return parts.join(", ");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">Shipping to</span>
      </div>
      
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerOverlay className="!z-[60]" />
          <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left h-auto p-3 hover:bg-muted/50 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Loading addresses...</span>
              </div>
            ) : selectedAddress ? (
              <div className="flex items-start gap-3 w-full">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-foreground">{selectedAddress.full_name}</div>
                  <div className="text-xs text-muted-foreground truncate leading-relaxed">
                    {formatAddress(selectedAddress)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>Add shipping address</span>
              </div>
            )}
          </Button>
        </DrawerTrigger>
        
        <DrawerContent className="pb-20 !mt-20 !z-[60]" style={{ paddingBottom: "calc(4rem + env(safe-area-inset-bottom) + 1rem)" }}>
          <DrawerHeader>
            <DrawerTitle>Shipping Address</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">
              {!showForm ? (
                <div className="space-y-3">
                  {addresses.length > 0 ? (
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          onClick={() => handleAddressSelect(address)}
                          className={`p-3 rounded-md border cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
                            selectedAddress?.id === address.id
                              ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                              : "border-border hover:border-muted-foreground/50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-foreground">{address.full_name}</div>
                              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                {formatAddress(address)}
                              </div>
                              {address.is_default_shipping && (
                                <div className="inline-flex items-center gap-1 text-xs text-primary mt-2 font-medium">
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                  Default shipping
                                </div>
                              )}
                            </div>
                            {selectedAddress?.id === address.id && (
                              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                <Check className="w-3 h-3 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No addresses found</p>
                    </div>
                  )}
                  
                  <Button
                    onClick={() => setShowForm(true)}
                    className="w-full"
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Address
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="full_name">Full Name *</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => handleInputChange("full_name", e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="phone_number">Phone *</Label>
                        <Input
                          id="phone_number"
                          value={formData.phone_number}
                          onChange={(e) => handleInputChange("phone_number", e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="address_line_1">Address Line 1 *</Label>
                      <Input
                        id="address_line_1"
                        value={formData.address_line_1}
                        onChange={(e) => handleInputChange("address_line_1", e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="address_line_2">Address Line 2</Label>
                      <Input
                        id="address_line_2"
                        value={formData.address_line_2}
                        onChange={(e) => handleInputChange("address_line_2", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => handleInputChange("state", e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="postal_code">Postal Code *</Label>
                        <Input
                          id="postal_code"
                          value={formData.postal_code}
                          onChange={(e) => handleInputChange("postal_code", e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          id="pincode"
                          value={formData.pincode}
                          onChange={(e) => handleInputChange("pincode", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="delivery_instructions">Delivery Instructions</Label>
                      <Textarea
                        id="delivery_instructions"
                        value={formData.delivery_instructions}
                        onChange={(e) => handleInputChange("delivery_instructions", e.target.value)}
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_default_shipping"
                        checked={formData.is_default_shipping}
                        onCheckedChange={(checked) => handleInputChange("is_default_shipping", checked as boolean)}
                      />
                      <Label htmlFor="is_default_shipping" className="text-sm">
                        Set as default shipping address
                      </Label>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="flex-1"
                      size="sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isFormLoading}
                      className="flex-1"
                      size="sm"
                    >
                      {isFormLoading ? "Saving..." : "Save Address"}
                    </Button>
                  </div>
                </form>
              )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
