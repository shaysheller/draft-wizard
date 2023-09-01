import { api } from "~/utils/api";
import { type NextPage } from "next";
import { LoadingPage } from "~/components/loading";
import { type RouterOutputs } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import teamsArr, { teamsUrls } from "~/utils/teams";
import { positionColors } from "~/utils/positionColors";
import { DropDownMenu } from "~/components/dropDown";
import { createPortal } from "react-dom";
import { useContext, useRef, useState, useMemo, useEffect } from "react";
import { DropDownNoLink } from "~/components/dropDownNoLink";
import {
  DraftContext,
  draftPlayerFunction,
  setInitialDraftSettings,
  undoPickFunction,
} from "../context";
import { DepthDropDown } from "~/components/depthDropDown";

// TODO: want to implement infinite scrolling instead of just the click thing
// TODO: undo button
// TODO: make a picked player list with same filters etc
// TODO: return entire list of players by position so when i filter i can see all that i actually need and draft button still works same i think ?
// TODO: I think I might not need to save everything in context if i just save everything in App.tsx i'm not sure
// TODO: refactor context to jotai/zustand

// filter plan: save in state what we want to filter by -> default: nothing
// after clicking it we need to pass something into the mapping function in home component that decides which players we show

const positionArray = ["ALL", "WR", "RB", "QB", "TE", "DST", "K"];

type Player = RouterOutputs["player"]["getAll"][number];

const Home: NextPage = () => {
  const { state, dispatch } = useContext(DraftContext);
  const [currentPositionFilter, setCurrentPositionFilter] = useState("ALL");

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
    dispatch(draftPlayerFunction(player)); // don't need curretnpick
  };

  const handleFilterChange = (selectedValue: string) => {
    setCurrentPositionFilter(selectedValue);
  };

  return (
    <>
      <PageLayout>
        {state.PickNumber === -1 && <Modal />}
        {/* could add a toaster thing to alert the user that they have successfully submitted */}
        <div className=" my-6 flex h-fit flex-col items-center justify-center">
          <h1 className="text-black">ADP LIST</h1>
          <h2>PICK {state.PickedPlayers.size + 1}</h2>
          <div className="  flex">
            <DepthDropDown
              title={"DEPTH CHARTS"}
              urlArray={teamsUrls}
              arr={teamsArr}
            />
            <DropDownMenu
              title={"VIEW ROSTERS"}
              urlParam={"roster"}
              arr={Object.keys(state.Rosters)}
            />
            <DropDownNoLink
              handleSelect={handleFilterChange}
              title={"FILTER POSITION"}
              arr={positionArray}
            />
            <button
              className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              disabled={state.PickedPlayers.size < 1}
              onClick={() => dispatch(undoPickFunction())}
            >
              UNDO
            </button>
          </div>
        </div>

        <div className="flex h-full w-full flex-col gap-4 overflow-y-auto">
          {state.PickedPlayers.size >=
          Object.keys(state.Rosters).length * state.NumberOfRounds ? (
            <div>DRAFT OVER</div>
          ) : (
            <PlayerFeed
              playerArr={
                data?.pages?.flatMap((page) =>
                  page.items.filter((player) => {
                    if (currentPositionFilter === "ALL")
                      return !state.PickedPlayers.has(player.name);
                    else
                      return (
                        !state.PickedPlayers.has(player.name) &&
                        player.role === currentPositionFilter
                      );
                  })
                ) ?? []
              }
              handlePlayerDraft={handlePlayerDraft}
            />
          )}
        </div>
        {hasNextPage && !isLoading && !isFetching ? (
          <button
            // eslint-disable-next-line
            onClick={async () => await fetchNextPage()}
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            LOAD MORE
          </button>
        ) : (
          <LoadingPage />
        )}
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
      {playerArr.map((player) => (
        <Player
          player={player}
          key={player.id}
          handlePlayerDraft={props.handlePlayerDraft}
        />
      ))}
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
      className={`flex gap-3 border-b ${positionColorClass} border-slate-400 p-4`}
    >
      <div className="flex gap-4">
        <div className="flex gap-5 text-slate-300"></div>
        <span className="flex flex-col text-2xl">
          <span>{player.name}:</span>
          <span>{player.role}</span>
        </span>
        <span className="text-2xl">Team: {player.team}</span>
        <span className="text-2xl">Bye: {player.bye}</span>
        <span className="text-2xl">ADP: {player.adp}</span>
        <button
          onClick={(e) => handlePlayerDraft(player)}
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          Draft
        </button>
      </div>
    </div>
  );
};

// could make the wrapping of the modal more reusable and the internal contents more specific but idk if that is worth rn
const Modal = () => {
  const { dispatch } = useContext(DraftContext);
  const numTeamsRef = useRef<HTMLInputElement>(null);
  const pickNumberRef = useRef<HTMLInputElement>(null);
  const draftRoundsRef = useRef<HTMLInputElement>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // might only be necessary for mobile? I was able to type letters in this field on my ipad
    const a = Number(numTeamsRef.current?.value);
    const b = Number(pickNumberRef.current?.value);
    if (isNaN(a) || isNaN(b)) {
      if (isNaN(a)) numTeamsRef.current?.focus();
      if (isNaN(b)) pickNumberRef.current?.focus();
      return;
    }

    if (b > a) {
      alert("Pick # cannot be larger than # of teams - Please re-enter");
      return;
    }

    const numTeams = Number(numTeamsRef.current?.value);
    const draftPick = Number(pickNumberRef.current?.value);
    const numRounds = Number(draftRoundsRef.current?.value);

    dispatch(setInitialDraftSettings(numTeams, draftPick, numRounds));
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
              ref={pickNumberRef}
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
