"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { toast } from "sonner";

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
    const res = await fetch(`/api/sizes/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Size removed");
      setList((prev) => prev.filter((x) => x.id !== id));
    } else {
      toast.error("Failed to remove size");
    }
  };

  return (
    <main className="space-y-4 md:space-y-6 pb-24 md:pb-12 mx-auto max-w-screen-2xl px-3 md:px-6">
      <div className="pt-2 md:pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-3xl font-bold tracking-tight">
              Sizes
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Create, update, and remove available sizes for your catalog.
            </p>
          </div>
        </div>
      </div>
      <div className="border-t" />

      <Card>
        <CardContent className="p-3 md:p-6">
          <div className="rounded-md border bg-muted/40 p-3 md:p-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-2">
            <Input
              placeholder="Size name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="md:max-w-[240px]"
            />
            <Button onClick={add} disabled={loading} className="md:ml-auto">
              Add New Size
            </Button>
          </div>

          {/* Mobile list */}
          <div className="mt-3 md:mt-6 md:hidden">
            <div className="rounded-md border overflow-hidden">
              <div className="px-3 py-2 text-xs text-muted-foreground flex items-center justify-between">
                <span>Name</span>
                <span>Action</span>
              </div>
              <div className="border-t" />
              {list.map((s) => (
                <div key={s.id} className="px-3 py-2 border-b last:border-b-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium truncate">{s.name}</p>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => remove(s.id)}
                      aria-label="Delete size"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {list.length === 0 && (
                <div className="px-3 py-10 text-center text-sm text-muted-foreground">
                  No sizes yet.
                </div>
              )}
            </div>
          </div>

          {/* Desktop table */}
          <div className="mt-3 md:mt-6 overflow-x-auto hidden md:block">
            <div className="min-w-[480px] w-full">
              <div className="grid grid-cols-12 px-3 py-2 text-xs md:text-sm text-muted-foreground">
                <div className="col-span-10">Name</div>
                <div className="col-span-2 text-right">Action</div>
              </div>
              <div className="border-t" />
              {list.map((s) => (
                <div
                  key={s.id}
                  className="grid grid-cols-12 items-center px-3 py-2 border-b last:border-b-0"
                >
                  <div className="col-span-10 font-medium truncate">
                    {s.name}
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => remove(s.id)}
                      aria-label="Delete size"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {list.length === 0 && (
                <div className="px-3 py-10 text-center text-sm text-muted-foreground">
                  No sizes yet.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
