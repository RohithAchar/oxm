"use client";

import { useState } from "react";
import { BankDetailsList } from "@/components/supplier/bank-details/BankDetailsList";
import { BankDetailsForm } from "@/components/supplier/bank-details/BankDetailsForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BankAccount {
  id: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  bank_name: string;
  branch_name: string;
  account_type: "savings" | "current";
  verification_status: "pending" | "verified" | "failed" | "suspended";
  verification_message?: string;
  is_primary: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_verified_at?: string;
}

type ViewMode = "list" | "add" | "edit";

export default function BankDetailsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(
    null
  );
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddNew = () => {
    setEditingAccount(null);
    setViewMode("add");
  };

  const handleEdit = (account: BankAccount) => {
    setEditingAccount(account);
    setViewMode("edit");
  };

  const handleSuccess = (data: any) => {
    // Refresh the list and go back to list view
    setRefreshTrigger((prev) => prev + 1);
    setViewMode("list");
    setEditingAccount(null);
  };

  const handleCancel = () => {
    setViewMode("list");
    setEditingAccount(null);
  };

  return (
    <main className="space-y-4 md:space-y-6 pb-24 md:pb-12">
      {/* Header */}
      <div className="pt-2 md:pt-4">
        {viewMode !== "list" && (
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Bank Accounts
          </Button>
        )}

        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-3xl font-bold tracking-tight">
              {viewMode === "list" && "Payment Details"}
              {viewMode === "add" && "Add Bank Account"}
              {viewMode === "edit" && "Edit Bank Account"}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              {viewMode === "list" &&
                "Manage your bank accounts for receiving payments securely"}
              {viewMode === "add" &&
                "Add your bank account information to receive payments"}
              {viewMode === "edit" && "Update your bank account information"}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t" />

      {/* Content */}
      <div className="space-y-6">
        {viewMode === "list" && (
          <BankDetailsList
            onAddNew={handleAddNew}
            onEdit={handleEdit}
            refreshTrigger={refreshTrigger}
          />
        )}

        {viewMode === "add" && (
          <BankDetailsForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            isEditing={false}
          />
        )}

        {viewMode === "edit" && editingAccount && (
          <BankDetailsForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            isEditing={true}
            initialData={{
              id: editingAccount.id,
              account_holder_name: editingAccount.account_holder_name,
              account_number: editingAccount.account_number.replace(/\*/g, ""), // Remove masking for editing
              ifsc_code: editingAccount.ifsc_code,
              account_type: editingAccount.account_type,
              is_primary: editingAccount.is_primary,
            }}
          />
        )}
      </div>
    </main>
  );
}
