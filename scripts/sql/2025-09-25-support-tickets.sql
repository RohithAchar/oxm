-- Support tickets base tables
create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'open', -- open | pending | closed
  subject text not null,
  message text not null,
  sender_name text not null,
  sender_email text not null,
  internal_notes text,
  created_by uuid,
  constraint status_check check (status in ('open','pending','closed'))
);

create table if not exists public.support_ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  created_at timestamptz not null default now(),
  author_role text not null, -- user | admin
  author_name text,
  author_email text,
  body text not null
);

-- helpful indexes
create index if not exists idx_support_tickets_status on public.support_tickets(status);
create index if not exists idx_support_ticket_messages_ticket on public.support_ticket_messages(ticket_id);


