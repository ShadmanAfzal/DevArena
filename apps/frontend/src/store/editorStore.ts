import { Language } from "@dev-arena/shared";
import { create } from "zustand";

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
