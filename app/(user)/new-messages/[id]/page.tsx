"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { RealtimeChat } from "@/components/realtime-chat";
import { getUser } from "@/lib/controller/user/userOperations";

interface ChatMessage {
  id: string;
  content: string;
  user: {
    name: string;
  };
  createdAt: string;
}

const chat = [
  {
    id: "1",
    roomId: "1212",
    supplierId: "1212",
    buyerId: "1212",
    messages: [
      {
        id: "asdas",
        content: "1",
        user: {
          name: "AAAA",
        },
        createdAt: new Date().toISOString(),
      },
      {
        id: "asdas2",
        content: "2",
        user: {
          name: "AAAA",
        },
        createdAt: new Date().toISOString(),
      },
    ],
  },
];

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: "asdas",
      content: "1",
      user: {
        name: "AAAA",
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: "asdas2",
      content: "2",
      user: {
        name: "AAAA",
      },
      createdAt: new Date().toISOString(),
    },
  ]);
  const [userName, setUsername] = useState("User");
  const params = useParams<{ id: string }>();
  const { id: roomId } = params;

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUser();
      setUsername(res.user.user_metadata.full_name);
    };

    const checkIsRoomExists = async () => {
      const res = await axios.get(`/api/is-room-exists/${roomId}`);
      console.log(res.data);
    };

    fetchUser();
    checkIsRoomExists();
  }, []);

  const handleMessage = (messages: ChatMessage[]) => {
    // Save to db
  };

  return (
    <RealtimeChat
      roomName={roomId}
      username={userName}
      messages={messages}
      onMessage={handleMessage}
    />
  );
};

export default ChatPage;
