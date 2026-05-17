import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

export async function GET(_: NextRequest, { params }: Params) {
  const { id } = await params
  const usuario = await prisma.usuario.findUnique({
    where: { id_usuario: Number(id) },
    include: {
      atividades: true,
      estudantesVinculados: true,
    },
  })
  if (!usuario)
    return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  return NextResponse.json(usuario)
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params
  const body = await req.json()
  const updated = await prisma.usuario.update({
    where: { id_usuario: Number(id) },
    data: body,
  })
  return NextResponse.json(updated)
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const { id } = await params
  await prisma.usuario.delete({
    where: { id_usuario: Number(id) },
  })
  return NextResponse.json({ message: 'Usuário deletado' })
}
