import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'mellow-dogfish-782.convex.cloud',
      },
    ]
  },
  experimental: { 
    serverActions: { 
      bodySizeLimit: '10mb'
    },
  },
};

export default nextConfig;
