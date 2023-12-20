import type { PropsWithChildren } from "react";
import { Footer } from "~/components/footer";
import { Header } from "../components/header";

export const EntryLayout = (props: PropsWithChildren) => {
  return (
    <main className=" flex h-screen justify-center font-sans ">
      <div className=" relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
        <Header />
        {props.children}
        <Footer />
      </div>
    </main>
  );
};
