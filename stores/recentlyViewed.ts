import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type RecentlyViewedItem = {
  id: string;
  name: string;
  imageUrl: string;
  supplierName?: string;
  brand?: string;
  priceAndQuantity?: Array<{ quantity: number; price: number }>;
  is_verified?: boolean;
  hasSample?: boolean;
  viewedAt: number;
};

type RecentlyViewedStore = {
  items: RecentlyViewedItem[];
  add: (item: Omit<RecentlyViewedItem, "viewedAt">) => void;
  clear: () => void;
};

const MAX_ITEMS = 12;

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (incoming) => {
        const now = Date.now();
        const existing = get().items;
        const withoutDup = existing.filter((i) => i.id !== incoming.id);
        const next = [{ ...incoming, viewedAt: now }, ...withoutDup].slice(
          0,
          MAX_ITEMS
        );
        set({ items: next });
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: "recently-viewed",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);


