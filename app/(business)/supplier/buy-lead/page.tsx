"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Database } from "@/utils/supabase/database.types";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { EnhancedBuyLeadCard } from "@/components/rfq/enhanced-buy-lead-card";
import { RFQHeader } from "@/components/rfq/rfq-header";

type BuyLead = Database["public"]["Tables"]["buy_leads"]["Row"];

// Minimal tabs for supplier: All, Awaiting (submitted/viewed), Responded
const TABS = ["all", "awaiting", "responded"] as const;

type TabKey = (typeof TABS)[number];

export default function SupplierBuyLeadPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<BuyLead[]>([]);
  const [status, setStatus] = useState<TabKey>("all");
  const [respondOpen, setRespondOpen] = useState(false);
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
  const [respPrice, setRespPrice] = useState<string>("");
  const [respMinQty, setRespMinQty] = useState<string>("");
  const [respMessage, setRespMessage] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const run = async () => {
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
            `
            *,
            product_snapshot,
            buyer_snapshot
          `
          )
          .eq("supplier_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setItems(data || []);
      } catch (e: any) {
        setError(e.message || "Failed to load buy leads");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const filtered = useMemo(() => {
    if (status === "all") return items;
    if (status === "awaiting") {
      return items.filter(
        (i) => i.status === "submitted" || i.status === "viewed"
      );
    }
    // responded
    return items.filter((i) => i.status === "responded");
  }, [items, status]);

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <RFQHeader
          title="Buy Leads"
          subtitle="Manage incoming product requests from buyers and respond with competitive quotes"
          totalCount={items.length}
          variant="supplier"
        />

        {/* Status Filter */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-2xl">
            {TABS.map((tab) => (
              <Button
                key={tab}
                variant="ghost"
                onClick={() => setStatus(tab)}
                className={`flex-1 rounded-xl font-medium transition-all duration-200 ${
                  status === tab
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                {tab === "all"
                  ? "All"
                  : tab === "awaiting"
                  ? "New"
                  : "Responded"}
              </Button>
            ))}
          </div>
        </div>

        {/* Content list */}
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <Skeleton className="h-6 w-1/3 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <Skeleton className="h-6 w-1/3 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              <div className="text-red-600 font-medium mb-2">
                Error Loading Buy Leads
              </div>
              <div className="text-sm text-red-500">{error}</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <div className="text-slate-400 mb-4">
                <MessageCircle className="h-12 w-12 mx-auto" />
              </div>
              <div className="text-lg font-semibold text-slate-900 mb-2">
                No Buy Leads Found
              </div>
              <div className="text-slate-600">
                {status === "all"
                  ? "You don't have any buy leads yet."
                  : status === "awaiting"
                  ? "No new requests at the moment."
                  : "No responded requests yet."}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((lead) => (
                <div key={lead.id}>
                  <EnhancedBuyLeadCard
                    lead={lead}
                    variant="supplier"
                    showRespondButton={
                      status === "all" || status === "awaiting"
                    }
                    onRespond={(leadId) => {
                      setActiveLeadId(leadId);
                      setRespPrice("");
                      setRespMinQty("");
                      setRespMessage("");
                      setRespondOpen(true);
                    }}
                  />

                  {/* Response Dialog */}
                  <Dialog
                    open={Boolean(activeLeadId === lead.id && respondOpen)}
                    onOpenChange={(o) => {
                      if (!o) setActiveLeadId(null);
                      setRespondOpen(o);
                    }}
                  >
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">
                          Respond to RFQ
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label
                              htmlFor="quoted_price"
                              className="text-sm font-medium text-slate-700"
                            >
                              Quoted price (₹)
                            </Label>
                            <Input
                              id="quoted_price"
                              inputMode="decimal"
                              type="number"
                              value={respPrice}
                              onChange={(e) => setRespPrice(e.target.value)}
                              className="mt-1"
                              placeholder="Enter price"
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor="min_qty"
                              className="text-sm font-medium text-slate-700"
                            >
                              Minimum qty
                            </Label>
                            <Input
                              id="min_qty"
                              inputMode="numeric"
                              type="number"
                              value={respMinQty}
                              onChange={(e) => setRespMinQty(e.target.value)}
                              className="mt-1"
                              placeholder="Enter quantity"
                            />
                          </div>
                        </div>
                        <div>
                          <Label
                            htmlFor="message"
                            className="text-sm font-medium text-slate-700"
                          >
                            Message
                          </Label>
                          <Textarea
                            id="message"
                            placeholder="Add a message for the buyer..."
                            value={respMessage}
                            onChange={(e) => setRespMessage(e.target.value)}
                            className="mt-1"
                            rows={3}
                          />
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                          <Button
                            variant="outline"
                            onClick={() => setRespondOpen(false)}
                            disabled={submitting}
                            className="px-6"
                          >
                            Cancel
                          </Button>
                          <Button
                            disabled={submitting}
                            onClick={async () => {
                              if (!activeLeadId) return;
                              try {
                                setSubmitting(true);
                                const supabase = createClient();
                                const {
                                  data: { user },
                                } = await supabase.auth.getUser();
                                if (!user) throw new Error("Not authenticated");
                                const { error } = await supabase
                                  .from("buy_lead_responses")
                                  .insert({
                                    buy_lead_id: activeLeadId,
                                    supplier_id: user.id,
                                    quoted_price: respPrice
                                      ? Number(respPrice)
                                      : null,
                                    min_qty: respMinQty
                                      ? Number(respMinQty)
                                      : null,
                                    message: respMessage || null,
                                    currency: "INR",
                                  });
                                if (error) throw error;
                                setItems((prev) =>
                                  prev.map((i) =>
                                    i.id === activeLeadId
                                      ? ({
                                          ...i,
                                          status: "responded",
                                        } as BuyLead)
                                      : i
                                  )
                                );
                                toast.success("Response sent successfully!");
                                setRespondOpen(false);
                                setActiveLeadId(null);
                              } catch (e: any) {
                                toast.error("Failed to respond", {
                                  description: e.message,
                                });
                              } finally {
                                setSubmitting(false);
                              }
                            }}
                            className="px-6"
                          >
                            {submitting ? "Sending..." : "Send Response"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
