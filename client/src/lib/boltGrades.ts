// Design system: Drafting Room Ledger — engineering constants are centrally governed and read-only.
export const boltGrades = {
  "4.6": { fyb: 240, fub: 400 },
  "4.8": { fyb: 320, fub: 400 },
  "5.6": { fyb: 300, fub: 500 },
  "5.8": { fyb: 400, fub: 500 },
  "6.8": { fyb: 480, fub: 600 },
  "8.8": { fyb: 640, fub: 800 },
  "10.9": { fyb: 900, fub: 1000 },
} as const;

export type BoltGrade = keyof typeof boltGrades;
export const boltGradeList = Object.keys(boltGrades) as BoltGrade[];
