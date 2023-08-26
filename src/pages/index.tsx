import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { type NextPage } from "next";
import { LoadingPage } from "~/components/loading";
import { type RouterOutputs } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Menu, Transition } from "@headlessui/react";
import teamsArr from "~/utils/teams";
import { Fragment } from "react";

/*
  1. select number of teams
  2. select your draft pick *sort of optional*
  3. store the teams somewhere - possibly in state possibly in LM 
  4. somehow navigate between pages - possibly a drop down idk
  5. need to remove players when we hit the draft button but not lose them entirely 
*/

/*
  1. filter by position but keep order


*/

const positionColors = {
  WR: "bg-green-400",
  QB: "bg-blue-500",
  RB: "bg-red-500",
  K: "bg-gray-500",
  TE: "bg-violet-500",
  DST: "bg-yellow-500",
};

const Home: NextPage = () => {
  /*
    want to implement infinite scrolling instead of just the click thing
  */

  const { data, fetchNextPage, isLoading, isFetching, hasNextPage } =
    api.player.infinitePosts.useInfiniteQuery(
      {
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const handleClick = async () => {
    await fetchNextPage();
    return;
  };

  if (!data && (isLoading || isFetching)) return <LoadingPage />;

  const allItems = data?.pages?.flatMap((page) => page.items) ?? [];

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 text-white">
          <h1>ADP LIST</h1>
          <div className="top-16 w-56 text-right">
            <Menu as="div" className="relative">
              <div>
                <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                  DEPTH CHARTS
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1 ">
                    {teamsArr.map((team) => {
                      return (
                        <Menu.Item key={team}>
                          {({ active }) => (
                            <Link
                              href={`/teams/${team}`}
                              className={`${
                                active
                                  ? "bg-violet-500 text-white"
                                  : "text-gray-900"
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              {team}
                            </Link>
                          )}
                        </Menu.Item>
                      );
                    })}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
          {allItems.map((player) => (
            <Player {...player} key={player.id} />
          ))}

          {hasNextPage && !isLoading && !isFetching ? (
            <button
              // eslint-disable-next-line
              onClick={handleClick}
              className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
              LOAD MORE
            </button>
          ) : (
            <LoadingPage />
          )}
        </div>
      </main>
    </>
  );
};

// infers the return type from example router with getall call and that returns an array so we will insert a number to get the individual player
type Player = RouterOutputs["player"]["getAll"][number];

const Player = (props: Player) => {
  const player = props;
  const positionColorClass = positionColors[player.role] || "gray-400";
  return (
    <div
      key={player.id}
      className={`flex gap-3 border-b ${positionColorClass} border-slate-400 p-4`}
    >
      <div className="flex gap-4">
        <div className="flex gap-5 text-slate-300"></div>
        <span className="text-2xl">
          {player.name}: {player.role}
        </span>
        <span className="text-2xl">Team: {player.team}</span>
        <span className="text-2xl">Bye: {player.bye}</span>
        <span className="text-2xl">ADP: {player.adp}</span>
        <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
          Draft
        </button>
      </div>
    </div>
  );
};

/* 
  depth charts
  home
  teams
  settings


*/

const NavBar = () => {
  return (
    <>
      <li>
        <Link href="/" className="hover:text-sky-500 dark:hover:text-sky-400">
          Home
        </Link>
      </li>

      {/* <li>
        <Link href="/teams" className="hover:text-sky-500 dark:hover:text-sky-400">
          Blog
        </Link>
      </li> */}
      {/* <li>
        <Link href="/depth-charts" className="hover:text-sky-500 dark:hover:text-sky-400">
          Showcase
        </Link>
      </li> */}
      <li>
        <Link
          href="/teams/tester"
          className="hover:text-sky-500 dark:hover:text-sky-400"
        >
          Test
        </Link>
      </li>
    </>
  );
};

const Header = () => {
  <div>header</div>;
};

// could try and add link to fantasy pros but it would take some wrangling in the db
// might need to separate first and last names into their own field - it still wont work perfectly for mfs with weird names though

export default Home;

/* 
  does it make sense to getserversideprops to fetch the teams? 
  I Think it only makes sense if i want to store the teams in a db - > it doesnt' really make sense because i don't give a shit about seo 
  it could make sense if i wanted to add the teams depth charts though


  ideas to practice SSR: 
    add my own depth charts just of the most important information and then ssr them because they won't really be updating
    then they will be cached so once they load the first time it will be a bit slow, but after that we should be able to access them instantly 


*/
