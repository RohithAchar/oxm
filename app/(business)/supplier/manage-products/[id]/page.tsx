import ProductViewV2 from "@/components/product/product-view-v2";
import { ProductForm } from "@/components/product/product-form";
import { getBusiness } from "@/lib/controller/business/businessOperations";
import { getCategories } from "@/lib/controller/categories/categoriesOperation";
import { getTags } from "@/lib/controller/product/productOperations";
import { getUserId } from "@/lib/controller/user/userOperations";
import { getProductForEdit } from "@/lib/controller/product/productOperations";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string }>;
}

export default async function ProductPage({
  params,
  searchParams,
}: ProductPageProps) {
  const { id } = await params;
  const { mode } = await searchParams;

  // If mode is edit, show the edit form
  if (mode === "edit") {
    const userId = await getUserId();

    try {
      const [business, categories, tags, product] = await Promise.all([
        getBusiness(userId),
        getCategories(),
        getTags(),
        getProductForEdit(id),
      ]);

      // Check if the product belongs to the current user's business
      if (product.supplier_id !== business?.profile_id) {
        notFound();
      }

      return (
        <main className="space-y-4 md:space-y-6 pb-24 md:pb-12 mx-auto max-w-screen-2xl px-3 md:px-6">
          <div className="pt-2 md:pt-4">
            <h1 className="text-xl md:text-3xl font-bold tracking-tight">
              Edit product
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Update your product information and settings.
            </p>
          </div>
          <div className="border-t" />
          <ProductForm
            business={business!}
            categories={categories!}
            tags={tags!}
            product={product}
            mode="edit"
          />
        </main>
      );
    } catch (error) {
      console.error("Error loading product for edit:", error);
      notFound();
    }
  }

  // Default mode: show product view
  return <ProductViewV2 id={id} />;
}
