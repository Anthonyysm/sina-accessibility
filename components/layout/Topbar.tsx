"use client";

import { MdLogout } from "react-icons/md";
import { useAuth } from "@/lib/useAuth";

export default function Topbar({ tituloPag }: any) {
  const { logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-[#e5eaf2] px-8 flex items-center justify-between shrink-0">
      <h1 className="font-bold text-[#1e3a5f] text-xl tracking-tight">
        {tituloPag}
      </h1>

      <button
        onClick={logout}
        className="text-[#9aadca] hover:text-[#1e3a5f] p-2 rounded-full hover:bg-[#f0f4f9] transition-colors shrink-0"
        title="Sair"
      >
        <MdLogout className="text-lg" />
      </button>
    </header>
  );
}