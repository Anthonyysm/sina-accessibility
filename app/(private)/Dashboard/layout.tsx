"use client"

import { useState, useCallback, useEffect, createContext, useContext } from "react"
import { usePathname } from "next/navigation"
import Sidebar from "@/components/layout/Sidebar"
import Topbar from "@/components/layout/Topbar"
import { NovaAtividadeModal } from "@/components/atividades/NovaAtividadeModal"
import { useAuth } from "@/lib/useAuth"

const PAGE_TITLES: Record<string, string> = {
  "/Dashboard": "Dashboard",
  "/Dashboard/turmas": "Turmas",
  "/Dashboard/alunos": "Alunos",
  "/Dashboard/publicacoes": "Publicações",
  "/Dashboard/agendamentos": "Agendamentos",
  "/Dashboard/tradutor": "Tradutor de Glosa",
}

interface DashboardContextValue {
  refreshKey: number
  triggerRefresh: () => void
}

export const DashboardContext = createContext<DashboardContextValue>({
  refreshKey: 0,
  triggerRefresh: () => {},
})

export function useDashboardContext() {
  return useContext(DashboardContext)
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user } = useAuth()
  const [modalAberto, setModalAberto] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const tituloPag = PAGE_TITLES[pathname] ?? "Dashboard"

  const handleNovaAtividadeSuccess = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

  useEffect(() => {
    const handler = () => setModalAberto(true)
    window.addEventListener("nova-atividade", handler)
    return () => window.removeEventListener("nova-atividade", handler)
  }, [])

  return (
    <DashboardContext.Provider value={{ refreshKey, triggerRefresh: () => setRefreshKey((k) => k + 1) }}>
      <div className="montserrat flex h-screen overflow-hidden bg-[#f0f4f9]">
        <Sidebar
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <div className="relative flex w-full flex-1 flex-col overflow-hidden">
          <Topbar
            tituloPag={tituloPag}
            onMenuClick={() => setMobileMenuOpen(true)}
          />
          <main className="flex flex-1 flex-col gap-4 overflow-y-auto px-3 py-4 sm:px-4 sm:py-5 md:px-8 md:py-7 md:gap-6">
            {children}
          </main>
        </div>
        <NovaAtividadeModal
          open={modalAberto}
          onOpenChange={setModalAberto}
          criadoPor={user?.id_usuario ?? 0}
          onSuccess={handleNovaAtividadeSuccess}
        />
      </div>
    </DashboardContext.Provider>
  )
}
