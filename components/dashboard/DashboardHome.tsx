"use client"

import { Button } from "@/components/ui/button"
import { MdAdd } from "react-icons/md"
import TableContent from "@/components/layout/TableContent"
import { useDashboardContext } from "@/app/(private)/Dashboard/layout"

interface DashboardHomeProps {
  onNovaMaterial: () => void
}

export default function DashboardHome({ onNovaMaterial }: DashboardHomeProps) {
  const { refreshKey } = useDashboardContext()

  return (
    <>
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
              onClick={onNovaMaterial}
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
  )
}
