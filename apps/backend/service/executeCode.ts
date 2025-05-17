import { spawn } from "child_process";
import path from "path";
import os from "os";
import fs from "fs";
import { ErrorType } from "../types/errorType.js";
import { Language } from "@dev-arena/shared";
import { TestCase } from "@prisma/client/client";

const TIMEOUT_MS = 2500;

type ExecutionResult =
  | {
      data: {
        output: string;
        stdOut: string[];
      };
      message?: string;
      errorType?: undefined;
    }
  | {
      errorType: ErrorType;
      message?: string;
      data?: undefined;
    };

const completeCode = (
  code: string,
  testCases: TestCase,
  functionName: string
): string => {
  return `${code}; console.log("code execution result", ${functionName}(${testCases.input}));`;
};

const extractResult = (codeOutputs: string[]) => {
  let output = "";
  let stdOut: string[] = [];

  for (const line of codeOutputs) {
    if (line.includes("code execution result")) {
      output = line
        .split("code execution result")[1]
        .replace(/'/g, '"')
        .replace(/\s+/g, "")
        .trim();
    } else {
      stdOut.push(line);
    }
  }

  return { output, stdOut };
};

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
      const tempFile = path.join(os.tmpdir(), `temp-${Date.now()}.ts`);
      fs.writeFileSync(tempFile, code);
      return spawn("ts-node", [tempFile]);
    default:
      throw new Error("Unsupported language");
  }
};

const executeCode = (
  code: string,
  language: Language,
  testCases: TestCase,
  functionName: string
): Promise<ExecutionResult> => {
  return new Promise((resolve, _) => {
    const output: string[] = [];

    const childProcess = getChildProcess(
      completeCode(code, testCases, functionName),
      language
    );

    const timer = setTimeout(() => {
      childProcess.kill();
      resolve({
        errorType: ErrorType.TIMEOUT,
        message: "Execution timed out",
      });
    }, TIMEOUT_MS);

    childProcess.stdout.setEncoding("utf-8");
    childProcess.stderr.setEncoding("utf-8");

    childProcess.stdout.on("data", (data) => {
      data
        .split("\n")
        .filter((chunk: any) => chunk.trim())
        .forEach((chunk: string) => output.push(cleanup(chunk)));
    });

    childProcess.stderr.on("data", (data) => {
      clearTimeout(timer);
      resolve({ errorType: ErrorType.EXECUTION_ERROR, message: cleanup(data) });
    });

    childProcess.on("close", (code) => {
      clearTimeout(timer);

      if (code)
        return resolve({
          errorType: ErrorType.EXECUTION_ERROR,
          message: "Process exited with code: " + code,
        });

      const { output: resultOutput, stdOut } = extractResult(output);

      resolve({
        data: {
          output: resultOutput,
          stdOut,
        },
      });
    });
  });
};

export default executeCode;
