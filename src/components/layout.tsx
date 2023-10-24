import type { PropsWithChildren } from "react";
import { NavItems } from "~/components/navItems";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="  flex h-screen justify-center ">
      <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden border-x border-slate-400 md:max-w-2xl">
        <header className=" h-fit w-full">{<NavItems />}</header>
        {props.children}
      </div>
    </main>
  );
};

/*
  draft page layout thoughts:

  <pagelayout>
    <header/>
    {children}
    <footer/> (can be different depending on page?)
  </pagelayout>

*/
