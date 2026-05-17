"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MdAdd } from "react-icons/md";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import TableContent from "@/components/layout/TableContent";
import TranslatorContainer from "@/components/Translator/Translator";

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const titulos = ["Dashboard", "Revisão (IA)", "Publicações", "Visão do Aluno"];
  const tituloPag = titulos[activeNav];

  return (
    <div className="flex h-screen bg-[#f0f4f9] overflow-hidden montserrat">
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar
          tituloPag={tituloPag}
          onMenuClick={() => setMobileOpen(true)}
          onNewMaterial={activeNav === 0 ? () => setActiveNav(2) : undefined}
        />

        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-5 sm:py-7 flex flex-col gap-5 sm:gap-6">
          {activeNav === 0 && (
            <>
              {/* Welcome banner */}
              <div className="bg-[#2b5784] relative rounded-2xl overflow-hidden p-3 md:p-5 flex items-end min-h-[180px] sm:min-h-[210px]">
                <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
                <div className="absolute top-4 right-24 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
                <div className="relative z-10 w-full">
                  <h2 className="text-white font-extrabold text-base sm:text-lg tracking-tight mb-1">
                    Bem-vindo ao SINA
                  </h2>
                  <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-lg mb-1 md:mb-3 ">
                    Gerencie conteúdos adaptados e prepare mediações pedagógicas com
                    apoio de IA — do PDF original ao material em Português L2,
                    pronto para o aluno surdo.
                  </p>
                  <Button
                    onClick={() => setActiveNav(2)}
                    className="hidden md:flex bg-white text-[#1e3a5f] hover:bg-white/90 rounded-full font-bold px-3 gap-1.5 text-sm"
                  >
                    <MdAdd className="text-base" />
                    Novo Material
                  </Button>
                </div>
              </div>

              <TableContent />
            </>
          )}

          {activeNav === 2 && <TranslatorContainer />}

          {(activeNav === 1 || activeNav === 3) && (
            <div className="flex flex-1 items-center justify-center text-slate-400 italic text-sm">
              Em breve: {tituloPag}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
