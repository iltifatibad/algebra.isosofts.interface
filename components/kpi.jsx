import { useState, useEffect } from "react";
import {
  LineChart, Line,
  BarChart, Bar,
  AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTH_KEYS = ["january","february","march","april","may","june","july","august","september","october","november","december"];

const CHART_TYPES = [
  { value: "line",  label: "Line Chart" },
  { value: "bar",   label: "Bar Chart" },
  { value: "area",  label: "Area Chart" },
  { value: "radar", label: "Radar Chart" },
  { value: "pie",   label: "Pie Chart" },
];

const COLORS = { actual: "#3b82f6", target: "#f59e0b", lastYear: "#10b981" };
const PIE_COLORS = ["#3b82f6","#6366f1","#0ea5e9","#8b5cf6","#06b6d4","#60a5fa","#a78bfa","#38bdf8"];

const tooltipStyle = {
  contentStyle: {
    background: "#ffffff",
    border: "1px solid #bfdbfe",
    borderRadius: 8,
    color: "#1e3a5f",
    fontSize: 13,
  }
};

const axes = (unit = "") => (
  <>
    <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
    <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} />
    <YAxis tick={{ fill: "#64748b", fontSize: 12 }} unit={unit} />
    <Tooltip {...tooltipStyle} />
    <Legend wrapperStyle={{ color: "#475569", fontSize: 13 }} />
  </>
);

const getToken = () =>
  document.cookie
    .split("; ")
    .find((r) => r.startsWith("auth_token="))
    ?.split("=")
    .slice(1)
    .join("=") ?? "";

