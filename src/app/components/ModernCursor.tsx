"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const ModernCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null); // outer circle
  const dotRef = useRef<HTMLDivElement>(null); // inner dot
  const [hovering, setHovering] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // mark component as mounted and check if screen is desktop
  useEffect(() => {
    setMounted(true);

    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mediaQuery.matches);

    const handleResize = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };

    mediaQuery.addEventListener("change", handleResize);
    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  // pointer tracking - updates transforms
  useEffect(() => {
    if (!mounted || !isDesktop) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    // Initialize positions and set centering transforms
    gsap.set(cursor, { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    gsap.set(dot, { xPercent: -50, yPercent: -50, x: -100, y: -100 });

    const mouse = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    const speed = 0.15; // outer circle lerp speed

    const move = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Update the dot position immediately for 0-latency tracking
      gsap.set(dot, { x: e.clientX, y: e.clientY });
    };

    const updatePosition = () => {
      pos.x += (mouse.x - pos.x) * speed;
      pos.y += (mouse.y - pos.y) * speed;
      gsap.set(cursor, { x: pos.x, y: pos.y });
    };

    const over = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("a, button, [data-cursor='hover'], .hoverable")) setHovering(true);
    };

    const out = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("a, button, [data-cursor='hover'], .hoverable")) setHovering(false);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", out);
    gsap.ticker.add(updatePosition);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseout", out);
      gsap.ticker.remove(updatePosition);
    };
  }, [mounted, isDesktop]);

  if (!mounted || !isDesktop) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className={`modern-cursor ${hovering ? "hover" : ""}`}
      />
      <div
        ref={dotRef}
        className={`cursor-dot ${hovering ? "hover" : ""}`}
      />
    </>
  );
};

export default ModernCursor;
