import { TRPCError } from "@trpc/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const teamRouter = createTRPCRouter({
  postTeam: publicProcedure
    .input(
      z.object({
        teamName: z.string(),
        realName: z.string(),
        pointsFor: z.string(),
        pointsAgainst: z.string(),
        wins: z.string(),
        losses: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      // Create a new user in the database
      console.log("hello");
      await prisma.team.create({
        data: {
          name: input.realName,
          teamName: input.teamName,
          pointsAgainst: Number(input.pointsAgainst),
          pointsFor: Number(input.pointsFor),
          wins: Number(input.wins),
          losses: Number(input.losses),
        },
      });
      return "dearlord";
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.team.findMany({
      orderBy: [{ wins: "desc" }, { pointsFor: "desc" }],
      take: 12,
    });

    const modifiedData = data.map((item) => {
      return {
        ...item,
        createdAt: item.createdAt.toISOString(),
      };
    });

    // console.log(modifiedData);

    return modifiedData;
  }),
});
