import { create } from "zustand";
import { executeExpression } from "../api/execute";
import { useEditorStore } from "./editorStore";
import { ExecutionResult, Language } from "@dev-arena/shared";
import { useProblemsStore } from "./problemStore";

type ExecutionStoreType = {
  isAllCorrect: boolean;
  result: ExecutionResult[];
  error?: {
    message: string;
    errorType: string;
  };
  isLoading: boolean;
  isSubmitted: boolean;
  execute: (expression: string) => Promise<void>;
  resetExecutionState: () => void;
};

export const useExecutionStore = create<ExecutionStoreType>((set) => {
  return {
    isAllCorrect: false,
    result: [],
    isLoading: false,
    isSubmitted: false,
    execute: async (expression: string) => {
      set({
        isLoading: true,
        result: [],
        isSubmitted: false,
        error: undefined,
      });

      const problemStore = useProblemsStore.getState();

      if (!problemStore.currentProblem) return;

      const language = useEditorStore.getState().language as Language;

      const executionResponse = await executeExpression(
        problemStore.currentProblem.id,
        expression,
        language
      );

      if (executionResponse.error) {
        set({
          isAllCorrect: false,
          isLoading: false,
          isSubmitted: true,
          result: [],
          error: executionResponse.error,
        });

        return;
      }

      if (executionResponse.data?.isAllCorrect) {
        problemStore.markProblemAsSolved();
      }

      set({
        error: undefined,
        isAllCorrect: executionResponse.data?.isAllCorrect ?? false,
        result: executionResponse.data?.result ?? [],
        isLoading: false,
        isSubmitted: true,
      });
    },
    resetExecutionState: () => {
      set({
        error: undefined,
        isAllCorrect: false,
        result: undefined,
        isLoading: false,
        isSubmitted: false,
      });
    },
  };
});
