import clsx from "clsx";
import React, { useState } from "react";

export const PlayersList: React.VFC<{
  className?: string;
  myPlayerId: string | undefined;
  players: { id: string; name: string; isHost: boolean; }[] | undefined;
  onRename(name: string): void;
}> = (
  { className, players, onRename, myPlayerId },
) => {
  const [value, setValue] = useState<string | undefined>();

  const handleRename = () => {
    if (!value || value === "") {
      return;
    }
    onRename(value);
  };

  return (
    <div className={clsx(className)}>
      {!players && <span>Loading</span>}
      {players && (
        <div>
          {players.map(({ id, name, isHost }) => (
            <div key={id}>
              {id !== myPlayerId && <span>{name}</span>}
              {id === myPlayerId && (
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
              {isHost && <span>Host</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
