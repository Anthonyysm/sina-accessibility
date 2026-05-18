import { prisma } from "@/lib/prisma";

export const atividadeDbService = {
  async listar() {
    return prisma.atividade.findMany({
      include: {
        usuario: true,
        comentarios: true,
      },
      orderBy: { criado_em: "desc" },
    });
  },

  async buscarPorId(id: number) {
    return prisma.atividade.findUnique({
      where: { id_atividade: id },
      include: {
        usuario: true,
        comentarios: true,
      },
    });
  },

  async criar(data: {
    titulo: string;
    texto_original: string;
    criado_por: number;
    arquivo_url?: string;
    arquivo_nome?: string;
    arquivo_tipo?: string;
  }) {
    return prisma.atividade.create({
      data: {
        titulo: data.titulo,
        texto_original: data.texto_original,
        criado_por: data.criado_por,
        arquivo_url: data.arquivo_url ?? null,
        arquivo_nome: data.arquivo_nome ?? null,
        arquivo_tipo: data.arquivo_tipo ?? null,
      },
    });
  },

  async atualizar(id: number, data: any) {
    return prisma.atividade.update({
      where: { id_atividade: id },
      data,
    });
  },

  async deletar(id: number) {
    return prisma.atividade.delete({
      where: { id_atividade: id },
    });
  },
};
