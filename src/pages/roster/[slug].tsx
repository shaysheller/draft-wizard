import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
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

  if (teamNumber === undefined) return <div>weird page</div>;

  const qbArr = state.Rosters[Number(teamNumber)]?.QB ?? [];
  const wrArr = state.Rosters[Number(teamNumber)]?.WR ?? [];
  const rbArr = state.Rosters[Number(teamNumber)]?.RB ?? [];
  const teArr = state.Rosters[Number(teamNumber)]?.TE ?? [];
  const dstArr = state.Rosters[Number(teamNumber)]?.DST ?? [];
  const kArr = state.Rosters[Number(teamNumber)]?.K ?? [];

  const decideFlex = () => {
    if (wrArr.length < 3 && rbArr.length < 3) return;
    if (wrArr.length < 3) setFlexPosition("RB");
    if (rbArr.length < 3) setFlexPosition("WR");
  };

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
            <th scope="row">QB</th>
            <td>{teArr?.[0] ? teArr[0]?.name : "N/A"}</td>
            <td>{teArr?.[0] ? teArr[0]?.team : "N/A"}</td>
            <td>{teArr?.[0] ? teArr[0]?.bye : "N/A"}</td>
            <td>{teArr?.[0] ? teArr[0]?.adp : "N/A"}</td>
          </tr>
          <tr>
            <th scope="row">WR/RB</th>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
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
