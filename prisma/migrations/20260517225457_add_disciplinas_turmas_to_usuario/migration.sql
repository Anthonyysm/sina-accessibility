-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "disciplinas" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "turmas" TEXT[] DEFAULT ARRAY[]::TEXT[];
