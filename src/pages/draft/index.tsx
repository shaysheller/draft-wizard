import { type NextPage } from "next";
import teamsArr, { teamsUrls } from "~/utils/teams";
import { DropDownMenu } from "~/components/dropDown";
import { DropDownNoLink } from "~/components/dropDownNoLink";
import { DepthDropDown } from "~/components/depthDropDown";
import { scrollToTop } from "~/utils/functions";
import { Player, useAppStore } from "~/app-store";
import {
  useRef,
  forwardRef,
  type LegacyRef,
  type Ref,
  useEffect,
  useState,
  type ReactPortal,
  useCallback,
} from "react";
import { FilledButton, UnfilledButton } from "~/components/button";
import { isInViewPort } from "~/utils/functions";
import { api } from "~/utils/api";
import { LoadingPage } from "~/components/loading";
import toast from "react-hot-toast";
import { positionColors } from "~/utils/positionColors";
import { createPortal } from "react-dom";
import { EntryLayout } from "~/layouts/entryLayout";
import { DraftLayout } from "~/layouts/draftLayout";
const positionArray = ["ALL", "WR", "RB", "QB", "TE", "DST", "K"];

// filter doesn't work when need to load more X position and the tracker doesnt hit the bott omfo the page
// example -> only ahve 2 qb's loaded and I switch filter to QB the tracker doesn't reach because there's only 2 of them
// probably need to change the scan function to check if it's way above the end point or something

const Draft = () => {
  const [currentPositionFilter, setCurrentPositionFilter] = useState("ALL");
  const pickedPlayers = useAppStore((state) => state.PickedPlayers);
  const rosters = useAppStore((state) => state.Rosters);
  const decrementPickNumber = useAppStore((state) => state.decrementPickNumber);
  const undoPick = useAppStore((state) => state.undoPick);
  const draftPick = useAppStore((state) => state.DraftPick);
  const firstPlayerRef = useRef<HTMLDivElement>(null);

  // don't delete these this is to avoid the modal while testing things
  // const setInitialDraftSettings = useAppStore(
  //   (state) => state.setInitialDraftSettings
  // );

  // useEffect(() => {
  //   setInitialDraftSettings(12, 12, 15);
  // }, [setInitialDraftSettings]);

  const handleFilterChange = (selectedValue: string) => {
    setCurrentPositionFilter(selectedValue);
  };

  const handleUndo = () => {
    toast.dismiss();
    if (pickedPlayers.size < 1)
      return toast.error("No players to undo. Please pick a player!");
    decrementPickNumber();
    const removedPlayer = undoPick();
    toast.success(`${removedPlayer} successfully undone!`);
  };

  // if (draftPick === -1) return <Modal />;

  return (
    <>
      {draftPick === -1 && <Modal />}

      <div className="my-2 flex h-fit flex-none items-center justify-center">
        <p>POSITION FILTER: </p>
        <DropDownNoLink
          handleSelect={handleFilterChange}
          title={"POSITION"}
          arr={positionArray}
        />
      </div>
      <PlayerFeed
        ref={firstPlayerRef}
        currentPositionFilter={currentPositionFilter}
      />
      <div className="flex h-fit w-full flex-col items-center justify-center text-center">
        <div className="flex w-full gap-2 pt-4 text-center">
          <div className="flex flex-1 items-center justify-center text-center">
            <p>Pick: {pickedPlayers.size + 1}</p>
          </div>
          <div className="flex-1">
            <UnfilledButton
              text={"VIEW TOP"}
              onClick={() => scrollToTop(firstPlayerRef)}
            />
          </div>
          <div className="flex-1">
            <FilledButton text={"UNDO"} onClick={() => handleUndo()} />
          </div>
        </div>
      </div>
    </>
  );
};

const PlayerFeed = forwardRef(function PlayerFeed(
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
      className=" flex w-full flex-1 flex-col gap-4 overflow-y-scroll px-4 pt-2"
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
      className={`flex h-28 w-full items-center rounded-lg bg-slate-50 py-4  text-center drop-shadow-md`}
    >
      <div className="flex w-1/3 flex-col items-center text-2xl">
        <span className="text-md">{player.name}</span>
        <span className={`${positionColorClass}`}>{player.role}</span>
      </div>
      <span className="w-1/6 text-2xl">{player.team}</span>
      <span className="w-1/6 text-2xl">Bye: {player.bye}</span>
      <span className="w-1/6 text-2xl">ADP: {player.adp}</span>
      <FilledButton
        onClick={() => handlePlayerDraft(player)}
        text="draft"
        textSize="text-sm"
      />
    </div>
  );
});

const Modal = () => {
  const setInitialDraftSettings = useAppStore(
    (state) => state.setInitialDraftSettings
  );
  const numTeamsRef = useRef<HTMLInputElement>(null);
  const draftPickRef = useRef<HTMLInputElement>(null);
  const draftRoundsRef = useRef<HTMLInputElement>(null);
  const [portal, setPortal] = useState<ReactPortal | null>(null);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // might only be necessary for mobile? I was able to type letters in this field on my ipad
      const a = Number(numTeamsRef.current?.value);
      const b = Number(draftPickRef.current?.value);
      if (isNaN(a) || isNaN(b)) {
        if (isNaN(a)) numTeamsRef.current?.focus();
        if (isNaN(b)) draftPickRef.current?.focus();
        return;
      }

      if (b > a) {
        alert("Pick # cannot be larger than # of teams - Please re-enter");
        return;
      }

      if (a < 2) {
        alert("Need at least 2 teams!");
      }

      const numTeams = Number(numTeamsRef.current?.value);
      const draftPick = Number(draftPickRef.current?.value);
      const numRounds = Number(draftRoundsRef.current?.value);

      setInitialDraftSettings(numTeams, draftPick, numRounds);
    },
    [setInitialDraftSettings]
  );

  const initializePortal = useCallback(() => {
    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 shadow-md">
        <div className="h-fit w-fit rounded-lg bg-white">
          <form
            onSubmit={onSubmit}
            className="mb-4 rounded bg-white px-8 pb-8 pt-6"
          >
            <div>
              <label
                className="mb-2 block text-sm font-bold text-gray-700"
                htmlFor="teams"
              >
                # of Teams
              </label>
              <input
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                id="teams"
                type="number"
                required
                min={1}
                max={16}
                ref={numTeamsRef}
              ></input>
            </div>
            <div>
              <label
                className="mb-2 block text-sm font-bold text-gray-700"
                htmlFor="pick"
              >
                What Pick are You?
              </label>
              <input
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                id="pick"
                required
                type="number"
                min={1}
                max={16}
                ref={draftPickRef}
              ></input>
            </div>
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="teams"
            >
              How many rounds?
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              id="teams"
              type="number"
              required
              min={1}
              max={20}
              ref={draftRoundsRef}
            ></input>
            <div className="h-4"></div>
            <div className="flex justify-center">
              <FilledButton
                text={"submit"}
                onClick={() => {
                  return "";
                }}
              />
            </div>
          </form>
        </div>
      </div>,
      document.body
    );
  }, [onSubmit]);

  useEffect(() => {
    const portal = initializePortal();
    setPortal(portal);
  }, [initializePortal]);

  return <>{portal}</>;
};

export default Draft;
