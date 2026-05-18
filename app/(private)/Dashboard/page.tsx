"use client"

import DashboardHome from "@/components/dashboard/DashboardHome"

export default function DashboardPage() {
  return (
    <DashboardHome
      onNovaMaterial={() => window.dispatchEvent(new CustomEvent("nova-atividade"))}
    />
  )
}
