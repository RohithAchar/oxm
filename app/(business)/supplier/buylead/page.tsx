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
import { cn } from "@/lib/utils";
import { format } from "date-fns";
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

  const hasFilters = useMemo(() => {
    return statusFilter !== "all" || !!dateRange.from || !!dateRange.to;
  }, [statusFilter, dateRange]);

  const filteredLeads = useMemo(() => {
    if (!leads) return [] as BuyLead[];
    return leads.filter((lead) => {
      let ok = true;
      if (statusFilter !== "all") {
        ok = ok && (lead.status || "").toLowerCase() === statusFilter;
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

  return (
    <div className="max-w-screen-2xl mx-auto pb-24 md:pb-12 space-y-6">
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
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="reviewing">Reviewing</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="quoted">Quoted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
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
                        {lead.delivery_city && lead.delivery_pincode
                          ? ", "
                          : ""}
                        {lead.delivery_pincode || ""}
                      </TableCell>
                      <TableCell className="capitalize">
                        {lead.status || "submitted"}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
