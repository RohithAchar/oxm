"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Bell, CheckCircle, ExternalLink } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type Severity = "info" | "warning" | "critical";

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: string;
  severity: Severity;
  action_url?: string | null;
  created_at: string;
}

interface ReceiptItem {
  id: string;
  status: string;
  read_at: string | null;
  created_at: string;
  notification: NotificationItem | null;
}

export default function SupplierNotificationsPage() {
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/notifications?markRead=1", {
          cache: "no-store",
        });
        const json = await res.json();
        setItems(json.data || []);
      } catch (e) {
        toast.error("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const markRead = async (notificationId: string) => {
    try {
      const res = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "POST",
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((r) =>
            r.notification && r.notification.id === notificationId
              ? { ...r, read_at: new Date().toISOString(), status: "read" }
              : r
          )
        );
      }
    } catch (e) {
      toast.error("Failed to mark as read");
    }
  };

  if (loading) {
    return (
      <main className="space-y-4 md:space-y-6 pb-24 md:pb-12">
        <div className="pt-2 md:pt-4">
          <h1 className="text-xl md:text-3xl font-bold tracking-tight">
            Notifications
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Latest updates from OpenXmart.
          </p>
        </div>
        <div className="border-t" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-4 md:space-y-6 pb-24 md:pb-12">
      <div className="pt-2 md:pt-4">
        <h1 className="text-xl md:text-3xl font-bold tracking-tight">
          Notifications
        </h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Latest updates from OpenXmart.
        </p>
      </div>
      <div className="border-t" />

      <div className="space-y-3">
        {items.map((r) => {
          if (!r.notification) return null;
          const s = r.notification.severity;
          const color =
            s === "critical"
              ? "destructive"
              : s === "warning"
              ? "secondary"
              : "default";
          return (
            <Card key={r.id} className={r.read_at ? "opacity-80" : ""}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Bell className="w-4 h-4" /> {r.notification.title}
                  {!r.read_at && <Badge variant="destructive">New</Badge>}
                </CardTitle>
                <Badge variant={color as any} className="capitalize">
                  {r.notification.severity}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {r.notification.body}
                </p>
                <div className="flex items-center gap-2 justify-between">
                  <div className="text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleString()}
                  </div>
                  <div className="flex gap-2">
                    {r.notification.action_url && (
                      <Button asChild size="sm" variant="outline">
                        <Link href={r.notification.action_url} target="_blank">
                          Open <ExternalLink className="w-3 h-3 ml-1" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {items.length === 0 && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="w-4 h-4" /> No notifications
          </div>
        )}
      </div>
    </main>
  );
}
