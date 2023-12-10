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

// TODO: add unit test to make sure my pick order thing works
// TODO: add unit test to make sure that the player goes to correct team when drafted
// TODO: add unit test to test undo

// TODO: somehow make it so when i leave the home page and scroll down i will return to the spot i scrolled to
// TODO: make it all work on a server instead of on one client only - honestly pretty sure react query could solve all the state management
// TODO: change the styling to reusable components that all have the same color scheme - mostly the buttons need to be fixed imo
// TODO: could try to implement some kind of drag and drop to display certain rosters? - this is new goal
// i think it's best to start with drag and drop for players between rosters
// might be kind of dumb to do it though because most of the apps i use don't even work like this

// TODO: fix routing or make it actually work the nextjs way - make it so we actually ssr

// TODO: make a picked player list with same filters etc
// TODO: return entire list of players by position so when i filter i can see all that i actually need and draft button still works same i think ?

// filter plan: save in state what we want to filter by -> default: nothing
// after clicking it we need to pass something into the mapping function in home component that decides which players we show

/*
  *** I'm pretty sure this plan is fucked unless I set up another server because Next.js is serverless by default potentially *** 
  TODO: web socket plan:
  I'm assuming I would need to save the teams and drafted players in a db, not sure how to deal with the possibility of 
  thousands of users using the website at once but we will cross that bridge when we get there

  need to have a draft "key" to join a room - need to have each player choose their pick # and remove it from teh available picks
  once it's taken

  possibly require them to choose a name but I'm not too sure on this one

  only let them pick a player when it's their turn to draft

  this may be the ideal time to move everything from zustand to the server
  technically wouldn't need to do this, could just broadcast which player was picked then everyone's client could independently update
  and keep track of state locally



*/

const positionArray = ["ALL", "WR", "RB", "QB", "TE", "DST", "K"];

const Home: NextPage = () => {
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
        <DepthDropDown
          title={"DEPTH CHARTS"}
          urlArray={teamsUrls}
          arr={teamsArr}
        />
        <DropDownMenu
          title={"ROSTERS"}
          urlParam={"roster"}
          arr={Object.keys(rosters)}
        />
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

export default Home;

/* 
  does it make sense to getserversideprops to fetch the teams? 
  I Think it only makes sense if i want to store the teams in a db - > it doesnt' really make sense because i don't give a shit about seo 
  it could make sense if i wanted to add the teams depth charts though


  ideas to practice SSR: 
    add my own depth charts just of the most important information and then ssr them because they won't really be updating
    then they will be cached so once they load the first time it will be a bit slow, but after that we should be able to access them instantly 


*/

// TODO: Formdata?
