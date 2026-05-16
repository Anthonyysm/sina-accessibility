import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: { id: string } }

// GET /api/atividades/:id
export async function GET(_: Request, { params }: Params) {
  const atividade = await prisma.atividade.findUnique({
    where: { id_atividade: Number(params.id) },
    include: { usuario: true, comentarios: true },
  })
  if (!atividade)
    return NextResponse.json(
      { error: 'Não encontrado' }, { status: 404 }
    )
  return NextResponse.json(atividade)
}

// PUT /api/atividades/:id
export async function PUT(req: Request, { params }: Params) {
  const body = await req.json()
  const updated = await prisma.atividade.update({
    where: { id_atividade: Number(params.id) },
    data: body,
  })
  return NextResponse.json(updated)
}

// DELETE /api/atividades/:id
export async function DELETE(_: Request, { params }: Params) {
  await prisma.atividade.delete({
    where: { id_atividade: Number(params.id) },
  })
  return NextResponse.json({ message: 'Deletado com sucesso' })
}