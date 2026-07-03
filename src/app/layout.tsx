import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dirgham CNC Woodworks",
  description: "Professional CNC woodwork services",
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icons/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
