-- AlterTable
ALTER TABLE "atividades" ADD COLUMN     "data_entrega" TIMESTAMP(3),
ADD COLUMN     "id_turma" INTEGER;

-- CreateTable
CREATE TABLE "turmas" (
    "id_turma" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "descricao" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "criado_por" INTEGER NOT NULL,

    CONSTRAINT "turmas_pkey" PRIMARY KEY ("id_turma")
);

-- CreateTable
CREATE TABLE "turma_aluno" (
    "id_turma" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "adicionado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "turma_aluno_pkey" PRIMARY KEY ("id_turma","id_usuario")
);

-- CreateTable
CREATE TABLE "agendamentos" (
    "id_agendamento" SERIAL NOT NULL,
    "titulo" VARCHAR(150) NOT NULL,
    "descricao" TEXT,
    "data" TIMESTAMP(3) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "criado_por" INTEGER NOT NULL,
    "id_atividade" INTEGER,

    CONSTRAINT "agendamentos_pkey" PRIMARY KEY ("id_agendamento")
);

-- AddForeignKey
ALTER TABLE "turmas" ADD CONSTRAINT "turmas_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turma_aluno" ADD CONSTRAINT "turma_aluno_id_turma_fkey" FOREIGN KEY ("id_turma") REFERENCES "turmas"("id_turma") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turma_aluno" ADD CONSTRAINT "turma_aluno_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atividades" ADD CONSTRAINT "atividades_id_turma_fkey" FOREIGN KEY ("id_turma") REFERENCES "turmas"("id_turma") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_id_atividade_fkey" FOREIGN KEY ("id_atividade") REFERENCES "atividades"("id_atividade") ON DELETE SET NULL ON UPDATE CASCADE;
