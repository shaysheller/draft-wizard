import type { PropsWithChildren } from "react";
import { Footer } from "~/components/footer";
import { Header } from "./header";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="  flex h-screen justify-center ">
      <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden border-x border-slate-400 md:max-w-2xl">
        <Header />
        {props.children}
        <Footer />
      </div>
    </main>
  );
};
