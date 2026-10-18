// EN 1993-1-8 bolt shear resistance calculation — formulas live here, never inside React components.
import { boltGrades, BoltGrade } from "./boltGrades";
import { boltSizes, BoltSizeKey } from "./boltSizes";

export type CalculatorInputs = {
  boltGrade: BoltGrade;
  boltSize: BoltSizeKey;
  numberOfShearPlanes: 1 | 2;
  threadedShearPlane: boolean;
  appliedShear: number;
  gammaM2: number;
};

/**
 * getAlphaV — EN 1993-1-8 Table 3.4
 *
 * Unthreaded shear plane: αv = 0.6 (all grades)
 * Threaded shear plane:
 *   αv = 0.6 for grades 4.6, 5.6, 8.8
 *   αv = 0.5 for grades 4.8, 5.8, 6.8, 10.9
 */
export function getAlphaV(boltGrade: BoltGrade, threaded: boolean): number {
  if (!threaded) return 0.6;
  const alphaThreaded: Record<BoltGrade, number> = {
    "4.6": 0.6,
    "4.8": 0.5,
    "5.6": 0.6,
    "5.8": 0.5,
    "6.8": 0.5,
    "8.8": 0.6,
    "10.9": 0.5,
  };
  return alphaThreaded[boltGrade];
}

export function calculateBoltShear(inputs: CalculatorInputs) {
  const bolt = boltSizes[inputs.boltSize];
  const grade = boltGrades[inputs.boltGrade];
  const alphaV = getAlphaV(inputs.boltGrade, inputs.threadedShearPlane);
  const applicableArea = inputs.threadedShearPlane ? bolt.stressArea : bolt.grossArea;
  const areaSymbol = inputs.threadedShearPlane ? "As" : "Ag";

  // Fv,Rd,plane = αv × fub × A / γM2   [N]
  const perPlaneResistanceN = (alphaV * grade.fub * applicableArea) / inputs.gammaM2;
  // Convert to kN for display
  const perPlaneResistance = perPlaneResistanceN / 1000;

  // Fv,Rd = ns × Fv,Rd,plane
  const boltResistance = inputs.numberOfShearPlanes * perPlaneResistance;

  // UC = Fv,Ed / Fv,Rd
  const utilizationRatio = boltResistance > 0 ? inputs.appliedShear / boltResistance : 0;

  return {
    boltGrade: inputs.boltGrade,
    boltSize: inputs.boltSize,
    numberOfShearPlanes: inputs.numberOfShearPlanes,
    threadedShearPlane: inputs.threadedShearPlane,
    appliedShear: inputs.appliedShear,
    gammaM2: inputs.gammaM2,
    bolt,
    grade,
    alphaV,
    applicableArea,
    areaSymbol,
    perPlaneResistanceN,
    perPlaneResistance,
    boltResistance,
    totalResistance: boltResistance,
    utilizationRatio,
    passes: inputs.appliedShear <= boltResistance,
  };
}

export type CalculationResult = ReturnType<typeof calculateBoltShear>;
