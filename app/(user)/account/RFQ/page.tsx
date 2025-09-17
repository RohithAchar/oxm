"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Database } from "@/utils/supabase/database.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, MessageSquare } from "lucide-react";
import { EnhancedBuyLeadCard } from "@/components/rfq/enhanced-buy-lead-card";
import { EnhancedResponseCard } from "@/components/rfq/enhanced-response-card";
import { StatusFilter } from "@/components/rfq/status-filter";
import { RFQHeader } from "@/components/rfq/rfq-header";

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
      Array<Database["public"]["Tables"]["buy_lead_responses"]["Row"]>
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
          .select(
            `
            *,
            product_snapshot,
            buyer_snapshot
          `
          )
          .eq("buyer_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        const leads = data || [];
        setItems(leads);

        if (leads.length > 0) {
          const { data: resp, error: respErr } = await supabase
            .from("buy_lead_responses")
            .select(
              `
              id, 
              buy_lead_id, 
              quoted_price, 
              min_qty, 
              message, 
              created_at,
              supplier_snapshot
            `
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

  // Calculate counts for status filter
  const statusCounts = {
    all: items.length,
    submitted: items.filter((lead) => lead.status === "submitted").length,
    viewed: items.filter((lead) => lead.status === "viewed").length,
    responded: items.filter((lead) => lead.status === "responded").length,
    closed: items.filter((lead) => lead.status === "closed").length,
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6 text-[11px] sm:text-sm md:text-base leading-tight sm:leading-normal">
        {/* Header */}
        <RFQHeader
          title="RFQs"
          subtitle="Track your product requests and supplier responses to find the best deals"
          totalCount={items.length}
          variant="buyer"
        />

        {/* Status Filter */}
        {/* <div className="mb-6">
          <StatusFilter
            currentStatus="all"
            onStatusChange={() => {}}
            counts={statusCounts}
          />
        </div> */}

        {/* Content */}
        <div className="space-y-6">
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
          ) : items.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <div className="text-slate-400 mb-4">
                <MessageCircle className="h-12 w-12 mx-auto" />
              </div>
              <div className="text-lg font-semibold text-slate-900 mb-2">
                No Buy Leads Yet
              </div>
              <div className="text-slate-600 mb-6">
                You haven't submitted any product requests yet. Start by
                creating your first buy lead.
              </div>
              <Button className="px-6 py-3 rounded-xl">
                Create Your First Request
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((lead) => (
                <div key={lead.id} className="space-y-4">
                  <EnhancedBuyLeadCard
                    lead={lead}
                    variant="buyer"
                    showRespondButton={false}
                  />

                  {/* Responses */}
                  {responsesByLead[lead.id] &&
                    responsesByLead[lead.id].length > 0 && (
                      <div className="bg-white rounded-2xl p-6 border border-slate-200">
                        <div className="flex items-center gap-2 mb-4">
                          <MessageSquare className="h-5 w-5 text-slate-600" />
                          <div className="text-lg font-semibold text-slate-900">
                            Supplier Responses
                          </div>
                          <Badge variant="secondary" className="ml-2">
                            {responsesByLead[lead.id].length}
                          </Badge>
                        </div>
                        <div className="space-y-4">
                          {responsesByLead[lead.id]
                            .slice()
                            .sort(
                              (a, b) =>
                                new Date(b.created_at).getTime() -
                                new Date(a.created_at).getTime()
                            )
                            .map((r) => (
                              <EnhancedResponseCard
                                key={r.id}
                                response={r}
                                variant="buyer"
                                productId={lead.product_id || null}
                              />
                            ))}
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
