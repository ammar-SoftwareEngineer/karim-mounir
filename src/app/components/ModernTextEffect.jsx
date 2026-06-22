/**
 * ModernTextEffect Component
 *
 * A powerful text animation component with multiple animation styles.
 * Supports both LTR (English) and RTL (Arabic) languages with automatic direction handling.
 *
 * Available Animation Types:
 *
 * 1. matrix - Characters drop from top with rotation and scale effects (Matrix-style)
 * 2. neon - Glowing neon-style appearance with flickering effect
 * 3. particle - Characters explode in from random positions and converge
 * 4. liquid - Elastic, fluid-like motion with wave distortions
 * 5. fadeSlide - Smooth word-by-word fade and slide animation
 * 6. wordWave - Words appear with elastic wave effect
 * 7. glitch - Digital glitch effect with color separation and distortion
 * 8. typewriter - Classic typewriter effect with cursor
 * 9. morphIn - 3D morph transformation from compressed state
 * 10. splitFlip - Characters flip in 3D from different angles
 * 11. magneticPull - Magnetic attraction effect from edges
 * 12. quantumShift - Quantum-inspired phase shifting effect
 * 13. prismBreak - Light prism breaking effect with color dispersion
 * 14. orbitalSpin - Characters orbit and spiral into position
 * 15. hologram - Futuristic hologram materialization effect
 * 16. electricArc - Electric arc tracing effect
 * 17. vortexSwirl - Vortex swirling motion into place
 * 18. cascadeRipple - Cascading ripple effect through text
 *
 * Props:
 * @param {string} text - The text content to animate
 * @param {string} lang - Language direction ('en' or 'ar')
 * @param {string} animationType - Type of animation (see list above)
 * @param {string} className - Additional CSS classes
 * @param {number} delay - Animation start delay in seconds
 * @param {number} duration - Animation duration in seconds
 * @param {string} fontStyle - Additional font styling classes
 * @param {number} mt - Top margin in pixels
 * @param {number} mb - Bottom margin in pixels
 */

