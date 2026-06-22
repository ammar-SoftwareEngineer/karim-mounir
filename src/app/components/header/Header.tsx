"use client";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Link, usePathname } from "@/navigations";
import Image from "next/image";
import logo from "@/app/images/logo.png";
import { ChevronDown, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTransitionRouter } from "next-view-transitions";

export default function Header() {
  const viewRouter = useTransitionRouter();
  const t = useTranslations("header");
  const [scrolled, setScrolled] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [logoReady, setLogoReady] = useState(false);
  const [navReady, setNavReady] = useState(false);

  const locale = useLocale();
  const pathname = usePathname();
  const isAR = locale === "ar";
  const langLabel = isAR ? "AR" : "EN";

  const langRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const ticking = useRef(false);
  const lastScrollY = useRef(0);
  const lastDirection = useRef<"up" | "down">("up");

  const THRESHOLD = 12;
  const DIRECTION_EPS = 6;

  const LINKS = [
    { href: "/about", label: t("About") },
    { href: "/services", label: t("Services") },
    { href: "/projects", label: t("Projects") },
    { href: "/contact", label: t("Contact") },
  ];

  const mobileLinks = [{ href: "/", label: t("Home") }, ...LINKS];
  const desktopLeftLinks = LINKS.slice(0, 2);
  const desktopRightLinks = LINKS.slice(2);

  // Simplified reveal sequence (only on Home)
  useEffect(() => {
    if (pathname !== "/") {
      setLogoReady(true);
      setNavReady(true);
      return;
    }

    // Home entry sequence
    setShowHeader(true);
    setLogoReady(false);
    setNavReady(false);

    const logoTimer = setTimeout(() => setLogoReady(true), 150);
    const navTimer = setTimeout(() => setNavReady(true), 900);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(navTimer);
    };
  }, [pathname]);

  // Scroll effect
  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const prevY = lastScrollY.current;
        const delta = currentY - prevY;
        setScrolled(currentY > THRESHOLD);
        if (Math.abs(delta) > DIRECTION_EPS) {
          lastDirection.current = delta > 0 ? "down" : "up";
        }
        if (currentY <= THRESHOLD) {
          setShowHeader(true);
        } else if (lastDirection.current === "down") {
          setShowHeader(false);
        } else {
          setShowHeader(true);
        }
        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Popover handlers
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (langRef.current && !langRef.current.contains(target))
        setLangOpen(false);
      if (
        mobileRef.current &&
        !mobileRef.current.contains(target) &&
        toggleRef.current &&
        !toggleRef.current.contains(target)
      ) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const switchLocale = (target: "en" | "ar") => {
    if (target === locale) {
      setLangOpen(false);
      return;
    }

    let targetPath = pathname;
    const projectSlugs = (window as any).__PROJECT_SLUGS;

    if (projectSlugs && projectSlugs[target]) {
      const segments = pathname.split("/").filter(Boolean);
      if (segments.length > 0) {
        // Replace current slug with translated slug
        segments[segments.length - 1] = projectSlugs[target];
        targetPath = "/" + segments.join("/");
      }
    }

    const searchStr = window.location.search;
    window.location.href = `/${target}${targetPath}${searchStr}`;
  };

  function slideInOut() {
    document.documentElement.animate(
      [
        { opacity: 1, transform: "translateY(0)" },
        { opacity: 0.2, transform: "translateY(-35%)" },
      ],
      {
        duration: 1000,
        easing: "cubic-bezier(0.87, 0, 0.13, 1)",
        fill: "forwards",
        pseudoElement: "::view-transition-old(root)",
      },
    );
    document.documentElement.animate(
      [
        { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
        { clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)" },
      ],
      {
        duration: 1000,
        easing: "cubic-bezier(0.87, 0, 0.13, 1)",
        fill: "forwards",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  }

  return (
    <header
      ref={headerRef}
      className={clsx(
        "fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 h-fit",
        "transition-all duration-500 ease-in-out",
        scrolled ? "backdrop-blur-md bg-white/5" : "bg-transparent",
        showHeader
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0",
      )}
    >
      <div className="hidden xl:flex items-center w-full gap-6">
        <nav
          className={clsx(
            "flex flex-1 justify-end gap-8 uppercase tracking-wide text-white transition-all duration-700",
            navReady || pathname !== "/"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-3 blur-sm",
          )}
        >
          {desktopLeftLinks.map((item, index) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                style={{
                  transitionDelay:
                    navReady && pathname === "/" ? `${index * 100}ms` : "0ms",
                  transform:
                    navReady || pathname !== "/"
                      ? "translateX(0)"
                      : "translateX(10px)",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  viewRouter.push(item.href, { onTransitionReady: slideInOut });
                }}
                className={clsx(
                  "group relative text-sm py-1 transition-all",
                  isActive && "text-main-primary font-bold",
                )}
              >
                <span className="group-hover:opacity-90 transition-opacity">
                  {item.label}
                </span>
                <span
                  className={clsx(
                    "absolute -bottom-1 left-0 h-[1.5px] transition-all duration-300 bg-current",
                    isActive
                      ? "w-full opacity-80"
                      : "w-0 group-hover:w-full opacity-60",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-center w-[180px]">
          <Link
            href="/"
            prefetch
            onClick={(e) => {
              e.preventDefault();
              viewRouter.push("/", { onTransitionReady: slideInOut });
            }}
          >
            <div
              style={{
                opacity: logoReady || pathname !== "/" ? 1 : 0,
                transform:
                  logoReady || pathname !== "/" ? "scale(1)" : "scale(1.1)",
                filter:
                  logoReady || pathname !== "/" ? "blur(0px)" : "blur(10px)",
                transition: "all 1000ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <Image
                src={logo}
                alt="Logo"
                width={pathname === "/" ? 140 : 100}
                height={pathname === "/" ? 140 : 100}
                priority
                className="brightness-0 invert hover:opacity-80 transition-opacity"
              />
            </div>
          </Link>
        </div>

        <nav
          className={clsx(
            "flex flex-1 justify-start gap-8 uppercase tracking-wide text-white transition-all duration-700",
            navReady || pathname !== "/"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-3 blur-sm",
          )}
        >
          {desktopRightLinks.map((item, index) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                style={{
                  transitionDelay:
                    navReady && pathname === "/" ? `${index * 100}ms` : "0ms",
                  transform:
                    navReady || pathname !== "/"
                      ? "translateX(0)"
                      : "translateX(-10px)",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  viewRouter.push(item.href, { onTransitionReady: slideInOut });
                }}
                className={clsx(
                  "group relative text-sm py-1 transition-all",
                  isActive && "text-main-primary font-bold",
                )}
              >
                <span className="group-hover:opacity-90 transition-opacity">
                  {item.label}
                </span>
                <span
                  className={clsx(
                    "absolute -bottom-1 left-0 h-[1.5px] transition-all duration-300 bg-current",
                    isActive
                      ? "w-full opacity-80"
                      : "w-0 group-hover:w-full opacity-60",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 ml-4">
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-sm uppercase px-2 py-1 rounded text-white hover:bg-white/10 transition"
            >
              {langLabel}
              <ChevronDown
                className={clsx(
                  "h-4 w-4 transition-transform duration-300 text-white",
                  langOpen && "rotate-180",
                )}
              />
            </button>
            <div
              className={clsx(
                "absolute top-full mt-2 w-28 bg-black/70 backdrop-blur-md transition-all duration-200",
                langOpen
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-2",
                locale === "en" ? "right-0" : "left-0",
              )}
            >
              <button
                onClick={() => switchLocale("en")}
                className={clsx(
                  "w-full text-start px-3 py-2 text-sm hover:bg-white/15 flex items-center justify-between text-white",
                  locale === "en" && "bg-white/10",
                )}
              >
                {t("English")}
                <Globe size={16} className="text-white" />
              </button>
              <button
                onClick={() => switchLocale("ar")}
                className={clsx(
                  "w-full text-start px-3 py-2 text-sm hover:bg-white/15 flex items-center justify-between text-white",
                  locale === "ar" && "bg-white/10",
                )}
              >
                {t("Arabic")}
                <Globe size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex xl:hidden items-center justify-between w-full">
        <div className="flex items-center gap-3 cursor-pointer">
          <Link
            href="/"
            prefetch
            onClick={(e) => {
              e.preventDefault();
              viewRouter.push("/", { onTransitionReady: slideInOut });
            }}
          >
            <Image
              src={logo}
              alt="Logo"
              width={100}
              height={100}
              priority
              className="brightness-0 invert hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <button
            ref={toggleRef}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex flex-col items-center justify-center w-8 h-8 space-y-1.5 focus:outline-none"
            aria-label="Toggle menu"
          >
            <span
              className={clsx(
                "block w-6 h-[2px] rounded bg-white transition-transform duration-300",
                mobileOpen ? "rotate-45 translate-y-[8px] !bg-red-800" : "",
              )}
            />
            <span
              className={clsx(
                "block w-6 h-[2px] rounded bg-white transition-opacity duration-300",
                mobileOpen ? "opacity-0" : "opacity-100",
              )}
            />
            <span
              className={clsx(
                "block w-6 h-[2px] rounded bg-white transition-transform duration-300",
                mobileOpen ? "-rotate-45 -translate-y-[8px] !bg-red-800" : "",
              )}
            />
          </button>
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-sm uppercase px-2 py-1 rounded text-white hover:bg-white/10 transition"
            >
              {langLabel}
              <ChevronDown
                className={clsx(
                  "h-4 w-4 transition-transform duration-300 text-white",
                  langOpen && "rotate-180",
                )}
              />
            </button>
            <div
              className={clsx(
                "absolute top-full mt-2 w-28 bg-black/70 backdrop-blur-md transition-all duration-200",
                langOpen
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-2",
                locale === "en" ? "right-0" : "left-0",
              )}
            >
              <button
                onClick={() => switchLocale("en")}
                className={clsx(
                  "w-full text-start px-3 py-2 text-sm hover:bg-white/15 flex items-center justify-between text-white",
                  locale === "en" && "bg-white/10",
                )}
              >
                {t("English")}
                <Globe size={16} className="text-white" />
              </button>
              <button
                onClick={() => switchLocale("ar")}
                className={clsx(
                  "w-full text-start px-3 py-2 text-sm hover:bg-white/15 flex items-center justify-between text-white",
                  locale === "ar" && "bg-white/10",
                )}
              >
                {t("Arabic")}
                <Globe size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={mobileRef}
        className={clsx(
          "xl:hidden absolute top-full inset-x-4 bg-black/70 backdrop-blur-md transition-all duration-300",
          mobileOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-4",
        )}
      >
        <nav className="flex flex-col">
          {mobileLinks.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                prefetch
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileOpen(false);
                  viewRouter.push(item.href, { onTransitionReady: slideInOut });
                }}
                className={clsx(
                  "px-4 py-3 text-sm uppercase transition border-b border-white/10 text-white",
                  isActive
                    ? "bg-white/10 font-bold text-main-primary"
                    : "hover:bg-white/15",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
