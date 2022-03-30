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
        ["px-4"],
        ["py-2"],
        ["border"],
        [
          team === 1 && [
            ["bg-sky-200", "dark:bg-sky-700"],
            ["border-sky-400", "dark:border-sky-400"],
          ],
          team === 2 && [
            ["bg-orange-200", "dark:bg-orange-700"],
            ["border-orange-400", "dark:border-orange-400"],
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
              team === 1 && [
                ["text-sky-600", "dark:text-sky-300"],
              ],
              team === 2 && [
                ["text-orange-600", "dark:text-orange-300"],
              ],
            ],
          )}
        >
          Operative
        </span>
        <div className={clsx(["mt-1"], ["flex"])}>
          {operatives.map(({ playerId }) => (
            <span
              key={playerId}
              className={clsx(
                ["mr-1"],
                ["text-sm"],
                [
                  team === 1 && [
                    ["text-sky-600", "dark:text-sky-300"],
                  ],
                  team === 2 && [
                    ["text-orange-600", "dark:text-orange-300"],
                  ],
                ],
              )}
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
      <div className={clsx(["mt-2"], ["flex", ["flex-col"]])}>
        <span
          className={clsx(
            className,
            ["text-lg"],
            ["font-bold"],
            [
              team === 1 && [
                ["text-sky-600", "dark:text-sky-300"],
              ],
              team === 2 && [
                ["text-orange-600", "dark:text-orange-300"],
              ],
            ],
          )}
        >
          Spymaster
        </span>
        <div className={clsx([["mt-1"], "flex"])}>
          {spymasters.map(({ playerId }) => (
            <span
              key={playerId}
              className={clsx(
                ["mr-1"],
                ["text-sm"],
                [
                  team === 1 && [
                    ["text-sky-600", "dark:text-sky-300"],
                  ],
                  team === 2 && [
                    ["text-orange-600", "dark:text-orange-300"],
                  ],
                ],
              )}
            >
              {players.find(({ id }) => id === playerId)?.name}
            </span>
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
