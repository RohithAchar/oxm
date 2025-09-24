import {
  getAllUsersChat,
  getUserId,
} from "@/lib/controller/user/userOperations";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Users } from "lucide-react";
import Chat from "@/components/Chat";

interface PageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function EnquiryPage({ searchParams }: PageProps) {
  const myId = await getUserId();
  const users = await getAllUsersChat({ myId });
  const selectedUserId =
    typeof searchParams?.user === "string" ? searchParams?.user : undefined;

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex h-[calc(100vh-56px)] bg-background">
      {/* Sidebar */}
      <div className="w-full md:w-80 md:border-r bg-card/50 backdrop-blur-sm md:block">
        <div className="p-4 md:p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MessageCircle className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-base md:text-lg">Enquiries</h1>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-2 md:p-4">
          <div className="space-y-2">
            {users.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No conversations yet</p>
              </div>
            ) : (
              users.map(
                (user: {
                  id: string;
                  full_name: string | null;
                  avatar_url: string | null;
                }) => (
                  <Link
                    key={user.id}
                    href={`/supplier/enquiry?user=${user.id}`}
                  >
                    <div className="transition-all duration-200 hover:bg-accent/50 hover:shadow-md cursor-pointer group rounded-lg p-3 md:p-4 border">
                      <div className="flex items-center gap-2 md:gap-3">
                        <Avatar className="h-10 w-10 md:h-12 md:w-12">
                          <AvatarImage
                            src={user.avatar_url || undefined}
                            alt={user.full_name || "User"}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs md:text-sm">
                            {getInitials(user.full_name)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm md:text-base text-foreground truncate group-hover:text-primary transition-colors">
                            {user.full_name || "Unknown User"}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              )
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="border-b bg-card/30 backdrop-blur-sm px-4 md:px-6 py-3 md:py-4">
          <h2 className="font-semibold text-base md:text-lg">Chat</h2>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 md:p-6">
            {selectedUserId ? (
              // @ts-expect-error Server/Client boundary - Chat is client component
              <Chat currentUserId={myId} otherUserId={selectedUserId} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-semibold">
                    Select a conversation
                  </h2>
                  <p className="text-muted-foreground max-w-sm">
                    Choose a contact on the left to view and reply to enquiries.
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
