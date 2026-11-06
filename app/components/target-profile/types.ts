// Shape the SENTINEL pipeline should emit for the Target Profile screen.

export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
export type SurfaceKind = "ok" | "med" | "crit"; // public entry | privileged | flagged

export interface SurfaceNode {
  x: number; // 0–220 in the map viewBox
  y: number; // 0–130
  kind: SurfaceKind;
  fn?: string; // function signature, for tooltips later
}

/** Attribute ratings 1–20 (higher = safer), grouped by column title. */
export type AttributeGroups = Record<string, Record<string, number>>;

export interface Target {
  idx: string;
  name: string;
  nsloc: string;
  chain: string;
  files: string;
  status: string;
  ptype: string;
  stars: number; // 0–5, confidence in primary threat class
  threat: string;
  score: number; // 0–100 risk score (higher = riskier)
  grade: string;
  tvl: string;
  topsev: Severity;
  pocs: string;
  agents: string;
  fp: string;
  plat: string;
  judging: string;
  pool: string;
  ends: string;
  key: string[]; // attribute names highlighted for this protocol type
  attrs: AttributeGroups;
  surf: SurfaceNode[];
  notes?: Record<string, string>; // agent note per attribute
}

export type RecordStatus = "won" | "live" | "esc";
export interface SeasonRow {
  platform: string;
  audits: number;
  crit: number;
  high: number;
  med: number;
  payout: string;
  status: RecordStatus;
}
