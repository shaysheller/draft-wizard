"use client";
import { Player, useAppStore } from "~/app-store";
import { useState, useEffect, useRef, forwardRef, type LegacyRef } from "react";
import { isInViewPort } from "~/utils/functions";
import { api } from "~/utils/api";
import { LoadingPage } from "./loading";
import toast from "react-hot-toast";
import { positionColors } from "~/utils/positionColors";

// may need to add debounce to this also may need to make it a client component idk
// i think preventing check from running while isfetching or isloading (praise react query) solves
export const PlayerFeed = (props: { currentPositionFilter: string }) => {
  const pickedPlayers = useAppStore((state) => state.PickedPlayers);
  const addPlayerToSet = useAppStore((state) => state.addPlayerToMap);
  const incrementPickNumber = useAppStore((state) => state.incrementPickNumber);
  const addPlayerToRoster = useAppStore((state) => state.addPlayerToRoster);
  const rosters = useAppStore((state) => state.Rosters);
  const numRounds = useAppStore((state) => state.NumberOfRounds);
  const lastPlayerRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, isLoading, isFetching, hasNextPage } =
    api.player.infinitePosts.useInfiniteQuery(
      {
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );
  const check = () => {
    if (isFetching || isLoading) return;
    if (lastPlayerRef?.current !== null) {
      if (isInViewPort(lastPlayerRef.current)) {
        hasNextPage ? fetchNextPage().catch((err) => console.error(err)) : null;
      }
    }
  };

  if ((!data && (isLoading || isFetching)) || !data?.pages[0])
    return <LoadingPage />;

  const handlePlayerDraft = (player: Player) => {
    check();
    toast.dismiss();
    toast.success(`${player.name} successfully drafted!`);
    addPlayerToSet(player);
    incrementPickNumber();
    addPlayerToRoster(player);
  };

  if (pickedPlayers.size >= Object.keys(rosters).length * numRounds)
    return <div>DRAFT OVER</div>;

  return (
    <>
      <div
        className="flex h-full w-full flex-col gap-4 overflow-y-auto"
        onScroll={check}
      >
        <div className="flex flex-col gap-4 px-4">
          {data?.pages
            ?.flatMap((page) =>
              page.items.filter((player) => {
                if (props.currentPositionFilter === "ALL")
                  return !pickedPlayers.has(player.name);
                else
                  return (
                    !pickedPlayers.has(player.name) &&
                    player.role === props.currentPositionFilter
                  );
              })
            )
            .map((player, index, arr) => (
              <Player
                player={player}
                key={player.name}
                handlePlayerDraft={handlePlayerDraft}
                ref={index === arr.length - 1 ? lastPlayerRef : null}
              />
            ))}
        </div>
      </div>
    </>
  );
};

const Player = forwardRef(function Player(
  props: {
    player: Player;
    handlePlayerDraft: (player: Player) => void;
  },
  ref: LegacyRef<HTMLDivElement> | undefined
) {
  const { player, handlePlayerDraft } = props;
  const positionColorClass = positionColors[player.role] || "gray-400";

  return (
    <div
      key={player.id}
      ref={ref}
      className={`flex h-28 w-full items-center rounded-lg bg-slate-50 text-center drop-shadow-md`}
    >
      <div className="flex w-1/3 flex-col items-center text-2xl">
        <span className="text-md">{player.name}</span>
        <span className={`${positionColorClass}`}>{player.role}</span>
      </div>
      <span className="w-1/6 text-2xl">{player.team}</span>
      <span className="w-1/6 text-2xl">Bye: {player.bye}</span>
      <span className="w-1/6 text-2xl">ADP: {player.adp}</span>
      <button
        onClick={(e) => handlePlayerDraft(player)}
        className="ml-4 h-fit w-fit rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        Draft
      </button>
    </div>
  );
});
