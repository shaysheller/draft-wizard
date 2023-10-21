import { api } from "~/utils/api";
import { type NextPage } from "next";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import teamsArr, { teamsUrls } from "~/utils/teams";
import { positionColors } from "~/utils/positionColors";
import { PlayerFeed } from "~/components/PlayerFeed";
import { DropDownMenu } from "~/components/dropDown";
import { Player } from "../utils/types";
import { createPortal } from "react-dom";
import { useRef, useState, useEffect, forwardRef, LegacyRef } from "react";
import { toast } from "react-hot-toast";
import { DropDownNoLink } from "~/components/dropDownNoLink";
import { DepthDropDown } from "~/components/depthDropDown";
import { useAppStore } from "~/app-store";
import { Modal } from "~/components/Modal";
import { isInViewPort } from "~/utils/functions";

/*
  I think we need to attach a ref to the final element in the list 
  then on scroll we can check if it's in view
  if it is in view then we must refetch the next ~10 items


*/

// this is completely fucked and i'm pretty sure it has to do with server components and client components
// above may still be fucekd but currently it's working so we move
// TODO: debounce / throttle the infinite scroll because I'm just chain fetching the entire time when the thing is in viewport
// TODO: fix routing or make it actually work the nextjs way
// TODO: make a picked player list with same filters etc
// TODO: return entire list of players by position so when i filter i can see all that i actually need and draft button still works same i think ?

// filter plan: save in state what we want to filter by -> default: nothing
// after clicking it we need to pass something into the mapping function in home component that decides which players we show

const positionArray = ["ALL", "WR", "RB", "QB", "TE", "DST", "K"];

const Home: NextPage = () => {
  const [currentPositionFilter, setCurrentPositionFilter] = useState("ALL");
  const pickedPlayers = useAppStore((state) => state.PickedPlayers);
  const draftPick = useAppStore((state) => state.DraftPick);
  const rosters = useAppStore((state) => state.Rosters);
  const decrementPickNumber = useAppStore((state) => state.decrementPickNumber);
  const undoPick = useAppStore((state) => state.undoPick);
  const pickNumber = useAppStore((state) => state.PickNumber);

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

  return (
    <>
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

      <PlayerFeed currentPositionFilter={currentPositionFilter} />

      <div className="flex h-1/4 w-full flex-col items-center justify-center text-center">
        <div className="flex w-full gap-2 text-center">
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
    </>
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
