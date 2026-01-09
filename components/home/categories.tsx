import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/utils/supabase/database.types";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

type Category = Tables<"categories">;

export const Categories = async () => {
  let categories: Category[] = [];
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .is("parent_id", null);

    if (error) throw error;
    categories = data as Category[];
  } catch (error) {
    console.error(error);
  }
  return (
    <div className="flex md:grid md:grid-cols-6 gap-3 md:gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0 -mx-4 md:mx-0 px-4 md:px-0 scrollbar-hide">
      {categories.map((category) => (
        <div key={category.id} className="flex-shrink-0 w-[90px] md:w-auto">
          <Category
            name={category.name}
            icon={category.icon}
            slug={category.slug}
          />
        </div>
      ))}
    </div>
  );
};

interface CategoryProps {
  name: string;
  icon: string | null;
  slug: string;
}

const Category = ({ name, icon, slug }: CategoryProps) => {
  // Convert icon name from database to PascalCase
  // e.g., 'home' -> 'Home', 'shopping-bag' -> 'ShoppingBag'
  const getIconComponent = (iconName: string | null): LucideIcon => {
    if (!iconName) return Icons.Circle;

    const pascalCase = iconName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");

    return (Icons as any)[pascalCase] || Icons.Circle;
  };

  const IconComponent = getIconComponent(icon);

  return (
    <Button
      variant="outline"
      asChild
      className="h-auto w-full flex-col gap-2 py-3 px-2 md:flex-row md:py-2 md:px-4"
    >
      <Link
        className="flex flex-col items-center justify-center gap-2 text-center active:scale-95 transition-transform"
        href={`/category/${slug}`}
      >
        <IconComponent className="w-5 h-5 md:w-4 md:h-4 flex-shrink-0" />
        <p className="text-[10px] md:text-sm font-medium leading-tight line-clamp-2 text-center">
          {name}
        </p>
      </Link>
    </Button>
  );
};

const CategorySkeleton = () => {
  return (
    <Button
      variant="outline"
      disabled
      className="h-auto w-full flex-col gap-2 py-3 px-2 md:flex-row md:py-2 md:px-4"
    >
      <Skeleton className="h-5 w-5 rounded-md md:h-4 md:w-4" />
      <Skeleton className="h-3 w-full rounded md:h-4 md:w-24" />
    </Button>
  );
};

export const CategorySkeletons = () => {
  return (
    <div className="flex md:grid md:grid-cols-6 gap-3 md:gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0 -mx-4 md:mx-0 px-4 md:px-0 scrollbar-hide">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-[90px] md:w-auto">
          <CategorySkeleton />
        </div>
      ))}
    </div>
  );
};
