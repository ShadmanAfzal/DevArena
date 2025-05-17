import { LoaderCircle } from "lucide-react";
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

  const { isLoading, error, isSubmitted, output, stdOutput } =
    useExecutionStore((state) => state);

  const handleTestCaseClick = (index: number) => {
    setCurrentTestCase(index);
  };

  return (
    <div className="h-[40%] bg-card mr-4 mt-1.5 mb-4 ml-1 rounded-2xl p-4 custom-scrollbar overflow-y-auto">
      <div className="flex flex-row items-center justify-between">
        <div>
          {problem?.testCases.map((_, index) => {
            return (
              <button
                key={index}
                className={twMerge(
                  "h-max px-2 py-1.5 mx-0.5 rounded-lg cursor-pointer hover:bg-white/8 text-sm transition-all duration-200 ease-in-out",
                  currentTestCase === index && "bg-white/8"
                )}
                onClick={() => handleTestCaseClick(index)}
              >
                Case {index + 1}
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
          <div className="bg-white/8 py-2 px-3 rounded-lg">
            {problem?.testCases?.at(currentTestCase)?.input}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-white/75">Expected Output:</div>
          <div className="bg-white/8 py-2 px-3 rounded-lg">
            {problem?.testCases?.at(currentTestCase)?.output}
          </div>
        </div>

        {isSubmitted && !isLoading ? (
          error ? (
            <div className="flex flex-col gap-1">
              <div className="text-white/75">Runtime Error:</div>
              <div className="bg-[#f8615c14] py-2 px-3 rounded-lg break-words text-red-500">
                {error}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {stdOutput.length ? (
                <>
                  <div className="text-white/75">Stdout:</div>
                  <div className="bg-white/8 py-2 px-3 rounded-lg break-words">
                    {stdOutput.join("\n")}
                  </div>
                </>
              ) : null}
              <>
                <div className="text-white/75">Actual Output:</div>
                <div className="bg-white/8 py-2 px-3 rounded-lg break-words">
                  {output}
                </div>
              </>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
};

export default Output;
