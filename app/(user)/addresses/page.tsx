import { Suspense } from "react";
import { AddressList } from "@/components/address/address-list";
import { AddressListSkeleton } from "@/components/address/skeletons";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

const AddressesPage = async () => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Manage Addresses</h1>
          <p className="text-muted-foreground mt-1">
            Add and manage your shipping and billing addresses
          </p>
        </div>
        <Button asChild>
          <Link href="/addresses/new">
            <Plus className="w-4 h-4 mr-2" />
            Add New Address
          </Link>
        </Button>
      </div>

      <Suspense fallback={<AddressListSkeleton />}>
        <AddressList />
      </Suspense>
    </div>
  );
};

export default AddressesPage;


