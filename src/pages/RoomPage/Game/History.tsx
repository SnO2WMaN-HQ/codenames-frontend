import clsx from "clsx";
import React from "react";

export const History: React.VFC<
  {
    className?: string;
    findPlayer: (id: string) => null | { name: string; team: number | null; };
    findCard: (key: number) => undefined | { word: string; role: number | null; };
    history: (
      | { type: "submit_hint"; by: string; word: string; count: number; }
      | { type: "select_card"; by: string; key: number; }
      | { type: "lose_team"; team: number; }
      | { type: "end_turn"; team: number; }
      | { type: "start_turn"; team: number; }
      | { type: "end_game"; }
    )[];
  }
> = ({ className, history, findPlayer, findCard }) => {
  return (
    <div
      className={clsx(
        className,
        ["px-4"],
        ["py-2"],
        ["overflow-y-scroll"],
        ["select-none"],
        [["bg-slate-200"], ["dark:bg-slate-700"]],
        [
          "border",
          [["border-slate-400"], ["dark:border-slate-300"]],
        ],
      )}
    >
      <div
        className={clsx(
          className,
          ["flex", ["flex-col"]],
          ["space-y-0.5"],
        )}
      >
        {history.map((item, i) => (
          <span
            key={i}
            className={clsx(
              ["text-sm"],
              ["text-slate-900", "dark:text-slate-100"],
            )}
          >
            {item.type === "submit_hint"
              && <>{item.word} x{item.count} by {findPlayer(item.by)?.name}</>}
            {item.type === "select_card"
              && <>{findPlayer(item.by)?.name} selects {findCard(item.key)?.word}</>}
            {item.type === "end_turn"
              && <>TURN END {item.team}</>}
            {item.type === "start_turn"
              && <>TURN START {item.team}</>}
            {item.type === "lose_team"
              && <>Team {item.team} Lost</>}
            {item.type === "end_game"
              && <>game set</>}
          </span>
        ))}
      </div>
    </div>
  );
};
