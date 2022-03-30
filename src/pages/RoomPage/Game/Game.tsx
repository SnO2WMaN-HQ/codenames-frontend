import clsx from "clsx";
import React, { useMemo } from "react";

import { Card } from "./Card";
import { Team } from "./Team";

export const Game: React.VFC<{
  handleAddSuggest(key: number): void;
  handleRemoveSuggest(key: number): void;
  handleSelect(key: number): void;
  handleJoinOperative(team: number): void;
  handleJoinSpymaster(team: number): void;
  game: {
    turn: number;
    dimension: [number, number];
    deck: { key: number; word: string; role: number | null; suggestedBy: string[]; }[];
    teams: { operatives: { playerId: string; }[]; spymasters: { playerId: string; }[]; }[];
  };
  playerId: string;
  playerList: { id: string; name: string; }[];
}> = (
  {
    game,
    playerId,
    playerList,
    handleAddSuggest: handleSuggest,
    handleRemoveSuggest,
    handleSelect,
    handleJoinOperative,
    handleJoinSpymaster,
  },
) => {
  const selectable = useMemo(
    () => game.teams[game.turn - 1].operatives.find(({ playerId: id }) => id === playerId) !== undefined,
    [game, playerId],
  );

  return (
    <div
      className={clsx(
        ["px-4"],
        ["py-4"],
        ["flex"],
        ["justify-center"],
        /*
        [
          [
            { "bg-sky-100": game.turn === 1 },
            { "bg-orange-100": game.turn === 2 },
          ],
        ],
        */
      )}
    >
      <div
        className={clsx(["grid", ["gap-1"]])}
        style={{
          gridTemplateColumns: `repeat(${game.dimension[0]}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${game.dimension[1]}, minmax(0, 1fr))`,
        }}
      >
        {game.deck.map(({ word, key, suggestedBy, role }) => (
          <Card
            key={key}
            word={word}
            role={role}
            selectable={selectable}
            suggesting={suggestedBy.includes(playerId)}
            suggestors={suggestedBy
              .map((sg) => playerList.find(({ id }) => id === sg))
              .filter((v): v is { id: string; name: string; } => Boolean(v))}
            handleAddSuggest={() => {
              handleSuggest(key);
            }}
            handleRemoveSuggest={() => {
              handleRemoveSuggest(key);
            }}
            handleSelect={() => {
              handleSelect(key);
            }}
          />
        ))}
      </div>
      <div
        className={clsx(["ml-1"], ["flex-grow"])}
      >
        <div
          className={clsx(
            ["grid", ["grid-cols-2"], ["gap-x-1"], ["gap-y-1"]],
          )}
        >
          {game.teams.map(({ operatives, spymasters }, i) => (
            <Team
              key={i + 1}
              team={i + 1}
              operatives={operatives}
              spymasters={spymasters}
              players={playerList}
              handleJoinOperative={(t) => {
                handleJoinOperative(t);
              }}
              handleJoinSpymaster={(t) => {
                handleJoinSpymaster(t);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
