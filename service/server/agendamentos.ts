import { prisma } from "@/lib/prisma";

export const agendamentoDbService = {
  async listar(criadoPor?: number) {
    const where = criadoPor ? { criado_por: criadoPor } : {};
    return prisma.agendamento.findMany({
      where,
      include: {
        criador: { select: { id_usuario: true, nome: true } },
        atividade: { select: { id_atividade: true, titulo: true } },
      },
      orderBy: { data: "asc" },
    });
  },

  async buscarPorId(id: number) {
    return prisma.agendamento.findUnique({
      where: { id_agendamento: id },
      include: {
        criador: { select: { id_usuario: true, nome: true } },
        atividade: true,
      },
    });
  },

  async criar(data: {
    titulo: string;
    descricao?: string;
    data: Date;
    criado_por: number;
    id_atividade?: number;
  }) {
    return prisma.agendamento.create({ data });
  },

  async atualizar(id: number, data: {
    titulo?: string;
    descricao?: string;
    data?: Date;
    id_atividade?: number | null;
  }) {
    return prisma.agendamento.update({ where: { id_agendamento: id }, data });
  },

  async deletar(id: number) {
    return prisma.agendamento.delete({ where: { id_agendamento: id } });
  },

  async listarPorPeriodo(criadoPor: number, inicio: Date, fim: Date) {
    return prisma.agendamento.findMany({
      where: {
        criado_por: criadoPor,
        data: { gte: inicio, lte: fim },
      },
      include: {
        atividade: { select: { id_atividade: true, titulo: true } },
      },
      orderBy: { data: "asc" },
    });
  },
};
