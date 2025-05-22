import { DotIcon, LoaderCircle } from "lucide-react";
import { useExecutionStore } from "../../../../store/executionStore";
import { useProblemsStore } from "../../../../store/problemStore";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import OutputRow from "./row";

type OutputPropsType = {
  handleSubmit: () => void;
};

const Output = ({ handleSubmit }: OutputPropsType) => {
  const [currentTestCase, setCurrentTestCase] = useState(0);

  const problem = useProblemsStore((state) => state.currentProblem);

  const { isLoading, isSubmitted, result, isAllCorrect, error } =
    useExecutionStore((state) => state);

  const handleTestCaseClick = (index: number) => {
    setCurrentTestCase(index);
  };

  return (
    <div className="h-[40%] bg-card mr-4 mt-1.5 mb-4 ml-1 rounded-2xl p-4 custom-scrollbar overflow-y-auto">
      {isSubmitted && (
        <div
          className={twMerge(
            "mx-1 text-xl mb-3",
            isAllCorrect ? "text-green-500" : "text-red-500"
          )}
        >
          {isAllCorrect ? "Correct Answer" : "Wrong Answer"}
        </div>
      )}
      <div className="flex flex-row items-center justify-between">
        <div>
          {problem?.testCases.map((_, index) => {
            return (
              <button
                key={index}
                className={twMerge(
                  "h-max mx-1 rounded-lg cursor-pointer hover:bg-white/8 text-sm transition-all duration-200 ease-in-out",
                  currentTestCase === index && "bg-white/8"
                )}
                onClick={() => handleTestCaseClick(index)}
              >
                <span className="flex flex-row items-center justify-center">
                  {isSubmitted ? (
                    <DotIcon
                      size={30}
                      className={twMerge(
                        result[index]?.isCorrect
                          ? "text-green-500"
                          : "text-red-500"
                      )}
                    />
                  ) : null}
                  <span
                    className={twMerge("pr-2 py-1", !isSubmitted && "pl-2")}
                  >
                    Case {index + 1}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex flex-row items-center gap-2">
          {isLoading ? (
            <LoaderCircle className="animate-spin" size="16" />
          ) : (
            <button className="cursor-pointer" onClick={handleSubmit}>
              Submit
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 my-4">
        <OutputRow
          label="Input"
          data={problem?.testCases?.at(currentTestCase)?.input ?? ""}
        />
        <OutputRow
          label="Expected Output"
          data={problem?.testCases?.at(currentTestCase)?.output ?? ""}
        />
        {isSubmitted && !isLoading ? (
          error ? (
            <OutputRow
              label="Runtime Error"
              data={error?.message}
              isError
              preserveIndentation
            />
          ) : result[currentTestCase].error ? (
            <OutputRow
              label="Runtime Error"
              data={result[currentTestCase].error}
              isError
              preserveIndentation
            />
          ) : (
            <>
              {result[currentTestCase].stdOut?.length ? (
                <OutputRow
                  label="Stdout"
                  data={result[currentTestCase].stdOut?.join("\n")}
                  preserveIndentation
                />
              ) : null}
              <OutputRow
                preserveIndentation
                label="Actual Output"
                data={result[currentTestCase].userOutput ?? "No output"}
              />
            </>
          )
        ) : null}
      </div>
    </div>
  );
};

export default Output;
