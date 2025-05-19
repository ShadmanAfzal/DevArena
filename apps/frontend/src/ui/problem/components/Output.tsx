import { DotIcon, LoaderCircle } from "lucide-react";
import { useExecutionStore } from "../../../store/executionStore";
import { useProblemsStore } from "../../../store/problemStore";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

type OutputPropsType = {
  handleSubmit: () => void;
};

const Output = ({ handleSubmit }: OutputPropsType) => {
  const [currentTestCase, setCurrentTestCase] = useState(0);

  const problem = useProblemsStore((state) => state.currentProblem);

  const { isLoading, isSubmitted, result, isAllCorrect } = useExecutionStore(
    (state) => state
  );

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
                        result[index].isCorrect
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
        <div className="flex flex-col gap-1">
          <div className="text-white/75">Input:</div>
          <div className="bg-white/8 py-2 px-3 rounded-lg customFont">
            {problem?.testCases?.at(currentTestCase)?.input}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-white/75">Expected Output:</div>
          <div className="bg-white/8 py-2 px-3 rounded-lg customFont">
            {problem?.testCases?.at(currentTestCase)?.output}
          </div>
        </div>
        {isSubmitted && !isLoading ? (
          result[currentTestCase].error ? (
            <div className="flex flex-col gap-1">
              <div className="text-white/75">Runtime Error:</div>
              <div className="bg-[#f8615c14] py-2 px-3 rounded-lg break-words text-red-500">
                <pre className="whitespace-pre-wrap break-words overflow-x-auto max-w-full">
                  {result[currentTestCase].error}
                </pre>
              </div>
            </div>
          ) : (
            <>
              {result[currentTestCase].stdOut?.length ? (
                <div className="flex flex-col gap-1">
                  <div className="text-white/75">Stdout:</div>
                  <div className="bg-white/8 py-2 px-3 rounded-lg customFont break-words">
                    <pre className="whitespace-pre-wrap break-words overflow-x-auto max-w-full">
                      {result[currentTestCase].stdOut?.join("\n")}
                    </pre>
                  </div>
                </div>
              ) : null}
              <div className="flex flex-col gap-1">
                <div className="text-white/75">Actual Output:</div>
                <div className="bg-white/8 py-2 px-3 rounded-lg customFont break-words">
                  {result[currentTestCase].userOutput}
                </div>
              </div>
            </>
          )
        ) : null}
      </div>
    </div>
  );
};

export default Output;
