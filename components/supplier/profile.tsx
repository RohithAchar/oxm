import { getBusiness } from "@/lib/controller/business/businessOperations";
import { getUserId } from "@/lib/controller/user/userOperations";
import { Button } from "../ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const Profile = async () => {
  const userId = await getUserId();
  const business = await getBusiness(userId);

  return (
    <div className="flex flex-col gap-4 max-w-2xl rounded-2xl border p-4">
      <div>
        <h1 className="text-xl font-semibold">Business Profile</h1>
        <p className="text-muted-foreground">
          Manage your business profile and settings.
        </p>
      </div>
      <div className="bg-muted p-4 rounded-xl flex gap-2 border">
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
      <div className="bg-muted p-4 rounded-xl flex flex-col gap-4 border">
        <div>
          <p>GST Number</p>
          <p className="text-muted-foreground">{business.gst_number}</p>
        </div>
        <div>
          <p>Alternate Phone Number</p>
          <p className="text-muted-foreground">{business.alternate_phone}</p>
        </div>
        <div>
          <p>Address</p>
          <p className="text-muted-foreground">{business.business_address}</p>
          <p className="text-muted-foreground">{business.city}</p>
          <p className="text-muted-foreground">
            {business.state} - {business.pincode}
          </p>
        </div>
        <div>
          <p>Business Type</p>
          <p className="text-muted-foreground">{business.type}</p>
        </div>
        <Button asChild>
          <Link href={"/supplier/profile/edit"}>Edit</Link>
        </Button>
      </div>
    </div>
  );
};
