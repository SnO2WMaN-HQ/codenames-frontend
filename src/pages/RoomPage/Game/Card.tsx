import clsx from "clsx";
import React from "react";

export const Card: React.VFC<{
  className?: string;
  word: string;
  suggesting: boolean;
  suggestors: { id: string; name: string; }[];
  selectable: boolean;
  handleAddSuggest(): void;
  handleRemoveSuggest(): void;
  handleSelect(): void;
  role: number | null;
}> = (
  { className, selectable, suggesting, word, handleAddSuggest, handleRemoveSuggest, suggestors, handleSelect, role },
) => {
  return (
    <div
      className={clsx(
        className,
        ["relative"],
        [
          { "bg-slate-400": role === -1 },
          { "bg-slate-50": role === null },
          { "bg-stone-200": role === 0 },
          { "bg-cyan-200": role === 1 },
          { "bg-orange-200": role === 2 },
        ],
        [
          "border",
          [
            { "border-slate-600": role === -1 },
            { "border-slate-400": role === null },
            { "border-zinc-400": role === 0 },
            { "border-cyan-400": role === 1 },
            { "border-orange-400": role === 2 },
          ],
        ],
        ["select-none"],
        [["w-36"], ["h-24"]],
        [["px-2"], ["py-2"]],
        ["flex", ["flex-col"]],
      )}
    >
      <span
        className={clsx(
          [
            ["font-bold"],
            {
              "text-slate-100": role === -1,
              "text-slate-400": role === null,
              "text-zinc-400": role === 0,
              "text-cyan-600": role === 1,
              "text-orange-600": role === 2,
            },
          ],
          ["text-center"],
        )}
      >
        {word}
      </span>
      <div className={clsx(["flex", ["flex-wrap"]])}>
        {suggestors.map(({ id, name }) => (
          <span
            key={id}
            className={clsx(
              ["text-sm"],
              [
                {
                  "text-slate-100": role === -1,
                  "text-slate-400": role === null,
                  "text-zinc-700": role === 0,
                  "text-cyan-700": role === 1,
                  "text-orange-700": role === 2,
                },
              ],
              ["mr-2"],
            )}
          >
            {name}
          </span>
        ))}
      </div>
      {selectable && (
        <div
          className={clsx(["absolute", ["inset-0"], ["z-0"]], ["cursor-pointer"])}
          onClick={(e) => {
            e.preventDefault();
            if (suggesting) handleRemoveSuggest();
            else handleAddSuggest();
          }}
        >
        </div>
      )}
      {selectable && (
        <button
          className={clsx(
            ["absolute", ["-top-4"], ["-right-4"], ["z-0"]],
            [["w-8"], ["h-8"]],
            ["rounded-full"],
            ["bg-blue-300"],
            ["text-sm"],
            ["text-white"],
            ["cursor-pointer"],
          )}
          onClick={(e) => {
            e.preventDefault();
            handleSelect();
          }}
        >
          GO!
        </button>
      )}
    </div>
  );
};
