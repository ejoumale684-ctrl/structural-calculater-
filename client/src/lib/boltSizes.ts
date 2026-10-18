// Design system: Drafting Room Ledger — source-of-truth engineering data stays separate from UI.
export type BoltSizeKey = keyof typeof boltSizes;

export const boltSizes = {
  M5: { designation: "M5", diameter: 5, grossArea: 19.6, stressArea: 14.2 },
  M6: { designation: "M6", diameter: 6, grossArea: 28.3, stressArea: 20.1 },
  M7: { designation: "M7", diameter: 7, grossArea: 38.5, stressArea: 28.9 },
  M8: { designation: "M8", diameter: 8, grossArea: 50.3, stressArea: 36.6 },
  M10: { designation: "M10", diameter: 10, grossArea: 78.5, stressArea: 58.0 },
  M12: { designation: "M12", diameter: 12, grossArea: 113, stressArea: 84.3 },
  M14: { designation: "M14", diameter: 14, grossArea: 154, stressArea: 115 },
  M16: { designation: "M16", diameter: 16, grossArea: 201, stressArea: 157 },
  M18: { designation: "M18", diameter: 18, grossArea: 254, stressArea: 192 },
  M20: { designation: "M20", diameter: 20, grossArea: 314, stressArea: 245 },
  M22: { designation: "M22", diameter: 22, grossArea: 380, stressArea: 303 },
  M24: { designation: "M24", diameter: 24, grossArea: 452, stressArea: 353 },
  M27: { designation: "M27", diameter: 27, grossArea: 573, stressArea: 459 },
  M30: { designation: "M30", diameter: 30, grossArea: 707, stressArea: 561 },
  M33: { designation: "M33", diameter: 33, grossArea: 855, stressArea: 694 },
  M36: { designation: "M36", diameter: 36, grossArea: 1020, stressArea: 817 },
  M39: { designation: "M39", diameter: 39, grossArea: 1190, stressArea: 976 },
} as const;

export const boltSizeList = Object.keys(boltSizes) as BoltSizeKey[];
