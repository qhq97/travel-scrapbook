import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Travel Scrapbook",
    short_name: "Scrapbook",
    description: "A shared travel scrapbook for small groups.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#020617",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon_192.jpg",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon_520.jpg",
        sizes: "520x520",
        type: "image/png",
      },
    ],
  };
}