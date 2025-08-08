"use client";

import { Database } from "@/utils/supabase/database.types";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toggleBanner } from "@/lib/controller/home/banner";

type BannerType = Database["public"]["Tables"]["banners"]["Row"];

export const columns: ColumnDef<BannerType>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "start_at",
    header: "Start At",
    cell: ({ row }) => {
      return `${new Date(
        row.getValue("start_at")
      ).toLocaleDateString()} ${new Date(
        row.getValue("start_at")
      ).toLocaleTimeString()}`;
    },
  },
  {
    accessorKey: "end_at",
    header: "End At",
    cell: ({ row }) => {
      return `${new Date(
        row.getValue("end_at")
      ).toLocaleDateString()} ${new Date(
        row.getValue("end_at")
      ).toLocaleTimeString()}`;
    },
  },
  {
    accessorKey: "is_active",
    header: "Is Active",
  },
  {
    accessorKey: "link_url",
    header: "Link URL",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const banner = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className={
                !banner.is_active ? "text-primary" : "text-destructive"
              }
              onClick={async () => {
                toggleBanner(banner.id, banner.is_active || false);
              }}
            >
              Toggle
            </DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
