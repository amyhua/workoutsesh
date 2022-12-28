-- AlterTable
ALTER TABLE "Sesh" ADD COLUMN     "orderedExerciseIds" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "pausedExerciseId" INTEGER;
