"use client";

import { ColumnDef } from "@tanstack/react-table";
import TicketPopover from "@/components/support/TicketPopover";

export type SupplierTicketRow = {
  id: string;
  created_at: string;
  status: string;
  subject: string;
};

export const columns: ColumnDef<SupplierTicketRow>[] = [
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className="capitalize">{row.original.status}</span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <TicketPopover id={row.original.id} />,
  },
];
