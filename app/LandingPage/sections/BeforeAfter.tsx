"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"

gsap.registerPlugin(ScrollTrigger)

export default function BeforeAfterSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

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
      )

      gsap.fromTo(
        ".baf-item",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.18,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".baf-item",
            start: "top 85%",
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const Arrow = () => (
    <div className="baf-item flex flex-shrink-0 items-center justify-center">
      {/* Mobile: seta para baixo */}
      <svg
        width="24"
        height="32"
        viewBox="0 0 24 32"
        fill="none"
        className="block text-[#5db5d8] md:hidden"
      >
        <line
          x1="12"
          y1="0"
          x2="12"
          y2="24"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <polyline
          points="4,18 12,28 20,18"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {/* Desktop: seta para direita */}
      <svg
        width="32"
        height="24"
        viewBox="0 0 32 24"
        fill="none"
        className="hidden text-[#5db5d8] md:block"
      >
        <line
          x1="0"
          y1="12"
          x2="24"
          y2="12"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <polyline
          points="18,4 28,12 18,20"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  )

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="montserrat bg-[#f5f2ec] px-6 py-24 lg:px-10"
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="how-header mb-16 text-center">
          <h2 className="mb-4 text-3xl leading-tight font-extrabold tracking-tight text-[#1a3a5c] md:text-4xl lg:text-[42px]">
            Uma entrada,{" "}
            <span className="text-[#2563a8]">múltiplas formas</span>
          </h2>
          <p className="text-lg leading-relaxed text-[#4a6a8a]">
            O professor digita. O Sina traduz.
          </p>
        </div>

        {/* Imagem → Seta → Imagem */}
        <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:gap-8">
          <div className="baf-item flex flex-2 justify-center bg-transparent">
            <Image
              src="/BeforePrompt.png"
              alt="Antes"
              width={1000}
              height={1000}
              className="h-auto w-full max-w-sm md:max-w-none rounded-lg object-cover md:-rotate-4"
            />
          </div>

          <Arrow />

          <div className="baf-item flex flex-3 justify-center ">
            <Image
              src="/AfterPrompt.png"
              alt="Depois"
              width={1000}
              height={1000}
              className="h-auto w-full max-w-sm md:max-w-none object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
