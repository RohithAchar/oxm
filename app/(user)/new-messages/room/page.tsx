"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";

import { getUser } from "@/lib/controller/user/userOperations";
import axios from "axios";
import { RealtimeChat } from "@/components/realtime-chat";

interface ChatMessage {
  id: string;
  content: string;
  user: {
    name: string;
  };
  createdAt: string;
  saved?: boolean;
}

const ChatPage = () => {
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const searchParams = useSearchParams();
  const savedMessageIds = useRef<Set<string>>(new Set());
  const [roomId, setRoomId] = useState(searchParams.get("room"));
  const [loading, setLoading] = useState(false);

  const senderId = searchParams.get("sender");
  const receiverId = searchParams.get("reciever"); // note spelling from URL

  //   username
  useEffect(() => {
    const getAndSetUsername = async () => {
      setLoading(true);
      const res = await getUser();

      let name = res.user.user_metadata.full_name;
      if (!name) {
        const email = res.user.user_metadata.email; // e.g., "example@gmail.com"
        const [username] = email.split("@");
        name = username;
      }

      setUsername(name);
      setLoading(false);
    };
    getAndSetUsername();
  }, []);

  //   create room if not exists
  useEffect(() => {
    const isRoomExistsInDb = async () => {
      setLoading(true);
      const res = await axios.get(
        `/api/is-room-exists?sender=${senderId}&receiver=${receiverId}`
      );

      if (res.data.roomId === null) {
        const createRoomRes = await axios.post(`/api/create-chat-room`, {
          sender: senderId,
          receiver: receiverId,
        });
        setRoomId(createRoomRes.data);
      } else {
        setRoomId(res.data.roomId);
      }
      setLoading(false);
    };

    if (!roomId) isRoomExistsInDb();
  }, []);

  // fetch messages
  useEffect(() => {
    if (roomId && roomId?.length > 0) {
      const fetchMessages = async () => {
        setLoading(true);
        const res = await axios.get(`/api/get-messages-v2?roomId=${roomId}`);

        // Ensure it's an array
        setMessages(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      };
      fetchMessages();
    }
  }, [roomId]);

  const handleMessage = useCallback(
    async (newMessages: ChatMessage[]) => {
      console.log("handleMessage called", newMessages.length);

      setMessages((prevMessages) => {
        // Only process if messages actually changed
        if (JSON.stringify(prevMessages) !== JSON.stringify(newMessages)) {
          // Check if there's a new message from current user
          const newUserMessages = newMessages.filter(
            (msg) =>
              msg.user.name === username &&
              !prevMessages.some((prev) => prev.id === msg.id) &&
              !savedMessageIds.current.has(msg.id)
          );

          // Only save if it's a message from the current user and hasn't been saved yet
          if (newUserMessages.length > 0) {
            // Process messages sequentially to avoid race conditions
            newUserMessages.forEach((msg) => {
              // Add to saved set immediately to prevent duplicate processing
              savedMessageIds.current.add(msg.id);

              // Save to database
              axios
                .post("/api/save-messages", {
                  chatRoomId: roomId,
                  content: msg.content,
                  username: msg.user.name,
                })
                .catch((error) => {
                  console.error("Failed to save message:", error);
                  // Remove from saved set if save failed
                  savedMessageIds.current.delete(msg.id);
                });
            });
          }

          return newMessages;
        }
        return prevMessages;
      });
    },
    [roomId, username]
  );

  if (loading || !roomId || !username) {
    return <div>Loading chat...</div>;
  }

  return (
    <RealtimeChat
      roomName={roomId!}
      username={username}
      onMessage={handleMessage}
      messages={messages}
    />
  );
};

const ChatPageWithSuspense = () => {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <ChatPage />
    </Suspense>
  );
};

export default ChatPageWithSuspense;
