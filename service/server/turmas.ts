import { prisma } from "@/lib/prisma";

export const turmaDbService = {
  async listar(criadoPor?: number) {
    const where = criadoPor ? { criado_por: criadoPor } : {};
    return prisma.turma.findMany({
      where,
      include: {
        professor: { select: { id_usuario: true, nome: true, email: true } },
        alunos: {
          include: {
            usuario: { select: { id_usuario: true, nome: true, email: true, tipo_usuario: true } },
          },
        },
        _count: { select: { alunos: true, atividades: true } },
      },
      orderBy: { criado_em: "desc" },
    });
  },

  async buscarPorId(id: number) {
    return prisma.turma.findUnique({
      where: { id_turma: id },
      include: {
        professor: { select: { id_usuario: true, nome: true, email: true } },
        alunos: {
          include: {
            usuario: { select: { id_usuario: true, nome: true, email: true, tipo_usuario: true } },
          },
        },
        atividades: { orderBy: { criado_em: "desc" } },
      },
    });
  },

  async criar(data: { nome: string; descricao?: string; criado_por: number }) {
    return prisma.turma.create({ data });
  },

  async atualizar(id: number, data: { nome?: string; descricao?: string }) {
    return prisma.turma.update({ where: { id_turma: id }, data });
  },

  async deletar(id: number) {
    return prisma.turma.delete({ where: { id_turma: id } });
  },

  async adicionarAluno(id_turma: number, id_usuario: number) {
    return prisma.turmaAluno.create({
      data: { id_turma, id_usuario },
      include: { usuario: { select: { id_usuario: true, nome: true, email: true } } },
    });
  },

  async removerAluno(id_turma: number, id_usuario: number) {
    return prisma.turmaAluno.delete({
      where: { id_turma_id_usuario: { id_turma, id_usuario } },
    });
  },

  async listarAlunos(id_turma: number) {
    return prisma.turmaAluno.findMany({
      where: { id_turma },
      include: {
        usuario: { select: { id_usuario: true, nome: true, email: true, tipo_usuario: true } },
      },
      orderBy: { adicionado_em: "desc" },
    });
  },
};
