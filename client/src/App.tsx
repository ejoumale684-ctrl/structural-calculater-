// Shear Bolt Calculator — EN 1993-1-8 Section 3.8
import { useState, useEffect } from "react";
import { Check, FileDown, X } from "lucide-react";
import { boltGradeList, BoltGrade } from "./lib/boltGrades";
import { boltSizeList, BoltSizeKey } from "./lib/boltSizes";
import {
  calculateBoltShear,
  CalculationResult,
  CalculatorInputs,
  getAlphaV,
} from "./lib/boltShearCalculator";
import { downloadCalculationPdf } from "./lib/pdfExport";

// ─── helpers ──────────────────────────────────────────────────────────────────

function fmt(v: number, d = 2): string {
  return v.toLocaleString("en-GB", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}

// ─── defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_INPUTS: CalculatorInputs = {
  boltGrade: "8.8",
  boltSize: "M20",
  numberOfShearPlanes: 1,
  threadedShearPlane: true,
  appliedShear: 50,
  gammaM2: 1.25,
};

// ─── validation ───────────────────────────────────────────────────────────────

type ValidationErrors = Partial<Record<keyof CalculatorInputs, string>>;

type RawFormState = {
  appliedShear: string;
  gammaM2: string;
};

function validateInputs(
  raw: RawFormState,
  boltGrade: BoltGrade,
  boltSize: BoltSizeKey,
  numberOfShearPlanes: 1 | 2
): ValidationErrors {
  const errors: ValidationErrors = {};

  const appliedShear = Number(raw.appliedShear);
  if (
    raw.appliedShear.trim() === "" ||
    !Number.isFinite(appliedShear) ||
    appliedShear < 0
  ) {
    errors.appliedShear = "Must be 0 or a positive number.";
  }

  const gammaM2 = Number(raw.gammaM2);
  if (raw.gammaM2.trim() === "" || !Number.isFinite(gammaM2) || gammaM2 <= 0) {
    errors.gammaM2 = "Must be greater than 0.";
  }

  if (!boltGradeList.includes(boltGrade)) errors.boltGrade = "Select a valid grade.";
  if (!boltSizeList.includes(boltSize))   errors.boltSize  = "Select a valid size.";
  if (numberOfShearPlanes !== 1 && numberOfShearPlanes !== 2) {
    errors.numberOfShearPlanes = "Select Single or Double Shear.";
  }

  return errors;
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [boltGrade, setBoltGrade]               = useState<BoltGrade>(DEFAULT_INPUTS.boltGrade);
  const [boltSize, setBoltSize]                 = useState<BoltSizeKey>(DEFAULT_INPUTS.boltSize);
  const [numberOfShearPlanes, setShearPlanes]   = useState<1 | 2>(DEFAULT_INPUTS.numberOfShearPlanes);
  const [threadedShearPlane, setThreaded]       = useState(DEFAULT_INPUTS.threadedShearPlane);

  const [raw, setRaw] = useState<RawFormState>({
    appliedShear: String(DEFAULT_INPUTS.appliedShear),
    gammaM2:      String(DEFAULT_INPUTS.gammaM2),
  });

  const [errors, setErrors]   = useState<ValidationErrors>({});
  const [result, setResult]   = useState<CalculationResult | null>(() =>
    calculateBoltShear({
      boltGrade: DEFAULT_INPUTS.boltGrade,
      boltSize: DEFAULT_INPUTS.boltSize,
      numberOfShearPlanes: DEFAULT_INPUTS.numberOfShearPlanes,
      threadedShearPlane: DEFAULT_INPUTS.threadedShearPlane,
      appliedShear: Number(DEFAULT_INPUTS.appliedShear),
      gammaM2: Number(DEFAULT_INPUTS.gammaM2),
    })
  );

  // Live calculation: immediately recalculate whenever any input changes
  useEffect(() => {
    const errs = validateInputs(raw, boltGrade, boltSize, numberOfShearPlanes);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setResult(null);
      return;
    }

    setResult(
      calculateBoltShear({
        boltGrade,
        boltSize,
        numberOfShearPlanes,
        threadedShearPlane,
        appliedShear: Number(raw.appliedShear),
        gammaM2: Number(raw.gammaM2),
      })
    );
  }, [
    boltGrade,
    boltSize,
    numberOfShearPlanes,
    threadedShearPlane,
    raw.appliedShear,
    raw.gammaM2,
  ]);

  return (
    <div className="app">
      {/* ── HEADER ─────────────────────────────────────────────── */}
      <header className="app-header">
        <div className="app-header-inner">
          <div className="brand-mark">B</div>
          <div>
            <h1 className="app-title">Shear Bolt Calculator</h1>
            <span className="app-std">EN 1993-1-8 · Section 3.8</span>
          </div>
        </div>
      </header>

      {/* ── MAIN ───────────────────────────────────────────────── */}
      <div className="layout">

        {/* ════════ LEFT — INPUTS ════════ */}
        <section className="pane pane-inputs">
          <div className="pane-head">
            <span className="pane-label">Inputs</span>
          </div>

          <div className="fields">
            {/* Bolt Grade */}
            <div className="field">
              <label htmlFor="boltGrade" className="field-label">
                Bolt grade
              </label>
              <span className="field-hint">EN 1993-1-8 Table 3.1</span>
              <select
                id="boltGrade"
                value={boltGrade}
                onChange={e => {
                  setBoltGrade(e.target.value as BoltGrade);
                }}
              >
                {boltGradeList.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              {errors.boltGrade && <span className="field-error">{errors.boltGrade}</span>}
            </div>

            {/* Bolt Size */}
            <div className="field">
              <label htmlFor="boltSize" className="field-label">
                Bolt size
              </label>
              <span className="field-hint">Metric coarse pitch</span>
              <select
                id="boltSize"
                value={boltSize}
                onChange={e => {
                  setBoltSize(e.target.value as BoltSizeKey);
                }}
              >
                {boltSizeList.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.boltSize && <span className="field-error">{errors.boltSize}</span>}
            </div>

            {/* Shear Planes */}
            <div className="field">
              <label htmlFor="shearPlanes" className="field-label">
                Number of shear planes, n<sub>s</sub>
              </label>
              <span className="field-hint">Single or Double shear only</span>
              <select
                id="shearPlanes"
                value={numberOfShearPlanes}
                onChange={e => {
                  setShearPlanes(Number(e.target.value) as 1 | 2);
                  if (errors.numberOfShearPlanes)
                    setErrors(er => ({ ...er, numberOfShearPlanes: undefined }));
                }}
              >
                <option value={1}>Single Shear — 1</option>
                <option value={2}>Double Shear — 2</option>
              </select>
              {errors.numberOfShearPlanes && (
                <span className="field-error">{errors.numberOfShearPlanes}</span>
              )}
            </div>

            {/* Applied Shear */}
            <div className="field">
              <label htmlFor="appliedShear" className="field-label">
                Applied design shear, F<sub>v,Ed</sub>
              </label>
              <span className="field-hint">Demand · kN</span>
              <div className="unit-input">
                <input
                  id="appliedShear"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={0.01}
                  value={raw.appliedShear}
                  onChange={e => {
                    setRaw(r => ({ ...r, appliedShear: e.target.value }));
                    if (errors.appliedShear)
                      setErrors(er => ({ ...er, appliedShear: undefined }));
                  }}
                />
                <span className="unit-badge">kN</span>
              </div>
              {errors.appliedShear && <span className="field-error">{errors.appliedShear}</span>}
            </div>

            {/* Partial Safety Factor */}
            <div className="field">
              <label htmlFor="gammaM2" className="field-label">
                Partial safety factor, γ<sub>M2</sub>
              </label>
              <span className="field-hint">Default 1.25 (EN 1993-1-8)</span>
              <input
                id="gammaM2"
                type="number"
                inputMode="decimal"
                min={0.001}
                step={0.01}
                value={raw.gammaM2}
                onChange={e => {
                  setRaw(r => ({ ...r, gammaM2: e.target.value }));
                  if (errors.gammaM2)
                    setErrors(er => ({ ...er, gammaM2: undefined }));
                }}
              />
              {errors.gammaM2 && <span className="field-error">{errors.gammaM2}</span>}
            </div>

            {/* Threaded toggle */}
            <div className="toggle-row">
              <div className="toggle-labels">
                <span className="field-label">Threaded shear plane</span>
                <span className="field-hint">
                  ON → A = A<sub>s</sub> · OFF → A = A<sub>g</sub>
                </span>
              </div>
              <div className="toggle-ctrl">
                <button
                  type="button"
                  className={`switch ${threadedShearPlane ? "on" : ""}`}
                  onClick={() => { setThreaded(v => !v); }}
                  aria-pressed={threadedShearPlane}
                  aria-label="Toggle threaded shear plane"
                >
                  <span />
                </button>
                <strong className="toggle-state">
                  {threadedShearPlane ? "YES" : "NO"}
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* ════════ RIGHT — RESULTS ════════ */}
        <section className={`pane pane-results ${result ? (result.passes ? "pass" : "fail") : "idle"}`}>
          <div className="pane-head">
            <span className="pane-label">Results</span>
            {result && (
              <button
                type="button"
                className="btn-pdf"
                onClick={() => downloadCalculationPdf(result)}
                title="Download PDF"
              >
                <FileDown size={15} strokeWidth={2} />
                Download PDF
              </button>
            )}
          </div>

          {!result ? (
            <div className="results-empty">
              <span>Change any input to view live calculation results.</span>
            </div>
          ) : (
            <>
              {/* Status banner */}
              <div className={`status-banner ${result.passes ? "safe" : "ns"}`}>
                {result.passes
                  ? <><Check size={16} strokeWidth={2.5} /> SAFE</>
                  : <><X     size={16} strokeWidth={2.5} /> NOT SAFE (N.S.)</>
                }
              </div>

              {/* Key metrics */}
              <div className="result-rows">
                <ResultRow
                  label={<>Design shear resistance per plane, F<sub>v,Rd,plane</sub></>}
                  value={`${fmt(result.perPlaneResistance)} kN`}
                />
                <ResultRow
                  label={<>Bolt shear resistance, F<sub>v,Rd</sub></>}
                  value={`${fmt(result.boltResistance)} kN`}
                  accent
                />
                <ResultRow
                  label={<>Applied shear, F<sub>v,Ed</sub></>}
                  value={`${fmt(result.appliedShear)} kN`}
                />
                <ResultRow
                  label="Utilization ratio, UC"
                  value={fmt(result.utilizationRatio, 3)}
                  accent
                />
              </div>

              {/* UC bar */}
              <div className="uc-bar-wrap">
                <div className="uc-bar-track">
                  <div
                    className={`uc-bar-fill ${result.passes ? "safe" : "ns"}`}
                    style={{ width: `${Math.min(result.utilizationRatio * 100, 100)}%` }}
                  />
                </div>
                <span className="uc-bar-label">
                  F<sub>v,Ed</sub> = {fmt(result.appliedShear)} kN
                  {" "}<b>{result.passes ? "≤" : ">"}</b>{" "}
                  F<sub>v,Rd</sub> = {fmt(result.boltResistance)} kN
                </span>
              </div>

              {/* Calculation steps */}
              <CalcSteps result={result} />
            </>
          )}
        </section>
      </div>

      <footer className="app-footer">
        Scope: bolt shear resistance only · EN 1993-1-8
      </footer>
    </div>
  );
}

