import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { commerceRouter } from "./routers/commerce";
import { createBookingRequest, createCollaborationRequest, createLead, getBookedTimes, listBookingRequests, listCollaborationRequests, listLeads, updateCollaborationStatus, updateLeadStatus } from "./db";
import { bookingAvailabilityInput, bookingRequestInput, collaborationRequestInput, collaborationStatusInput, leadStatusInput, leadSubscriptionInput } from "@shared/validation";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
  return next({ ctx });
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  commerce: commerceRouter,
  leads: router({
    subscribe: publicProcedure.input(leadSubscriptionInput).mutation(async ({ input }) => {
      await createLead(input);
      return { success: true } as const;
    }),
    list: adminProcedure.query(() => listLeads()),
    setStatus: adminProcedure.input(leadStatusInput).mutation(async ({ input }) => { await updateLeadStatus(input.id, input.status); return { success: true } as const; }),
  }),
  collaborations: router({
    request: publicProcedure.input(collaborationRequestInput).mutation(async ({ input }) => { await createCollaborationRequest(input); return { success: true } as const; }),
    list: adminProcedure.query(() => listCollaborationRequests()),
    setStatus: adminProcedure.input(collaborationStatusInput).mutation(async ({ input }) => { await updateCollaborationStatus(input.id, input.status); return { success: true } as const; }),
  }),
  bookings: router({
    request: publicProcedure.input(bookingRequestInput).mutation(async ({ input }) => {
      if (input.preferredDate && input.preferredTime) {
        const bookedTimes = await getBookedTimes(input.preferredDate);
        if (bookedTimes.includes(input.preferredTime)) throw new TRPCError({ code: "BAD_REQUEST", message: "Esta franja ya no está disponible. Elige otra hora." });
      }
      try {
        await createBookingRequest(input);
      } catch (error) {
        if (String(error).includes("booking_slot_unique") || String(error).includes("Duplicate entry")) throw new TRPCError({ code: "BAD_REQUEST", message: "Esta franja ya no está disponible. Elige otra hora." });
        throw error;
      }
      return { success: true } as const;
    }),
    availability: publicProcedure.input(bookingAvailabilityInput).query(({ input }) => getBookedTimes(input.date)),
    list: adminProcedure.query(() => listBookingRequests()),
  }),
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
