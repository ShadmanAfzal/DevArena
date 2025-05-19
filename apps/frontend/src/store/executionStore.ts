import { create } from "zustand";
import { executeExpression } from "../api/execute";
import { useEditorStore } from "./editorStore";
import { ExecutionResult, Language } from "@dev-arena/shared";
import { useProblemsStore } from "./problemStore";

type ExecutionStoreType = {
  isAllCorrect: boolean;
  result: ExecutionResult[];
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
      set({ isLoading: true });

      const problemStore = useProblemsStore.getState();

      if (!problemStore.currentProblem) return;

      const language = useEditorStore.getState().language as Language;

      const executionResponse = await executeExpression(
        problemStore.currentProblem.id,
        expression,
        language
      );

      if (executionResponse.isAllCorrect) {
        problemStore.markProblemAsSolved();
      }

      set({
        isAllCorrect: executionResponse.isAllCorrect,
        result: executionResponse.result,
        isLoading: false,
        isSubmitted: true,
      });
    },
    resetExecutionState: () => {
      set({
        isLoading: false,
        isSubmitted: false,
      });
    },
  };
});
