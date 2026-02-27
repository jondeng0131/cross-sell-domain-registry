import { useState, useEffect, useRef } from "react";

const INITIAL_PATTERNS = [
  {
    id: "CSP-OG-001",
    sourceVertical: "Oil & Gas",
    targetBrand: "Autronica",
    triggerEvent: "Det-Tronics commissioned on new processing unit",
    icpRequirements: "Onshore facility, ATEX classified zone, no existing smoke detection",
    offerStructure: "Autronica full smoke & gas detection suite for new processing unit",
    conversionRate: 11.2,
    deployments: 14,
    sitesDeployed: 9,
    partnersDeployed: 4,
    repeatabilityScore: 0.91,
    status: "Active",
    knownLimitations: "Lower conversion when Det-Tronics install is under 6 months old",
    version: "v2.3",
    lastUpdated: "2026-01-15",
    tags: ["Det-Tronics", "Autronica", "ATEX", "Onshore"],
  },
  {
    id: "CSP-OG-002",
    sourceVertical: "Oil & Gas",
    targetBrand: "Marioff",
    triggerEvent: "Det-Tronics commissioned on new processing unit",
    icpRequirements: "Onshore facility, ATEX classified zone, no existing suppression",
    offerStructure: "Marioff HI-FOG system for new processing unit",
    conversionRate: 8.1,
    deployments: 12,
    sitesDeployed: 7,
    partnersDeployed: 3,
    repeatabilityScore: 0.86,
    status: "Active",
    knownLimitations: "Does not convert on temporary construction sites. Lower conversion Q3.",
    version: "v2.1",
    lastUpdated: "2026-01-08",
    tags: ["Det-Tronics", "Marioff", "Suppression", "ATEX"],
  },
  {
    id: "CSP-MA-001",
    sourceVertical: "Marine & Offshore",
    targetBrand: "Marioff",
    triggerEvent: "Autronica service completed, drydock scheduled within 12 months",
    icpRequirements: "DNV/Lloyd's classified vessel, no suppression system on record",
    offerStructure: "Marioff HI-FOG marine suppression for engine room and key zones",
    conversionRate: 9.4,
    deployments: 8,
    sitesDeployed: 6,
    partnersDeployed: 2,
    repeatabilityScore: 0.83,
    status: "Active",
    knownLimitations: "Requires drydock window — standalone retrofit is rare",
    version: "v1.4",
    lastUpdated: "2025-12-20",
    tags: ["Autronica", "Marioff", "Marine", "DNV", "Drydock"],
  },
  {
    id: "CSP-CB-001",
    sourceVertical: "Commercial Buildings",
    targetBrand: "Marioff",
    triggerEvent: "Fireye contract renewal approaching, server room identified on site",
    icpRequirements: "Building with data centre or server room, no suppression system, insurance renewal within 6 months",
    offerStructure: "Marioff HI-FOG targeted suppression for server room and high-value asset areas",
    conversionRate: 12.3,
    deployments: 7,
    sitesDeployed: 5,
    partnersDeployed: 2,
    repeatabilityScore: 0.88,
    status: "Active",
    knownLimitations: "Insurance deadline must be within 6 months to create urgency",
    version: "v1.2",
    lastUpdated: "2025-11-30",
    tags: ["Fireye", "Marioff", "Data Centre", "Insurance"],
  },
  {
    id: "CSP-CN-001",
    sourceVertical: "Construction & Infrastructure",
    targetBrand: "Autronica",
    triggerEvent: "Det-Tronics temporary install approaching project commissioning phase",
    icpRequirements: "Project handover within 3 months, permanent safety system required by building owner",
    offerStructure: "Autronica permanent detection system — site-wide coverage for handover",
    conversionRate: 6.7,
    deployments: 5,
    sitesDeployed: 5,
    partnersDeployed: 1,
    repeatabilityScore: 0.72,
    status: "Pilot",
    knownLimitations: "Handover timeline must be confirmed. Main contractor decision-making authority varies.",
    version: "v1.0",
    lastUpdated: "2025-10-14",
    tags: ["Det-Tronics", "Autronica", "Construction", "Handover"],
  },
  {
    id: "CSP-OG-003",
    sourceVertical: "Oil & Gas",
    targetBrand: "Fireye",
    triggerEvent: "Autronica or Det-Tronics installed on site with fired equipment present",
    icpRequirements: "Site has boilers, burners, or fired process heaters. No burner management system on record.",
    offerStructure: "Fireye burner management and flame safeguard controls",
    conversionRate: 4.1,
    deployments: 3,
    sitesDeployed: 3,
    partnersDeployed: 1,
    repeatabilityScore: 0.61,
    status: "Review",
    knownLimitations: "Low conversion — buyers often have legacy Fireye or competitor BMS already. ICP needs refinement.",
    version: "v1.0",
    lastUpdated: "2025-09-05",
    tags: ["Autronica", "Fireye", "Burner Management", "Oil & Gas"],
  },
  {
    id: "CSP-MA-002",
    sourceVertical: "Marine & Offshore",
    targetBrand: "Det-Tronics",
    triggerEvent: "Autronica + Marioff installed, engine room flame detection gap identified",
    icpRequirements: "LNG carrier or FPSO, no dedicated engine room flame detection",
    offerStructure: "Det-Tronics flame detection for engine room upgrade",
    conversionRate: 2.8,
    deployments: 4,
    sitesDeployed: 4,
    partnersDeployed: 0,
    repeatabilityScore: 0.44,
    status: "Deprecated",
    knownLimitations: "Retired — budget rarely available post Marioff installation. Replaced by CSP-MA-003.",
    version: "v1.1",
    lastUpdated: "2025-07-22",
    tags: ["Autronica", "Marioff", "Det-Tronics", "Marine"],
  },
];