export default function KPIDashboard() {
  const [kpiData, setKpiData]       = useState([]);
  const [opiData, setOpiData]       = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedType, setSelectedType] = useState(null); // "kpi" | "opi"
  const [chartType, setChartType]   = useState("line");
  const [kpiOpiSearch, setKpiOpiSearch] = useState("");

  // KPI fetch
  const getKPI = () => {
    const token = getToken();
    return fetch(`/api/dashboard/kpi?token=${token}`)
      .then(r => { if (!r.ok) throw new Error("Failed to load KPI data"); return r.json(); });
  };

  // OPI fetch
  const getOPI = () => {
    const token = getToken();
    return fetch(`/api/dashboard/opi/all?token=${token}`)
      .then(r => { if (!r.ok) throw new Error("Failed To Get Datas From Database"); return r.json(); });
  };

  const getAll = () => {
    setLoading(true);
    setError(null);

    Promise.all([getKPI(), getOPI()])
      .then(([kpi, opi]) => {
        const safeKpi = Array.isArray(kpi) ? kpi : [];
        const safeOpi = Array.isArray(opi) ? opi : [];
        setKpiData(safeKpi);
        setOpiData(safeOpi);

        // İlk seçili item'ı belirle
        if (safeKpi.length > 0) {
          setSelectedId(safeKpi[0].id);
          setSelectedType("kpi");
        } else if (safeOpi.length > 0) {
          setSelectedId(safeOpi[0].id);
          setSelectedType("opi");
        }

        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  };

  useEffect(() => { getAll(); }, []);

  // Dropdown değiştiğinde hem id hem type güncelle
  const handleSelect = (e) => {
    const val = e.target.value; // "kpi__<id>" veya "opi__<id>"
    const [type, ...rest] = val.split("__");
    setSelectedType(type);
    setSelectedId(rest.join("__"));
  };

  // Seçili item
  const kpi = selectedType === "kpi"
    ? kpiData.find(k => k.id === selectedId) || null
    : opiData.find(o => o.id === selectedId) || null;

  const chartData = kpi
    ? MONTHS.map((m, i) => ({
        month: m,
        Actual:      kpi[MONTH_KEYS[i]] ?? 0,
        Target:      kpi.annualTarget ?? 0,
        "Last Year": kpi.lykpi ?? 0,
      }))
    : [];

  const latestActual = kpi ? (kpi[MONTH_KEYS[11]] ?? kpi.actualKPI ?? 0) : 0;
  const progress     = kpi?.annualTarget > 0
    ? Math.min(100, Math.round((latestActual / kpi.annualTarget) * 100))
    : 0;

  const nonZero = chartData.filter(d => d.Actual > 0);

  const renderChart = () => {
    if (!kpi) return <div />;
    const common = { data: chartData, margin: { top: 10, right: 0, left: 0, bottom: 0 } };

    switch (chartType) {
      case "line": return (
        <LineChart {...common}>
          {axes()}
          <Line type="monotone" dataKey="Actual"    stroke={COLORS.actual}   strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="Target"    stroke={COLORS.target}   strokeWidth={2}   strokeDasharray="5 5" dot={false} />
          <Line type="monotone" dataKey="Last Year" stroke={COLORS.lastYear} strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
        </LineChart>
      );
      case "bar": return (
        <BarChart {...common}>
          {axes()}
          <Bar dataKey="Actual"    fill={COLORS.actual}   radius={[4,4,0,0]} />
          <Bar dataKey="Target"    fill={COLORS.target}   radius={[4,4,0,0]} />
          <Bar dataKey="Last Year" fill={COLORS.lastYear} radius={[4,4,0,0]} />
        </BarChart>
      );
      case "area": return (
        <AreaChart {...common}>
          <defs>
            <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={COLORS.actual} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS.actual} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gT" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={COLORS.target} stopOpacity={0.2} />
              <stop offset="95%" stopColor={COLORS.target} stopOpacity={0} />
            </linearGradient>
          </defs>
          {axes()}
          <Area type="monotone" dataKey="Last Year" stroke={COLORS.lastYear} fill="none"        strokeDasharray="3 3" strokeWidth={1.5} />
          <Area type="monotone" dataKey="Target"    stroke={COLORS.target}   fill="url(#gT)"    strokeDasharray="5 5" strokeWidth={2} />
          <Area type="monotone" dataKey="Actual"    stroke={COLORS.actual}   fill="url(#gA)"    strokeWidth={2.5} />
        </AreaChart>
      );
      case "radar": return (
        <RadarChart data={chartData} margin={{ top:10, right:0, left:0, bottom:10 }}>
          <PolarGrid stroke="#dbeafe" />
          <PolarAngleAxis dataKey="month" tick={{ fill:"#64748b", fontSize:11 }} />
          <PolarRadiusAxis tick={{ fill:"#94a3b8", fontSize:10 }} />
          <Radar name="Actual"    dataKey="Actual"    stroke={COLORS.actual}   fill={COLORS.actual}   fillOpacity={0.3} />
          <Radar name="Target"    dataKey="Target"    stroke={COLORS.target}   fill={COLORS.target}   fillOpacity={0.1} />
          <Radar name="Last Year" dataKey="Last Year" stroke={COLORS.lastYear} fill={COLORS.lastYear} fillOpacity={0.1} />
          <Legend wrapperStyle={{ color:"#475569", fontSize:13 }} />
          <Tooltip {...tooltipStyle} />
        </RadarChart>
      );
      case "pie": {
        const pd = nonZero.length > 0 ? nonZero : [{ month:"No Data", Actual:1 }];
        return (
          <PieChart>
            <Pie data={pd} dataKey="Actual" nameKey="month"
              cx="50%" cy="50%" outerRadius={120} innerRadius={55}
              paddingAngle={3}
              label={({ month, percent }) => `${month} ${(percent*100).toFixed(0)}%`}
              labelLine={false}>
              {pd.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
            </Pie>
            <Tooltip {...tooltipStyle} />
          </PieChart>
        );
      }
      default: return <div />;
    }
  };

  // Seçili dropdown value
  const dropdownValue = selectedId && selectedType ? `${selectedType}__${selectedId}` : "";

  // Search filter
  const q = kpiOpiSearch.trim().toLowerCase();
  const filteredKpi = q ? kpiData.filter(k => `${k.no} ${k.title}`.toLowerCase().includes(q)) : kpiData;
  const filteredOpi = q ? opiData.filter(o => `${o.no} ${o.title}`.toLowerCase().includes(q)) : opiData;

  return (
    <div style={{
      height:      "100%",
      width:       "100%",
      background:  "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)",
      padding:     "32px 28px 80px 28px",
      boxSizing:   "border-box",
      overflowY:   "auto",
      overflowX:   "hidden",
      fontFamily:  "'Inter', 'Segoe UI', sans-serif",
      color:       "#1e3a5f",
    }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ color:"#3b82f6", fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", margin:"0 0 4px" }}>
          Performance Intelligence
        </p>
        <h1 style={{ fontSize:24, fontWeight:700, color:"#1e3a5f", margin:0 }}>KPI Dashboard</h1>
        <p style={{ fontSize:13, color:"#94a3b8", margin:"4px 0 0" }}>Monitor key performance indicators across all functions</p>
      </div>

      {/* Controls */}
      <div style={{ display:"flex", gap:16, marginBottom:28, flexWrap:"wrap" }}>
        {/* KPI / OPI Select */}
        <div style={{ flex:"2 1 280px" }}>
          <label style={{ display:"block", fontSize:11, color:"#3b82f6", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>
            Select KPI / OPI
          </label>

          {/* Search input */}
          <div style={{ position:"relative", marginBottom:8 }}>
            <i className="fas fa-magnifying-glass" style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#94a3b8", fontSize:13, pointerEvents:"none" }} />
            <input
              type="text"
              placeholder="Search by number or title…"
              value={kpiOpiSearch}
              onChange={e => setKpiOpiSearch(e.target.value)}
              style={{ width:"100%", background:"#f8fafc", border:"1px solid #bfdbfe", color:"#1e3a5f", padding:"9px 12px 9px 34px", borderRadius:10, fontSize:13, outline:"none", boxSizing:"border-box" }}
            />
            {kpiOpiSearch && (
              <button
                onClick={() => setKpiOpiSearch("")}
                style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#94a3b8", cursor:"pointer", fontSize:13, lineHeight:1, padding:0 }}
              >
                <i className="fas fa-xmark" />
              </button>
            )}
          </div>

          <select
            value={dropdownValue}
            onChange={handleSelect}
            disabled={loading}
            style={{ width:"100%", background:"#f8fafc", border:"1px solid #bfdbfe", color:"#1e3a5f", padding:"11px 16px", borderRadius:10, fontSize:14, outline:"none", cursor:"pointer" }}
          >
            {filteredKpi.length === 0 && filteredOpi.length === 0 && (
              <option disabled value="">No results found</option>
            )}
            {/* KPI Grubu */}
            {filteredKpi.length > 0 && (
              <optgroup label="── KPI ──">
                {filteredKpi.map(k => (
                  <option key={`kpi__${k.id}`} value={`kpi__${k.id}`}>
                    {k.no} — {k.title}
                  </option>
                ))}
              </optgroup>
            )}

            {/* OPI Grubu */}
            {filteredOpi.length > 0 && (
              <optgroup label="── OPI ──">
                {filteredOpi.map(o => (
                  <option key={`opi__${o.id}`} value={`opi__${o.id}`}>
                    {o.no} — {o.title}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </div>

        {/* Chart Type Select */}
        <div style={{ flex:"1 1 180px" }}>
          <label style={{ display:"block", fontSize:11, color:"#3b82f6", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>
            Chart Type
          </label>
          <select
            value={chartType}
            onChange={e => setChartType(e.target.value)}
            style={{ width:"100%", background:"#f8fafc", border:"1px solid #bfdbfe", color:"#1e3a5f", padding:"11px 16px", borderRadius:10, fontSize:14, outline:"none", cursor:"pointer" }}
          >
            {CHART_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        {/* Refresh */}
        <div style={{ display:"flex", alignItems:"flex-end" }}>
          <button
            onClick={getAll}
            disabled={loading}
            style={{ padding:"11px 18px", background:"linear-gradient(135deg,#6366f1,#3b82f6)", border:"none", borderRadius:10, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", opacity: loading ? 0.6 : 1 }}
          >
            <i className={`fas fa-rotate-right ${loading ? "animate-spin" : ""}`} style={{ marginRight:6 }}></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign:"center", padding:"60px 0", color:"#94a3b8" }}>
          <i className="fas fa-circle-notch animate-spin" style={{ fontSize:24, marginBottom:12 }}></i>
          <p style={{ margin:0, fontSize:14 }}>Loading data...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:10, padding:"12px 18px", marginBottom:20, color:"#dc2626", fontSize:14 }}>
          <i className="fas fa-triangle-exclamation" style={{ marginRight:8 }}></i>{error}
        </div>
      )}

      {kpi && !loading && (
        <>
          {/* Stat Cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))", gap:14, marginBottom:28 }}>
            {[
              { label:"Last Year KPI", value: kpi.lykpi,        color:"#10b981" },
              { label:"Annual Target", value: kpi.annualTarget,  color:"#f59e0b" },
              { label:"Actual KPI",    value: kpi.actualKPI,     color:"#3b82f6" },
              { label:"Progress",      value: `${progress}%`,    color: progress >= 90 ? "#10b981" : progress >= 70 ? "#f59e0b" : "#ef4444" },
            ].map(s => (
              <div key={s.label} style={{ background:"#ffffff", border:"1px solid #dbeafe", borderRadius:12, padding:"18px 20px" }}>
                <p style={{ fontSize:11, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 6px" }}>{s.label}</p>
                <p style={{ fontSize:24, fontWeight:700, color:s.color, margin:0 }}>{s.value ?? "—"}</p>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div style={{ background:"#ffffff", border:"1px solid #dbeafe", borderRadius:12, padding:"14px 20px", marginBottom:28 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontSize:13, color:"#6b7280" }}>Target Progress</span>
              <span style={{ fontSize:13, color:"#1e3a5f", fontWeight:600 }}>{progress}%</span>
            </div>
            <div style={{ height:6, background:"#dbeafe", borderRadius:99 }}>
              <div style={{
                height:"100%", width:`${progress}%`,
                background: progress >= 90 ? "#10b981" : progress >= 70 ? "#f59e0b" : "#ef4444",
                borderRadius:99, transition:"width 0.6s ease",
              }} />
            </div>
          </div>

          {/* Chart */}
          <div style={{ background:"#ffffff", border:"1px solid #dbeafe", borderRadius:16, padding:"24px 0 16px", marginBottom:28 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, paddingInline:20 }}>
              <div>
                <h2 style={{ margin:0, fontSize:15, fontWeight:600, color:"#1e3a5f" }}>{kpi.title}</h2>
                <p style={{ margin:"4px 0 0", fontSize:12, color:"#6b7280" }}>
                  Monthly Performance — {CHART_TYPES.find(c => c.value === chartType)?.label}
                  {selectedType === "opi" && kpi.companyId && (
                    <span style={{ marginLeft:8, background:"#f0fdf4", color:"#16a34a", fontSize:11, padding:"2px 8px", borderRadius:99 }}>
                      Company: {kpi.companyId}
                    </span>
                  )}
                </p>
              </div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                {/* KPI / OPI Badge */}
                <span style={{
                  background: selectedType === "opi" ? "#f0fdf4" : "#eff6ff",
                  color:      selectedType === "opi" ? "#16a34a"  : "#3b82f6",
                  fontSize:12, padding:"4px 12px", borderRadius:99, fontWeight:600
                }}>
                  {selectedType?.toUpperCase()}
                </span>
                <span style={{ background:"#dbeafe", color:"#3b82f6", fontSize:12, padding:"4px 12px", borderRadius:99 }}>
                  {new Date().getFullYear()}
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={340}>
              {renderChart()}
            </ResponsiveContainer>
          </div>

          {/* Monthly Breakdown */}
          <div style={{ background:"#ffffff", border:"1px solid #dbeafe", borderRadius:16, overflow:"hidden" }}>
            <div style={{ padding:"16px 20px", borderBottom:"1px solid #dbeafe" }}>
              <p style={{ fontSize:14, fontWeight:600, color:"#1e3a5f", margin:0 }}>Monthly Breakdown</p>
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:"linear-gradient(90deg,#f0f9ff,#f5f3ff)" }}>
                    {MONTHS.map(m => (
                      <th key={m} style={{ padding:"11px 6px", textAlign:"center", fontSize:11, fontWeight:600, color:"#93c5fd", textTransform:"uppercase", letterSpacing:"0.06em", borderBottom:"1px solid #dbeafe" }}>
                        {m}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {MONTH_KEYS.map(mk => {
                      const v = kpi[mk] ?? 0;
                      return (
                        <td key={mk} style={{ padding:"12px 6px", textAlign:"center", fontSize:13, fontWeight:600, color: v > 0 ? "#3b82f6" : "#d1d5db", background: v > 0 ? "rgba(239,246,255,0.6)" : "transparent" }}>
                          {v}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Empty */}
      {!loading && !error && kpiData.length === 0 && opiData.length === 0 && (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"80px 0", textAlign:"center" }}>
          <div style={{ width:64, height:64, borderRadius:16, background:"#eff6ff", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
            <i className="fas fa-chart-bar" style={{ fontSize:24, color:"#93c5fd" }}></i>
          </div>
          <p style={{ fontSize:15, fontWeight:600, color:"#64748b", margin:"0 0 4px" }}>No data available</p>
          <p style={{ fontSize:13, color:"#94a3b8", margin:0 }}>Data will appear here once loaded from the API.</p>
        </div>
      )}
    </div>
  );
}