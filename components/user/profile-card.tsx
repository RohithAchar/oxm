import { getUser } from "@/lib/controller/user/userOperations";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const ProfileCard = async () => {
  const { user } = await getUser();

  return (
    <div className="flex items-center gap-2 bg-card p-4 rounded-lg border">
      <Avatar className="w-12 h-12 border">
        <AvatarImage
          src={user.user_metadata.avatar_url || "/placeholder-profile.png"}
          alt="User Avatar"
        />
        <AvatarFallback>
          {user.user_metadata.email.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center justify-between w-full">
        <div>
          <p className="font-medium">
            {user.user_metadata.full_name || user.user_metadata.email}
          </p>
          <p className="text-muted-foreground">{user.user_metadata.email}</p>
        </div>
        <ChevronRight className="hidden group-hover:block" />
      </div>
    </div>
  );
};
