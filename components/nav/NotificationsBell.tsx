"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotificationsBell() {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("/api/notifications", { cache: "no-store" });
        const json = await res.json();
        const items = (json.data || []) as Array<{ read_at: string | null }>;
        const count = items.filter((r) => !r.read_at).length;
        if (active) setUnread(count);
      } catch (_) {}
    };
    load();
    const id = setInterval(load, 30000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className="relative text-muted-foreground hover:text-foreground cursor-pointer"
    >
      <Link href="/supplier/notifications" aria-label="Notifications">
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
        )}
      </Link>
    </Button>
  );
}
