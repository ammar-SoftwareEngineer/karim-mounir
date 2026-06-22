"use client";
import React, { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * AnimatedImage Component
 *
 * A powerful image animation component with multiple animation styles and modern border shapes.
 * Perfect for creating eye-catching, professional image presentations with scroll-triggered animations.
 *
 * Available Animation Types:
 *
 * 1. fade - Smooth fade-in with subtle scale effect
 * 2. slideUp - Slide up from bottom with fade
 * 3. slideDown - Slide down from top with fade
 * 4. slideLeft - Slide in from left with fade
 * 5. slideRight - Slide in from right with fade
 * 6. scaleUp - Scale up from small with bounce
 * 7. scaleDown - Scale down from large
 * 8. rotateIn - Rotate and scale into view
 * 9. flip3D - 3D flip transformation
 * 10. zoomBlur - Zoom effect with blur transition
 * 11. reveal - Wipe reveal from left to right
 * 12. elastic - Bouncy elastic entrance with rotation
 * 13. magneticPull - Magnetic pull effect from side
 * 14. parallaxDepth - Deep 3D perspective entrance
 * 15. spiralIn - 720° spiral rotation entrance
 * 16. liquidMorph - Liquid-like stretchy morphing
 * 17. pixelate - Digital pixelation effect
 * 18. waveDistort - Wave distortion entrance
 * 19. origamiFold - Paper folding 3D effect
 * 20. glassShatter - Glass breaking effect
 * 21. cinematicSlide - Cinematic slide with motion blur
 * 22. paperFold - Newspaper folding animation
 * 23. accordionFold - Accordion-style vertical fold
 * 24. fanFold - Fan opening fold effect
 * 25. curtainFold - Theater curtain opening
 * 26. bookFlip - Book page flipping effect
 * 27. mapUnfold - Map unfolding animation
 *
 * Available Border Styles (Modern Shapes):
 *
 * 1. none - No border clipping
 * 2. rounded - Smooth bezier curved corners
 * 3. circle - Perfect ellipse shape
 * 4. hexagon - Modern 6-sided geometric
 * 5. diamond - 8-point star diamond
 * 6. blob - Organic liquid blob shape
 * 7. morph - Chamfered octagon
 * 8. sharp - Asymmetric angular cut
 * 9. squircle - iOS-style superellipse
 * 10. pentagon - 5-sided geometric
 * 11. octagon - Symmetrical 8-sided
 * 12. capsule - Pill-shaped rounded ends
 * 13. bevel - Subtle corner bevels
 * 14. asymmetric - Dynamic diagonal shape
 * 15. wave - Flowing wave edge
 * 16. tear - Water droplet shape
 * 17. crystal - Multi-faceted gem cut
 * 18. arch - Architectural rounded top
 * 19. clover - Four-leaf organic shape
 * 20. shield - Protective emblem shape
 * 21. puzzle - Jigsaw puzzle piece
 * 22. star - Modern 5-point star
 * 23. triangle - Equilateral triangle
 * 24. trapezoid - Angled trapezoid
 * 25. parallelogram - Slanted parallelogram
 * 26. chevron - Arrow-like chevron
 * 27. scallop - Decorative scalloped edge
 * 28. ticket - Ticket stub shape
 * 29. bookmark - Bookmark notch shape
 * 30. gem - Brilliant cut gemstone
 * 31. kite - Kite/rhombus shape
 * 32. house - House/pentagon shape
 * 33. arrow - Directional arrow shape
 *
 * Props:
 * @param {ReactNode} children - The image or content to animate
 * @param {AnimationStyle} animationStyle - Type of animation (default: 'fade')
 * @param {BorderStyle} borderStyle - Shape of the border clipping (default: 'none')
 * @param {number} delay - Animation start delay in seconds (default: 0)
 * @param {number} duration - Animation duration in seconds (default: 1)
 * @param {number | string} mt - Top margin (default: 0)
 * @param {number | string} mb - Bottom margin (default: 0)
 * @param {boolean} flip - Horizontally flip the content (default: false)
 * @param {string} border - CSS border styling (default: 'none')
 * @param {boolean} reverse - Reverse animation direction (default: true)
 * @param {string} className - Additional CSS classes
 *
 * Example Usage:
 * ```tsx
 * <AnimatedImage
 *   animationStyle="paperFold"
 *   borderStyle="puzzle"
 *   duration={1.2}
 *   delay={0.2}
 * >
 *   <img src="/image.jpg" alt="Description" />
 * </AnimatedImage>
 * ```
 */

// Types
type AnimationStyle =
  | "fade"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "scaleUp"
  | "scaleDown"
  | "rotateIn"
  | "flip3D"
  | "zoomBlur"
  | "reveal"
  | "elastic"
  | "magneticPull"
  | "parallaxDepth"
  | "spiralIn"
  | "liquidMorph"
  | "pixelate"
  | "waveDistort"
  | "origamiFold"
  | "glassShatter"
  | "cinematicSlide"
  | "paperFold"
  | "accordionFold"
  | "fanFold"
  | "curtainFold"
  | "bookFlip"

type BorderStyle =
  | "none"
  | "rounded"
  | "circle"
  | "hexagon"
  | "diamond"
  | "blob"
  | "morph"
  | "sharp"
  | "squircle"
  | "pentagon"
  | "octagon"
  | "capsule"
  | "bevel"
  | "asymmetric"
  | "wave"
  | "tear"
  | "crystal"
  | "arch"
  | "clover"
  | "shield"
  | "puzzle"
  | "star"
  | "triangle"
  | "trapezoid"
  | "parallelogram"
  | "chevron"
  | "scallop"
  | "ticket"
  | "bookmark"
  | "gem"
  | "kite"
  | "house"
  | "arrow";

interface AnimatedImageProps {
  children: ReactNode;
  animationStyle?: AnimationStyle;
  borderStyle?: BorderStyle;
  delay?: number;
  duration?: number;
  mt?: number | string;
  mb?: number | string;
  flip?: boolean;
  border?: string;
  reverse?: boolean;
  className?: string;
}

// Clip path definitions for border styles
const clipPaths: Record<BorderStyle, string> = {
  none: "none",
  rounded:
    "path('M 0 48 Q 0 0 48 0 L 352 0 Q 400 0 400 48 L 400 352 Q 400 400 352 400 L 48 400 Q 0 400 0 352 Z')",
  circle: "ellipse(45% 48% at 50% 50%)",
  hexagon: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
  diamond:
    "polygon(50% 0%, 90% 20%, 100% 50%, 90% 80%, 50% 100%, 10% 80%, 0% 50%, 10% 20%)",
  blob: "path('M 200 0 Q 280 20 340 80 Q 400 140 400 220 Q 380 300 320 350 Q 260 400 180 390 Q 100 380 50 320 Q 0 260 10 180 Q 20 100 80 50 Q 140 0 200 0 Z')",
  morph:
    "polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)",
  sharp: "polygon(0% 0%, 85% 0%, 100% 15%, 100% 100%, 15% 100%, 0% 85%)",
  squircle:
    "path('M 0,200 C 0,60 60,0 200,0 S 400,60 400,200 340,400 200,400 0,340 0,200 Z')",
  pentagon: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
  octagon:
    "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
  capsule:
    "path('M 100 0 L 300 0 Q 400 0 400 100 L 400 300 Q 400 400 300 400 L 100 400 Q 0 400 0 300 L 0 100 Q 0 0 100 0 Z')",
  bevel:
    "polygon(5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%)",
  asymmetric: "polygon(0% 0%, 100% 5%, 95% 100%, 0% 90%)",
  wave: "path('M 0 40 Q 50 0 100 40 T 200 40 T 300 40 T 400 40 L 400 400 L 0 400 Z')",
  tear: "path('M 200 0 Q 320 80 350 200 Q 380 320 280 380 Q 200 420 120 380 Q 20 320 50 200 Q 80 80 200 0 Z')",
  crystal:
    "polygon(50% 0%, 75% 15%, 100% 40%, 90% 70%, 60% 100%, 40% 100%, 10% 70%, 0% 40%, 25% 15%)",
  arch: "path('M 0 100 Q 0 0 100 0 L 300 0 Q 400 0 400 100 L 400 400 L 0 400 Z')",
  clover:
    "path('M 200 200 Q 200 100 150 50 Q 100 0 50 50 Q 0 100 50 150 Q 100 200 100 200 Q 100 200 50 250 Q 0 300 50 350 Q 100 400 150 350 Q 200 300 200 300 Q 200 300 250 350 Q 300 400 350 350 Q 400 300 350 250 Q 300 200 300 200 Q 300 200 350 150 Q 400 100 350 50 Q 300 0 250 50 Q 200 100 200 200 Z')",
  shield:
    "polygon(50% 0%, 90% 10%, 100% 35%, 100% 65%, 50% 100%, 0% 65%, 0% 35%, 10% 10%)",
  puzzle:
    "path('M 0 0 L 150 0 Q 150 -20 170 -20 Q 190 -20 190 0 L 400 0 L 400 150 Q 420 150 420 170 Q 420 190 400 190 L 400 400 L 250 400 Q 250 420 230 420 Q 210 420 210 400 L 0 400 Z')",
  star: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
  triangle: "polygon(50% 0%, 100% 100%, 0% 100%)",
  trapezoid: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
  parallelogram: "polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)",
  chevron: "polygon(0% 0%, 75% 50%, 0% 100%, 15% 100%, 90% 50%, 15% 0%)",
  scallop:
    "path('M 0 0 L 400 0 L 400 350 Q 350 400 300 350 Q 250 300 200 350 Q 150 400 100 350 Q 50 300 0 350 Z')",
  ticket:
    "path('M 0 0 L 350 0 Q 400 0 400 50 Q 380 50 380 70 Q 380 90 400 90 L 400 310 Q 380 310 380 330 Q 380 350 400 350 L 400 400 L 0 400 Z')",
  bookmark: "polygon(0% 0%, 100% 0%, 100% 100%, 50% 85%, 0% 100%)",
  gem: "polygon(50% 0%, 80% 20%, 100% 50%, 80% 80%, 50% 100%, 20% 80%, 0% 50%, 20% 20%)",
  kite: "polygon(50% 0%, 100% 40%, 50% 100%, 0% 40%)",
  house: "polygon(50% 0%, 100% 35%, 100% 100%, 0% 100%, 0% 35%)",
  arrow:
    "polygon(0% 40%, 60% 40%, 60% 0%, 100% 50%, 60% 100%, 60% 60%, 0% 60%)",
};

// Animation configurations
const getAnimationConfig = (style: AnimationStyle, reverse: boolean) => {
  const direction = reverse ? -1 : 1;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const configs: Record<AnimationStyle, any> = {
    fade: {
      from: { opacity: 0, scale: 0.98 },
      to: { opacity: 1, scale: 1, ease: "power2.inOut" },
    },
    slideUp: {
      from: { opacity: 0, y: 100 * direction },
      to: { opacity: 1, y: 0, ease: "power4.out" },
    },
    slideDown: {
      from: { opacity: 0, y: -100 * direction },
      to: { opacity: 1, y: 0, ease: "power4.out" },
    },
    slideLeft: {
      from: { opacity: 0, x: 100 * direction },
      to: { opacity: 1, x: 0, ease: "power4.out" },
    },
    slideRight: {
      from: { opacity: 0, x: -100 * direction },
      to: { opacity: 1, x: 0, ease: "power4.out" },
    },
    scaleUp: {
      from: { opacity: 0, scale: 0.5 },
      to: { opacity: 1, scale: 1, ease: "back.out(1.7)" },
    },
    scaleDown: {
      from: { opacity: 0, scale: 1.5 },
      to: { opacity: 1, scale: 1, ease: "power3.out" },
    },
    rotateIn: {
      from: { opacity: 0, rotation: direction * 180, scale: 0.5 },
      to: { opacity: 1, rotation: 0, scale: 1, ease: "back.out(1.4)" },
    },
    flip3D: {
      from: { opacity: 0, rotationY: direction * 90, z: -200 },
      to: { opacity: 1, rotationY: 0, z: 0, ease: "power3.out" },
    },
    zoomBlur: {
      from: { opacity: 0, scale: 1.2, filter: "blur(20px)" },
      to: { opacity: 1, scale: 1, filter: "blur(0px)", ease: "power2.out" },
    },
    reveal: {
      from: { clipPath: "inset(0 100% 0 0)" },
      to: { clipPath: "inset(0 0% 0 0)", ease: "power4.inOut" },
    },
    elastic: {
      from: { opacity: 0, scale: 0.3, rotation: -45 },
      to: { opacity: 1, scale: 1, rotation: 0, ease: "elastic.out(1, 0.5)" },
    },
    magneticPull: {
      from: {
        opacity: 0,
        scale: 1.5,
        x: -150 * direction,
        rotation: 90 * direction,
      },
      to: { opacity: 1, scale: 1, x: 0, rotation: 0, ease: "power4.out" },
    },
    parallaxDepth: {
      from: { opacity: 0, z: -500, scale: 0.7, rotationX: 45 },
      to: { opacity: 1, z: 0, scale: 1, rotationX: 0, ease: "power3.out" },
    },
    spiralIn: {
      from: { opacity: 0, scale: 0.2, rotation: 720 * direction },
      to: { opacity: 1, scale: 1, rotation: 0, ease: "power2.out" },
    },
    liquidMorph: {
      from: { opacity: 0, scaleX: 0.3, scaleY: 1.4, skewX: 20 },
      to: {
        opacity: 1,
        scaleX: 1,
        scaleY: 1,
        skewX: 0,
        ease: "elastic.out(1, 0.4)",
      },
    },
    pixelate: {
      from: { opacity: 0, filter: "blur(30px) contrast(0.5)", scale: 1.1 },
      to: {
        opacity: 1,
        filter: "blur(0px) contrast(1)",
        scale: 1,
        ease: "power3.out",
      },
    },
    waveDistort: {
      from: { opacity: 0, scaleY: 0.5, skewY: 15, y: 80 },
      to: { opacity: 1, scaleY: 1, skewY: 0, y: 0, ease: "power4.out" },
    },
    origamiFold: {
      from: {
        opacity: 0,
        rotationX: -90,
        rotationY: 45,
        z: -300,
        transformOrigin: "50% 0%",
      },
      to: { opacity: 1, rotationX: 0, rotationY: 0, z: 0, ease: "power4.out" },
    },
    glassShatter: {
      from: { opacity: 0, scale: 1.3, filter: "brightness(2) blur(15px)" },
      to: {
        opacity: 1,
        scale: 1,
        filter: "brightness(1) blur(0px)",
        ease: "expo.out",
      },
      extraAnimation: (el: HTMLElement) => {
        const tl = gsap.timeline();
        tl.to(el, {
          rotation: 2,
          duration: 0.1,
          yoyo: true,
          repeat: 3,
        });
        tl.to(el, {
          rotation: 0,
          duration: 0.3,
          ease: "elastic.out(1, 0.5)",
        });
      },
    },
    cinematicSlide: {
      from: {
        opacity: 0,
        x: -200 * direction,
        scale: 1.2,
        filter: "blur(10px)",
      },
      to: { opacity: 1, x: 0, scale: 1, filter: "blur(0px)", ease: "expo.out" },
    },
    paperFold: {
      from: {
        opacity: 0,
        rotationX: -180,
        scaleY: 0.1,
        transformOrigin: "50% 0%",
        z: -200,
      },
      to: {
        opacity: 1,
        rotationX: 0,
        scaleY: 1,
        z: 0,
        ease: "power3.out",
      },
    },
    accordionFold: {
      from: {
        opacity: 0,
        scaleY: 0.05,
        transformOrigin: "50% 50%",
        rotationX: 90,
      },
      to: {
        opacity: 1,
        scaleY: 1,
        rotationX: 0,
        ease: "power4.out",
      },
    },
    fanFold: {
      from: {
        opacity: 0,
        rotation: -90 * direction,
        transformOrigin: "0% 100%",
        scale: 0.3,
      },
      to: {
        opacity: 1,
        rotation: 0,
        scale: 1,
        ease: "back.out(1.5)",
      },
    },
    curtainFold: {
      from: {
        opacity: 0,
        scaleX: 0,
        transformOrigin: "50% 50%",
      },
      to: {
        opacity: 1,
        scaleX: 1,
        ease: "power3.inOut",
      },
      extraAnimation: (el: HTMLElement) => {
        gsap.fromTo(
          el,
          { skewY: 5 },
          {
            skewY: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.3)",
          }
        );
      },
    },
    bookFlip: {
      from: {
        opacity: 0,
        rotationY: -180 * direction,
        transformOrigin: direction > 0 ? "0% 50%" : "100% 50%",
        z: -300,
      },
      to: {
        opacity: 1,
        rotationY: 0,
        z: 0,
        ease: "power3.out",
      },
    },
  };

  return configs[style];
};

