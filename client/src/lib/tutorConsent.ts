export type TutorHistoryItem = {
  from: "tutor" | "tu";
  text: string;
  modelConsent?: boolean;
};

export type TutorMessage = {
  role: "user" | "assistant";
  content: string;
};

/** Build the payload without leaking messages written in local-only mode. */
export function buildTutorMessages(
  history: readonly TutorHistoryItem[],
): TutorMessage[] {
  return history
    .filter((message) => message.modelConsent === true)
    .slice(-20)
    .map((message) => ({
      role: message.from === "tu" ? "user" : "assistant",
      content: message.text,
    }));
}
