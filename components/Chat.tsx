"use client";
import { useEffect, useState, useRef } from "react";
import { supabase, subscribeToMessages, Message } from "@/lib/supabaseBrowser";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Image from "next/image";

type UserMeta = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
};

export default function Chat({
  currentUserId,
  otherUserId,
}: {
  currentUserId: string;
  otherUserId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sender, setSender] = useState<UserMeta | null>(null);
  const [receiver, setReceiver] = useState<UserMeta | null>(null);

  const subscriptionRef = useRef<any>(null);
  const isInitialized = useRef(false);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isInitialized.current) return;

    const initializeChat = async () => {
      try {
        isInitialized.current = true;

        const response = await fetch(
          `/api/get-messages?user1=${currentUserId}&user2=${otherUserId}`
        );

        if (response.ok) {
          const {
            messages: existingMessages,
            sender,
            receiver,
          } = await response.json();
          setMessages(existingMessages);
          setSender(sender);
          setReceiver(receiver);
        }

        if (!subscriptionRef.current) {
          subscriptionRef.current = subscribeToMessages(
            currentUserId,
            (msg: Message) => {
              if (msg.sender === otherUserId) {
                setMessages((prev) => [...prev, msg]);
              }
            }
          );
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        isInitialized.current = false;
      }
    };

    initializeChat();

    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
      isInitialized.current = false;
    };
  }, [currentUserId, otherUserId]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: currentUserId,
          receiver: otherUserId,
          content: text.trim(),
        }),
      });

      if (response.ok) {
        const newMessage: Message = {
          id: crypto.randomUUID(),
          sender: currentUserId,
          receiver: otherUserId,
          content: text.trim(),
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, newMessage]);
        setText("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getUserMeta = (id: string) => {
    if (id === currentUserId) return sender;
    return receiver;
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => {
            const meta = getUserMeta(message.sender);
            return (
              <div
                key={message.id}
                ref={index === messages.length - 1 ? lastMessageRef : null}
                className={cn(
                  "max-w-xs lg:max-w-md px-3 py-2 rounded-2xl text-sm shadow-sm border",
                  "flex flex-col",
                  message.sender === currentUserId
                    ? "ml-auto bg-primary/30"
                    : "mr-auto bg-muted text-foreground"
                )}
              >
                {/* Meta info */}
                <div className="flex items-center gap-2 mb-1">
                  {meta?.avatar_url && (
                    <Image
                      src={meta.avatar_url}
                      alt="avatar"
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  )}
                  <span className="text-xs font-semibold">
                    {meta?.full_name || meta?.email || "Unknown"}
                  </span>
                </div>

                {/* Message content */}
                <span>{message.content}</span>

                {/* Timestamp */}
                <span
                  className={cn(
                    "text-xs mt-1",
                    message.sender === currentUserId
                      ? "text-white/70 self-end"
                      : "text-gray-500 self-start"
                  )}
                >
                  {formatTime(message.created_at)}
                </span>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-4 border-t flex gap-2 bg-background pb-28 sticky bottom-0">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button onClick={sendMessage} disabled={isLoading || !text.trim()}>
          {isLoading ? "..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
