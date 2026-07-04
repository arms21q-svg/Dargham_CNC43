"use client";

import dynamic from "next/dynamic";

const AiHub = dynamic(() => import("./AiHub").then((m) => m.AiHub), {
  ssr: false,
  loading: () => null,
});

export function AiHubLazy() {
  return <AiHub />;
}
