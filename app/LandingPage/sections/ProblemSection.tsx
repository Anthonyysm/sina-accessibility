"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MdHearingDisabled, MdSchool, MdFamilyRestroom } from "react-icons/md";

gsap.registerPlugin(ScrollTrigger);

const problems = [
  {
    icon: MdHearingDisabled,
    title: "Conteúdo inacessível",
    description:
      "Apenas 7% das escolas brasileiras oferecem materiais didáticos em Libras de forma consistente.",
  },
  {
    icon: MdSchool,
    title: "Professores sem suporte",
    description:
      "Educadores carecem de ferramentas práticas para incluir alunos surdos nas suas aulas diárias.",
  },
  {
    icon: MdFamilyRestroom,
    title: "Famílias isoladas",
    description:
      "Pais ouvintes têm dificuldade em acompanhar o aprendizado e a comunicação dos seus filhos surdos.",
  },
];

export default function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".problem-header",
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".problem-header",
            start: "top 82%",
          },
        }
      );

      gsap.fromTo(
        ".problem-card",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".problem-card",
            start: "top 84%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="problema"
      ref={sectionRef}
      className="montserrat bg-[#f5f2ec] py-24 px-6 lg:px-10"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="problem-header text-center mb-14">
          <h2 className="font-extrabold text-[#1a3a5c] text-3xl md:text-4xl lg:text-[42px] leading-tight tracking-tight mb-4">
            O abismo silencioso na educação
          </h2>
          <p className="text-[#4a6a8a] text-lg leading-relaxed max-w-xl mx-auto">
            Milhões de estudantes surdos no Brasil enfrentam aulas inacessíveis.
            Sina existe para mudar isso.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {problems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="problem-card bg-[#f0e8d8] rounded-2xl p-8 hover:-translate-y-1 transition-transform duration-200 cursor-default"
              >
                <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center mb-5">
                  <Icon className="text-[#1a3a5c] text-xl" />
                </div>
                <h3 className="font-bold text-[#1a3a5c] text-base mb-2.5">
                  {item.title}
                </h3>
                <p className="text-[#4a6a8a] text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
