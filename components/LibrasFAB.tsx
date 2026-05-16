"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MdSignLanguage } from "react-icons/md";

export default function LibrasFAB() {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Entrance animation after delay
    gsap.fromTo(
      btnRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)", delay: 1.5 }
    );
  }, []);

  return (
    <button
      ref={btnRef}
      aria-label="Ativar VLibras"
      title="Ativar VLibras"
      className="fixed bottom-7 right-7 z-50 w-13 h-13 w-[52px] h-[52px] rounded-full bg-[#1a3a5c] text-white flex items-center justify-center shadow-lg hover:scale-110 hover:bg-[#0f2440] transition-all duration-200 cursor-pointer border-none"
    >
      <MdSignLanguage className="text-2xl" />
    </button>
  );
}
