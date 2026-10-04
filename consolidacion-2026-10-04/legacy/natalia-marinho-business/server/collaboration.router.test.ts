import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(role: "admin" | "user" = "user"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "collaboration-test",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "test",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("collaborations router", () => {
  it("rejects an invalid collaboration proposal before persistence", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.collaborations.request({
      name: "A",
      email: "not-an-email",
      proposalType: "B2B",
      message: "short",
      city: "Barcelona",
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("protects collaboration proposals from non-admin users", async () => {
    const caller = appRouter.createCaller(createContext("user"));
    await expect(caller.collaborations.list()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
