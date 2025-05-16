import { spawn } from "child_process";
import { ErrorType } from "../types/errorType.js";
import { Language } from "@dev-arena/shared";

const timeout = 2500;

type ExecutionResult = {
  data?: string[];
  message?: string;
  errorType?: ErrorType;
} & (
  | { data: string[]; errorType?: undefined }
  | { errorType: ErrorType; data?: undefined }
);

const cleanup = (data: string): string => {
  return data
    .replace(/\x1B\[[0-9;]*[mK]/g, "")
    .replace(/[\r\n]+/g, " ")
    .replace(/(?<=\S) +/g, " ");
};

const getChildProcess = (code: string, language: Language) => {
  switch (language) {
    case Language.JAVASCRIPT:
      return spawn("node", ["-e", code]);
    case Language.TYPESCRIPT:
      return spawn("ts-node", ["-e", code]);
    default:
      throw new Error("Unsupported language");
  }
};

const executeCode = (
  code: string,
  language: Language
): Promise<ExecutionResult> => {
  return new Promise((resolve, _) => {
    const output: string[] = [];

    const childProcess = getChildProcess(code, language);

    const timer = setTimeout(() => {
      childProcess.kill();
      resolve({
        errorType: ErrorType.TIMEOUT,
        message: "Execution timed out",
      });
    }, timeout);

    childProcess.stdout.setEncoding("utf-8");
    childProcess.stderr.setEncoding("utf-8");

    childProcess.stdout.on("data", (data) => {
      const chunks = data.split("\n");
      chunks.forEach((chunk: string) => {
        if (!chunk.trim()) return;
        output.push(cleanup(chunk));
      });
    });

    childProcess.stderr.on("data", (data) => {
      resolve({ errorType: ErrorType.EXECUTION_ERROR, message: cleanup(data) });
    });

    childProcess.on("close", (code) => {
      clearTimeout(timer);

      if (code)
        return resolve({
          errorType: ErrorType.EXECUTION_ERROR,
          message: "Process exited with code: " + code,
        });

      resolve({ data: output });
    });
  });
};

export default executeCode;
