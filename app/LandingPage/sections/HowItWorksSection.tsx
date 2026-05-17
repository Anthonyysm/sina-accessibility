"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "1",
    title: "Crie sua conta",
    description:
      "Escolha seu perfil de intérprete ou estudante e personalize seu espaço.",
  },
  {
    number: "2",
    title: "Traduza e ensine",
    description:
      "Envie textos ou PDF's e receba traduções em Libras instantaneamente.",
  },
  {
    number: "3",
    title: "Conclua seus Estudos",
    description:
      "Marque suas atividades como feitas e organize suas pendências.",
  },
];

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".how-header",
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".how-header",
            start: "top 82%",
          },
        }
      );

      // Animate the connector line
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: lineRef.current,
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        ".step-item",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.18,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".step-item",
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="como-funciona"
      ref={sectionRef}
      className="montserrat bg-[#f5f2ec] py-24 px-6 lg:px-10"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="how-header text-center mb-16">
          <h2 className="font-extrabold text-[#1a3a5c] text-3xl md:text-4xl lg:text-[42px] leading-tight tracking-tight mb-4">
            Como funciona
          </h2>
          <p className="text-[#4a6a8a] text-lg leading-relaxed">
            Comece em minutos. Sem instalação. Sem complicação.
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-3xl mx-auto">
          {/* Connector line (desktop) */}
          <div
            ref={lineRef}
            className="hidden md:block absolute top-7 left-[calc(16.66%+28px)] right-[calc(16.66%+28px)] h-0.5 bg-gradient-to-r from-[#a8d8ee] via-[#5db5d8] to-[#a8d8ee] z-0"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 relative z-10">
            {steps.map((step) => (
              <div
                key={step.number}
                className="step-item text-center flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-full bg-[#5db5d8] text-white font-extrabold text-xl flex items-center justify-center mb-5 shadow-md">
                  {step.number}
                </div>
                <h3 className="font-bold text-[#1a3a5c] text-base mb-2.5">
                  {step.title}
                </h3>
                <p className="text-[#4a6a8a] text-sm leading-relaxed max-w-[220px]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
