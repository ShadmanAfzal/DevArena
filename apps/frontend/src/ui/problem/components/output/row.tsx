import { twMerge } from "tailwind-merge";

type OutputRowPropsType = {
  label: string;
  isError?: boolean;
  data: string;
  preserveIndentation?: boolean;
};

const OutputRow = ({
  data,
  label,
  isError,
  preserveIndentation,
}: OutputRowPropsType) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-white/75">{label}:</div>
      <div
        className={twMerge(
          "bg-white/8 py-2 px-3 rounded-lg customFont",
          isError && "bg-[#f8615c14] text-red-500"
        )}
      >
        {preserveIndentation ? (
          <pre className="whitespace-pre-wrap break-words overflow-x-auto max-w-full">
            {data}
          </pre>
        ) : (
          <span>{data}</span>
        )}
      </div>
    </div>
  );
};

export default OutputRow;
