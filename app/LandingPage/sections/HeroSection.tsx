"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import AvatarIllustration from "@/public/LearningBoy_homepage.png"
import Image from "next/image";
import { AuthDialog } from "@/components/auth/AuthDialog";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [interpreteDialogOpen, setInterpreteDialogOpen] = useState(false);
  const [estudanteDialogOpen, setEstudanteDialogOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.fromTo(
        ".hero-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
        }
      );

      // Card entrance
      tl.fromTo(
        cardRef.current,
        { x: 40, opacity: 0, scale: 0.96 },
        { x: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" },
        "-=0.5"
      );

      // Subtle float on card
      gsap.to(cardRef.current, {
        y: -10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.2,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="min-h-[calc(100vh-64px)] max-w-7xl mx-auto px-6 lg:px-16 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center montserrat"
    >
      <div ref={contentRef} className="flex flex-col">
        <h1 className="hero-item font-extrabold text-[#1a3a5c] leading-[1.08] tracking-tight text-4xl md:text-5xl xl:text-6xl mb-5">
          A educação não tem barreiras quando a{" "}
          <span className="text-[#2563a8]">comunicação flui</span>
        </h1>

        <p className="hero-item text-[#4a6a8a] text-lg leading-relaxed max-w-md mb-8">
          Sina conecta professores, famílias e estudantes surdos com tradução
          inteligente entre Português e Libras para que cada aula chegue a
          todos.
        </p>

        <div className="hero-item flex flex-wrap gap-3 mb-10">
          <Button
            onClick={() => setInterpreteDialogOpen(true)}
            className="bg-[#1a3a5c] hover:bg-[#0f2440] text-white rounded-full px-8 py-5 font-semibold text-sm"
          >
            Sou Intérprete
          </Button>
          <Button
            onClick={() => setEstudanteDialogOpen(true)}
            className="rounded-full px-7 py-5 font-semibold text-sm border-[#a8d8ee] bg-[#CBECFA] text-[#1a3a5c] hover:bg-[#88CBE8] hover:border-[#a8d8ee]"
          >
            Sou Estudante
          </Button>
        </div>
      </div>

      <div className="flex justify-center lg:justify-end">
        <div
          ref={cardRef}
          className="w-full max-w-[460px] aspect-[1/0.88] flex items-center justify-center overflow-hidden relative"
        >
          <Image src={AvatarIllustration} height={1000} width={1000} className="object-cover w-full h-full" alt="Garoto estudando desenho" />
        </div>
      </div>
      <AuthDialog
        open={interpreteDialogOpen}
        onOpenChange={setInterpreteDialogOpen}
        role="interprete"
        roleLabel="Intérprete"
      />

      <AuthDialog
        open={estudanteDialogOpen}
        onOpenChange={setEstudanteDialogOpen}
        role="estudante"
        roleLabel="Estudante"
      />
    </section>

  );
}