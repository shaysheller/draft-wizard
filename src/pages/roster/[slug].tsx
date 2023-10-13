
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState, useMemo } from "react";
import { type NextPage } from "next";
import Link from "next/link";
import teamsArr from "~/utils/teams";
import { DropDownMenu } from "~/components/dropDown";
import { type RouterOutputs } from "~/utils/api";
import { useAppStore } from "~/app-store";

type Player = RouterOutputs["player"]["getAll"][number];

// plan: add everything that will be unused into the same array sorted by adp and then we will map that array to tablerows;

const TeamRosterPage: NextPage<{ team: string }> = () => {
  const router = useRouter();
  const numberOfRounds = useAppStore((state) => state.NumberOfRounds);
  const rosters = useAppStore((state) => state.Rosters);

  const [flexPosition, setFlexPosition] = useState("");

  const teamNumber = Array.isArray(router.query.slug)
    ? router.query.slug[0]
    : router.query.slug ?? 1;

  const benchSpots = numberOfRounds - 9;

  const qbArr = rosters[Number(teamNumber)]?.QB ?? [];
  const wrArr = useMemo(
    () => rosters[Number(teamNumber)]?.WR ?? [],
    [rosters, teamNumber]
  );

  const rbArr = useMemo(
    () => rosters[Number(teamNumber)]?.RB ?? [],
    [rosters, teamNumber]
  );

  const teArr = rosters[Number(teamNumber)]?.TE ?? [];
  const dstArr = rosters[Number(teamNumber)]?.DST ?? [];
  const kArr = rosters[Number(teamNumber)]?.K ?? [];

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
      <div className="flex w-full justify-center">
        <div className=" flex w-full flex-col items-center justify-center md:max-w-2xl">
          <div>Team {router.query.slug}</div>

          <DropDownMenu
            title={"DEPTH CHARTS"}
            urlParam={"depth"}
            arr={teamsArr}
          />
          <DropDownMenu
            title={"VIEW ROSTERS"}
            urlParam={"roster"}
            arr={Object.keys(rosters)}
          />
          <div className="flex w-3/4 flex-col gap-2 rounded-lg">
            <PlayerCard position="QB" player={qbArr?.[0]} />
            <PlayerCard position="WR1" player={wrArr?.[0]} />
            <PlayerCard position="WR2" player={wrArr?.[1]} />
            <PlayerCard position="RB1" player={rbArr?.[0]} />
            <PlayerCard position="RB2" player={rbArr?.[1]} />
            <PlayerCard position="TE" player={teArr?.[0]} />
            {flexPosition === "RB" && (
              <PlayerCard position="W/R" player={rbArr?.[2]} />
            )}
            {flexPosition === "WR" && (
              <PlayerCard position="W/R" player={wrArr?.[2]} />
            )}
            {flexPosition !== "RB" && flexPosition !== "WR" && (
              <PlayerCard position="W/R" />
            )}
            <PlayerCard position="K" player={kArr?.[0]} />
            <PlayerCard position="DST" player={dstArr?.[0]} />
            {benchArr.map((player: Player | undefined, i) => {
              if (player === undefined)
                return <PlayerCard key={i.toString()} position={undefined} />;
              else
                return (
                  <PlayerCard
                    key={player.name}
                    position={player.role}
                    player={player}
                  />
                );
            })}
          </div>
          <Link href="/">HOME</Link>
        </div>
      </div>
    </>
  );
};

const leftAlignSpacing = "w-8";
// could refactor this to take class constants as heigh variables probably prevent future problems
const PlayerCard = (props: {
  position: string | undefined;
  player?: Player | undefined;
  key?: string;
}) => {
  const { position, player, key } = props;

  if (!player)
    return (
      <div
        key={key}
        className={` flex h-28 w-full items-center rounded-lg bg-red-200 text-center drop-shadow-md`}
      >
        <div className="flex h-24 w-full items-center">
          <div className="flex w-1/6 text-left">
            <div className={`${leftAlignSpacing}`}></div>
            <span className="w-1/2">{position ? position : "BN"}</span>
          </div>
          <div>
            <button className="h-1/3 border bg-blue-200">XD</button>
          </div>
          <div className="w-1/5"></div>
          <span>Empty</span>
        </div>
      </div>
    );

  const playerNameArr = player.name.split(" ");
  const lastNameArr = playerNameArr.slice(1).join(" ");
  const playerName = playerNameArr[0]?.slice(0, 1) + ". " + lastNameArr;

  return (
    <div
      key={key}
      className="h-28 w-full items-center rounded-lg bg-slate-50 text-center drop-shadow-md"
    >
      <div className="flex h-24 w-full items-center">
        <div className="flex w-1/6 text-left">
          <div className={`${leftAlignSpacing}`}></div>
          <span className={`w-1/2`}>{position}</span>
        </div>
        <div>
          <button className="h-1/3 border bg-blue-200">XD</button>
        </div>

        <div className="h-full w-1/5 rounded-full"></div>
        <div className="w-2/5 text-left ">
          <p>
            <span>{playerName}</span>
          </p>
          <p>
            <span>
              {player.team} - {player.role}
            </span>
          </p>
        </div>
        <div className="w-1/5 pr-3 text-right">
          <p>
            <span>ADP</span>
          </p>
          <p>
            <span>{player.adp}</span>
          </p>
        </div>
      </div>
      <div className=" flex h-4 rounded-b-lg bg-slate-200 text-left opacity-30 ">
        <div className={`${leftAlignSpacing}`}></div>
        <span className={`font-semi-bold align-top text-xs`}>
          BYE: {player.bye}
        </span>
      </div>
    </div>
  );
};

// const BenchCard = (props: {
//   position: string | undefined;
//   player?: Player | undefined;
//   key: string;
// }) => {
//   return <div></div>;
// };

export default TeamRosterPage;
