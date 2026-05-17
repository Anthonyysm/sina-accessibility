import { prisma } from "@/lib/prisma";

export const usuarioDbService = {
  async listar() {
    return prisma.usuario.findMany({
      select: {
        id_usuario: true,
        nome: true,
        email: true,
        tipo_usuario: true,
        criado_em: true,
      },
      orderBy: { criado_em: "desc" },
    });
  },

  async criar(data: { nome: string; email: string; senha?: string; tipo_usuario: any }) {
    return prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha: data.senha || "",
        tipo_usuario: data.tipo_usuario,
      },
    });
  },
};
