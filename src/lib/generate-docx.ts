import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
} from "docx";
import type { PortfolioData } from "@/data/portfolio";

const NAVY = "1E3A5F";
const DARK = "1a1a2e";
const GRAY = "555555";
const LIGHT_GRAY = "888888";
const WHITE = "FFFFFF";
const ACCENT = "2563EB";

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 22,
        color: NAVY,
        font: "Calibri",
      }),
    ],
    spacing: { before: 280, after: 80 },
    border: {
      bottom: {
        color: ACCENT,
        space: 4,
        style: BorderStyle.SINGLE,
        size: 6,
      },
    },
  });
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: "• ", color: ACCENT, size: 19, font: "Calibri" }),
      new TextRun({ text, size: 19, color: DARK, font: "Calibri" }),
    ],
    spacing: { before: 40, after: 0 },
    indent: { left: 200 },
  });
}

function label(text: string): TextRun {
  return new TextRun({ text, bold: true, size: 20, color: NAVY, font: "Calibri" });
}

function value(text: string, options?: { color?: string }): TextRun {
  return new TextRun({
    text,
    size: 19,
    color: options?.color ?? GRAY,
    font: "Calibri",
  });
}

export async function generateDocx(
  data: PortfolioData,
  style: "classic" | "modern" | "minimal" = "classic"
): Promise<Buffer> {
  if (style === "modern") return generateModern(data);
  if (style === "minimal") return generateMinimal(data);
  return generateClassic(data);
}

async function generateClassic(data: PortfolioData): Promise<Buffer> {
  const { personal, experience, skillGroups, awards, education, languages } = data;

  const children: (Paragraph | Table)[] = [];

  // ── Header ───────────────────────────────────────────────────────────
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: personal.name,
          bold: true,
          size: 52,
          color: NAVY,
          font: "Calibri",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: personal.title,
          size: 26,
          color: ACCENT,
          bold: true,
          font: "Calibri",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: personal.email, size: 18, color: GRAY, font: "Calibri" }),
        new TextRun({ text: "  |  ", size: 18, color: LIGHT_GRAY, font: "Calibri" }),
        new TextRun({ text: personal.phone, size: 18, color: GRAY, font: "Calibri" }),
        new TextRun({ text: "  |  ", size: 18, color: LIGHT_GRAY, font: "Calibri" }),
        new TextRun({ text: personal.location, size: 18, color: GRAY, font: "Calibri" }),
        new TextRun({ text: "  |  ", size: 18, color: LIGHT_GRAY, font: "Calibri" }),
        new TextRun({ text: "LinkedIn", size: 18, color: ACCENT, font: "Calibri" }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      border: {
        bottom: { color: "CCCCCC", space: 6, style: BorderStyle.SINGLE, size: 4 },
      },
    })
  );

  // ── Summary ───────────────────────────────────────────────────────────
  children.push(
    sectionHeading("Professional Summary"),
    new Paragraph({
      children: [new TextRun({ text: personal.summary, size: 19, color: GRAY, font: "Calibri" })],
      spacing: { after: 120 },
    })
  );

  // ── Experience ────────────────────────────────────────────────────────
  children.push(sectionHeading("Work Experience"));

  experience.forEach((exp) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: exp.role, bold: true, size: 22, color: DARK, font: "Calibri" }),
        ],
        spacing: { before: 160, after: 30 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: exp.company, bold: true, size: 19, color: ACCENT, font: "Calibri" }),
          ...(exp.vendor
            ? [
                new TextRun({ text: " — ", size: 19, color: LIGHT_GRAY, font: "Calibri" }),
                new TextRun({ text: exp.vendor, size: 19, color: GRAY, font: "Calibri", italics: true }),
              ]
            : []),
          new TextRun({ text: "   ", size: 19, font: "Calibri" }),
          new TextRun({ text: exp.period, size: 18, color: LIGHT_GRAY, font: "Calibri" }),
          new TextRun({ text: "  •  ", size: 18, color: LIGHT_GRAY, font: "Calibri" }),
          new TextRun({ text: exp.location, size: 18, color: LIGHT_GRAY, font: "Calibri" }),
        ],
        spacing: { after: 60 },
      }),
      ...exp.points.map((pt) => bullet(pt)),
      new Paragraph({ children: [], spacing: { after: 60 } })
    );
  });

  // ── Skills ────────────────────────────────────────────────────────────
  children.push(sectionHeading("Skills & Technologies"));

  skillGroups.forEach((group) => {
    const skillText = group.skills.map((s) => s.name).join(", ");
    children.push(
      new Paragraph({
        children: [
          label(group.category + ": "),
          value(skillText),
        ],
        spacing: { before: 80, after: 40 },
      })
    );
  });

  // ── Education ─────────────────────────────────────────────────────────
  children.push(
    sectionHeading("Education"),
    new Paragraph({
      children: [
        new TextRun({ text: education.degree, bold: true, size: 21, color: DARK, font: "Calibri" }),
      ],
      spacing: { before: 100, after: 30 },
    }),
    new Paragraph({
      children: [
        value(education.institution),
        new TextRun({ text: "  •  ", size: 19, color: LIGHT_GRAY, font: "Calibri" }),
        value(education.period),
      ],
      spacing: { after: 120 },
    })
  );

  // ── Awards ────────────────────────────────────────────────────────────
  children.push(sectionHeading("Awards & Recognition"));

  awards.forEach((award) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "🏆 ", size: 19, font: "Calibri" }),
          new TextRun({ text: award.title, bold: true, size: 19, color: DARK, font: "Calibri" }),
          new TextRun({ text: " — " + award.subtitle, size: 19, color: GRAY, font: "Calibri" }),
          new TextRun({ text: "  |  ", size: 19, color: LIGHT_GRAY, font: "Calibri" }),
          new TextRun({ text: award.org, size: 18, color: ACCENT, font: "Calibri", italics: true }),
        ],
        spacing: { before: 80, after: 40 },
      })
    );
  });

  // ── Languages ────────────────────────────────────────────────────────
  children.push(
    sectionHeading("Languages"),
    new Paragraph({
      children: [value(languages.join(" • "))],
      spacing: { before: 80, after: 120 },
    })
  );

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 20 },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 900, bottom: 720, left: 900 },
          },
        },
        children,
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

