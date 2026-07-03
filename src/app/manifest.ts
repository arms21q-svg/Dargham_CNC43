import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dirgham CNC Woodworks",
    short_name: "Dirgham CNC",
    description: "Professional CNC woodwork services",
    start_url: "/ar",
    display: "standalone",
    background_color: "#e8f0fc",
    theme_color: "#0a1628",
    icons: [
      {
        src: "/icon",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
