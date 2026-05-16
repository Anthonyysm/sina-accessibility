/*
  Warnings:

  - The primary key for the `usuarios` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `usuarios` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "atividades" DROP CONSTRAINT "atividades_criado_por_fkey";

-- AlterTable
ALTER TABLE "usuarios" DROP CONSTRAINT "usuarios_pkey",
DROP COLUMN "id",
ADD COLUMN     "id_usuario" SERIAL NOT NULL,
ALTER COLUMN "tipo_usuario" SET DATA TYPE TEXT,
ADD CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario");

-- CreateTable
CREATE TABLE "estudante_comentario" (
    "id_comentario" SERIAL NOT NULL,
    "id_atividade" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "comentario" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "estudante_comentario_pkey" PRIMARY KEY ("id_comentario")
);

-- CreateTable
CREATE TABLE "professor_estudante" (
    "id_professor" INTEGER NOT NULL,
    "id_estudante" INTEGER NOT NULL,
    "vinculado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "professor_estudante_pkey" PRIMARY KEY ("id_professor","id_estudante")
);

-- AddForeignKey
ALTER TABLE "atividades" ADD CONSTRAINT "atividades_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estudante_comentario" ADD CONSTRAINT "estudante_comentario_id_atividade_fkey" FOREIGN KEY ("id_atividade") REFERENCES "atividades"("id_atividade") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estudante_comentario" ADD CONSTRAINT "estudante_comentario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professor_estudante" ADD CONSTRAINT "professor_estudante_id_professor_fkey" FOREIGN KEY ("id_professor") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professor_estudante" ADD CONSTRAINT "professor_estudante_id_estudante_fkey" FOREIGN KEY ("id_estudante") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;
