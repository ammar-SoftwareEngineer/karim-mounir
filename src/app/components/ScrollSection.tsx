"use client";

import { ReactNode, useRef } from "react";
import clsx from "clsx";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// This scroll component is ONLY for sections, it does not touch the navigation scroll logic.
gsap.registerPlugin(ScrollTrigger, useGSAP);

type Direction = "center" | "left" | "right" | "bottom";

type ScrollSectionProps = {
  children: ReactNode;
  className?: string;
  /**
   * Direction from which the section should appear while scrolling.
   * - "bottom" specifically has NO fade, only vertical motion.
   */
  direction?: Direction;
};

export default function ScrollSection({
  children,
  className,
  direction = "center",
}: ScrollSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const el = sectionRef.current;
      const inner = innerRef.current;
      if (!el || !inner) return;

      const fromVars: gsap.TweenVars = {};

      // Set starting offset based on direction
      switch (direction) {
        case "left":
          fromVars.x = -150;
          fromVars.autoAlpha = 0; // slide from left + fade
          break;
        case "right":
          fromVars.x = 150;
          fromVars.autoAlpha = 0; // slide from right + fade
          break;
        case "bottom":
          // For bottom sections we keep Y = 0 so there is NO visual gap
          // between this section and the previous one.
          // (No opacity change either, just parallax / scroll movement.)
          break;
        case "center":
        default:
          fromVars.y = 60;
          fromVars.autoAlpha = 0; // subtle center + fade
          break;
      }

      const toVars: gsap.TweenVars = {
        x: 0,
        y: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          end: "top 20%",
          scrub: true, // reveal gradually with scroll
        },
      };

      // Only animate opacity when it was set in fromVars
      if (fromVars.autoAlpha !== undefined) {
        toVars.autoAlpha = 1;
      }

      gsap.fromTo(inner, fromVars, toVars);
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className={clsx(
        "relative w-screen h-screen overflow-hidden",
        className
      )}
    >
      <div
        ref={innerRef}
        className="w-full h-full will-change-transform will-change-opacity"
      >
        {children}
      </div>
    </section>
  );
}


