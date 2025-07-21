"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

interface Banner {
  id: string;
  title: string;
  image_url: string;
  alt_text: string | null;
  is_active: boolean | null;
  display_order: number | null;
}

export const BannerCarousel = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    const fetchActiveBanners = async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (!error && data) {
        setBanners(data);
      }
    };

    fetchActiveBanners();
  }, [supabase]);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-2xl">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={banner.image_url}
            alt={banner.alt_text || banner.title}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
