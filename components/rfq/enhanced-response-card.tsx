"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { H3 } from "@/components/ui/h3";
import { H4 as H4Component } from "@/components/ui/h4";
import { P as PComponent } from "@/components/ui/p";
import { useState } from "react";
import Link from "next/link";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Building2,
  CheckCircle,
  Calendar,
  MessageSquare,
  IndianRupee,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Clock,
  Star,
  Shield,
} from "lucide-react";
import type { Database } from "@/utils/supabase/database.types";

type BuyLeadResponse =
  Database["public"]["Tables"]["buy_lead_responses"]["Row"];
type SupplierSnapshot = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone_number: number | null;
  avatar_url: string | null;
  business_type: string | null;
  business_name: string | null;
  city: string | null;
  state: string | null;
  gst_number: string | null;
  is_verified: boolean | null;
  business_address: string | null;
  phone: number | null;
  alternate_phone: string | null;
  business_id?: string; // Add business ID for profile links
};

interface EnhancedResponseCardProps {
  response: BuyLeadResponse;
  variant?: "buyer" | "supplier";
  showDetails?: boolean;
  productId?: string | null;
}

export function EnhancedResponseCard({
  response,
  variant = "buyer",
  showDetails = false,
  productId,
}: EnhancedResponseCardProps) {
  const supplierSnapshot =
    response.supplier_snapshot as SupplierSnapshot | null;
  const [isExpanded, setIsExpanded] = useState(showDetails);
  const productUrl = productId ? `/products/${productId}` : undefined;
  // Do not fallback to profile id; only business page is valid here

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPhone = (phone: number | string | null) => {
    if (!phone) return null;
    const phoneStr = phone.toString();
    if (phoneStr.length === 10) {
      return `+91 ${phoneStr.slice(0, 5)} ${phoneStr.slice(5)}`;
    }
    return phoneStr;
  };

  return (
    <Card className="w-full border-0 shadow-sm bg-gradient-to-br from-emerald-50/50 to-white hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden border-l-4 border-l-emerald-500">
      <CardHeader className="p-0">
        {/* Mobile-First Header */}
        <div className="p-4 pb-3">
          {/* Status and Time */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                <MessageSquare className="h-3 w-3" />
                Supplier Response
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="h-3 w-3" />
                {formatDate(response.created_at)}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0 rounded-full hover:bg-slate-100"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Supplier Information */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
              <AvatarImage
                src={supplierSnapshot?.avatar_url || "/placeholder-profile.png"}
                alt="supplier"
              />
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-semibold">
                {supplierSnapshot?.full_name?.charAt(0) || "S"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <H4Component className="text-base font-semibold text-slate-900 truncate">
                  {supplierSnapshot?.business_name ||
                    supplierSnapshot?.full_name ||
                    "Supplier Response"}
                </H4Component>
                {supplierSnapshot?.is_verified && (
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-600">
                      Verified
                    </span>
                  </div>
                )}
              </div>
              <div className="text-sm text-slate-600">
                {supplierSnapshot?.full_name || "Unknown Supplier"}
                {supplierSnapshot?.business_type && (
                  <span className="ml-2 text-xs bg-slate-100 px-2 py-0.5 rounded-full">
                    {supplierSnapshot.business_type}
                  </span>
                )}
              </div>
            </div>
            {productUrl && (
              <Link
                href={productUrl}
                className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
              >
                <ExternalLink className="h-3 w-3" />
                View Product
              </Link>
            )}
          </div>

          {/* Response Details Grid - Mobile First */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Quoted Price */}
            {response.quoted_price && (
              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                <div className="flex items-center gap-2 mb-1">
                  <IndianRupee className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-700">
                    Quoted Price
                  </span>
                </div>
                <div className="text-lg font-bold text-emerald-900">
                  ₹{response.quoted_price}
                </div>
              </div>
            )}

            {/* Minimum Quantity */}
            {response.min_qty && (
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-slate-600" />
                  <span className="text-xs font-medium text-slate-700">
                    Min Quantity
                  </span>
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {response.min_qty}
                </div>
              </div>
            )}

            {/* Currency */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <Star className="h-4 w-4 text-slate-600" />
                <span className="text-xs font-medium text-slate-700">
                  Currency
                </span>
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {response.currency || "INR"}
              </div>
            </div>
          </div>

          {/* Supplier Message Preview */}
          {response.message && (
            <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-semibold text-slate-700">
                  Message
                </span>
              </div>
              <PComponent className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                {response.message}
              </PComponent>
            </div>
          )}
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-4 pt-0">
          <div className="border-t border-slate-200 pt-4">
            {/* Response Message */}
            {response.message && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="h-5 w-5 text-slate-600" />
                  <H4Component className="text-base font-semibold text-slate-900">
                    Supplier Message
                  </H4Component>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <PComponent className="text-sm text-emerald-800 leading-relaxed">
                    {response.message}
                  </PComponent>
                </div>
              </div>
            )}

            {/* Supplier Information */}
            {supplierSnapshot && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-slate-600" />
                  <H4Component className="text-base font-semibold text-slate-900">
                    Supplier Information
                  </H4Component>
                </div>

                {/* Business Details */}
                {supplierSnapshot.business_name && (
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="text-sm font-semibold text-slate-700 mb-2">
                      Business
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900">
                        {supplierSnapshot.business_name}
                      </span>
                      {productUrl && (
                        <Link
                          href={productUrl}
                          className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View Product
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {/* Location */}
                {(supplierSnapshot.city || supplierSnapshot.state) && (
                  <div className="flex items-center gap-3 py-2 px-3 bg-slate-50 rounded-xl">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    <div>
                      <div className="text-xs text-slate-500">Location</div>
                      <div className="text-sm font-medium text-slate-900">
                        {supplierSnapshot.city || ""}
                        {supplierSnapshot.city &&
                          supplierSnapshot.state &&
                          ", "}
                        {supplierSnapshot.state || ""}
                      </div>
                    </div>
                  </div>
                )}

                {/* GST Number */}
                {supplierSnapshot.gst_number && (
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="text-sm font-semibold text-slate-700 mb-2">
                      GST Number
                    </div>
                    <div className="font-mono text-sm text-slate-900">
                      {supplierSnapshot.gst_number}
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-sm font-semibold text-slate-700 mb-3">
                    Contact Information
                  </div>
                  <div className="space-y-3">
                    {supplierSnapshot.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-900">
                          {supplierSnapshot.email}
                        </span>
                      </div>
                    )}
                    {supplierSnapshot.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-900">
                          {formatPhone(supplierSnapshot.phone)}
                        </span>
                      </div>
                    )}
                    {supplierSnapshot.alternate_phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-900">
                          {supplierSnapshot.alternate_phone}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Business Address */}
                {supplierSnapshot.business_address && (
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="text-sm font-semibold text-slate-700 mb-2">
                      Business Address
                    </div>
                    <PComponent className="text-sm text-slate-600 leading-relaxed">
                      {supplierSnapshot.business_address}
                    </PComponent>
                  </div>
                )}
              </div>
            )}

            {/* Response Timestamp */}
            <div className="flex items-center gap-2 text-sm text-slate-500 pt-4 border-t border-slate-200 mt-6">
              <Calendar className="h-4 w-4" />
              <span>Responded on {formatDate(response.created_at)}</span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
