"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Database } from "@/utils/supabase/database.types";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, ChevronRight } from "lucide-react";
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
          .select("*")
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
    <div className="max-w-3xl mx-auto">
      {/* Sticky Mobile Header */}
      <div className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          <div>
            <div className="text-base font-semibold leading-tight">
              Buy Leads
            </div>
            <div className="text-xs text-muted-foreground">
              Incoming RFQs • {items.length}
            </div>
          </div>
        </div>
      </div>

      {/* Status chips */}
      <div className="px-4 py-2 border-b">
        <Tabs value={status} onValueChange={(v) => setStatus(v as TabKey)}>
          <TabsList className="w-full flex flex-wrap gap-2 bg-muted/50 p-1 rounded-lg">
            {TABS.map((s) => (
              <TabsTrigger
                key={s}
                value={s}
                className="text-xs py-2 px-3 shrink-0"
              >
                {s === "all"
                  ? "All"
                  : s === "awaiting"
                  ? "Awaiting"
                  : "Responded"}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Content list */}
      <div className="px-4 py-3 mt-2">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : error ? (
          <div className="text-sm text-destructive">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-sm text-muted-foreground">No buy leads.</div>
        ) : (
          <div className="space-y-2">
            {filtered.map((lead) => (
              <div
                key={lead.id}
                className={`w-full rounded-xl border bg-card px-3 py-3 shadow-sm ${
                  lead.status === "submitted" || lead.status === "viewed"
                    ? "border-primary/30"
                    : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/placeholder-profile.png" alt="buyer" />
                    <AvatarFallback>BL</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-semibold truncate text-sm">
                        {lead.product_name || "Product"}
                      </div>
                      <Badge
                        className={
                          lead.status === "responded"
                            ? "bg-emerald-100 text-emerald-700"
                            : lead.status === "closed"
                            ? "bg-zinc-200 text-zinc-700"
                            : lead.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }
                      >
                        {lead.status}
                      </Badge>
                    </div>

                    {/* High-signal row */}
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <Badge className="bg-primary/10 text-primary border border-primary/20">
                        Qty {lead.quantity_required ?? "-"}
                      </Badge>
                      <Badge className="bg-emerald-600 text-white">
                        Target ₹{lead.target_price ?? "-"}
                      </Badge>
                    </div>

                    {/* Low-signal row */}
                    {(lead.delivery_city || lead.delivery_pincode) && (
                      <div className="text-xs text-muted-foreground truncate mt-1">
                        {lead.delivery_city || ""} {lead.delivery_pincode || ""}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {(status === "all" || status === "awaiting") && (
                      <Dialog
                        open={Boolean(activeLeadId === lead.id && respondOpen)}
                        onOpenChange={(o) => {
                          if (!o) setActiveLeadId(null);
                          setRespondOpen(o);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            onClick={() => {
                              setActiveLeadId(lead.id);
                              setRespPrice("");
                              setRespMinQty("");
                              setRespMessage("");
                            }}
                          >
                            Respond
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Respond to RFQ</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label
                                  htmlFor="quoted_price"
                                  className="text-xs"
                                >
                                  Quoted price (₹)
                                </Label>
                                <Input
                                  id="quoted_price"
                                  inputMode="decimal"
                                  type="number"
                                  value={respPrice}
                                  onChange={(e) => setRespPrice(e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor="min_qty" className="text-xs">
                                  Minimum qty
                                </Label>
                                <Input
                                  id="min_qty"
                                  inputMode="numeric"
                                  type="number"
                                  value={respMinQty}
                                  onChange={(e) =>
                                    setRespMinQty(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="message" className="text-xs">
                                Message
                              </Label>
                              <Textarea
                                id="message"
                                placeholder="Notes for buyer"
                                value={respMessage}
                                onChange={(e) => setRespMessage(e.target.value)}
                              />
                            </div>
                            <div className="flex justify-end gap-2 pt-1">
                              <Button
                                variant="outline"
                                onClick={() => setRespondOpen(false)}
                                disabled={submitting}
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
                                    if (!user)
                                      throw new Error("Not authenticated");
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
                                    toast.success("Response sent");
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
                              >
                                Send
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    <ChevronRight className="h-4 w-4 text-muted-foreground mt-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
