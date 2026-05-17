"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import logo_sina from "@/public/LogoSina.png"
import Image from "next/image";

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

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

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
        <button onClick={() => scrollToSection("hero")} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-[#1a3a5c] flex items-center justify-center">
            <Image src={logo_sina} height={1000} width={1000} alt="logo da aplicação" className="invert object-cover"/>
          </div>
          <span className="font-bold text-[17px] text-[#1a3a5c] tracking-tight">
            Sina
          </span>
        </button>

        {/* Links */}
        <ul className="hidden md:flex items-center gap-8 list-none">
          {[
            { label: "Por que Sina", id: "problema" },
            { label: "Recursos", id: "recursos" },
            { label: "Como funciona", id: "como-funciona" },
          ].map((link) => (
            <li key={link.id}>
              <button
                onClick={() => scrollToSection(link.id)}
                className="text-sm text-[#4a6a8a] hover:text-[#1a3a5c] transition-colors font-medium"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Button
          onClick={() => scrollToSection("cta")}
          className="bg-[#1a3a5c] hover:bg-[#0f2440] text-white rounded-full px-6 font-semibold text-sm"
        >
          Começar
        </Button>
      </div>
    </nav>
  );
}
