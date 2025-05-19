import { create } from "zustand";
import { getAllProblems, getProblemBySlug } from "../api/problem";
import { useExecutionStore } from "./executionStore";

export enum ProblemDifficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

export type ProblemExample = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  Input: string;
  Output: string;
  Explanation: string;
};

export type ProblemTestCase = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  input: string;
  output: string;
};

export type ProblemType = {
  id: string;
  title: string;
  slug: string;
  problemDifficulty: ProblemDifficulty;
  topics: string[];
  createdAt: string;
  updatedAt: string;
  initialCode: string;
  description: string;
  examples: ProblemExample[];
  testCases: ProblemTestCase[];
  attempted?: boolean;
  solved?: boolean;
  userCode?: string;
};

type ProblemStoreType = {
  isLoading: boolean;
  error?: string;
  problems: ProblemType[];
  currentProblem?: ProblemType;
  fetchProblemBySlug: (slug: string) => void;
  fetchProblems: () => void;
};

export const useProblemsStore = create<ProblemStoreType>((set) => {
  return {
    isLoading: false,
    problems: [],
    fetchProblems: async () => {
      set({ isLoading: true });

      const response = await getAllProblems();

      if (response.error) {
        return set({ error: response.error, isLoading: false });
      }

      return set({ problems: response.data, isLoading: false });
    },
    fetchProblemBySlug: async (slug: string) => {
      set({ isLoading: true, currentProblem: undefined });

      useExecutionStore.getState().resetExecutionState();

      const response = await getProblemBySlug(slug);

      if (response.error) {
        return set({ error: response.error, isLoading: false });
      }

      return set({ currentProblem: response.data, isLoading: false });
    },
  };
});
