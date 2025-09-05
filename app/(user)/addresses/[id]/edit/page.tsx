import { AddressForm } from "@/components/address/address-form";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getAddressById } from "@/lib/controller/address/addressOperations";
import { notFound } from "next/navigation";

interface EditAddressPageProps {
  params: Promise<{ id: string }>;
}

const EditAddressPage = async ({ params }: EditAddressPageProps) => {
  const { id } = await params;
  const address = await getAddressById(id);

  if (!address) {
    notFound();
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Account", href: "/account" },
          { label: "Addresses", href: "/addresses" },
          {
            label: "Edit Address",
            href: `/addresses/${id}/edit`,
            active: true,
          },
        ]}
      />

      <div className="mt-6">
        <h1 className="text-2xl font-semibold mb-2">Edit Address</h1>
        <p className="text-muted-foreground mb-6">
          Update your address information
        </p>

        <AddressForm address={address} />
      </div>
    </div>
  );
};

export default EditAddressPage;
