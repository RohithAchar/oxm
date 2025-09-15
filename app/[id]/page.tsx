import { getBusinessById } from "@/lib/controller/business/businessOperations";
import { getProductsBySupplier } from "@/lib/controller/product/productOperations";
import SupplierProfileClient from "@/components/supplier/supplier-profile-client";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const business = await getBusinessById(id);

  if (!business) {
    return {
      title: "Supplier not found | OpenXmart",
      description: "This supplier profile is not available on OpenXmart.",
    };
  }

  return {
    title: `${business.business_name} | Supplier Profile | OpenXmart`,
    description: `View ${business.business_name}'s profile, products, and business information on OpenXmart.`,
    openGraph: {
      title: `${business.business_name} | Supplier Profile`,
      description: `View ${business.business_name}'s profile, products, and business information.`,
      images: business.profile_avatar_url ? [business.profile_avatar_url] : [],
    },
  };
}

export default async function SupplierProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const business = await getBusinessById(id);

  if (!business) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-medium text-gray-900">
            Supplier not found
          </h2>
          <p className="text-gray-500">
            The supplier profile you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const products = await getProductsBySupplier(business.profile_id!);

  // Ensure products is always an array
  const safeProducts = Array.isArray(products) ? products : [];

  return <SupplierProfileClient business={business} products={safeProducts} />;
}
