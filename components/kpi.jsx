import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from "recharts";

const KPI_DATA = {
  "Objectives Completion Rate":                { unit: "%", lastYear: 78, target: 90, monthly: [72,75,78,80,82,85,83,87,88,90,89,91] },
  "HS Risk Actions Closure Rate":              { unit: "%", lastYear: 65, target: 85, monthly: [60,63,67,70,72,74,73,76,79,81,83,85] },
  "Legal Compliance Actions Closure Rate":     { unit: "%", lastYear: 88, target: 95, monthly: [85,86,88,89,90,91,90,92,93,94,94,95] },
  "Environmental Aspects Actions Closure Rate":{ unit: "%", lastYear: 70, target: 88, monthly: [68,70,71,73,75,76,74,78,80,82,84,87] },
  "Equipment Maintenance/Calibration Rate":    { unit: "%", lastYear: 92, target: 98, monthly: [90,91,92,93,94,95,94,96,96,97,97,98] },
  "Training Completion Rate":                  { unit: "%", lastYear: 80, target: 95, monthly: [75,78,80,82,84,86,85,88,90,92,93,94] },
  "Documents Review Rate":                     { unit: "%", lastYear: 74, target: 90, monthly: [70,72,74,75,77,79,78,81,83,85,87,89] },
  "Vendors Evaluation Rate":                   { unit: "%", lastYear: 60, target: 80, monthly: [55,58,60,62,65,67,66,69,71,74,76,79] },
  "Customer Retention Rate":                   { unit: "%", lastYear: 85, target: 93, monthly: [83,84,85,86,87,88,87,89,90,91,92,93] },
  "Number of New Customer":                    { unit: "",  lastYear: 24, target: 40, monthly: [2,3,2,4,3,4,3,4,5,4,5,4] },
  "Customer Satisfaction Rate":                { unit: "%", lastYear: 82, target: 92, monthly: [80,81,82,83,84,85,84,86,87,89,90,91] },
  "MOC Actions closure Rate":                  { unit: "%", lastYear: 68, target: 85, monthly: [64,66,68,70,72,74,73,75,77,80,82,84] },
  "Finding Actions Closure Rate":              { unit: "%", lastYear: 72, target: 88, monthly: [69,71,72,74,76,77,76,79,81,83,85,87] },
  "Number of negative findings":               { unit: "",  lastYear: 18, target: 8,  monthly: [20,18,17,16,15,14,13,12,11,10,9,8] },
  "Number of improper product/service":        { unit: "",  lastYear: 12, target: 4,  monthly: [14,13,12,11,10,9,8,7,6,5,5,4] },
  "Assurance & Oversight Plan Execution rate": { unit: "%", lastYear: 76, target: 92, monthly: [72,74,76,78,79,81,80,83,85,87,89,91] },
  "Management Review Actions Closure Rate":    { unit: "%", lastYear: 80, target: 95, monthly: [77,79,80,82,84,86,85,87,89,91,92,94] },
};

const MONTHS     = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const CHART_TYPES = ["Line Chart","Bar Chart","Area Chart","Radar Chart","Composed Chart"];

const C = { actual: "#3b82f6", target: "#f59e0b", lastYear: "#10b981" };

const tooltipStyle = {
  contentStyle: {
    background: "#ffffff",
    border: "1px solid #bfdbfe",
    borderRadius: 10,
    color: "#1e3a5f",
    fontSize: 13,
    boxShadow: "0 4px 16px rgba(59,130,246,0.10)",
  }
};

