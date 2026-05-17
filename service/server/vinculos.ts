import { prisma } from "@/lib/prisma";

export const vinculoDbService = {
  async criar(data: { id_professor: number; id_estudante: number }) {
    return prisma.professorEstudante.create({
      data: {
        id_professor: data.id_professor,
        id_estudante: data.id_estudante,
      },
    });
  },

  async deletar(id_professor: number, id_estudante: number) {
    return prisma.professorEstudante.delete({
      where: {
        id_professor_id_estudante: {
          id_professor,
          id_estudante,
        },
      },
    });
  },
};