const STATUS_CONFIG = {
  Active: { color: "#00d4aa", bg: "rgba(0,212,170,0.12)", label: "ACTIVE" },
  Pilot: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", label: "PILOT" },
  Review: { color: "#f97316", bg: "rgba(249,115,22,0.12)", label: "REVIEW" },
  Deprecated: { color: "#6b7280", bg: "rgba(107,114,128,0.12)", label: "DEPRECATED" },
  Draft: { color: "#a78bfa", bg: "rgba(167,139,250,0.12)", label: "DRAFT" },
};

const VERTICAL_COLORS = {
  "Oil & Gas": "#f59e0b",
  "Marine & Offshore": "#38bdf8",
  "Commercial Buildings": "#a78bfa",
  "Construction & Infrastructure": "#fb7185",
};

const BRAND_COLORS = {
  Autronica: "#00d4aa",
  "Det-Tronics": "#f59e0b",
  Fireye: "#fb7185",
  Marioff: "#38bdf8",
};

const ScoreBar = ({ score }) => {
  const pct = Math.round(score * 100);
  const color = score >= 0.80 ? "#00d4aa" : score >= 0.60 ? "#f59e0b" : "#fb7185";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.6s cubic-bezier(.4,0,.2,1)" }} />
      </div>
      <span style={{ fontSize: 12, fontFamily: "monospace", color, fontWeight: 700, minWidth: 36 }}>{pct}%</span>
    </div>
  );
};

const Badge = ({ label, color, bg }) => (
  <span style={{
    fontSize: 10, fontWeight: 800, letterSpacing: "0.08em",
    padding: "3px 8px", borderRadius: 4,
    color, background: bg, border: `1px solid ${color}40`,
    fontFamily: "monospace",
  }}>{label}</span>
);

const Tag = ({ label, color }) => (
  <span style={{
    fontSize: 10, padding: "2px 7px", borderRadius: 3,
    background: `${color}18`, color, border: `1px solid ${color}30`,
    fontWeight: 600, letterSpacing: "0.03em",
  }}>{label}</span>
);

