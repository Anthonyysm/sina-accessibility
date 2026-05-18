"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

interface PrivateShellProps {
  tituloPag: string;
  children: React.ReactNode;
  mainClassName?: string;
}

export function PrivateShell({ tituloPag, children, mainClassName }: PrivateShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f0f4f9] overflow-hidden montserrat">
      <Sidebar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden w-full relative">
        <Topbar tituloPag={tituloPag} onMenuClick={() => setMobileMenuOpen(true)} />
        <main className={`flex-1 overflow-y-auto px-4 md:px-8 py-5 md:py-7 ${mainClassName ?? ""}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
