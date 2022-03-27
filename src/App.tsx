import clsx from "clsx";
import ky from "ky";
import React from "react";
import { Outlet } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { SWRConfig } from "swr";

export const App: React.VFC = () => {
  return (
    <RecoilRoot>
      <SWRConfig value={{ fetcher: (url: string) => ky.get(url).then(res => res.json()) }}>
        <main className={clsx(["min-h-screen"], ["w-full"])}>
          <div className={clsx(["max-w-screen-lg"], ["mx-auto"])}>
            <Outlet />
          </div>
        </main>
        <footer className={clsx(["w-full"], ["py-2"])}>
          <div className={clsx(["max-w-screen-lg"], ["mx-auto"])}>
            <p>2022</p>
          </div>
        </footer>
      </SWRConfig>
    </RecoilRoot>
  );
};
