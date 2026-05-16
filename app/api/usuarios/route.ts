import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const usuarios = await prisma.usuario.findMany({
    select: {
      id_usuario: true, nome: true,
      email: true, tipo_usuario: true, criado_em: true,
    },
    orderBy: { criado_em: 'desc' },
  })
  return NextResponse.json(usuarios)
}

export async function POST(request: Request) {
  const { nome, email, senha, tipo_usuario } = await request.json()
  const usuario = await prisma.usuario.create({
    data: { nome, email, senha, tipo_usuario },
  })
  return NextResponse.json(usuario, { status: 201 })
}