import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "recharts"],
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
