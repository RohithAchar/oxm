"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { Loader2, CreditCard, CheckCircle2 } from "lucide-react";
import { Badge } from "../ui/badge";

interface PayoutBeneficiaryFormProps {
  onSubmit: (formData: any) => Promise<void>;
  onCancel?: () => void;
  submitting?: boolean;
  supplierBusinessId: string;
}

export function PayoutBeneficiaryForm({
  onSubmit,
  onCancel,
  submitting = false,
  supplierBusinessId,
}: PayoutBeneficiaryFormProps) {
  const [formData, setFormData] = useState({
    beneficiary_id: `SB_${supplierBusinessId
      .slice(0, 8)
      .toUpperCase()}_${Date.now().toString().slice(-6)}`,
    beneficiary_name: "",
    bank_account_number: "",
    bank_ifsc: "",
    vpa: "",
    beneficiary_email: "",
    beneficiary_phone: "",
    beneficiary_country_code: "+91",
    beneficiary_address: "",
    beneficiary_city: "",
    beneficiary_state: "",
    beneficiary_postal_code: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.beneficiary_name.trim()) {
      toast.error("Beneficiary name is required");
      return;
    }
    if (!formData.bank_account_number.trim()) {
      toast.error("Bank account number is required");
      return;
    }
    if (!formData.bank_ifsc.trim()) {
      toast.error("IFSC code is required");
      return;
    }

    const payload = {
      beneficiary_id: formData.beneficiary_id,
      beneficiary_name: formData.beneficiary_name,
      beneficiary_instrument_details: {
        bank_account_number: formData.bank_account_number.replace(/\s/g, ""),
        bank_ifsc: formData.bank_ifsc.toUpperCase().replace(/\s/g, ""),
        vpa: formData.vpa.trim() || null,
      },
      beneficiary_contact_details: {
        beneficiary_email: formData.beneficiary_email.trim() || null,
        beneficiary_phone:
          formData.beneficiary_phone.replace(/\D/g, "") || null,
        beneficiary_country_code: formData.beneficiary_country_code || "+91",
        beneficiary_address: formData.beneficiary_address.trim() || null,
        beneficiary_city: formData.beneficiary_city.trim() || null,
        beneficiary_state: formData.beneficiary_state.trim() || null,
        beneficiary_postal_code:
          formData.beneficiary_postal_code.trim() || null,
      },
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="beneficiary_id">Beneficiary ID</Label>
            <Input
              id="beneficiary_id"
              value={formData.beneficiary_id}
              onChange={(e) =>
                handleInputChange("beneficiary_id", e.target.value)
              }
              placeholder="Auto-generated"
              disabled={submitting}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Unique identifier for this beneficiary (auto-generated)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="beneficiary_name">
              Beneficiary Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="beneficiary_name"
              value={formData.beneficiary_name}
              onChange={(e) =>
                handleInputChange("beneficiary_name", e.target.value)
              }
              placeholder="John Doe"
              disabled={submitting}
              required
            />
            <p className="text-xs text-muted-foreground">
              Name as it appears on bank account
            </p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Bank Account Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bank_account_number">
                Account Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="bank_account_number"
                type="text"
                inputMode="numeric"
                value={formData.bank_account_number}
                onChange={(e) =>
                  handleInputChange(
                    "bank_account_number",
                    e.target.value.replace(/\D/g, "")
                  )
                }
                placeholder="1234567890"
                disabled={submitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bank_ifsc">
                IFSC Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="bank_ifsc"
                type="text"
                value={formData.bank_ifsc}
                onChange={(e) =>
                  handleInputChange(
                    "bank_ifsc",
                    e.target.value.toUpperCase().replace(/\s/g, "")
                  )
                }
                placeholder="HDFC0000001"
                disabled={submitting}
                required
                maxLength={11}
                className="uppercase"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vpa">UPI VPA (Optional)</Label>
              <Input
                id="vpa"
                type="text"
                value={formData.vpa}
                onChange={(e) => handleInputChange("vpa", e.target.value)}
                placeholder="yourname@upi"
                disabled={submitting}
              />
              <p className="text-xs text-muted-foreground">
                UPI Virtual Payment Address (optional)
              </p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold mb-4">Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="beneficiary_email">Email</Label>
              <Input
                id="beneficiary_email"
                type="email"
                value={formData.beneficiary_email}
                onChange={(e) =>
                  handleInputChange("beneficiary_email", e.target.value)
                }
                placeholder="sample@cashfree.com"
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="beneficiary_phone">Phone Number</Label>
              <div className="flex gap-2">
                <Input
                  id="beneficiary_country_code"
                  value={formData.beneficiary_country_code}
                  onChange={(e) =>
                    handleInputChange(
                      "beneficiary_country_code",
                      e.target.value
                    )
                  }
                  disabled={submitting}
                  className="w-20"
                />
                <Input
                  id="beneficiary_phone"
                  type="tel"
                  inputMode="numeric"
                  value={formData.beneficiary_phone}
                  onChange={(e) =>
                    handleInputChange(
                      "beneficiary_phone",
                      e.target.value.replace(/\D/g, "").slice(0, 10)
                    )
                  }
                  placeholder="9876543210"
                  disabled={submitting}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="beneficiary_address">Address</Label>
              <Input
                id="beneficiary_address"
                value={formData.beneficiary_address}
                onChange={(e) =>
                  handleInputChange("beneficiary_address", e.target.value)
                }
                placeholder="177A Bleecker Street"
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="beneficiary_city">City</Label>
              <Input
                id="beneficiary_city"
                value={formData.beneficiary_city}
                onChange={(e) =>
                  handleInputChange("beneficiary_city", e.target.value)
                }
                placeholder="New York City"
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="beneficiary_state">State</Label>
              <Input
                id="beneficiary_state"
                value={formData.beneficiary_state}
                onChange={(e) =>
                  handleInputChange("beneficiary_state", e.target.value)
                }
                placeholder="New York"
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="beneficiary_postal_code">Postal Code</Label>
              <Input
                id="beneficiary_postal_code"
                type="text"
                inputMode="numeric"
                value={formData.beneficiary_postal_code}
                onChange={(e) =>
                  handleInputChange(
                    "beneficiary_postal_code",
                    e.target.value.replace(/\D/g, "")
                  )
                }
                placeholder="560011"
                disabled={submitting}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-4 border-t">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Beneficiary
        </Button>
      </div>
    </form>
  );
}
