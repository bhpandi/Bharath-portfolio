import { put, list, del } from "@vercel/blob";
import { unstable_noStore as noStore } from "next/cache";
import { defaultPortfolioData, type PortfolioData } from "@/data/portfolio";

// Prefix for all portfolio data blobs
const PORTFOLIO_PREFIX = "portfolio-data";

export async function getPortfolioData(): Promise<PortfolioData> {
  noStore(); // always fetch fresh — never use Next.js data cache
  try {
    // list() returns newest blob first; we always read the latest publish
    const { blobs } = await list({ prefix: PORTFOLIO_PREFIX, limit: 1 });
    if (!blobs.length) return defaultPortfolioData;
    const res = await fetch(blobs[0].url, {
      cache: "no-store",
    });
    if (!res.ok) return defaultPortfolioData;
    return await res.json();
  } catch {
    return defaultPortfolioData;
  }
}

export async function publishPortfolioData(
  data: PortfolioData
): Promise<{ ok: boolean; url?: string; error?: string }> {
  try {
    // Snapshot existing blobs BEFORE writing so we can clean them up
    const { blobs: existing } = await list({ prefix: PORTFOLIO_PREFIX, limit: 20 });

    // Each publish gets a unique timestamped key → fresh CDN URL, no stale cache
    const key = `${PORTFOLIO_PREFIX}-${Date.now()}.json`;
    const blob = await put(key, JSON.stringify(data), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    });

    // Delete previous blobs after the new one is safely written
    if (existing.length > 0) {
      await Promise.all(existing.map((b) => del(b.url)));
    }

    return { ok: true, url: blob.url };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
