import { Request, Response } from "express";
import { ErrorType } from "../types/errorType.js";
import ProblemService from "../service/problem.js";
import { PrismaClient } from "@prisma/client/client";
import CodeExecutionService from "../service/codeExecution.js";
import { ExecutionResult } from "@dev-arena/shared";

const problemService = new ProblemService(new PrismaClient());

export const getAllProblems = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const questions = await problemService.getAllProblems(userId);

    res.status(200).json({ data: questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Failed to fetch questions", data: [] });
  }
};

export const getProblemById = async (req: Request, res: Response) => {
  try {
    const question = await problemService.getProblemById(
      req.params.id,
      req.userId
    );

    if (!question) {
      res.status(404).json({ error: "Question not found", data: null });
      return;
    }

    res.status(200).json({ data: question });
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ error: "Failed to fetch question", data: null });
  }
};

export const getProblemBySlug = async (req: Request, res: Response) => {
  try {
    const questionId = await problemService.getProblemIdFromSlug(
      req.params.slug
    );

    if (!questionId) {
      res.status(404).json({ error: "Question not found", data: null });
      return;
    }
    const question = await problemService.getProblemById(
      questionId,
      req.userId
    );

    res.status(200).json({ data: question });
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ error: "Failed to fetch question", data: null });
  }
};

export const runProblemTestCases = async (req: Request, res: Response) => {
  try {
    const problem = await problemService.getProblemWithTestCases(req.params.id);

    if (problem === null) {
      res.status(404).json({
        error: "Problem not found",
        errorType: ErrorType.PROBLEM_NOT_FOUND,
      });
      return;
    }

    const finalResult: ExecutionResult[] = [];

    for (const testCase of problem.testCases) {
      const codeExectionService = new CodeExecutionService(
        Buffer.from(req.body.code, "base64").toString("utf-8"),
        req.body.language,
        testCase,
        problem.functionName
      );

      const result = await codeExectionService.execute();

      if (result.errorType) {
        finalResult.push({
          input: testCase.input,
          output: testCase.output,
          isCorrect: false,
          error: result.message,
          errorType: result.errorType,
        });

        continue;
      }

      finalResult.push({
        input: testCase.input,
        output: testCase.output,
        userOutput: result.data.output,
        isCorrect: result.data.output === testCase.output,
        stdOut: result.data.stdOut,
      });
    }

    const isAllCorrect = finalResult.every(
      (result) => result.isCorrect === true
    );

    if (req.userId) {
      await problemService.markProblemAsSolvedOrAttempted(
        req.params.id,
        req.userId,
        isAllCorrect,
        Buffer.from(req.body.code, "base64").toString("utf-8"),
        req.body.language
      );
    }

    res.json({ isAllCorrect, result: finalResult });
  } catch (error) {
    console.error("Error executing expression:", error);
    res.status(500).json({
      error: "Invalid expression",
      errorType: ErrorType.EXECUTION_ERROR,
    });
  }
};
