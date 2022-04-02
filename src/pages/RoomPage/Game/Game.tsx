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
  playersList: { id: string; name: string; }[];
  handleJoinOperative(by: string, team: number): void;
  handleJoinSpymaster(by: string, team: number): void;
  handleAddSuggest(by: string, key: number): void;
  handleRemoveSuggest(by: string, key: number): void;
  handleSendHint(by: string, word: string, count: number): void;
  handleSelectCard(by: string, key: number): void;
}> = (
  {
    game,
    playersList,
    myPlayerId,
    handleAddSuggest,
    handleRemoveSuggest,
    handleSelectCard,
    handleJoinOperative,
    handleJoinSpymaster,
    handleSendHint,
  },
) => {
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

  const findPlayer = useMemo<
    (i: string) =>
      | null
      | { id: string; name: string; }
      | { id: string; name: string; team: number; role: "operative"; }
      | { id: string; name: string; team: number; role: "spymaster"; }
  >(() => ((i) => {
    const p = playersList.find(({ id }) => id === i);
    if (!p) return null;

    const opi = game.teams.findIndex((tm) => tm.spymasters.find(({ playerId }) => playerId === i));
    if (opi !== -1) return { id: i, name: p.name, team: opi + 1, role: "operative" };

    const smi = game.teams.findIndex((tm) => tm.spymasters.find(({ playerId }) => playerId === i));
    if (smi !== -1) return { id: i, name: p.name, team: opi + 1, role: "spymaster" };

    return { id: i, name: p.name };
  }), [game, playersList]);
  const isMyTurnNow = useMemo(
    () => game.currentTurn === me?.team,
    [game, me],
  );
  const isRequiringHint = useMemo<boolean>(
    () => isMyTurnNow && me?.role === "spymaster" && game.currentHint === null,
    [game, isMyTurnNow, me?.role],
  );
  const canTurnCardNow = useMemo(
    () => isMyTurnNow && me?.role === "operative" && game.currentHint !== null,
    [game, isMyTurnNow, me],
  );

  return (
    <div
      className={clsx(
        ["px-4"],
        ["py-4"],
        ["flex"],
        ["justify-center"],
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
              canTurnNow={canTurnCardNow}
              suggestors={suggestedBy.map((id) => ({ id, ...findPlayer(id) }))}
              handleTap={() => {
                if (!me || me.role !== "operative") return;

                if (suggestedBy.includes(me.playerId)) {
                  handleRemoveSuggest(me.playerId, key);
                } else {
                  handleAddSuggest(me.playerId, key);
                }
              }}
              handleSelect={() => {
                if (!me || me.role !== "operative") return;
                handleSelectCard(me.playerId, key);
              }}
            />
          ))}
        </div>
        <Hinter
          className={clsx(["mt-1"], ["w-full"])}
          currentHint={game.currentHint}
          requireHint={isRequiringHint}
          currentTeam={game.currentTurn}
          max={25}
          handleSendHint={(hint, num) => {
            if (!me || me.role !== "spymaster") return;
            handleSendHint(me.playerId, hint, num);
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
                handleJoinOperative(myPlayerId, t);
              }}
              handleJoinSpymaster={(t) => {
                handleJoinSpymaster(myPlayerId, t);
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
          findPlayer={(id) => {
            const p = findPlayer(id);
            if (p && "team" in p) return { name: p.name, team: p.team };
            else if (p) return { name: p.name, team: null };
            else return null;
          }}
          findCard={(key) => game.deck.find((card) => card.key === key)}
        />
      </div>
    </div>
  );
};
