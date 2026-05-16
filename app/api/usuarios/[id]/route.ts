import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: { id: string } }

export async function GET(_: Request, { params }: Params) {
  const usuario = await prisma.usuario.findUnique({
    where: { id_usuario: Number(params.id) },
    include: {
      atividades: true,
      estudantesVinculados: true,
    },
  })
  if (!usuario)
    return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  return NextResponse.json(usuario)
}

export async function PUT(req: Request, { params }: Params) {
  const body = await req.json()
  const updated = await prisma.usuario.update({
    where: { id_usuario: Number(params.id) },
    data: body,
  })
  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: Params) {
  await prisma.usuario.delete({
    where: { id_usuario: Number(params.id) },
  })
  return NextResponse.json({ message: 'Usuário deletado' })
}