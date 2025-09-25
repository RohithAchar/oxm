export type TicketStatus = "open" | "pending" | "closed";

export interface SupportTicket {
  id: string;
  created_at: string;
  updated_at: string;
  status: TicketStatus;
  subject: string;
  message: string;
  sender_name: string;
  sender_email: string;
  internal_notes?: string | null;
  created_by?: string | null;
}

export interface SupportTicketMessage {
  id: string;
  ticket_id: string;
  created_at: string;
  author_role: "user" | "admin";
  author_name?: string | null;
  author_email?: string | null;
  body: string;
}
