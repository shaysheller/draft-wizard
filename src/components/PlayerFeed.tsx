"use client";
import { Player, useAppStore } from "~/app-store";
import { useRef, forwardRef, type LegacyRef, type Ref } from "react";
import { Button } from "~/components/button";
import { isInViewPort } from "~/utils/functions";
import { api } from "~/utils/api";
import { LoadingPage } from "./loading";
import toast from "react-hot-toast";
import { positionColors } from "~/utils/positionColors";

// TODO: implement jump to top button at the bottom

export const PlayerFeed = forwardRef(function PlayerFeed(
  props: { currentPositionFilter: string },
  ref: LegacyRef<HTMLDivElement> | undefined
) {
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

  if (!data || Object.keys(rosters).length * numRounds < 1) {
    return (
      <div className="flex-1">
        <LoadingPage />
      </div>
    );
  }

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
    return <div className="flex flex-1">DRAFT OVER</div>;

  return (
    <div
      onScroll={check}
      className=" flex w-full flex-1 flex-col gap-4 overflow-y-scroll px-4"
    >
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
          // if it's the first player in the array - ref that player
          // if it's the last player in the array - ref that player
          <Player
            player={player}
            key={player.name}
            handlePlayerDraft={handlePlayerDraft}
            // ref={index === arr.length - 1 ? lastPlayerRef : null}
            ref={
              index === 0
                ? (ref as Ref<HTMLDivElement>)
                : index === arr.length - 1
                ? lastPlayerRef
                : null
            }
          />
        ))}
    </div>
  );
});

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
      className={`flex h-28 w-full items-center rounded-lg bg-slate-50 py-4 text-center drop-shadow-md`}
    >
      <div className="flex w-1/3 flex-col items-center text-2xl">
        <span className="text-md">{player.name}</span>
        <span className={`${positionColorClass}`}>{player.role}</span>
      </div>
      <span className="w-1/6 text-2xl">{player.team}</span>
      <span className="w-1/6 text-2xl">Bye: {player.bye}</span>
      <span className="w-1/6 text-2xl">ADP: {player.adp}</span>
      <Button
        onClick={() => handlePlayerDraft(player)}
        text="draft"
        textSize="text-sm"
        filled={true}
      />
    </div>
  );
});
