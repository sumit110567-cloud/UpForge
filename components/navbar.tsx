"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useParams } from "next/navigation";
import { Menu, X, ChevronRight, ShieldCheck } from "lucide-react";
import { LangSwitcher } from "./lang-switcher";
import { defaultLocale, locales, type Locale } from "@/lib/i18n";

type NavLink = {
  name: string;
  href: string;
  external?: boolean;
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const params = useParams();

  // Derive current locale from URL params
  const currentLang = (
    params?.lang && locales.includes(params.lang as Locale)
      ? params.lang
      : defaultLocale
  ) as Locale;

  // Prefix internal links with locale segment when not English
  const localePath = (path: string) =>
    currentLang === "en" ? path : `/${currentLang}${path}`;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [pathname]);

  const links: NavLink[] = [
    { name: "Home",            href: localePath("/")        },
    { name: "Indian Registry", href: localePath("/startup") },
    {
      name: "Global Registry",
      href: "https://www.upforge.org/registry",
      external: true,
    },
    { name: "Journal", href: localePath("/blog")    },
    { name: "Reports", href: localePath("/reports") },
    { name: "About",   href: localePath("/about")   },
  ];

  const isLinkActive = (link: NavLink) => {
    if (link.external) return false;
    // Normalise: strip locale prefix for comparison
    const segments = pathname.split("/").filter(Boolean);
    const isLocalePrefix = locales.includes(segments[0] as Locale);
    const cleanPathname = isLocalePrefix ? "/" + segments.slice(1).join("/") : pathname;

    const hrefSegments = link.href.split("/").filter(Boolean);
    const isHrefLocale = locales.includes(hrefSegments[0] as Locale);
    const cleanHref = isHrefLocale ? "/" + hrefSegments.slice(1).join("/") : link.href;

    if (cleanHref === "/") return cleanPathname === "/";
    return cleanPathname === cleanHref || cleanPathname.startsWith(cleanHref + "/");
  };

  const desktopClass = (link: NavLink) => {
    const active = isLinkActive(link);
    return `relative px-4 py-1 text-[12px] font-medium tracking-wide uppercase transition-colors border-b-2 ${
      active
        ? "text-[#1C1C1C] border-[#1C1C1C]"
        : "text-[#888] border-transparent hover:text-[#1C1C1C] hover:border-[#D5D0C8]"
    }`;
  };

  const mobileClass = (link: NavLink) => {
    const active = isLinkActive(link);
    return `flex items-center justify-between px-5 py-4 text-sm font-medium tracking-wide uppercase transition-colors ${
      active
        ? "text-[#1C1C1C] bg-white"
        : "text-[#666] hover:text-[#1C1C1C] hover:bg-white/60"
    }`;
  };

  const renderDesktop = (link: NavLink) =>
    link.external ? (
      <a key={link.name} href={link.href} className={desktopClass(link)}>
        {link.name}
      </a>
    ) : (
      <Link key={link.name} href={link.href} className={desktopClass(link)}>
        {link.name}
      </Link>
    );

 const renderMobile = (link: NavLink) => {
  const active = isLinkActive(link);
  const inner = (
    <span className="flex items-center justify-between w-full">
      <span>{link.name}</span>
      {active && <span className="w-1.5 h-1.5 rounded-full bg-[#1C1C1C]" />}
    </span>
  );
  return link.external ? (
    
      key={link.name}
      href={link.href}
      onClick={() => setIsOpen(false)}
      className={mobileClass(link)}
    >
      {inner}
    </a>
  ) : (
    <Link
      key={link.name}
      href={link.href}
      onClick={() => setIsOpen(false)}
      className={mobileClass(link)}
    >
      {inner}
    </Link>
  );
};

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-200 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-[#D5D0C8] shadow-[0_1px_12px_rgba(0,0,0,0.06)]"
            : "bg-[#F7F5F0] border-b border-[#D5D0C8]"
        }`}
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">

          {/* Brand */}
          <Link href={localePath("/")} className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative w-7 h-7 overflow-hidden flex-shrink-0">
              <Image src="/logo.jpg" alt="UpForge" fill className="object-cover" />
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className="text-lg tracking-tight text-[#1C1C1C] group-hover:text-[#444] transition-colors"
                style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
              >
                UpForge
              </span>
              <span className="text-[8px] text-[#AAA] tracking-[0.18em] uppercase hidden sm:block">
                Startup Registry
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0 flex-1 justify-center">
            {links.map(renderDesktop)}
          </nav>

          {/* Right side — Lang + Verify UFRN + List Startup */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <LangSwitcher currentLang={currentLang} />
            <Link
              href={localePath("/verify")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-[#D5D0C8] bg-white text-[11px] font-semibold tracking-wider uppercase text-[#555] hover:border-[#1C1C1C] hover:text-[#1C1C1C] transition-colors"
            >
              <ShieldCheck className="w-3 h-3" />
              Verify UFRN
            </Link>
            <Link
              href={localePath("/submit")}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#1C1C1C] text-white text-[11px] font-bold tracking-wider uppercase hover:bg-[#333] transition-colors"
            >
              List Startup <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Mobile: Lang switcher + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <LangSwitcher currentLang={currentLang} />
            <button
              className="p-1.5 text-[#1C1C1C] hover:bg-[#E8E4DC] transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-200 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
          onClick={() => setIsOpen(false)}
        />
        <div
          className={`absolute top-14 left-0 right-0 bg-[#F7F5F0] border-b-2 border-[#1C1C1C] transition-transform duration-200 ${
            isOpen ? "translate-y-0" : "-translate-y-2"
          }`}
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          <div className="divide-y divide-[#E8E4DC]">
            {links.map(renderMobile)}
          </div>
          <div className="px-5 py-4 flex items-center justify-between gap-3 border-t border-[#D5D0C8] bg-white/40">
            <Link
              href={localePath("/verify")}
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#D5D0C8] bg-white text-[11px] font-semibold tracking-wider uppercase text-[#555] hover:border-[#1C1C1C] hover:text-[#1C1C1C] transition-colors"
            >
              <ShieldCheck className="w-3 h-3" />
              Verify UFRN
            </Link>
            <Link
              href={localePath("/submit")}
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1C1C1C] text-white text-[11px] font-bold tracking-wider uppercase"
            >
              List Startup <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
