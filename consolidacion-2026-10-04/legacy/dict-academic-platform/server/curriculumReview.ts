import type { Request, Response } from "express";
import { completeCurriculumReview, getCurriculumReviewSettingByTaskUid, recordCurriculumProposal } from "./db";
import { sdk } from "./_core/sdk";

function sourceTypeFromUrl(url: string): "framework" | "vulnerability" | "standard" | "paper" | "regulation" {
  if (url.includes("owasp")) return "vulnerability";
  if (url.includes("nist")) return "standard";
  if (url.includes("eur-lex")) return "regulation";
  if (url.includes("acm")) return "framework";
  return "paper";
}

async function sourceIsReachable(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch(url, { method: "HEAD", redirect: "follow", signal: controller.signal, headers: { "User-Agent": "DICT-Curriculum-Review/1.0" } });
    return response.ok || response.status === 405;
  } catch { return false; }
  finally { clearTimeout(timeout); }
}

export async function runCurriculumReview(taskUid: string) {
  const setting = await getCurriculumReviewSettingByTaskUid(taskUid);
  if (!setting) return { ok: true, skipped: "orphan" as const };
  let proposed = 0;
  for (const sourceUrl of setting.sourceUrls) {
    const reachable = await sourceIsReachable(sourceUrl);
    if (!reachable) continue;
    const result = await recordCurriculumProposal({
      sourceUrl,
      sourceType: sourceTypeFromUrl(sourceUrl),
      proposedVersion: `review-${new Date().toISOString().slice(0, 7)}`,
      summary: "Source availability confirmed. A human reviewer should inspect substantive changes, release notes, vulnerabilities or standards updates before modifying course content.",
      impactAssessment: "No curriculum content was changed. This record is a proposed review only; the administration must assess scope, language variants, prerequisites, rubrics, safety implications and versioning before approval.",
    });
    if (result.created) proposed += 1;
  }
  await completeCurriculumReview(setting.id, proposed ? "proposed" : "no_change");
  return { ok: true, proposed, automaticChanges: 0 };
}

export async function curriculumReviewHandler(req: Request, res: Response) {
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) return res.status(403).json({ error: "cron-only" });
    return res.json(await runCurriculumReview(user.taskUid));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ error: message, context: { url: req.originalUrl }, timestamp: new Date().toISOString() });
  }
}
