"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
  Package,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
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
  total_price: number | null;
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
  const productSnapshot = (lead as any)
    .product_snapshot as ProductSnapshot | null;
  const buyerSnapshot = (lead as any).buyer_snapshot as BuyerSnapshot | null;
  const [isExpanded, setIsExpanded] = useState(showDetails);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "responded":
        return "bg-primary/10 text-primary";
      case "closed":
        return "bg-muted text-muted-foreground";
      case "cancelled":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
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
        return <MessageSquare className="h-4 w-4 text-primary" />;
      case "viewed":
        return <Eye className="h-4 w-4 text-muted-foreground" />;
      case "submitted":
        return <Package className="h-4 w-4 text-primary" />;
      case "closed":
        return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
      case "cancelled":
        return <Package className="h-4 w-4 text-destructive" />;
      default:
        return <Package className="h-4 w-4 text-primary" />;
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

  const formatPaiseToRupees = (paise: number | null | undefined): string => {
    if (paise === null || paise === undefined) return "-";
    const rupees = (Number(paise) / 100).toFixed(2);
    return `₹${rupees}`;
  };

  return (
    <Card className="w-full border shadow-sm bg-card hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden">
      <CardHeader className="p-0">
        <div className="p-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(
                  (lead.status ?? "") as string
                )}`}
              >
                {getStatusIcon(lead.status ?? "")}
                {getStatusText(lead.status ?? "")}
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

          <div className="mb-4">
            <H4Component className="text-lg font-semibold text-foreground mb-2 leading-tight">
              {productSnapshot?.name || lead.product_name || "Product Request"}
            </H4Component>

            {productSnapshot?.images && productSnapshot.images.length > 0 && (
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                {productSnapshot.images.slice(0, 4).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="h-16 w-16 object-cover rounded-xl border shadow-sm flex-shrink-0 bg-card"
                  />
                ))}
                {productSnapshot.images.length > 4 && (
                  <div className="h-16 w-16 rounded-xl border flex items-center justify-center text-xs font-medium text-muted-foreground bg-muted flex-shrink-0">
                    +{productSnapshot.images.length - 4}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {lead.quantity_required && (
              <div className="bg-muted rounded-xl p-3 border">
                <div className="flex items-center gap-2 mb-1">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Quantity
                  </span>
                </div>
                <div className="text-lg font-bold text-foreground">
                  {lead.quantity_required}
                </div>
              </div>
            )}

            {lead.target_price !== null && lead.target_price !== undefined && (
              <div className="rounded-xl p-3 border bg-primary/5 border-primary/20">
                <div className="flex items-center gap-2 mb-1">
                  <IndianRupee className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-primary">
                    Target Price
                  </span>
                </div>
                <div className="text-lg font-bold text-primary">
                  {formatPaiseToRupees(lead.target_price)}
                </div>
              </div>
            )}

            {lead.delivery_city && (
              <div className="bg-muted rounded-xl p-3 border col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Delivery to
                  </span>
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {lead.delivery_city}
                </div>
              </div>
            )}
          </div>

          {(productSnapshot?.price_per_unit !== undefined ||
            productSnapshot?.quantity !== undefined ||
            lead.target_price !== null ||
            lead.quantity_required !== null) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="rounded-xl border p-3 bg-green-50 border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <IndianRupee className="h-4 w-4 text-green-600" />
                  <span className="text-xs font-medium text-green-700">
                    Product Price & Quantity
                  </span>
                </div>
                <div className="text-lg font-bold text-green-700">
                  {productSnapshot?.price_per_unit !== null &&
                  productSnapshot?.price_per_unit !== undefined
                    ? `₹${(productSnapshot.price_per_unit / 100).toFixed(
                        2
                      )}/unit`
                    : productSnapshot?.total_price !== null &&
                      productSnapshot?.total_price !== undefined &&
                      productSnapshot?.quantity !== null &&
                      productSnapshot?.quantity !== undefined &&
                      Number(productSnapshot.quantity) > 0
                    ? `₹${(
                        Number(productSnapshot.total_price) /
                        Number(productSnapshot.quantity)
                      ).toFixed(2)}/unit`
                    : "-"}
                </div>
                {productSnapshot?.total_price !== null &&
                  productSnapshot?.total_price !== undefined && (
                    <div className="text-xs text-green-700/80 mt-1">
                      Total: ₹
                      {(Number(productSnapshot.total_price) / 100).toFixed(2)}
                    </div>
                  )}
                {productSnapshot?.quantity !== null &&
                  productSnapshot?.quantity !== undefined && (
                    <div className="mt-1 text-xs text-green-700/80 flex items-center gap-1">
                      <ShoppingCart className="h-3 w-3" />
                      <span>Available: {productSnapshot.quantity}</span>
                    </div>
                  )}
              </div>

              <div className="rounded-xl border p-3 bg-amber-50 border-amber-200">
                <div className="flex items-center gap-2 mb-1">
                  <IndianRupee className="h-4 w-4 text-amber-600" />
                  <span className="text-xs font-medium text-amber-700">
                    Requested (Buyer)
                  </span>
                </div>
                <div className="text-lg font-bold text-amber-700">
                  {lead.target_price !== null && lead.target_price !== undefined
                    ? `₹${(Number(lead.target_price) / 100).toFixed(2)}/unit`
                    : "-"}
                </div>
                {lead.quantity_required !== null &&
                  lead.quantity_required !== undefined && (
                    <div className="mt-1 text-xs text-amber-700/80 flex items-center gap-1">
                      <ShoppingCart className="h-3 w-3" />
                      <span>Requested: {lead.quantity_required}</span>
                    </div>
                  )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10 border shadow-sm">
              <AvatarImage
                src={buyerSnapshot?.avatar_url || "/placeholder-profile.png"}
                alt="buyer"
              />
              <AvatarFallback className="bg-muted text-foreground font-semibold text-sm">
                {buyerSnapshot?.full_name?.charAt(0) || "B"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-foreground text-sm truncate">
                {buyerSnapshot?.full_name || "Unknown Buyer"}
              </div>
              {buyerSnapshot?.business_type && (
                <div className="text-xs text-muted-foreground mt-0.5">
                  {buyerSnapshot.business_type}
                </div>
              )}
            </div>
          </div>

          {variant === "supplier" && productSnapshot && (
            <div className="bg-muted rounded-xl p-3 mb-4 border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">
                    Your Product
                  </span>
                </div>
                {productSnapshot && typeof productSnapshot.id === "string" && (
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

              <div className="space-y-2">
                {productSnapshot.brand && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Brand:</span>
                    <span className="font-semibold text-foreground">
                      {productSnapshot.brand}
                    </span>
                  </div>
                )}
                {productSnapshot.price_per_unit && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Your Price:</span>
                    <span className="font-semibold text-primary">
                      ₹{(productSnapshot.price_per_unit / 100).toFixed(2)}/unit
                    </span>
                  </div>
                )}
                {productSnapshot.quantity && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Stock:</span>
                    <span className="font-semibold text-foreground">
                      {productSnapshot.quantity} units
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {lead.notes && (
            <div className="bg-muted rounded-xl p-3 mb-4 border">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">
                  Request Notes
                </span>
              </div>
              <PComponent className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {lead.notes}
              </PComponent>
            </div>
          )}

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
          <div className="border-t pt-4">
            {productSnapshot && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <H4Component className="text-base font-semibold text-foreground">
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
                  {productSnapshot &&
                    typeof productSnapshot.id === "string" && (
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

                {productSnapshot.images &&
                  productSnapshot.images.length > 0 && (
                    <div className="mb-4">
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {productSnapshot.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="h-20 w-20 object-cover rounded-xl border shadow-sm flex-shrink-0 hover:scale-105 transition-transform cursor-pointer bg-card"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div className="space-y-3">
                    {productSnapshot.brand && (
                      <div className="flex justify-between items-center py-2 px-3 bg-muted rounded-xl">
                        <span className="text-sm font-medium text-muted-foreground">
                          Brand
                        </span>
                        <span className="font-semibold text-foreground">
                          {productSnapshot.brand}
                        </span>
                      </div>
                    )}
                    {productSnapshot.category && (
                      <div className="flex justify-between items-center py-2 px-3 bg-muted rounded-xl">
                        <span className="text-sm font-medium text-muted-foreground">
                          Category
                        </span>
                        <span className="font-semibold text-foreground">
                          {productSnapshot.category}
                        </span>
                      </div>
                    )}
                    {productSnapshot.subcategory && (
                      <div className="flex justify-between items-center py-2 px-3 bg-muted rounded-xl">
                        <span className="text-sm font-medium text-muted-foreground">
                          Subcategory
                        </span>
                        <span className="font-semibold text-foreground">
                          {productSnapshot.subcategory}
                        </span>
                      </div>
                    )}
                    {productSnapshot.price_per_unit && (
                      <div className="flex justify-between items-center py-2 px-3 rounded-xl border bg-primary/5 border-primary/20">
                        <span className="text-sm font-medium text-primary">
                          Price per unit
                        </span>
                        <span className="font-semibold text-primary">
                          ₹{(productSnapshot.price_per_unit / 100).toFixed(2)}
                        </span>
                      </div>
                    )}
                    {lead.quantity_required && (
                      <div className="flex justify-between items-center py-2 px-3 bg-muted rounded-xl border">
                        <span className="text-sm font-medium text-foreground">
                          Order quantity
                        </span>
                        <span className="font-semibold text-foreground">
                          {lead.quantity_required} units
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {productSnapshot.description && (
                  <div className="mb-4">
                    <div className="text-sm font-semibold text-foreground mb-2">
                      Description
                    </div>
                    <PComponent className="text-sm text-muted-foreground leading-relaxed">
                      {productSnapshot.description}
                    </PComponent>
                  </div>
                )}

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
                            className="flex justify-between items-center py-2.5 px-3 bg-muted rounded-xl"
                          >
                            <span className="font-medium text-sm text-foreground">
                              {spec.name}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {spec.value} {spec.unit || ""}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}

            {productSnapshot && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <H4Component className="text-base font-semibold text-foreground">
                    Requirements Comparison
                  </H4Component>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-semibold text-foreground mb-3">
                    Buyer Requirements
                  </div>
                  <div className="space-y-2">
                    {lead.quantity_required && (
                      <div className="flex justify-between items-center py-2.5 px-3 bg-muted rounded-xl border">
                        <span className="text-sm font-medium text-muted-foreground">
                          Quantity
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {lead.quantity_required}
                        </span>
                      </div>
                    )}
                    {lead.target_price !== null &&
                      lead.target_price !== undefined && (
                        <div className="flex justify-between items-center py-2.5 px-3 rounded-xl border bg-primary/5 border-primary/20">
                          <span className="text-sm font-medium text-primary">
                            Target Price
                          </span>
                          <span className="text-sm font-semibold text-primary">
                            {formatPaiseToRupees(lead.target_price)}
                          </span>
                        </div>
                      )}
                    {lead.delivery_city && (
                      <div className="flex justify-between items-center py-2.5 px-3 bg-muted rounded-xl border">
                        <span className="text-sm font-medium text-muted-foreground">
                          Delivery to
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {lead.delivery_city}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-foreground mb-3">
                    {variant === "supplier"
                      ? "Your Product"
                      : "Product Details"}
                  </div>
                  <div className="space-y-2">
                    {productSnapshot.quantity && (
                      <div className="flex justify-between items-center py-2.5 px-3 bg-muted rounded-xl border">
                        <span className="text-sm font-medium text-foreground">
                          {variant === "supplier" ? "Available Stock" : "Stock"}
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {productSnapshot.quantity}
                        </span>
                      </div>
                    )}
                    {productSnapshot.price_per_unit && (
                      <div className="flex justify-between items-center py-2.5 px-3 bg-muted rounded-xl border">
                        <span className="text-sm font-medium text-foreground">
                          {variant === "supplier"
                            ? "Your Price"
                            : "Product Price"}
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {formatPaiseToRupees(productSnapshot.price_per_unit)}
                        </span>
                      </div>
                    )}
                    {productSnapshot.brand && (
                      <div className="flex justify-between items-center py-2.5 px-3 bg-muted rounded-xl border">
                        <span className="text-sm font-medium text-foreground">
                          Brand
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {productSnapshot.brand}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {(productSnapshot.price_per_unit !== null &&
                  productSnapshot.price_per_unit !== undefined) ||
                (lead.target_price !== null &&
                  lead.target_price !== undefined) ? (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl border bg-muted p-3">
                      <div className="text-xs font-medium text-muted-foreground mb-1">
                        Your Price / Unit
                      </div>
                      <div className="text-base font-semibold text-foreground">
                        {productSnapshot.price_per_unit !== null &&
                        productSnapshot.price_per_unit !== undefined
                          ? formatPaiseToRupees(productSnapshot.price_per_unit)
                          : "-"}
                      </div>
                      {productSnapshot.quantity !== null &&
                        productSnapshot.quantity !== undefined && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Available: {productSnapshot.quantity}
                          </div>
                        )}
                    </div>
                    <div className="rounded-xl border bg-primary/5 border-primary/20 p-3">
                      <div className="text-xs font-medium text-primary mb-1">
                        Buyer Target / Unit
                      </div>
                      <div className="text-base font-semibold text-primary">
                        {lead.target_price !== null &&
                        lead.target_price !== undefined
                          ? formatPaiseToRupees(lead.target_price)
                          : "-"}
                      </div>
                      {lead.quantity_required !== null &&
                        lead.quantity_required !== undefined && (
                          <div className="text-xs text-primary/80 mt-1">
                            Requested: {lead.quantity_required}
                          </div>
                        )}
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <H4Component className="text-base font-semibold text-foreground">
                  Additional Details
                </H4Component>
              </div>

              {(lead.delivery_city || lead.delivery_pincode) && (
                <div className="flex items-center gap-3 py-2 px-3 bg-muted rounded-xl">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Delivery Address
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {lead.delivery_city || ""} {lead.delivery_pincode || ""}
                    </div>
                  </div>
                </div>
              )}

              {lead.customization && (
                <div className="bg-muted rounded-xl p-3">
                  <div className="text-sm font-semibold text-foreground mb-2">
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
                        <span className="text-sm font-medium text-muted-foreground capitalize">
                          {key}
                        </span>
                        <span className="text-sm text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(lead.contact_email || lead.contact_phone) && (
                <div className="bg-muted rounded-xl p-3">
                  <div className="text-sm font-semibold text-foreground mb-2">
                    Contact Information
                  </div>
                  <div className="space-y-2">
                    {lead.contact_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          {lead.contact_email}
                        </span>
                      </div>
                    )}
                    {lead.contact_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          {lead.contact_phone}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
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
