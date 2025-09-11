import { notFound } from "next/navigation";

import { getBusinessById } from "@/lib/controller/business/businessOperations";
import { ProfileForm } from "./components/form";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const business = await getBusinessById(id);

  if (!business) {
    throw new Error("Business not found");
  }

  return (
    <main>
      <ProfileForm business={business} />
    </main>
  );
}
