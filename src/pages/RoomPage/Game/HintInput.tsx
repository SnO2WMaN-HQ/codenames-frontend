import clsx from "clsx";
import React, { useState } from "react";

export const Hinter: React.VFC<
  {
    className?: string;
    max: number;
    handleSendHint(hint: string, num: number): void;
  }
> = ({ className, max, handleSendHint }) => {
  const [hint, setHint] = useState<string>("");
  const [num, setNum] = useState<number>(0);

  return (
    <div
      className={clsx(
        className,
        ["flex"],
        [["px-2"], ["py-2"]],
        ["bg-slate-700"],
        ["border", ["border-slate-400"]],
      )}
    >
      <input
        value={hint}
        placeholder={"give a hint"}
        onChange={(e) => {
          e.preventDefault();
          setHint(e.target.value);
        }}
        className={clsx(
          ["flex-grow"],
          [["px-2"], ["py-1"]],
          ["bg-slate-400"],
          ["text-xl"],
          ["placeholder-slate-500"],
          ["text-slate-700"],
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
          ["text-slate-700"],
          ["placeholder-slate-700"],
        )}
        min={1}
        max={max}
        onChange={(e) => {
          e.preventDefault();
          setNum(Number.parseInt(e.target.value, 10));
        }}
      >
      </input>
      <button
        disabled={!(hint !== "" || 0 < num)}
        className={clsx(
          ["ml-1"],
          [
            ["px-4"],
            ["py-1"],
          ],
          ["bg-slate-700"],
          ["border", ["border-slate-400"]],
          ["text-slate-400"],
        )}
        onClick={(e) => {
          e.preventDefault();
          if (hint !== "" || 0 < num) {
            handleSendHint(hint, num);
          }
        }}
      >
        GO!
      </button>
    </div>
  );
};
