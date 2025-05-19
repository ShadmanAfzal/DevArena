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

      const currentProblem = useProblemsStore.getState().currentProblem;

      if (!currentProblem) return;

      const language = useEditorStore.getState().language as Language;

      const executionResponse = await executeExpression(
        currentProblem.id,
        expression,
        language
      );

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
