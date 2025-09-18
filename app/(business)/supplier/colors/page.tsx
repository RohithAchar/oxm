"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";

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
    <main className="space-y-4 md:space-y-6 pb-24 md:pb-12 mx-auto max-w-screen-2xl px-3 md:px-6">
      <div className="pt-2 md:pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-3xl font-bold tracking-tight">
              Colors
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Create, update, and remove available colors for your catalog.
            </p>
          </div>
        </div>
      </div>
      <div className="border-t" />

      <Card>
        <CardContent className="p-3 md:p-6">
          <div className="rounded-md border bg-muted/40 p-3 md:p-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-2">
            <Input
              placeholder="Color name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="md:max-w-[240px]"
            />
            <Input
              placeholder="#RRGGBB"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="md:max-w-[160px]"
            />
            <Button onClick={add} disabled={loading} className="md:ml-auto">
              Add New Color
            </Button>
          </div>

          {/* Mobile list */}
          <div className="mt-3 md:mt-6 md:hidden">
            <div className="rounded-md border overflow-hidden">
              <div className="px-3 py-2 text-xs text-muted-foreground flex items-center justify-between">
                <span>Name</span>
                <span>Preview</span>
              </div>
              <div className="border-t" />
              {list.map((c) => (
                <div key={c.id} className="px-3 py-2 border-b last:border-b-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.hex_code}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-block w-5 h-5 rounded border"
                        style={{ backgroundColor: c.hex_code }}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => remove(c.id)}
                        aria-label="Delete color"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {list.length === 0 && (
                <div className="px-3 py-10 text-center text-sm text-muted-foreground">
                  No colors yet.
                </div>
              )}
            </div>
          </div>

          {/* Desktop table */}
          <div className="mt-3 md:mt-6 overflow-x-auto hidden md:block">
            <div className="min-w-[640px] w-full">
              <div className="grid grid-cols-12 px-3 py-2 text-xs md:text-sm text-muted-foreground">
                <div className="col-span-4">Name</div>
                <div className="col-span-4">Hex</div>
                <div className="col-span-3">Preview</div>
                <div className="col-span-1 text-right">Action</div>
              </div>
              <div className="border-t" />
              {list.map((c) => (
                <div
                  key={c.id}
                  className="grid grid-cols-12 items-center px-3 py-2 border-b last:border-b-0"
                >
                  <div className="col-span-4 font-medium truncate">
                    {c.name}
                  </div>
                  <div className="col-span-4 text-muted-foreground">
                    {c.hex_code}
                  </div>
                  <div className="col-span-3">
                    <span
                      className="inline-block w-6 h-6 rounded border"
                      style={{ backgroundColor: c.hex_code }}
                    />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => remove(c.id)}
                      aria-label="Delete color"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {list.length === 0 && (
                <div className="px-3 py-10 text-center text-sm text-muted-foreground">
                  No colors yet.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
