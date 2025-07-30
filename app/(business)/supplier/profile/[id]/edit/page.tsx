import { z } from "zod";
import { notFound } from "next/navigation";

import { getBusinessById } from "@/lib/controller/business/businessOperations";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ProfileForm } from "./form";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const business = await getBusinessById(id);

  if (!business) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Profile", href: "/supplier/profile" },
          {
            label: "Edit Profile",
            href: `/supplier/profile/${id}/edit`,
            active: true,
          },
        ]}
      />
      <ProfileForm business={business} />
    </main>
  );
}
