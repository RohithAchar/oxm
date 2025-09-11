import { AddressForm } from "@/components/address/address-form";

const NewAddressPage = () => {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mt-6">
        <h1 className="text-2xl font-semibold mb-2">Add New Address</h1>
        <p className="text-muted-foreground mb-6">
          Add a new shipping or billing address
        </p>

        <AddressForm />
      </div>
    </div>
  );
};

export default NewAddressPage;