// ─── ResultRow ────────────────────────────────────────────────────────────────

function ResultRow({
  label, value, accent,
}: {
  label: React.ReactNode;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={`result-row ${accent ? "accent" : ""}`}>
      <span className="result-row-label">{label}</span>
      <strong className="result-row-value">{value}</strong>
    </div>
  );
}

// ─── CalcSteps ────────────────────────────────────────────────────────────────

function CalcSteps({ result }: { result: CalculationResult }) {
  const αv = getAlphaV(result.boltGrade, result.threadedShearPlane);
  const ns = result.numberOfShearPlanes;

  return (
    <div className="calc-steps">
      <span className="steps-heading">Calculation steps</span>

      <Step label={<>F<sub>v,Rd,plane</sub> = α<sub>v</sub> × f<sub>ub</sub> × A / γ<sub>M2</sub></>}>
        = ({fmt(αv, 2)} × {result.grade.fub} × {fmt(result.applicableArea, 1)}) / {fmt(result.gammaM2, 2)}
        {" "}= {fmt(result.perPlaneResistanceN, 1)} N = <b>{fmt(result.perPlaneResistance)} kN</b>
      </Step>

      <Step label={<>F<sub>v,Rd</sub> = n<sub>s</sub> × F<sub>v,Rd,plane</sub></>}>
        = {ns} × {fmt(result.perPlaneResistance)} = <b>{fmt(result.boltResistance)} kN</b>
      </Step>

      <Step label={<>UC = F<sub>v,Ed</sub> / F<sub>v,Rd</sub></>}>
        = {fmt(result.appliedShear)} / {fmt(result.boltResistance)} = <b>{fmt(result.utilizationRatio, 3)}</b>
        {" "}
        <span className={`step-verdict ${result.passes ? "verdict-safe" : "verdict-ns"}`}>
          {result.passes ? "✓ SAFE — UC ≤ 1.0" : "✗ NOT SAFE (N.S.) — UC > 1.0"}
        </span>
      </Step>
    </div>
  );
}

function Step({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="step">
      <span className="step-formula">{label}</span>
      <span className="step-value">{children}</span>
    </div>
  );
}
