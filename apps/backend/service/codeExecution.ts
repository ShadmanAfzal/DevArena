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

class CodeExecutionService {
  private code: string;
  private language: Language;
  private testCases: TestCase;
  private functionName: string;

  constructor(
    code: string,
    language: Language,
    testCases: TestCase,
    functionName: string
  ) {
    this.code = code;
    this.language = language;
    this.testCases = testCases;
    this.functionName = functionName;
  }

  private completeCode(): string {
    return `${this.code}; console.log("code execution result", ${this.functionName}(${this.testCases.input}));`;
  }

  private cleanup(data: string): string {
    return data
      .replace(/\x1B\[[0-9;]*[mK]/g, "")
      .replace(/[\r\n]+/g, " ")
      .replace(/(?<=\S) +/g, " ");
  }

  private getChildProcess() {
    switch (this.language) {
      case Language.JAVASCRIPT:
        return spawn("node", ["-e", this.completeCode()]);
      case Language.TYPESCRIPT:
        const tempFile = path.join(os.tmpdir(), `temp-${Date.now()}.ts`);
        fs.writeFileSync(tempFile, this.completeCode());
        return spawn("ts-node", [tempFile]);
      default:
        throw new Error("Unsupported language");
    }
  }

  private extractResult(codeOutputs: string[]) {
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
  }

  async execute(): Promise<ExecutionResult> {
    return new Promise((resolve, _) => {
      const output: string[] = [];

      const childProcess = this.getChildProcess();

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
          .forEach((chunk: string) => output.push(this.cleanup(chunk)));
      });

      childProcess.stderr.on("data", (data) => {
        clearTimeout(timer);
        resolve({
          errorType: ErrorType.EXECUTION_ERROR,
          message: this.cleanup(data),
        });
      });

      childProcess.on("close", (code) => {
        clearTimeout(timer);

        if (code)
          return resolve({
            errorType: ErrorType.EXECUTION_ERROR,
            message: "Process exited with code: " + code,
          });

        const { output: resultOutput, stdOut } = this.extractResult(output);

        resolve({
          data: {
            output: resultOutput,
            stdOut,
          },
        });
      });
    });
  }
}

export default CodeExecutionService;