const EMPTY_PATTERN = {
  id: "", sourceVertical: "Oil & Gas", targetBrand: "Autronica",
  triggerEvent: "", icpRequirements: "", offerStructure: "",
  conversionRate: 0, deployments: 0, sitesDeployed: 0, partnersDeployed: 0,
  repeatabilityScore: 0.5, status: "Draft", knownLimitations: "",
  version: "v1.0", lastUpdated: new Date().toISOString().split("T")[0], tags: [],
};

export default function App() {
  const [patterns, setPatterns] = useState(INITIAL_PATTERNS);
  const [selected, setSelected] = useState(null);
  const [filterVertical, setFilterVertical] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterBrand, setFilterBrand] = useState("All");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_PATTERN);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load from storage
  useEffect(() => {
    async function load() {
      try {
        const r = await window.storage.get("csp-patterns");
        if (r && r.value) setPatterns(JSON.parse(r.value));
      } catch {}
    }
    load();
  }, []);

  async function save(updated) {
    setSaving(true);
    try { await window.storage.set("csp-patterns", JSON.stringify(updated)); } catch {}
    setTimeout(() => setSaving(false), 600);
  }

  const verticals = ["All", ...new Set(INITIAL_PATTERNS.map(p => p.sourceVertical))];
  const statuses = ["All", ...Object.keys(STATUS_CONFIG)];
  const brands = ["All", "Autronica", "Det-Tronics", "Fireye", "Marioff"];

  const filtered = patterns.filter(p => {
    if (filterVertical !== "All" && p.sourceVertical !== filterVertical) return false;
    if (filterStatus !== "All" && p.status !== filterStatus) return false;
    if (filterBrand !== "All" && p.targetBrand !== filterBrand) return false;
    if (search && !`${p.id} ${p.sourceVertical} ${p.targetBrand} ${p.triggerEvent}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function openNew() {
    const nextId = `CSP-NEW-${String(patterns.length + 1).padStart(3, "0")}`;
    setForm({ ...EMPTY_PATTERN, id: nextId });
    setEditMode(false);
    setShowForm(true);
    setSelected(null);
  }

  function openEdit(p) {
    setForm({ ...p });
    setEditMode(true);
    setShowForm(true);
  }

  async function handleSave() {
    const updated = editMode
      ? patterns.map(p => p.id === form.id ? { ...form } : p)
      : [...patterns, { ...form }];
    setPatterns(updated);
    await save(updated);
    setShowForm(false);
    if (editMode && selected?.id === form.id) setSelected(form);
  }

  async function handleDeprecate(id) {
    const updated = patterns.map(p => p.id === id ? { ...p, status: "Deprecated" } : p);
    setPatterns(updated);
    await save(updated);
    if (selected?.id === id) setSelected({ ...selected, status: "Deprecated" });
  }

  const activeCount = patterns.filter(p => p.status === "Active").length;
  const avgRepeatability = (patterns.filter(p => p.status === "Active").reduce((a, b) => a + b.repeatabilityScore, 0) / Math.max(1, activeCount)).toFixed(2);
  const totalDeployments = patterns.reduce((a, b) => a + b.deployments, 0);

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0d14",
      fontFamily: "'IBM Plex Mono', 'Fira Code', 'Courier New', monospace",
      color: "#e2e8f0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #0a0d14; } ::-webkit-scrollbar-thumb { background: #1e2535; border-radius: 3px; }
        input, select, textarea { outline: none; }
        .pattern-card { cursor: pointer; transition: all 0.2s; border: 1px solid #1e2535; }
        .pattern-card:hover { border-color: #2d3748; background: #111827 !important; transform: translateY(-1px); }
        .pattern-card.active-card { border-color: #00d4aa40 !important; background: #0d1f1a !important; }
        .filter-btn { cursor: pointer; transition: all 0.15s; border: 1px solid #1e2535; background: transparent; padding: 5px 12px; border-radius: 4px; font-family: inherit; font-size: 11px; color: #94a3b8; }
        .filter-btn:hover { border-color: #2d3748; color: #e2e8f0; }
        .filter-btn.selected { background: #1e2535; border-color: #374151; color: #e2e8f0; }
        .btn { cursor: pointer; font-family: inherit; transition: all 0.15s; border-radius: 4px; font-size: 12px; font-weight: 600; }
        .btn-primary { background: #00d4aa; color: #0a0d14; border: none; padding: 8px 18px; }
        .btn-primary:hover { background: #00efc0; }
        .btn-ghost { background: transparent; border: 1px solid #1e2535; color: #94a3b8; padding: 7px 14px; }
        .btn-ghost:hover { border-color: #374151; color: #e2e8f0; }
        .btn-danger { background: transparent; border: 1px solid #fb718540; color: #fb7185; padding: 7px 14px; }
        .btn-danger:hover { background: #fb718518; }
        input[type=text], input[type=number], select, textarea { background: #111827; border: 1px solid #1e2535; color: #e2e8f0; padding: 8px 12px; border-radius: 4px; font-family: inherit; font-size: 12px; width: 100%; }
        input[type=text]:focus, input[type=number]:focus, select:focus, textarea:focus { border-color: #00d4aa60; }
        textarea { resize: vertical; min-height: 60px; }
        select option { background: #111827; }
        .stat-card { background: #0d1117; border: 1px solid #1e2535; border-radius: 6px; padding: 16px 20px; }
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; }
        .modal { background: #0d1117; border: 1px solid #1e2535; border-radius: 8px; width: 90%; max-width: 640px; max-height: 90vh; overflow-y: auto; padding: 28px; }
        label { font-size: 11px; color: #64748b; display: block; margin-bottom: 5px; letter-spacing: 0.06em; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1e2535", padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00d4aa", boxShadow: "0 0 10px #00d4aa" }} />
          <div>
            <div style={{ fontSize: 11, color: "#64748b", letterSpacing: "0.12em", fontWeight: 600 }}>SPECTRUM SAFETY SOLUTIONS</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#f8fafc", fontFamily: "'IBM Plex Sans', sans-serif", letterSpacing: "-0.01em" }}>
              Cross-Sell Pattern Registry
            </div>
          </div>
          {saving && <span style={{ fontSize: 10, color: "#00d4aa", letterSpacing: "0.08em" }}>SAVING...</span>}
        </div>
        <button className="btn btn-primary" onClick={openNew}>+ NEW PATTERN</button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, padding: "20px 28px 0" }}>
        {[
          { label: "TOTAL PATTERNS", value: patterns.length, color: "#e2e8f0" },
          { label: "ACTIVE", value: activeCount, color: "#00d4aa" },
          { label: "TOTAL DEPLOYMENTS", value: totalDeployments, color: "#38bdf8" },
          { label: "AVG REPEATABILITY", value: `${Math.round(avgRepeatability * 100)}%`, color: "#a78bfa" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: 9, color: "#64748b", letterSpacing: "0.1em", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color, fontFamily: "'IBM Plex Sans', sans-serif" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ padding: "16px 28px", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", borderBottom: "1px solid #1e2535" }}>
        <input type="text" placeholder="Search patterns..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: 220, background: "#0d1117" }} />
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "#64748b", marginRight: 4 }}>VERTICAL</span>
          {verticals.map(v => (
            <button key={v} className={`filter-btn ${filterVertical === v ? "selected" : ""}`}
              onClick={() => setFilterVertical(v)}>{v === "All" ? "ALL" : v.split(" ")[0].toUpperCase()}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "#64748b", marginRight: 4 }}>STATUS</span>
          {statuses.map(s => (
            <button key={s} className={`filter-btn ${filterStatus === s ? "selected" : ""}`}
              onClick={() => setFilterStatus(s)}>{s.toUpperCase()}</button>
          ))}
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 420px" : "1fr", gap: 0, height: "calc(100vh - 240px)" }}>

        {/* Pattern list */}
        <div style={{ overflowY: "auto", padding: "20px 28px", display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.length === 0 && (
            <div style={{ color: "#4b5563", fontSize: 13, textAlign: "center", marginTop: 60 }}>No patterns match your filters.</div>
          )}
          {filtered.map(p => {
            const sc = STATUS_CONFIG[p.status] || STATUS_CONFIG.Draft;
            const vc = VERTICAL_COLORS[p.sourceVertical] || "#94a3b8";
            const bc = BRAND_COLORS[p.targetBrand] || "#94a3b8";
            const isSelected = selected?.id === p.id;
            return (
              <div key={p.id} className={`pattern-card ${isSelected ? "active-card" : ""}`}
                style={{ background: "#0d1117", borderRadius: 6, padding: 16, cursor: "pointer" }}
                onClick={() => setSelected(isSelected ? null : p)}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>{p.id}</span>
                    <Badge label={sc.label} color={sc.color} bg={sc.bg} />
                  </div>
                  <span style={{ fontSize: 10, color: "#4b5563" }}>{p.version}</span>
                </div>

                <div style={{ fontSize: 13, color: "#f1f5f9", marginBottom: 8, fontFamily: "'IBM Plex Sans', sans-serif", lineHeight: 1.4 }}>
                  {p.triggerEvent}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                  <Tag label={p.sourceVertical} color={vc} />
                  <span style={{ color: "#374151", fontSize: 12 }}>→</span>
                  <Tag label={p.targetBrand} color={bc} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 9, color: "#64748b", marginBottom: 4, letterSpacing: "0.08em" }}>REPEATABILITY</div>
                    <ScoreBar score={p.repeatabilityScore} />
                  </div>
                  <div style={{ display: "flex", gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 9, color: "#64748b", letterSpacing: "0.08em" }}>CONVERSION</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#00d4aa" }}>{p.conversionRate}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: "#64748b", letterSpacing: "0.08em" }}>DEPLOYMENTS</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#38bdf8" }}>{p.deployments}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: "#64748b", letterSpacing: "0.08em" }}>SITES</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#a78bfa" }}>{p.sitesDeployed}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail panel */}
        {selected && (() => {
          const sc = STATUS_CONFIG[selected.status] || STATUS_CONFIG.Draft;
          const vc = VERTICAL_COLORS[selected.sourceVertical] || "#94a3b8";
          const bc = BRAND_COLORS[selected.targetBrand] || "#94a3b8";
          return (
            <div style={{ borderLeft: "1px solid #1e2535", overflowY: "auto", padding: "24px 24px", background: "#0a0d14" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>{selected.id} • {selected.version}</div>
                  <Badge label={sc.label} color={sc.color} bg={sc.bg} />
                </div>
                <button className="btn btn-ghost" style={{ fontSize: 18, padding: "4px 10px" }} onClick={() => setSelected(null)}>×</button>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#f8fafc", fontFamily: "'IBM Plex Sans', sans-serif", lineHeight: 1.4, marginBottom: 12 }}>
                  {selected.triggerEvent}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Tag label={selected.sourceVertical} color={vc} />
                  <span style={{ color: "#374151" }}>→</span>
                  <Tag label={selected.targetBrand} color={bc} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
                {[
                  { label: "CONVERSION", value: `${selected.conversionRate}%`, color: "#00d4aa" },
                  { label: "DEPLOYMENTS", value: selected.deployments, color: "#38bdf8" },
                  { label: "SITES", value: selected.sitesDeployed, color: "#a78bfa" },
                ].map(s => (
                  <div key={s.label} style={{ background: "#0d1117", border: "1px solid #1e2535", borderRadius: 6, padding: "12px 14px", textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: "#64748b", letterSpacing: "0.08em", marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 9, color: "#64748b", letterSpacing: "0.08em", marginBottom: 6 }}>REPEATABILITY SCORE</div>
                <ScoreBar score={selected.repeatabilityScore} />
                <div style={{ fontSize: 10, color: "#4b5563", marginTop: 5 }}>
                  {selected.repeatabilityScore >= 0.80 ? "✓ AUTO-APPROVE ELIGIBLE" : selected.repeatabilityScore >= 0.60 ? "⚠ REQUIRES LOCALISATION" : "✗ NOT READY FOR SCALING"}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
                {[
                  { label: "ICP REQUIREMENTS", value: selected.icpRequirements },
                  { label: "OFFER STRUCTURE", value: selected.offerStructure },
                  { label: "KNOWN LIMITATIONS", value: selected.knownLimitations },
                ].map(f => (
                  <div key={f.label} style={{ background: "#0d1117", border: "1px solid #1e2535", borderRadius: 6, padding: "12px 14px" }}>
                    <div style={{ fontSize: 9, color: "#64748b", letterSpacing: "0.08em", marginBottom: 5 }}>{f.label}</div>
                    <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.6 }}>{f.value}</div>
                  </div>
                ))}
              </div>

              {selected.tags?.length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
                  {selected.tags.map(t => {
                    const c = BRAND_COLORS[t] || VERTICAL_COLORS[t] || "#64748b";
                    return <Tag key={t} label={t} color={c} />;
                  })}
                </div>
              )}

              <div style={{ fontSize: 10, color: "#374151", marginBottom: 20 }}>Last updated: {selected.lastUpdated}</div>

              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => openEdit(selected)}>EDIT PATTERN</button>
                {selected.status !== "Deprecated" && (
                  <button className="btn btn-danger" onClick={() => handleDeprecate(selected.id)}>DEPRECATE</button>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#f8fafc", fontFamily: "'IBM Plex Sans', sans-serif" }}>
                {editMode ? `EDIT — ${form.id}` : "NEW PATTERN"}
              </div>
              <button className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: 18 }} onClick={() => setShowForm(false)}>×</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label>PATTERN ID</label>
                  <input type="text" value={form.id} onChange={e => setForm({ ...form, id: e.target.value })} />
                </div>
                <div>
                  <label>VERSION</label>
                  <input type="text" value={form.version} onChange={e => setForm({ ...form, version: e.target.value })} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label>SOURCE VERTICAL</label>
                  <select value={form.sourceVertical} onChange={e => setForm({ ...form, sourceVertical: e.target.value })}>
                    {["Oil & Gas", "Marine & Offshore", "Commercial Buildings", "Construction & Infrastructure"].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label>TARGET BRAND</label>
                  <select value={form.targetBrand} onChange={e => setForm({ ...form, targetBrand: e.target.value })}>
                    {["Autronica", "Det-Tronics", "Fireye", "Marioff"].map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label>TRIGGER EVENT</label>
                <textarea value={form.triggerEvent} onChange={e => setForm({ ...form, triggerEvent: e.target.value })} />
              </div>

              <div>
                <label>ICP REQUIREMENTS</label>
                <textarea value={form.icpRequirements} onChange={e => setForm({ ...form, icpRequirements: e.target.value })} />
              </div>

              <div>
                <label>OFFER STRUCTURE</label>
                <textarea value={form.offerStructure} onChange={e => setForm({ ...form, offerStructure: e.target.value })} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                {[
                  { label: "CONVERSION %", key: "conversionRate", step: "0.1" },
                  { label: "DEPLOYMENTS", key: "deployments", step: "1" },
                  { label: "SITES", key: "sitesDeployed", step: "1" },
                  { label: "PARTNERS", key: "partnersDeployed", step: "1" },
                ].map(f => (
                  <div key={f.key}>
                    <label>{f.label}</label>
                    <input type="number" step={f.step} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: parseFloat(e.target.value) })} />
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label>REPEATABILITY SCORE (0–1)</label>
                  <input type="number" step="0.01" min="0" max="1" value={form.repeatabilityScore}
                    onChange={e => setForm({ ...form, repeatabilityScore: parseFloat(e.target.value) })} />
                </div>
                <div>
                  <label>STATUS</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    {Object.keys(STATUS_CONFIG).map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label>KNOWN LIMITATIONS</label>
                <textarea value={form.knownLimitations} onChange={e => setForm({ ...form, knownLimitations: e.target.value })} />
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
                <button className="btn btn-ghost" onClick={() => setShowForm(false)}>CANCEL</button>
                <button className="btn btn-primary" onClick={handleSave}>
                  {editMode ? "SAVE CHANGES" : "CREATE PATTERN"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
