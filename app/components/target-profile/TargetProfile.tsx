
import { useEffect, useMemo, useRef, useState } from "react";
import "./target-profile.css";
import type { SeasonRow, SurfaceKind, Target } from "./types";

const TABS = ["Overview", "Invariants", "Call Graph", "Findings", "PoC Suite", "Report"] as const;
const SURF_COLOR: Record<SurfaceKind, string> = { ok: "#3ddc97", med: "#f5d142", crit: "#ff4d6d" };
const STATUS_LABEL = { won: "Paid", live: "Live", esc: "Escalated" } as const;

const band = (v: number) => (v <= 7 ? "s1" : v <= 10 ? "s2" : v <= 15 ? "s3" : "s4");

interface Props {
  /** Targets keyed by switcher id. Pass one entry to hide nothing; the switcher shows every key. */
  targets: Record<string, Target>;
  record: SeasonRow[];
  initialKey?: string;
  onRunAudit?: (target: Target) => Promise<void> | void;
  footerNote?: string;
}

export default function TargetProfile({ targets, record, initialKey, onRunAudit, footerNote }: Props) {
  const keys = Object.keys(targets);
  const [key, setKey] = useState(initialKey ?? keys[0]);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const [tip, setTip] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const d = targets[key];

  const stats = useMemo(() => {
    const all = Object.values(d.attrs).flatMap((g) => Object.values(g));
    const weak = all.filter((v) => v <= 7).length;
    const avg = (all.reduce((a, b) => a + b, 0) / all.length).toFixed(1);
    return { weak, avg };
  }, [d]);

  const now = useMemo(() => {
    const t = new Date();
    return {
      line1: t.toLocaleDateString("en-GB", { weekday: "short" }) + " " + t.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      line2: t.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }).toUpperCase(),
    };
  }, []);

  useEffect(() => setTip(null), [key]);

  async function run() {
    if (running) return;
    setRunning(true);
    try {
      await (onRunAudit?.(d) ?? new Promise((r) => setTimeout(r, 1600)));
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="tp">
      <div className="wrap">
        <header className="top">
          <div className="crest" aria-hidden="true"><span>OTI</span></div>
          <div className="ident">
            <h1><b>{d.idx}</b><span>{d.name}</span></h1>
            <nav className="tabs" role="tablist" aria-label="Target sections">
              {TABS.map((t) => (
                <button key={t} className="tab" role="tab" aria-selected={tab === t} onClick={() => setTab(t)}>{t}</button>
              ))}
            </nav>
          </div>
          <div className="spacer" />
          {keys.length > 1 && (
            <div className="switch" role="group" aria-label="Target">
              {keys.map((k) => (
                <button key={k} aria-pressed={k === key} onClick={() => setKey(k)}>{k}</button>
              ))}
            </div>
          )}
          <div className="clock"><div>{now.line1}</div><div>{now.line2}</div></div>
          <button className="go" onClick={run} disabled={running}>
            {running ? "Auditing…" : "Run Audit"} <span aria-hidden="true">»</span><kbd>⌘↵</kbd>
          </button>
        </header>

        <section className="strip">
          <div className="card who">
            <div className="glyph"><Glyph seed={d.name} /></div>
            <div className="meta">
              <div className="k num">{d.nsloc}</div>
              <div className="s">{d.chain}</div>
              <div className="s num">{d.files}</div>
              <span className="chip"><i />{d.status}</span>
            </div>
          </div>

          <div className="card surface">
            <svg viewBox="0 0 220 130" role="img" aria-label="Attack surface map">
              <rect x="1" y="1" width="218" height="128" rx="4" fill="#120f24" stroke="#3a3170" />
              <line x1="110" y1="1" x2="110" y2="129" stroke="#3a3170" />
              <circle cx="110" cy="65" r="20" fill="none" stroke="#3a3170" />
              <rect x="1" y="35" width="30" height="60" fill="none" stroke="#3a3170" />
              <rect x="189" y="35" width="30" height="60" fill="none" stroke="#3a3170" />
              {d.surf.map((n, i) => (
                <g key={i}>
                  <circle cx={n.x} cy={n.y} r="7" fill={SURF_COLOR[n.kind]} stroke="#120f24" strokeWidth="2">
                    {n.fn && <title>{n.fn}</title>}
                  </circle>
                  {n.kind === "crit" && <circle cx={n.x} cy={n.y} r="10.5" fill="none" stroke={SURF_COLOR.crit} strokeOpacity=".5" />}
                </g>
              ))}
            </svg>
            <div>
              <div className="lbl">Protocol Type</div>
              <div className="val">{d.ptype}</div>
              <div className="lbl" style={{ marginTop: 12 }}>Primary Threat Class</div>
              <div className="val">
                <span className="stars">{"★".repeat(d.stars)}<s>{"★".repeat(5 - d.stars)}</s></span> {d.threat}
              </div>
              <div className="legend">
                <span><i style={{ background: "var(--ok)" }} />Public entry</span>
                <span><i style={{ background: "var(--med)" }} />Privileged</span>
                <span><i style={{ background: "var(--crit)" }} />Flagged</span>
              </div>
            </div>
          </div>

          <div className="card shirt">
            <div className="t">Risk Score</div>
            <div className="n num">{d.score}</div>
            <div className="g">{d.grade}</div>
          </div>
        </section>

        <section className="main">
          <div className="card">
            <div className="attrs fade" key={key}>
              {Object.entries(d.attrs).map(([group, rows]) => (
                <div className="col" key={group}>
                  <h3>{group}</h3>
                  {Object.entries(rows).map(([name, v]) => {
                    const note = d.notes?.[name];
                    return (
                      <div
                        key={name}
                        className={"row" + (d.key.includes(name) ? " key" : "")}
                        data-tip={note ? name : undefined}
                        tabIndex={note ? 0 : undefined}
                        onMouseEnter={note ? () => setTip(name) : undefined}
                        onFocus={note ? () => setTip(name) : undefined}
                      >
                        <span>{name}</span>
                        <b className={`sc ${band(v)} num`}>{v}</b>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div className="extra">
                <div>
                  <div className="kv"><span>Weak dimensions (≤7)</span><b className="num">{stats.weak}</b></div>
                  <div className="kv"><span>Mean rating</span><b className="num">{stats.avg} / 20</b></div>
                </div>
                <div>
                  <div className="kv"><span>Invariants extracted</span><b className="num">{12 + stats.weak * 3}</b></div>
                  <div className="kv"><span>Fuzz runs</span><b className="num">{(250000 + stats.weak * 40000).toLocaleString()}</b></div>
                </div>
                <div>
                  <div className="kv"><span>Reasoning effort</span><b>High</b></div>
                  <div className="kv"><span>Confidence target</span><b className="num">95%</b></div>
                </div>
                <div className="tipbox">
                  {tip && d.notes?.[tip] ? (
                    <><b>{tip}:</b> {d.notes[tip]}</>
                  ) : (
                    <>Hover a highlighted attribute to see the agent&apos;s note. Cyan rows are the dimensions that matter most for a {d.ptype.split(" · ")[0].toLowerCase()} protocol.</>
                  )}
                </div>
              </div>
            </div>
          </div>

          <aside className="side">
            <div className="card info">
              <div className="ph"><a href="#findings">Exposure Info ›</a></div>
              <div className="big">
                <div><span className="tag num">{d.tvl}</span><div className="lbl">TVL at Risk</div></div>
                <div>
                  <div className="sev" style={{ color: d.topsev === "CRITICAL" ? "var(--crit)" : "var(--high)" }}>{d.topsev}</div>
                  <div className="lbl">Highest Severity</div>
                </div>
              </div>
              <div className="mini">
                <span>Validation status: PoC passing</span><b className="num">{d.pocs}</b>
                <span>Agents flagging same root cause</span><b><span className="box num">{d.agents}</span></b>
                <span>False-positive filter</span><b className="num">{d.fp}</b>
              </div>
            </div>

            <div className="card">
              <div className="ph"><a href="#engagement">Engagement ›</a></div>
              <div className="eng">
                <div className="bar"><span>{d.plat}</span><span style={{ color: "var(--muted)" }}>Judging: {d.judging}</span></div>
                <div className="split">
                  <div><div className="lbl">Prize Pool</div><b className="num">{d.pool}</b></div>
                  <div><div className="lbl">Contest Ends</div><b className="num">{d.ends}</b></div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="ph"><a href="#record">Season Record ›</a></div>
              <div className="tbl-wrap">
                <table>
                  <thead>
                    <tr><th>Platform</th><th>Audits</th><th className="c">Crit</th><th className="h">High</th><th className="m">Med</th><th>Payout</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {record.map((r) => (
                      <tr key={r.platform}>
                        <td>{r.platform}</td>
                        <td className="num">{r.audits}</td>
                        <td className="num">{r.crit}</td>
                        <td className="num">{r.high}</td>
                        <td className="num">{r.med}</td>
                        <td className="num">{r.payout}</td>
                        <td><span className={`pill ${r.status}`}>{STATUS_LABEL[r.status]}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </aside>
        </section>

        <div className="foot">
          <span>OTISEC SENTINEL · v2.2 · 12-agent orchestration</span>
          {footerNote && <span className="sample">{footerNote}</span>}
        </div>
      </div>
    </div>
  );
}

/** Deterministic, symmetric "bytecode fingerprint" avatar from a seed string. */
function Glyph({ seed }: { seed: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    const x = c?.getContext("2d");
    if (!c || !x) return;
    let h = 0;
    for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const r = () => (h = (h * 1664525 + 1013904223) >>> 0) / 4294967296;
    x.fillStyle = "#120f24";
    x.fillRect(0, 0, 192, 192);
    const pal = ["#5ef2d4", "#7b4fe0", "#f5b942", "#2a2354"];
    const s = 20;
    for (let i = 0; i < 8; i++)
      for (let j = 0; j < 4; j++) {
        x.fillStyle = pal[Math.floor(r() * 4)];
        x.fillRect(16 + j * s, 16 + i * s, s - 3, s - 3);
        x.fillRect(176 - (j + 1) * s + 3, 16 + i * s, s - 3, s - 3);
      }
  }, [seed]);
  return <canvas ref={ref} width={192} height={192} aria-label="Bytecode fingerprint" />;
}
