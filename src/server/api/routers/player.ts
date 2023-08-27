import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const playerRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.player.findMany({
      orderBy: [
        {
          adp: "asc",
        },
      ],
      skip: 1,
      take: 10,
    });

    if (!data) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    return data.map((player) => {
      return {
        id: player.id,
        name: player.name,
        role: player.role,
        adp: player.adp,
        team: player.team,
        bye: player.bye,
      };
    });
  }),

  infinitePosts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(10).nullish(),
        cursor: z.number().nullish(),
      })
    )
    .query(async (opts) => {
      const { input } = opts;
      const limit = input.limit ?? 10;
      const { cursor } = input;
      const players = await prisma.player.findMany({
        take: limit + 1,
        orderBy: [
          {
            adp: "asc",
          },
        ],
        cursor: cursor ? { id: cursor } : undefined,
      });

      let nextCursor = null;
      if (players.length > limit) {
        const nextItem = players.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items: players.slice(0, limit).map((player) => {
          return {
            id: player.id,
            name: player.name,
            role: player.role,
            adp: player.adp,
            team: player.team,
            bye: player.bye,
          };
        }), // Send only 'limit' number of items
        nextCursor,
      };
    }),
});

/*
  need to amke sure can't load more if there are no more players to yoink

*/
