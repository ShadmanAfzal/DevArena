import { create } from "zustand";
import Language from "../types/Language";
import { executeExpression } from "../api/execute";
import { useEditorStore } from "./editorStore";

type ExecutionStoreType = {
  result: string[];
  error?: string;
  errorType?: string;
  isLoading: boolean;
  isSubmitted: boolean;
  execute: (expression: string) => Promise<void>;
};

export const useExecutionStore = create<ExecutionStoreType>((set) => {
  return {
    result: [],
    error: undefined,
    errorType: undefined,
    isLoading: false,
    isSubmitted: false,
    execute: async (expression: string) => {
      set({ isLoading: true });

      const language = useEditorStore.getState().language as Language;

      const executionResponse = await executeExpression(expression, language);

      if (executionResponse?.errorType) {
        return set({
          isSubmitted: true,
          error: executionResponse.error,
          errorType: executionResponse.errorType,
          isLoading: false,
          result: [],
        });
      }

      return set({
        isSubmitted: true,
        result: executionResponse?.data,
        error: undefined,
        errorType: undefined,
        isLoading: false,
      });
    },
  };
});
