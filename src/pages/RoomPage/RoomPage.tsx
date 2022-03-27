import clsx from "clsx";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export const RoomPage: React.VFC = () => {
  const { id } = useParams<"id">();
  const wsEndpoint = useMemo<string | undefined>(
    () => id && new URL(`/rooms/${id}/join`, import.meta.env.VITE_WS_ENDPOINT).toString(),
    [id],
  );
  const wsRef = useRef<WebSocket | undefined>(undefined);

  const [connError, setConnError] = useState<boolean>(false);

  const [playerId, setPlayerId] = useState<string>();

  const [rawPlayersList, setRawPlayersList] = useState<{ id: string; name: string; }[]>();
  const playersList = useMemo<{ id: string; name: string; self: boolean; }[] | undefined>(
    () => rawPlayersList?.map(({ id, ...rest }) => ({ id, ...rest, self: id === playerId })),
    [playerId, rawPlayersList],
  );

  const sendRename = (newName: string): void => {
    if (!wsRef.current || !playerId) return;

    wsRef.current.send(JSON.stringify({
      method: "RENAME",
      payload: { player_id: playerId, new_name: newName },
    }));
  };

  useEffect(() => {
    if (!wsEndpoint) return;

    const ws = new WebSocket(wsEndpoint);

    ws.addEventListener("error", (event) => {
      setConnError(true);
    });

    ws.addEventListener("open", () => {
      const storedPlayerId = window.localStorage.getItem("player_id");

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
          window.localStorage.setItem("player_id", playerId);

          break;
        }
        case "UPDATE_ROOM": {
          const { payload } = data;
          const { players } = payload;

          setRawPlayersList(players);

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
    </div>
  );
};

export const PlayersList: React.VFC<{
  className?: string;
  players: { id: string; name: string; self: boolean; }[] | undefined;
  onRename(name: string): void;
}> = (
  { className, players, onRename },
) => {
  const [value, setValue] = useState<string | undefined>();

  const handleRename = () => {
    if (!value || value === "") return;
    onRename(value);
  };

  return (
    <div className={clsx(className)}>
      {!players && <span>Loading</span>}
      {players && (
        <div>
          {players.map(({ id, name, self }) => (
            <div key={id}>
              {!self && <span>{name}</span>}
              {self && (
                <>
                  <input
                    value={value !== undefined ? value : name}
                    placeholder={name}
                    onChange={(e) => {
                      e.preventDefault();
                      setValue(e.target.value);
                    }}
                  >
                  </input>
                  <button onClick={handleRename}>
                    rename
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
