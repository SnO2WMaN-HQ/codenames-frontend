import clsx from "clsx";
import React, { useState } from "react";

export const Hinter: React.VFC<
  {
    className?: string;
    max: number;
    currentTeam: number;
    requireHint: boolean;
    currentHint: null | { word: string; count: number; };
    handleSendHint(hint: string, num: number): void;
    canFinishEstimate: boolean;
    handleFinishEstimate(): void;
  }
> = (
  { className, max, handleSendHint, requireHint, currentTeam, currentHint, canFinishEstimate, handleFinishEstimate },
) => {
  const [hint, setHint] = useState<string>("");
  const [count, setNum] = useState<number>(0);

  return (
    <div
      className={clsx(
        className,
        ["flex"],
        [["px-2"], ["py-2"]],
        ["border"],
        [
          currentTeam === 1 && [
            ["bg-sky-200", "dark:bg-sky-700"],
            ["border-sky-400", "dark:border-sky-400"],
          ],
          currentTeam === 2 && [
            ["bg-orange-200", "dark:bg-orange-700"],
            ["border-orange-400", "dark:border-orange-400"],
          ],
        ],
      )}
    >
      <input
        value={currentHint?.word || hint}
        placeholder={"give a hint"}
        disabled={!requireHint}
        onChange={(e) => {
          e.preventDefault();
          setHint(e.target.value);
        }}
        className={clsx(
          ["flex-grow"],
          [["px-2"], ["py-1"]],
          ["text-xl"],
          [["bg-slate-300"], ["dark:bg-slate-700"]],
          [
            "border",
            [["border-slate-400"], ["dark:border-slate-400"]],
          ],
          [
            ["text-slate-600", "dark:text-slate-400"],
            ["placeholder-slate-400", "dark:placeholder-slate-600"],
          ],
        )}
      >
      </input>
      <input
        type="number"
        className={clsx(
          ["ml-1"],
          [
            ["px-4"],
            ["py-1"],
          ],
          ["text-xl"],
          ["select-none"],
          [["bg-slate-300"], ["dark:bg-slate-700"]],
          [
            "border",
            [["border-slate-400"], ["dark:border-slate-400"]],
          ],
          [
            ["text-slate-600", "dark:text-slate-400"],
            ["placeholder-slate-400", "dark:placeholder-slate-600"],
          ],
        )}
        value={currentHint?.count || count}
        disabled={!requireHint}
        min={1}
        max={max}
        onChange={(e) => {
          e.preventDefault();
          setNum(Number.parseInt(e.target.value, 10));
        }}
      >
      </input>
      <button
        disabled={!(requireHint && (hint !== "" && 0 < count))}
        className={clsx(
          ["ml-1"],
          [
            ["px-4"],
            ["py-1"],
          ],
          ["select-none"],
          ["border"],
          [
            currentTeam === 1 && [
              [
                ["bg-sky-400", "hover:bg-sky-500", "disabled:bg-sky-200"],
                ["dark:bg-sky-500", "dark:hover:bg-sky-400", "dark:disabled:bg-sky-700"],
              ],
              [
                ["border-sky-600", "disabled:border-sky-300"],
                ["dark:border-sky-300", "dark:disabled:border-sky-600"],
              ],
              [
                ["text-sky-700", "hover:text-sky-600", "disabled:text-sky-300"],
                ["dark:text-sky-200", "dark:hover:text-sky-100", "dark:disabled:text-sky-600"],
              ],
            ],
            currentTeam === 2 && [
              [
                ["bg-orange-400", "hover:bg-orange-500", "disabled:bg-orange-200"],
                ["dark:bg-orange-500", "dark:hover:bg-orange-400", "dark:disabled:bg-orange-700"],
              ],
              [
                ["border-orange-600", "disabled:border-orange-300"],
                ["dark:border-orange-300", "dark:disabled:border-orange-600"],
              ],
              [
                ["text-orange-700", "hover:text-orange-600", "disabled:text-orange-300"],
                ["dark:text-orange-200", "dark:hover:text-orange-100", "dark:disabled:text-orange-600"],
              ],
            ],
          ],
        )}
        onClick={(e) => {
          e.preventDefault();
          if (hint !== "" || 0 < count) {
            handleSendHint(hint, count);
          }
        }}
      >
        GO!
      </button>
      <button
        disabled={!(canFinishEstimate)}
        className={clsx(
          ["ml-1"],
          [
            ["px-4"],
            ["py-1"],
          ],
          ["select-none"],
          ["border"],
          [
            currentTeam === 1 && [
              [
                ["bg-sky-400", "hover:bg-sky-500", "disabled:bg-sky-200"],
                ["dark:bg-sky-500", "dark:hover:bg-sky-400", "dark:disabled:bg-sky-700"],
              ],
              [
                ["border-sky-600", "disabled:border-sky-300"],
                ["dark:border-sky-300", "dark:disabled:border-sky-600"],
              ],
              [
                ["text-sky-700", "hover:text-sky-600", "disabled:text-sky-300"],
                ["dark:text-sky-200", "dark:hover:text-sky-100", "dark:disabled:text-sky-600"],
              ],
            ],
            currentTeam === 2 && [
              [
                ["bg-orange-400", "hover:bg-orange-500", "disabled:bg-orange-200"],
                ["dark:bg-orange-500", "dark:hover:bg-orange-400", "dark:disabled:bg-orange-700"],
              ],
              [
                ["border-orange-600", "disabled:border-orange-300"],
                ["dark:border-orange-300", "dark:disabled:border-orange-600"],
              ],
              [
                ["text-orange-700", "hover:text-orange-600", "disabled:text-orange-300"],
                ["dark:text-orange-200", "dark:hover:text-orange-100", "dark:disabled:text-orange-600"],
              ],
            ],
          ],
        )}
        onClick={(e) => {
          e.preventDefault();
          if (canFinishEstimate) handleFinishEstimate();
        }}
      >
        FINISH ESTIMATE
      </button>
    </div>
  );
};
