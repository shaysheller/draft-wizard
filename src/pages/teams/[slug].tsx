import type { NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

const TeamRosterPage: NextPage<{ team: string }> = ({ team }) => {
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

// export const getStaticProps: GetStaticProps = async (context) => {
//   const ssg = generateSSGHelper();

//   const id = context.params?.id;

//   if (typeof id !== "string") throw new Error("no id");

//   await ssg.posts.getById.prefetch({ id });

//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       id,
//     },
//   };
// };

// export const getStaticPaths = () => {
//   return { paths: [], fallback: "blocking" };
// };

export default TeamRosterPage;
