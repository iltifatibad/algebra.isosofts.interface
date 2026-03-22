import { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

const MONTHS = ["january","february","march","april","may","june","july","august","september","october","november","december"];
const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const CHART_TYPES = [
  { value: "bar",   label: "Bar",   icon: "fa-chart-bar" },
  { value: "line",  label: "Line",  icon: "fa-chart-line" },
  { value: "area",  label: "Area",  icon: "fa-chart-area" },
  { value: "radar", label: "Radar", icon: "fa-bullseye" },
  { value: "pie",   label: "Pie",   icon: "fa-chart-pie" },
];

const PIE_COLORS = ["#3b82f6","#6366f1","#0ea5e9","#8b5cf6","#06b6d4","#60a5fa","#a78bfa","#38bdf8"];

function getMonthlyData(kpi) {
  return MONTHS.map((m, i) => ({ month: MONTH_LABELS[i], value: kpi[m] ?? 0 }));
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background:"#fff", borderRadius:12, boxShadow:"0 4px 20px rgba(59,130,246,0.15)", border:"1px solid #dbeafe", padding:"10px 16px" }}>
        <p style={{ fontSize:11, fontWeight:600, color:"#3b82f6", textTransform:"uppercase", letterSpacing:"0.05em", margin:"0 0 4px" }}>{label}</p>
        <p style={{ fontSize:18, fontWeight:700, color:"#1e293b", margin:0 }}>{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const StatCard = ({ label, value, bg, color, icon }) => (
  <div style={{ background:"#fff", borderRadius:16, border:"1px solid #eff6ff", boxShadow:"0 1px 4px rgba(59,130,246,0.07)", padding:"14px 18px", display:"flex", alignItems:"center", gap:14, flex:"1 1 140px", minWidth:0 }}>
    <div style={{ width:40, height:40, borderRadius:12, background:bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      <i className={`fas ${icon}`} style={{ color, fontSize:14 }}></i>
    </div>
    <div style={{ minWidth:0 }}>
      <p style={{ fontSize:11, fontWeight:500, color:"#94a3b8", margin:"0 0 2px", textTransform:"uppercase", letterSpacing:"0.05em" }}>{label}</p>
      <p style={{ fontSize:20, fontWeight:700, color:"#1e293b", margin:0, lineHeight:1 }}>{value ?? "—"}</p>
    </div>
  </div>
);

export default function KPIDashboard() {
  const [tableData, setTableData]   = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [chartType, setChartType]   = useState("bar");
  const [chartW, setChartW]         = useState(600);

  const chartRef = useRef(null);

  useLayoutEffect(() => {
    if (!chartRef.current) return;
    const update = () => setChartW(chartRef.current.getBoundingClientRect().width);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(chartRef.current);
    return () => ro.disconnect();
  }, []);

  const getToken = () =>
    document.cookie.split("; ").find(r => r.startsWith("auth_token="))?.split("=").slice(1).join("=") ?? "";

  const getAll = () => {
    setLoading(true);
    const token = getToken();
    fetch(`/api/dashboard/kpi?token=${token}`)
      .then(r => { if (!r.ok) throw new Error("Failed To Get Datas From Database"); return r.json(); })
      .then(data => { setTableData(data); if (data.length > 0) setSelectedId(data[0].id); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  };

  useEffect(() => { getAll(); }, []);

  const kpi = tableData.find(k => k.id === selectedId) || null;
  const monthlyData = kpi ? getMonthlyData(kpi) : [];
  const nonZero = monthlyData.filter(d => d.value > 0);
  const vsTarget = kpi?.annualTarget > 0
    ? ((kpi.actualKPI / kpi.annualTarget) * 100).toFixed(1) : null;

  const gc = "#e0f2fe", pc = "#3b82f6";
  const tick = { fill:"#94a3b8", fontSize:11 };
  const mg = { top:10, right:8, left:-20, bottom:0 };
  const W = chartW, H = 300;

  const Chart = () => {
    if (!kpi) return null;
    switch (chartType) {
      case "bar": return (
        <BarChart width={W} height={H} data={monthlyData} margin={mg}>
          <CartesianGrid strokeDasharray="3 3" stroke={gc} vertical={false} />
          <XAxis dataKey="month" tick={tick} axisLine={false} tickLine={false} />
          <YAxis tick={tick} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill:"#eff6ff" }} />
          <Bar dataKey="value" fill={pc} radius={[6,6,0,0]} maxBarSize={48} />
        </BarChart>
      );
      case "line": return (
        <LineChart width={W} height={H} data={monthlyData} margin={mg}>
          <CartesianGrid strokeDasharray="3 3" stroke={gc} vertical={false} />
          <XAxis dataKey="month" tick={tick} axisLine={false} tickLine={false} />
          <YAxis tick={tick} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="value" stroke={pc} strokeWidth={2.5}
            dot={{ fill:pc, r:4, strokeWidth:2, stroke:"#fff" }}
            activeDot={{ r:6, stroke:"#fff", strokeWidth:2 }} />
        </LineChart>
      );
      case "area": return (
        <AreaChart width={W} height={H} data={monthlyData} margin={mg}>
          <defs>
            <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={pc} stopOpacity={0.18} />
              <stop offset="95%" stopColor={pc} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gc} vertical={false} />
          <XAxis dataKey="month" tick={tick} axisLine={false} tickLine={false} />
          <YAxis tick={tick} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="value" stroke={pc} strokeWidth={2.5} fill="url(#ag)" />
        </AreaChart>
      );
      case "radar": return (
        <RadarChart width={W} height={H+20} data={monthlyData} margin={{ top:10, right:30, left:30, bottom:10 }}>
          <PolarGrid stroke={gc} />
          <PolarAngleAxis dataKey="month" tick={{ fill:"#94a3b8", fontSize:11 }} />
          <PolarRadiusAxis tick={{ fill:"#cbd5e1", fontSize:10 }} />
          <Radar dataKey="value" stroke={pc} fill={pc} fillOpacity={0.18} strokeWidth={2} />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      );
      case "pie": {
        const pd = nonZero.length > 0 ? nonZero : [{ month:"No Data", value:1 }];
        return (
          <PieChart width={W} height={H}>
            <Pie data={pd} dataKey="value" nameKey="month"
              cx="50%" cy="50%" outerRadius={110} innerRadius={55} paddingAngle={3}
              label={({ month, percent }) => `${month} ${(percent*100).toFixed(0)}%`}
              labelLine={false}>
              {pd.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      }
      default: return null;
    }
  };

  return (
    <div className="pt-20 h-screen overflow-hidden">

        {/* ── Main content ── */}
        <div className="ml-64 p-8 bg-gradient-to-br from-blue-50/50 to-white h-full overflow-y-auto">

          {/* Header */}
          <div className="mb-6">
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              KPI Dashboard
            </h3>
            <p className="text-sm text-gray-400 mt-1">Monitor key performance indicators across all functions</p>
          </div>

          {/* Card */}
          <div className="bg-white !rounded-button shadow-lg overflow-hidden">

            {/* Toolbar */}
            <div className="p-6 border-b border-blue-100 flex flex-wrap items-center gap-3">

              {/* KPI select */}
              <div className="relative" style={{ flex:"1 1 260px", maxWidth:380 }}>
                <i className="fas fa-chart-bar absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 text-xs pointer-events-none z-10"></i>
                <select
                  value={selectedId || ""}
                  onChange={e => setSelectedId(e.target.value)}
                  disabled={loading}
                  className="w-full pl-8 pr-8 py-2.5 bg-blue-50/60 border border-blue-100 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer appearance-none"
                >
                  {tableData.map(k => (
                    <option key={k.id} value={k.id}>{k.no} — {k.title}</option>
                  ))}
                </select>
                <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 text-xs pointer-events-none"></i>
              </div>

              {/* Chart buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {CHART_TYPES.map(ct => (
                  <button key={ct.value} onClick={() => setChartType(ct.value)}
                    className={[
                      "!rounded-button px-4 py-2.5 font-medium text-sm flex items-center gap-2 transition-all duration-300 active:scale-[0.97]",
                      chartType === ct.value
                        ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30"
                        : "bg-white border border-slate-200 text-slate-600 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 shadow-sm",
                    ].join(" ")}
                  >
                    <i className={`fas ${ct.icon} text-xs`}></i>
                    {ct.label}
                  </button>
                ))}
              </div>

              {/* Refresh */}
              <button onClick={getAll} disabled={loading}
                className="!rounded-button ml-auto p-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 shadow-sm transition-all duration-300 disabled:opacity-50"
              >
                <i className={`fas fa-rotate-right text-sm ${loading ? "animate-spin" : ""}`}></i>
              </button>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center gap-3 py-24">
                <i className="fas fa-circle-notch animate-spin text-2xl text-blue-400"></i>
                <span className="text-sm font-medium text-gray-400">Loading KPI data...</span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mx-6 mt-4 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <i className="fas fa-triangle-exclamation text-red-400"></i>
                <span className="text-sm text-red-600 font-medium">{error}</span>
              </div>
            )}

            {/* Content */}
            {kpi && !loading && (
              <div className="p-6 space-y-5">

                {/* Stat Cards */}
                <div style={{ display:"flex", flexWrap:"wrap", gap:12 }}>
                  <StatCard label="KPI No"        value={kpi.no}           bg="#dbeafe" color="#2563eb" icon="fa-hashtag" />
                  <StatCard label="Last Year KPI" value={kpi.lykpi}        bg="#e0e7ff" color="#4f46e5" icon="fa-clock-rotate-left" />
                  <StatCard label="Actual KPI"    value={kpi.actualKPI}    bg="#e0f2fe" color="#0284c7" icon="fa-bullseye" />
                  <StatCard label="Annual Target" value={kpi.annualTarget} bg="#d1fae5" color="#059669" icon="fa-flag-checkered" />
                  <StatCard
                    label="vs Target"
                    value={vsTarget !== null ? `${vsTarget}%` : "N/A"}
                    bg={vsTarget === null ? "#f1f5f9" : parseFloat(vsTarget) >= 100 ? "#d1fae5" : parseFloat(vsTarget) >= 60 ? "#fef3c7" : "#fee2e2"}
                    color={vsTarget === null ? "#64748b" : parseFloat(vsTarget) >= 100 ? "#059669" : parseFloat(vsTarget) >= 60 ? "#d97706" : "#dc2626"}
                    icon="fa-percent"
                  />
                </div>

                {/* Chart */}
                <div style={{ background:"#fff", borderRadius:16, border:"1px solid #eff6ff", boxShadow:"0 1px 6px rgba(59,130,246,0.08)", overflow:"hidden" }}>
                  <div style={{ padding:"16px 20px", borderBottom:"1px solid #eff6ff", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div>
                      <p style={{ fontSize:14, fontWeight:600, color:"#1e293b", margin:0 }}>{kpi.title}</p>
                      <p style={{ fontSize:12, color:"#94a3b8", margin:"2px 0 0" }}>Monthly distribution — {new Date().getFullYear()}</p>
                    </div>
                    <span style={{ fontSize:11, fontWeight:600, color:"#3b82f6", background:"#eff6ff", padding:"5px 12px", borderRadius:999, whiteSpace:"nowrap" }}>
                      <i className={`fas ${CHART_TYPES.find(c => c.value === chartType)?.icon}`} style={{ marginRight:5 }}></i>
                      {CHART_TYPES.find(c => c.value === chartType)?.label} Chart
                    </span>
                  </div>
                  {/* ref container — full width, no extra padding on sides */}
                  <div ref={chartRef} style={{ width:"100%", paddingTop:20, paddingBottom:20, overflow:"hidden", boxSizing:"border-box" }}>
                    <Chart />
                  </div>
                </div>

                {/* Monthly Breakdown */}
                <div style={{ background:"#fff", borderRadius:16, border:"1px solid #eff6ff", boxShadow:"0 1px 6px rgba(59,130,246,0.08)", overflow:"hidden" }}>
                  <div style={{ padding:"16px 20px", borderBottom:"1px solid #eff6ff" }}>
                    <p style={{ fontSize:14, fontWeight:600, color:"#1e293b", margin:0 }}>Monthly Breakdown</p>
                  </div>
                  <div style={{ overflowX:"auto" }}>
                    <table style={{ width:"100%", borderCollapse:"collapse" }}>
                      <thead>
                        <tr style={{ background:"linear-gradient(90deg,#f0f9ff,#f5f3ff)" }}>
                          {MONTH_LABELS.map(m => (
                            <th key={m} style={{ padding:"11px 6px", textAlign:"center", fontSize:11, fontWeight:600, color:"#93c5fd", textTransform:"uppercase", letterSpacing:"0.06em", borderBottom:"1px solid #eff6ff" }}>
                              {m}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {MONTHS.map(m => {
                            const v = kpi[m];
                            return (
                              <td key={m} style={{ padding:"12px 6px", textAlign:"center", fontSize:13, fontWeight:600, color: v > 0 ? "#3b82f6" : "#d1d5db", background: v > 0 ? "rgba(239,246,255,0.6)" : "transparent" }}>
                                {v}
                              </td>
                            );
                          })}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* Empty */}
            {!loading && !error && tableData.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                  <i className="fas fa-chart-bar text-2xl text-blue-300"></i>
                </div>
                <p className="text-base font-semibold text-gray-500 mb-1">No KPI data available</p>
                <p className="text-sm text-gray-400">Data will appear here once loaded from the API.</p>
              </div>
            )}

          </div>
        </div>
    </div>
  );
}