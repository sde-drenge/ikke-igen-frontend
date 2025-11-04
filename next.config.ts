import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.ikkeigen.dk",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
