export type ExecutionResult = {
  input: string;
  output: string;
  isCorrect: boolean;
  userOutput?: string;
  stdOut?: string[];
  error?: string;
  errorType?: string;
};
