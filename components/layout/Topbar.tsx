"use client";

import { MdMenu, MdAdd } from "react-icons/md";
import { Button } from "@/components/ui/button";

interface TopbarProps {
  tituloPag: string;
  onMenuClick: () => void;   // abre o drawer mobile
  onNewMaterial?: () => void;
}

export default function Topbar({ tituloPag, onMenuClick, onNewMaterial }: TopbarProps) {
  return (
    <header className="h-16 bg-white border-b border-[#e5eaf2] px-4 sm:px-8 flex items-center justify-between shrink-0 gap-3">

      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburguer — só em mobile */}
        <button
          onClick={onMenuClick}
          className="md:hidden text-[#1e3a5f] p-1.5 rounded-lg hover:bg-[#f0f4f9] transition-colors shrink-0"
          aria-label="Abrir menu"
        >
          <MdMenu className="text-xl" />
        </button>

        <h1 className="font-bold text-[#1e3a5f] text-base sm:text-xl tracking-tight truncate">
          {tituloPag}
        </h1>
      </div>

      {/* Botão novo material — label some em mobile muito pequeno */}
      {onNewMaterial && (
        <Button
          onClick={onNewMaterial}
          className="bg-[#1e3a5f] hover:bg-[#162d4a] text-white rounded-full px-3 sm:px-5 gap-1.5 font-semibold text-sm shrink-0"
        >
          <MdAdd className="text-base" />
          <span className="hidden sm:inline">Novo Material</span>
        </Button>
      )}
    </header>
  );
}
