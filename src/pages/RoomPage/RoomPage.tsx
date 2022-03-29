import clsx from "clsx";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { GameStarter } from "./GameStarter";
import { PlayersList } from "./PlayersList";

export const RoomPage: React.VFC = () => {
  const { id } = useParams<"id">();
  const wsEndpoint = useMemo<string | undefined>(
    () => id && new URL(`/rooms/${id}/join`, import.meta.env.VITE_WS_ENDPOINT).toString(),
    [id],
  );
  const wsRef = useRef<WebSocket | undefined>(undefined);

  const [connError, setConnError] = useState<boolean>(false);

  const [playerId, setPlayerId] = useState<string>();

  const [rawPlayersList, setRawPlayersList] = useState<
    { id: string; name: string; isHost: boolean; }[]
  >();
  const playersList = useMemo<
    { id: string; name: string; isHost: boolean; isSelf: boolean; }[] | undefined
  >(
    () => rawPlayersList?.map(({ id, ...rest }) => ({ ...rest, id, isSelf: id === playerId })),
    [playerId, rawPlayersList],
  );
  const isHostIsMe = useMemo<boolean>(
    () => playersList?.find(({ isSelf }) => isSelf)?.isHost === true,
    [playersList],
  );
  const isStartable = useMemo<boolean>(
    () =>
      isHostIsMe
      && (playersList && 4 <= playersList.length) === true,
    [isHostIsMe, playersList],
  );
  const [isPlaying, setIsPlaying] = useState<boolean | undefined>();

  const [game, setGame] = useState<
    undefined | {
      dimension: [number, number];
      deck: { key: number; role: null | number; word: string; suggestedBy: string[]; }[];
      teams: { operatives: { playerId: string; }[]; spymasters: { playerId: string; }[]; }[];
    }
  >(undefined);

  const sendRename = (newName: string): void => {
    if (!wsRef.current || !playerId) return;

    wsRef.current.send(JSON.stringify({
      method: "RENAME",
      payload: { player_id: playerId, new_name: newName },
    }));
  };
  const sendStartGame = (
    rules: {
      wordsCount: number;
      wordsAssign: number[];
      deadWords: number;
    },
  ) => {
    if (!wsRef.current || !playerId) return;

    wsRef.current.send(JSON.stringify({
      method: "START_GAME",
      payload: {
        player_id: playerId,
        words_count: rules.wordsCount,
        words_assign: rules.wordsAssign,
        dead_words: rules.deadWords,
      },
    }));
  };

  useEffect(() => {
    if (!wsEndpoint) return;

    const ws = new WebSocket(wsEndpoint);

    ws.addEventListener("error", (event) => {
      setConnError(true);
    });

    ws.addEventListener("open", () => {
      const storedPlayerId = window.sessionStorage.getItem("player_id"); // TODO: 4人以上のテストのためにsessionStorageを使う(localStorageに直す)

      ws.send(JSON.stringify({
        method: "JOIN",
        payload: { player_id: storedPlayerId },
      }));
    });

    ws.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if (!("method" in data)) {
        console.error("No method");
        return;
      }

      switch (data.method) {
        case "JOINED": {
          const { payload } = data;
          const { player_id: playerId } = payload;

          setPlayerId(playerId);
          window.sessionStorage.setItem("player_id", playerId); // TODO: 4人以上のテストのためにsessionStorageを使う

          break;
        }
        case "UPDATE_ROOM": {
          const { payload } = data;
          const { players, is_playing } = payload;

          setRawPlayersList(
            players.map(
              ({ is_host: isHost, ...rest }: { id: string; name: string; is_host: boolean; }) => ({ isHost, ...rest }),
            ),
          );
          setIsPlaying(is_playing);

          break;
        }
        case "SYNC_GAME": {
          const { payload } = data;
          const { deck, teams } = payload;
          setGame({
            dimension: [5, 5],
            deck: deck.map((
              { word, key, suggested_by: suggestedBy, role }: {
                word: string;
                key: number;
                suggested_by: string[];
                role: number | null;
              },
            ) => ({ word, key, role, suggestedBy })),
            teams: teams.map((
              { operatives, spymasters }: {
                operatives: { player_id: string; }[];
                spymasters: { player_id: string; }[];
              },
            ) => ({
              operatives: operatives.map(({ player_id }) => ({ playerId: player_id })),
              spymasters: spymasters.map(({ player_id }) => ({ playerId: player_id })),
            })),
          });
        }
      }
    });

    wsRef.current = ws;
  }, [wsEndpoint]);

  return (
    <div className={clsx(["relative"])}>
      {/* Connection Error */}
      {connError && (
        <div
          className={clsx(
            ["absolute", ["inset-0"]],
            ["bg-slate-900", ["bg-opacity-75"]],
            ["flex", ["justify-center"], ["items-center"]],
            [],
          )}
        >
          <span className={clsx(["text-white"])}>Conection Error</span>
        </div>
      )}
      <p>Room</p>
      <p>{id}</p>
      <PlayersList
        players={playersList}
        onRename={sendRename}
      />
      {!isPlaying && <GameStarter startGame={sendStartGame} startable={isStartable} />}
      {playersList && isPlaying && game && (
        <Game
          playerList={playersList}
          game={game}
          handleAddSuggest={(key) => {
            if (!wsRef.current || !playerId) return;

            wsRef.current.send(JSON.stringify({
              method: "UPDATE_GAME",
              payload: { type: "add_suggest", player_id: playerId, key },
            }));
          }}
          handleRemoveSuggest={(key) => {
            if (!wsRef.current || !playerId) return;

            wsRef.current.send(JSON.stringify({
              method: "UPDATE_GAME",
              payload: { type: "remove_suggest", player_id: playerId, key },
            }));
          }}
          handleSelect={(key) => {
            if (!wsRef.current || !playerId) return;

            wsRef.current.send(JSON.stringify({
              method: "UPDATE_GAME",
              payload: {
                type: "select",
                player_id: playerId,
                key,
              },
            }));
          }}
          handleJoinOperative={(team) => {
            if (!wsRef.current || !playerId) return;
            console.log({ type: "join_operative", player_id: playerId, team });
            wsRef.current.send(JSON.stringify({
              method: "UPDATE_GAME",
              payload: { type: "join_operative", player_id: playerId, team },
            }));
          }}
          handleJoinSpymaster={(team) => {
            if (!wsRef.current || !playerId) return;
            wsRef.current.send(JSON.stringify({
              method: "UPDATE_GAME",
              payload: { type: "join_spymaster", player_id: playerId, team },
            }));
          }}
        />
      )}
    </div>
  );
};

