import { create } from "zustand";
import Language from "../types/Language";

type EditorStoreType = {
  language: string;
  changeLanguage: (language: Language) => void;
};

export const useEditorStore = create<EditorStoreType>((set) => {
  return {
    language: Language.JAVASCRIPT,
    changeLanguage: (language: Language) => set({ language }),
  };
});
