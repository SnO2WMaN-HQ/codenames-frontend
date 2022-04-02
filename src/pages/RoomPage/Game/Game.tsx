import clsx from "clsx";
import React, { useMemo } from "react";

import { Card } from "./Card";
import { Hinter } from "./HintInput";
import { History } from "./History";
import { Team } from "./Team";

export const Game: React.VFC<{
  game: {
    end: boolean;
    currentTurn: number;
    currentHint: null | { word: string; count: number; };
    deck: { key: number; word: string; role: number | null; suggestedBy: string[]; }[];
    dimension: [number, number];
    teams: { operatives: { playerId: string; }[]; spymasters: { playerId: string; }[]; }[];
    history: (
      | { type: "submit_hint"; by: string; word: string; count: number; }
      | { type: "select_card"; by: string; key: number; }
      | { type: "lose_team"; team: number; }
      | { type: "end_turn"; team: number; }
      | { type: "start_turn"; team: number; }
      | { type: "end_game"; }
    )[];
  };
  myPlayerId: string;
  findPlayer: (id: string) => undefined | { name: string; };
  handleSendHint(hint: string, num: number): void;
  handleAddSuggest(key: number): void;
  handleRemoveSuggest(key: number): void;
  handleSelect(key: number): void;
  handleJoinOperative(team: number): void;
  handleJoinSpymaster(team: number): void;
}> = (
  {
    game,
    myPlayerId,
    handleAddSuggest: handleSuggest,
    handleRemoveSuggest,
    findPlayer,
    handleSelect,
    handleJoinOperative,
    handleJoinSpymaster,
    handleSendHint,
  },
) => {
  const myTeam = useMemo<null | number>(
    () => {
      const i = game.teams.findIndex(({ operatives, spymasters }) =>
        operatives.find(({ playerId }) => playerId === myPlayerId) !== undefined
        || spymasters.find(({ playerId }) => playerId === myPlayerId) !== undefined
      );
      if (i === -1) return null;
      return i + 1;
    },
    [game, myPlayerId],
  );
  const me = useMemo<null | { playerId: string; team: number; role: "spymaster" | "operative"; }>(() => {
    const opi = game.teams.findIndex(({ operatives }) =>
      operatives.find(({ playerId }) => playerId === myPlayerId) !== undefined
    );
    if (opi !== -1) return { playerId: myPlayerId, team: opi + 1, role: "operative" };

    const smi = game.teams.findIndex(({ spymasters }) =>
      spymasters.find(({ playerId }) => playerId === myPlayerId) !== undefined
    );
    if (smi !== -1) return { playerId: myPlayerId, team: smi + 1, role: "spymaster" };
    return null;
  }, [game, myPlayerId]);
  const isMyTurnNow = useMemo(() => game.currentTurn === me?.team, [game, me]);
  const canTurnCardNow = useMemo(() => isMyTurnNow && me?.role === "operative", [me, isMyTurnNow]);
  const requireHint = useMemo<boolean>(
    () => game.currentHint === null && me?.team === game.currentTurn && me?.role === "spymaster",
    [game, me],
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
        className={clsx(
          ["flex", ["flex-col"]],
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
              me={me}
              myTeam={myTeam}
              canTurnNow={canTurnCardNow}
              suggesting={suggestedBy.includes(myPlayerId)}
              suggestors={suggestedBy.map((id) => ({ id, ...findPlayer(id) }))}
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
        <Hinter
          className={clsx(["mt-1"], ["w-full"])}
          currentHint={game.currentHint}
          requireHint={requireHint}
          currentTeam={game.currentTurn}
          max={25}
          handleSendHint={(hint, num) => {
            handleSendHint(hint, num);
          }}
        />
      </div>
      <div
        className={clsx(["ml-1"], ["flex-grow"], ["flex", ["flex-col"]])}
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
              me={me}
              operatives={operatives}
              spymasters={spymasters}
              findPlayer={findPlayer}
              handleJoinOperative={(t) => {
                handleJoinOperative(t);
              }}
              handleJoinSpymaster={(t) => {
                handleJoinSpymaster(t);
              }}
            />
          ))}
        </div>
        <History
          className={clsx(
            ["mt-1"],
            ["h-64"],
          )}
          history={game.history}
          findPlayer={findPlayer}
        />
      </div>
    </div>
  );
};
