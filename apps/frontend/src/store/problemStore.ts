import { create } from "zustand";
import { getAllProblems, getProblemBySlug } from "../api/problem";
import { useExecutionStore } from "./executionStore";
import { Language, UserSubmission } from "@dev-arena/shared";
import { useEditorStore } from "./editorStore";

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
  userSubmission?: UserSubmission;
};

type ProblemStoreType = {
  isLoading: boolean;
  error?: string;
  problems: ProblemType[];
  currentProblem?: ProblemType;
  fetchProblemBySlug: (slug: string) => void;
  fetchProblems: () => void;
  markProblemAsSolved: () => void;
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

      const editorStore = useEditorStore.getState();

      if (response.error) {
        return set({ error: response.error, isLoading: false });
      }

      if (response?.data?.userSubmission) {
        editorStore.setInitialCode(response.data.userSubmission.codeSubmission);
        editorStore.changeLanguage(
          response.data.userSubmission.language as Language
        );
      } else {
        editorStore.setInitialCode(
          response.data?.initialCode ?? 'console.log("Hello World")'
        );
      }

      return set({ currentProblem: response.data, isLoading: false });
    },
    markProblemAsSolved: async () =>
      set((prev) => {
        if (!prev.currentProblem) return prev;

        if (!prev.currentProblem.userSubmission) return prev;

        return {
          currentProblem: {
            ...prev.currentProblem,
            userSubmission: {
              ...prev.currentProblem.userSubmission,
              isSolved: true,
            },
          },
        };
      }),
  };
});
