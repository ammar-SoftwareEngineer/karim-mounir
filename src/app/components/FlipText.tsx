"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

interface FlipTextProps {
  children: React.ReactNode;
  className?: string;
  startTrigger?: string;
  endTrigger?: string;
  stagger?: number;
  duration?: number;
  ease?: string;
  rotateFrom?: number;
}

export default function FlipText({
  children,
  className = "",
  startTrigger = "top 85%",
  endTrigger = "bottom 40%",
  stagger = 0.012,
  duration = 0.6,
  ease = "back.out(1.7)",
  rotateFrom = 90,
}: FlipTextProps) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    gsap.registerPlugin(ScrollTrigger, SplitText);

    const containsArabic = /[\u0600-\u06FF]/.test(
      textRef.current.textContent || "",
    );

    const split = new SplitText(textRef.current, {
      type: containsArabic ? "words" : "chars, words", // ← also split words
      charsClass: "flip-char",
      wordsClass: "flip-word",
    });

    // ✅ Keep word wrappers as inline-block and prevent wrapping inside them
    gsap.set(split.words, {
      display: "inline-block",
      whiteSpace: "nowrap", // ← chars inside a word never break across lines
    });

    const animTargets = containsArabic ? split.words : split.chars;

    gsap.set(animTargets, {
      display: "inline-block",
      opacity: 0,
      rotateX: rotateFrom,
      transformOrigin: "50% 50%",
      transformPerspective: 600,
      willChange: "transform, opacity",
    });

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease, duration },
    });

    tl.to(animTargets, {
      opacity: 1,
      rotateX: 0,
      stagger: {
        each: containsArabic ? stagger * 3 : stagger,
        ease: "power1.in",
      },
    });

    const trigger = ScrollTrigger.create({
      trigger: textRef.current,
      start: startTrigger,
      end: endTrigger,
      onEnter: () => tl.play(),
      onEnterBack: () => tl.play(),
      onLeaveBack: () => tl.pause(0), // pause & reset without reverse
    });

    return () => {
      trigger.kill();
      split.revert();
    };
  }, [children, startTrigger, endTrigger, stagger, duration, ease, rotateFrom]);

  return (
    <div ref={textRef} className={className}>
      {children}
    </div>
  );
}

// USAGE EXAMPLES:

/*

// Basic usage:
<FlipText className="text-4xl font-bold">
  Your amazing animated text here
</FlipText>

// With custom settings:
<FlipText
  className="text-5xl"
  stagger={0.02}
  duration={0.8}
  ease="power3.out"
  rotateFrom={45}
  startTrigger="top 90%"
>
  Custom animated text
</FlipText>

// Multiple elements:
<div className="space-y-8">
  <FlipText className="text-6xl font-bold">
    First Line
  </FlipText>
  <FlipText className="text-4xl text-gray-400" stagger={0.015}>
    Second Line
  </FlipText>
</div>

// In your outro section:
<section className="...">
  <div className="max-w-6xl mx-auto w-full space-y-8 text-center">
    <FlipText className="text-4xl md:text-5xl font-semibold leading-[1.25] tracking-[-0.05em]">
      We <span className="text-mid-gray">Design</span> With Purpose
      Merging <span className="text-mid-gray">Innovation</span>, Technical{" "}
      <span className="text-mid-gray">Precision</span>, And Expressive{" "}
      <span className="text-mid-gray">Beauty</span> To Create Spaces That{" "}
      <span className="text-mid-gray">Elevate</span> Everyday Life
    </FlipText>
  </div>
</section>

*/