export const AnimatedImage: React.FC<AnimatedImageProps> = ({
  children,
  animationStyle = "fade",
  borderStyle = "none",
  delay = 0,
  duration = 1,
  mt = 0,
  mb = 0,
  flip = false,
  border = "none",
  reverse = true,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !imageRef.current) return;

    const config = getAnimationConfig(animationStyle, reverse);
    const element = imageRef.current;

    // Set initial state
    gsap.set(element, config.from);

    // Create scroll-triggered animation
    const animation = gsap.to(element, {
      ...config.to,
      duration,
      delay,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      onComplete: () => {
        // Handle extra animations
        if (config.extraAnimation) {
          config.extraAnimation(element);
        }
      },
    });

    return () => {
      if (animation.scrollTrigger) {
        animation.scrollTrigger.kill();
      }
      animation.kill();
    };
  }, [animationStyle, delay, duration, reverse]);

  const marginTop = typeof mt === "number" ? `${mt}px` : mt;
  const marginBottom = typeof mb === "number" ? `${mb}px` : mb;

  return (
    <div
      ref={containerRef}
      style={{
        marginTop,
        marginBottom,
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      <div
        ref={imageRef}
        style={{
          clipPath: clipPaths[borderStyle],
          border,
          transform: flip ? "scaleX(-1)" : "none",
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          width: "fit-content",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
};
