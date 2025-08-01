import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

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
      className="shadow-sm p-2 pb-4 border rounded-xl bg-card space-y-4 h-fit"
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
          <h2 className="truncate font-semibold text-sm">{name}</h2>
          <p className="text-xs text-muted-foreground">{brand}</p>
        </div>
        {priceAndQuantity?.length > 0 && (
          <div>
            {priceAndQuantity.map(
              (priceNqty: { id: string; quantity: number; price: number }) => (
                <div key={priceNqty.id} className="flex gap-2 text-sm truncate">
                  <p className="truncate">{priceNqty.quantity} pcs</p>
                  <p className="truncate">Price: ₹{priceNqty.price}/pcs</p>
                </div>
              )
            )}
          </div>
        )}
      </div>
      <Button className="w-full" asChild>
        <Link href={`/products/${id}`}>View Product</Link>
      </Button>
    </div>
  );
};
