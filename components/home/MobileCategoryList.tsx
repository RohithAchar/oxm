import Link from "next/link";

import { createClient } from "@/utils/supabase/server";
import { Skeleton } from "../ui/skeleton";

export const revalidate = 21600; // 6 hours

export const MobileCategoryList = async () => {
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .limit(6);

  if (error) {
    return (
      <div className="flex space-x-4 items-center justify-center">
        No Categories.
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto space-x-4 snap-x snap-mandatory scrollbar-hide">
      {categories.map((cat, idx) => (
        <CategoryCard key={cat.id} id={cat.id} name={cat.name} idx={idx + 1} />
      ))}
    </div>
  );
};

export const CategoryCard = ({
  id,
  name,
  idx,
}: {
  id: string;
  name: string;
  idx: number;
}) => {
  return (
    <Link
      href={`/products?category=${id}`}
      className="flex-none snap-start w-[100px]"
    >
      <div
        style={{
          backgroundImage: `url(/category_bg/bg_${idx}.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="relative h-[100px] w-[100px] overflow-hidden rounded-lg flex items-center justify-center text-center font-bold text-sm text-black"
      >
        {name}
      </div>
    </Link>
  );
};

export const CategoryCardSkeleton = () => {
  return (
    <div className="flex overflow-x-auto space-x-4 snap-x snap-mandatory scrollbar-hide">
      <Skeleton className="h-[100px] flex-none snap-start w-[100px] overflow-hidden rounded-lg" />
      <Skeleton className="h-[100px] flex-none snap-start w-[100px] overflow-hidden rounded-lg" />
      <Skeleton className="h-[100px] flex-none snap-start w-[100px] overflow-hidden rounded-lg" />
      <Skeleton className="h-[100px] flex-none snap-start w-[100px] overflow-hidden rounded-lg" />
    </div>
  );
};
