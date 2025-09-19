"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, Filter, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
type BuyLead = {
  id: string;
  product_id?: string | null;
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
  tier_pricing_snapshot?: any | null;
};

export default function BuyLeadPage() {
  const [leads, setLeads] = useState<BuyLead[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

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
            "id, product_id, product_name, quantity_required, target_price, currency, contact_email, contact_phone, delivery_city, delivery_pincode, status, created_at, tier_pricing_snapshot"
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

  const hasFilters = useMemo(() => {
    return statusFilter !== "all" || !!dateRange.from || !!dateRange.to;
  }, [statusFilter, dateRange]);

  const filteredLeads = useMemo(() => {
    if (!leads) return [] as BuyLead[];
    return leads.filter((lead) => {
      let ok = true;
      const normalizedStatus = (lead.status || "").toLowerCase();
      if (statusFilter !== "all") {
        if (statusFilter === "new") {
          ok =
            ok &&
            (normalizedStatus === "submitted" || normalizedStatus === "viewed");
        } else if (statusFilter === "responded") {
          ok = ok && normalizedStatus === "responded";
        } else {
          ok = ok && normalizedStatus === statusFilter;
        }
      }
      if ((dateRange.from || dateRange.to) && lead.created_at) {
        const created = new Date(lead.created_at);
        if (dateRange.from)
          ok = ok && created >= new Date(dateRange.from.setHours(0, 0, 0, 0));
        if (dateRange.to)
          ok =
            ok && created <= new Date(dateRange.to.setHours(23, 59, 59, 999));
      }
      return ok;
    });
  }, [leads, statusFilter, dateRange]);

  const clearFilters = () => {
    setStatusFilter("all");
    setDateRange({});
  };

  const formatDate = (iso: string | null) =>
    iso ? format(new Date(iso), "d MMM, yyyy") : "-";

  const renderStatusBadge = (status: string | null) => {
    const s = (status || "").toLowerCase();
    if (s === "responded") return <Badge>Responded</Badge>;
    if (s === "closed") return <Badge variant="destructive">Closed</Badge>;
    if (s === "submitted" || s === "viewed")
      return <Badge variant="secondary">New</Badge>;
    return (
      <Badge variant="outline">
        {s ? s.charAt(0).toUpperCase() + s.slice(1) : "-"}
      </Badge>
    );
  };

  // Extract supplier's original price and MOQ from tier_pricing_snapshot if available
  const getSupplierOriginals = (
    snapshot: any
  ): { originalPrice: string | null; originalQty: number | null } => {
    try {
      if (!snapshot) return { originalPrice: null, originalQty: null };
      const tiers = Array.isArray(snapshot?.tiers)
        ? snapshot.tiers
        : Array.isArray(snapshot)
        ? snapshot
        : null;
      if (!tiers || tiers.length === 0)
        return { originalPrice: null, originalQty: null };
      const first = tiers[0];
      const qty = Number(
        first?.minQty ?? first?.min_qty ?? first?.quantity ?? null
      );
      const priceRs = Number(
        first?.price ?? first?.unitPrice ?? first?.unit_price ?? null
      );
      return {
        originalQty: Number.isFinite(qty) ? qty : null,
        originalPrice: Number.isFinite(priceRs)
          ? `₹${priceRs.toFixed(2)}`
          : null,
      };
    } catch {
      return { originalPrice: null, originalQty: null };
    }
  };

  const [selectedLead, setSelectedLead] = useState<BuyLead | null>(null);
  const [open, setOpen] = useState(false);
  const [changesNeeded, setChangesNeeded] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const openDetails = (lead: BuyLead) => {
    setSelectedLead(lead);
    setChangesNeeded("");

    setOpen(true);
  };

  const handleSubmitChanges = async () => {
    if (!selectedLead) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/rfq/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buy_lead_id: selectedLead.id,
          message: changesNeeded || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || "Failed to submit response");
      }
      // Optimistically mark as responded in local state
      setLeads(
        (prev) =>
          prev?.map((l) =>
            l.id === selectedLead.id ? { ...l, status: "responded" } : l
          ) || prev
      );
      setOpen(false);
    } catch (e: any) {
      setSubmitError(e?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // No comparison helpers needed

  return (
    <div className="mx-auto pb-24 md:pb-12 space-y-6">
      {/* Title + Description */}
      <div className="pt-2 md:pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-3xl font-bold tracking-tight">
              Buy Leads
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              RFQs received from buyers.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="responded">Responded</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal w-[220px]",
                    !dateRange.from && !dateRange.to && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from && dateRange.to ? (
                    <span>
                      {format(dateRange.from, "LLL d, y")} -{" "}
                      {format(dateRange.to, "LLL d, y")}
                    </span>
                  ) : (
                    <span>Date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) =>
                    setDateRange({ from: range?.from, to: range?.to })
                  }
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 px-2 lg:px-3"
              >
                Clear
                <X className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="border-t" />

      <Card className="bg-card border shadow-sm rounded-xl overflow-hidden">
        <CardHeader>
          <CardTitle>Received RFQs</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Mobile: compact list showing product name, target price and quantity */}
          <div className="md:hidden space-y-3">
            {loading && (
              <div className="py-6 text-center text-muted-foreground">
                Loading...
              </div>
            )}
            {!loading && error && (
              <div className="py-6 text-center text-destructive">{error}</div>
            )}
            {!loading &&
              !error &&
              filteredLeads &&
              filteredLeads.length === 0 && (
                <div className="py-6 text-center text-muted-foreground">
                  No RFQs received yet.
                </div>
              )}
            {!loading &&
              !error &&
              filteredLeads &&
              filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="rounded-lg border p-3 bg-background"
                  onClick={() => openDetails(lead)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium truncate">
                      {lead.product_name || "-"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {lead.created_at
                        ? new Date(lead.created_at).toLocaleDateString()
                        : "-"}
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Qty</span>
                      <span className="font-medium">
                        {lead.quantity_required ?? "-"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Target</span>
                      <span className="font-medium">
                        {formatPrice(lead.target_price)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Desktop/Tablet: full table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px] text-muted-foreground">
                    Date
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Product
                  </TableHead>
                  <TableHead className="w-[100px] text-right text-muted-foreground">
                    Qty
                  </TableHead>
                  <TableHead className="w-[150px] text-right text-muted-foreground">
                    Target
                  </TableHead>
                  <TableHead className="w-[220px] text-muted-foreground">
                    Contact
                  </TableHead>
                  <TableHead className="w-[200px] text-muted-foreground">
                    Delivery
                  </TableHead>
                  <TableHead className="w-[130px] text-muted-foreground">
                    Status
                  </TableHead>
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
                {!loading &&
                  !error &&
                  filteredLeads &&
                  filteredLeads.length === 0 && (
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
                  filteredLeads &&
                  filteredLeads.map((lead) => (
                    <TableRow
                      key={lead.id}
                      className="hover:bg-muted/50 cursor-pointer"
                      onClick={() => openDetails(lead)}
                    >
                      <TableCell className="text-muted-foreground align-middle">
                        {formatDate(lead.created_at)}
                      </TableCell>
                      <TableCell className="font-medium align-middle max-w-[320px] truncate">
                        {lead.product_name || "-"}
                      </TableCell>
                      <TableCell className="text-right align-middle">
                        {lead.quantity_required ?? "-"}
                      </TableCell>
                      <TableCell className="font-medium text-right align-middle whitespace-nowrap">
                        {formatPrice(lead.target_price)}
                      </TableCell>
                      <TableCell className="align-middle max-w-[260px] truncate">
                        {lead.contact_email || lead.contact_phone || "-"}
                      </TableCell>
                      <TableCell className="align-middle max-w-[240px] truncate">
                        {(lead.delivery_city || "") +
                          (lead.delivery_city && lead.delivery_pincode
                            ? ", "
                            : "") +
                          (lead.delivery_pincode || "")}
                      </TableCell>
                      <TableCell className="align-middle">
                        {renderStatusBadge(lead.status)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>RFQ Details</DialogTitle>
            <DialogDescription>
              Product and buyer info. Clean and minimal.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-lg border p-3 bg-muted/20 sm:col-span-2">
                <div className="text-xs text-muted-foreground mb-1">
                  Product
                </div>
                <div className="font-medium">
                  {selectedLead?.product_name || "-"}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Qty: {selectedLead?.quantity_required ?? "-"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Target: {formatPrice(selectedLead?.target_price)}
                </div>
                {(() => {
                  const { originalPrice, originalQty } = getSupplierOriginals(
                    selectedLead?.tier_pricing_snapshot
                  );
                  if (!originalPrice && !originalQty) return null;
                  return (
                    <div className="text-xs text-muted-foreground mt-2">
                      Supplier original: Qty {originalQty ?? "-"} • Price{" "}
                      {originalPrice ?? "-"}
                    </div>
                  );
                })()}
              </div>

              <div className="rounded-lg border p-3 bg-muted/20">
                <div className="text-xs text-muted-foreground mb-1">Buyer</div>
                <div className="font-medium truncate">Buyer</div>
                <div className="mt-1 text-sm text-muted-foreground truncate">
                  {selectedLead?.contact_email || "-"}
                </div>
                <div className="text-sm text-muted-foreground truncate">
                  {selectedLead?.contact_phone || "-"}
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-3 bg-muted/20">
              <div className="text-xs text-muted-foreground mb-1">
                Buyer needs
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Quantity</div>
                  <div className="font-medium">
                    {selectedLead?.quantity_required ?? "-"}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Target price</div>
                  <div className="font-medium">
                    {formatPrice(selectedLead?.target_price)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Delivery</div>
                  <div className="font-medium truncate">
                    {(selectedLead?.delivery_city || "") +
                      (selectedLead?.delivery_city &&
                      selectedLead?.delivery_pincode
                        ? ", "
                        : "") +
                      (selectedLead?.delivery_pincode || "")}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <div className="text-xs text-muted-foreground">
                Original: Qty {selectedLead?.quantity_required ?? "-"} • Target{" "}
                {formatPrice(selectedLead?.target_price)}
              </div>
              <div className="text-xs text-muted-foreground">
                Changes needed
              </div>
              <Textarea
                placeholder="List changes or clarifications needed from the buyer..."
                value={changesNeeded}
                onChange={(e) => setChangesNeeded(e.target.value)}
                className="min-h-[96px]"
              />
              {submitError ? (
                <div className="text-xs text-destructive">{submitError}</div>
              ) : null}
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSubmitChanges} disabled={submitting}>
              {submitting ? "Sending..." : "Send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
