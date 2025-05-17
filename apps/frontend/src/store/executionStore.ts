import { create } from "zustand";
import { executeExpression } from "../api/execute";
import { useEditorStore } from "./editorStore";
import { Language } from "@dev-arena/shared";
import { useProblemsStore } from "./problemStore";

type ExecutionStoreType = {
  output: string;
  stdOutput: string[];
  error?: string;
  errorType?: string;
  isLoading: boolean;
  isSubmitted: boolean;
  execute: (expression: string) => Promise<void>;
};

export const useExecutionStore = create<ExecutionStoreType>((set) => {
  return {
    output: "",
    error: undefined,
    errorType: undefined,
    isLoading: false,
    isSubmitted: false,
    stdOutput: [],
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

      if (executionResponse?.errorType) {
        return set({
          isSubmitted: true,
          error: executionResponse.error,
          errorType: executionResponse.errorType,
          isLoading: false,
          output: undefined,
          stdOutput: [],
        });
      }

      return set({
        isSubmitted: true,
        output: executionResponse?.data?.output ?? "No output",
        stdOutput: executionResponse?.data?.stdOut ?? [],
        error: undefined,
        errorType: undefined,
        isLoading: false,
      });
    },
  };
});
