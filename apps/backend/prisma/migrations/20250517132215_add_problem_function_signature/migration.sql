/*
  Warnings:

  - Made the column `initialCode` on table `Problem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "functionSignature" TEXT NOT NULL DEFAULT 'main',
ALTER COLUMN "initialCode" SET NOT NULL;
