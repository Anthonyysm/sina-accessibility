"use client"

import { usePathname, useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import logo_sina from "@/public/LogoSina.png"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useAuth } from "@/lib/useAuth"
import {
  MdDashboard,
  MdGroups,
  MdSchool,
  MdLibraryBooks,
  MdEvent,
  MdPersonOutline,
  MdEdit,
  MdClose,
  MdLogout,
} from "react-icons/md"

interface SidebarProps {
  mobileMenuOpen?: boolean
  setMobileMenuOpen?: (open: boolean) => void
}

const AVATAR_COLORS = ["#3b5fa0", "#5db5d8", "#6b8e6b", "#c47a4a", "#8b6baa"]
const DB_TO_LABEL: Record<string, string> = {
  INTERPRETE: "Intérprete · Libras",
  PROFESSOR: "Professor",
  ESTUDANTE: "Estudante",
  COORDENADOR: "Coordenador",
}

const NAV_ITEMS = [
  { icon: MdDashboard, label: "Dashboard", path: "/Dashboard" },
  { icon: MdGroups, label: "Turmas", path: "/Dashboard/turmas" },
  { icon: MdSchool, label: "Alunos", path: "/Dashboard/alunos" },
  { icon: MdLibraryBooks, label: "Publicações", path: "/Dashboard/publicacoes" },
  { icon: MdEvent, label: "Agendamentos", path: "/Dashboard/agendamentos" },
  { icon: MdPersonOutline, label: "Tradutor de Glosa", path: "/Dashboard/tradutor" },
]

function getInitials(n: string) {
  return (
    n
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  )
}

export default function Sidebar({
  mobileMenuOpen,
  setMobileMenuOpen,
}: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const userName = user?.nome ?? ""
  const userLabel = user
    ? (DB_TO_LABEL[user.tipo_usuario] ?? user.tipo_usuario)
    : ""
  const avatarColor = user
    ? AVATAR_COLORS[user.id_usuario % AVATAR_COLORS.length]
    : "#3b5fa0"

  function isActive(path: string) {
    if (path === "/Dashboard") return pathname === "/Dashboard"
    return pathname?.startsWith(path) ?? false
  }

  const isPerfil = pathname === "/Perfil"

  return (
    <>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden"
          onClick={() => setMobileMenuOpen?.(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] shrink-0 flex-col bg-[#1e3a5f] text-white transition-transform duration-300 ease-in-out md:relative md:w-[300px] md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header com Logo e botão fechar (mobile) */}
        <div className="flex items-center justify-between px-6 pt-7 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
              <Image
                src={logo_sina}
                height={1000}
                width={1000}
                alt="logo da aplicação"
                className="object-cover invert"
              />
            </div>
            <div>
              <p className="text-base leading-tight font-bold tracking-tight">
                SINA
              </p>
              <p className="mt-0.5 text-xs text-white/50">Mediação Pedagógica</p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen?.(false)}
            className="md:hidden rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            aria-label="Fechar menu"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        <Separator className="mx-4 w-auto bg-white/10" />

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-0.5 px-4 py-5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => {
                  router.push(item.path)
                  setMobileMenuOpen?.(false)
                }}
                className={`h-auto w-full justify-start gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-white/15 text-white hover:bg-white/20"
                    : "text-white/55 hover:bg-white/[0.08] hover:text-white/85"
                }`}
              >
                <Icon className="shrink-0 text-lg" />
                {item.label}
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#5db5d8]" />
                )}
              </Button>
            )
          })}
        </nav>

        <Separator className="mx-4 w-auto bg-white/10" />

        {/* User */}
        <button
          onClick={() => {
            setMobileMenuOpen?.(false)
            router.push("/Perfil")
          }}
          className={`group flex w-full items-center gap-3 px-5 py-4 text-left transition-colors ${
            isPerfil ? "bg-white/15 text-white" : "hover:bg-white/[0.06]"
          }`}
        >
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: avatarColor }}
          >
            {getInitials(userName)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm leading-tight font-semibold">
              {userName}
            </p>
            <p className="mt-0.5 text-xs text-white/45">{userLabel}</p>
          </div>
          <MdEdit className="shrink-0 text-base text-white/30 transition-colors group-hover:text-white/60" />
        </button>

        {/* Logout */}
        <button
          onClick={() => {
            setMobileMenuOpen?.(false)
            logout()
          }}
          className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white/80"
        >
          <MdLogout className="shrink-0 text-lg" />
          Sair
        </button>
      </aside>
    </>
  )
}
