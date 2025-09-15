"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Database } from "@/utils/supabase/database.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle } from "lucide-react";

type BuyLead = Database["public"]["Tables"]["buy_leads"]["Row"];

enum StatusColor {
  responded = "bg-emerald-100 text-emerald-700",
  closed = "bg-zinc-200 text-zinc-700",
  cancelled = "bg-red-100 text-red-700",
  submitted = "bg-amber-100 text-amber-700",
  viewed = "bg-amber-100 text-amber-700",
}

export default function AccountBuyLeadsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<BuyLead[]>([]);
  const [responsesByLead, setResponsesByLead] = useState<
    Record<
      string,
      Array<{
        id: string;
        quoted_price: number | null;
        min_qty: number | null;
        message: string | null;
        created_at: string;
      }>
    >
  >({});

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
          .eq("buyer_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        const leads = data || [];
        setItems(leads);

        if (leads.length > 0) {
          const { data: resp, error: respErr } = await supabase
            .from("buy_lead_responses")
            .select(
              "id, buy_lead_id, quoted_price, min_qty, message, created_at"
            )
            .in(
              "buy_lead_id",
              leads.map((l) => l.id)
            );
          if (respErr) throw respErr;
          const map: Record<string, Array<any>> = {};
          (resp || []).forEach((r) => {
            const arr = map[r.buy_lead_id] || [];
            arr.push(r);
            map[r.buy_lead_id] = arr;
          });
          setResponsesByLead(map);
        }
      } catch (e: any) {
        setError(e.message || "Failed to load buy leads");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Sticky header */}
      <div className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-4 py-3 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-primary" />
        <div>
          <div className="text-base font-semibold leading-tight">
            My Buy Leads
          </div>
          <div className="text-xs text-muted-foreground">
            Your RFQs and supplier responses
          </div>
        </div>
      </div>

      <Card className="border-muted mx-4 mt-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-base md:text-lg">
            Requests for Quote
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : error ? (
            <div className="text-sm text-destructive">{error}</div>
          ) : items.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              You have not submitted any buy leads yet.
            </div>
          ) : (
            <ScrollArea className="h-[70vh] pr-2">
              <div className="space-y-4">
                {items.map((lead) => (
                  <div key={lead.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src="/placeholder-profile.png"
                            alt="supplier"
                          />
                          <AvatarFallback>BL</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="font-semibold truncate">
                            {lead.product_name || "Product"} ·{" "}
                            {lead.supplier_name || "Supplier"}
                          </div>
                          {/* High-signal badges */}
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <Badge className="bg-primary/10 text-primary border border-primary/20">
                              Qty {lead.quantity_required ?? "-"}
                            </Badge>
                            <Badge className="bg-emerald-600 text-white">
                              Target ₹{lead.target_price ?? "-"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Badge
                        className={
                          StatusColor[
                            lead.status as keyof typeof StatusColor
                          ] || "bg-zinc-200 text-zinc-700"
                        }
                      >
                        {lead.status}
                      </Badge>
                    </div>

                    {/* Low-signal details */}
                    <div className="grid gap-2 text-sm mt-3">
                      {(lead.delivery_pincode || lead.delivery_city) && (
                        <div className="text-muted-foreground">
                          Delivery: {lead.delivery_city || ""}{" "}
                          {lead.delivery_pincode || ""}
                        </div>
                      )}
                      {lead.customization && (
                        <div className="text-muted-foreground truncate">
                          Customization: {JSON.stringify(lead.customization)}
                        </div>
                      )}
                      {lead.notes && (
                        <div className="text-muted-foreground">
                          Notes: {lead.notes}
                        </div>
                      )}
                      {(lead.contact_email || lead.contact_phone) && (
                        <div className="text-muted-foreground">
                          Contact: {lead.contact_email || ""}{" "}
                          {lead.contact_phone || ""}
                        </div>
                      )}
                    </div>

                    {/* Responses */}
                    {responsesByLead[lead.id] &&
                      responsesByLead[lead.id].length > 0 && (
                        <div className="mt-4 border-t pt-3 space-y-2">
                          <div className="text-xs font-medium text-muted-foreground">
                            Supplier responses (
                            {responsesByLead[lead.id].length})
                          </div>
                          {responsesByLead[lead.id]
                            .slice()
                            .sort(
                              (a, b) =>
                                new Date(b.created_at).getTime() -
                                new Date(a.created_at).getTime()
                            )
                            .map((r) => (
                              <div
                                key={r.id}
                                className="rounded-md border px-3 py-2 text-sm bg-muted/30"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="font-medium">
                                    Supplier response
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {new Date(r.created_at).toLocaleString()}
                                  </div>
                                </div>
                                <div className="text-muted-foreground mt-1">
                                  {r.message || "—"}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1 flex gap-2">
                                  {r.quoted_price != null && (
                                    <Badge className="bg-emerald-600 text-white">
                                      Quoted ₹{r.quoted_price}
                                    </Badge>
                                  )}
                                  {r.min_qty != null && (
                                    <Badge className="bg-primary/10 text-primary border border-primary/20">
                                      Min qty {r.min_qty}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
