import React, { useState, useEffect, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from "recharts";

const getToken = () =>
  document.cookie.split("; ").find(r => r.startsWith("auth_token="))?.split("=").slice(1).join("=") ?? "";

const MODULES = [
  { id: "bg-reg",  name: "Business Risks",        endpoint: "/api/register/br/all",   color: "#3b82f6", icon: "fas fa-briefcase" },
  { id: "hs-reg",  name: "H&S Risks",             endpoint: "/api/register/hsr/all",  color: "#ef4444", icon: "fas fa-shield-halved" },
  { id: "leg-reg", name: "Legislation",           endpoint: "/api/register/leg/all",  color: "#8b5cf6", icon: "fas fa-scale-balanced" },
  { id: "env-reg", name: "Environmental",         endpoint: "/api/register/eai/all",  color: "#10b981", icon: "fas fa-leaf" },
  { id: "eq-reg",  name: "Equipment",             endpoint: "/api/register/ei/all",   color: "#f59e0b", icon: "fas fa-gears" },
  { id: "tr-reg",  name: "Trainings",             endpoint: "/api/register/tra/all",  color: "#06b6d4", icon: "fas fa-graduation-cap" },
  { id: "doc-reg", name: "Documents",             endpoint: "/api/register/doc/all",  color: "#6366f1", icon: "fas fa-file-lines" },
  { id: "ven-reg", name: "Vendors",               endpoint: "/api/register/ven/all",  color: "#f97316", icon: "fas fa-handshake" },
  { id: "cus-reg", name: "Customers",             endpoint: "/api/register/cus/all",  color: "#ec4899", icon: "fas fa-users" },
  { id: "fb-reg",  name: "Feedbacks",             endpoint: "/api/register/fb/all",   color: "#14b8a6", icon: "fas fa-comments" },
  { id: "ear-reg", name: "Employee Appraisal",    endpoint: "/api/register/ea/all",   color: "#a855f7", icon: "fas fa-user-check" },
  { id: "moc-reg", name: "Mgmt of Change",        endpoint: "/api/register/moc/all",  color: "#84cc16", icon: "fas fa-arrows-rotate" },
  { id: "fl-reg",  name: "Findings",              endpoint: "/api/register/fin/all",  color: "#e11d48", icon: "fas fa-magnifying-glass" },
  { id: "ao-reg",  name: "Assurance & Oversight", endpoint: "/api/register/aop/all",  color: "#0ea5e9", icon: "fas fa-clipboard-check" },
  { id: "mr-reg",  name: "Mgmt Review",           endpoint: "/api/register/mrm/all",  color: "#78716c", icon: "fas fa-file-contract" },
  { id: "ac-reg",  name: "Action Log",            endpoint: "/api/dashboard/actionLog/all?status=active", color: "#22c55e", icon: "fas fa-circle-check" },
];

const isComplete = (status) => {
  if (!status) return false;
  const s = String(status?.value || status).toLowerCase();
  return s.includes("complet") || s.includes("done") || s.includes("closed") || s.includes("finish");
};

const isOverdue = (action) => {
  if (isComplete(action.status)) return false;
  if (!action.deadline) return false;
  return new Date(action.deadline) < new Date();
};

const getPersonName = (val) => {
  if (!val) return null;
  if (typeof val === "string") return val.trim() || null;
  if (typeof val === "object") return (val.name || val.value || val.label || String(val.id || "")).trim() || null;
  return null;
};

const TODAY = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

// ─── Custom Tooltip ───────────────────────────────────────────────
const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-blue-100 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-slate-700 mb-1 text-xs">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="text-xs">
          {p.name}: <b>{p.value}</b>
        </p>
      ))}
    </div>
  );
};

