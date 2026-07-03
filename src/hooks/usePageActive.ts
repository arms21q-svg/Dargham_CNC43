"use client";

import { useEffect, useState } from "react";

/** يتوقف عند إخفاء التبويب أو عدم ظهور العنصر */
export function usePageActive(ref?: React.RefObject<Element | null>) {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const onVis = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    onVis();

    if (!ref?.current) {
      return () => document.removeEventListener("visibilitychange", onVis);
    }

    const el = ref.current;
    const obs = new IntersectionObserver(
      ([entry]) => setActive(!document.hidden && entry.isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(el);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      obs.disconnect();
    };
  }, [ref]);

  return active;
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = () => setReduced(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  return reduced;
}

export function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setDesktop(mq.matches);
    const fn = () => setDesktop(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  return desktop;
}
