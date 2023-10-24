import { type NextPage } from "next";
import teamsArr, { teamsUrls } from "~/utils/teams";
import { PlayerFeed } from "~/components/PlayerFeed";
import { DropDownMenu } from "~/components/dropDown";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { DropDownNoLink } from "~/components/dropDownNoLink";
import { DepthDropDown } from "~/components/depthDropDown";
import { useAppStore } from "~/app-store";
import { Modal } from "~/components/Modal";
import { Button } from "~/components/button";
import { scrollToTop } from "~/utils/functions";
import { Footer } from "~/components/footer";

// TODO: make it all work on a server instead of on one client only
// TODO: change the styling to reusable components that all have the same color scheme - mostly the buttons need to be fixed imo
// TODO: could try to implement some kind of drag and drop to display certain rosters? - this is new goal
// i think it's best to start with drag and drop for players between rosters
// might be kind of dumb to do it though because most of the apps i use don't even work like this
// TODO: learn about websockets and let people join their draft? - fucked without express server I think
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
            <Button
              filled={false}
              text={"VIEW TOP"}
              onClick={() => scrollToTop(firstPlayerRef)}
            />
          </div>
          <div className="flex-1">
            <Button filled={false} text={"UNDO"} onClick={() => handleUndo()} />
          </div>
        </div>
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
