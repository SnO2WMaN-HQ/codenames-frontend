import clsx from "clsx";
import React, { useMemo } from "react";
import { HiOutlinePlus } from "react-icons/hi";

export const Team: React.VFC<
  {
    className?: string;
    team: number;
    handleJoinOperative(team: number): void;
    handleJoinSpymaster(team: number): void;
    operatives: { playerId: string; }[];
    spymasters: { playerId: string; }[];
    me: null | { playerId: string; team: number; role: "spymaster" | "operative"; };
    findPlayer: (id: string) => undefined | { name: string; };
  }
> = ({
  className,
  team,
  operatives,
  spymasters,
  handleJoinOperative,
  handleJoinSpymaster,
  findPlayer,
  me,
}) => {
  const ops = useMemo(
    () => operatives.map(({ playerId }) => ({ id: playerId, ...findPlayer(playerId) })),
    [operatives, findPlayer],
  );
  const sms = useMemo(
    () => spymasters.map(({ playerId }) => ({ id: playerId, ...findPlayer(playerId) })),
    [spymasters, findPlayer],
  );

  const canJoinOperative = useMemo(
    () => me === null,
    [me],
  );

  const canJoinSpymaster = useMemo(
    () => me === null || (me.team === team && me.role === "operative"),
    [me, team],
  );

  return (
    <div
      className={clsx(
        className,
        ["px-4"],
        ["py-2"],
        ["border"],
        [
          team === 1 && [
            ["bg-sky-200", "dark:bg-sky-700"],
            ["border-sky-400", "dark:border-sky-400"],
          ],
          team === 2 && [
            ["bg-orange-200", "dark:bg-orange-700"],
            ["border-orange-400", "dark:border-orange-400"],
          ],
        ],
        ["flex", ["flex-col"]],
      )}
    >
      <div
        className={clsx(
          ["flex", ["flex-col"]],
        )}
      >
        <div
          className={clsx(
            ["flex", [["items-center"]]],
          )}
        >
          <span
            className={clsx(
              ["text-lg"],
              ["font-bold"],
              [
                team === 1 && [["text-sky-600", "dark:text-sky-300"]],
                team === 2 && [["text-orange-600", "dark:text-orange-300"]],
              ],
            )}
          >
            Operative
          </span>
          {canJoinOperative && (
            <button
              className={clsx(
                ["ml-2"],
                [["px-1"], ["py-1"]],
                ["rounded-md"],
                ["group"],
                ["border"],
                [
                  team === 1 && [
                    [
                      ["bg-sky-100", "hover:bg-sky-300"],
                      ["dark:bg-sky-800", "dark:hover:bg-sky-600"],
                    ],
                    ["border-sky-600", "dark:border-sky-300"],
                  ],
                  team === 2 && [
                    [
                      ["bg-orange-100", "hover:bg-orange-300"],
                      ["dark:bg-orange-800", "dark:hover:bg-orange-600"],
                    ],
                    ["border-orange-600", "dark:border-orange-300"],
                  ],
                ],
              )}
              onClick={(e) => {
                e.preventDefault();
                handleJoinOperative(team);
              }}
            >
              <HiOutlinePlus
                className={clsx(
                  [
                    team === 1 && [
                      [
                        ["text-sky-600", "group-hover:text-sky-700"],
                        ["dark:text-sky-300", "dark:group-hover:text-sky-400"],
                      ],
                    ],
                    team === 2 && [
                      [
                        ["text-orange-600", "group-hover:text-orange-700"],
                        ["dark:text-orange-300", "dark:group-hover:text-orange-400"],
                      ],
                    ],
                  ],
                )}
              />
            </button>
          )}
        </div>
        <div className={clsx(["mt-2"], ["flex"])}>
          {ops.length === 0
            && (
              <span
                className={clsx(
                  ["text-sm"],
                  ["font-bold"],
                  [
                    team === 1 && [["text-sky-600", "dark:text-sky-300"]],
                    team === 2 && [["text-orange-600", "dark:text-orange-300"]],
                  ],
                )}
              >
                NO OPERATOR
              </span>
            )}
          {ops.length > 0 && ops.map(({ id, name }) => (
            <span
              key={id}
              className={clsx(
                ["mr-1"],
                ["text-sm"],
                [
                  team === 1 && [["text-sky-600", "dark:text-sky-300"]],
                  team === 2 && [["text-orange-600", "dark:text-orange-300"]],
                ],
              )}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
      <div className={clsx(["mt-4"], ["flex", ["flex-col"]])}>
        <div
          className={clsx(
            ["flex", [["items-center"]]],
          )}
        >
          <span
            className={clsx(
              ["text-lg"],
              ["font-bold"],
              [
                team === 1 && [["text-sky-600", "dark:text-sky-300"]],
                team === 2 && [["text-orange-600", "dark:text-orange-300"]],
              ],
            )}
          >
            Spymaster
          </span>
          {canJoinSpymaster && (
            <button
              className={clsx(
                ["ml-2"],
                [["px-1"], ["py-1"]],
                ["rounded-md"],
                ["group"],
                ["border"],
                [
                  team === 1 && [
                    [
                      ["bg-sky-100", "hover:bg-sky-300"],
                      ["dark:bg-sky-800", "dark:hover:bg-sky-600"],
                    ],
                    ["border-sky-600", "dark:border-sky-300"],
                  ],
                  team === 2 && [
                    [
                      ["bg-orange-100", "hover:bg-orange-300"],
                      ["dark:bg-orange-800", "dark:hover:bg-orange-600"],
                    ],
                    ["border-orange-600", "dark:border-orange-300"],
                  ],
                ],
              )}
              onClick={(e) => {
                e.preventDefault();
                handleJoinSpymaster(team);
              }}
            >
              <HiOutlinePlus
                className={clsx(
                  [
                    team === 1 && [
                      [
                        ["text-sky-600", "group-hover:text-sky-700"],
                        ["dark:text-sky-300", "dark:group-hover:text-sky-400"],
                      ],
                    ],
                    team === 2 && [
                      [
                        ["text-orange-600", "group-hover:text-orange-700"],
                        ["dark:text-orange-300", "dark:group-hover:text-orange-400"],
                      ],
                    ],
                  ],
                )}
              />
            </button>
          )}
        </div>
        <div className={clsx([["mt-2"], "flex"])}>
          {sms.length === 0
            && (
              <span
                className={clsx(
                  ["text-sm"],
                  ["font-bold"],
                  [
                    team === 1 && [["text-sky-600", "dark:text-sky-300"]],
                    team === 2 && [["text-orange-600", "dark:text-orange-300"]],
                  ],
                )}
              >
                NO SPYMASTER
              </span>
            )}
          {sms.length > 0 && sms.map(({ id, name }) => (
            <span
              key={id}
              className={clsx(
                ["mr-1"],
                ["text-sm"],
                [
                  team === 1 && [["text-sky-600", "dark:text-sky-300"]],
                  team === 2 && [["text-orange-600", "dark:text-orange-300"]],
                ],
              )}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
