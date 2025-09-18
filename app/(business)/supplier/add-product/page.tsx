import { ProductForm } from "@/components/product/product-form";
import { getBusiness } from "@/lib/controller/business/businessOperations";
import { getCategories } from "@/lib/controller/categories/categoriesOperation";
import { getTags } from "@/lib/controller/product/productOperations";
import { getUserId } from "@/lib/controller/user/userOperations";
import { PageHeader } from "@/components/PageHeader";

export const metadata = {
  title: "Add Product | Supplier Portal | OpenXmart",
  description: "Create a new product listing for buyers to discover.",
};

const AddProductPage = async () => {
  const userId = await getUserId();

  const [buisness, categories, tags] = await Promise.all([
    getBusiness(userId),
    getCategories(),
    getTags(),
  ]);

  return (
    <main className="space-y-4 md:space-y-6 pb-24 md:pb-12 mx-auto max-w-screen-2xl px-3 md:px-6">
      <div className="pt-2 md:pt-4">
        <h1 className="text-xl md:text-3xl font-bold tracking-tight">
          Add product
        </h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Create a new product listing for buyers to discover.
        </p>
      </div>
      <div className="border-t" />
      <ProductForm business={buisness!} categories={categories!} tags={tags!} />
    </main>
  );
};

export default AddProductPage;
