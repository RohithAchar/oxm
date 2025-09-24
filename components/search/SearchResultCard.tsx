"use client";

import { ProductCard } from "@/components/home/product-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Package, Truck, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResultCardProps {
  id: string;
  name: string;
  brand: string;
  description: string;
  hsn_code: string;
  category_name: string;
  subcategory_name: string;
  supplierName: string;
  imageUrl: string;
  price_per_unit: number;
  is_verified: boolean;
  is_sample_available: boolean;
  is_dropship_available: boolean;
  tags: string[];
  colors: string[];
  sizes: string[];
  relevance_score?: number;
  highlighted_name?: string;
  highlighted_description?: string;
  searchQuery?: string;
  showHighlights?: boolean;
}

export function SearchResultCard({
  id,
  name,
  brand,
  description,
  hsn_code,
  category_name,
  subcategory_name,
  supplierName,
  imageUrl,
  price_per_unit,
  is_verified,
  is_sample_available,
  is_dropship_available,
  tags,
  colors,
  sizes,
  relevance_score,
  highlighted_name,
  highlighted_description,
  searchQuery,
  showHighlights = true,
}: SearchResultCardProps) {
  // Format price
  const formatPrice = (priceInPaise: number) => {
    const priceInRupees = priceInPaise / 100;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(priceInRupees);
  };

  // Render highlighted text
  const renderHighlightedText = (text: string, query?: string) => {
    if (!showHighlights || !query || !text) {
      return text;
    }

    // If we have pre-highlighted text from the API, use it
    if (highlighted_name && text === name) {
      return <span dangerouslySetInnerHTML={{ __html: highlighted_name }} />;
    }
    if (highlighted_description && text === description) {
      return <span dangerouslySetInnerHTML={{ __html: highlighted_description }} />;
    }

    // Otherwise, create highlights manually
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <mark 
            key={index} 
            className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded font-medium"
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  // Get relevance badge color
  const getRelevanceBadgeColor = (score?: number) => {
    if (!score) return "secondary";
    if (score > 0.8) return "default";
    if (score > 0.6) return "secondary";
    return "outline";
  };

  return (
    <Card className="group hover:shadow-md transition-all duration-200 border-border/50 hover:border-border">
      <CardContent className="p-0">
        <div className="relative">
          {/* Product Image */}
          <div className="aspect-square w-full overflow-hidden rounded-t-lg bg-muted">
            <img
              src={imageUrl || "/product-placeholder.png"}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          {/* Relevance Score Badge */}
          {relevance_score && relevance_score > 0.5 && (
            <Badge 
              variant={getRelevanceBadgeColor(relevance_score)}
              className="absolute top-2 left-2 text-xs"
            >
              <Star className="h-3 w-3 mr-1" />
              {Math.round(relevance_score * 100)}% match
            </Badge>
          )}

          {/* Verification Badge */}
          {is_verified && (
            <Badge variant="default" className="absolute top-2 right-2 text-xs">
              Verified
            </Badge>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3 space-y-2">
          {/* Product Name */}
          <div className="space-y-1">
            <h3 className="font-medium text-sm leading-tight line-clamp-2">
              {renderHighlightedText(name, searchQuery)}
            </h3>
            {brand && (
              <p className="text-xs text-muted-foreground">
                by {renderHighlightedText(brand, searchQuery)}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Package className="h-3 w-3" />
            <span>
              {renderHighlightedText(category_name, searchQuery)}
              {subcategory_name && ` • ${renderHighlightedText(subcategory_name, searchQuery)}`}
            </span>
          </div>

          {/* Supplier */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{renderHighlightedText(supplierName, searchQuery)}</span>
          </div>

          {/* Description */}
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {renderHighlightedText(description, searchQuery)}
            </p>
          )}

          {/* HSN Code */}
          {hsn_code && (
            <div className="text-xs text-muted-foreground">
              HSN: {renderHighlightedText(hsn_code, searchQuery)}
            </div>
          )}

          {/* Price */}
          <div className="font-semibold text-sm text-primary">
            {formatPrice(price_per_unit)}
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs px-1.5 py-0.5"
                >
                  {renderHighlightedText(tag, searchQuery)}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                  +{tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Features */}
          <div className="flex items-center gap-2 text-xs">
            {is_sample_available && (
              <div className="flex items-center gap-1 text-green-600">
                <Package className="h-3 w-3" />
                <span>Sample</span>
              </div>
            )}
            {is_dropship_available && (
              <div className="flex items-center gap-1 text-blue-600">
                <Truck className="h-3 w-3" />
                <span>Dropship</span>
              </div>
            )}
          </div>

          {/* Colors and Sizes */}
          {(colors.length > 0 || sizes.length > 0) && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {colors.length > 0 && (
                <span>
                  {colors.slice(0, 2).join(", ")}
                  {colors.length > 2 && ` +${colors.length - 2} more`}
                </span>
              )}
              {colors.length > 0 && sizes.length > 0 && <span>•</span>}
              {sizes.length > 0 && (
                <span>
                  {sizes.slice(0, 2).join(", ")}
                  {sizes.length > 2 && ` +${sizes.length - 2} more`}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Fallback to original ProductCard for backward compatibility
export function ProductSearchResultCard(props: SearchResultCardProps) {
  // If no search-specific features are needed, use the original ProductCard
  if (!props.searchQuery && !props.showHighlights) {
    return (
      <ProductCard
        id={props.id}
        imageUrl={props.imageUrl}
        name={props.name}
        brand={props.brand}
        supplierName={props.supplierName}
        priceAndQuantity={[{ price: props.price_per_unit, quantity: 1 }]}
        is_verified={props.is_verified}
        hasSample={props.is_sample_available}
      />
    );
  }

  // Otherwise, use the enhanced search result card
  return <SearchResultCard {...props} />;
}
