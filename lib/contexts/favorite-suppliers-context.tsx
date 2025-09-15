"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface Supplier {
  id: string;
  business_name: string;
  profile_avatar_url?: string | null;
  city?: string;
  is_verified?: boolean | null;
  profile_id: string | null;
}

interface FavoriteSuppliersContextType {
  favoriteSuppliers: Supplier[];
  addToFavoriteSuppliers: (supplier: Supplier) => void;
  removeFromFavoriteSuppliers: (supplierId: string) => void;
  isFavoriteSupplier: (supplierId: string) => boolean;
}

const FavoriteSuppliersContext = createContext<
  FavoriteSuppliersContextType | undefined
>(undefined);

export function FavoriteSuppliersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [favoriteSuppliers, setFavoriteSuppliers] = useState<Supplier[]>([]);

  // Load favorite suppliers from localStorage on mount
  useEffect(() => {
    const storedFavoriteSuppliers = localStorage.getItem("favoriteSuppliers");
    if (storedFavoriteSuppliers) {
      try {
        setFavoriteSuppliers(JSON.parse(storedFavoriteSuppliers));
      } catch (error) {
        console.error(
          "Error loading favorite suppliers from localStorage:",
          error
        );
      }
    }
  }, []);

  // Save favorite suppliers to localStorage whenever favoriteSuppliers change
  useEffect(() => {
    localStorage.setItem(
      "favoriteSuppliers",
      JSON.stringify(favoriteSuppliers)
    );
  }, [favoriteSuppliers]);

  const addToFavoriteSuppliers = (supplier: Supplier) => {
    setFavoriteSuppliers((prev) => {
      if (!prev.find((s) => s.id === supplier.id)) {
        return [...prev, supplier];
      }
      return prev;
    });
  };

  const removeFromFavoriteSuppliers = (supplierId: string) => {
    setFavoriteSuppliers((prev) => prev.filter((s) => s.id !== supplierId));
  };

  const isFavoriteSupplier = (supplierId: string) => {
    return favoriteSuppliers.some((s) => s.id === supplierId);
  };

  return (
    <FavoriteSuppliersContext.Provider
      value={{
        favoriteSuppliers,
        addToFavoriteSuppliers,
        removeFromFavoriteSuppliers,
        isFavoriteSupplier,
      }}
    >
      {children}
    </FavoriteSuppliersContext.Provider>
  );
}

export function useFavoriteSuppliers() {
  const context = useContext(FavoriteSuppliersContext);
  if (context === undefined) {
    throw new Error(
      "useFavoriteSuppliers must be used within a FavoriteSuppliersProvider"
    );
  }
  return context;
}
