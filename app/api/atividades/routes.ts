import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/atividades
export async function GET() {
  try {
    const atividades = await prisma.atividade.findMany({
      include: { usuario: true, comentarios: true },
      orderBy: { criado_em: 'desc' },
    })
    return NextResponse.json(atividades)
  } catch {
    return NextResponse.json(
      { error: 'Erro ao buscar atividades' },
      { status: 500 }
    )
  }
}

// POST /api/atividades
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { titulo, texto_original, criado_por } = body

    const atividade = await prisma.atividade.create({
      data: { titulo, texto_original, criado_por },
    })
    return NextResponse.json(atividade, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Erro ao criar atividade' },
      { status: 500 }
    )
  }
}