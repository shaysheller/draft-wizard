import { appRouter } from "~/server/api/root";
import { prisma } from "../db";
import superjson from "superjson";
import { createServerSideHelpers } from "@trpc/react-query/server";

export const generateSSGHelper = () =>
  createServerSideHelpers({
    router: appRouter,
    // ctx: { prisma, userId: null },
    ctx: { prisma },
    transformer: superjson, // optional - adds superjson serialization
  });
