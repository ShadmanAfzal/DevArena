import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllProblems = async (req: Request, res: Response) => {
  try {
    const questions = await prisma.problem.findMany();
    res.status(200).json({ data: questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Failed to fetch questions", data: [] });
  }
};

export const getProblemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const question = await prisma.problem.findFirst({
      where: { id },
      include: { testCases: true, examples: true },
    });

    if (!question) {
      res.status(404).json({ error: "Question not found" });
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
