import { getBusiness } from "@/lib/controller/business/businessOperations";
import { getUserId } from "@/lib/controller/user/userOperations";
import { Button } from "../ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { notFound } from "next/navigation";

export const Profile = async () => {
  const userId = await getUserId();
  const business = await getBusiness(userId);

  if (!business) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mt-4">
      <div>
        <h1 className="text-3xl font-light">Business Profile</h1>
        <p className="text-muted-foreground mt-1 font-light">
          Manage your business profile and settings.
        </p>
      </div>
      <div className="bg-card p-4 rounded-xl flex gap-2 border">
        <Avatar className="w-12 h-12 border">
          <AvatarImage
            src={business.profile_avatar_url || "/placeholder-profile.png"}
            alt="Business Avatar"
          />
          <AvatarFallback>
            {business.business_name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p>{business.business_name}</p>
          <p className="text-muted-foreground">{business.phone}</p>
        </div>
      </div>
      <div className="bg-card p-4 rounded-xl flex flex-col gap-6 border">
        <div>
          <p>GST Number</p>
          <p className="text-muted-foreground text-sm">{business.gst_number}</p>
        </div>
        <div>
          <p>Alternate Phone Number</p>
          <p className="text-muted-foreground text-sm">
            {business.alternate_phone}
          </p>
        </div>
        <div>
          <p>Address</p>
          <p className="text-muted-foreground text-sm">
            {business.business_address}
          </p>
          <p className="text-muted-foreground text-sm">{business.city}</p>
          <p className="text-muted-foreground text-sm">
            {business.state} - {business.pincode}
          </p>
        </div>
        <div>
          <p>Business Type</p>
          <p className="text-muted-foreground text-sm">{business.type}</p>
        </div>
        <Button className="bg-foreground" asChild>
          <Link href={`/supplier/profile/${business.id}/edit`}>Edit</Link>
        </Button>
      </div>
    </div>
  );
};
