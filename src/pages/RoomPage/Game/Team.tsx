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
        ["py-4"],
        [
          { "bg-cyan-200": team === 1 },
          { "bg-orange-200": team === 2 },
        ],
        ["flex", ["flex-col"]],
      )}
    >
      <div
        className={clsx(
          className,
          ["flex", ["flex-col"]],
        )}
      >
        <span>Operative</span>
        <button
          onClick={(e) => {
            e.preventDefault();
            handleJoinOperative(team);
          }}
        >
          join as operative
        </button>
        <div>
          {operatives.map(({ playerId }) => (
            <div key={playerId}>
              <span>{players.find(({ id }) => id === playerId)?.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div
        className={clsx(
          className,
          ["flex", ["flex-col"]],
        )}
      >
        <span>Spymaster</span>
        <button
          onClick={(e) => {
            e.preventDefault();
            handleJoinSpymaster(team);
          }}
        >
          join as spymaster
        </button>
        <div>
          {spymasters.map(({ playerId }) => (
            <div key={playerId}>
              <span>{players.find(({ id }) => id === playerId)?.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
