import { api } from "~/utils/api";
import { type NextPage } from "next";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { type RouterOutputs } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import teamsArr, { teamsUrls } from "~/utils/teams";
import { positionColors } from "~/utils/positionColors";
import { DropDownMenu } from "~/components/dropDown";
import { createPortal } from "react-dom";
import { useContext, useRef, useState, useMemo, useEffect } from "react";
import { toast } from "react-hot-toast";
import { DropDownNoLink } from "~/components/dropDownNoLink";
import {
  DraftContext,
  draftPlayerFunction,
  setInitialDraftSettings,
  undoPickFunction,
} from "../context";
import { DepthDropDown } from "~/components/depthDropDown";
import { useAppStore } from "~/app-store";

// TODO: need to redo the undo function to somehow give access to the player that was undone in the client so i can use it with the toaster message
// TODO: want to implement infinite scrolling instead of just the click thing
// TODO: fix routing or make it actually work the nextjs way
// TODO: make a picked player list with same filters etc
// TODO: return entire list of players by position so when i filter i can see all that i actually need and draft button still works same i think ?
// TODO: I think I might not need to save everything in context if i just save everything in App.tsx i'm not sure - stupid idea - do not do just leaving here for later
// TODO: need to refactor to zustand / jotai whichever is better

// filter plan: save in state what we want to filter by -> default: nothing
// after clicking it we need to pass something into the mapping function in home component that decides which players we show

const positionArray = ["ALL", "WR", "RB", "QB", "TE", "DST", "K"];

type Player = RouterOutputs["player"]["getAll"][number];

const Home: NextPage = () => {
  const { state, dispatch } = useContext(DraftContext);
  const [currentPositionFilter, setCurrentPositionFilter] = useState("ALL");
  const pickedPlayers = useAppStore((state) => state.PickedPlayers);
  const draftPick = useAppStore((state) => state.DraftPick);
  const numRounds = useAppStore((state) => state.NumberOfRounds);
  const rosters = useAppStore((state) => state.Rosters);
  const addPlayerToSet = useAppStore((state) => state.addPlayerToSet);
  const incrementPickNumber = useAppStore((state) => state.incrementPickNumber);
  const decrementPickNumber = useAppStore((state) => state.decrementPickNumber);
  const addPlayerToRoster = useAppStore((state) => state.addPlayerToRoster);
  const pickNumber = useAppStore((state) => state.PickNumber);

  console.log('current rosters: ', rosters);

  // might need to tinker with the refecth mechanics because it refetches every time i click back on to the page
  const { data, fetchNextPage, isLoading, isFetching, hasNextPage } =
    api.player.infinitePosts.useInfiniteQuery(
      {
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  if (!data && (isLoading || isFetching)) return <LoadingPage />;

  const handlePlayerDraft = (player: Player) => {
    toast.dismiss();
    toast.success(`${player.name} successfully drafted!`);
    addPlayerToSet(player);
    incrementPickNumber();
    addPlayerToRoster(player);// don't need curretnpick
  };

  const handleFilterChange = (selectedValue: string) => {
    setCurrentPositionFilter(selectedValue);
  };

  const handleUndo = () => {
    toast.dismiss();
    if (pickedPlayers.size < 1)
      return toast.error("No players to undo. Please pick a player!");
    decrementPickNumber();
    toast.success(`Successful undo!`);
  };

  return (
    <>
      <PageLayout>
        {draftPick === -1 && <Modal />}
        {/* could add a toaster thing to alert the user that they have successfully submitted */}
        <div className="my-2 flex h-fit flex-col items-center justify-center">
          <div>{pickNumber}</div>
          <div className="  flex">
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
        </div>

        <div className="flex h-full w-full flex-col gap-4 overflow-y-auto">
          {pickedPlayers.size >=
          Object.keys(rosters).length * numRounds ? (
            <div>DRAFT OVER</div>
          ) : (
            <PlayerFeed
              playerArr={
                data?.pages?.flatMap((page) =>
                  page.items.filter((player) => {
                    if (currentPositionFilter === "ALL")
                      return !pickedPlayers.has(player.name);
                    else
                      return (
                        !pickedPlayers.has(player.name) &&
                        player.role === currentPositionFilter
                      );
                  })
                ) ?? []
              }
              handlePlayerDraft={handlePlayerDraft}
            />
          )}
        </div>
        <div className="flex h-1/4 w-full flex-col items-center justify-center text-center">
          <div className="flex w-full gap-2 text-center">
            <div className="flex flex-1 items-center justify-center">
              {hasNextPage && !isLoading && !isFetching ? (
                <button
                  // eslint-disable-next-line
                  onClick={async () => await fetchNextPage()}
                  className="h-fit rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                >
                  LOAD MORE
                </button>
              ) : (
                <LoadingSpinner size={30} />
              )}
            </div>
            <div className="flex flex-1 items-center justify-center text-center">
              <p>Pick: {pickedPlayers.size + 1}</p>
            </div>
            <div className="flex-1">
              <button
                className="h-fit rounded border border-blue-500 px-4 py-2 font-bold text-blue-500 hover:border-blue-700 hover:text-blue-700"
                onClick={() => handleUndo()}
              >
                UNDO
              </button>
            </div>
          </div>

          <footer className="">In the Lab</footer>
        </div>
      </PageLayout>
    </>
  );
};

const PlayerFeed = (props: {
  playerArr: Player[];
  handlePlayerDraft: (player: Player) => void;
}) => {
  const { playerArr } = props;
  return (
    <>
      <div className="flex flex-col gap-4 px-4">
        {playerArr.map((player) => (
          <Player
            player={player}
            key={player.id}
            handlePlayerDraft={props.handlePlayerDraft}
          />
        ))}
      </div>
    </>
  );
};

const Player = (props: {
  player: Player;
  handlePlayerDraft: (player: Player) => void;
}) => {
  const { player, handlePlayerDraft } = props;
  const positionColorClass = positionColors[player.role] || "gray-400";
  return (
    <div
      key={player.id}
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
};

// could make the wrapping of the modal more reusable and the internal contents more specific but idk if that is worth rn
const Modal = () => {
  const setInitialDraftSettings = useAppStore((state) => state.setInitialDraftSettings)
  const numTeamsRef = useRef<HTMLInputElement>(null);
  const draftPickRef = useRef<HTMLInputElement>(null);
  const draftRoundsRef = useRef<HTMLInputElement>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

    if(a < 2) {
      alert("Need at least 2 teams!");
    }

    const numTeams = Number(numTeamsRef.current?.value);
    const draftPick = Number(draftPickRef.current?.value);
    const numRounds = Number(draftRoundsRef.current?.value);

    setInitialDraftSettings(numTeams, draftPick, numRounds);
  };

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
          <button
            className="focus:shadow-outline w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
            type="submit"
          >
            SUBMIT
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
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
