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
    <div className="grid grid-cols-6 gap-4">
      {categories.map((category) => (
        <Category
          key={category.id}
          name={category.name}
          icon={category.icon}
          slug={category.slug}
        />
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
    <Button variant="outline" asChild>
      <Link className="flex items-center gap-2" href={`/category/${slug}`}>
        <IconComponent />
        <p className="text-wrap">{name}</p>
      </Link>
    </Button>
  );
};

const CategorySkeleton = () => {
  return (
    <Button variant="outline" disabled className="flex items-center gap-2">
      <Skeleton className="h-8 w-8 rounded-md" />
      <Skeleton className="h-4 w-24" />
    </Button>
  );
};

export const CategorySkeletons = () => {
  return (
    <div className="grid grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <CategorySkeleton key={i} />
      ))}
    </div>
  );
};
