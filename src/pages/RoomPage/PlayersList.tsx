import clsx from "clsx";
import React, { useState } from "react";

export const PlayersList: React.VFC<{
  className?: string;
  players: { id: string; name: string; isSelf: boolean; isHost: boolean; }[] | undefined;
  onRename(name: string): void;
}> = (
  { className, players, onRename },
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
          {players.map(({ id, name, isSelf, isHost }) => (
            <div key={id}>
              {!isSelf && <span>{name}</span>}
              {isSelf && (
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
