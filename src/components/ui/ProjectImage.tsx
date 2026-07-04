"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { PLACEHOLDER_IMAGE, shouldUseUnoptimizedImage } from "@/lib/image-utils";

/** صور الأعمال — بدون تحسين Next + صورة بديلة عند 404 */
export function ProjectImage({ src, unoptimized, onError, ...props }: ImageProps) {
  const srcStr = typeof src === "string" ? src : "";
  const [failed, setFailed] = useState(!srcStr);

  const resolved = failed ? PLACEHOLDER_IMAGE : srcStr;

  return (
    <Image
      {...props}
      src={resolved}
      unoptimized={unoptimized ?? shouldUseUnoptimizedImage(srcStr)}
      onError={(e) => {
        setFailed(true);
        onError?.(e);
      }}
    />
  );
}
