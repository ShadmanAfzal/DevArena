import { Language, UserSubmission } from "@dev-arena/shared";
import {
  PrismaClient,
  Problem,
  ProblemExample,
  TestCase,
} from "@prisma/client/client";

type ProblemWithUserSubmission = Problem &
  Omit<UserSubmission, "codeSubmission" | "language">;

type UserSubmissionWithTestCases = Problem & {
  testCases: TestCase[];
  examples: ProblemExample[];
  userSubmission?: UserSubmission;
};

class ProblemService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAllProblems(userId?: string): Promise<ProblemWithUserSubmission[]> {
    const questions: ProblemWithUserSubmission[] =
      await this.prisma.problem.findMany();

    if (userId) {
      const attemptedProblems = await this.prisma.attemptedProblem.findMany({
        where: { userId },
        select: { problemId: true },
      });

      const solvedProblems = await this.prisma.solvedProblem.findMany({
        where: { userId },
        select: { problemId: true },
      });

      questions.map((question) => {
        if (attemptedProblems.find((q) => q.problemId === question.id)) {
          question.attempted = true;
        }

        if (solvedProblems.find((q) => q.problemId === question.id)) {
          question.solved = true;
        }
      });
    }

    return questions;
  }

  async getProblemIdFromSlug(slug: string): Promise<string | null> {
    const question: Problem | null = await this.prisma.problem.findUnique({
      where: { slug },
    });

    if (!question) {
      return null;
    }

    return question.id;
  }

  async getProblemById(
    problemId: string,
    userId?: string
  ): Promise<UserSubmissionWithTestCases | null> {
    const question: UserSubmissionWithTestCases | null =
      await this.prisma.problem.findUnique({
        where: { id: problemId },
        include: { testCases: true, examples: true },
      });

    if (!question) {
      return null;
    }

    if (userId) {
      const attemptedProblems = await this.prisma.attemptedProblem.findMany({
        where: { userId },
        select: { problemId: true, code: true, language: true },
      });

      const solvedProblems = await this.prisma.solvedProblem.findMany({
        where: { userId },
        select: { problemId: true, code: true, language: true },
      });

      const attemptedProblem = attemptedProblems.find(
        (q) => q.problemId === question.id
      );
      const solvedProblem = solvedProblems.find(
        (q) => q.problemId === question.id
      );

      if (attemptedProblem) {
        question.userSubmission = {
          codeSubmission: attemptedProblem?.code,
          attempted: true,
          solved: false,
          language: attemptedProblem?.language,
        };
      }

      if (solvedProblem) {
        question.userSubmission = {
          codeSubmission: solvedProblem?.code,
          attempted: false,
          solved: true,
          language: solvedProblem?.language,
        };
      }
    }

    return question;
  }

  async getProblemWithTestCases(
    prolemId: string
  ): Promise<(Problem & { testCases: TestCase[] }) | null> {
    const question = await this.prisma.problem.findUnique({
      where: { id: prolemId },
      include: { testCases: true },
    });

    if (!question) {
      return null;
    }

    return question;
  }

  async markProblemAsSolvedOrAttempted(
    problemId: string,
    userId: string,
    isSolved: boolean,
    code: string,
    language: Language
  ) {
    try {
      const attemptedProblemObj = {
        code,
        problemId,
        userId,
        language,
      };

      if (isSolved) {
        return await this.prisma.solvedProblem.upsert({
          where: {
            userId_problemId: {
              problemId: problemId,
              userId: userId,
            },
          },
          update: {
            ...attemptedProblemObj,
            solvedAt: new Date(),
          },
          create: {
            ...attemptedProblemObj,
            solvedAt: new Date(),
          },
        });
      }

      return await this.prisma.attemptedProblem.upsert({
        where: {
          userId_problemId: {
            problemId: problemId,
            userId: userId,
          },
        },
        update: {
          ...attemptedProblemObj,
          attemptedAt: new Date(),
        },
        create: {
          ...attemptedProblemObj,
          attemptedAt: new Date(),
        },
      });
    } catch (error) {
      console.error("Error marking problem as solved or attempted", error);
    }
  }
}

export default ProblemService;
