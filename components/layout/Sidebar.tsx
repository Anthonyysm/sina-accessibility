import { Separator } from "@/components/ui/separator";
import logo_sina from "@/public/LogoSina.png"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import {
  MdDashboard,
  MdRateReview,
  MdLibraryBooks,
  MdPersonOutline,
} from "react-icons/md";

export default function Sidebar() {
  const [activeNav, setActiveNav] = useState(0);
  const navItems = [
    { icon: MdDashboard, label: "Dashboard" },
    { icon: MdLibraryBooks, label: "Publicações" },
    { icon: MdPersonOutline, label: "Visão do Aluno" },
  ];
  return (
    <aside className="w-[300px] shrink-0 bg-[#1e3a5f] flex flex-col text-white">
      {/* Logo */}
      <div className="px-6 pt-7 pb-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <Image src={logo_sina} height={1000} width={1000} alt="logo da aplicação" className="invert object-cover" />
        </div>
        <div>
          <p className="font-bold text-base leading-tight tracking-tight">SINA</p>
          <p className="text-xs text-white/50 mt-0.5">Mediação Pedagógica</p>
        </div>
      </div>
      <Separator className="bg-white/10 mx-4 w-auto" />
      {/* Nav */}
      <nav className="flex-1 px-4 py-5 flex flex-col gap-0.5">
        {navItems.map((item: any, i: any) => {
          const Icon = item.icon;
          const isActive = activeNav === i;
          return (
            <Button
              key={item.label}
              variant="ghost"
              onClick={() => setActiveNav(i)}
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

      {/* User */}
      <div className="px-5 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#3b5fa0] flex items-center justify-center text-xs font-bold text-white shrink-0">
          MR
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-tight truncate">Marina Rocha</p>
          <p className="text-xs text-white/45 mt-0.5">Intérprete · Libras</p>
        </div>
      </div>
    </aside>
  )
}