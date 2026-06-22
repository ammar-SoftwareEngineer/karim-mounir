"use client";
import { useEffect, useState } from "react";

export function usePageReady(delay = 0) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return ready;
}
