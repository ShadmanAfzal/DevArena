-- AlterTable
ALTER TABLE "AttemptedProblem" ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'javascript';

-- AlterTable
ALTER TABLE "SolvedProblem" ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'javascript';
