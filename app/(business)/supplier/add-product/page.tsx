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
    <main className="mt-4 space-y-6 pb-24 md:pb-12 mx-auto max-w-7xl">
      <PageHeader
        title="Add Product"
        description="Add your product to the marketplace."
      />
      <ProductForm business={buisness!} categories={categories!} tags={tags!} />
    </main>
  );
};

export default AddProductPage;
