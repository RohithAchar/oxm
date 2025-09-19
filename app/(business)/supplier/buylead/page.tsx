"use client";

import React, { JSX } from "react";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Database } from "@/utils/supabase/database.types";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { EnhancedBuyLeadCard } from "@/components/rfq/enhanced-buy-lead-card";

type BuyLead = Database["public"]["Tables"]["buy_leads"]["Row"];

const TABS = ["awaiting", "responded", "all"] as const;

type TabKey = (typeof TABS)[number];

export default function SupplierBuyLeadPage(): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<BuyLead[]>([]);
  const [status, setStatus] = useState<TabKey>("all");

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

        const leads = data || [];
        const productIds = Array.from(
          new Set(leads.map((l) => l.product_id).filter(Boolean) as string[])
        );
        const buyerIds = Array.from(
          new Set(leads.map((l) => l.buyer_id).filter(Boolean) as string[])
        );

        let productsById: Record<string, any> = {};
        if (productIds.length) {
          const { data: products } = await supabase
            .from("products")
            .select(
              "id,name,description,brand,price_per_unit,quantity,total_price,is_active"
            )
            .in("id", productIds);
          productsById = (products || []).reduce(
            (acc: Record<string, any>, p: any) => {
              acc[p.id] = p;
              return acc;
            },
            {}
          );
        }

        let buyersById: Record<string, any> = {};
        if (buyerIds.length) {
          const { data: buyers } = await supabase
            .from("profiles")
            .select("id,full_name,email,phone_number,avatar_url,business_type")
            .in("id", buyerIds);
          buyersById = (buyers || []).reduce(
            (acc: Record<string, any>, b: any) => {
              acc[b.id] = b;
              return acc;
            },
            {}
          );
        }

        setItems(
          leads.map((l: any) => ({
            ...l,
            product_snapshot: l.product_id
              ? productsById[l.product_id] ?? null
              : null,
            buyer_snapshot: l.buyer_id ? buyersById[l.buyer_id] ?? null : null,
          }))
        );
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
    return items.filter((i) => i.status === "responded");
  }, [items, status]);

  const handleQuickRespond = async (leadId: string) => {
    try {
      setSubmitting(true);
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("buy_leads")
        .update({ status: "responded" })
        .eq("id", leadId)
        .eq("supplier_id", user.id);
      if (error) throw error;

      setItems((prev) =>
        prev.map((i) =>
          i.id === leadId ? ({ ...i, status: "responded" } as BuyLead) : i
        )
      );
      toast.success("Marked as responded");
    } catch (e: any) {
      toast.error("Failed to mark responded", { description: e.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-24 md:pb-12">
      <div className="pt-2 md:pt-4">
        <h1 className="text-xl md:text-3xl font-bold tracking-tight">
          Buy Leads
        </h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Manage RFQs received from buyers.
        </p>
      </div>
      <div className="border-t" />

      <div>
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          {TABS.map((tab) => (
            <Button
              key={tab}
              variant="ghost"
              onClick={() => setStatus(tab)}
              className={`flex-1 rounded-md font-medium transition-all duration-200 ${
                status === tab
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
            >
              {tab === "all" ? "All" : tab === "awaiting" ? "New" : "Responded"}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            <div className="rounded-lg p-6 border bg-card">
              <Skeleton className="h-6 w-1/3 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="bg-card rounded-lg p-6 border">
              <Skeleton className="h-6 w-1/3 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
            <div className="text-destructive font-medium mb-2">
              Error Loading Buy Leads
            </div>
            <div className="text-sm text-destructive/70">{error}</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-card rounded-lg p-12 text-center border">
            <div className="text-muted-foreground mb-4">
              <MessageCircle className="h-12 w-12 mx-auto" />
            </div>
            <div className="text-lg font-semibold text-foreground mb-2">
              No Buy Leads Found
            </div>
            <div className="text-muted-foreground">
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
                  showRespondButton={status === "all" || status === "awaiting"}
                  onRespond={handleQuickRespond}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
