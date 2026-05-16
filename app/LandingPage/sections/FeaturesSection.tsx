"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MdPsychology,
  MdShowChart,
  MdForum,
  MdMenuBook,
} from "react-icons/md";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: MdPsychology,
    title: "Tradução Inteligente",
    description:
      "Converta texto e fala em Libras com IA contextual treinada por intérpretes.",
  },
  {
    icon: MdShowChart,
    title: "Painel de Progresso",
    description:
      "Acompanhe a evolução do aluno com indicadores claros e relatórios visuais.",
  },
  {
    icon: MdForum,
    title: "Chat Acessível",
    description:
      "Conversa bidirecional Português ↔ Libras entre escola e família, em tempo real.",
  },
  {
    icon: MdMenuBook,
    title: "Repositório de Sinais",
    description:
      "Biblioteca curada de vídeos e sinais regionais, sempre crescente e gratuita.",
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".features-header",
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-header",
            start: "top 82%",
          },
        }
      );

      gsap.fromTo(
        ".feature-card",
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".feature-card",
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="recursos"
      ref={sectionRef}
      className="montserrat bg-[#dce8f0] py-24 px-6 lg:px-10"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="features-header mb-14">
          <h2 className="font-extrabold text-[#1a3a5c] text-3xl md:text-4xl lg:text-[42px] leading-tight tracking-tight mb-4">
            Tudo que sua sala de aula precisa
          </h2>
          <p className="text-[#4a6a8a] text-lg leading-relaxed max-w-lg">
            Recursos pensados para professores, famílias e estudantes em uma
            única plataforma.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="feature-card bg-white rounded-2xl p-7 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-default"
              >
                <div className="w-11 h-11 rounded-full bg-[#eef4f9] flex items-center justify-center mb-5">
                  <Icon className="text-[#2563a8] text-xl" />
                </div>
                <h3 className="font-bold text-[#1a3a5c] text-sm mb-2.5">
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
