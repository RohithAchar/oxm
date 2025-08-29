"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { toast } from "sonner";

type Color = { id: string; name: string; hex_code: string };

export default function SupplierColorsPage() {
  const [list, setList] = useState<Color[]>([]);
  const [name, setName] = useState("");
  const [hex, setHex] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await fetch("/api/colors", { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      setList(json?.data ?? []);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    if (!name.trim() || !hex.trim()) return;
    setLoading(true);
    const res = await fetch("/api/colors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), hex: hex.trim() }),
    });
    setLoading(false);
    if (res.ok) {
      setName("");
      setHex("");
      toast.success("Color added");
      load();
    } else {
      toast.error("Failed to add color");
    }
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/colors/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Color removed");
      setList((prev) => prev.filter((x) => x.id !== id));
    } else {
      toast.error("Failed to remove color");
    }
  };

  return (
    <main className="p-4 lg:p-6">
      <h1 className="text-xl font-semibold mb-4">Manage Colors</h1>
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Color name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="max-w-[240px]"
            />
            <Input
              placeholder="#RRGGBB"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="max-w-[160px]"
            />
            <Button onClick={add} disabled={loading} variant="outline">
              Add
            </Button>
          </div>

          <div className="space-y-2">
            {list.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 border rounded-md p-2"
              >
                <span
                  className="w-5 h-5 rounded"
                  style={{ backgroundColor: c.hex_code }}
                />
                <span className="font-medium">{c.name}</span>
                <span className="text-xs text-muted-foreground">
                  {c.hex_code}
                </span>
                <Button
                  className="ml-auto"
                  size="icon"
                  variant="ghost"
                  onClick={() => remove(c.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {list.length === 0 && (
              <p className="text-sm text-muted-foreground">No colors yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
