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

export async function generateDocx(data: PortfolioData): Promise<Buffer> {
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
