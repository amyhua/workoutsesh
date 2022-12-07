/*
  Warnings:

  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Sesh` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sesh" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "username";

-- AddForeignKey
ALTER TABLE "Sesh" ADD CONSTRAINT "Sesh_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
