import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dirgham CNC Woodworks",
  description: "Professional CNC woodwork services",
  icons: {
    icon: [{ url: "/icons/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
