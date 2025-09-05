import { getUserAddresses } from "@/lib/controller/address/addressOperations";
import { AddressCard } from "./address-card";
import { Button } from "@/components/ui/button";
import { MapPin, Plus } from "lucide-react";
import Link from "next/link";

export async function AddressList() {
  const addresses = await getUserAddresses();

  if (addresses.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No addresses found</h3>
        <p className="text-muted-foreground mb-6">
          You haven't added any addresses yet. Add your first address to get
          started.
        </p>
        <Button asChild>
          <Link href="/addresses/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Address
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {addresses.map((address) => (
          <AddressCard key={address.id} address={address} />
        ))}
      </div>
    </div>
  );
}
