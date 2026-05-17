import { NextResponse } from "next/server";
import { vinculoDbService } from "@/service/server/vinculos";

// POST /api/vinculos — vincula professor a estudante
export async function POST(request: Request) {
  try {
    const { id_professor, id_estudante } = await request.json();
    const vinculo = await vinculoDbService.criar({ id_professor, id_estudante });
    return NextResponse.json(vinculo, { status: 201 });
  } catch (error) {
    console.error("[API Vinculos POST]", error);
    return NextResponse.json(
      { error: "Erro ao criar vínculo" },
      { status: 500 }
    );
  }
}

// DELETE /api/vinculos?professor=1&estudante=2
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id_professor = Number(searchParams.get("professor"));
    const id_estudante = Number(searchParams.get("estudante"));

    if (isNaN(id_professor) || isNaN(id_estudante)) {
      return NextResponse.json(
        { error: "Parâmetros professor e estudante inválidos." },
        { status: 400 }
      );
    }

    await vinculoDbService.deletar(id_professor, id_estudante);
    return NextResponse.json({ message: "Vínculo removido" });
  } catch (error) {
    console.error("[API Vinculos DELETE]", error);
    return NextResponse.json(
      { error: "Erro ao remover vínculo" },
      { status: 500 }
    );
  }
}