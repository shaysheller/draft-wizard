import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState, useMemo } from "react";
import { DraftContext } from "~/context";
import { type NextPage } from "next";
import Link from "next/link";
import teamsArr from "~/utils/teams";
import { DropDownMenu } from "~/components/dropDown";
import { type RouterOutputs } from "~/utils/api";

type Player = RouterOutputs["player"]["getAll"][number];

// plan: add everything that will be unused into the same array sorted by adp and then we will map that array to tablerows;

const TeamRosterPage: NextPage<{ team: string }> = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(DraftContext);
  const [flexPosition, setFlexPosition] = useState("");

  const teamNumber = Array.isArray(router.query.slug)
    ? router.query.slug[0]
    : router.query.slug ?? 1;

  const benchSpots = state.NumberOfRounds - 9;

  const qbArr = state.Rosters[Number(teamNumber)]?.QB ?? [];
  const wrArr = useMemo(
    () => state.Rosters[Number(teamNumber)]?.WR ?? [],
    [state.Rosters, teamNumber]
  );

  const rbArr = useMemo(
    () => state.Rosters[Number(teamNumber)]?.RB ?? [],
    [state.Rosters, teamNumber]
  );

  const teArr = state.Rosters[Number(teamNumber)]?.TE ?? [];
  const dstArr = state.Rosters[Number(teamNumber)]?.DST ?? [];
  const kArr = state.Rosters[Number(teamNumber)]?.K ?? [];

  useEffect(() => {
    const getFlexPosition = () => {
      if (wrArr.length < 3 && rbArr.length < 3) return "";
      else if (wrArr.length < 3) return "RB";
      else if (rbArr.length < 3) return "WR";
      else if (wrArr[2]!.adp > rbArr[2]!.adp) return "RB";
      else return "WR";
    };

    setFlexPosition(getFlexPosition());
  }, [wrArr, rbArr]);

  const benchArr = [];

  if (flexPosition === "WR")
    benchArr.push(
      ...qbArr.slice(1),
      ...wrArr.slice(3),
      ...rbArr.slice(2),
      ...teArr.slice(1),
      ...dstArr.slice(1),
      ...kArr.slice(1)
    );
  else if (flexPosition === "RB")
    benchArr.push(
      ...qbArr.slice(1),
      ...wrArr.slice(2),
      ...rbArr.slice(3),
      ...teArr.slice(1),
      ...dstArr.slice(1),
      ...kArr.slice(1)
    );
  else
    benchArr.push(
      ...qbArr.slice(1),
      ...wrArr.slice(2),
      ...rbArr.slice(2),
      ...teArr.slice(1),
      ...dstArr.slice(1),
      ...kArr.slice(1)
    );

  benchArr.sort((a, b) => a.adp - b.adp);
  while (benchArr.length < benchSpots) benchArr.push(undefined);

  if (teamNumber === undefined) return <div>weird page</div>;

  return (
    <>
      <Head>
        <title>{`Team ${router.query.slug?.toString()} Current Roster`}</title>
      </Head>
      <div>Team {router.query.slug}</div>

      <DropDownMenu title={"DEPTH CHARTS"} urlParam={"depth"} arr={teamsArr} />
      <DropDownMenu
        title={"VIEW ROSTERS"}
        urlParam={"roster"}
        arr={Object.keys(state.Rosters)}
      />
      <table>
        <thead>
          <tr>
            <th scope="col">Position</th>
            <th scope="col">Name</th>
            <th scope="col">Team</th>
            <th scope="col">Bye</th>
            <th scope="col">Adp</th>
          </tr>
        </thead>
        <tbody>
          <TableRow position="QB" player={qbArr?.[0]} />
          <TableRow position="WR1" player={wrArr?.[0]} />
          <TableRow position="WR2" player={wrArr?.[1]} />
          <TableRow position="RB1" player={rbArr?.[0]} />
          <TableRow position="RB2" player={rbArr?.[1]} />
          <TableRow position="TE" player={teArr?.[0]} />
          {flexPosition === "RB" && (
            <TableRow position="WR/RB" player={rbArr?.[2]} />
          )}
          {flexPosition === "WR" && (
            <TableRow position="WR/RB" player={wrArr?.[2]} />
          )}
          {flexPosition !== "RB" && flexPosition !== "WR" && (
            <TableRow position="WR/RB" />
          )}
          <TableRow position="K" player={kArr?.[0]} />
          <TableRow position="DST" player={dstArr?.[0]} />
          <tr>
            <th scope="row">BENCH</th>
            <td>BENCH</td>
            <td>BENCH</td>
            <td>BENCH</td>
            <td>BENCH</td>
          </tr>
          {benchArr.map((player: Player | undefined) => {
            if (player === undefined) return <TableRow position={undefined} />;
            else
              return (
                <TableRow
                  key={player.name}
                  position={player.role}
                  player={player}
                />
              );
          })}
        </tbody>
      </table>
      <Link href="/">HOME</Link>
    </>
  );
};

const TableRow = (props: {
  position: string | undefined;
  player?: Player | undefined;
}) => {
  const { position, player } = props;

  return (
    <tr>
      <th scope="row">{position ? position : "N/A"}</th>
      <td>{player ? player.name : "N/A"}</td>
      <td>{player ? player.team : "N/A"}</td>
      <td>{player ? player.bye : "N/A"}</td>
      <td>{player ? player.adp : "N/A"}</td>
    </tr>
  );
};

export default TeamRosterPage;
