"use client";

import { MdLogout, MdMenu } from "react-icons/md";
import { useAuth } from "@/lib/useAuth";

export default function Topbar({ tituloPag, onMenuClick }: any) {
  const { logout } = useAuth();

  return (
    <header className="h-14 sm:h-16 bg-white border-b border-[#e5eaf2] px-3 sm:px-4 md:px-8 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2 sm:gap-3">
        <button 
          onClick={onMenuClick} 
          className="md:hidden text-[#1e3a5f] p-1.5 -ml-1.5 rounded-lg hover:bg-[#f0f4f9] shrink-0 active:bg-[#e5eaf2]"
        >
          <MdMenu className="text-xl sm:text-2xl" />
        </button>
        <h1 className="font-bold text-[#1e3a5f] text-lg sm:text-xl tracking-tight truncate">
          {tituloPag}
        </h1>
      </div>

      <button
        onClick={logout}
        className="text-[#9aadca] hover:text-[#1e3a5f] p-1.5 sm:p-2 rounded-lg hover:bg-[#f0f4f9] transition-colors shrink-0 active:bg-[#e5eaf2]"
        title="Sair"
      >
        <MdLogout className="text-base sm:text-lg" />
      </button>
    </header>
  );
}
