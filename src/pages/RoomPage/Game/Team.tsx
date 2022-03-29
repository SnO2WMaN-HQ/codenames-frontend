import clsx from "clsx";
import React from "react";

export const Team: React.VFC<
  {
    className?: string;
    team: number;
    operatives: { playerId: string; }[];
    spymasters: { playerId: string; }[];
    players: { id: string; name: string; }[];
    handleJoinOperative(team: number): void;
    handleJoinSpymaster(team: number): void;
  }
> = ({
  className,
  team,
  operatives,
  spymasters,
  handleJoinOperative,
  handleJoinSpymaster,
  players,
}) => {
  return (
    <div
      className={clsx(
        className,
        ["px-8"],
        ["py-4"],
        [
          {
            "bg-cyan-50": team === 1,
            "bg-orange-50": team === 2,
          },
        ],
        [
          "border",
          [
            { "border-cyan-400": team === 1 },
            { "border-orange-400": team === 2 },
          ],
        ],
        ["flex", ["flex-col"]],
      )}
    >
      <div
        className={clsx(
          ["flex", ["flex-col"]],
        )}
      >
        <span
          className={clsx(
            className,
            ["text-lg"],
            ["font-bold"],
            [
              {
                "text-cyan-400": team === 1,
                "text-orange-400": team === 2,
              },
            ],
          )}
        >
          Operative
        </span>
        <div
          className={clsx(["flex"])}
        >
          {operatives.map(({ playerId }) => (
            <span
              key={playerId}
              className={clsx(["mr-2"])}
            >
              {players.find(({ id }) => id === playerId)?.name}
            </span>
          ))}
        </div>
        <button
          className={clsx(["mt-2"])}
          onClick={(e) => {
            e.preventDefault();
            handleJoinOperative(team);
          }}
        >
          join as operative
        </button>
      </div>
      <div
        className={clsx(
          ["mt-2"],
          ["flex", ["flex-col"]],
        )}
      >
        <span
          className={clsx(
            className,
            ["text-lg"],
            ["font-bold"],
            [
              {
                "text-cyan-400": team === 1,
                "text-orange-400": team === 2,
              },
            ],
          )}
        >
          Spymaster
        </span>
        <div className={clsx(["flex"])}>
          {spymasters.map(({ playerId }) => (
            <div
              key={playerId}
              className={clsx(["mr-2"])}
            >
              <span>{players.find(({ id }) => id === playerId)?.name}</span>
            </div>
          ))}
        </div>
        <button
          className={clsx(["mt-2"])}
          onClick={(e) => {
            e.preventDefault();
            handleJoinSpymaster(team);
          }}
        >
          join as spymaster
        </button>
      </div>
    </div>
  );
};
