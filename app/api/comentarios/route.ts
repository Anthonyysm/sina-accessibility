import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/comentarios
export async function POST(request: Request) {
  const { id_atividade, id_usuario, comentario } =
    await request.json()

  const novo = await prisma.estudante.create({
    data: { id_atividade, id_usuario, comentario },
  })
  return NextResponse.json(novo, { status: 201 })
}