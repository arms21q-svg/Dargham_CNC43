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
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
