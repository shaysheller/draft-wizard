import { useState, useRef, MutableRefObject } from "react";
import { type FormEvent } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "~/utils/api";
import { LoadingSpinner } from "~/components/loading";

import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableCell,
  TableCaption,
  TableHead,
} from "~/components/table";

const Standings = () => {
  const { data, isLoading } = api.team.getAll.useQuery();

  if (isLoading || !data) return <LoadingSpinner />;

  return (
    <div className="h-full  sm:w-fit md:w-3/4 lg:w-3/4">
      <Table>
        <TableCaption>League Standings</TableCaption>
        <TableHeader className="bg-slate-200">
          <TableRow className="w-full  ">
            <TableHead className="w-100px border-r border-solid border-white">
              &nbsp;
            </TableHead>
            <TableHead className="w-100px border-r border-solid border-white">
              &nbsp;
            </TableHead>
            <TableHead className="w-100px border-r border-solid border-white">
              &nbsp;
            </TableHead>
            <TableHead
              className=" border-b border-r border-solid border-white bg-slate-300 text-center"
              colSpan={2}
            >
              Points
            </TableHead>
          </TableRow>
          <TableRow>
            <TableHead className="border-r border-solid border-white">
              Rank
            </TableHead>
            <TableHead className="border-r border-solid border-white">
              Team
            </TableHead>
            <TableHead className="border-r border-solid border-white text-right">
              W-L
            </TableHead>
            <TableHead className="border-r border-solid border-white text-center">
              For
            </TableHead>
            <TableHead className="text-center">Against</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((a, ind) => (
            <TableRow key={a.id}>
              <TableCell className="font-medium">{ind + 1}</TableCell>
              <TableCell>{a.teamName}</TableCell>
              <TableCell className="w-14">
                <div className="text-right">{`${a.wins}-${a.losses}`}</div>
              </TableCell>
              <TableCell className="text-right">{a.pointsFor}</TableCell>
              <TableCell className="text-right">{a.pointsAgainst}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// const Standings = () => {
//   const { data, isLoading } = api.team.getAll.useQuery();
//   if (isLoading) return <LoadingSpinner />;
//   return (
//     <div className="flex w-full flex-col overflow-y-scroll bg-red-200 text-center">
//       {data?.map((a) => {
//         const { teamName, name, wins, losses, pointsFor, pointsAgainst } = a;
//         return (
//           <div className="" key={a.id}>
//             <div>Team Name: {teamName}</div>
//             <div>Name: {name}</div>
//             <div>Wins: {wins}</div>
//             <div>Losses: {losses}</div>
//             <div>Points For: {pointsFor}</div>
//             <div>Points Against: {pointsAgainst}</div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// const addTeam = (teamName: string, realName: string) => {
//   api.team.postTeam.mutate()
// };

// const Standings = () => {
//   const { mutate, isLoading } = api.team.postTeam.useMutation({
//     onSuccess: () => {
//       setTeamName("");
//       setRealName("");
//       setPointsAgainst("");
//       setPointsFor("");
//       setWins("");
//       setLosses("");
//     },
//   });

//   const [teamName, setTeamName] = useState("");
//   const [realName, setRealName] = useState("");
//   const [pointsFor, setPointsFor] = useState("");
//   const [pointsAgainst, setPointsAgainst] = useState("");
//   const [wins, setWins] = useState("");
//   const [losses, setLosses] = useState("");
//   const focusRef = useRef<HTMLInputElement | null>(null);
//   const onSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (focusRef.current) focusRef.current.focus();

//     mutate({ realName, teamName, pointsFor, pointsAgainst, wins, losses });
//   };

//   return (
//     <form
//       onSubmit={(e) => onSubmit(e)}
//       className="flex h-full w-full flex-col items-center justify-center bg-red-200"
//     >
//       <input
//         ref={focusRef}
//         name="teamName"
//         placeholder="team name"
//         onChange={(e) => setTeamName(() => e.target.value)}
//         value={teamName}
//       />
//       <input
//         name="realName"
//         placeholder="real name"
//         value={realName}
//         onChange={(e) => setRealName(() => e.target.value)}
//       />
//       <input
//         name="pointsFor"
//         placeholder="points for"
//         value={pointsFor}
//         onChange={(e) => setPointsFor(() => e.target.value)}
//       />
//       <input
//         name="pointsAgainst"
//         placeholder="points against"
//         value={pointsAgainst}
//         onChange={(e) => setPointsAgainst(() => e.target.value)}
//       />
//       <input
//         name="wins"
//         placeholder="wins"
//         value={wins}
//         onChange={(e) => setWins(() => e.target.value)}
//       />
//       <input
//         name="losses"
//         placeholder="losses"
//         value={losses}
//         onChange={(e) => setLosses(() => e.target.value)}
//       />
//       <button type="submit">Submit</button>
//     </form>
//   );
// };

export default Standings;

/*
    I think I want to maybe just add all the data to a database and then populate a table based on that ? 

    then I can go and have modals for each individual team / matchup

    then I can update the points scored by each team each week and then it will update the standings accordingly 

    but i also want to have a fallback possibly somehow


    probably need to make and populate a new table in planetscale with prisma


*/
