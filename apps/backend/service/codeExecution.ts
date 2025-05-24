import { spawn } from "child_process";
import path from "path";
import os from "os";
import fs from "fs";
import Mustache from "mustache";

import { ErrorType } from "../types/errorType.js";
import { Language } from "@dev-arena/shared";
import { TestCase } from "@prisma/client";

import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  private uuid: string = crypto.randomUUID();
  private extensionLookup: Record<Language, string> = {
    [Language.JAVASCRIPT]: "js",
    [Language.TYPESCRIPT]: "ts",
    [Language.PYTHON]: "py",
  };

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

  private getTemplatePath(): string {
    switch (this.language) {
      case Language.JAVASCRIPT:
      case Language.TYPESCRIPT:
        return path.join(__dirname, "../../templates/node.mustache");

      case Language.PYTHON:
        return path.join(__dirname, "../../templates/python.mustache");

      default:
        throw new Error(`Unsupported language: ${this.language}`);
    }
  }

  private completeCode(): string {
    const templatePath = this.getTemplatePath();

    const template = fs.readFileSync(templatePath, "utf-8");

    return Mustache.render(template, {
      code: this.code,
      functionName: this.functionName,
      input: this.testCases.input,
      uuid: this.uuid,
    }).trim();
  }

  private cleanup(data: string): string {
    return data
      .replace(/\x1B\[[0-9;]*[mK]/g, "")
      .replace(/[\r\n]+/g, " ")
      .replace(/(?<=\S) +/g, " ");
  }

  private cleanError(data: string): string {
    return data.replace(/\x1B\[[0-9;]*[mK]/g, "").replace(/(?<=\S) +/g, " ");
  }

  private createTempFile() {
    const tempFile = path.join(
      os.tmpdir(),
      `solution.${this.extensionLookup[this.language]}`
    );
    fs.writeFileSync(tempFile, this.completeCode());
    return tempFile;
  }

  private getChildProcess() {
    const file = this.createTempFile();
    const fileName = path.basename(file);
    const containerPath = `/workspace/${fileName}`;

    const baseArgs = [
      "run",
      "--rm",
      "-v",
      `${file}:${containerPath}`,
      "dev-arena-executor",
    ];

    if (this.language === Language.JAVASCRIPT) {
      return spawn("docker", [...baseArgs, "node", containerPath]);
    }

    if (this.language === Language.TYPESCRIPT) {
      return spawn("docker", [...baseArgs, "tsx", containerPath]);
    }

    if (this.language === Language.PYTHON) {
      return spawn("docker", [...baseArgs, "python3", containerPath]);
    }

    throw new Error("Unsupported language");
  }

  private extractResult(codeOutputs: string[]) {
    let output = "";
    let stdOut: string[] = [];
    for (const line of codeOutputs) {
      if (line.includes(this.uuid)) {
        output = line
          .split(this.uuid)[1]
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
          message: this.cleanError(data),
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
