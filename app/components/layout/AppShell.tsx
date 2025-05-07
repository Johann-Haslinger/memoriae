import { PropsWithChildren } from "react";

const AppShell = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <header>
        <nav></nav>
      </header>
      <main className="flex justify-center h-screen">
        <div className="w-full pt-16 lg:pt-24 xl:pt-32 2xl:pt-40 lg:w-[50rem] h-fit">{children}</div>
      </main>
    </div>
  );
};

export default AppShell;
