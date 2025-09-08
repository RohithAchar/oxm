import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type BagItem = {
  productId: string;
  name: string;
  imageUrl?: string;
  pricePerUnit?: number;
  quantity: number;
  colorId?: string;
  colorName?: string;
  colorHex?: string;
  sizeId?: string;
  sizeName?: string;
};

type BagStore = {
  items: BagItem[];
  addItem: (item: BagItem) => void;
  removeItem: (productId: string, key?: string) => void;
  clear: () => void;
};

export const useBagStore = create<BagStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items;
        // Merge by product + color + size
        const key = `${item.productId}|${item.colorId || ""}|${
          item.sizeId || ""
        }`;
        const idx = items.findIndex(
          (i) => `${i.productId}|${i.colorId || ""}|${i.sizeId || ""}` === key
        );
        if (idx >= 0) {
          const updated = [...items];
          updated[idx] = {
            ...updated[idx],
            quantity: updated[idx].quantity + item.quantity,
          };
          set({ items: updated });
        } else {
          set({ items: [...items, item] });
        }
      },
      removeItem: (productId, key) => {
        set((state) => ({
          items: state.items.filter((i) => {
            if (!key) return i.productId !== productId;
            return (
              `${i.productId}|${i.colorId || ""}|${i.sizeId || ""}` !== key
            );
          }),
        }));
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: "bag-items",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