export const Card: React.VFC<{
  className?: string;
  word: string;
  suggestors: { id: string; name: string; }[];
  handleAddSuggest(): void;
  handleRemoveSuggest(): void;
  handleSelect(): void;
  role: number | null;
}> = ({ className, word, handleAddSuggest, handleRemoveSuggest, suggestors, handleSelect, role }) => {
  const [suggesting, setSuggesting] = useState<boolean>(false);

  return (
    <div
      className={clsx(
        className,
        ["relative"],
        [
          { "bg-slate-600": role === -1 },
          { "bg-slate-100": role === 0 },
          { "bg-cyan-200": role === 1 },
          { "bg-orange-200": role === 2 },
        ],
        [
          "border",
          "rounded-md",
          [
            { "bg-slate-800": role === -1 },
            { "border-slate-300": role === 0 },
            { "border-cyan-400": role === 1 },
            { "border-orange-400": role === 2 },
          ],
        ],
        ["shadow-md"],
        ["select-none"],
        [["w-36"], ["h-24"]],
        [["px-2"], ["py-2"]],
        ["flex", ["flex-col"]],
      )}
      onClick={(e) => {
        e.preventDefault();

        setSuggesting((v) => !v);

        if (suggesting) handleRemoveSuggest();
        else handleAddSuggest();
      }}
    >
      <span
        className={clsx(
          [
            {
              "text-slate-900": !role || role !== -1,
              "text-white": role === -1,
            },
          ],
          ["text-center"],
        )}
      >
        {word}
      </span>
      <div className={clsx(["flex", ["flex-col"]])}>
        {suggestors.map(({ id, name }) => (
          <div key={id}>
            <span
              className={clsx(
                [
                  {
                    "text-slate-900": !role || role !== -1,
                    "text-white": role === -1,
                  },
                ],
                ["text-sm"],
              )}
            >
              {name}
            </span>
          </div>
        ))}
      </div>
      <button
        className={clsx(
          ["absolute"],
          [["-top-4"], ["-right-4"]],
          [["w-8"], ["h-8"]],
          ["rounded-full"],
          ["bg-blue-300"],
          ["text-sm"],
          ["text-white"],
        )}
        onClick={(e) => {
          e.preventDefault();
          handleSelect();
        }}
      >
        GO!
      </button>
    </div>
  );
};

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
    <div className={clsx(className)}>
      <div>
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
      <div>
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

export const Game: React.VFC<{
  handleAddSuggest(key: number): void;
  handleRemoveSuggest(key: number): void;
  handleSelect(key: number): void;
  handleJoinOperative(team: number): void;
  handleJoinSpymaster(team: number): void;
  game: {
    dimension: [number, number];
    deck: { key: number; word: string; role: number | null; suggestedBy: string[]; }[];
    teams: { operatives: { playerId: string; }[]; spymasters: { playerId: string; }[]; }[];
  };
  playerList: { id: string; name: string; }[];
}> = (
  {
    game,
    playerList,
    handleAddSuggest: handleSuggest,
    handleRemoveSuggest,
    handleSelect,
    handleJoinOperative,
    handleJoinSpymaster,
  },
) => {
  return (
    <div className={clsx(["flex"], ["justify-center"])}>
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
      <div
        className={clsx(["grid", ["gap-6"]])}
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
    </div>
  );
};
