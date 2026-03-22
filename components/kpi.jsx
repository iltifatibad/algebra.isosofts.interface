import { useState, useEffect } from "react";
import {
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
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

const PIE_COLORS = ["#3b82f6","#6366f1","#0ea5e9","#8b5cf6","#06b6d4","#60a5fa","#a78bfa","#38bdf8","#93c5fd","#c4b5fd","#7dd3fc","#ddd6fe"];

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

const StatCard = ({ label, value, bgClass, textClass, icon }) => (
  <div style={{ background:"#fff", borderRadius:16, border:"1px solid #eff6ff", boxShadow:"0 1px 4px rgba(59,130,246,0.07)", padding:"14px 18px", display:"flex", alignItems:"center", gap:14, flex:"1 1 140px" }}>
    <div className={`${bgClass} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`}>
      <i className={`fas ${icon} ${textClass} text-sm`}></i>
    </div>
    <div>
      <p style={{ fontSize:11, fontWeight:500, color:"#94a3b8", margin:"0 0 2px", textTransform:"uppercase", letterSpacing:"0.05em" }}>{label}</p>
      <p style={{ fontSize:20, fontWeight:700, color:"#1e293b", margin:0, lineHeight:1 }}>{value ?? "—"}</p>
    </div>
  </div>
);

export default function KPIDashboard() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [chartType, setChartType] = useState("bar");

  const getToken = () =>
    document.cookie.split("; ").find((r) => r.startsWith("auth_token="))?.split("=").slice(1).join("=") ?? "";

  const getAll = () => {
    setLoading(true);
    const token = getToken();
    fetch(`/api/dashboard/kpi?token=${token}`)
      .then((res) => { if (!res.ok) throw new Error("Failed To Get Datas From Database"); return res.json(); })
      .then((data) => { setTableData(data); if (data.length > 0) setSelectedId(data[0].id); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  };

  useEffect(() => { getAll(); }, []);

  const selectedKPI = tableData.find((k) => k.id === selectedId) || null;
  const monthlyData = selectedKPI ? getMonthlyData(selectedKPI) : [];
  const nonZeroMonths = monthlyData.filter((d) => d.value > 0);
  const vsTarget = selectedKPI?.annualTarget > 0
    ? ((selectedKPI.actualKPI / selectedKPI.annualTarget) * 100).toFixed(1)
    : null;

  const renderChart = () => {
    if (!selectedKPI) return null;
    const common = { data: monthlyData, margin: { top: 10, right: 0, left: -20, bottom: 0 } };
    const gridColor = "#e0f2fe";
    const primary = "#3b82f6";
    const tick = { fill: "#94a3b8", fontSize: 11 };

    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300} minWidth={0} debounce={50}>
            <BarChart {...common}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" tick={tick} axisLine={false} tickLine={false} />
              <YAxis tick={tick} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#eff6ff", radius: 6 }} />
              <Bar dataKey="value" fill={primary} radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300} minWidth={0} debounce={50}>
            <LineChart {...common}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" tick={tick} axisLine={false} tickLine={false} />
              <YAxis tick={tick} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="value" stroke={primary} strokeWidth={2.5}
                dot={{ fill: primary, r: 4, strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer width="100%" height={300} minWidth={0} debounce={50}>
            <AreaChart {...common}>
              <defs>
                <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={primary} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" tick={tick} axisLine={false} tickLine={false} />
              <YAxis tick={tick} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke={primary} strokeWidth={2.5} fill="url(#ag)" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case "radar":
        return (
          <ResponsiveContainer width="100%" height={320} minWidth={0} debounce={50}>
            <RadarChart data={monthlyData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
              <PolarGrid stroke={gridColor} />
              <PolarAngleAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <PolarRadiusAxis tick={{ fill: "#cbd5e1", fontSize: 10 }} />
              <Radar name={selectedKPI.title} dataKey="value"
                stroke={primary} fill={primary} fillOpacity={0.18} strokeWidth={2} />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        );
      case "pie": {
        const pieData = nonZeroMonths.length > 0 ? nonZeroMonths : [{ month: "No Data", value: 1 }];
        return (
          <ResponsiveContainer width="100%" height={300} minWidth={0} debounce={50}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="month"
                cx="50%" cy="50%" outerRadius={110} innerRadius={55}
                paddingAngle={3}
                label={({ month, percent }) => `${month} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      }
      default: return null;
    }
  };

  return (
    <div className="pt-20 h-screen overflow-hidden">
      <div className="flex h-full">
        <div style={{ marginLeft: 256, flex: 1, minWidth: 0, padding: "32px", background: "linear-gradient(135deg, rgba(239,246,255,0.5) 0%, #fff 100%)", height: "100%", overflowY: "auto" }}>

          {/* Page Header */}
          <div className="mb-6">
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              KPI Dashboard
            </h3>
            <p className="text-sm text-gray-400 mt-1">Monitor key performance indicators across all functions</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg" style={{ overflow: "visible" }}>

            {/* Toolbar */}
            <div className="p-6 border-b border-blue-100 flex flex-wrap items-center gap-3 rounded-t-2xl">

              {/* KPI Dropdown */}
              <div className="relative flex-1 min-w-[260px] max-w-sm">
                <i className="fas fa-chart-bar absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400 text-xs pointer-events-none z-10"></i>
                <select
                  value={selectedId || ""}
                  onChange={(e) => setSelectedId(e.target.value)}
                  disabled={loading}
                  className="w-full pl-9 pr-9 py-2.5 bg-blue-50/60 border border-blue-100 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all cursor-pointer appearance-none"
                >
                  {tableData.map((kpi) => (
                    <option key={kpi.id} value={kpi.id}>{kpi.no} — {kpi.title}</option>
                  ))}
                </select>
                <i className="fas fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-300 text-xs pointer-events-none"></i>
              </div>

              {/* Divider */}
              <div className="w-px h-8 bg-blue-100 hidden sm:block"></div>

              {/* Chart Type Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {CHART_TYPES.map((ct) => (
                  <button
                    key={ct.value}
                    onClick={() => setChartType(ct.value)}
                    className={[
                      "group relative overflow-hidden px-4 py-2.5 rounded-xl font-medium text-sm tracking-wide flex items-center gap-2 transition-all duration-300 ease-out active:scale-[0.97]",
                      chartType === ct.value
                        ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 hover:from-indigo-700 hover:to-blue-700"
                        : "bg-white border border-slate-200 text-slate-600 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50/60 shadow-sm hover:shadow-md",
                    ].join(" ")}
                  >
                    <i className={`fas ${ct.icon} text-xs`}></i>
                    {ct.label}
                  </button>
                ))}
              </div>

              {/* Refresh */}
              <button
                onClick={getAll}
                disabled={loading}
                title="Refresh Data"
                className="group ml-auto p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 shadow-sm hover:shadow-md transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className={`fas fa-rotate-right text-sm transition-transform duration-500 group-hover:rotate-180 ${loading ? "animate-spin" : ""}`}></i>
              </button>
            </div>

            {/* States */}
            {loading && (
              <div className="flex flex-col items-center justify-center gap-3 py-24">
                <i className="fas fa-circle-notch animate-spin text-2xl text-blue-400"></i>
                <span className="text-sm font-medium text-gray-400">Loading KPI data...</span>
              </div>
            )}

            {error && (
              <div className="mx-6 mt-4 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <i className="fas fa-triangle-exclamation text-red-400"></i>
                <span className="text-sm text-red-600 font-medium">{error}</span>
              </div>
            )}

            {/* Main Content */}
            {selectedKPI && !loading && (
              <div className="p-6 space-y-5 pb-10">

                {/* Stat Cards */}
                <div className="flex flex-wrap gap-3">
                  <StatCard label="KPI No"        value={selectedKPI.no}           bgClass="bg-blue-100"    textClass="text-blue-600"    icon="fa-hashtag" />
                  <StatCard label="Last Year KPI" value={selectedKPI.lykpi}        bgClass="bg-indigo-100"  textClass="text-indigo-600"  icon="fa-clock-rotate-left" />
                  <StatCard label="Actual KPI"    value={selectedKPI.actualKPI}    bgClass="bg-sky-100"     textClass="text-sky-600"     icon="fa-bullseye" />
                  <StatCard label="Annual Target" value={selectedKPI.annualTarget} bgClass="bg-emerald-100" textClass="text-emerald-600" icon="fa-flag-checkered" />
                  <StatCard
                    label="vs Target"
                    value={vsTarget !== null ? `${vsTarget}%` : "N/A"}
                    bgClass={
                      vsTarget === null              ? "bg-slate-100"
                      : parseFloat(vsTarget) >= 100 ? "bg-emerald-100"
                      : parseFloat(vsTarget) >= 60  ? "bg-amber-100"
                      :                               "bg-red-100"
                    }
                    textClass={
                      vsTarget === null              ? "text-slate-500"
                      : parseFloat(vsTarget) >= 100 ? "text-emerald-600"
                      : parseFloat(vsTarget) >= 60  ? "text-amber-600"
                      :                               "text-red-500"
                    }
                    icon="fa-percent"
                  />
                </div>

                {/* Chart */}
                <div className="bg-white rounded-2xl border border-blue-50 shadow-sm" style={{ overflow: "hidden", minWidth: 0 }}>
                  <div className="px-6 py-4 border-b border-blue-50 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{selectedKPI.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Monthly distribution — {new Date().getFullYear()}</p>
                    </div>
                    <span className="text-xs font-semibold text-blue-500 bg-blue-50 px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0">
                      <i className={`fas ${CHART_TYPES.find(c => c.value === chartType)?.icon} mr-1.5`}></i>
                      {CHART_TYPES.find(c => c.value === chartType)?.label} Chart
                    </span>
                  </div>
                  <div style={{ padding: "24px 16px 24px 16px", width: "100%", boxSizing: "border-box" }}>
                    <div style={{ width: "100%", display: "block" }}>
                      {renderChart()}
                    </div>
                  </div>
                </div>

                {/* Monthly Breakdown Table */}
                <div className="bg-white rounded-2xl border border-blue-50 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-blue-50">
                    <p className="text-sm font-semibold text-gray-800">Monthly Breakdown</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-blue-50/60 to-indigo-50/40">
                          {MONTH_LABELS.map((m) => (
                            <th key={m} className="px-3 py-3 text-center text-xs font-semibold text-blue-400 uppercase tracking-wider border-b border-blue-100">
                              {m}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {MONTHS.map((m) => {
                            const val = selectedKPI[m];
                            return (
                              <td key={m} className={`px-3 py-3 text-center text-sm font-semibold ${val > 0 ? "text-blue-600 bg-blue-50/50" : "text-gray-300"}`}>
                                {val}
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

            {/* Empty State */}
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
    </div>
  );
}