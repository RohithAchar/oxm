import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/controller/product/productOperations";
import Link from "next/link";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;

  const page = parseInt(params.page || "1", 10);
  const page_size = parseInt(params.page_size || "2", 10);
  const dropshipAvailable = params.dropship_available === "true";

  const data = await getProducts({
    page,
    page_size,
    dropship_available: dropshipAvailable,
  });

  return (
    <div className="text-foreground">
      <ul>
        {data.products.map((p) => (
          <li key={p.id} className="border-b py-2">
            {p.name}
          </li>
        ))}
      </ul>
      <div className="flex gap-2 mt-4">
        {Array.from({ length: data.total_pages }, (_, i) => {
          const pageNum = i + 1;
          return (
            <Button
              asChild
              variant={pageNum === page ? "default" : "outline"}
              key={pageNum}
            >
              <Link
                href={`/products?page=${pageNum}&page_size=${page_size}${
                  dropshipAvailable ? "&dropship_available=true" : ""
                }`}
              >
                {pageNum}
              </Link>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
