"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BankAccount {
  id: string;
  account_holder_name: string;
  account_number: string; // Already masked from API
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

interface BankDetailsListProps {
  onAddNew: () => void;
  onEdit: (account: BankAccount) => void;
  refreshTrigger?: number;
}

export function BankDetailsList({
  onAddNew,
  onEdit,
  refreshTrigger,
}: BankDetailsListProps) {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchBankDetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/supplier/bank-details");
      const result = await response.json();

      if (response.ok && result.success) {
        setAccounts(result.data || []);
      } else {
        toast.error(result.error || "Failed to fetch bank details");
        setAccounts([]);
      }
    } catch (error) {
      console.error("Error fetching bank details:", error);
      toast.error("Failed to load bank details");
      setAccounts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBankDetails();
  }, [refreshTrigger]);

  const handleDelete = async (accountId: string) => {
    setIsDeleting(accountId);

    try {
      const response = await fetch(`/api/supplier/bank-details/${accountId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Bank account deleted successfully");
        await fetchBankDetails(); // Refresh the list
      } else {
        toast.error(result.error || "Failed to delete bank account");
      }
    } catch (error) {
      console.error("Error deleting bank account:", error);
      toast.error("Failed to delete bank account");
    } finally {
      setIsDeleting(null);
    }
  };

  const getVerificationStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 border-green-200"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 border-yellow-200"
          >
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge
            variant="destructive"
            className="bg-red-100 text-red-800 border-red-200"
          >
            <AlertCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      case "suspended":
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-800 border-gray-200"
          >
            <AlertCircle className="w-3 h-3 mr-1" />
            Suspended
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bank Accounts</h2>
          <p className="text-muted-foreground">
            Manage your bank accounts for receiving payments
          </p>
        </div>
        <Button onClick={onAddNew} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Bank Account
        </Button>
      </div>

      {/* Empty State */}
      {accounts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No Bank Accounts Added
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Add your bank account details to start receiving payments from
              customers. Your information is encrypted and secure.
            </p>
            <Button onClick={onAddNew} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Your First Bank Account
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Bank Accounts List */}
      {accounts.length > 0 && (
        <div className="grid gap-4">
          {accounts.map((account) => (
            <Card
              key={account.id}
              className={`relative ${
                account.is_primary ? "ring-2 ring-primary" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">
                        {account.bank_name}
                      </CardTitle>
                      {account.is_primary && (
                        <Badge
                          variant="default"
                          className="bg-primary/10 text-primary border-primary/20"
                        >
                          <Star className="w-3 h-3 mr-1" />
                          Primary
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      {account.branch_name}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getVerificationStatusBadge(account.verification_status)}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Account Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Account Holder</p>
                    <p className="font-medium">{account.account_holder_name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Account Number</p>
                    <p className="font-mono">{account.account_number}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">IFSC Code</p>
                    <p className="font-mono">{account.ifsc_code}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Account Type</p>
                    <p className="capitalize">{account.account_type} Account</p>
                  </div>
                </div>

                {/* Verification Message */}
                {account.verification_message && (
                  <Alert
                    className={
                      account.verification_status === "verified"
                        ? "border-green-200 bg-green-50"
                        : account.verification_status === "failed"
                        ? "border-red-200 bg-red-50"
                        : "border-yellow-200 bg-yellow-50"
                    }
                  >
                    <AlertDescription className="text-sm">
                      {account.verification_message}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                  <span>Added on {formatDate(account.created_at)}</span>
                  {account.last_verified_at && (
                    <span>
                      Verified on {formatDate(account.last_verified_at)}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(account)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={isDeleting === account.id}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Bank Account</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this bank account?
                          This action cannot be undone.
                          {account.is_primary && (
                            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                              <strong>Warning:</strong> This is your primary
                              account. Another account will be automatically set
                              as primary if available.
                            </div>
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(account.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Help Text */}
      {accounts.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Payment Processing:</strong> Payments will be automatically
            transferred to your primary account within 24 hours of successful
            delivery confirmation.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
