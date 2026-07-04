/** صورة بديلة عند فشل التحميل */
export const PLACEHOLDER_IMAGE = "/images/placeholder-project.svg";

/** تحديد متى نتجاوز تحسين Next.js للصور (client-safe) */
export function shouldUseUnoptimizedImage(src: string): boolean {
  if (!src) return true;
  return true;
}