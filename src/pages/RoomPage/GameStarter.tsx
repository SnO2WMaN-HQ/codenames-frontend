import React from "react";

export const GameStarter: React.VFC<{
  startable: boolean;
  startGame(
    rules: {
      wordsCount: number;
      wordsAssign: number[];
      deadWords: number;
    },
  ): void;
}> = ({ startGame, startable }) => {
  const handleRename = () => {
    startGame(
      {
        wordsCount: 25,
        wordsAssign: [9, 8],
        deadWords: 1,
      },
    );
  };

  return (
    <div>
      <button disabled={!startable} onClick={handleRename}>
        start
      </button>
    </div>
  );
};
