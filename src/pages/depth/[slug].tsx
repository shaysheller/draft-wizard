import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const DepthChartPage: NextPage<{ name: string }> = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{`${router.query.slug?.toString()} Depth Chart`}</title>
      </Head>
      <div>{router.query.slug}</div>
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

export default DepthChartPage;

/*
  Need a way to keep track of all players this person has drafted

  obviously best to store in an object
  {
    QB: []
    WR: []
    RB: []
    TE: []
    K: []
    DST: []
  }

  Fill out roster slots ->

  QB
  WR
  WR
  RB
  RB
  FLX
  TE
  DST
  K


  (num of bench slots will depend on how many rounds we want to have in draft)
  BN
  BN
  BN
  BN
  BN


  could store this all in global, but I Don't really think that makes sense because only this page should be keeping track of who has who 


*/
