import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { Eye } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  priceAndQuantity: any[];
}

export const ProductCard = ({
  id,
  name,
  brand,
  imageUrl,
  priceAndQuantity,
}: ProductCardProps) => {
  return (
    <div
      key={id}
      className="shadow-sm p-2 border rounded-xl bg-card space-y-4 h-fit"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
        <Image
          fill
          src={imageUrl || "/product-placeholder.png"}
          alt="Product Image"
          className="object-cover rounded-lg"
        />
      </div>
      <div className="space-y-2">
        <div>
          <h1 className="truncate font-semibold text-lg text-foreground">
            {name}
          </h1>
          <p className="text-xs text-muted-foreground">{brand}</p>
        </div>
        {priceAndQuantity && priceAndQuantity?.length > 0 && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {priceAndQuantity?.length > 0 && (
              <>
                <span className="truncate">
                  Min: {priceAndQuantity[0].quantity} pcs
                </span>
                <span className="truncate">
                  ₹{priceAndQuantity[0].price} / pc
                </span>
                {priceAndQuantity.length > 1 && (
                  <span className="text-xs">...</span>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <Button variant={"secondary"} className="w-full" asChild>
        <Link href={`/products/${id}`}>
          <Eye className="h-4 w-4 text-primary" />
          View Product
        </Link>
      </Button>
    </div>
  );
};
