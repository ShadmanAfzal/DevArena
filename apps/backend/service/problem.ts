import {
  PrismaClient,
  Problem,
  ProblemExample,
  TestCase,
} from "@prisma/client/client";

type UserSpecificQuestion = Problem & {
  attempted?: boolean;
  solved?: boolean;
};

type UserSpecificQuestionWithTestCases = Problem & {
  testCases: TestCase[];
  examples: ProblemExample[];
  attempted?: boolean;
  solved?: boolean;
  userCode?: string;
};

class ProblemService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAllProblems(userId?: string): Promise<UserSpecificQuestion[]> {
    const questions: UserSpecificQuestion[] =
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
  ): Promise<UserSpecificQuestionWithTestCases | null> {
    const question: UserSpecificQuestionWithTestCases | null =
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
        select: { problemId: true, code: true },
      });

      const solvedProblems = await this.prisma.solvedProblem.findMany({
        where: { userId },
        select: { problemId: true, code: true },
      });

      const attemptedProblem = attemptedProblems.find(
        (q) => q.problemId === question.id
      );
      const solvedProblem = solvedProblems.find(
        (q) => q.problemId === question.id
      );

      if (attemptedProblem) {
        question.attempted = true;
        question.userCode = attemptedProblem.code;
      }

      if (solvedProblem) {
        question.solved = true;
        question.userCode = solvedProblem?.code;
      }

      console.log("question", question);
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
    code: string
  ) {
    try {
      const attemptedProblemObj = {
        code,
        problemId,
        userId,
      };

      if (isSolved) {
        return await this.prisma.solvedProblem.create({
          data: {
            ...attemptedProblemObj,
            solvedAt: new Date(),
          },
        });
      }

      return await this.prisma.attemptedProblem.create({
        data: {
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