export default function KPIDashboard() {
  const [selectedKPI, setSelectedKPI] = useState("Vendors Evaluation Rate");
  const [chartType,   setChartType]   = useState("Line Chart");

  const kpi        = KPI_DATA[selectedKPI];
  const chartData  = MONTHS.map((m, i) => ({ month: m, Actual: kpi.monthly[i], Target: kpi.target, "Last Year": kpi.lastYear }));
  const radarData  = MONTHS.map((m, i) => ({ month: m, Actual: kpi.monthly[i], Target: kpi.target }));
  const latest     = kpi.monthly[kpi.monthly.length - 1];
  const progress   = Math.min(100, Math.round((latest / kpi.target) * 100));
  const progressColor = progress >= 90 ? "from-emerald-400 to-emerald-500"
                      : progress >= 70 ? "from-amber-400 to-amber-500"
                      :                  "from-red-400 to-red-500";
  const progressText  = progress >= 90 ? "text-emerald-600"
                      : progress >= 70 ? "text-amber-600"
                      :                  "text-red-500";

  const axes = (
    <>
      <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
      <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={{ stroke: "#bfdbfe" }} tickLine={false} />
      <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} unit={kpi.unit} />
      <Tooltip {...tooltipStyle} />
      <Legend wrapperStyle={{ color: "#475569", fontSize: 13, paddingTop: 8 }} />
    </>
  );

  const renderChart = () => {
const common = { data: chartData, margin: { top: 10, right: 5, left: 0, bottom: 0 } };
    if (chartType === "Line Chart") return (
      <LineChart {...common}>
        {axes}
        <Line type="monotone" dataKey="Actual"    stroke={C.actual}    strokeWidth={2.5} dot={{ r: 4, fill: C.actual }} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="Target"    stroke={C.target}    strokeWidth={2}   strokeDasharray="5 5" dot={false} />
        <Line type="monotone" dataKey="Last Year" stroke={C.lastYear}  strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
      </LineChart>
    );

    if (chartType === "Bar Chart") return (
      <BarChart {...common}>
        {axes}
        <Bar dataKey="Actual"    fill={C.actual}   radius={[5,5,0,0]} />
        <Bar dataKey="Target"    fill={C.target}   radius={[5,5,0,0]} />
        <Bar dataKey="Last Year" fill={C.lastYear} radius={[5,5,0,0]} />
      </BarChart>
    );

    if (chartType === "Area Chart") return (
      <AreaChart {...common}>
        <defs>
          <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={C.actual}  stopOpacity={0.18} />
            <stop offset="95%" stopColor={C.actual}  stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gT" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={C.target}  stopOpacity={0.12} />
            <stop offset="95%" stopColor={C.target}  stopOpacity={0} />
          </linearGradient>
        </defs>
        {axes}
        <Area type="monotone" dataKey="Last Year" stroke={C.lastYear} fill="none"       strokeDasharray="3 3" strokeWidth={1.5} />
        <Area type="monotone" dataKey="Target"    stroke={C.target}   fill="url(#gT)"   strokeWidth={2}   strokeDasharray="5 5" />
        <Area type="monotone" dataKey="Actual"    stroke={C.actual}   fill="url(#gA)"   strokeWidth={2.5} />
      </AreaChart>
    );

    if (chartType === "Radar Chart") return (
<RadarChart data={radarData} margin={{ top: 10, right: 5, left: 5, bottom: 10 }}>        <PolarGrid stroke="#dbeafe" />
        <PolarAngleAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} />
        <PolarRadiusAxis tick={{ fill: "#94a3b8", fontSize: 10 }} unit={kpi.unit} />
        <Radar name="Actual" dataKey="Actual" stroke={C.actual}  fill={C.actual}  fillOpacity={0.15} strokeWidth={2} />
        <Radar name="Target" dataKey="Target" stroke={C.target}  fill={C.target}  fillOpacity={0.08} strokeWidth={2} />
        <Legend wrapperStyle={{ color: "#475569", fontSize: 13 }} />
        <Tooltip {...tooltipStyle} />
      </RadarChart>
    );

    if (chartType === "Composed Chart") return (
      <ComposedChart {...common}>
        {axes}
        <Bar  dataKey="Last Year" fill={C.lastYear} opacity={0.35} radius={[4,4,0,0]} />
        <Bar  dataKey="Actual"    fill={C.actual}   radius={[4,4,0,0]} />
        <Line type="monotone" dataKey="Target" stroke={C.target} strokeWidth={2.5} strokeDasharray="6 3" dot={false} />
      </ComposedChart>
    );
  };

  return (
    // ✅ Sitenin mevcut layout wrapper'ıyla birebir uyumlu
    <div className="pt-20 h-screen overflow-hidden">
      <div className="flex h-full">
        <div className="flex-1 ml-64 p-8 bg-gradient-to-br from-blue-50/50 to-white h-full overflow-y-auto">

          {/* ── Sayfa Başlığı ── */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-1">Performance Intelligence</p>
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              KPI Dashboard
            </h2>
          </div>

          {/* ── Ana Kart ── */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">

            {/* Kart Header — dropdown'lar burada */}
            <div className="px-6 py-4 border-b border-blue-100 flex items-center gap-4 flex-wrap bg-gradient-to-r from-slate-50 to-blue-50">

              {/* KPI Seç */}
              <div className="flex-1 min-w-[260px]">
                <label className="block text-xs font-semibold text-blue-500 uppercase tracking-widest mb-1.5">
                  KPI Seç
                </label>
                <select
                  value={selectedKPI}
                  onChange={e => setSelectedKPI(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all"
                >
                  {Object.keys(KPI_DATA).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>

              {/* Grafik Tipi */}
              <div className="min-w-[180px]">
                <label className="block text-xs font-semibold text-blue-500 uppercase tracking-widest mb-1.5">
                  Grafik Tipi
                </label>
                <select
                  value={chartType}
                  onChange={e => setChartType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all"
                >
                  {CHART_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Yıl badge */}
              <div className="ml-auto self-end pb-0.5">
                <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full">2024</span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 pt-5 pb-2">
              {[
                { label: "Last Year",     value: `${kpi.lastYear}${kpi.unit}`, color: "text-emerald-600", bg: "bg-emerald-50",  border: "border-emerald-100" },
                { label: "Annual Target", value: `${kpi.target}${kpi.unit}`,   color: "text-amber-600",   bg: "bg-amber-50",    border: "border-amber-100"   },
                { label: "Latest Actual", value: `${latest}${kpi.unit}`,       color: "text-blue-600",    bg: "bg-blue-50",     border: "border-blue-100"    },
                { label: "Progress",      value: `${progress}%`,               color: progressText,       bg: "bg-slate-50",    border: "border-slate-100"   },
              ].map(s => (
                <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl px-4 py-3`}>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="px-6 pt-3 pb-4">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">Target Progress</span>
                <span className={`text-xs font-bold ${progressText}`}>{progress}%</span>
              </div>
              <div className="h-2 bg-blue-50 border border-blue-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${progressColor} rounded-full transition-all duration-700`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Chart */}
            <div className="px-6 pb-6">
              <div className="bg-gradient-to-br from-blue-50/40 to-white border border-blue-100 rounded-2xl p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-800">{selectedKPI}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Monthly Performance — {chartType}</p>
                  </div>
                </div>
<ResponsiveContainer width="100%" height={320} debounce={50}>                  {renderChart()}
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}