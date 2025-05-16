import { ArrowDown, ChevronDown } from "lucide-react";
import { useEditorStore } from "../../../store/editorStore";
import { useState } from "react";
import { Popover } from "react-tiny-popover";
import { Language } from "@dev-arena/shared";

export const LanguageSelector = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { language, changeLanguage } = useEditorStore((state) => state);

  return (
    <Popover
      isOpen={isPopoverOpen}
      positions={["top", "bottom"]}
      onClickOutside={() => setIsPopoverOpen(false)}
      content={
        <div className="bg-card rounded-lg p-2 flex flex-col gap-1 shadow-2xl drop-shadow-neutral-950 border border-white/5">
          {Object.keys(Language).map((lang) => {
            return (
              <div
                key={lang}
                onClick={() => {
                  changeLanguage(lang.toLowerCase() as Language);
                  setIsPopoverOpen(false);
                }}
                className="flex flex-row gap-1 items-center cursor-pointer hover:bg-white/5 transition-all duration-200 ease-in-out px-5 py-1.5 rounded-lg"
              >
                <div className="text-sm capitalize">
                  {lang.toLocaleLowerCase()}
                </div>
                {lang === "javascript" && <ArrowDown size={14} />}
              </div>
            );
          })}
        </div>
      }
    >
      <div
        onClick={() => setIsPopoverOpen((prev) => !prev)}
        className="flex flex-row gap-1 items-center cursor-pointer hover:bg-white/5 transition-all duration-200 ease-in-out px-1 py-1 my-1 rounded-lg w-max"
      >
        <div className="text-sm capitalize">{language.toLowerCase()}</div>
        <ChevronDown size={14} />
      </div>
    </Popover>
  );
};
