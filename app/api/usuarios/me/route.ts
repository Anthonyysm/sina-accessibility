import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSecureSession } from '@/lib/session'

export async function GET() {
  const session = await getSecureSession()
  if (!session?.userId) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id_usuario: Number(session.userId) },
    select: {
      id_usuario: true,
      nome: true,
      email: true,
      tipo_usuario: true,
      criado_em: true,
      disciplinas: true,
      turmas: true,
    },
  })

  if (!usuario) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
  }

  return NextResponse.json(usuario)
}

export async function PUT(req: NextRequest) {
  const session = await getSecureSession()
  if (!session?.userId) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const body = await req.json()
  const { nome, email, tipo_usuario, disciplinas, turmas } = body

  const updateData: Record<string, unknown> = {}
  if (nome !== undefined) updateData.nome = nome
  if (email !== undefined) updateData.email = email
  if (tipo_usuario !== undefined) updateData.tipo_usuario = tipo_usuario
  if (disciplinas !== undefined) updateData.disciplinas = disciplinas
  if (turmas !== undefined) updateData.turmas = turmas

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: 'Nenhum dado para atualizar' }, { status: 400 })
  }

  const updated = await prisma.usuario.update({
    where: { id_usuario: Number(session.userId) },
    data: updateData,
    select: {
      id_usuario: true,
      nome: true,
      email: true,
      tipo_usuario: true,
      criado_em: true,
      disciplinas: true,
      turmas: true,
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE() {
  const session = await getSecureSession()
  if (!session?.userId) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  await prisma.usuario.delete({
    where: { id_usuario: Number(session.userId) },
  })

  const response = NextResponse.json({ success: true })
  response.cookies.set('sina_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })

  return response
}
