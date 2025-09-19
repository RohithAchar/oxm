"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Eye, Package } from "lucide-react";

interface StatusFilterProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
  counts?: {
    all: number;
    submitted: number;
    viewed: number;
    responded: number;
    closed: number;
  };
}

const statusOptions = [
  {
    value: "all",
    label: "All",
    icon: Package,
    color: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    activeColor: "bg-slate-900 text-white",
  },
  {
    value: "submitted",
    label: "New",
    icon: AlertCircle,
    color: "bg-amber-100 text-amber-700 hover:bg-amber-200",
    activeColor: "bg-amber-600 text-white",
  },
  {
    value: "viewed",
    label: "Viewed",
    icon: Eye,
    color: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    activeColor: "bg-slate-800 text-white",
  },
  {
    value: "responded",
    label: "Responded",
    icon: Package,
    color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
    activeColor: "bg-emerald-600 text-white",
  },
  {
    value: "closed",
    label: "Closed",
    icon: CheckCircle,
    color: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    activeColor: "bg-slate-600 text-white",
  },
];

export function StatusFilter({
  currentStatus,
  onStatusChange,
  counts,
}: StatusFilterProps) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option) => {
          const Icon = option.icon;
          const isActive = currentStatus === option.value;
          const count = counts?.[option.value as keyof typeof counts] || 0;

          return (
            <Button
              key={option.value}
              variant="ghost"
              size="sm"
              onClick={() => onStatusChange(option.value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? `${option.activeColor} shadow-md`
                  : `${option.color} hover:shadow-sm`
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{option.label}</span>
              {count > 0 && (
                <Badge
                  variant="outline"
                  className={`ml-1 text-xs px-2 py-0.5 ${
                    isActive
                      ? "bg-white/20 text-white border-white/30"
                      : "bg-white/80 text-slate-600 border-slate-300"
                  }`}
                >
                  {count}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
