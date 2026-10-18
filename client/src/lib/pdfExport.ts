// PDF export for Shear Bolt Calculator — EN 1993-1-8 Section 3.8
import { jsPDF } from "jspdf";
import type { CalculationResult } from "./boltShearCalculator";

function fmt(v: number, d = 2): string {
  return v.toLocaleString("en-GB", { minimumFractionDigits: d, maximumFractionDigits: d });
}

export function downloadCalculationPdf(result: CalculationResult): void {
  const pdf = new jsPDF({ unit: "mm", format: "a4" });

  const ink    = "#102b40";
  const brass  = "#c57a36";
  const slate  = "#718592";
  const paper  = "#f7f4ed";
  const safe   = result.passes;

  const m  = 16;          // margin
  const pw = 210;         // page width
  const cw = pw - m * 2; // content width
  let y    = 0;

  // ── Page background ──────────────────────────────────────────────────────
  pdf.setFillColor(paper);
  pdf.rect(0, 0, 210, 297, "F");

  // ── Header bar ───────────────────────────────────────────────────────────
  pdf.setFillColor(ink);
  pdf.rect(0, 0, 210, 24, "F");
  pdf.setTextColor("#ffffff");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.text("SHEAR BOLT CALCULATOR", m, 10);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7.5);
  pdf.setTextColor("#8ea6af");
  pdf.text("EN 1993-1-8 · Section 3.8", m, 17);
  pdf.setTextColor("#c57a36");
  pdf.text(`${result.boltSize} · Class ${result.boltGrade}`, pw - m, 17, { align: "right" });

  // ── PASS / FAIL banner ───────────────────────────────────────────────────
  y = 30;
  pdf.setFillColor(safe ? "#d9ede3" : "#f1dbd8");
  pdf.rect(m, y, cw, 16, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.setTextColor(safe ? "#2c6b58" : "#a14338");
  pdf.text(safe ? "✓  SAFE" : "✗  NOT SAFE (N.S.)", m + 6, y + 10);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(ink);
  const compareText = `Fv,Ed = ${fmt(result.appliedShear)} kN  ${safe ? "≤" : ">"}  Fv,Rd = ${fmt(result.boltResistance)} kN`;
  pdf.text(compareText, pw - m, y + 10, { align: "right" });

  // ── Section: Inputs ───────────────────────────────────────────────────────
  y = 54;
  sectionTitle(pdf, "INPUTS", m, y, cw, brass, ink);
  y += 8;

  const inputs: [string, string][] = [
    ["Bolt grade",                             result.boltGrade],
    ["Bolt size",                              result.boltSize],
    ["Number of shear planes, ns",            `${result.numberOfShearPlanes}  (${result.numberOfShearPlanes === 1 ? "Single Shear" : "Double Shear"})`],
    ["Threaded shear plane",                  result.threadedShearPlane ? `YES — A = As` : `NO — A = Ag`],
    ["Applied design shear, Fv,Ed",           `${fmt(result.appliedShear)} kN`],
    ["Partial safety factor, γM2",            fmt(result.gammaM2, 2)],
  ];
  y = twoColTable(pdf, inputs, m, y, cw, ink, slate, paper);

  // ── Section: Bolt Properties ──────────────────────────────────────────────
  y += 5;
  sectionTitle(pdf, "BOLT PROPERTIES", m, y, cw, brass, ink);
  y += 8;

  const boltProps: [string, string][] = [
    ["Nominal diameter, d",                   `${result.bolt.diameter} mm`],
    ["Gross area, Ag",                        `${fmt(result.bolt.grossArea, 1)} mm²`],
    ["Stress area, As",                       `${fmt(result.bolt.stressArea, 1)} mm²`],
    ["Applicable area, A",                    `${fmt(result.applicableArea, 1)} mm²  (${result.areaSymbol})`],
    ["Yield strength, fyb",                   `${result.grade.fyb} MPa`],
    ["Ultimate strength, fub",                `${result.grade.fub} MPa`],
    ["Bolt shear factor, αv",                 fmt(result.alphaV, 2)],
  ];
  y = twoColTable(pdf, boltProps, m, y, cw, ink, slate, paper);

  // ── Section: Results ──────────────────────────────────────────────────────
  y += 5;
  sectionTitle(pdf, "RESULTS", m, y, cw, brass, ink);
  y += 8;

  const results: [string, string][] = [
    ["Design shear resistance per plane, Fv,Rd,plane",  `${fmt(result.perPlaneResistance)} kN`],
    ["Bolt shear resistance, Fv,Rd",                    `${fmt(result.boltResistance)} kN`],
    ["Applied design shear, Fv,Ed",                     `${fmt(result.appliedShear)} kN`],
    ["Utilization ratio, UC",                           fmt(result.utilizationRatio, 3)],
    ["Status",                                          safe ? "SAFE" : "NOT SAFE (N.S.)"],
  ];
  y = twoColTable(pdf, results, m, y, cw, ink, slate, paper, safe);

  // ── Section: Calculation Steps ────────────────────────────────────────────
  y += 5;
  sectionTitle(pdf, "CALCULATION STEPS", m, y, cw, brass, ink);
  y += 10;

  const steps: [string, string][] = [
    ["Fv,Rd,plane = αv × fub × A / γM2",
     `= (${fmt(result.alphaV, 2)} × ${result.grade.fub} × ${fmt(result.applicableArea, 1)}) / ${fmt(result.gammaM2, 2)}  =  ${fmt(result.perPlaneResistanceN, 1)} N  =  ${fmt(result.perPlaneResistance)} kN`],
    ["Fv,Rd = ns × Fv,Rd,plane",
     `= ${result.numberOfShearPlanes} × ${fmt(result.perPlaneResistance)}  =  ${fmt(result.boltResistance)} kN`],
    ["UC = Fv,Ed / Fv,Rd",
     `= ${fmt(result.appliedShear)} / ${fmt(result.boltResistance)}  =  ${fmt(result.utilizationRatio, 3)}  →  ${safe ? "SAFE (UC ≤ 1.0)" : "NOT SAFE, N.S. (UC > 1.0)"}`],
  ];

  steps.forEach(([formula, value]) => {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8.5);
    pdf.setTextColor(ink);
    pdf.text(formula, m, y);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(slate);
    pdf.text(value, m + 4, y + 5);
    pdf.setDrawColor("#d9d6ce");
    pdf.setLineWidth(0.2);
    pdf.line(m, y + 8, m + cw, y + 8);
    y += 13;
  });

  // ── Footer ────────────────────────────────────────────────────────────────
  pdf.setTextColor(slate);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  pdf.text("Scope: bolt shear resistance only · EN 1993-1-8", m, 290);
  pdf.text(`Generated: ${new Date().toLocaleDateString("en-GB")}`, pw - m, 290, { align: "right" });

  // ── Save ──────────────────────────────────────────────────────────────────
  const filename = `shear-bolt-${result.boltSize}-${result.boltGrade}-${safe ? "SAFE" : "NS"}.pdf`;
  pdf.save(filename);
}

