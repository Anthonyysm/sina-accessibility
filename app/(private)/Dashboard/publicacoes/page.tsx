"use client"

import TableContent from "@/components/layout/TableContent"
import { useDashboardContext } from "@/app/(private)/Dashboard/layout"

export default function PublicacoesPage() {
  const { refreshKey } = useDashboardContext()

  return <TableContent refreshKey={refreshKey} />
}
