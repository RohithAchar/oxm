"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { H3 } from "@/components/ui/h3";
import { H4 as H4Component } from "@/components/ui/h4";
import { P as PComponent } from "@/components/ui/p";
import { useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChevronRight,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  Building2,
  CheckCircle,
  Image as ImageIcon,
  FileText,
  Calendar,
  Eye,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Edit,
  Clock,
  IndianRupee,
  ShoppingCart,
} from "lucide-react";
import type { Database } from "@/utils/supabase/database.types";

type BuyLead = Database["public"]["Tables"]["buy_leads"]["Row"];
type ProductSnapshot = {
  id: string;
  name: string;
  description: string;
  brand: string | null;
  price_per_unit: number | null;
  quantity: number | null;
  is_active: boolean;
  images: string[];
  specifications: Array<{
    name: string;
    value: string;
    unit: string | null;
  }>;
  category: string | null;
  subcategory: string | null;
};

type BuyerSnapshot = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone_number: number | null;
  avatar_url: string | null;
  business_type: string | null;
};

interface EnhancedBuyLeadCardProps {
  lead: BuyLead;
  onRespond?: (leadId: string) => void;
  showRespondButton?: boolean;
  variant?: "supplier" | "buyer";
  showDetails?: boolean;
}

export function EnhancedBuyLeadCard({
  lead,
  onRespond,
  showRespondButton = false,
  variant = "supplier",
  showDetails = false,
}: EnhancedBuyLeadCardProps) {
  const productSnapshot = lead.product_snapshot as ProductSnapshot | null;
  const buyerSnapshot = lead.buyer_snapshot as BuyerSnapshot | null;
  const [isExpanded, setIsExpanded] = useState(showDetails);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "responded":
        return "bg-emerald-100 text-emerald-700";
      case "closed":
        return "bg-zinc-200 text-zinc-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "responded":
        return <MessageSquare className="h-4 w-4 text-emerald-600" />;
      case "viewed":
        return <Eye className="h-4 w-4 text-slate-600" />;
      case "submitted":
        return <Package className="h-4 w-4 text-amber-600" />;
      case "closed":
        return <CheckCircle className="h-4 w-4 text-gray-600" />;
      case "cancelled":
        return <Package className="h-4 w-4 text-red-600" />;
      default:
        return <Package className="h-4 w-4 text-amber-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "responded":
        return "Responded";
      case "viewed":
        return "Viewed";
      case "submitted":
        return "New Request";
      case "closed":
        return "Closed";
      case "cancelled":
        return "Cancelled";
      default:
        return "New Request";
    }
  };

  return (
    <Card className="w-full border-0 shadow-sm bg-gradient-to-br from-white to-slate-50/30 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
      <CardHeader className="p-0">
        {/* Mobile-First Header */}
        <div className="p-4 pb-3">
          {/* Status Badge */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(
                  lead.status
                )}`}
              >
                {getStatusIcon(lead.status)}
                {getStatusText(lead.status)}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatDate(lead.created_at)}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0 rounded-full bg-primary/10 text-primary border border-primary/20"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Product Title */}
          <div className="mb-4">
            <H4Component className="text-lg font-semibold text-slate-900 mb-2 leading-tight">
              {productSnapshot?.name || lead.product_name || "Product Request"}
            </H4Component>

            {/* Product Image Preview - Mobile Optimized */}
            {productSnapshot?.images && productSnapshot.images.length > 0 && (
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                {productSnapshot.images.slice(0, 4).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="h-16 w-16 object-cover rounded-xl border-2 border-white shadow-sm flex-shrink-0"
                  />
                ))}
                {productSnapshot.images.length > 4 && (
                  <div className="h-16 w-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl border-2 border-white flex items-center justify-center text-xs font-medium text-slate-600 flex-shrink-0">
                    +{productSnapshot.images.length - 4}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Key Information Grid - Mobile First */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Quantity */}
            {lead.quantity_required && (
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <ShoppingCart className="h-4 w-4 text-slate-600" />
                  <span className="text-xs font-medium text-slate-700">
                    Quantity
                  </span>
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {lead.quantity_required}
                </div>
              </div>
            )}

            {/* Target Price */}
            {lead.target_price && (
              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                <div className="flex items-center gap-2 mb-1">
                  <IndianRupee className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-700">
                    Target Price
                  </span>
                </div>
                <div className="text-lg font-bold text-emerald-900">
                  ₹{lead.target_price}
                </div>
              </div>
            )}

            {/* Delivery Location */}
            {lead.delivery_city && (
              <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-amber-600" />
                  <span className="text-xs font-medium text-amber-700">
                    Delivery to
                  </span>
                </div>
                <div className="text-sm font-semibold text-amber-900">
                  {lead.delivery_city}
                </div>
              </div>
            )}
          </div>

          {/* Buyer Information */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
              <AvatarImage
                src={buyerSnapshot?.avatar_url || "/placeholder-profile.png"}
                alt="buyer"
              />
              <AvatarFallback className="bg-slate-200 text-slate-700 font-semibold text-sm">
                {buyerSnapshot?.full_name?.charAt(0) || "B"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-900 text-sm truncate">
                {buyerSnapshot?.full_name || "Unknown Buyer"}
              </div>
              {buyerSnapshot?.business_type && (
                <div className="text-xs text-slate-500 mt-0.5">
                  {buyerSnapshot.business_type}
                </div>
              )}
            </div>
          </div>

          {/* Product Details for Suppliers */}
          {variant === "supplier" && productSnapshot && (
            <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-slate-600" />
                  <span className="text-sm font-semibold text-slate-700">
                    Your Product
                  </span>
                </div>
                {productSnapshot.id && (
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/products/${productSnapshot.id}`}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View
                    </Link>
                    <Link
                      href={`/supplier/manage-products/${productSnapshot.id}?mode=edit`}
                      className="inline-flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 transition-colors font-medium"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </Link>
                  </div>
                )}
              </div>

              {/* Product Quick Info */}
              <div className="space-y-2">
                {productSnapshot.brand && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Brand:</span>
                    <span className="font-semibold text-slate-900">
                      {productSnapshot.brand}
                    </span>
                  </div>
                )}
                {productSnapshot.price_per_unit && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Your Price:</span>
                    <span className="font-semibold text-green-600">
                      ₹{(productSnapshot.price_per_unit / 100).toFixed(2)}/unit
                    </span>
                  </div>
                )}
                {productSnapshot.quantity && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Stock:</span>
                    <span className="font-semibold text-slate-900">
                      {productSnapshot.quantity} units
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Request Notes Preview */}
          {lead.notes && (
            <div className="bg-amber-50 rounded-xl p-3 mb-4 border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-semibold text-amber-800">
                  Request Notes
                </span>
              </div>
              <PComponent className="text-sm text-amber-700 leading-relaxed line-clamp-2">
                {lead.notes}
              </PComponent>
            </div>
          )}

          {/* Action Button */}
          {showRespondButton && onRespond && (
            <div className="flex justify-end">
              <Button
                onClick={() => onRespond(lead.id)}
                disabled={
                  lead.status === "responded" || lead.status === "closed"
                }
                className="px-6 py-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {lead.status === "responded"
                  ? "Already Responded"
                  : "Respond to RFQ"}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-4 pt-0">
          <div className="border-t border-slate-200 pt-4">
            {/* Enhanced Product Information */}
            {productSnapshot && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-slate-600" />
                    <H4Component className="text-base font-semibold text-slate-900">
                      Product Details
                    </H4Component>
                    {variant === "supplier" && (
                      <Badge
                        variant={
                          productSnapshot.is_active ? "default" : "secondary"
                        }
                        className="ml-2 text-xs"
                      >
                        {productSnapshot.is_active ? "Active" : "Inactive"}
                      </Badge>
                    )}
                  </div>
                  {productSnapshot.id && (
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/products/${productSnapshot.id}`}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View Product
                      </Link>
                      {variant === "supplier" && (
                        <Link
                          href={`/supplier/manage-products/${productSnapshot.id}?mode=edit`}
                          className="inline-flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 transition-colors font-medium"
                        >
                          <Edit className="h-3 w-3" />
                          Edit Product
                        </Link>
                      )}
                    </div>
                  )}
                </div>

                {/* Product Images Gallery - Mobile Optimized */}
                {productSnapshot.images &&
                  productSnapshot.images.length > 0 && (
                    <div className="mb-4">
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {productSnapshot.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="h-20 w-20 object-cover rounded-xl border-2 border-white shadow-sm flex-shrink-0 hover:scale-105 transition-transform cursor-pointer"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                {/* Product Basic Info - Mobile Grid */}
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div className="space-y-3">
                    {productSnapshot.brand && (
                      <div className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-xl">
                        <span className="text-sm font-medium text-slate-600">
                          Brand
                        </span>
                        <span className="font-semibold text-slate-900">
                          {productSnapshot.brand}
                        </span>
                      </div>
                    )}
                    {productSnapshot.category && (
                      <div className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-xl">
                        <span className="text-sm font-medium text-slate-600">
                          Category
                        </span>
                        <span className="font-semibold text-slate-900">
                          {productSnapshot.category}
                        </span>
                      </div>
                    )}
                    {productSnapshot.subcategory && (
                      <div className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-xl">
                        <span className="text-sm font-medium text-slate-600">
                          Subcategory
                        </span>
                        <span className="font-semibold text-slate-900">
                          {productSnapshot.subcategory}
                        </span>
                      </div>
                    )}
                    {productSnapshot.price_per_unit && (
                      <div className="flex justify-between items-center py-2 px-3 bg-green-50 rounded-xl border border-green-200">
                        <span className="text-sm font-medium text-green-700">
                          Price per unit
                        </span>
                        <span className="font-semibold text-green-900">
                          ₹{(productSnapshot.price_per_unit / 100).toFixed(2)}
                        </span>
                      </div>
                    )}
                    {lead.quantity_required && (
                      <div className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-sm font-medium text-slate-700">
                          Order quantity
                        </span>
                        <span className="font-semibold text-slate-900">
                          {lead.quantity_required} units
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Description */}
                {productSnapshot.description && (
                  <div className="mb-4">
                    <div className="text-sm font-semibold text-slate-700 mb-2">
                      Description
                    </div>
                    <PComponent className="text-sm text-slate-600 leading-relaxed">
                      {productSnapshot.description}
                    </PComponent>
                  </div>
                )}

                {/* Complete Specifications */}
                {productSnapshot.specifications &&
                  productSnapshot.specifications.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm font-semibold text-slate-700 mb-3">
                        Specifications
                      </div>
                      <div className="space-y-2">
                        {productSnapshot.specifications.map((spec, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-2.5 px-3 bg-slate-50 rounded-xl"
                          >
                            <span className="font-medium text-sm text-slate-700">
                              {spec.name}
                            </span>
                            <span className="text-sm text-slate-600">
                              {spec.value} {spec.unit || ""}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}

            {/* RFQ vs Product Comparison - Mobile Optimized */}
            {productSnapshot && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-slate-600" />
                  <H4Component className="text-base font-semibold text-slate-900">
                    Requirements Comparison
                  </H4Component>
                </div>

                {/* Buyer Requirements */}
                <div className="mb-4">
                  <div className="text-sm font-semibold text-slate-700 mb-3">
                    Buyer Requirements
                  </div>
                  <div className="space-y-2">
                    {lead.quantity_required && (
                      <div className="flex justify-between items-center py-2.5 px-3 bg-amber-50 rounded-xl border border-amber-200">
                        <span className="text-sm font-medium text-amber-700">
                          Quantity
                        </span>
                        <span className="text-sm font-semibold text-amber-900">
                          {lead.quantity_required}
                        </span>
                      </div>
                    )}
                    {lead.target_price && (
                      <div className="flex justify-between items-center py-2.5 px-3 bg-amber-50 rounded-xl border border-amber-200">
                        <span className="text-sm font-medium text-amber-700">
                          Target Price
                        </span>
                        <span className="text-sm font-semibold text-amber-900">
                          ₹{lead.target_price}
                        </span>
                      </div>
                    )}
                    {lead.delivery_city && (
                      <div className="flex justify-between items-center py-2.5 px-3 bg-amber-50 rounded-xl border border-amber-200">
                        <span className="text-sm font-medium text-amber-700">
                          Delivery to
                        </span>
                        <span className="text-sm font-semibold text-amber-900">
                          {lead.delivery_city}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div>
                  <div className="text-sm font-semibold text-slate-700 mb-3">
                    {variant === "supplier"
                      ? "Your Product"
                      : "Product Details"}
                  </div>
                  <div className="space-y-2">
                    {productSnapshot.quantity && (
                      <div className="flex justify-between items-center py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-sm font-medium text-slate-700">
                          {variant === "supplier" ? "Available Stock" : "Stock"}
                        </span>
                        <span className="text-sm font-semibold text-slate-900">
                          {productSnapshot.quantity}
                        </span>
                      </div>
                    )}
                    {productSnapshot.price_per_unit && (
                      <div className="flex justify-between items-center py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-sm font-medium text-slate-700">
                          {variant === "supplier"
                            ? "Your Price"
                            : "Product Price"}
                        </span>
                        <span className="text-sm font-semibold text-slate-900">
                          ₹{(productSnapshot.price_per_unit / 100).toFixed(2)}
                        </span>
                      </div>
                    )}
                    {productSnapshot.brand && (
                      <div className="flex justify-between items-center py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-sm font-medium text-slate-700">
                          Brand
                        </span>
                        <span className="text-sm font-semibold text-slate-900">
                          {productSnapshot.brand}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Additional Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-slate-600" />
                <H4Component className="text-base font-semibold text-slate-900">
                  Additional Details
                </H4Component>
              </div>

              {/* Delivery Information */}
              {(lead.delivery_city || lead.delivery_pincode) && (
                <div className="flex items-center gap-3 py-2 px-3 bg-slate-50 rounded-xl">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <div>
                    <div className="text-xs text-slate-500">
                      Delivery Address
                    </div>
                    <div className="text-sm font-medium text-slate-900">
                      {lead.delivery_city || ""} {lead.delivery_pincode || ""}
                    </div>
                  </div>
                </div>
              )}

              {/* Customization */}
              {lead.customization && (
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-sm font-semibold text-slate-700 mb-2">
                    Customization
                  </div>
                  <div className="space-y-2">
                    {Object.entries(
                      lead.customization as Record<string, string>
                    ).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm font-medium text-slate-600 capitalize">
                          {key}
                        </span>
                        <span className="text-sm text-slate-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              {(lead.contact_email || lead.contact_phone) && (
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-sm font-semibold text-slate-700 mb-2">
                    Contact Information
                  </div>
                  <div className="space-y-2">
                    {lead.contact_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-900">
                          {lead.contact_email}
                        </span>
                      </div>
                    )}
                    {lead.contact_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-900">
                          {lead.contact_phone}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Timestamp */}
              <div className="flex items-center gap-2 text-sm text-slate-500 pt-2 border-t border-slate-200">
                <Calendar className="h-4 w-4" />
                <span>Submitted on {formatDate(lead.created_at)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
