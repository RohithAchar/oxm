"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";

type Size = { id: string; name: string };

export default function SupplierSizesPage() {
  const [list, setList] = useState<Size[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await fetch("/api/sizes", { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      setList(json?.data ?? []);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const res = await fetch("/api/sizes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    setLoading(false);
    if (res.ok) {
      setName("");
      toast.success("Size added");
      load();
    } else {
      toast.error("Failed to add size");
    }
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/sizes/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Size removed");
      setList((prev) => prev.filter((x) => x.id !== id));
    } else {
      toast.error("Failed to remove size");
    }
  };

  return (
    <main className="p-4 lg:p-6 space-y-6">
      <PageHeader
        title="Manage Sizes"
        description="Create, update, and remove standard sizes for your products."
      />
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Size name (e.g., S, M, 32)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="max-w-[300px]"
            />
            <Button onClick={add} disabled={loading} variant="outline">
              Add
            </Button>
          </div>

          <div className="space-y-2">
            {list.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3 border rounded-md p-2"
              >
                <span className="font-medium">{s.name}</span>
                <Button
                  className="ml-auto"
                  size="icon"
                  variant="ghost"
                  onClick={() => remove(s.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {list.length === 0 && (
              <p className="text-sm text-muted-foreground">No sizes yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