// ── helpers ───────────────────────────────────────────────────────────────────

function sectionTitle(
  pdf: jsPDF,
  text: string,
  x: number, y: number,
  w: number,
  brassColor: string,
  inkColor: string
) {
  pdf.setDrawColor(brassColor);
  pdf.setLineWidth(0.7);
  pdf.line(x, y + 3, x + w, y + 3);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(inkColor);
  pdf.text(text, x, y);
}

function twoColTable(
  pdf: jsPDF,
  rows: [string, string][],
  x: number, y: number,
  w: number,
  inkColor: string,
  slateColor: string,
  paperColor: string,
  safeState?: boolean
): number {
  const rowH = 8;
  rows.forEach(([label, value], i) => {
    const isLastStatus = i === rows.length - 1 && safeState !== undefined;
    if (i % 2 === 0) {
      pdf.setFillColor(paperColor);
      pdf.rect(x, y - 4, w, rowH, "F");
    }
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    pdf.setTextColor(slateColor);
    pdf.text(label, x + 2, y);
    pdf.setFont("helvetica", "bold");
    if (isLastStatus) {
      pdf.setTextColor(safeState ? "#2c6b58" : "#a14338");
    } else {
      pdf.setTextColor(inkColor);
    }
    pdf.text(value, x + w, y, { align: "right" });
    y += rowH;
  });
  return y;
}
