-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "isRest" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "timeLimitS" INTEGER;
