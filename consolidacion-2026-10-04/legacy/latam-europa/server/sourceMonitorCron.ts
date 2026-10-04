import type { Request, Response } from "express";
import { getSourceMonitoringJobByTaskUid } from "./db";
import { sdk } from "./_core/sdk";
import { runOfficialSourceChecks } from "./sourceMonitor";

export async function sourceMonitorCronHandler(req: Request, res: Response) {
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) {
      return res.status(403).json({ error: "cron-only" });
    }

    const job = await getSourceMonitoringJobByTaskUid(user.taskUid);
    if (!job) {
      return res.json({ ok: true, skipped: "orphan" });
    }

    const outcome = await runOfficialSourceChecks();
    return res.json({ ok: true, monitor: job.monitorKey, ...outcome });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error no identificado durante la comprobación de fuentes.";
    return res.status(500).json({
      error: message,
      context: { url: req.originalUrl },
      timestamp: new Date().toISOString(),
    });
  }
}
