/*
  Warnings:

  - You are about to drop the column `countCompleted` on the `Workout` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "betweenSetsRestTimeLimitS" INTEGER;

-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "countCompleted";
