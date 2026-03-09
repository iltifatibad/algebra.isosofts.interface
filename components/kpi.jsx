import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from "recharts";

const KPI_DATA = {
  "Objectives Completion Rate": { unit: "%", lastYear: 78, target: 100, monthly: [72,75,78,80,82,85,83,87,88,90,89,91] },
  "HS Risk Actions Closure Rate": { unit: "%", lastYear: 65, target: 85, monthly: [60,63,67,70,72,74,73,76,79,81,83,85] },
  "Legal Compliance Actions Closure Rate": { unit: "%", lastYear: 88, target: 95, monthly: [85,86,88,89,90,91,90,92,93,94,94,95] },
  "Environmental Aspects Actions Closure Rate": { unit: "%", lastYear: 70, target: 88, monthly: [68,70,71,73,75,76,74,78,80,82,84,87] },
  "Equipment Maintenance/Calibration Rate": { unit: "%", lastYear: 92, target: 98, monthly: [90,91,92,93,94,95,94,96,96,97,97,98] },
  "Training Completion Rate": { unit: "%", lastYear: 80, target: 95, monthly: [75,78,80,82,84,86,85,88,90,92,93,94] },
  "Documents Review Rate": { unit: "%", lastYear: 74, target: 90, monthly: [70,72,74,75,77,79,78,81,83,85,87,89] },
  "Vendors Evaluation Rate": { unit: "%", lastYear: 60, target: 80, monthly: [55,58,60,62,65,67,66,69,71,74,76,79] },
  "Customer Retention Rate": { unit: "%", lastYear: 85, target: 93, monthly: [83,84,85,86,87,88,87,89,90,91,92,93] },
  "Number of New Customer": { unit: "", lastYear: 24, target: 40, monthly: [2,3,2,4,3,4,3,4,5,4,5,4] },
  "Customer Satisfaction Rate": { unit: "%", lastYear: 82, target: 92, monthly: [80,81,82,83,84,85,84,86,87,89,90,91] },
  "MOC Actions closure Rate": { unit: "%", lastYear: 68, target: 85, monthly: [64,66,68,70,72,74,73,75,77,80,82,84] },
  "Finding Actions Closure Rate": { unit: "%", lastYear: 72, target: 88, monthly: [69,71,72,74,76,77,76,79,81,83,85,87] },
  "Number of negative findings": { unit: "", lastYear: 18, target: 8, monthly: [20,18,17,16,15,14,13,12,11,10,9,8] },
  "Number of improper product/service": { unit: "", lastYear: 12, target: 4, monthly: [14,13,12,11,10,9,8,7,6,5,5,4] },
  "Assurance & Oversight Plan Execution rate": { unit: "%", lastYear: 76, target: 92, monthly: [72,74,76,78,79,81,80,83,85,87,89,91] },
  "Management Review Actions Closure Rate": { unit: "%", lastYear: 80, target: 95, monthly: [77,79,80,82,84,86,85,87,89,91,92,94] },
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const CHART_TYPES = ["Line Chart","Bar Chart","Area Chart","Radar Chart","Composed Chart"];
const COLORS = { actual: "#3b82f6", target: "#f59e0b", lastYear: "#10b981" };

const SIDEBAR_WIDTH = 280;
const NAVBAR_HEIGHT = 72;

export default function KPIDashboard() {
  const [selectedKPI, setSelectedKPI] = useState("Vendors Evaluation Rate");
  const [chartType, setChartType] = useState("Line Chart");

  const kpi = KPI_DATA[selectedKPI];
  const chartData = MONTHS.map((m, i) => ({
    month: m,
    Actual: kpi.monthly[i],
    Target: kpi.target,
    "Last Year": kpi.lastYear,
  }));

  const radarData = MONTHS.map((m, i) => ({
    month: m,
    Actual: kpi.monthly[i],
    Target: kpi.target,
  }));

  const latestActual = kpi.monthly[kpi.monthly.length - 1];
  const progress = Math.min(100, Math.round((latestActual / kpi.target) * 100));

  const tooltipStyle = {
    contentStyle: {
      background: "#ffffff",
      border: "1px solid #bfdbfe",
      borderRadius: 8,
      color: "#1e3a5f",
      fontSize: 13,
    }
  };

  const axes = (
    <>
      <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
      <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} />
      <YAxis tick={{ fill: "#64748b", fontSize: 12 }} unit={kpi.unit} />
      <Tooltip {...tooltipStyle} />
      <Legend wrapperStyle={{ color: "#475569", fontSize: 13 }} />
    </>
  );

  const renderChart = () => {
    const common = { data: chartData, margin: { top: 10, right: 0, left: 0, bottom: 0 } };

    if (chartType === "Line Chart") return (
      <LineChart {...common}>
        {axes}
        <Line type="monotone" dataKey="Actual" stroke={COLORS.actual} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="Target" stroke={COLORS.target} strokeWidth={2} strokeDasharray="5 5" dot={false} />
        <Line type="monotone" dataKey="Last Year" stroke={COLORS.lastYear} strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
      </LineChart>
    );
    if (chartType === "Bar Chart") return (
      <BarChart {...common}>
        {axes}
        <Bar dataKey="Actual" fill={COLORS.actual} radius={[4,4,0,0]} />
        <Bar dataKey="Target" fill={COLORS.target} radius={[4,4,0,0]} />
        <Bar dataKey="Last Year" fill={COLORS.lastYear} radius={[4,4,0,0]} />
      </BarChart>
    );
    if (chartType === "Area Chart") return (
      <AreaChart {...common}>
        <defs>
          <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.actual} stopOpacity={0.3} />
            <stop offset="95%" stopColor={COLORS.actual} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gT" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.target} stopOpacity={0.2} />
            <stop offset="95%" stopColor={COLORS.target} stopOpacity={0} />
          </linearGradient>
        </defs>
        {axes}
        <Area type="monotone" dataKey="Last Year" stroke={COLORS.lastYear} fill="none" strokeDasharray="3 3" strokeWidth={1.5} />
        <Area type="monotone" dataKey="Target" stroke={COLORS.target} fill="url(#gT)" strokeWidth={2} strokeDasharray="5 5" />
        <Area type="monotone" dataKey="Actual" stroke={COLORS.actual} fill="url(#gA)" strokeWidth={2.5} />
      </AreaChart>
    );
    if (chartType === "Radar Chart") return (
      <RadarChart data={radarData} margin={{ top: 10, right: 0, left: 0, bottom: 10 }}>
        <PolarGrid stroke="#dbeafe" />
        <PolarAngleAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} />
        <PolarRadiusAxis tick={{ fill: "#94a3b8", fontSize: 10 }} unit={kpi.unit} />
        <Radar name="Actual" dataKey="Actual" stroke={COLORS.actual} fill={COLORS.actual} fillOpacity={0.3} />
        <Radar name="Target" dataKey="Target" stroke={COLORS.target} fill={COLORS.target} fillOpacity={0.1} />
        <Legend wrapperStyle={{ color: "#475569", fontSize: 13 }} />
        <Tooltip {...tooltipStyle} />
      </RadarChart>
    );
    if (chartType === "Composed Chart") return (
      <ComposedChart {...common}>
        {axes}
        <Bar dataKey="Last Year" fill={COLORS.lastYear} opacity={0.4} radius={[3,3,0,0]} />
        <Bar dataKey="Actual" fill={COLORS.actual} radius={[3,3,0,0]} />
        <Line type="monotone" dataKey="Target" stroke={COLORS.target} strokeWidth={2.5} strokeDasharray="6 3" dot={false} />
      </ComposedChart>
    );
  };

  return (
    <div style={{
      marginLeft: SIDEBAR_WIDTH,
      marginTop: NAVBAR_HEIGHT,
      minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
      width: `calc(100vw - ${SIDEBAR_WIDTH}px)`,
      background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)",
      padding: "32px 28px",
      color: "#1e3a5f",
      fontFamily: "'Georgia', serif",
      boxSizing: "border-box",
      overflowX: "hidden",
    }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ color: "#3b82f6", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 4px" }}>
          Performance Intelligence
        </p>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1e3a5f", margin: 0 }}>KPI Dashboard</h1>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
        <div style={{ flex: "2 1 280px" }}>
          <label style={{ display: "block", fontSize: 11, color: "#3b82f6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
            Select KPI
          </label>
          <select value={selectedKPI} onChange={e => setSelectedKPI(e.target.value)} style={{
            width: "100%", background: "#f8fafc", border: "1px solid #bfdbfe",
            color: "#1e3a5f", padding: "11px 16px", borderRadius: 10, fontSize: 14,
            outline: "none", cursor: "pointer",
          }}>
            {Object.keys(KPI_DATA).map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <div style={{ flex: "1 1 180px" }}>
          <label style={{ display: "block", fontSize: 11, color: "#3b82f6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
            Type Of Chart
          </label>
          <select value={chartType} onChange={e => setChartType(e.target.value)} style={{
            width: "100%", background: "#f8fafc", border: "1px solid #bfdbfe",
            color: "#1e3a5f", padding: "11px 16px", borderRadius: 10, fontSize: 14,
            outline: "none", cursor: "pointer",
          }}>
            {CHART_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 28 }}>
        {[
          { label: "Last Year",     value: `${kpi.lastYear}${kpi.unit}`,  color: "#10b981" },
          { label: "Annual Target", value: `${kpi.target}${kpi.unit}`,    color: "#f59e0b" },
          { label: "Latest Actual", value: `${latestActual}${kpi.unit}`,  color: "#3b82f6" },
          { label: "Progress",      value: `${progress}%`,                color: progress >= 90 ? "#10b981" : progress >= 70 ? "#f59e0b" : "#ef4444" },
        ].map(s => (
          <div key={s.label} style={{ background: "#ffffff", border: "1px solid #dbeafe", borderRadius: 12, padding: "18px 20px" }}>
            <p style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>{s.label}</p>
            <p style={{ fontSize: 24, fontWeight: 700, color: s.color, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div style={{ background: "#ffffff", border: "1px solid #dbeafe", borderRadius: 12, padding: "14px 20px", marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: "#6b7280" }}>Target Progress</span>
          <span style={{ fontSize: 13, color: "#1e3a5f", fontWeight: 600 }}>{progress}%</span>
        </div>
        <div style={{ height: 6, background: "#dbeafe", borderRadius: 99 }}>
          <div style={{
            height: "100%",
            width: `${progress}%`,
            background: progress >= 90 ? "#10b981" : progress >= 70 ? "#f59e0b" : "#ef4444",
            borderRadius: 99,
            transition: "width 0.6s ease",
          }} />
        </div>
      </div>

      {/* Chart */}
      <div style={{ background: "#ffffff", border: "1px solid #dbeafe", borderRadius: 16, padding: "24px 0 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, paddingInline: 16 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#1e3a5f" }}>{selectedKPI}</h2>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6b7280" }}>Monthly Performance — {chartType}</p>
          </div>
          <span style={{ background: "#dbeafe", color: "#3b82f6", fontSize: 12, padding: "4px 12px", borderRadius: 99 }}>2024</span>
        </div>
        <ResponsiveContainer width="100%" height={340}>
          {renderChart()}
        </ResponsiveContainer>
      </div>

    </div>
  );
}