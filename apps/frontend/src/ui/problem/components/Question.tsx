import { twMerge } from "tailwind-merge";
import {
  ProblemDifficulty,
  useProblemsStore,
} from "../../../store/problemStore";
import { CheckCircle2Icon } from "lucide-react";

export const Question = () => {
  const problem = useProblemsStore((state) => state.currentProblem);

  if (!problem) return null;

  return (
    <div className="bg-card rounded-2xl ml-4 mb-4 mr-1.5 w-[50%] p-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
      <div className="flex flex-row items-center justify-between">
        <div className="text-xl">{problem.title}</div>
        {problem.solved && (
          <CheckCircle2Icon className="text-green-500" size={18} />
        )}
      </div>
      <div>
        <span
          className={twMerge(
            "capitalize bg-white/5 px-2 py-1 rounded-full text-sm",
            problem.problemDifficulty === ProblemDifficulty.EASY &&
              "text-green-500",
            problem.problemDifficulty === ProblemDifficulty.MEDIUM &&
              "text-yellow-400",
            problem.problemDifficulty === ProblemDifficulty.HARD &&
              "text-red-500"
          )}
        >
          {problem.problemDifficulty.toLocaleLowerCase()}
        </span>
      </div>
      <div>{problem.description}</div>
      <div className="flex flex-col gap-2">
        {problem.examples?.map((example, index) => {
          return (
            <div key={index} className="flex flex-col gap-2">
              <div className="font-bold">Example {index + 1}:</div>
              <div className="flex flex-col gap-2 bg-white/5 p-3 rounded-lg">
                <div className="flex flex-row gap-2">
                  <div className="font-bold">Input:</div>
                  <div className="text-white">{example.Input}</div>
                </div>
                <div className="flex flex-row gap-2">
                  <div className="font-bold">Output:</div>
                  <div className="text-white">{example.Output}</div>
                </div>
                <div className="flex flex-row gap-2">
                  <div className="font-bold">Explanation:</div>
                  <div className="text-white">{example.Explanation}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
