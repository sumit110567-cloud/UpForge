"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useParams, useRouter } from "next/navigation";
import { Menu, X, ChevronRight, ShieldCheck, Globe, ChevronDown, Check } from "lucide-react";

type NavLink = {
  name: string;
  href: string;
  external?: boolean;
};

const LOCALES = ['en','es','de','ja','fr','pt','ru','zh','ar','hi','id','tr','ko','it','nl','pl'] as const;
type Locale = typeof LOCALES[number];

const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',   es: 'Español',   de: 'Deutsch',  ja: '日本語',
  fr: 'Français',  pt: 'Português', ru: 'Русский',  zh: '中文',
  ar: 'العربية',  hi: 'हिन्दी',    id: 'Indonesia', tr: 'Türkçe',
  ko: '한국어',    it: 'Italiano',  nl: 'Nederlands', pl: 'Polski',
};

function LangDropdown({ currentLang }: { currentLang: Locale }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const switchLang = (lang: Locale) => {
    document.cookie = `upforge-lang=${lang};path=/;max-age=${60 * 60 * 24 * 30};SameSite=Lax`;
    const segments = pathname.split("/").filter(Boolean);
    const hasLocale = LOCALES.includes(segments[0] as Locale);
    const rest = hasLocale ? segments.slice(1) : segments;
    const newPath = lang === "en"
      ? `/${rest.join("/")}`
      : `/${lang}${rest.length ? "/" + rest.join("/") : ""}`;
    router.push(newPath);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#D5D0C8] bg-white text-[11px] font-semibold tracking-wider uppercase text-[#555] hover:border-[#1C1C1C] hover:text-[#1C1C1C] transition-colors"
        aria-label="Change language"
      >
        <Globe className="w-3 h-3 flex-shrink-0" />
        <span className="hidden sm:inline">{LOCALE_NAMES[currentLang]}</span>
        <span className="sm:hidden">{currentLang.toUpperCase()}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-[#D5D0C8] shadow-[0_4px_24px_rgba(0,0,0,0.10)] z-[999] overflow-hidden">
          <div className="px-3 py-2 border-b border-[#E8E4DC] bg-[#F7F5F0]">
            <p className="text-[9px] font-bold tracking-[0.15em] uppercase text-[#AAA]">Select Language</p>
          </div>
          <div className="grid grid-cols-2 max-h-72 overflow-y-auto">
            {LOCALES.map((lang) => (
              <button
                key={lang}
                onClick={() => switchLang(lang)}
                className={`flex items-center justify-between gap-1 px-3 py-2.5 text-[11px] font-medium tracking-wide transition-colors border-b border-r border-[#F0EDE8] ${
                  lang === currentLang
                    ? "bg-[#1C1C1C] text-white"
                    : "bg-white text-[#555] hover:bg-[#F7F5F0] hover:text-[#1C1C1C]"
                }`}
              >
                <span className="truncate">{LOCALE_NAMES[lang]}</span>
                {lang === currentLang && <Check className="w-2.5 h-2.5 flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const params = useParams();

  const currentLang = (
    params?.lang && LOCALES.includes(params.lang as Locale)
      ? (params.lang as Locale)
      : "en"
  );

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
    { name: "Global Registry", href: "https://www.upforge.org/registry", external: true },
    { name: "Journal",         href: localePath("/blog")    },
    { name: "Reports",         href: localePath("/reports") },
    { name: "About",           href: localePath("/about")   },
  ];

  const isLinkActive = (link: NavLink) => {
    if (link.external) return false;
    const segs = pathname.split("/").filter(Boolean);
    const hasLocale = LOCALES.includes(segs[0] as Locale);
    const cleanPath = hasLocale ? "/" + segs.slice(1).join("/") : pathname;
    const hsegs = link.href.split("/").filter(Boolean);
    const hhasLocale = LOCALES.includes(hsegs[0] as Locale);
    const cleanHref = hhasLocale ? "/" + hsegs.slice(1).join("/") : link.href;
    if (cleanHref === "/") return cleanPath === "/";
    return cleanPath === cleanHref || cleanPath.startsWith(cleanHref + "/");
  };

  const dCls = (link: NavLink) => `relative px-4 py-1 text-[12px] font-medium tracking-wide uppercase transition-colors border-b-2 ${
    isLinkActive(link) ? "text-[#1C1C1C] border-[#1C1C1C]" : "text-[#888] border-transparent hover:text-[#1C1C1C] hover:border-[#D5D0C8]"
  }`;

  const mCls = (link: NavLink) => `flex items-center justify-between px-5 py-4 text-sm font-medium tracking-wide uppercase transition-colors ${
    isLinkActive(link) ? "text-[#1C1C1C] bg-white" : "text-[#666] hover:text-[#1C1C1C] hover:bg-white/60"
  }`;

  return (
    <div>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-200 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-[#D5D0C8] shadow-[0_1px_12px_rgba(0,0,0,0.06)]"
            : "bg-[#F7F5F0] border-b border-[#D5D0C8]"
        }`}
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">

          <Link href={localePath("/")} className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative w-7 h-7 overflow-hidden flex-shrink-0">
              <Image src="/logo.jpg" alt="UpForge" fill className="object-cover" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg tracking-tight text-[#1C1C1C] group-hover:text-[#444] transition-colors" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                UpForge
              </span>
              <span className="text-[8px] text-[#AAA] tracking-[0.18em] uppercase hidden sm:block">
                Startup Registry
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-0 flex-1 justify-center">
            {links.map((link) => {
              if (link.external) {
                return <a key={link.name} href={link.href} className={dCls(link)}>{link.name}</a>;
              }
              return <Link key={link.name} href={link.href} className={dCls(link)}>{link.name}</Link>;
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <LangDropdown currentLang={currentLang} />
            <Link href={localePath("/verify")} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-[#D5D0C8] bg-white text-[11px] font-semibold tracking-wider uppercase text-[#555] hover:border-[#1C1C1C] hover:text-[#1C1C1C] transition-colors">
              <ShieldCheck className="w-3 h-3" />
              Verify UFRN
            </Link>
            <Link href={localePath("/submit")} className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#1C1C1C] text-white text-[11px] font-bold tracking-wider uppercase hover:bg-[#333] transition-colors">
              List Startup <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <LangDropdown currentLang={currentLang} />
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

      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-200 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={() => setIsOpen(false)} />
        <div
          className={`absolute top-14 left-0 right-0 bg-[#F7F5F0] border-b-2 border-[#1C1C1C] transition-transform duration-200 ${
            isOpen ? "translate-y-0" : "-translate-y-2"
          }`}
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          <div className="divide-y divide-[#E8E4DC]">
            {links.map((link) => {
              if (link.external) {
                return (
                  <a key={link.name} href={link.href} onClick={() => setIsOpen(false)} className={mCls(link)}>
                    <span>{link.name}</span>
                  </a>
                );
              }
              return (
                <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className={mCls(link)}>
                  <span>{link.name}</span>
                  {isLinkActive(link) && <span className="w-1.5 h-1.5 rounded-full bg-[#1C1C1C]" />}
                </Link>
              );
            })}
          </div>
          <div className="px-5 py-4 flex items-center justify-between gap-3 border-t border-[#D5D0C8] bg-white/40">
            <Link href={localePath("/verify")} onClick={() => setIsOpen(false)} className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#D5D0C8] bg-white text-[11px] font-semibold tracking-wider uppercase text-[#555] hover:border-[#1C1C1C] hover:text-[#1C1C1C] transition-colors">
              <ShieldCheck className="w-3 h-3" />
              Verify UFRN
            </Link>
            <Link href={localePath("/submit")} onClick={() => setIsOpen(false)} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1C1C1C] text-white text-[11px] font-bold tracking-wider uppercase">
              List Startup <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
