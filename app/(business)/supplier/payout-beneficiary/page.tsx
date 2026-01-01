"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { PayoutBeneficiaryForm } from "@/components/supplier/payout-beneficiary-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, CreditCard, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Beneficiary {
  id: string;
  cashfree_beneficiary_id: string;
  beneficiary_name: string;
  beneficiary_status: string;
  bank_account_number: string;
  bank_ifsc: string;
  vpa: string | null;
  beneficiary_email: string | null;
  beneficiary_phone: string | null;
  added_on: string;
  created_at: string;
}

export default function PayoutBeneficiaryPage() {
  const [supplierBusinessId, setSupplierBusinessId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          toast.error("Please log in to continue");
          return;
        }

        // Get supplier business for the user
        const { data: supplierBusiness } = await supabase
          .from("supplier_businesses")
          .select("id")
          .eq("profile_id", user.id)
          .single();

        if (!supplierBusiness) {
          toast.error("Supplier business not found");
          return;
        }

        setSupplierBusinessId(supplierBusiness.id);

        // Fetch beneficiaries
        const response = await fetch("/api/supplier/payout-beneficiary");
        if (response.ok) {
          const data = await response.json();
          setBeneficiaries(data.beneficiaries || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (formData: any) => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/supplier/payout-beneficiary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create beneficiary");
      }

      const data = await response.json();
      toast.success("Payout beneficiary created successfully!");
      
      // Refresh beneficiaries list
      const refreshResponse = await fetch("/api/supplier/payout-beneficiary");
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        setBeneficiaries(refreshData.beneficiaries || []);
      }

      setShowForm(false);
    } catch (error: any) {
      console.error("Error creating beneficiary:", error);
      toast.error(error.message || "Failed to create beneficiary");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "VERIFIED":
        return (
          <Badge variant="default" className="bg-green-600">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="secondary">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Pending
          </Badge>
        );
      case "FAILED":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <main className="space-y-4 md:space-y-6 pb-24 md:pb-12">
        <div className="pt-2 md:pt-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-3xl font-bold tracking-tight">
                Payout Beneficiary
              </h1>
              <p className="text-muted-foreground mt-1 text-sm md:text-base">
                Register your bank account to receive payments
              </p>
            </div>
          </div>
        </div>
        <div className="border-t" />
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </main>
    );
  }

  if (!supplierBusinessId) {
    return null;
  }

  return (
    <main className="space-y-4 md:space-y-6 pb-24 md:pb-12">
      <div className="pt-2 md:pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-3xl font-bold tracking-tight">
              Payout Beneficiary
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Register your bank account with Cashfree to receive payments from
              orders
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Beneficiary
            </Button>
          </div>
        </div>
      </div>
      <div className="border-t" />

      {/* Beneficiaries List */}
      {beneficiaries.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No Beneficiaries Added
            </h3>
            <p className="text-muted-foreground text-center mb-4 text-sm md:text-base">
              Add your bank account details to start receiving payments from
              orders
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Beneficiary
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:gap-6">
          {beneficiaries.map((beneficiary) => (
            <Card key={beneficiary.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {beneficiary.beneficiary_name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {beneficiary.cashfree_beneficiary_id}
                    </CardDescription>
                  </div>
                  {getStatusBadge(beneficiary.beneficiary_status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Account Number</p>
                    <p className="font-mono font-medium">
                      ****{beneficiary.bank_account_number.slice(-4)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">IFSC Code</p>
                    <p className="font-mono font-medium">
                      {beneficiary.bank_ifsc}
                    </p>
                  </div>
                  {beneficiary.vpa && (
                    <div>
                      <p className="text-muted-foreground">UPI VPA</p>
                      <p className="font-medium">{beneficiary.vpa}</p>
                    </div>
                  )}
                  {beneficiary.beneficiary_email && (
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">{beneficiary.beneficiary_email}</p>
                    </div>
                  )}
                  {beneficiary.beneficiary_phone && (
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">{beneficiary.beneficiary_phone}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground">Added On</p>
                    <p className="font-medium">
                      {new Date(beneficiary.added_on).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Beneficiary Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Payout Beneficiary</DialogTitle>
            <DialogDescription>
              Register your bank account with Cashfree to receive payments. All
              information will be securely stored and verified.
            </DialogDescription>
          </DialogHeader>
          <PayoutBeneficiaryForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
            submitting={submitting}
            supplierBusinessId={supplierBusinessId}
          />
        </DialogContent>
      </Dialog>
    </main>
  );
}