// ── Modern Style ──────────────────────────────────────────────────────────────
async function generateModern(data: PortfolioData): Promise<Buffer> {
  const { personal, experience, skillGroups, awards, education, languages } = data;
  const PURPLE = "6D28D9";
  const DARK = "1E1B4B";
  const MID = "4C1D95";

  const children: Paragraph[] = [];

  children.push(
    new Paragraph({
      children: [new TextRun({ text: personal.name.toUpperCase(), bold: true, size: 56, color: WHITE, font: "Calibri" })],
      alignment: AlignmentType.LEFT,
      shading: { type: ShadingType.SOLID, color: DARK, fill: DARK },
      spacing: { before: 0, after: 0 },
      indent: { left: 400 },
    }),
    new Paragraph({
      children: [new TextRun({ text: personal.title, size: 24, color: "C4B5FD", font: "Calibri" })],
      alignment: AlignmentType.LEFT,
      shading: { type: ShadingType.SOLID, color: DARK, fill: DARK },
      spacing: { before: 0, after: 80 },
      indent: { left: 400 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `${personal.email}  |  ${personal.phone}  |  ${personal.location}`, size: 17, color: "A5B4FC", font: "Calibri" }),
      ],
      alignment: AlignmentType.LEFT,
      shading: { type: ShadingType.SOLID, color: DARK, fill: DARK },
      spacing: { before: 0, after: 160 },
      indent: { left: 400 },
    }),
    new Paragraph({ children: [new TextRun({ text: "PROFESSIONAL SUMMARY", bold: true, size: 18, color: WHITE, font: "Calibri" })], shading: { type: ShadingType.SOLID, color: PURPLE, fill: PURPLE }, spacing: { before: 0, after: 0 }, indent: { left: 400 } }),
    new Paragraph({ children: [new TextRun({ text: personal.summary, size: 19, color: GRAY, font: "Calibri" })], spacing: { before: 120, after: 180 } }),
    new Paragraph({ children: [new TextRun({ text: "WORK EXPERIENCE", bold: true, size: 18, color: WHITE, font: "Calibri" })], shading: { type: ShadingType.SOLID, color: PURPLE, fill: PURPLE }, spacing: { before: 0, after: 0 }, indent: { left: 400 } }),
  );

  experience.forEach((exp) => {
    children.push(
      new Paragraph({ children: [new TextRun({ text: exp.role, bold: true, size: 22, color: DARK, font: "Calibri" })], spacing: { before: 140, after: 20 } }),
      new Paragraph({ children: [new TextRun({ text: `${exp.company}${exp.vendor ? " — " + exp.vendor : ""}  ·  ${exp.period}  ·  ${exp.location}`, size: 18, color: MID, font: "Calibri" })], spacing: { after: 60 } }),
      ...exp.points.map((pt) => new Paragraph({ children: [new TextRun({ text: "▸  ", color: PURPLE, size: 18, font: "Calibri" }), new TextRun({ text: pt, size: 18, color: GRAY, font: "Calibri" })], spacing: { before: 30, after: 0 }, indent: { left: 160 } })),
    );
  });

  children.push(
    new Paragraph({ children: [new TextRun({ text: "SKILLS & TECHNOLOGIES", bold: true, size: 18, color: WHITE, font: "Calibri" })], shading: { type: ShadingType.SOLID, color: PURPLE, fill: PURPLE }, spacing: { before: 200, after: 0 }, indent: { left: 400 } }),
    ...skillGroups.map((g) => new Paragraph({ children: [new TextRun({ text: g.category + ": ", bold: true, size: 19, color: DARK, font: "Calibri" }), new TextRun({ text: g.skills.map((s) => s.name).join(", "), size: 19, color: GRAY, font: "Calibri" })], spacing: { before: 100, after: 40 } })),
    new Paragraph({ children: [new TextRun({ text: "EDUCATION", bold: true, size: 18, color: WHITE, font: "Calibri" })], shading: { type: ShadingType.SOLID, color: PURPLE, fill: PURPLE }, spacing: { before: 160, after: 0 }, indent: { left: 400 } }),
    new Paragraph({ children: [new TextRun({ text: education.degree, bold: true, size: 21, color: DARK, font: "Calibri" })], spacing: { before: 120, after: 30 } }),
    new Paragraph({ children: [new TextRun({ text: `${education.institution}  ·  ${education.period}`, size: 18, color: GRAY, font: "Calibri" })], spacing: { after: 120 } }),
    new Paragraph({ children: [new TextRun({ text: "AWARDS", bold: true, size: 18, color: WHITE, font: "Calibri" })], shading: { type: ShadingType.SOLID, color: PURPLE, fill: PURPLE }, spacing: { before: 0, after: 0 }, indent: { left: 400 } }),
    ...awards.map((a) => new Paragraph({ children: [new TextRun({ text: `${a.icon} ${a.title} — ${a.subtitle}  |  `, size: 19, color: DARK, font: "Calibri" }), new TextRun({ text: a.org, size: 18, color: MID, font: "Calibri", italics: true })], spacing: { before: 100, after: 40 } })),
    new Paragraph({ children: [new TextRun({ text: "LANGUAGES: ", bold: true, size: 19, color: DARK, font: "Calibri" }), new TextRun({ text: languages.join(" • "), size: 18, color: GRAY, font: "Calibri" })], spacing: { before: 160, after: 0 } }),
  );

  const doc = new Document({
    sections: [{ properties: { page: { margin: { top: 0, right: 800, bottom: 800, left: 0 } } }, children }],
  });
  return await Packer.toBuffer(doc);
}

