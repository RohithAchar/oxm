import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dnxueodlegthdfjxzvfl.supabase.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.co",
        port: "",
        pathname: "/**",
      },
      // Add more domains as needed
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      //   port: '',
      //   pathname: '/images/**',
      // },
    ],
  },
  // Optional: if you're using middleware
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  generateMetadata: false,
};

export default nextConfig;
