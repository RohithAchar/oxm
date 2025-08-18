import Chat from "@/components/Chat";
import { getUserId } from "@/lib/controller/user/userOperations";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: recieverId } = await params;
  const myId = await getUserId();
  return (
    <div>
      <Chat currentUserId={myId} otherUserId={recieverId} />
    </div>
  );
};

export default Page;
