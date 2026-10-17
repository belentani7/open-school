import { describe, expect, it } from "vitest";
import { buildTutorMessages } from "./tutorConsent";

describe("buildTutorMessages", () => {
  it("excludes welcome and messages written in local-only mode", () => {
    const result = buildTutorMessages([
      { from: "tutor", text: "Welcome" },
      { from: "tu", text: "Private question", modelConsent: false },
      { from: "tutor", text: "Local answer", modelConsent: false },
      { from: "tu", text: "Consented question", modelConsent: true },
      { from: "tutor", text: "Model reply", modelConsent: true },
    ]);

    expect(result).toEqual([
      { role: "user", content: "Consented question" },
      { role: "assistant", content: "Model reply" },
    ]);
  });

  it("sends only the most recent 20 consented messages", () => {
    const history = Array.from({ length: 24 }, (_, index) => ({
      from: index % 2 === 0 ? ("tu" as const) : ("tutor" as const),
      text: `message-${index}`,
      modelConsent: true,
    }));

    const result = buildTutorMessages(history);

    expect(result).toHaveLength(20);
    expect(result[0].content).toBe("message-4");
    expect(result[result.length - 1].content).toBe("message-23");
  });
});
