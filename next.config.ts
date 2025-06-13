import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // optional: only run middleware on specific paths
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export default nextConfig;
