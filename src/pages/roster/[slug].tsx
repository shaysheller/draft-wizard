import Head from "next/head";
import { useRouter } from "next/router";
import { useContext } from "react";
import { DraftContext } from "~/context";
import { type NextPage } from "next";
import Link from "next/link";

const TeamRosterPage: NextPage<{ team: string }> = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(DraftContext);
  const teamNumber = Array.isArray(router.query.slug)
    ? router.query.slug[0]
    : router.query.slug ?? 1;

  if (teamNumber === undefined) return <div>weird page</div>;

  console.log(state.Rosters[Number(teamNumber)]?.WR);

  return (
    <>
      <Head>
        <title>{`${router.query.slug?.toString()} Current Roster`}</title>
      </Head>
      <div>Team {router.query.slug}</div>
      <table>
        <thead>
          <tr>
            <th scope="col">Position</th>
            <th scope="col">Team</th>
            <th scope="col">Bye</th>
            <th scope="col">Adp</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">QB</th>
            <td>1976</td>
            <td>9</td>
            <td>Ever fallen in love (with someone you)</td>
          </tr>
          <tr>
            <th scope="row">WR1</th>
            <td>1976</td>
            <td>9</td>
            <td>Ever fallen in love (with someone yo)</td>
          </tr>
          <tr>
            <th scope="row">WR2</th>
            <td>1976</td>
            <td>9</td>
            <td>Ever fallen in love (with someone you)</td>
          </tr>
          <tr>
            <th scope="row">RB1</th>
            <td>1976</td>
            <td>9</td>
            <td>Ever fallen in love (with someone you )</td>
          </tr>
          <tr>
            <th scope="row">RB2</th>
            <td>1976</td>
            <td>9</td>
            <td>Ever fallen in love (with someone you)</td>
          </tr>
          <tr>
            <th scope="row">TE</th>
            <td>1976</td>
            <td>9</td>
            <td>Ever fallen in love (with someone you )</td>
          </tr>
          <tr>
            <th scope="row">WR/RB</th>
            <td>1976</td>
            <td>9</td>
            <td>Ever fallen in love (with someone you e)</td>
          </tr>

          <tr>
            <th scope="row">K</th>
            <td>1976</td>
            <td>9</td>
            <td>Ever fallen in love (with someone youe)</td>
          </tr>
          <tr>
            <th scope="row">DST</th>
            <td>1976</td>
            <td>9</td>
            <td>Ever fallen in love (with someone you )</td>
          </tr>
        </tbody>
      </table>
      <Link href="/">HOME</Link>
    </>
  );
};

export default TeamRosterPage;
