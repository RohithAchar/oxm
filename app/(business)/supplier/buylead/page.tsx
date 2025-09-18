"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/utils/supabase/client";
import { PageHeader } from "@/components/PageHeader";

type BuyLead = {
  id: string;
  product_name: string | null;
  quantity_required: number | null;
  target_price: number | null; // stored in paise
  currency: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  delivery_city: string | null;
  delivery_pincode: string | null;
  status: string | null;
  created_at: string | null;
};

export default function BuyLeadPage() {
  const [leads, setLeads] = useState<BuyLead[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("buy_leads")
          .select(
            "id, product_name, quantity_required, target_price, currency, contact_email, contact_phone, delivery_city, delivery_pincode, status, created_at"
          )
          .eq("supplier_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setLeads((data as unknown as BuyLead[]) || []);
      } catch (e: any) {
        setError(e.message || "Failed to load buy leads");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatPrice = (paise: number | null | undefined) => {
    if (!paise && paise !== 0) return "-";
    const rupees = (Number(paise) / 100).toFixed(2);
    return `₹${rupees}`;
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Buy Leads" description="RFQs received from buyers." />

      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Received RFQs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Target Price</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-6 text-center text-muted-foreground"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              )}
              {!loading && error && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-6 text-center text-destructive"
                  >
                    {error}
                  </TableCell>
                </TableRow>
              )}
              {!loading && !error && leads && leads.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-6 text-center text-muted-foreground"
                  >
                    No RFQs received yet.
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                !error &&
                leads &&
                leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="text-muted-foreground">
                      {lead.created_at
                        ? new Date(lead.created_at).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {lead.product_name || "-"}
                    </TableCell>
                    <TableCell>{lead.quantity_required ?? "-"}</TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(lead.target_price)}
                    </TableCell>
                    <TableCell>
                      {lead.contact_email || lead.contact_phone || "-"}
                    </TableCell>
                    <TableCell>
                      {lead.delivery_city || ""}
                      {lead.delivery_city && lead.delivery_pincode ? ", " : ""}
                      {lead.delivery_pincode || ""}
                    </TableCell>
                    <TableCell className="capitalize">
                      {lead.status || "submitted"}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
