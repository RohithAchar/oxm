// app/(business)/create-business/page.tsx

import SupplierBusinessForm from "@/components/supplier/supplier-business-form";
import { Card } from "@/components/ui/card";
import { isBusinessExists } from "@/lib/controller/business/businessOperations";
import { getUser } from "@/lib/controller/user/userOperations";
import Image from "next/image";
import { redirect } from "next/navigation";

const CreateBusinessPage = async () => {
  const user = await getUser();

  if (!user.user?.id) {
    redirect("/login");
  }

  const isBusiness = await isBusinessExists(user.user.id);

  // If business exists and is verified, redirect to supplier dashboard
  if (isBusiness) {
    redirect("/supplier/profile");
  }

  return (
    <div className="container mx-auto py-8 md:pb-16 px-4">
      <main className="pb-24 md:pb-0 grid md:grid-cols-2">
        <Card className="hidden md:block h-full rounded-r-none relative overflow-hidden">
          <Image
            fill
            src="/create-business.jpg"
            alt="Create Business"
            className="object-cover"
          />
        </Card>
        <SupplierBusinessForm userId={user.user.id} />
      </main>
    </div>
  );
};

export default CreateBusinessPage;