// ── Minimal Style ─────────────────────────────────────────────────────────────
async function generateMinimal(data: PortfolioData): Promise<Buffer> {
  const { personal, experience, skillGroups, awards, education, languages } = data;
  const INK = "111111";
  const MID_GRAY = "777777";
  const LINE_COLOR = "DDDDDD";

  const divider = () => new Paragraph({
    children: [],
    border: { bottom: { color: LINE_COLOR, style: BorderStyle.SINGLE, size: 4, space: 4 } },
    spacing: { before: 160, after: 160 },
  });

  const children: Paragraph[] = [
    new Paragraph({ children: [new TextRun({ text: personal.name, bold: true, size: 64, color: INK, font: "Georgia" })], alignment: AlignmentType.LEFT, spacing: { after: 40 } }),
    new Paragraph({ children: [new TextRun({ text: personal.title, size: 24, color: MID_GRAY, font: "Georgia", italics: true })], spacing: { after: 60 } }),
    new Paragraph({ children: [new TextRun({ text: `${personal.email}   ${personal.phone}   ${personal.location}`, size: 18, color: MID_GRAY, font: "Georgia" })], spacing: { after: 0 } }),
    divider(),
    new Paragraph({ children: [new TextRun({ text: personal.summary, size: 20, color: INK, font: "Georgia" })], spacing: { after: 0 } }),
    divider(),
    new Paragraph({ children: [new TextRun({ text: "Experience", bold: true, size: 28, color: INK, font: "Georgia" })], spacing: { after: 120 } }),
    ...experience.flatMap((exp) => [
      new Paragraph({ children: [new TextRun({ text: exp.role, bold: true, size: 22, color: INK, font: "Georgia" }), new TextRun({ text: `   ${exp.period}`, size: 18, color: MID_GRAY, font: "Georgia" })], spacing: { before: 140, after: 30 } }),
      new Paragraph({ children: [new TextRun({ text: `${exp.company}${exp.vendor ? " · " + exp.vendor : ""}   ${exp.location}`, size: 18, color: MID_GRAY, font: "Georgia", italics: true })], spacing: { after: 60 } }),
      ...exp.points.map((pt) => new Paragraph({ children: [new TextRun({ text: `– ${pt}`, size: 19, color: INK, font: "Georgia" })], spacing: { before: 30, after: 0 }, indent: { left: 200 } })),
    ]),
    divider(),
    new Paragraph({ children: [new TextRun({ text: "Skills", bold: true, size: 28, color: INK, font: "Georgia" })], spacing: { after: 120 } }),
    ...skillGroups.map((g) => new Paragraph({ children: [new TextRun({ text: g.category + "  ", bold: true, size: 20, color: INK, font: "Georgia" }), new TextRun({ text: g.skills.map((s) => s.name).join("  ·  "), size: 19, color: MID_GRAY, font: "Georgia" })], spacing: { before: 80, after: 0 } })),
    divider(),
    new Paragraph({ children: [new TextRun({ text: "Education", bold: true, size: 28, color: INK, font: "Georgia" })], spacing: { after: 100 } }),
    new Paragraph({ children: [new TextRun({ text: education.degree, bold: true, size: 21, color: INK, font: "Georgia" })], spacing: { after: 30 } }),
    new Paragraph({ children: [new TextRun({ text: `${education.institution}   ${education.period}`, size: 18, color: MID_GRAY, font: "Georgia", italics: true })], spacing: { after: 0 } }),
    divider(),
    new Paragraph({ children: [new TextRun({ text: "Awards", bold: true, size: 28, color: INK, font: "Georgia" })], spacing: { after: 100 } }),
    ...awards.map((a) => new Paragraph({ children: [new TextRun({ text: `${a.icon}  ${a.title}`, bold: true, size: 20, color: INK, font: "Georgia" }), new TextRun({ text: `   ${a.org}`, size: 18, color: MID_GRAY, font: "Georgia", italics: true })], spacing: { before: 80, after: 0 } })),
    divider(),
    new Paragraph({ children: [new TextRun({ text: "Languages  ", bold: true, size: 20, color: INK, font: "Georgia" }), new TextRun({ text: languages.join("   "), size: 19, color: MID_GRAY, font: "Georgia" })], spacing: { after: 0 } }),
  ];

  const doc = new Document({
    sections: [{ properties: { page: { margin: { top: 900, right: 1100, bottom: 900, left: 1100 } } }, children }],
  });
  return await Packer.toBuffer(doc);
}
