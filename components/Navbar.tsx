"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { MdAccessibility } from "react-icons/md";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -64, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    );

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`inter sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-[#f5f2ec]/95 backdrop-blur-md shadow-sm border-b border-[#1a3a5c]/10"
        : "bg-[#f5f2ec]/80 backdrop-blur-sm"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-[#1a3a5c] flex items-center justify-center">
            <MdAccessibility className="text-white text-lg" />
          </div>
          <span className="font-bold text-[17px] text-[#1a3a5c] tracking-tight">
            Sina
          </span>
        </a>

        {/* Links */}
        <ul className="hidden md:flex items-center gap-8 list-none">
          {[
            { label: "Recursos", href: "#recursos" },
            { label: "Como funciona", href: "#como-funciona" },
            { label: "Por que Sina", href: "#problema" },
          ].map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-[#4a6a8a] hover:text-[#1a3a5c] transition-colors font-medium"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Button
          asChild
          className="bg-[#1a3a5c] hover:bg-[#0f2440] text-white rounded-full px-6 font-semibold text-sm"
        >
          <a href="#cta">Começar</a>
        </Button>
      </div>
    </nav>
  );
}
