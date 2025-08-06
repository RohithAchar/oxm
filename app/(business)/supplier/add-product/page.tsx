import { ProductForm } from "@/components/product/product-form";
import { getBusiness } from "@/lib/controller/business/businessOperations";
import { getCategories } from "@/lib/controller/categories/categoriesOperation";
import { getTags } from "@/lib/controller/product/productOperations";
import { getUserId } from "@/lib/controller/user/userOperations";

const AddProductPage = async () => {
  const userId = await getUserId();

  const [buisness, categories, tags] = await Promise.all([
    getBusiness(userId),
    getCategories(),
    getTags(),
  ]);

  return (
    <main className="mt-4 space-y-6 pb-24 md:pb-12">
      <div>
        <h1 className="text-3xl font-light">Add Product</h1>
        <p className="text-muted-foreground mt-1 font-light">
          Add your product to the marketplace.
        </p>
      </div>
      <ProductForm business={buisness!} categories={categories!} tags={tags!} />
    </main>
  );
};

export default AddProductPage;
