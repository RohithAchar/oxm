"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BankDetailsForm } from "./bank-details-form";
import { BankDetailsCard } from "./bank-details-card";
import { Database } from "@/utils/supabase/database.types";
import { Loader2, Plus, CreditCard } from "lucide-react";
import { toast } from "sonner";

type SupplierBankDetails =
  Database["public"]["Tables"]["supplier_bank_details"]["Row"];

interface BankDetailsManagerProps {
  supplierBusinessId: string;
}

export function BankDetailsManager({
  supplierBusinessId,
}: BankDetailsManagerProps) {
  const [bankDetails, setBankDetails] = useState<SupplierBankDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchBankDetails = async () => {
    try {
      const response = await fetch("/api/supplier/bank-details", {
        cache: "no-store",
        headers: { "Cache-Control": "no-store" },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch bank details");
      }
      const data = await response.json();
      setBankDetails(data.bankDetails || []);
    } catch (error) {
      console.error("Error fetching bank details:", error);
      toast.error("Failed to load bank details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankDetails();
  }, []);

  useEffect(() => {
    const handleShowForm = () => {
      setShowForm(true);
    };

    window.addEventListener("showBankForm", handleShowForm);
    return () => {
      window.removeEventListener("showBankForm", handleShowForm);
    };
  }, []);

  const handleAddBankDetails = async (formData: any) => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/supplier/bank-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add bank details");
      }

      const data = await response.json();
      toast.success("Bank details added successfully");

      if (data.verificationInitiated) {
        toast.info("Bank verification initiated. This may take a few minutes.");
      } else if (data.verificationError) {
        toast.warning(
          "Bank details saved but verification failed. Please try again later."
        );
      }

      setShowForm(false);
      fetchBankDetails();
    } catch (error) {
      console.error("Error adding bank details:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add bank details"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyBankDetails = async (bankDetailsId: string) => {
    try {
      const response = await fetch(
        `/api/supplier/bank-details/${bankDetailsId}/verify`,
        {
          method: "POST",
          headers: { "Cache-Control": "no-store" },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to verify bank details");
      }

      const data = await response.json();
      toast.success("Bank verification status updated");
      fetchBankDetails();
    } catch (error) {
      console.error("Error verifying bank details:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to verify bank details"
      );
    }
  };

  const handleSetPrimary = async (bankDetailsId: string) => {
    try {
      const response = await fetch(
        `/api/supplier/bank-details/${bankDetailsId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
          body: JSON.stringify({ is_primary: true }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to set primary account");
      }

      toast.success("Primary account updated");
      fetchBankDetails();
    } catch (error) {
      console.error("Error setting primary account:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to set primary account"
      );
    }
  };

  const handleDeleteBankDetails = async (bankDetailsId: string) => {
    if (!confirm("Are you sure you want to delete this bank account?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/supplier/bank-details/${bankDetailsId}`,
        {
          method: "DELETE",
          headers: { "Cache-Control": "no-store" },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete bank details");
      }

      toast.success("Bank account deleted");
      fetchBankDetails();
    } catch (error) {
      console.error("Error deleting bank details:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete bank account"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Bank Details List */}
      {bankDetails.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No Bank Accounts Added
            </h3>
            <p className="text-muted-foreground text-center mb-4 text-sm md:text-base">
              Add your bank account details to start receiving payments from
              orders
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="w-full md:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Bank Account
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:gap-6">
          {bankDetails.map((details) => (
            <BankDetailsCard
              key={details.id}
              bankDetails={details}
              onVerify={() => handleVerifyBankDetails(details.id)}
              onSetPrimary={() => handleSetPrimary(details.id)}
              onDelete={() => handleDeleteBankDetails(details.id)}
            />
          ))}
        </div>
      )}

      {/* Add Bank Details Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Bank Account</DialogTitle>
            <DialogDescription>
              Enter your bank account details for verification and receiving
              payments
            </DialogDescription>
          </DialogHeader>
          <BankDetailsForm
            onSubmit={handleAddBankDetails}
            onCancel={() => setShowForm(false)}
            submitting={submitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
