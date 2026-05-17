import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// POST /api/vinculos — vincula professor a estudante
export async function POST(request: Request) {
  const { id_professor, id_estudante } = await request.json()

  const vinculo = await prisma.professorEstudante.create({
    data: { id_professor, id_estudante },
  })
  return NextResponse.json(vinculo, { status: 201 })
}

// DELETE /api/vinculos?professor=1&estudante=2
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id_professor = Number(searchParams.get('professor'))
  const id_estudante = Number(searchParams.get('estudante'))

  await prisma.professorEstudante.delete({
    where: { id_professor_id_estudante: { id_professor, id_estudante } },
  })
  return NextResponse.json({ message: 'Vínculo removido' })
}