"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { BankDetailsManager } from "@/components/supplier/bank-details-manager";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BankDetailsPage() {
  const [supplierBusinessId, setSupplierBusinessId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSupplierBusiness = async () => {
      try {
        const supabase = createClient();
        const { data: user } = await supabase.auth.getUser();

        if (!user.user) {
          router.push("/login");
          return;
        }

        // Get supplier business for the user
        const { data: supplierBusiness } = await supabase
          .from("supplier_businesses")
          .select("id, business_name")
          .eq("profile_id", user.user.id)
          .single();

        if (!supplierBusiness) {
          router.push("/create-business");
          return;
        }

        setSupplierBusinessId(supplierBusiness.id);
      } catch (error) {
        console.error("Error fetching supplier business:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierBusiness();
  }, [router]);

  if (loading) {
    return (
      <main className="space-y-4 md:space-y-6 pb-24 md:pb-12">
        <div className="pt-2 md:pt-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-3xl font-bold tracking-tight">
                Bank Details
              </h1>
              <p className="text-muted-foreground mt-1 text-sm md:text-base">
                Manage your bank account details for receiving payments from
                orders
              </p>
            </div>
          </div>
        </div>
        <div className="border-t" />
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
              Bank Details
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Manage your bank account details for receiving payments from
              orders
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button
              onClick={() => {
                const event = new CustomEvent("showBankForm");
                window.dispatchEvent(event);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Bank Account
            </Button>
          </div>
        </div>
      </div>
      <div className="border-t" />

      <BankDetailsManager supplierBusinessId={supplierBusinessId} />
    </main>
  );
}
