import { getCategoriesWithChildren } from "@/lib/controller/categories/categoriesOperation";
import CategoriesGrid from "../../components/categories/categories-grid";

export type Category = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  icon: string | null;
  children?: Category[];
};

export default async function CategoriesPage() {
  const categories = (await getCategoriesWithChildren()) as Category[];
  const parentCategories = categories.filter((cat) => cat.parent_id === null);

  return (
    <main className="container mx-auto max-w-7xl px-4 py-10">
      <CategoriesGrid categories={parentCategories} />
    </main>
  );
}
