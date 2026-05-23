import { NextRequest, NextResponse } from "next/server";
import { generateDocx } from "@/lib/generate-docx";
import { defaultPortfolioData } from "@/data/portfolio";
import type { PortfolioData } from "@/data/portfolio";

const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export async function GET() {
  const buffer = await generateDocx(defaultPortfolioData);
  const name = defaultPortfolioData.personal.name.replace(/\s+/g, "_");
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": DOCX_MIME,
      "Content-Disposition": `attachment; filename="${name}_Resume.docx"`,
    },
  });
}

export async function POST(req: NextRequest) {
  const data: PortfolioData = await req.json();
  const buffer = await generateDocx(data);
  const name = (data.personal?.name ?? "Resume").replace(/\s+/g, "_");
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": DOCX_MIME,
      "Content-Disposition": `attachment; filename="${name}_Resume.docx"`,
    },
  });
}
