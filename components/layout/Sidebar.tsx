"use client";

import { Separator } from "@/components/ui/separator";
import logo_sina from "@/public/LogoSina.png";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import {
  MdDashboard,
  MdLibraryBooks,
  MdPersonOutline,
  MdEdit,
} from "react-icons/md";

const navItems = [
  { icon: MdDashboard,     label: "Dashboard"      },
  { icon: MdLibraryBooks,  label: "Publicações"     },
  { icon: MdPersonOutline, label: "Visão do Aluno"  },
];

interface SidebarProps {
  activeNav: number;
  setActiveNav: (index: number) => void;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
}

const AVATAR_COLORS = ["#3b5fa0", "#5db5d8", "#6b8e6b", "#c47a4a", "#8b6baa"];
const DB_TO_LABEL: Record<string, string> = {
  INTERPRETE: "Intérprete · Libras",
  PROFESSOR: "Professor",
  ESTUDANTE: "Estudante",
  COORDENADOR: "Coordenador",
};

function getInitials(n: string) {
  return n.trim().split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";
}

export default function Sidebar({
  activeNav,
  setActiveNav,
  mobileMenuOpen,
  setMobileMenuOpen,
}: SidebarProps) {
  const router = useRouter();
  const { user } = useAuth();

  const navItems = [
    { icon: MdDashboard, label: "Dashboard" },
    { icon: MdLibraryBooks, label: "Publicações" },
    { icon: MdPersonOutline, label: "Visão do Aluno" },
  ];

  const userName = user?.nome ?? "";
  const userLabel = user ? (DB_TO_LABEL[user.tipo_usuario] ?? user.tipo_usuario) : "";
  const avatarColor = user
    ? AVATAR_COLORS[user.id_usuario % AVATAR_COLORS.length]
    : "#3b5fa0";

  return (
    <>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setMobileMenuOpen?.(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px] md:w-[300px] shrink-0 bg-[#1e3a5f] flex flex-col text-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Logo */}
        <div className="px-6 pt-7 pb-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Image
              src={logo_sina}
              height={1000}
              width={1000}
              alt="logo da aplicação"
              className="invert object-cover"
            />
          </div>
          <div>
            <p className="font-bold text-base leading-tight tracking-tight">SINA</p>
            <p className="text-xs text-white/50 mt-0.5">Mediação Pedagógica</p>
          </div>
        </div>

        <Separator className="bg-white/10 mx-4 w-auto" />

        {/* Nav */}
        <nav className="flex-1 px-4 py-5 flex flex-col gap-0.5">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            const isActive = activeNav === i;
            return (
              <Button
                key={item.label}
                variant="ghost"
                onClick={() => {
                  setActiveNav(i);
                  setMobileMenuOpen?.(false);
                  router.push("/Dashboard");
                }}
                className={`w-full justify-start gap-3 px-4 py-2.5 h-auto rounded-xl text-sm font-medium transition-all ${isActive
                    ? "bg-white/15 text-white hover:bg-white/20"
                    : "text-white/55 hover:bg-white/[0.08] hover:text-white/85"
                  }`}
              >
                <Icon className="text-lg shrink-0" />
                {item.label}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#5db5d8]" />
                )}
              </Button>
            );
          })}
        </nav>

        <Separator className="bg-white/10 mx-4 w-auto" />

        {/* User — clicável para editar perfil */}
        <button
          onClick={() => {
            setMobileMenuOpen?.(false);
            router.push("/Perfil");
          }}
          className="px-5 py-4 flex items-center gap-3 hover:bg-white/[0.06] transition-colors group w-full text-left"
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ backgroundColor: avatarColor }}
          >
            {getInitials(userName)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-tight truncate">{userName}</p>
            <p className="text-xs text-white/45 mt-0.5">{userLabel}</p>
          </div>
          <MdEdit className="text-white/30 group-hover:text-white/60 text-base shrink-0 transition-colors" />
        </button>
      </aside>
    </>
  );
}
