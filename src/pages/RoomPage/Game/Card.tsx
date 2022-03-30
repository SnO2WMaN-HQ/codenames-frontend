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
        ["border"],
        [
          role === null && [
            ["bg-slate-100", "dark:bg-slate-500"],
            ["border-slate-400", "dark:border-slate-200"],
          ],
          role === -1 && [
            ["bg-rose-200", "dark:bg-slate-800"],
            ["border-red-400", "dark:border-rose-500"],
          ],
          role === 0 && [
            ["bg-zinc-300", "dark:bg-zinc-700"],
            ["border-zinc-600", "dark:border-zinc-400"],
          ],
          role === 1 && [
            ["bg-sky-200", "dark:bg-sky-700"],
            ["border-sky-400", "dark:border-sky-400"],
          ],
          role === 2 && [
            ["bg-orange-200", "dark:bg-orange-700"],
            ["border-orange-400", "dark:border-orange-400"],
          ],
        ],
        ["select-none"],
        [["w-36"], ["h-24"]],
        [["px-4"], ["py-2"]],
        ["flex", ["flex-col"]],
      )}
    >
      <span
        className={clsx(
          [["font-bold"]],
          [
            role === null && [
              ["text-slate-600", "dark:text-slate-300"],
            ],
            role === -1 && [
              ["text-rose-600", "dark:text-rose-500"],
            ],
            role === 0 && [
              ["text-zinc-600", "dark:text-zinc-300"],
            ],
            role === 1 && [
              ["text-sky-600", "dark:text-sky-300"],
            ],
            role === 2 && [
              ["text-orange-600", "dark:text-orange-300"],
            ],
          ],
          ["text-center"],
        )}
      >
        {word}
      </span>
      <div
        className={clsx(
          ["w-full"],
          ["pr-2"],
          ["flex", ["flex-wrap"]],
        )}
      >
        {suggestors.map(({ id, name }) => (
          <span
            key={id}
            className={clsx(
              ["text-sm"],
              [
                role === null && [
                  ["text-slate-600", "dark:text-slate-300"],
                ],
                role === -1 && [
                  ["text-rose-600", "dark:text-rose-500"],
                ],
                role === 0 && [
                  ["text-zinc-600", "dark:text-zinc-300"],
                ],
                role === 1 && [
                  ["text-sky-600", "dark:text-sky-300"],
                ],
                role === 2 && [
                  ["text-orange-600", "dark:text-orange-300"],
                ],
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
            ["absolute", ["bottom-0.5"], ["right-0.5"], ["z-0"]],
            [["w-8"], ["h-8"]],
            ["rounded-md"],
            [
              ["bg-slate-300", "hover:bg-slate-400"],
              ["dark:bg-slate-700", "dark:hover:bg-slate-500"],
            ],
            [
              "border",
              [
                ["border-slate-500"],
                ["dark:border-slate-400"],
              ],
            ],
            [
              ["text-slate-500", "hover:text-slate-700"],
              ["dark:text-slate-400", "dark:hover:text-slate-300"],
            ],
            ["cursor-pointer"],
            ["text-sm"],
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
