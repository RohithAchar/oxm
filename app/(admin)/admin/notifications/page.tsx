"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [severity, setSeverity] = useState("info");
  const [type, setType] = useState("system");
  const [actionUrl, setActionUrl] = useState("");
  const [recipients, setRecipients] = useState("");
  const [sendToAll, setSendToAll] = useState(true);
  const [supplierOptions, setSupplierOptions] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [supplierSearch, setSupplierSearch] = useState("");
  const [supplierPage, setSupplierPage] = useState(1);
  const [supplierTotal, setSupplierTotal] = useState(0);
  const [selectedSupplierIds, setSelectedSupplierIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const params = new URLSearchParams();
        if (supplierSearch.trim()) params.set("q", supplierSearch.trim());
        params.set("page", String(supplierPage));
        params.set("limit", "20");
        const res = await fetch(`/api/admin/suppliers?${params.toString()}`, {
          cache: "no-store",
        });
        const json = await res.json();
        const opts = (json.data || []).map((s: any) => ({
          id: s.profile_id,
          name: s.business_name || s.profile_id,
        }));
        setSupplierOptions(opts);
        setSupplierTotal(json.count || 0);
      } catch (_) {}
    };
    loadSuppliers();
  }, [supplierSearch, supplierPage]);

  const submit = async () => {
    if (!title.trim() || !body.trim()) {
      toast.error("Title and body are required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body,
          severity,
          type,
          action_url: actionUrl || null,
          recipients: sendToAll
            ? undefined
            : selectedSupplierIds.length > 0
            ? selectedSupplierIds
            : recipients
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
        }),
      });
      if (res.ok) {
        toast.success("Notification sent");
        setTitle("");
        setBody("");
        setActionUrl("");
        setSeverity("info");
        setType("system");
        setRecipients("");
        setSelectedSupplierIds([]);
        setSendToAll(true);
      } else {
        const j = await res.json();
        toast.error(j.error || "Failed to send notification");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="space-y-4 md:space-y-6 pb-24 md:pb-12">
      <div className="pt-2 md:pt-4">
        <h1 className="text-xl md:text-3xl font-bold tracking-tight">
          Send Notification
        </h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Broadcast a notification to all suppliers.
        </p>
      </div>
      <div className="border-t" />
      <Card>
        <CardHeader>
          <CardTitle>Recipients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="text-sm font-medium">
                  Send to all suppliers
                </Label>
                <p className="text-xs text-muted-foreground">
                  Turn off to select specific suppliers.
                </p>
              </div>
              <input
                type="checkbox"
                checked={sendToAll}
                onChange={(e) => setSendToAll(e.target.checked)}
                className="h-5 w-5 accent-foreground"
              />
            </div>
          </div>
          {!sendToAll && (
            <>
              <div className="space-y-2">
                <Label>Select Suppliers</Label>
                <div className="flex items-center gap-2 mb-2">
                  <Input
                    value={supplierSearch}
                    onChange={(e) => {
                      setSupplierPage(1);
                      setSupplierSearch(e.target.value);
                    }}
                    placeholder="Search suppliers by name or ID"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-auto border rounded p-2">
                  {supplierOptions.map((s) => {
                    const checked = selectedSupplierIds.includes(s.id);
                    return (
                      <label
                        key={s.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            setSelectedSupplierIds((prev) =>
                              e.target.checked
                                ? [...prev, s.id]
                                : prev.filter((id) => id !== s.id)
                            );
                          }}
                        />
                        <span className="truncate" title={s.name}>
                          {s.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                  <div>
                    Page {supplierPage} · Showing {supplierOptions.length} of{" "}
                    {supplierTotal}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={supplierPage <= 1}
                      onClick={() => setSupplierPage((p) => Math.max(1, p - 1))}
                    >
                      Prev
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={supplierPage * 20 >= supplierTotal}
                      onClick={() => setSupplierPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Or paste Supplier Profile IDs (comma-separated)</Label>
                <Input
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  placeholder="e.g., 123e4567-... , ..."
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Compose</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Notification title"
              />
            </div>
            <div className="space-y-2">
              <Label>Severity</Label>
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Body</Label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write the message..."
              className="min-h-[140px]"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="policy">Policy</SelectItem>
                  <SelectItem value="order">Order</SelectItem>
                  <SelectItem value="rfq">RFQ</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Action URL (optional)</Label>
              <Input
                value={actionUrl}
                onChange={(e) => setActionUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button onClick={submit} disabled={loading}>
              {loading ? "Sending..." : "Send"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
