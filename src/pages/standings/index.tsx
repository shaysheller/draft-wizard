import { useState, useRef, MutableRefObject } from "react";
import { type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "~/utils/api";

// const addTeam = (teamName: string, realName: string) => {
//   api.team.postTeam.mutate()
// };

const Standings = () => {
  const { mutate, isLoading } = api.team.postTeam.useMutation({
    onSuccess: () => {
      setTeamName("");
      setRealName("");
      setPointsAgainst("");
      setPointsFor("");
      setWins("");
      setLosses("");
    },
  });

  const [teamName, setTeamName] = useState("");
  const [realName, setRealName] = useState("");
  const [pointsFor, setPointsFor] = useState("");
  const [pointsAgainst, setPointsAgainst] = useState("");
  const [wins, setWins] = useState("");
  const [losses, setLosses] = useState("");
  const focusRef = useRef<HTMLInputElement | null>(null);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (focusRef.current) focusRef.current.focus();

    mutate({ realName, teamName, pointsFor, pointsAgainst, wins, losses });
  };

  return (
    <form
      onSubmit={(e) => onSubmit(e)}
      className="flex h-full w-full flex-col items-center justify-center bg-red-200"
    >
      <input
        ref={focusRef}
        name="teamName"
        placeholder="team name"
        onChange={(e) => setTeamName(() => e.target.value)}
        value={teamName}
      />
      <input
        name="realName"
        placeholder="real name"
        value={realName}
        onChange={(e) => setRealName(() => e.target.value)}
      />
      <input
        name="pointsFor"
        placeholder="points for"
        value={pointsFor}
        onChange={(e) => setPointsFor(() => e.target.value)}
      />
      <input
        name="pointsAgainst"
        placeholder="points against"
        value={pointsAgainst}
        onChange={(e) => setPointsAgainst(() => e.target.value)}
      />
      <input
        name="wins"
        placeholder="wins"
        value={wins}
        onChange={(e) => setWins(() => e.target.value)}
      />
      <input
        name="losses"
        placeholder="losses"
        value={losses}
        onChange={(e) => setLosses(() => e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Standings;

/*
    I think I want to maybe just add all the data to a database and then populate a table based on that ? 

    then I can go and have modals for each individual team / matchup

    then I can update the points scored by each team each week and then it will update the standings accordingly 

    but i also want to have a fallback possibly somehow


    probably need to make and populate a new table in planetscale with prisma


*/
