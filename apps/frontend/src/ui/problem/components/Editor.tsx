import MonacoEditor, { Monaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useEditorStore } from "../../../store/editorStore";
import { Braces, CodeXml } from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";

type EditorProps = {
  value: string;
  editorRef: React.RefObject<monaco.editor.IStandaloneCodeEditor | null>;
};

export const Editor = ({ value, editorRef }: EditorProps) => {
  const language = useEditorStore((state) => state.language);

  const handleOnMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };

  const handleBeforeMount = (monaco: Monaco) => {
    monaco.editor.defineTheme("customTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#282828",
      },
    });
  };

  const formatCode = () => {
    editorRef.current?.getAction("editor.action.formatDocument")?.run();
  };

  return (
    <div className="w-full h-full flex flex-col rounded-2xl overflow-hidden">
      <div className="bg-white/5">
        <div className="flex flex-row gap-2 items-center p-2">
          <CodeXml className="text-green-500" size={22} />
          <div className="text select-none">Code</div>
        </div>
        <div className="flex flex-row justify-between items-center bg-card border-b border-white/10 px-2">
          <LanguageSelector />
          <div className="cursor-pointer hover:bg-white/5 transition-all duration-200 ease-in-out px-1 py-1 rounded-lg">
            <Braces onClick={formatCode} size={18} />
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <MonacoEditor
          width="100%"
          height="100%"
          theme="customTheme"
          className="border-none"
          value={value}
          onMount={handleOnMount}
          beforeMount={handleBeforeMount}
          language={language}
          options={{
            selectOnLineNumbers: true,
            automaticLayout: true,
            overviewRulerBorder: false,
            stickyScroll: {
              enabled: false,
            },
            scrollbar: { verticalScrollbarSize: 0 },
            fontFamily: "InconsolataGo, monospace",
            fontSize: 15,
            padding: {
              bottom: 10,
              top: 10,
            },
            minimap: {
              enabled: false,
            },
          }}
        />
      </div>
    </div>
  );
};
