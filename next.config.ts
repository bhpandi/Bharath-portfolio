import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Vercel Blob public stores — profile photos uploaded via admin
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      // Vercel Blob private stores — served via /api/photo proxy
      {
        protocol: "https",
        hostname: "*.blob.vercel-storage.com",
      },
    ],
  },
  headers: async () => [
    {
      source: "/sw.js",
      headers: [
        { key: "Content-Type", value: "application/javascript; charset=utf-8" },
        { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        { key: "Service-Worker-Allowed", value: "/" },
      ],
    },
    {
      source: "/manifest.json",
      headers: [
        { key: "Content-Type", value: "application/manifest+json" },
        { key: "Cache-Control", value: "public, max-age=86400" },
      ],
    },
    {
      // Cache static PWA icons for 1 week
      source: "/(icon-192|icon-512|apple-touch-icon|favicon-32).png",
      headers: [
        { key: "Cache-Control", value: "public, max-age=604800, immutable" },
      ],
    },
  ],
};

export default nextConfig;
