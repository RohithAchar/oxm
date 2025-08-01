import LogoutButton from "@/components/LogoutButton";
import { ProfileCardSkeleton } from "@/components/user/skeletons";
import { Button } from "@/components/ui/button";
import { ProfileCard } from "@/components/user/profile-card";
import Link from "next/link";
import { Suspense } from "react";

const AccountPage = async () => {
  return (
    <div className="p-4 flex flex-col gap-4 max-w-4xl mx-auto md:grid md:grid-cols-2">
      <div className="mt-4 md:mt-8 flex flex-col gap-2">
        <Suspense fallback={<ProfileCardSkeleton />}>
          <ProfileCard />
        </Suspense>

        <div className="grid grid-cols-2 gap-4 bg-card p-4 rounded-lg border">
          <Button
            asChild
            variant={"link"}
            className="bg-primary text-primary-foreground"
          >
            <Link href={"/supplier/profile"}>Supplier Hub</Link>
          </Button>
          <Button
            asChild
            variant={"link"}
            className="bg-primary text-primary-foreground"
          >
            <Link href={"/dropship"}>Dropship Store</Link>
          </Button>
        </div>
      </div>
      <div className="mt-8 flex flex-col items-start gap-2">
        <div className="w-full">
          <Button
            asChild
            variant={"link"}
            className="text-base text-foreground"
          >
            <Link href={"/orders"}>My order & wishlist</Link>
          </Button>
        </div>
        <div className="w-full">
          <Button
            asChild
            variant={"link"}
            className="text-base text-foreground"
          >
            <Link href={"/messages"}>Messages</Link>
          </Button>
        </div>
        <div className="w-full">
          <Button
            asChild
            variant={"link"}
            className="text-base text-foreground"
          >
            <Link href={"/notifications"}>Notifications</Link>
          </Button>
        </div>
        <div className="w-full">
          <Button
            asChild
            variant={"link"}
            className="text-base text-foreground"
          >
            <Link href={"/buyer-protection-policy"}>
              Buyer protection policy
            </Link>
          </Button>
        </div>
        <div className="w-full">
          <Button
            asChild
            variant={"link"}
            className="text-base text-foreground"
          >
            <Link href={"/support"}>Support</Link>
          </Button>
        </div>
        <div className="w-full">
          <Button
            asChild
            variant={"link"}
            className="text-base text-foreground"
          >
            <Link href={"/legal-policies"}>Legal policies</Link>
          </Button>
        </div>
        <div className="w-full">
          <LogoutButton className="text-destructive" variant="link" />
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
