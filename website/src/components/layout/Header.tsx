"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, Menu, X, MessageCircle } from "lucide-react";
import { NAV_ITEMS, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/98 backdrop-blur-lg shadow-premium border-b border-gold/10"
          : "bg-white/90 backdrop-blur-md"
      )}
    >
      {/* Gold top bar */}
      <div className="bg-gradient-to-l from-primary via-primary-400 to-primary text-white/80 text-xs py-1.5 hidden md:block">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href={`tel:${SITE_CONFIG.phone}`} className="flex items-center gap-1.5 hover:text-gold transition-colors">
              <Phone className="w-3 h-3" />
              <span dir="ltr">{SITE_CONFIG.phone}</span>
            </a>
            <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-gold transition-colors">
              {SITE_CONFIG.email}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a href={SITE_CONFIG.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
              Facebook
            </a>
            <span className="text-white/30">|</span>
            <a href={SITE_CONFIG.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
              Instagram
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link href="/" className="block group shrink-0">
            <div className="bg-gradient-to-br from-primary to-primary-400 rounded-xl px-4 py-2 md:px-5 md:py-2.5 shadow-premium group-hover:shadow-premium-lg transition-all">
              <Image
                src="/images/logo.png"
                alt="מלי מגן - נדל״ן"
                width={200}
                height={75}
                className="h-12 md:h-16 w-auto object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative",
                  pathname === item.href
                    ? "text-primary"
                    : "text-gray-500 hover:text-primary"
                )}
              >
                {item.label}
                {pathname === item.href && (
                  <span className="absolute bottom-0 right-1/2 translate-x-1/2 w-6 h-0.5 bg-gold rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex"
            >
              <Button variant="whatsapp" size="sm">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Button>
            </a>

            <a href={`tel:${SITE_CONFIG.phone}`} className="hidden sm:flex">
              <Button size="sm" className="btn-gold rounded-lg">
                <Phone className="w-4 h-4" />
                התקשרו עכשיו
              </Button>
            </a>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gold/10 rounded-lg transition-colors"
              aria-label="תפריט"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gold/10 shadow-premium-lg animate-fade-in">
          <nav className="container mx-auto py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3",
                  pathname === item.href
                    ? "text-primary bg-gold/10 border-r-2 border-gold"
                    : "text-gray-600 hover:text-primary hover:bg-gold/5"
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gold/10 mt-2 space-y-2">
              <a href={`tel:${SITE_CONFIG.phone}`}>
                <Button className="w-full btn-gold">
                  <Phone className="w-4 h-4" />
                  {SITE_CONFIG.phone}
                </Button>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
