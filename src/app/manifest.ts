import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dirgham CNC Woodworks",
    short_name: "Dirgham CNC",
    description: "Professional CNC woodwork services",
    start_url: "/ar",
    display: "standalone",
    background_color: "#faf6f0",
    theme_color: "#3d2314",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}
