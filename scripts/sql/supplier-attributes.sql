-- Supplier-owned colors and sizes, plus product junctions

-- 1) Colors owned by supplier
create table if not exists public.supplier_colors (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  hex_code text not null check (hex_code ~* '^#(?:[0-9a-fA-F]{3}){1,2}$'),
  created_at timestamptz not null default now()
);

create index if not exists idx_supplier_colors_supplier on public.supplier_colors(supplier_id);

-- 2) Sizes owned by supplier
create table if not exists public.supplier_sizes (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_supplier_sizes_supplier on public.supplier_sizes(supplier_id);

-- 3) Product to Colors mapping
create table if not exists public.product_colors (
  product_id uuid not null references public.products(id) on delete cascade,
  color_id uuid not null references public.supplier_colors(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (product_id, color_id)
);

create index if not exists idx_product_colors_product on public.product_colors(product_id);

-- 4) Product to Sizes mapping
create table if not exists public.product_sizes (
  product_id uuid not null references public.products(id) on delete cascade,
  size_id uuid not null references public.supplier_sizes(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (product_id, size_id)
);

create index if not exists idx_product_sizes_product on public.product_sizes(product_id);

-- Basic RLS policies (adjust to your needs)
alter table public.supplier_colors enable row level security;
alter table public.supplier_sizes enable row level security;
alter table public.product_colors enable row level security;
alter table public.product_sizes enable row level security;

-- suppliers can manage only their own colors
do $$ begin
  create policy supplier_colors_select on public.supplier_colors
    for select using (auth.uid() = supplier_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy supplier_colors_mod on public.supplier_colors
    for all using (auth.uid() = supplier_id) with check (auth.uid() = supplier_id);
exception when duplicate_object then null; end $$;

-- suppliers can manage only their own sizes
do $$ begin
  create policy supplier_sizes_select on public.supplier_sizes
    for select using (auth.uid() = supplier_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy supplier_sizes_mod on public.supplier_sizes
    for all using (auth.uid() = supplier_id) with check (auth.uid() = supplier_id);
exception when duplicate_object then null; end $$;

-- product junctions: allow if user owns the product
-- assumes products.supplier_id references auth.users(id)
do $$ begin
  create policy product_colors_select on public.product_colors
    for select using (
      exists(
        select 1 from public.products p
        where p.id = product_id and p.supplier_id = auth.uid()
      )
    );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy product_colors_mod on public.product_colors
    for all using (
      exists(
        select 1 from public.products p
        where p.id = product_id and p.supplier_id = auth.uid()
      )
    ) with check (
      exists(
        select 1 from public.products p
        where p.id = product_id and p.supplier_id = auth.uid()
      )
    );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy product_sizes_select on public.product_sizes
    for select using (
      exists(
        select 1 from public.products p
        where p.id = product_id and p.supplier_id = auth.uid()
      )
    );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy product_sizes_mod on public.product_sizes
    for all using (
      exists(
        select 1 from public.products p
        where p.id = product_id and p.supplier_id = auth.uid()
      )
    ) with check (
      exists(
        select 1 from public.products p
        where p.id = product_id and p.supplier_id = auth.uid()
      )
    );
exception when duplicate_object then null; end $$;


