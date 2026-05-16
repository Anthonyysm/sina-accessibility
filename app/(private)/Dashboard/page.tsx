"use client";

import { MdAdd } from "react-icons/md";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import TableContent from "@/components/layout/TableContent";

export default function DashboardPage() {
  const tituloPag = "Dashboard"
  return (
    <div className="flex h-screen bg-[#f0f4f9] overflow-hidden montserrat">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar tituloPag={tituloPag} />
        <main className="flex-1 overflow-y-auto px-8 py-7 flex flex-col gap-6">
          {/* Welcome banner */}
          <div
            className="bg-[#2b5784] relative rounded-2xl overflow-hidden p-5 flex items-end min-h-[210px]"
          >
            {/* decorative */}
            <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute top-4 right-24 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
            <div className="relative z-10 w-full">
              <h2 className="text-white font-extrabold text-lg tracking-tight mb-1">
                Bem-vindo ao SINA
              </h2>
              <p className="text-white/70 text-sm leading-relaxed max-w-lg mb-2">
                Gerencie conteúdos adaptados e prepare mediações pedagógicas com
                apoio de IA do PDF original ao material em Português L2,
                pronto para o aluno surdo.
              </p>

              <div className="flex gap-3 flex-wrap">
                <Button className="bg-white text-[#1e3a5f] hover:bg-white/90 rounded-full font-bold px-5 gap-1.5">
                  <MdAdd className="text-base" />
                  Novo Material
                </Button>
              </div>
            </div>
          </div>
          {/* Recent materials */}
          <TableContent />
        </main>
      </div>
    </div>
  );
}
