import "./main.css";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { App } from "./App";
import { HomePage } from "./pages/HomePage";
import { RoomPage } from "./pages/RoomPage";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* application */}
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="rooms/:id" element={<RoomPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root"),
);
