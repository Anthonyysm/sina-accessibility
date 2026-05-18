"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MdAdd } from "react-icons/md"
import Sidebar from "@/components/layout/Sidebar"
import Topbar from "@/components/layout/Topbar"
import TableContent from "@/components/layout/TableContent"
import TranslatorContainer from "@/components/Translator/Translator"
import { NovaAtividadeModal } from "@/components/atividades/NovaAtividadeModal"
import { useAuth } from "@/lib/useAuth"

export default function DashboardPage() {
  const { user } = useAuth()
  const [activeNav, setActiveNav] = useState(0)
  const [modalAberto, setModalAberto] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const titulos = ["Dashboard", "Publicações", "Tradutor de Glosa"]
  const tituloPag = titulos[activeNav]

  return (
    <div className="montserrat flex h-screen overflow-hidden bg-[#f0f4f9]">
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <div className="relative flex w-full flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar
          tituloPag={tituloPag}
          onMenuClick={() => setMobileMenuOpen(true)}
        />
        <main className="flex flex-1 flex-col gap-4 overflow-y-auto px-3 py-4 sm:px-4 sm:py-5 md:px-8 md:py-7 md:gap-6">
          {activeNav === 0 && (
            <>
              {/* Welcome banner */}
              <div className="relative flex min-h-[160px] items-end overflow-hidden rounded-2xl bg-[#2b5784] p-4 sm:min-h-[180px] sm:p-5">
                <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/5 sm:h-56 sm:w-56" />
                <div className="pointer-events-none absolute top-4 right-20 h-24 w-24 rounded-full bg-white/5 sm:top-4 sm:right-24 sm:h-32 sm:w-32" />
                <div className="relative z-10 w-full">
                  <h2 className="mb-1 text-base font-extrabold tracking-tight text-white sm:text-lg">
                    Bem-vindo ao SINA
                  </h2>
                  <p className="mb-3 max-w-lg text-xs leading-relaxed text-white/70 sm:text-sm">
                    Gerencie conteúdos adaptados e prepare mediações pedagógicas
                    com apoio de IA do PDF original ao material em Português L2,
                    pronto para o aluno surdo.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2 sm:mt-4 sm:gap-3">
                    <Button
                      onClick={() => setModalAberto(true)}
                      className="w-full gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#1e3a5f] hover:bg-white/90 sm:w-auto"
                    >
                      <MdAdd className="text-lg" />
                      Novo Material
                    </Button>
                  </div>
                </div>
              </div>

              <TableContent refreshKey={refreshKey} />
            </>
          )}

          {activeNav === 2 && <TranslatorContainer />}

          {(activeNav === 1 || activeNav === 3) && (
            <div className="flex flex-1 items-center justify-center text-sm text-slate-400 italic">
              Em breve: {tituloPag}
            </div>
          )}
        </main>
      </div>
      <NovaAtividadeModal
        open={modalAberto}
        onOpenChange={setModalAberto}
        criadoPor={user?.id_usuario ?? 0}
        onSuccess={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  )
}
