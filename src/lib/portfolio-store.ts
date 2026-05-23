import { defaultPortfolioData, type PortfolioData } from "@/data/portfolio";

const BLOB_URL_KEY = "PORTFOLIO_BLOB_URL";

// Read published portfolio data (Blob → default fallback)
export async function getPortfolioData(): Promise<PortfolioData> {
  const url = process.env[BLOB_URL_KEY];
  if (!url) return defaultPortfolioData;
  try {
    const res = await fetch(url, { next: { tags: ["portfolio-data"], revalidate: 0 } });
    if (!res.ok) return defaultPortfolioData;
    return await res.json();
  } catch {
    return defaultPortfolioData;
  }
}

// Write published portfolio data to Vercel Blob
export async function publishPortfolioData(
  data: PortfolioData
): Promise<{ ok: boolean; url?: string; error?: string }> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return {
      ok: false,
      error:
        "BLOB_READ_WRITE_TOKEN not set. Add a Blob store in Vercel Dashboard → Storage, then run `vercel env pull`.",
    };
  }

  try {
    const { put } = await import("@vercel/blob");
    const blob = await put("portfolio-data.json", JSON.stringify(data), {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true,
      token,
    });
    return { ok: true, url: blob.url };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
