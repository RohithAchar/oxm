import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OpenXmart",
    short_name: "OpenXmart",
    description:
      "Buy samples and bulk products from verified suppliers | OpenXmart B2B India",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    lang: "en-IN",
    orientation: "portrait",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/maskable-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/image.jpeg",
        type: "image/jpeg",
        sizes: "1200x630",
        form_factor: "wide",
      },
    ],
    categories: ["shopping", "business", "marketplace"],
    display_override: ["standalone", "minimal-ui", "browser"],
    prefer_related_applications: false,
  };
}
