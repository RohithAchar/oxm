import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

export const revalidate = 21600; // 6 hours

export const MobileLatestList = async () => {
  const supabase = await createClient();

  const { data: products, error } = await supabase.rpc(
    "get_latest_products_for_mobile"
  );

  if (error) {
    return null;
  }

  return (
    <div className="flex overflow-x-auto space-x-4 snap-x snap-mandatory scrollbar-hide">
      {products?.map((product) => (
        <ProductCard
          id={product.id}
          key={product.id}
          name={product.name}
          imageUrl={product.image_url || null}
        />
      ))}
    </div>
  );
};

export const ProductCard = ({
  id,
  imageUrl,
  name,
}: {
  id: string;
  imageUrl: string | null;
  name: string;
}) => {
  return (
    <Link href={`/products/${id}`} className="flex-none snap-start w-[100px]">
      <div className="relative h-[100px] w-[100px] overflow-hidden rounded-lg">
        <Image
          src={imageUrl || "/product-placeholder.png"}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <p className="text-sm pl-1 truncate">{name}</p>
    </Link>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="flex overflow-x-auto space-x-4 snap-x snap-mandatory scrollbar-hide">
      <Skeleton className="h-[120px] flex-none snap-start w-[100px] overflow-hidden rounded-lg" />
      <Skeleton className="h-[120px] flex-none snap-start w-[100px] overflow-hidden rounded-lg" />
      <Skeleton className="h-[120px] flex-none snap-start w-[100px] overflow-hidden rounded-lg" />
      <Skeleton className="h-[120px] flex-none snap-start w-[100px] overflow-hidden rounded-lg" />
    </div>
  );
};
