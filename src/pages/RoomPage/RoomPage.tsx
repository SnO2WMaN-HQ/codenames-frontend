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
      {isPlaying && <p>Is Playing</p>}
    </div>
  );
};
