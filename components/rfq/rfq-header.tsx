"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { H2 as H2Component } from "@/components/ui/h2";
import { P as PComponent } from "@/components/ui/p";
import { Package, Plus, TrendingUp, Users } from "lucide-react";

interface RFQHeaderProps {
  title: string;
  subtitle?: string;
  totalCount?: number;
  onAddNew?: () => void;
  showAddButton?: boolean;
  variant?: "buyer" | "supplier";
}

export function RFQHeader({
  title,
  subtitle,
  totalCount,
  onAddNew,
  showAddButton = false,
  variant = "buyer",
}: RFQHeaderProps) {
  return (
    <div className="rounded-lg p-6 mb-6 border bg-card">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary text-primary-foreground">
              {variant === "buyer" ? (
                <Package className="h-6 w-6" />
              ) : (
                <TrendingUp className="h-6 w-6" />
              )}
            </div>
            <div>
              <H2Component className="text-2xl font-bold mb-1 text-foreground">
                {title}
              </H2Component>
              {totalCount !== undefined && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-sm font-medium">
                    <Users className="h-3 w-3 mr-1" />
                    {totalCount} {totalCount === 1 ? "request" : "requests"}
                  </Badge>
                </div>
              )}
            </div>
          </div>
          {subtitle && (
            <PComponent className="text-base leading-relaxed max-w-2xl">
              {subtitle}
            </PComponent>
          )}
        </div>

        {showAddButton && onAddNew && (
          <Button
            onClick={onAddNew}
            className="px-6 py-3 rounded-xl font-semibold"
          >
            <Plus className="h-5 w-5" />
            {variant === "buyer" ? "New Request" : "Create RFQ"}
          </Button>
        )}
      </div>
    </div>
  );
}
