import { Language } from "@dev-arena/shared";
import { create } from "zustand";

type EditorStoreType = {
  language: string;
  initialCode: string;
  changeLanguage: (language: Language) => void;
  setInitialCode: (code: string) => void;
};

export const useEditorStore = create<EditorStoreType>((set) => {
  return {
    language: Language.JAVASCRIPT,
    initialCode: "console.log('Hello World')",
    changeLanguage: (language: Language) => set({ language }),
    setInitialCode: (code: string) => set({ initialCode: code }),
  };
});
