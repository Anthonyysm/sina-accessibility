"use client";

import Image from "next/image";
import { MdLogout } from "react-icons/md";
import { Filter } from "@/types/activity";
import logo_sina from "@/public/LogoSina.png";

interface TopbarProps {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  onLogout: () => void;
}

const FILTERS: Filter[] = ["todos", "pendentes", "concluídas"];

export default function Topbar({ filter, onFilterChange, onLogout }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-[#f0f4f9]">
      <div className="max-w-[640px] mx-auto px-4 sm:px-5 h-14 flex items-center justify-between gap-3">

        {/* Logo — oculto em mobile, aparece a partir de sm */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-[#1e3a5f] flex items-center justify-center">
            <Image
              src={logo_sina}
              height={32}
              width={32}
              alt="Logo SINA"
              className="invert object-cover"
            />
          </div>
          <span className="font-bold text-sm text-[#1e3a5f] tracking-tight">SINA</span>
        </div>

        {/* Filtros — flex-1 em mobile (ocupa todo o espaço), largura fixa em sm+ */}
        <div className="flex gap-0.5 bg-[#f0f4f9] rounded-xl p-1 flex-1 sm:flex-none sm:w-[260px]">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`flex-1 text-[11px] font-semibold py-1.5 rounded-lg capitalize transition-all ${
                filter === f
                  ? "bg-white text-[#1e3a5f] shadow-sm"
                  : "text-[#6b7fa3] hover:text-[#3a5070]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="text-[#9aadca] hover:text-[#1e3a5f] p-2 rounded-full hover:bg-[#f0f4f9] transition-colors shrink-0"
          title="Sair"
        >
          <MdLogout className="text-lg" />
        </button>
      </div>
    </header>
  );
}