export default function GraphView({ onClose }) {
  const [loading, setLoading]     = useState(true);
  const [loadMsg, setLoadMsg]     = useState("Loading data…");
  const [data, setData]           = useState(null);
  const [activeTab, setActiveTab] = useState("overview");  // "overview" | "people" | "actions"
  const [companyName, setCompanyName] = useState("");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const token = getToken();

    // Company name
    try {
      const r = await fetch(`/api/settings/company?token=${token}`);
      if (r.ok) { const d = await r.json(); setCompanyName(d.name || ""); }
    } catch { /* skip */ }

    setLoadMsg("Fetching registers…");
    const moduleRecords = {};
    await Promise.all(MODULES.map(async (mod) => {
      try {
        const url = `${mod.endpoint}${mod.endpoint.includes("?") ? "&" : "?"}token=${token}`;
        const r = await fetch(url);
        if (!r.ok) return;
        const d = await r.json();
        moduleRecords[mod.id] = Array.isArray(d) ? d : [];
      } catch { moduleRecords[mod.id] = []; }
    }));

    setLoadMsg("Fetching actions…");
    let allActions = [];
    try {
      const r = await fetch(`/api/register/component/action/all?token=${token}`);
      if (r.ok) {
        const d = await r.json();
        if (Array.isArray(d)) allActions = d;
      }
    } catch { /* skip */ }

    // Build per-module stats
    const actionsByRecord = {};
    allActions.forEach(act => {
      const rid = String(act.registerId || act.register_id || act.componentId || "");
      if (!rid) return;
      if (!actionsByRecord[rid]) actionsByRecord[rid] = [];
      actionsByRecord[rid].push(act);
    });

    const moduleStats = MODULES.map(mod => {
      const records = moduleRecords[mod.id] || [];
      const actions = records.flatMap(rec =>
        actionsByRecord[String(rec.id || "")] || (Array.isArray(rec.actions) ? rec.actions : [])
      );
      const complete   = actions.filter(a => isComplete(a.status)).length;
      const incomplete = actions.length - complete;
      const overdue    = actions.filter(a => isOverdue(a)).length;
      const rate       = actions.length ? Math.round((complete / actions.length) * 100) : null;

      // Unique responsible persons
      const responsibleMap = {};
      actions.forEach(a => {
        const n = getPersonName(a.responsible || a.responsibleName);
        if (n) responsibleMap[n] = (responsibleMap[n] || 0) + 1;
      });
      // Approvers
      const approverMap = {};
      actions.forEach(a => {
        const n = getPersonName(a.approver || a.approverName);
        if (n) approverMap[n] = (approverMap[n] || 0) + 1;
      });

      return {
        ...mod,
        records: records.length,
        actions: actions.length,
        complete,
        incomplete,
        overdue,
        rate,
        responsible: Object.entries(responsibleMap).sort((a,b) => b[1]-a[1]),
        approvers: Object.entries(approverMap).sort((a,b) => b[1]-a[1]),
      };
    });

    // Global people summary
    const globalResp = {};
    const globalAppr = {};
    allActions.forEach(a => {
      const n = getPersonName(a.responsible || a.responsibleName);
      if (n) globalResp[n] = (globalResp[n] || 0) + 1;
      const ap = getPersonName(a.approver || a.approverName);
      if (ap) globalAppr[ap] = (globalAppr[ap] || 0) + 1;
    });

    const totalRecords  = moduleStats.reduce((s, m) => s + m.records, 0);
    const totalActions  = allActions.length;
    const totalComplete = allActions.filter(a => isComplete(a.status)).length;
    const totalOverdue  = allActions.filter(a => isOverdue(a)).length;
    const overallRate   = totalActions ? Math.round((totalComplete / totalActions) * 100) : 0;

    setData({
      moduleStats,
      totalRecords, totalActions, totalComplete, totalOverdue, overallRate,
      globalResp: Object.entries(globalResp).sort((a,b) => b[1]-a[1]).slice(0, 20),
      globalAppr: Object.entries(globalAppr).sort((a,b) => b[1]-a[1]).slice(0, 20),
    });
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  if (loading) return <LoadingScreen msg={loadMsg} />;

  const { moduleStats, totalRecords, totalActions, totalComplete, totalOverdue, overallRate, globalResp, globalAppr } = data;

  // Chart data
  const barData = moduleStats
    .filter(m => m.actions > 0)
    .map(m => ({ name: m.name.replace(" & ", " &\n"), complete: m.complete, incomplete: m.incomplete, overdue: m.overdue }));

  const pieData = [
    { name: "Complete",   value: totalComplete,              fill: "#22c55e" },
    { name: "Incomplete", value: totalActions - totalComplete, fill: "#e2e8f0" },
  ];

  const tabs = [
    { id: "overview", label: "Overview",    icon: "fas fa-chart-pie" },
    { id: "registers", label: "Registers",  icon: "fas fa-table-columns" },
    { id: "people",   label: "People",      icon: "fas fa-users" },
  ];

  return (
    <div className="fixed inset-0 z-[900] bg-gray-50 flex flex-col overflow-hidden">

      {/* ── TOP HEADER ────────────────────────────────────── */}
      <div className="bg-white border-b border-blue-100 shadow-sm shrink-0">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
              <i className="fas fa-diagram-project text-white text-sm" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-800">
                {companyName ? `${companyName} — ` : ""}QHSE System Overview
              </h1>
              <p className="text-[11px] text-slate-400">{TODAY} · Quarterly Management Review</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 text-xs font-medium transition-colors"
            >
              <i className="fas fa-arrows-rotate text-xs" /> Refresh
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition-colors"
            >
              <i className="fas fa-print text-xs" /> Print
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-medium transition-colors"
            >
              <i className="fas fa-xmark text-xs" /> Close
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-6 gap-1 border-t border-blue-50">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === t.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <i className={`${t.icon} text-[10px]`} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── SUMMARY STAT ROW ──────────────────────────────── */}
      <div className="bg-white border-b border-blue-50 px-6 py-3 shrink-0">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon="fas fa-database"      color="#3b82f6" label="Total Records"    value={totalRecords} />
          <StatCard icon="fas fa-list-check"    color="#6366f1" label="Total Actions"    value={totalActions} />
          <StatCard icon="fas fa-circle-check"  color="#22c55e" label="Actions Complete" value={`${totalComplete} (${overallRate}%)`} />
          <StatCard icon="fas fa-triangle-exclamation" color="#ef4444" label="Overdue Actions" value={totalOverdue} highlight={totalOverdue > 0} />
        </div>
      </div>

      {/* ── SCROLLABLE BODY ───────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "overview" && (
          <OverviewTab moduleStats={moduleStats} barData={barData} pieData={pieData}
            totalComplete={totalComplete} totalActions={totalActions} overallRate={overallRate} />
        )}
        {activeTab === "registers" && (
          <RegistersTab moduleStats={moduleStats} />
        )}
        {activeTab === "people" && (
          <PeopleTab globalResp={globalResp} globalAppr={globalAppr} moduleStats={moduleStats} />
        )}
      </div>
    </div>
  );
}

// ─── LOADING ──────────────────────────────────────────────────────
function LoadingScreen({ msg }) {
  return (
    <div className="fixed inset-0 z-[900] bg-gray-50 flex flex-col items-center justify-center gap-5">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin" />
      </div>
      <div className="text-center">
        <p className="text-slate-700 font-semibold text-sm">{msg}</p>
        <p className="text-slate-400 text-xs mt-1">Please wait…</p>
      </div>
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────
function StatCard({ icon, color, label, value, highlight }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border ${highlight ? "border-red-200 bg-red-50" : "border-blue-50 bg-blue-50/40"}`}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${color}18` }}>
        <i className={`${icon} text-sm`} style={{ color }} />
      </div>
      <div>
        <p className="text-[10px] text-slate-500 font-medium">{label}</p>
        <p className={`text-base font-bold ${highlight ? "text-red-600" : "text-slate-800"}`}>{value}</p>
      </div>
    </div>
  );
}

// ─── OVERVIEW TAB ─────────────────────────────────────────────────
function OverviewTab({ moduleStats, barData, pieData, totalComplete, totalActions, overallRate }) {
  return (
    <div className="p-6 space-y-6">

      {/* Completion rate + pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Pie chart */}
        <div className="bg-white rounded-2xl border border-blue-50 shadow-sm p-5 flex flex-col items-center justify-center">
          <h3 className="text-sm font-bold text-slate-700 mb-3 self-start">Overall Completion</h3>
          <div className="relative">
            <PieChart width={180} height={180}>
              <Pie data={pieData} cx={85} cy={85} innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={0}>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
            </PieChart>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-800">{overallRate}%</p>
                <p className="text-[10px] text-slate-500">complete</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="w-3 h-3 rounded-sm bg-green-400 inline-block" />
              Complete ({totalComplete})
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="w-3 h-3 rounded-sm bg-slate-200 inline-block" />
              Remaining ({totalActions - totalComplete})
            </div>
          </div>
        </div>

        {/* Register progress bars */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-blue-50 shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Completion Rate by Register</h3>
          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {moduleStats
              .filter(m => m.actions > 0)
              .sort((a, b) => (b.rate ?? 0) - (a.rate ?? 0))
              .map(m => (
                <div key={m.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <i className={`${m.icon} text-[10px]`} style={{ color: m.color }} />
                      <span className="text-xs text-slate-600 font-medium">{m.name}</span>
                    </div>
                    <span className="text-xs font-bold" style={{ color: m.color }}>
                      {m.rate ?? 0}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ width: `${m.rate ?? 0}%`, background: m.color }}
                    />
                  </div>
                </div>
              ))}
            {moduleStats.filter(m => m.actions === 0).length > 0 && (
              <p className="text-[10px] text-slate-400 pt-1">
                {moduleStats.filter(m => m.actions === 0).length} registers have no actions.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bar chart — actions per register */}
      {barData.length > 0 && (
        <div className="bg-white rounded-2xl border border-blue-50 shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Actions by Register</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} margin={{ top: 0, right: 20, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#64748b", fontSize: 10 }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} allowDecimals={false} />
              <Tooltip content={<BarTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#475569", paddingTop: 8 }} />
              <Bar dataKey="complete"   name="Complete"   fill="#22c55e" radius={[3,3,0,0]} maxBarSize={32} />
              <Bar dataKey="incomplete" name="Incomplete" fill="#bfdbfe" radius={[3,3,0,0]} maxBarSize={32} />
              <Bar dataKey="overdue"    name="Overdue"    fill="#fca5a5" radius={[3,3,0,0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// ─── REGISTERS TAB ────────────────────────────────────────────────
function RegistersTab({ moduleStats }) {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {moduleStats.map(m => (
          <RegisterCard key={m.id} m={m} />
        ))}
      </div>
    </div>
  );
}

function RegisterCard({ m }) {
  const rate = m.rate ?? 0;
  const hasActions = m.actions > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Card header */}
      <div className="px-4 py-3 flex items-center gap-2.5" style={{ background: `${m.color}12`, borderBottom: `2px solid ${m.color}30` }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: m.color }}>
          <i className={`${m.icon} text-white text-xs`} />
        </div>
        <span className="text-sm font-bold text-slate-700 leading-tight">{m.name}</span>
      </div>

      <div className="p-4 space-y-3">
        {/* Key metrics */}
        <div className="grid grid-cols-3 gap-2">
          <Metric label="Records" value={m.records} color="#3b82f6" />
          <Metric label="Actions" value={m.actions} color={m.color} />
          <Metric label="Overdue" value={m.overdue} color={m.overdue > 0 ? "#ef4444" : "#94a3b8"} />
        </div>

        {/* Progress bar */}
        {hasActions ? (
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-slate-500 font-medium">Completion</span>
              <span className="text-[11px] font-bold" style={{ color: m.color }}>{rate}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="h-2 rounded-full" style={{ width: `${rate}%`, background: m.color }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[9px] text-green-600">✓ {m.complete} done</span>
              <span className="text-[9px] text-slate-400">{m.incomplete} pending</span>
            </div>
          </div>
        ) : (
          <p className="text-[10px] text-slate-400 text-center py-1">No actions recorded</p>
        )}

        {/* Responsible persons */}
        {m.responsible.length > 0 && (
          <div>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide mb-1.5">
              Responsible
            </p>
            <div className="flex flex-wrap gap-1">
              {m.responsible.slice(0, 3).map(([name, count]) => (
                <PersonTag key={name} name={name} count={count} color={m.color} />
              ))}
              {m.responsible.length > 3 && (
                <span className="text-[10px] text-slate-400 self-center">+{m.responsible.length - 3} more</span>
              )}
            </div>
          </div>
        )}

        {/* Approvers */}
        {m.approvers.length > 0 && (
          <div>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide mb-1.5">
              Approvers
            </p>
            <div className="flex flex-wrap gap-1">
              {m.approvers.slice(0, 3).map(([name, count]) => (
                <PersonTag key={name} name={name} count={count} color="#6366f1" />
              ))}
              {m.approvers.length > 3 && (
                <span className="text-[10px] text-slate-400 self-center">+{m.approvers.length - 3} more</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value, color }) {
  return (
    <div className="text-center p-2 rounded-lg bg-slate-50">
      <p className="text-base font-bold" style={{ color }}>{value}</p>
      <p className="text-[9px] text-slate-500 font-medium uppercase tracking-wide">{label}</p>
    </div>
  );
}

function PersonTag({ name, count, color }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium"
      style={{ background: `${color}15`, color: color, border: `1px solid ${color}30` }}
    >
      {name}
      {count > 1 && <span className="opacity-60">({count})</span>}
    </span>
  );
}

// ─── PEOPLE TAB ───────────────────────────────────────────────────
function PeopleTab({ globalResp, globalAppr, moduleStats }) {
  const hasResp = globalResp.length > 0;
  const hasAppr = globalAppr.length > 0;

  // Per-person, per-module breakdown
  const personModules = {};
  moduleStats.forEach(m => {
    m.responsible.forEach(([name]) => {
      if (!personModules[name]) personModules[name] = [];
      personModules[name].push(m.name);
    });
  });

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Responsible persons */}
        <div className="bg-white rounded-2xl border border-blue-50 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <i className="fas fa-user-tie text-blue-600 text-sm" />
            <h3 className="text-sm font-bold text-slate-700">Responsible Persons</h3>
            <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
              {globalResp.length} people
            </span>
          </div>
          {hasResp ? (
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {globalResp.map(([name, count], i) => (
                <PersonRow
                  key={name} rank={i + 1} name={name} count={count}
                  max={globalResp[0][1]}
                  color="#3b82f6"
                  modules={personModules[name] || []}
                />
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm text-center py-8">No responsible person data available</p>
          )}
        </div>

        {/* Approvers */}
        <div className="bg-white rounded-2xl border border-blue-50 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <i className="fas fa-user-check text-indigo-600 text-sm" />
            <h3 className="text-sm font-bold text-slate-700">Approvers</h3>
            <span className="ml-auto text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">
              {globalAppr.length} people
            </span>
          </div>
          {hasAppr ? (
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {globalAppr.map(([name, count], i) => (
                <PersonRow
                  key={name} rank={i + 1} name={name} count={count}
                  max={globalAppr[0][1]}
                  color="#6366f1"
                  modules={[]}
                />
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm text-center py-8">No approver data available</p>
          )}
        </div>
      </div>

      {/* Workload bar chart */}
      {hasResp && globalResp.length > 1 && (
        <div className="bg-white rounded-2xl border border-blue-50 shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Action Workload Distribution</h3>
          <ResponsiveContainer width="100%" height={Math.min(300, globalResp.slice(0, 15).length * 32 + 40)}>
            <BarChart
              data={globalResp.slice(0, 15).map(([n, c]) => ({ name: n, actions: c }))}
              layout="vertical"
              margin={{ top: 0, right: 30, left: 100, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} allowDecimals={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: "#475569", fontSize: 11 }} width={95} />
              <Tooltip content={<BarTooltip />} />
              <Bar dataKey="actions" name="Actions" fill="#3b82f6" radius={[0,4,4,0]} maxBarSize={20}>
                {globalResp.slice(0, 15).map((_, i) => (
                  <Cell key={i} fill={`hsl(${220 - i * 8}, 80%, ${55 + i * 2}%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function PersonRow({ rank, name, count, max, color, modules }) {
  const pct = Math.round((count / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="w-5 text-[10px] text-slate-400 text-right font-mono shrink-0">{rank}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-xs font-semibold text-slate-700 truncate">{name}</span>
          <span className="text-xs font-bold ml-2 shrink-0" style={{ color }}>{count}</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5">
          <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: color }} />
        </div>
        {modules.length > 0 && (
          <p className="text-[9px] text-slate-400 mt-0.5 truncate">
            {modules.slice(0, 3).join(", ")}{modules.length > 3 ? ` +${modules.length - 3}` : ""}
          </p>
        )}
      </div>
    </div>
  );
}
