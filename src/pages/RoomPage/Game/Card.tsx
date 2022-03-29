import clsx from "clsx";
import React from "react";

export const Card: React.VFC<{
  className?: string;
  word: string;
  suggesting: boolean;
  suggestors: { id: string; name: string; }[];
  handleAddSuggest(): void;
  handleRemoveSuggest(): void;
  handleSelect(): void;
  role: number | null;
}> = (
  { className, suggesting, word, handleAddSuggest, handleRemoveSuggest, suggestors, handleSelect, role },
) => {
  return (
    <div
      className={clsx(
        className,
        ["relative"],
        [
          { "bg-slate-600": role === -1 },
          { "bg-white": role === null },
          { "bg-zinc-200": role === 0 },
          { "bg-cyan-200": role === 1 },
          { "bg-orange-200": role === 2 },
        ],
        [
          "border",
          "rounded-md",
          [
            { "border-slate-800": role === -1 },
            { "border-slate-300": role === null },
            { "border-zinc-400": role === 0 },
            { "border-cyan-400": role === 1 },
            { "border-orange-400": role === 2 },
          ],
        ],
        ["shadow-md"],
        ["select-none"],
        [["w-36"], ["h-24"]],
        [["px-2"], ["py-2"]],
        ["flex", ["flex-col"]],
      )}
    >
      <span
        className={clsx(
          [
            {
              "text-slate-900": !role || role !== -1,
              "text-white": role === -1,
            },
          ],
          ["text-center"],
        )}
      >
        {word}
      </span>
      <div className={clsx(["flex", ["flex-col"]])}>
        {suggestors.map(({ id, name }) => (
          <div key={id}>
            <span
              className={clsx(
                [
                  {
                    "text-slate-900": !role || role !== -1,
                    "text-white": role === -1,
                  },
                ],
                ["text-sm"],
              )}
            >
              {name}
            </span>
          </div>
        ))}
      </div>
      <div
        className={clsx(["absolute", ["inset-0"], ["z-0"]])}
        onClick={(e) => {
          e.preventDefault();

          if (suggesting) {
            handleRemoveSuggest();
          } else {
            handleAddSuggest();
          }
        }}
      >
      </div>
      <button
        className={clsx(
          ["absolute", ["-top-4"], ["-right-4"], ["z-0"]],
          [["w-8"], ["h-8"]],
          ["rounded-full"],
          ["bg-blue-300"],
          ["text-sm"],
          ["text-white"],
        )}
        onClick={(e) => {
          e.preventDefault();
          handleSelect();
        }}
      >
        GO!
      </button>
    </div>
  );
};
