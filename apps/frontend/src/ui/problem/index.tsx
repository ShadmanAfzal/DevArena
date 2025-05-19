import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import { useExecutionStore } from "../../store/executionStore";
import { Question } from "./components/Question";
import Output from "./components/Output";
import { Editor } from "./components/Editor";
import { useParams } from "react-router";
import { useProblemsStore } from "../../store/problemStore";
import { LoaderCircle } from "lucide-react";

const Problem = () => {
  const { slug } = useParams();

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null);

  const executeExpression = useExecutionStore((state) => state.execute);

  const fetchProblemBySlug = useProblemsStore(
    (state) => state.fetchProblemBySlug
  );
  const { currentProblem: problem, isLoading } = useProblemsStore(
    (state) => state
  );

  useEffect(() => {
    if (slug) fetchProblemBySlug(slug);
  }, [slug, fetchProblemBySlug]);

  const handleSubmit = async () => {
    const expression = editorRef.current?.getValue();

    if (!expression) return;
    executeExpression(expression);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="h-full flex flex-row overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center w-full">
            <LoaderCircle className="animate-spin" />
          </div>
        ) : (
          <>
            <Question />
            <div className="flex flex-col w-[50%] overflow-hidden">
              <div className="h-[60%] ml-1.5 mb-1.5 mr-4 overflow-hidden">
                <Editor
                  value={problem?.userCode ?? problem?.initialCode ?? ""}
                  editorRef={editorRef}
                />
              </div>
              <Output handleSubmit={handleSubmit} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Problem;
