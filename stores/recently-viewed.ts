import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface RecentlyViewedProduct {
  id: string;
  name: string;
  brand?: string;
  image_url: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  supplier?: {
    id: string;
    full_name: string;
  };
  base_price?: number;
  visited_at: Date;
}

interface RecentlyViewedStore {
  products: RecentlyViewedProduct[];
  addProduct: (product: Omit<RecentlyViewedProduct, "visited_at">) => void;
  removeProduct: (productId: string) => void;
  clearAll: () => void;
  getRecentProducts: (limit?: number) => RecentlyViewedProduct[];
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      products: [],

      addProduct: (product) => {
        set((state) => {
          const filteredProducts = state.products.filter(
            (p) => p.id !== product.id
          );
          const newProduct: RecentlyViewedProduct = {
            ...product,
            visited_at: new Date(),
          };
          const updatedProducts = [newProduct, ...filteredProducts].slice(
            0,
            20
          );
          return { products: updatedProducts };
        });
      },

      removeProduct: (productId) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        }));
      },

      clearAll: () => {
        set({ products: [] });
      },

      getRecentProducts: (limit = 10) => {
        const { products } = get();
        return products
          .sort(
            (a, b) =>
              new Date(b.visited_at).getTime() -
              new Date(a.visited_at).getTime()
          )
          .slice(0, limit);
      },
    }),
    {
      name: "recently-viewed-products",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
