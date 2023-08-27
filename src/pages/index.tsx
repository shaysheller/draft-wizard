import { api } from "~/utils/api";
import { type NextPage } from "next";
import { LoadingPage } from "~/components/loading";
import { type RouterOutputs } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import teamsArr from "~/utils/teams";
import { positionColors } from "~/utils/positionColors";
import { DropDownMenu } from "~/components/dropDown";
import { createPortal } from "react-dom";
import { useContext, useRef } from "react";
import { DraftContext, numTeamsFunction, draftPickFunction } from "../context";

const Home: NextPage = () => {
  const { state } = useContext(DraftContext);

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

  const allItems = data?.pages?.flatMap((page) => page.items) ?? [];

  return (
    <>
      <PageLayout>
        <Modal />
        <div className=" my-6 flex flex-col items-center justify-center">
          <h1 className="text-black">
            ADP LIST NUM TEAMS {state.NumTeams} PICK NUMBER {state.PickNumber}
          </h1>

          <DropDownMenu title={"DEPTH CHARTS"} arr={teamsArr} top={16} />
        </div>

        <div className="flex w-full flex-col gap-4 overflow-y-auto">
          <PlayerFeed playerArr={allItems} />

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
        </div>
      </PageLayout>
    </>
  );
};

const PlayerFeed = (props: { playerArr: Player[] }) => {
  const { playerArr } = props;
  return (
    <>
      {playerArr.map((player) => (
        <Player {...player} key={player.id} />
      ))}
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
        <span className="flex flex-col text-2xl">
          <span>{player.name}:</span>
          <span>{player.role}</span>
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

const Modal = () => {
  const { dispatch } = useContext(DraftContext);
  const numTeamsRef = useRef<HTMLInputElement>(null);
  const pickNumberRef = useRef<HTMLInputElement>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(numTeamsFunction(Number(numTeamsRef.current?.value)));
    dispatch(draftPickFunction(Number(pickNumberRef.current?.value)));
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 shadow-md">
      <div className="h-fit w-1/5 rounded-lg bg-white">
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
  USEROUTER ROUTER.BACK NEXTJS TO CLOSE MODAL??? (GO BACK IN HISTORY BASICALLY)


*/

/* 
  does it make sense to getserversideprops to fetch the teams? 
  I Think it only makes sense if i want to store the teams in a db - > it doesnt' really make sense because i don't give a shit about seo 
  it could make sense if i wanted to add the teams depth charts though


  ideas to practice SSR: 
    add my own depth charts just of the most important information and then ssr them because they won't really be updating
    then they will be cached so once they load the first time it will be a bit slow, but after that we should be able to access them instantly 


*/

/*
  1. select number of teams
  2. select your draft pick *sort of optional*
  3. store the teams somewhere - possibly in state possibly in LM 
  4. somehow navigate between pages - possibly a drop down idk
  5. need to remove players when we hit the draft button but not lose them entirely 
*/

/*
  layout


*/

/*
  1. filter by position but keep order


*/

/*
    want to implement infinite scrolling instead of just the click thing
  */

// MAKE USE EFFECT POPUP / MODAL TO SET THE STATE FOR HOW MANY TEAMS IN DRAFT THEN MAKE THE ROSTER OBJ

// const [rosterObj, setRosterObj] = useState({})

// useEffect(() => {

// },[])

/* 
  depth charts
  home
  teams
  settings


*/

// could try and add link to fantasy pros but it would take some wrangling in the db
// might need to separate first and last names into their own field - it still wont work perfectly for mfs with weird names though

// const NavBar = () => {
//   return (
//     <>
//       <li>
//         <Link href="/" className="hover:text-sky-500 dark:hover:text-sky-400">
//           Home
//         </Link>
//       </li>

//       {/* <li>
//         <Link href="/teams" className="hover:text-sky-500 dark:hover:text-sky-400">
//           Blog
//         </Link>
//       </li> */}
//       {/* <li>
//         <Link href="/depth-charts" className="hover:text-sky-500 dark:hover:text-sky-400">
//           Showcase
//         </Link>
//       </li> */}
//       <li>
//         <Link
//           href="/teams/tester"
//           className="hover:text-sky-500 dark:hover:text-sky-400"
//         >
//           Test
//         </Link>
//       </li>
//     </>
//   );
// };
