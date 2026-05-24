import { put, list } from "@vercel/blob";
import { unstable_noStore as noStore } from "next/cache";
import { defaultPortfolioData, type PortfolioData } from "@/data/portfolio";

const PORTFOLIO_KEY = "portfolio-data.json";

export async function getPortfolioData(): Promise<PortfolioData> {
  noStore(); // always fetch fresh — never use Next.js data cache
  try {
    const { blobs } = await list({ prefix: "portfolio-data", limit: 1 });
    if (!blobs.length) return defaultPortfolioData;
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const res = await fetch(blobs[0].url, {
      cache: "no-store",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
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
    const blob = await put(PORTFOLIO_KEY, JSON.stringify(data), {
      access: "private",
      contentType: "application/json",
      allowOverwrite: true,
    });
    return { ok: true, url: blob.url };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
