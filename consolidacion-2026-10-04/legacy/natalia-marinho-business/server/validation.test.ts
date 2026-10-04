import { describe, expect, it } from "vitest";
import { bookingRequestInput, collaborationRequestInput, leadSubscriptionInput } from "@shared/validation";

describe("shared validation contracts", () => {
  it("normalizes valid lead input and applies the website default", () => {
    expect(leadSubscriptionInput.parse({ email: "  natalia@example.com ", language: "ES" })).toEqual({
      email: "natalia@example.com",
      language: "ES",
      source: "website",
    });
  });

  it("rejects malformed lead emails", () => {
    expect(() => leadSubscriptionInput.parse({ email: "not-an-email" })).toThrow();
  });

  it("rejects collaboration messages that are too short", () => {
    expect(() =>
      collaborationRequestInput.parse({
        name: "Natalia",
        email: "natalia@example.com",
        proposalType: "Charla",
        message: "corto",
      }),
    ).toThrow();
  });

  it("trims booking fields before persistence", () => {
    expect(
      bookingRequestInput.parse({
        name: " Natalia Marinho ",
        email: " natalia@example.com ",
        service: " Mentoring ",
      }),
    ).toMatchObject({ name: "Natalia Marinho", email: "natalia@example.com", service: "Mentoring" });
  });
});