import React, { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ModernTextEffect = ({
  text,
  lang = "en",
  animationType = "matrix",
  className = "",
  delay = 0,
  duration = 1.2,
  fontStyle = "",
  mt = 0,
  mb = 0,
}) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const hoverListenersRef = useRef([]);

  // Cleanup function to remove event listeners
  useEffect(() => {
    return () => {
      hoverListenersRef.current.forEach(({ char, onEnter, onLeave }) => {
        char.removeEventListener("mouseenter", onEnter);
        char.removeEventListener("mouseleave", onLeave);
      });
      hoverListenersRef.current = [];
    };
  }, []);

  useGSAP(
    () => {
      if (!textRef.current) return;

      if (!textRef.current) return;

      // Ensure ScrollTrigger refreshes after layout changes/font loading
      const refreshTrigger = () => {
        ScrollTrigger.refresh();
      };
      
      // Handle font loading which can affect layout
      document.fonts.ready.then(refreshTrigger);

      // Small delay fallback for layout stabilization
      const timeoutCtx = gsap.delayedCall(0.1, refreshTrigger);



      // Clear existing hover listeners
      hoverListenersRef.current.forEach(({ char, onEnter, onLeave }) => {
        char.removeEventListener("mouseenter", onEnter);
        char.removeEventListener("mouseleave", onLeave);
      });
      hoverListenersRef.current = [];

      const chars = textRef.current.querySelectorAll(".char");
      const words = textRef.current.querySelectorAll(".word");

      // Reset all chars and words to default state before animating
      gsap.set(chars, { clearProps: "all" });
      gsap.set(words, { clearProps: "all" });

      const animations = {
        matrix: () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play reverse play reverse",
            },
          });

          tl.fromTo(
            chars,
            {
              opacity: 0,
              y: -200,
              scale: 0,
              rotationX: -180,
              filter: "brightness(3) blur(10px)",
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotationX: 0,
              filter: "brightness(1) blur(0px)",
              duration: duration,
              stagger: {
                each: 0.05,
                from: lang === "ar" ? "end" : "start",
                ease: "power1.in",
              },
              ease: "bounce.out",
              delay: delay,
            },
          );
        },

        neon: () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play reverse play reverse",
            },
          });

          tl.fromTo(
            chars,
            {
              opacity: 0,
              scale: 1.5,
              filter: "brightness(0) blur(20px)",
              textShadow: "0 0 0px rgba(255,255,255,0)",
            },
            {
              opacity: 1,
              scale: 1,
              filter: "brightness(1) blur(0px)",
              textShadow:
                "0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor",
              duration: duration,
              stagger: {
                each: 0.04,
                from: "random",
              },
              ease: "power2.inOut",
              delay: delay,
            },
          ).to(
            chars,
            {
              opacity: 0.7,
              duration: 0.1,
              stagger: {
                each: 0.02,
                repeat: 3,
                yoyo: true,
                from: "random",
              },
            },
            "-=0.5",
          );
        },

        particle: () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play reverse play reverse",
            },
          });

          tl.fromTo(
            chars,
            {
              opacity: 0,
              scale: 3,
              x: () => gsap.utils.random(-300, 300),
              y: () => gsap.utils.random(-300, 300),
              rotation: () => gsap.utils.random(-360, 360),
              filter: "blur(20px)",
            },
            {
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
              rotation: 0,
              filter: "blur(0px)",
              duration: duration,
              stagger: {
                each: 0.02,
                from: "random",
              },
              ease: "expo.inout",
              delay: delay,
            },
          );
        },

        liquid: () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play reverse play reverse",
            },
          });

          tl.fromTo(
            chars,
            {
              opacity: 0,
              y: 150,
              x: () => gsap.utils.random(-50, 50),
              scaleY: 2,
              scaleX: 0.5,
              skewY: 20,
              filter: "blur(15px)",
            },
            {
              opacity: 1,
              y: 0,
              x: 0,
              scaleY: 1,
              scaleX: 1,
              skewY: 0,
              filter: "blur(0px)",
              duration: duration,
              stagger: {
                each: 0.03,
                from: lang === "ar" ? "end" : "start",
                ease: "sine.inOut",
              },
              ease: "elastic.out(1, 0.4)",
              delay: delay,
            },
          );
        },

        fadeSlide: () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play reverse play reverse",
            },
          });

          tl.fromTo(
            words,
            {
              opacity: 0,
              x: lang === "ar" ? 40 : -40,
              y: 10,
              filter: "blur(10px)",
            },
            {
              opacity: 1,
              x: 0,
              y: 0,
              filter: "blur(0px)",
              duration: duration,
              stagger: {
                each: 0.15,
                from: lang === "ar" ? "end" : "start",
              },
              ease: "power2.out",
              delay: delay,
            },
          );
        },

        wordWave: () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play reverse play reverse",
            },
          });

          tl.fromTo(
            words,
            {
              opacity: 0,
              y: 30,
              x: lang === "ar" ? 20 : -20,
              rotationZ: lang === "ar" ? 4 : -4,
              filter: "blur(8px)",
            },
            {
              opacity: 1,
              y: 0,
              x: 0,
              rotationZ: 0,
              filter: "blur(0px)",
              duration: duration,
              stagger: {
                each: 0.12,
                from: lang === "ar" ? "end" : "start",
              },
              ease: "elastic.out(1, 0.5)",
              delay: delay,
            },
          );
        },

        glitch: () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play reverse play reverse",
            },
          });

          tl.fromTo(
            chars,
            {
              opacity: 0,
              x: () => gsap.utils.random(-100, 100),
              y: () => gsap.utils.random(-50, 50),
              skewX: () => gsap.utils.random(-45, 45),
              filter: "blur(12px) contrast(200%)",
              textShadow: "5px 0 #ff0000, -5px 0 #00ffff, 0 5px #00ff00",
            },
            {
              opacity: 1,
              x: 0,
              y: 0,
              skewX: 0,
              filter: "blur(0px) contrast(100%)",
              textShadow: "0 0 0 transparent",
              duration: duration * 0.8,
              stagger: {
                each: 0.02,
                from: lang === "ar" ? "end" : "start",
              },
              ease: "steps(12)",
              delay: delay,
            },
          ).to(
            chars,
            {
              x: () => gsap.utils.random(-3, 3),
              duration: 0.05,
              repeat: 3,
              yoyo: true,
              stagger: 0.01,
            },
            "-=0.3",
          );
        },

        typewriter: () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play reverse play reverse",
            },
          });

          gsap.set(chars, { opacity: 0 });

          tl.to(chars, {
            opacity: 1,
            duration: 0.05,
            stagger: {
              each: 0.08,
              from: lang === "ar" ? "end" : "start",
            },
            ease: "steps(1)",
            delay: delay,
            onUpdate: function () {
              if (this.progress() < 0.99) {
                gsap.to(
                  this.targets()[Math.floor(this.progress() * chars.length)],
                  {
                    x: 2,
                    duration: 0.05,
                    yoyo: true,
                    repeat: 1,
                  },
                );
              }
            },
          });
        },

        morphIn: () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play reverse play reverse",
            },
          });

          tl.fromTo(
            chars,
            {
              opacity: 0,
              scaleX: 0.2,
              scaleY: 3,
              rotationY: 90,
              z: -500,
              filter: "blur(30px) brightness(0)",
            },
            {
              opacity: 1,
              scaleX: 1,
              scaleY: 1,
              rotationY: 0,
              z: 0,
              filter: "blur(0px) brightness(1)",
              duration: duration,
              stagger: {
                each: 0.04,
                from: lang === "ar" ? "end" : "start",
              },
              ease: "back.out(1.7)",
              delay: delay,
            },
          );
        },

        splitFlip: () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play reverse play reverse",
            },
          });

          tl.fromTo(
            chars,
            {
              opacity: 0,
              rotationX: lang === "ar" ? -90 : 90,
              rotationY: () => gsap.utils.random(-180, 180),
              z: -200,
              transformOrigin: "50% 50%",
              filter: "blur(15px)",
            },
            {
              opacity: 1,
              rotationX: 0,
              rotationY: 0,
              z: 0,
              filter: "blur(0px)",
              duration: duration,
              stagger: {
                each: 0.05,
                from: "random",
              },
              ease: "power3.out",
              delay: delay,
            },
          );
        },

        magneticPull: () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play reverse play reverse",
            },
          });

          chars.forEach((char, i) => {
            const direction = i % 2 === 0 ? 1 : -1;
            const isFromSide = i % 4 < 2;

            gsap.set(char, {
              opacity: 0,
              x: isFromSide ? direction * 400 : 0,
              y: isFromSide ? 0 : direction * 400,
              scale: 0.3,
              rotation: direction * 180,
              filter: "blur(20px)",
            });
          });

          tl.to(chars, {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            filter: "blur(0px)",
            duration: duration,
            stagger: {
              each: 0.03,
              from: "center",
            },
            ease: "power4.out",
            delay: delay,
          });
        },

        quantumShift: () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play reverse play reverse",
            },
          });

          tl.fromTo(
            chars,
            {
              opacity: 0,
              scale: () => gsap.utils.random(0.1, 3),
              x: () => gsap.utils.random(-200, 200),
              y: () => gsap.utils.random(-200, 200),
              rotation: () => gsap.utils.random(-720, 720),
              filter: "blur(25px) hue-rotate(180deg)",
            },
            {
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
              rotation: 0,
              filter: "blur(0px) hue-rotate(0deg)",
              duration: duration,
              stagger: {
                each: 0.015,
                from: lang === "ar" ? "end" : "start",
                ease: "power1.inOut",
              },
              ease: "expo.out",
              delay: delay,
            },
          );
        },

        prismBreak: () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play reverse play reverse",
            },
          });

          tl.fromTo(
            chars,
            {
              opacity: 0,
              scale: 2.5,
              filter: "blur(40px) saturate(300%) brightness(2)",
              textShadow:
                "20px 0 #ff0000, -20px 0 #00ffff, 0 20px #ffff00, 0 -20px #ff00ff",
            },
            {
              opacity: 1,
              scale: 1,
              filter: "blur(0px) saturate(100%) brightness(1)",
              textShadow: "0 0 0 transparent",
              duration: duration,
              stagger: {
                each: 0.04,
                from: "center",
              },
              ease: "power2.out",
              delay: delay,
            },
          );
        },

        orbitalSpin: () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play reverse play reverse",
            },
          });

          chars.forEach((char, i) => {
            const angle = (i / chars.length) * Math.PI * 2;
            const radius = 300;
            const x = Math.cos(angle) * radius * (lang === "ar" ? -1 : 1);
            const y = Math.sin(angle) * radius;

            gsap.set(char, {
              opacity: 0,
              x: x,
              y: y,
              rotation: angle * (180 / Math.PI),
              scale: 0,
              filter: "blur(20px)",
            });
          });

          tl.to(chars, {
            opacity: 1,
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: duration,
            stagger: {
              each: 0.025,
              from: lang === "ar" ? "end" : "start",
            },
            ease: "power2.inOut",
            delay: delay,
          });
        },

        hologram: () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play reverse play reverse",
            },
          });

          tl.fromTo(
            chars,
            {
              opacity: 0,
              scaleY: 0.1,
              y: 100,
              filter: "blur(0px) brightness(3)",
              textShadow: "0 0 20px currentColor",
            },
            {
              opacity: 1,
              scaleY: 1,
              y: 0,
              filter: "blur(0px) brightness(1)",
              duration: duration * 0.6,
              stagger: {
                each: 0.03,
                from: lang === "ar" ? "end" : "start",
              },
              ease: "power2.out",
              delay: delay,
            },
          )
            .to(
              chars,
              {
                opacity: 0.6,
                duration: 0.08,
                stagger: {
                  each: 0.02,
                  repeat: 5,
                  yoyo: true,
                },
              },
              "-=0.4",
            )
            .to(chars, { opacity: 1, duration: 0.2 });
        },

        electricArc: () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play reverse play reverse",
            },
          });

          tl.fromTo(
            chars,
            {
              opacity: 0,
              y: () => gsap.utils.random(-150, 150),
              x: () => gsap.utils.random(-100, 100),
              scale: 0.5,
              filter: "blur(15px) brightness(3)",
              textShadow:
                "0 0 30px #00ffff, 0 0 60px #00ffff, 0 0 90px #00ffff",
            },
            {
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1,
              filter: "blur(0px) brightness(1)",
              textShadow: "0 0 5px currentColor",
              duration: duration,
              stagger: {
                each: 0.025,
                from: lang === "ar" ? "end" : "start",
              },
              ease: "rough({ strength: 2, points: 20, clamp: true })",
              delay: delay,
            },
          );
        },

        vortexSwirl: () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play reverse play reverse",
            },
          });

          chars.forEach((char, i) => {
            const progress = i / chars.length;
            const spiralAngle = progress * Math.PI * 6;
            const spiralRadius = 400 * (1 - progress);
            const x =
              Math.cos(spiralAngle) * spiralRadius * (lang === "ar" ? -1 : 1);
            const y = Math.sin(spiralAngle) * spiralRadius;

            gsap.set(char, {
              opacity: 0,
              x: x,
              y: y,
              rotation: spiralAngle * (180 / Math.PI),
              scale: 2,
              filter: "blur(25px)",
            });
          });

          tl.to(chars, {
            opacity: 1,
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: duration,
            stagger: {
              each: 0.02,
              from: lang === "ar" ? "end" : "start",
            },
            ease: "power3.inOut",
            delay: delay,
          });
        },

        cascadeRipple: () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play reverse play reverse",
            },
          });

          tl.fromTo(
            chars,
            {
              opacity: 0,
              y: -80,
              scaleY: 2,
              scaleX: 0.5,
              filter: "blur(15px)",
            },
            {
              opacity: 1,
              y: 0,
              scaleY: 1,
              scaleX: 1,
              filter: "blur(0px)",
              duration: duration * 0.7,
              stagger: {
                each: 0.035,
                from: "center",
              },
              ease: "elastic.out(1, 0.6)",
              delay: delay,
            },
          ).to(
            chars,
            {
              y: -15,
              duration: 0.3,
              stagger: {
                each: 0.02,
                from: "center",
              },
              ease: "sine.inOut",
              yoyo: true,
              repeat: 1,
            },
            "-=0.5",
          );
        },
      };

      if (animations[animationType]) {
        animations[animationType]();
      }

      // Interactive hover effects (excluding word-based animations)
      if (animationType !== "fadeSlide" && animationType !== "wordWave") {
        chars.forEach((char) => {
          const onEnter = () => {
            gsap.to(char, {
              scale: 1.4,
              y: -10,
              color: animationType === "neon" ? "#00ffff" : "",
              textShadow: "0 0 20px currentColor, 0 0 40px currentColor",
              duration: 0.3,
              ease: "back.out(2)",
            });
          };

          const onLeave = () => {
            gsap.to(char, {
              scale: 1,
              y: 0,
              color: "inherit",
              textShadow:
                animationType === "neon" ? "0 0 10px currentColor" : "none",
              duration: 0.4,
              ease: "power2.out",
            });
          };

          char.addEventListener("mouseenter", onEnter);
          char.addEventListener("mouseleave", onLeave);

          // Store listeners for cleanup
          hoverListenersRef.current.push({ char, onEnter, onLeave });
        });
      }
    },
    {
      scope: containerRef,
      dependencies: [text, lang, animationType, delay, duration],
      revertOnUpdate: true, // This ensures GSAP cleans up on dependency changes (VIP)
    },
  );

  const renderText = () => {
    const words = text.split(" ");

    // For Arabic, split into characters just like English
    // The lang prop will control the animation direction
    return words.map((word, wordIndex) => (
      <span
        key={`${wordIndex}-${lang}`} // Add lang to key to force re-render
        className="word inline-block"
        style={{ whiteSpace: "pre" }}
      >
        {word.split("").map((char, charIndex) => (
          <span
            key={`${wordIndex}-${charIndex}-${lang}`} // Add lang to key
            className="char inline-block cursor-pointer"
            style={{
              display: "inline-block",
              transformOrigin: "center center",
            }}
          >
            {char}
          </span>
        ))}
        {wordIndex < words.length - 1 && (
          <span
            className="char inline-block"
            key={`space-${wordIndex}-${lang}`}
          >
            &nbsp;
          </span>
        )}
      </span>
    ));
  };

  const marginStyle = {};
  if (mt !== 0) marginStyle.marginTop = `${mt}px`;
  if (mb !== 0) marginStyle.marginBottom = `${mb}px`;

  return (
    <div
      ref={containerRef}
      className={`modern-text-container ${className}`}
      dir={lang === "ar" ? "rtl" : "ltr"}
      style={marginStyle}
    >
      <div
        ref={textRef}
        className={`modern-text ${fontStyle}`}
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
          textTransform: "none",
        }}
      >
        {renderText()}
      </div>
    </div>
  );
};

export default ModernTextEffect;
