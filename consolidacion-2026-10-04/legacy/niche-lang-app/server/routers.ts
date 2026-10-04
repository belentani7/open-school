import { COOKIE_NAME } from "../shared/const.js";
import { z } from "zod";
import { upsertSyncActions } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  sync: router({
    push: protectedProcedure
      .input(
        z.object({
          actions: z.array(
            z.object({
              id: z.string().min(1).max(128),
              type: z.enum(["progress", "stats", "profile"]),
              payload: z.unknown(),
              timestamp: z.coerce.date(),
            }),
          ).min(1).max(50),
        }),
      )
      .mutation(({ ctx, input }) =>
        upsertSyncActions(
          ctx.user.id,
          input.actions.map((action) => ({
            actionId: action.id,
            actionType: action.type,
            payload: JSON.stringify(action.payload ?? null),
            clientTimestamp: action.timestamp,
          })),
        ),
      ),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
