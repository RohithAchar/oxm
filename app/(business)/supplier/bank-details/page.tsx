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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit, Trash2, CreditCard, Building2 } from "lucide-react";

// Bank Account Types
interface BankAccount {
  id: string;
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  accountType: "SAVINGS" | "CURRENT" | "BUSINESS";
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

// Form Data Type
interface BankAccountFormData {
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  accountType: "SAVINGS" | "CURRENT" | "BUSINESS";
}

const initialFormData: BankAccountFormData = {
  accountHolderName: "",
  accountNumber: "",
  bankName: "",
  ifscCode: "",
  accountType: "SAVINGS",
};

export default function BankDetailsPage() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(
    null
  );
  const [formData, setFormData] =
    useState<BankAccountFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockAccounts: BankAccount[] = [
      {
        id: "1",
        accountHolderName: "John Doe",
        accountNumber: "1234567890",
        bankName: "State Bank of India",
        ifscCode: "SBIN0001234",
        accountType: "BUSINESS",
        isPrimary: true,
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "2",
        accountHolderName: "John Doe",
        accountNumber: "9876543210",
        bankName: "HDFC Bank",
        ifscCode: "HDFC0001234",
        accountType: "SAVINGS",
        isPrimary: false,
        createdAt: "2024-01-20T14:45:00Z",
        updatedAt: "2024-01-20T14:45:00Z",
      },
    ];
    setBankAccounts(mockAccounts);
  }, []);

  const handleInputChange = (
    field: keyof BankAccountFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingAccount(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (editingAccount) {
        // Update existing account
        const updatedAccount: BankAccount = {
          ...editingAccount,
          ...formData,
          updatedAt: new Date().toISOString(),
        };

        setBankAccounts((prev) =>
          prev.map((account) =>
            account.id === editingAccount.id ? updatedAccount : account
          )
        );
        toast.success("Bank account updated successfully!");
      } else {
        // Add new account
        const newAccount: BankAccount = {
          id: Date.now().toString(),
          ...formData,
          isPrimary: bankAccounts.length === 0, // First account is primary
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setBankAccounts((prev) => [...prev, newAccount]);
        toast.success("Bank account added successfully!");
      }

      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to save bank account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (account: BankAccount) => {
    setEditingAccount(account);
    setFormData({
      accountHolderName: account.accountHolderName,
      accountNumber: account.accountNumber,
      bankName: account.bankName,
      ifscCode: account.ifscCode,
      accountType: account.accountType,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (accountId: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setBankAccounts((prev) =>
        prev.filter((account) => account.id !== accountId)
      );
      toast.success("Bank account deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete bank account. Please try again.");
    }
  };

  const handleSetPrimary = async (accountId: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setBankAccounts((prev) =>
        prev.map((account) => ({
          ...account,
          isPrimary: account.id === accountId,
        }))
      );
      toast.success("Primary account updated successfully!");
    } catch (error) {
      toast.error("Failed to update primary account. Please try again.");
    }
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <main className="space-y-4 md:space-y-6 pb-24 md:pb-12">
      <div className="pt-2 md:pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-3xl font-bold tracking-tight">
              Bank Details
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Manage your bank accounts for payments and transactions.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openAddDialog}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Bank Account
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingAccount
                    ? "Edit Bank Account"
                    : "Add New Bank Account"}
                </DialogTitle>
                <DialogDescription>
                  {editingAccount
                    ? "Update your bank account information."
                    : "Add a new bank account for receiving payments."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accountHolderName">Account Holder Name</Label>
                  <Input
                    id="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={(e) =>
                      handleInputChange("accountHolderName", e.target.value)
                    }
                    placeholder="Enter account holder name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) =>
                      handleInputChange("accountNumber", e.target.value)
                    }
                    placeholder="Enter account number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) =>
                      handleInputChange("bankName", e.target.value)
                    }
                    placeholder="Enter bank name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ifscCode">IFSC Code</Label>
                  <Input
                    id="ifscCode"
                    value={formData.ifscCode}
                    onChange={(e) =>
                      handleInputChange(
                        "ifscCode",
                        e.target.value.toUpperCase()
                      )
                    }
                    placeholder="Enter IFSC code"
                    required
                    className="uppercase"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select
                    value={formData.accountType}
                    onValueChange={(
                      value: "SAVINGS" | "CURRENT" | "BUSINESS"
                    ) => handleInputChange("accountType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SAVINGS">Savings</SelectItem>
                      <SelectItem value="CURRENT">Current</SelectItem>
                      <SelectItem value="BUSINESS">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Saving..."
                      : editingAccount
                      ? "Update"
                      : "Add Account"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border-t" />

      {/* Bank Accounts List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Your Bank Accounts
          </CardTitle>
          <CardDescription>
            Manage your bank accounts for receiving payments from buyers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bankAccounts.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Bank Accounts</h3>
              <p className="text-muted-foreground mb-4">
                Add your first bank account to start receiving payments.
              </p>
              <Button
                onClick={openAddDialog}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Bank Account
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Holder</TableHead>
                    <TableHead>Account Number</TableHead>
                    <TableHead>Bank Name</TableHead>
                    <TableHead>IFSC Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bankAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">
                        {account.accountHolderName}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        ****{account.accountNumber.slice(-4)}
                      </TableCell>
                      <TableCell>{account.bankName}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {account.ifscCode}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{account.accountType}</Badge>
                      </TableCell>
                      <TableCell>
                        {account.isPrimary ? (
                          <Badge variant="default">Primary</Badge>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetPrimary(account.id)}
                            className="text-xs"
                          >
                            Set Primary
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(account)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={account.isPrimary}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Bank Account
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this bank
                                  account? This action cannot be undone.
                                  <br />
                                  <br />
                                  <strong>Account:</strong> {account.bankName} -
                                  ****{account.accountNumber.slice(-4)}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(account.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Important Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-sm text-muted-foreground">
              Your primary bank account will be used for all payments and
              transactions by default.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-sm text-muted-foreground">
              You can have multiple bank accounts but only one can be set as
              primary.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-sm text-muted-foreground">
              All bank account information is encrypted and securely stored.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-sm text-muted-foreground">
              You cannot delete your primary bank account. Set another account
              as primary first.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
