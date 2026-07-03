import Image, { type ImageProps } from "next/image";

/** يدعم صور مرفوعة محلياً وروابط خارجية من لوحة الإدارة */
export function ProjectImage({ src, ...props }: ImageProps) {
  const srcStr = typeof src === "string" ? src : "";
  const unoptimized =
    srcStr.startsWith("/uploads/") ||
    (srcStr.startsWith("http") && !srcStr.includes("images.unsplash.com"));

  return <Image src={src} unoptimized={unoptimized} {...props} />;
}
