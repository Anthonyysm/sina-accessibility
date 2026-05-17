import { NextResponse } from "next/server";
import { usuarioDbService } from "@/service/server/usuarios";

export async function GET() {
  try {
    const usuarios = await usuarioDbService.listar();
    return NextResponse.json(usuarios);
  } catch (error: any) {
    console.error("[API Usuarios GET]", error);
    return NextResponse.json(
      { error: "Erro ao buscar usuários." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { nome, email, senha, tipo_usuario } = await request.json();
    const usuario = await usuarioDbService.criar({ nome, email, senha, tipo_usuario });
    return NextResponse.json(usuario, { status: 201 });
  } catch (error: any) {
    console.error("[API Usuarios POST]", error);
    return NextResponse.json(
      { error: "Erro ao criar usuário." },
      { status: 500 }
    );
  }
}