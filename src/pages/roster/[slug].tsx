import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState, useMemo } from "react";
import { DraftContext } from "~/context";
import { type NextPage } from "next";
import Link from "next/link";

const TeamRosterPage: NextPage<{ team: string }> = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(DraftContext);
  const [flexPosition, setFlexPosition] = useState("");

  const teamNumber = Array.isArray(router.query.slug)
    ? router.query.slug[0]
    : router.query.slug ?? 1;

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
      else if (wrArr[3]!.adp > rbArr[3]!.adp) return "RB";
      else return "WR";
    };

    setFlexPosition(getFlexPosition());
  }, [wrArr, rbArr]);

  if (teamNumber === undefined) return <div>weird page</div>;

  return (
    <>
      <Head>
        <title>{`Team ${router.query.slug?.toString()} Current Roster`}</title>
      </Head>
      <div>Team {router.query.slug}</div>
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
          <tr>
            <th scope="row">QB</th>
            <td>{qbArr?.[0] ? qbArr[0]?.name : "N/A"}</td>
            <td>{qbArr?.[0] ? qbArr[0]?.team : "N/A"}</td>
            <td>{qbArr?.[0] ? qbArr[0]?.bye : "N/A"}</td>
            <td>{qbArr?.[0] ? qbArr[0]?.adp : "N/A"}</td>
          </tr>
          <tr>
            <th scope="row">WR1</th>
            <td>{wrArr?.[0] ? wrArr[0]?.name : "N/A"}</td>
            <td>{wrArr?.[0] ? wrArr[0]?.team : "N/A"}</td>
            <td>{wrArr?.[0] ? wrArr[0]?.bye : "N/A"}</td>
            <td>{wrArr?.[0] ? wrArr[0]?.adp : "N/A"}</td>
          </tr>
          <tr>
            <th scope="row">WR2</th>
            <td>{wrArr?.[1] ? wrArr[1]?.name : "N/A"}</td>
            <td>{wrArr?.[1] ? wrArr[1]?.team : "N/A"}</td>
            <td>{wrArr?.[1] ? wrArr[1]?.bye : "N/A"}</td>
            <td>{wrArr?.[1] ? wrArr[1]?.adp : "N/A"}</td>
          </tr>
          <tr>
            <th scope="row">RB1</th>
            <td>{rbArr?.[0] ? rbArr[0]?.name : "N/A"}</td>
            <td>{rbArr?.[0] ? rbArr[0]?.team : "N/A"}</td>
            <td>{rbArr?.[0] ? rbArr[0]?.bye : "N/A"}</td>
            <td>{rbArr?.[0] ? rbArr[0]?.adp : "N/A"}</td>
          </tr>
          <tr>
            <th scope="row">RB2</th>
            <td>{rbArr?.[1] ? rbArr[1]?.name : "N/A"}</td>
            <td>{rbArr?.[1] ? rbArr[1]?.team : "N/A"}</td>
            <td>{rbArr?.[1] ? rbArr[1]?.bye : "N/A"}</td>
            <td>{rbArr?.[1] ? rbArr[1]?.adp : "N/A"}</td>
          </tr>
          <tr>
            <th scope="row">TE</th>
            <td>{teArr?.[0] ? teArr[0]?.name : "N/A"}</td>
            <td>{teArr?.[0] ? teArr[0]?.team : "N/A"}</td>
            <td>{teArr?.[0] ? teArr[0]?.bye : "N/A"}</td>
            <td>{teArr?.[0] ? teArr[0]?.adp : "N/A"}</td>
          </tr>
          <tr>
            {flexPosition === "RB" ? (
              <>
                <th scope="row">WR/RB</th>
                <td>{rbArr?.[2]?.name ?? "N/A"}</td>
                <td>{rbArr?.[2]?.team ?? "N/A"}</td>
                <td>{rbArr?.[2]?.bye ?? "N/A"}</td>
                <td>{rbArr?.[2]?.adp ?? "N/A"}</td>
              </>
            ) : flexPosition === "WR" ? (
              <>
                <th scope="row">WR/RB</th>
                <td>{wrArr?.[2]?.name ?? "N/A"}</td>
                <td>{wrArr?.[2]?.team ?? "N/A"}</td>
                <td>{wrArr?.[2]?.bye ?? "N/A"}</td>
                <td>{wrArr?.[2]?.adp ?? "N/A"}</td>
              </>
            ) : (
              // Default content if flexPosition is neither "RB" nor "WR"
              <>
                <th scope="row">WR/RB</th>
                <td>N/A</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>N/A</td>
              </>
            )}
          </tr>

          <tr>
            <th scope="row">K</th>
            <td>{kArr?.[0] ? kArr[0]?.name : "N/A"}</td>
            <td>{kArr?.[0] ? kArr[0]?.team : "N/A"}</td>
            <td>{kArr?.[0] ? kArr[0]?.bye : "N/A"}</td>
            <td>{kArr?.[0] ? kArr[0]?.adp : "N/A"}</td>
          </tr>
          <tr>
            <th scope="row">DST</th>
            <td>{dstArr?.[0] ? dstArr[0]?.name : "N/A"}</td>
            <td>{dstArr?.[0] ? dstArr[0]?.team : "N/A"}</td>
            <td>{dstArr?.[0] ? dstArr[0]?.bye : "N/A"}</td>
            <td>{dstArr?.[0] ? dstArr[0]?.adp : "N/A"}</td>
          </tr>
        </tbody>
      </table>
      <Link href="/">HOME</Link>
    </>
  );
};

export default TeamRosterPage;
