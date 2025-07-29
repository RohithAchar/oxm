import { getUser } from "@/lib/controller/user/userOperations";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const ProfileCard = async () => {
  const { user } = await getUser();

  return (
    <div className="flex items-center gap-2 bg-muted p-4 rounded-lg">
      <Avatar className="w-12 h-12">
        <AvatarImage
          src={user.user_metadata.avatar_url || "/placeholder-profile.png"}
          alt="User Avatar"
        />
        <AvatarFallback>
          {user.user_metadata.email.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">
          {user.user_metadata.full_name || user.user_metadata.email}
        </p>
        <p className="text-muted-foreground">{user.user_metadata.email}</p>
      </div>
    </div>
  );
};
