import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const TeamRosterPage: NextPage<{ team: string }> = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{`${router.query.slug?.toString()} Current Roster`}</title>
      </Head>
      <div>Team {router.query.slug}</div>
    </>
  );
};

export default TeamRosterPage;
