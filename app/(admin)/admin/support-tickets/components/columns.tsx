"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";

export type TicketRow = {
  id: string;
  created_at: string;
  status: string;
  subject: string;
  sender_name: string;
  sender_email: string;
};

export const columns: ColumnDef<TicketRow>[] = [
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleString(),
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => (
      <span className="font-medium line-clamp-1" title={row.original.subject}>
        {row.original.subject}
      </span>
    ),
  },
  {
    accessorKey: "sender_name",
    header: "Sender",
    cell: ({ row }) => (
      <div className="max-w-[280px] truncate">
        {row.original.sender_name} • {row.original.sender_email}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = row.original.status;
      if (s === "open") return <Badge>Open</Badge>;
      if (s === "pending") return <Badge variant="secondary">Pending</Badge>;
      return <Badge variant="outline">Closed</Badge>;
    },
    filterFn: (row, _id, value) => {
      if (!value?.length) return true;
      return value.includes(row.original.status);
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            Details
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              {row.original.status.toUpperCase()} •{" "}
              {new Date(row.original.created_at).toLocaleString()}
            </div>
            <div className="font-medium line-clamp-2">
              {row.original.subject}
            </div>
            <div className="text-sm text-muted-foreground truncate">
              {row.original.sender_name} • {row.original.sender_email}
            </div>
            <div className="pt-2">
              <Link
                href={`/admin/support-tickets/${row.original.id}`}
                className="text-primary"
              >
                Open full view →
              </Link>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    ),
  },
];
