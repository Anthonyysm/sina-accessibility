import { prisma } from "@/lib/prisma";

export const comentarioDbService = {
  async criar(data: { id_atividade: number; id_usuario: number; comentario: string }) {
    return prisma.estudante.create({
      data: {
        id_atividade: data.id_atividade,
        id_usuario: data.id_usuario,
        comentario: data.comentario,
      },
    });
  },
};
