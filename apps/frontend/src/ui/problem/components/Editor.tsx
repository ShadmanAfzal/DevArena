import MonacoEditor, { Monaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useEditorStore } from "../../../store/editorStore";

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

  return (
    <MonacoEditor
      width="100%"
      height="100%"
      theme="customTheme"
      className="border-none rounded-2xl overflow-hidden"
      value={value}
      onMount={handleOnMount}
      beforeMount={handleBeforeMount}
      language={language}
      options={{
        selectOnLineNumbers: true,
        automaticLayout: true,
        overviewRulerBorder: false,
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
  );
};
