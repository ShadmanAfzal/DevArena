import { Request, Response } from "express";
import {
  PrismaClient,
  Problem,
  ProblemExample,
  TestCase,
} from "@prisma/client";
import { Language } from "@dev-arena/shared";
import executeCode from "../service/executeCode.js";
import { ErrorType } from "../types/errorType.js";

const prisma = new PrismaClient();

type UserSpecificQuestion = Problem & {
  attempted?: boolean;
  solved?: boolean;
};

export const getAllProblems = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const questions: UserSpecificQuestion[] = await prisma.problem.findMany();

    if (userId) {
      const attemptedProblems = await prisma.attemptedProblem.findMany({
        where: { userId },
        select: { problemId: true },
      });

      const solvedProblems = await prisma.solvedProblem.findMany({
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

        return question;
      });
    }

    res.status(200).json({ data: questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Failed to fetch questions", data: [] });
  }
};

export const getProblemById = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const { id } = req.params;

    const question = (await prisma.problem.findUnique({
      where: { id },
      include: { testCases: true, examples: true },
    })) as Problem & {
      testCases: TestCase[];
      examples: ProblemExample[];
      attempted?: boolean;
      solved?: boolean;
      code?: string;
    };

    if (!question) {
      res.status(404).json({ error: "Question not found" });
      return;
    }

    if (userId) {
      const attemptedProblems = await prisma.attemptedProblem.findMany({
        where: { userId },
        select: { problemId: true, code: true },
      });

      const solvedProblems = await prisma.solvedProblem.findMany({
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
        question.code = attemptedProblem.code;
      } else {
        question.solved = true;
        question.code = solvedProblem?.code;
      }
    }

    res.status(200).json({ data: question });
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ error: "Failed to fetch question", data: null });
  }
};

export const getProblemBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const question = await prisma.problem.findFirst({
      where: { slug },
      include: { testCases: true, examples: true },
    });

    if (!question) {
      res.status(404).json({ error: `Question not found with slug ${slug}` });
      return;
    }

    res.status(200).json({ data: question });
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ error: "Failed to fetch question", data: null });
  }
};

export const runProblemTestCases = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const problem = await prisma.problem.findUnique({
      where: { id },
      include: { testCases: true },
    });

    if (!problem) {
      res.status(404).json({
        error: "Problem not found",
        errorType: ErrorType.PROBLEM_NOT_FOUND,
      });
      return;
    }

    const code = req.body.code;

    const language = req.body.language as Language;

    const expression = Buffer.from(code, "base64").toString("utf-8");

    const result = await executeCode(
      expression,
      language,
      problem.testCases[0],
      problem.functionName
    );

    if (result.errorType) {
      res.status(500).json({
        error: result.message,
        errorType: result.errorType,
      });
      return;
    }

    res.json({
      data: {
        output: result.data.output,
        stdOut: result.data.stdOut,
        isCorrect: result.data.output === problem.testCases[0].output,
      },
    });
  } catch (error) {
    console.error("Error executing expression:", error);
    res.status(500).json({
      error: "Invalid expression",
      errorType: ErrorType.EXECUTION_ERROR,
    });
  }
};
