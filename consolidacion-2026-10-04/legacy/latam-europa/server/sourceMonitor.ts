import { officialSources } from "@shared/latam-data";
import { recordSourceCheck } from "./db";

export type SourceCheckResult = {
  slug: string;
  status: "verified" | "failed";
  statusCode: number | null;
  resolvedUrl: string;
  detail: string | null;
};

async function checkSource(slug: string, url: string): Promise<SourceCheckResult> {
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(12_000),
      headers: { "User-Agent": "LATAM-Europa-source-monitor/1.0" },
    });
    const verified = response.status >= 200 && response.status < 400;
    return {
      slug,
      status: verified ? "verified" : "failed",
      statusCode: response.status,
      resolvedUrl: response.url || url,
      detail: verified ? null : `El recurso devolvió HTTP ${response.status}.`,
    };
  } catch (error) {
    return {
      slug,
      status: "failed",
      statusCode: null,
      resolvedUrl: url,
      detail: error instanceof Error ? error.message.slice(0, 900) : "No fue posible completar la comprobación.",
    };
  }
}

export async function runOfficialSourceChecks() {
  const checkedAt = new Date();
  const results: SourceCheckResult[] = [];

  for (const source of officialSources) {
    const result = await checkSource(source.slug, source.url);
    results.push(result);
    await recordSourceCheck({
      sourceSlug: source.slug,
      runKey: `${source.slug}-${checkedAt.toISOString().slice(0, 10)}`,
      checkedAt,
      status: result.status,
      statusCode: result.statusCode,
      resolvedUrl: result.resolvedUrl,
      detail: result.detail,
    });
  }

  return {
    checkedAt: checkedAt.toISOString(),
    checked: results.length,
    verified: results.filter(result => result.status === "verified").length,
    failed: results.filter(result => result.status === "failed").length,
    results,
  };
}
