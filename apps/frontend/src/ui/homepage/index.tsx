import { useEffect } from "react";
import { ProblemDifficulty, useProblemsStore } from "../../store/problemStore";
import { Link } from "react-router";
import { twMerge } from "tailwind-merge";
import { Header } from "./components/Header";

const Homepage = () => {
  const problems = useProblemsStore((state) => state.problems);
  const fetchProblems = useProblemsStore((state) => state.fetchProblems);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  return (
    <div>
      <Header />
      <div className="overflow-x-auto p-4">
        <div className="min-w-full rounded-lg">
          {problems.map((problem, index) => {
            return (
              <Link to={`/problem/${problem.slug}`}>
                <div
                  key={index}
                  className={twMerge(
                    "grid",
                    index % 2 === 0 ? "rounded-md bg-card" : ""
                  )}
                  style={{ gridTemplateColumns: "50% 20% 1fr" }}
                >
                  <div className="py-3 px-6">{problem.title}</div>
                  <div
                    className={twMerge(
                      "py-3 px-6 capitalize",
                      problem.problemDifficulty === ProblemDifficulty.EASY &&
                        "text-green-500",
                      problem.problemDifficulty === ProblemDifficulty.MEDIUM &&
                        "text-yellow-500",
                      problem.problemDifficulty === ProblemDifficulty.HARD &&
                        "text-red-500"
                    )}
                  >
                    {problem.problemDifficulty.toLocaleLowerCase()}
                  </div>
                  <div className="py-3 px-6">
                    <span>{problem.topics.join(", ")}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
