import { PageHeader } from "@/components/PageHeader";
import { OrdersTable } from "@/components/orders/orders-table";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Sample Orders | Supplier Portal | OpenXmart",
  description: "Track and manage all sample requests and orders.",
};

const OrdersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const limit = 10;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let orders: any[] = [];
  let totalCount = 0;
  if (user) {
    const { data, error, count } = await supabase
      .from("sample_orders")
      .select(
        `*, buyer:profiles!buyer_id(full_name, email, phone_number), sample_order_items(id, quantity, price_per_unit, product_id, products(name))`,
        { count: "exact" }
      )
      .eq("supplier_id", user.id)
      .order("created_at", { ascending: false })
      .range((currentPage - 1) * limit, currentPage * limit - 1);
    if (!error && data) {
      orders = data as any[];
      totalCount = count || 0;
    }
  }

  return (
    <main className="space-y-4 md:space-y-6 pb-24 md:pb-12">
      <div className="pt-2 md:pt-4">
        <h1 className="text-xl md:text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Track and manage all sample requests and orders.
        </p>
      </div>
      <div className="border-t" />
      <OrdersTable
        orders={orders as any}
        totalCount={totalCount}
        currentPage={currentPage}
        limit={10}
      />
    </main>
  );
};

export default OrdersPage;
