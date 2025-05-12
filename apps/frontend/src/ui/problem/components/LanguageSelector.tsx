import { useEditorStore } from "../../../store/editorStore";
import Language from "../../../types/Language";

export const LanguageSelector = () => {
  const setLanguage = useEditorStore((state) => state.changeLanguage);

  return (
    <div className="flex flex-row gap-2 items-center">
      <select
        className="outline-none"
        onChange={(e) => setLanguage(e.currentTarget.value as Language)}
      >
        {Object.values(Language).map((lang, index) => {
          return (
            <option value={lang} key={index} className="text-black">
              {lang.charAt(0).toUpperCase() + lang.slice(1).toLowerCase()}
            </option>
          );
        })}
      </select>
    </div>
  );
};
