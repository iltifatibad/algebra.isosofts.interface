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
  const [tableData, setTableData]   = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [chartType, setChartType]   = useState("bar");
  const [chartWidth, setChartWidth] = useState(0);

  const chartContainerRef = useRef(null);

  /* Measure real pixel width of the chart container */
  useLayoutEffect(() => {
    if (!chartContainerRef.current) return;
    const measure = () => {
      const w = chartContainerRef.current?.getBoundingClientRect().width ?? 0;
      setChartWidth(w);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(chartContainerRef.current);
    return () => ro.disconnect();
  }, []);

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

  const selectedKPI  = tableData.find((k) => k.id === selectedId) || null;
  const monthlyData  = selectedKPI ? getMonthlyData(selectedKPI) : [];
  const nonZeroMonths = monthlyData.filter((d) => d.value > 0);
  const vsTarget = selectedKPI?.annualTarget > 0
    ? ((selectedKPI.actualKPI / selectedKPI.annualTarget) * 100).toFixed(1)
    : null;

  const W = chartWidth > 0 ? chartWidth : 600;
  const H = 300;

  const gridColor = "#e0f2fe";
  const primary   = "#3b82f6";
  const tick      = { fill: "#94a3b8", fontSize: 11 };
  const margin    = { top: 10, right: 8, left: -20, bottom: 0 };

  const renderChart = () => {
    if (!selectedKPI || W === 0) return null;

    switch (chartType) {
      case "bar":
        return (
          <BarChart width={W} height={H} data={monthlyData} margin={margin}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="month" tick={tick} axisLine={false} tickLine={false} />
            <YAxis tick={tick} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#eff6ff" }} />
            <Bar dataKey="value" fill={primary} radius={[6,6,0,0]} maxBarSize={48} />
          </BarChart>
        );

      case "line":
        return (
          <LineChart width={W} height={H} data={monthlyData} margin={margin}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="month" tick={tick} axisLine={false} tickLine={false} />
            <YAxis tick={tick} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="value" stroke={primary} strokeWidth={2.5}
              dot={{ fill: primary, r: 4, strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }} />
          </LineChart>
        );

      case "area":
        return (
          <AreaChart width={W} height={H} data={monthlyData} margin={margin}>
            <defs>
              <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={primary} stopOpacity={0.18} />
                <stop offset="95%" stopColor={primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="month" tick={tick} axisLine={false} tickLine={false} />
            <YAxis tick={tick} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="value" stroke={primary} strokeWidth={2.5} fill="url(#ag)" />
          </AreaChart>
        );

      case "radar":
        return (
          <RadarChart width={W} height={H + 20} data={monthlyData} margin={{ top:10, right:30, left:30, bottom:10 }}>
            <PolarGrid stroke={gridColor} />
            <PolarAngleAxis dataKey="month" tick={{ fill:"#94a3b8", fontSize:11 }} />
            <PolarRadiusAxis tick={{ fill:"#cbd5e1", fontSize:10 }} />
            <Radar name={selectedKPI.title} dataKey="value"
              stroke={primary} fill={primary} fillOpacity={0.18} strokeWidth={2} />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        );

      case "pie": {
        const pieData = nonZeroMonths.length > 0 ? nonZeroMonths : [{ month: "No Data", value: 1 }];
        return (
          <PieChart width={W} height={H}>
            <Pie data={pieData} dataKey="value" nameKey="month"
              cx="50%" cy="50%" outerRadius={110} innerRadius={55}
              paddingAngle={3}
              label={({ month, percent }) => `${month} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}>
              {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
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
      <div className="flex h-full">
        <div style={{ marginLeft:256, flex:1, minWidth:0, padding:"32px", background:"linear-gradient(135deg,rgba(239,246,255,0.5) 0%,#fff 100%)", height:"100%", overflowY:"auto" }}>

          {/* Page Header */}
          <div className="mb-6">
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              KPI Dashboard
            </h3>
            <p className="text-sm text-gray-400 mt-1">Monitor key performance indicators across all functions</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg" style={{ overflow:"visible" }}>

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

              <div className="w-px h-8 bg-blue-100 hidden sm:block"></div>

              {/* Chart Type Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {CHART_TYPES.map((ct) => (
                  <button
                    key={ct.value}
                    onClick={() => setChartType(ct.value)}
                    className={[
                      "group px-4 py-2.5 rounded-xl font-medium text-sm tracking-wide flex items-center gap-2 transition-all duration-300 ease-out active:scale-[0.97]",
                      chartType === ct.value
                        ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30"
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
                className="group ml-auto p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 shadow-sm hover:shadow-md transition-all duration-300 ease-out disabled:opacity-50"
              >
                <i className={`fas fa-rotate-right text-sm transition-transform duration-500 group-hover:rotate-180 ${loading ? "animate-spin" : ""}`}></i>
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
                    bgClass={vsTarget === null ? "bg-slate-100" : parseFloat(vsTarget) >= 100 ? "bg-emerald-100" : parseFloat(vsTarget) >= 60 ? "bg-amber-100" : "bg-red-100"}
                    textClass={vsTarget === null ? "text-slate-500" : parseFloat(vsTarget) >= 100 ? "text-emerald-600" : parseFloat(vsTarget) >= 60 ? "text-amber-600" : "text-red-500"}
                    icon="fa-percent"
                  />
                </div>

                {/* Chart Card */}
                <div style={{ background:"#fff", borderRadius:16, border:"1px solid #eff6ff", boxShadow:"0 1px 4px rgba(59,130,246,0.07)", overflow:"hidden" }}>
                  <div style={{ padding:"16px 24px", borderBottom:"1px solid #eff6ff", display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16 }}>
                    <div>
                      <p style={{ fontSize:14, fontWeight:600, color:"#1e293b", margin:0 }}>{selectedKPI.title}</p>
                      <p style={{ fontSize:12, color:"#94a3b8", margin:"2px 0 0" }}>Monthly distribution — {new Date().getFullYear()}</p>
                    </div>
                    <span style={{ fontSize:11, fontWeight:600, color:"#3b82f6", background:"#eff6ff", padding:"6px 12px", borderRadius:999, whiteSpace:"nowrap", flexShrink:0 }}>
                      <i className={`fas ${CHART_TYPES.find(c => c.value === chartType)?.icon}`} style={{ marginRight:6 }}></i>
                      {CHART_TYPES.find(c => c.value === chartType)?.label} Chart
                    </span>
                  </div>
                  {/* This ref div gives us the exact pixel width */}
                  <div ref={chartContainerRef} style={{ width:"100%", padding:"24px 0", boxSizing:"border-box", overflowX:"hidden" }}>
                    <div style={{ display:"block", lineHeight:0 }}>
                      {renderChart()}
                    </div>
                  </div>
                </div>

                {/* Monthly Breakdown */}
                <div style={{ background:"#fff", borderRadius:16, border:"1px solid #eff6ff", boxShadow:"0 1px 4px rgba(59,130,246,0.07)", overflow:"hidden" }}>
                  <div style={{ padding:"16px 24px", borderBottom:"1px solid #eff6ff" }}>
                    <p style={{ fontSize:14, fontWeight:600, color:"#1e293b", margin:0 }}>Monthly Breakdown</p>
                  </div>
                  <div style={{ overflowX:"auto" }}>
                    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                      <thead>
                        <tr style={{ background:"linear-gradient(90deg,rgba(239,246,255,0.7) 0%,rgba(238,242,255,0.4) 100%)" }}>
                          {MONTH_LABELS.map((m) => (
                            <th key={m} style={{ padding:"12px 8px", textAlign:"center", fontSize:11, fontWeight:600, color:"#93c5fd", textTransform:"uppercase", letterSpacing:"0.06em", borderBottom:"1px solid #eff6ff" }}>
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
                              <td key={m} style={{ padding:"12px 8px", textAlign:"center", fontWeight:600, color: val > 0 ? "#3b82f6" : "#d1d5db", background: val > 0 ? "rgba(239,246,255,0.5)" : "transparent" }}>
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
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"80px 0", textAlign:"center" }}>
                <div style={{ width:64, height:64, borderRadius:16, background:"#eff6ff", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
                  <i className="fas fa-chart-bar text-2xl text-blue-300"></i>
                </div>
                <p style={{ fontSize:15, fontWeight:600, color:"#64748b", margin:"0 0 4px" }}>No KPI data available</p>
                <p style={{ fontSize:13, color:"#94a3b8", margin:0 }}>Data will appear here once loaded from the API.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}