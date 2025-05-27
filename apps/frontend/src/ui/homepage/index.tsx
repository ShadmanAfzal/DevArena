import { useEffect } from "react";
import { ProblemDifficulty, useProblemsStore } from "../../store/problemStore";
import { Link } from "react-router";
import { twMerge } from "tailwind-merge";
import { Check, Circle } from "lucide-react";

const Homepage = () => {
  const problems = useProblemsStore((state) => state.problems);
  const fetchProblems = useProblemsStore((state) => state.fetchProblems);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  return (
    <div className="px-4 py-2">
      <div className="min-w-full rounded-lg mb-10">
        {problems.map((problem, index) => {
          return (
            <Link to={`/problem/${problem.slug}`} key={problem.slug}>
              <div
                key={index}
                className={twMerge(
                  "grid",
                  index % 2 === 0 ? "rounded-md bg-card" : ""
                )}
                style={{ gridTemplateColumns: "25% 45% 10% 20%" }}
              >
                <div className="flex flex-row items-center gap-4 py-3 px-6">
                  <div>
                    {problem.userSubmission?.solved ? (
                      <Check
                        size={13}
                        className="text-green-500"
                        data-tooltip-id="main"
                        data-tooltip-content="Submitted"
                      />
                    ) : problem.userSubmission?.attempted ? (
                      <Circle
                        size={13}
                        data-tooltip-id="main"
                        data-tooltip-content="Attempted"
                      />
                    ) : (
                      <Circle size={13} className="opacity-0" />
                    )}
                  </div>
                  <div>
                    {index + 1}. {problem.title}
                  </div>
                </div>
                <div className="truncate overflow-hidden whitespace-nowrap py-3 px-6 w-full text-white/75">
                  {problem.description.replace(/\n/, "")}
                </div>
                <div
                  className={twMerge(
                    "py-3 px-6 capitalize",
                    problem.problemDifficulty === ProblemDifficulty.EASY &&
                      "text-green-500",
                    problem.problemDifficulty === ProblemDifficulty.MEDIUM &&
                      "text-yellow-400",
                    problem.problemDifficulty === ProblemDifficulty.HARD &&
                      "text-red-500"
                  )}
                >
                  {problem.problemDifficulty.toLocaleLowerCase()}
                </div>

                <div className="py-3">
                  <span>{problem.topics.join(", ")}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Homepage;
