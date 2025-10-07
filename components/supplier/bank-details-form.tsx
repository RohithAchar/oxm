"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

interface BankDetailsFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  submitting: boolean;
}

export function BankDetailsForm({
  onSubmit,
  onCancel,
  submitting,
}: BankDetailsFormProps) {
  const [formData, setFormData] = useState({
    account_holder_name: "",
    account_number: "",
    ifsc_code: "",
    account_type: "savings",
    phone: "",
    is_primary: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.account_holder_name.trim()) {
      newErrors.account_holder_name = "Account holder name is required";
    }

    if (!formData.account_number.trim()) {
      newErrors.account_number = "Account number is required";
    } else if (!/^\d{9,18}$/.test(formData.account_number)) {
      newErrors.account_number = "Account number must be 9-18 digits";
    }

    if (!formData.ifsc_code.trim()) {
      newErrors.ifsc_code = "IFSC code is required";
    } else if (
      !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc_code.toUpperCase())
    ) {
      newErrors.ifsc_code = "Invalid IFSC code format";
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        ifsc_code: formData.ifsc_code.toUpperCase(),
      });
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Account Holder Name */}
        <div className="space-y-2">
          <Label htmlFor="account_holder_name">Account Holder Name *</Label>
          <Input
            id="account_holder_name"
            value={formData.account_holder_name}
            onChange={(e) =>
              handleInputChange("account_holder_name", e.target.value)
            }
            placeholder="Enter account holder name"
            className={errors.account_holder_name ? "border-red-500" : ""}
          />
          {errors.account_holder_name && (
            <p className="text-sm text-red-500">{errors.account_holder_name}</p>
          )}
        </div>

        {/* Account Number */}
        <div className="space-y-2">
          <Label htmlFor="account_number">Account Number *</Label>
          <Input
            id="account_number"
            value={formData.account_number}
            onChange={(e) =>
              handleInputChange(
                "account_number",
                e.target.value.replace(/\D/g, "")
              )
            }
            placeholder="Enter account number"
            className={errors.account_number ? "border-red-500" : ""}
          />
          {errors.account_number && (
            <p className="text-sm text-red-500">{errors.account_number}</p>
          )}
        </div>

        {/* IFSC Code */}
        <div className="space-y-2">
          <Label htmlFor="ifsc_code">IFSC Code *</Label>
          <Input
            id="ifsc_code"
            value={formData.ifsc_code}
            onChange={(e) =>
              handleInputChange("ifsc_code", e.target.value.toUpperCase())
            }
            placeholder="e.g., SBIN0001234"
            className={errors.ifsc_code ? "border-red-500" : ""}
            maxLength={11}
          />
          {errors.ifsc_code && (
            <p className="text-sm text-red-500">{errors.ifsc_code}</p>
          )}
        </div>

        {/* Account Type */}
        <div className="space-y-2">
          <Label htmlFor="account_type">Account Type *</Label>
          <Select
            value={formData.account_type}
            onValueChange={(value) => handleInputChange("account_type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="savings">Savings</SelectItem>
              <SelectItem value="current">Current</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number (Optional)</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) =>
              handleInputChange("phone", e.target.value.replace(/\D/g, ""))
            }
            placeholder="Enter phone number"
            className={errors.phone ? "border-red-500" : ""}
            maxLength={10}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Primary Account Checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_primary"
          checked={formData.is_primary}
          onCheckedChange={(checked) =>
            handleInputChange("is_primary", checked as boolean)
          }
        />
        <Label htmlFor="is_primary" className="text-sm">
          Set as primary account for receiving payments
        </Label>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 md:pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto"
        >
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Bank Account
        </Button>
      </div>
    </form>
  );
}
