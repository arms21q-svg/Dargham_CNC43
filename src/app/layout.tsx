import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dirgham CNC Woodworks",
  description: "Professional CNC woodwork services",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
