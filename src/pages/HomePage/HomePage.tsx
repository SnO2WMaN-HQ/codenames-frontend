import ky from "ky";
import React from "react";
import { useNavigate } from "react-router-dom";

export const HomePage: React.VFC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <p>Create Room</p>
      <button
        onClick={async () => {
          const res = await ky.post(
            new URL("/room/create", import.meta.env.VITE_HTTP_ENDPOINT).toString(),
            { body: JSON.stringify({ "lang": "ja" }) },
          );
          if (200 < res.status) {
            const details = await res.json();
            console.dir(details);
            return;
          }

          const payload: { room_slug: string; } = await res.json();
          // TODO: validate payload
          navigate(`/rooms/${payload.room_slug}`);
        }}
      >
        Create
      </button>
    </div>
  );
};
