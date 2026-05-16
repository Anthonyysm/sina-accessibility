"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth/AuthDialog";

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [interpreteDialogOpen, setInterpreteDialogOpen] = useState(false);
  const [estudanteDialogOpen, setEstudanteDialogOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cta-content",
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cta-content",
            start: "top 82%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        id="cta"
        ref={sectionRef}
        className="montserrat bg-[#f0e8d8] py-24 px-6 lg:px-10 text-center"
      >
        <div className="max-w-2xl mx-auto cta-content">
          <h2 className="font-extrabold text-[#1a3a5c] text-3xl md:text-4xl lg:text-[42px] leading-tight tracking-tight mb-4">
            Pronto para uma educação sem barreiras?
          </h2>
          <p className="text-[#4a6a8a] text-lg leading-relaxed mb-10">
            Junte-se a milhares de educadores e famílias que já transformaram a
            comunicação com Sina.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={() => setInterpreteDialogOpen(true)}
              className="bg-[#1a3a5c] hover:bg-[#0f2440] text-white rounded-full px-8 py-5 font-semibold text-sm"
            >
              Sou Intérprete
            </Button>
            <Button
              onClick={() => setEstudanteDialogOpen(true)}
              variant="outline"
              className="rounded-full px-8 py-5 font-semibold text-sm border-[#a8d8ee] bg-[#ceeaf5] text-[#1a3a5c] hover:bg-[#a8d8ee] hover:border-[#a8d8ee]"
            >
              Sou Aluno
            </Button>
          </div>
        </div>
      </section>

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
    </>
  );
}
