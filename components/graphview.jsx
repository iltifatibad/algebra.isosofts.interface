import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactECharts from "echarts-for-react";

const getToken = () =>
  document.cookie.split("; ").find(r => r.startsWith("auth_token="))?.split("=").slice(1).join("=") ?? "";

const MODULES = [
  { id: "bg-reg",  name: "Business Risks",        endpoint: "/api/register/br/all",   color: "#3b82f6", icon: "💼" },
  { id: "hs-reg",  name: "H&S Risks",             endpoint: "/api/register/hsr/all",  color: "#ef4444", icon: "🛡️" },
  { id: "leg-reg", name: "Legislation",           endpoint: "/api/register/leg/all",  color: "#8b5cf6", icon: "⚖️" },
  { id: "env-reg", name: "Environmental",         endpoint: "/api/register/eai/all",  color: "#10b981", icon: "🌱" },
  { id: "eq-reg",  name: "Equipment",             endpoint: "/api/register/ei/all",   color: "#f59e0b", icon: "⚙️" },
  { id: "tr-reg",  name: "Trainings",             endpoint: "/api/register/tra/all",  color: "#06b6d4", icon: "🎓" },
  { id: "doc-reg", name: "Documents",             endpoint: "/api/register/doc/all",  color: "#6366f1", icon: "📄" },
  { id: "ven-reg", name: "Vendors",               endpoint: "/api/register/ven/all",  color: "#f97316", icon: "🤝" },
  { id: "cus-reg", name: "Customers",             endpoint: "/api/register/cus/all",  color: "#ec4899", icon: "👥" },
  { id: "fb-reg",  name: "Feedbacks",             endpoint: "/api/register/fb/all",   color: "#14b8a6", icon: "💬" },
  { id: "ear-reg", name: "Employee Appraisal",    endpoint: "/api/register/ea/all",   color: "#a855f7", icon: "👤" },
  { id: "moc-reg", name: "Mgmt of Change",        endpoint: "/api/register/moc/all",  color: "#84cc16", icon: "🔄" },
  { id: "fl-reg",  name: "Findings",              endpoint: "/api/register/fin/all",  color: "#e11d48", icon: "🔍" },
  { id: "ao-reg",  name: "Assurance & Oversight", endpoint: "/api/register/aop/all",  color: "#0ea5e9", icon: "📋" },
  { id: "mr-reg",  name: "Mgmt Review",           endpoint: "/api/register/mrm/all",  color: "#78716c", icon: "📝" },
  { id: "ac-reg",  name: "Action Log",            endpoint: "/api/dashboard/actionLog/all?status=active", color: "#22c55e", icon: "✅" },
];

const ACTION_STATUS_COLOR = {
  completed: "#22c55e",
  done: "#22c55e",
  closed: "#22c55e",
  "in progress": "#f59e0b",
  active: "#f59e0b",
  open: "#f59e0b",
  overdue: "#ef4444",
  late: "#ef4444",
};

const getActionColor = (status) => {
  if (!status) return "#64748b";
  const key = String(status).toLowerCase();
  for (const [k, v] of Object.entries(ACTION_STATUS_COLOR)) {
    if (key.includes(k)) return v;
  }
  return "#64748b";
};

const getLabel = (mod, rec) => {
  if (!rec) return "—";
  const val =
    rec.title ?? rec.name ?? rec.employeeName ?? rec.legislation ??
    rec.activityDescription ?? rec.riskOpportunity ?? rec.hazard ??
    rec.aspect ?? rec.topic ?? rec.no ?? rec.id ?? "—";
  return String(val || "—");
};

const FILTERS = [
  { key: "modules",  label: "Modules",  color: "#60a5fa" },
  { key: "records",  label: "Records",  color: "#a78bfa" },
  { key: "actions",  label: "Actions",  color: "#34d399" },
];

export default function GraphView({ onClose }) {
  const [loading, setLoading]           = useState(true);
  const [loadStatus, setLoadStatus]     = useState("Building system map…");
  const [graphData, setGraphData]       = useState({ nodes: [], edges: [] });
  const [rawData, setRawData]           = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [stats, setStats]               = useState({});
  const [activeFilters, setActiveFilters] = useState({ modules: true, records: true, actions: true });
  const [hoveredMod, setHoveredMod]     = useState(null);
  const echartsRef = useRef(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setLoadStatus("Fetching module data…");
    const token = getToken();
    const statMap = {};
    const moduleRecords = {};

    await Promise.all(
      MODULES.map(async (mod) => {
        try {
          const res = await fetch(`${mod.endpoint}${mod.endpoint.includes("?") ? "&" : "?"}token=${token}`);
          if (!res.ok) return;
          const data = await res.json();
          if (!Array.isArray(data)) return;
          statMap[mod.id] = data.length;
          moduleRecords[mod.id] = data;
        } catch { /* skip */ }
      })
    );

    setLoadStatus("Fetching actions…");
    let allActions = [];
    try {
      const res = await fetch(`/api/register/component/action/all?token=${token}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) allActions = data;
      }
    } catch { /* skip */ }

    setStats(statMap);
    setRawData({ moduleRecords, allActions });
    setLoadStatus("Rendering graph…");
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    if (!rawData) return;
    buildGraph(rawData, activeFilters);
  }, [rawData, activeFilters]);

  const buildGraph = ({ moduleRecords, allActions }, filters) => {
    const nodes = [];
    const edges = [];

    // Action lookup: registerId → [actions]
    const actionsByRecord = {};
    allActions.forEach(act => {
      const rid = act.registerId || act.register_id || act.componentId;
      if (!rid) return;
      if (!actionsByRecord[rid]) actionsByRecord[rid] = [];
      actionsByRecord[rid].push(act);
    });

    // Hub
    nodes.push({
      id: "hub",
      name: "QHSE\nSystem",
      symbolSize: 75,
      symbol: "circle",
      category: 0,
      label: { show: true, fontSize: 12, fontWeight: "bold", color: "#fff", lineHeight: 18 },
      itemStyle: {
        color: { type: "radial", x: 0.5, y: 0.5, r: 0.5, colorStops: [
          { offset: 0, color: "#2563eb" }, { offset: 1, color: "#1e3a5f" }
        ]},
        shadowBlur: 30, shadowColor: "rgba(59,130,246,0.6)",
      },
      fixed: true, x: 0, y: 0,
      tooltip: { formatter: "<b>QHSE System</b><br/>Central management hub" },
    });

    MODULES.forEach((mod, mi) => {
      if (!filters.modules) return;
      const rawRecords = moduleRecords[mod.id];
      const records = Array.isArray(rawRecords) ? rawRecords : [];
      const count = records.length;

      nodes.push({
        id: mod.id,
        name: `${mod.icon}\n${mod.name}\n(${count})`,
        symbolSize: 52,
        category: mi + 1,
        label: { show: true, fontSize: 8.5, color: "#fff", lineHeight: 13 },
        itemStyle: {
          color: mod.color,
          shadowBlur: 12, shadowColor: `${mod.color}88`,
          borderColor: "#ffffff44", borderWidth: 1.5,
        },
        _mod: mod, _count: count,
      });

      edges.push({
        source: "hub", target: mod.id,
        lineStyle: { color: mod.color, width: 2.5, opacity: 0.5, curveness: 0.1 },
        emphasis: { lineStyle: { width: 5, opacity: 1 } },
      });

      if (!filters.records) return;

      records.slice(0, 10).forEach((rec, ri) => {
        const recId = `${mod.id}__rec__${rec.id || ri}`;
        const recLabel = getLabel(mod, rec).slice(0, 24);
        const recActionsRaw = actionsByRecord[rec.id] ?? (Array.isArray(rec.actions) ? rec.actions : []);
        const recActions = Array.isArray(recActionsRaw) ? recActionsRaw : [];

        nodes.push({
          id: recId,
          name: recLabel,
          symbolSize: 22,
          category: mi + 1,
          label: { show: false },
          itemStyle: {
            color: mod.color, opacity: 0.85,
            borderColor: "#ffffff55", borderWidth: 1,
          },
          _rec: rec, _mod: mod,
          _actionCount: recActions.length,
        });

        edges.push({
          source: mod.id, target: recId,
          lineStyle: { color: mod.color, width: 1, opacity: 0.35 },
        });

        if (!filters.actions) return;

        recActions.slice(0, 4).forEach((act, ai) => {
          const actId = `${recId}__act__${act.id || ai}`;
          const statusVal = act.status?.value || act.status || "";
          const actColor = getActionColor(statusVal);

          nodes.push({
            id: actId,
            name: (act.title || "Action").slice(0, 16),
            symbolSize: 13,
            symbol: "diamond",
            category: 0,
            label: { show: false },
            itemStyle: { color: actColor, opacity: 0.9, borderColor: "#ffffff44", borderWidth: 1 },
            _act: act, _mod: mod,
          });

          edges.push({
            source: recId, target: actId,
            lineStyle: { color: actColor, width: 0.8, type: "dashed", opacity: 0.4 },
          });
        });
      });
    });

    setGraphData({ nodes, edges });
    setLoading(false);
  };

  const categories = [
    { name: "System", itemStyle: { color: "#1e3a5f" } },
    ...MODULES.map(m => ({ name: m.name, itemStyle: { color: m.color } })),
  ];

  const totalNodes = graphData.nodes.length;
  const totalEdges = graphData.edges.length;

  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(15,23,42,0.92)",
      borderColor: "rgba(255,255,255,0.1)",
      borderWidth: 1,
      textStyle: { color: "#e2e8f0", fontSize: 12 },
      formatter: (params) => {
        if (params.dataType !== "node") return "";
        const d = params.data;
        if (d.id === "hub") return `<b style="color:#60a5fa">QHSE System</b><br/><span style="color:#94a3b8">Tüm modüllerin merkezi</span>`;
        if (d._act) {
          const status = d._act.status?.value || d._act.status || "—";
          return `<b style="color:#34d399">Action</b><br/>${d._act.title || "—"}<br/><span style="color:#94a3b8">Status:</span> ${status}<br/><span style="color:#94a3b8">Deadline:</span> ${d._act.deadline || "—"}`;
        }
        if (d._rec) {
          const label = getLabel(d._mod, d._rec);
          return `<b style="color:${d._mod?.color}">${d._mod?.name}</b><br/>${label}<br/><span style="color:#94a3b8">No:</span> ${d._rec?.no || "—"}<br/><span style="color:#94a3b8">Actions:</span> ${d._actionCount || 0}`;
        }
        if (d._mod) return `<b style="color:${d._mod.color}">${d._mod.icon} ${d._mod.name}</b><br/><span style="color:#94a3b8">Records:</span> ${d._count}`;
        return params.name;
      },
    },
    legend: { show: false },
    series: [{
      type: "graph",
      layout: "force",
      roam: true,
      draggable: true,
      animation: true,
      animationDuration: 1000,
      animationEasingUpdate: "quinticInOut",
      force: {
        repulsion: 350,
        gravity: 0.04,
        edgeLength: [70, 220],
        layoutAnimation: true,
        friction: 0.6,
      },
      emphasis: {
        focus: "adjacency",
        lineStyle: { width: 3, opacity: 1 },
        itemStyle: { shadowBlur: 20 },
      },
      blur: {
        itemStyle: { opacity: 0.15 },
        lineStyle: { opacity: 0.08 },
      },
      nodes: graphData.nodes,
      edges: graphData.edges,
      categories,
      lineStyle: { curveness: 0.08 },
      label: {
        position: "inside",
        formatter: "{b}",
      },
      select: {
        itemStyle: { shadowBlur: 25, shadowColor: "rgba(255,255,255,0.4)" },
      },
    }],
  };

  const handleChartEvents = {
    click: (params) => {
      if (params.dataType === "node") setSelectedNode(params.data);
    },
  };

  const toggleFilter = (key) => {
    setActiveFilters(f => ({ ...f, [key]: !f[key] }));
  };

  return (
    <div
      className="fixed inset-0 z-[900] flex flex-col"
      style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0f172a 50%, #1e1b4b 100%)" }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/10 backdrop-blur-sm bg-black/20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)" }}>
            <i className="fas fa-diagram-project text-white text-sm" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide">QHSE System Map</h1>
            <p className="text-[10px] text-slate-500">
              {loading ? loadStatus : `${totalNodes} nodes · ${totalEdges} connections · scroll to zoom · drag to pan`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Stats chips */}
          <div className="hidden lg:flex items-center gap-1.5 flex-wrap max-w-2xl">
            {MODULES.map(m => (
              <span
                key={m.id}
                onMouseEnter={() => setHoveredMod(m.id)}
                onMouseLeave={() => setHoveredMod(null)}
                className="text-[9px] px-2 py-0.5 rounded-full font-semibold cursor-default select-none transition-all"
                style={{
                  background: `${m.color}22`,
                  color: m.color,
                  border: `1px solid ${m.color}44`,
                  opacity: hoveredMod && hoveredMod !== m.id ? 0.45 : 1,
                }}
              >
                {m.icon} {stats[m.id] ?? "…"}
              </span>
            ))}
          </div>

          {/* Filter toggles */}
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => toggleFilter(f.key)}
                className="text-[10px] px-2.5 py-1 rounded-md font-semibold transition-all"
                style={{
                  background: activeFilters[f.key] ? `${f.color}33` : "transparent",
                  color: activeFilters[f.key] ? f.color : "#64748b",
                  border: `1px solid ${activeFilters[f.key] ? f.color + "66" : "transparent"}`,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={fetchAll}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/25 text-blue-300 hover:bg-blue-600/40 text-xs font-medium transition-colors disabled:opacity-50"
          >
            <i className={`fas fa-arrows-rotate text-xs ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 text-xs font-medium transition-colors"
          >
            <i className="fas fa-xmark text-xs" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </div>

      {/* ── Graph area ── */}
      <div className="flex-1 relative overflow-hidden">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
              <div className="absolute inset-0 border-4 border-transparent border-t-blue-400 rounded-full animate-spin" />
              <div className="absolute inset-2 border-2 border-transparent border-t-indigo-400 rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.7s" }} />
            </div>
            <div className="text-center">
              <p className="text-slate-300 text-sm font-medium">{loadStatus}</p>
              <p className="text-slate-600 text-xs mt-1">Fetching data from all registers…</p>
            </div>
          </div>
        ) : (
          <ReactECharts
            ref={echartsRef}
            option={option}
            style={{ width: "100%", height: "100%" }}
            onEvents={handleChartEvents}
            notMerge={false}
            lazyUpdate={true}
          />
        )}

        {/* ── Legend ── */}
        {!loading && (
          <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md rounded-2xl p-3 text-[9px] border border-white/10 shadow-2xl">
            <p className="text-slate-500 font-semibold uppercase tracking-wider mb-2 text-[8px]">Modules</p>
            <div className="grid grid-cols-2 gap-x-5 gap-y-1.5">
              {MODULES.map(m => (
                <div key={m.id} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: m.color }} />
                  <span className="text-slate-400 truncate max-w-[90px]">{m.name}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2 border-t border-white/10 flex items-center gap-4">
              <p className="text-slate-500 font-semibold uppercase tracking-wider text-[8px]">Actions</p>
              {[
                { color: "#22c55e", label: "Done" },
                { color: "#f59e0b", label: "Active" },
                { color: "#ef4444", label: "Overdue" },
                { color: "#64748b", label: "Other" },
              ].map(a => (
                <div key={a.label} className="flex items-center gap-1">
                  <span className="w-2 h-2 rotate-45 shrink-0" style={{ background: a.color, display: "inline-block" }} />
                  <span className="text-slate-400">{a.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Node detail panel ── */}
        {selectedNode && (
          <div className="absolute top-4 right-4 bg-slate-950/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-72 shadow-2xl text-xs">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">
                  {selectedNode._act ? "⚡" : selectedNode._mod ? selectedNode._mod.icon : "🔷"}
                </span>
                <span className="font-semibold text-white text-sm">
                  {selectedNode._act ? "Action Details"
                    : selectedNode._rec ? "Record Details"
                    : selectedNode._mod ? "Module Details"
                    : "System Hub"}
                </span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <i className="fas fa-xmark text-[10px]" />
              </button>
            </div>

            {selectedNode.id === "hub" && (
              <p className="text-slate-400 leading-relaxed">
                QHSE merkez hub. Tüm modüller burada birleşir. Zoom için scroll, kaydırmak için sürükle.
              </p>
            )}

            {selectedNode._mod && !selectedNode._rec && !selectedNode._act && (
              <div className="space-y-2 text-slate-300">
                <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                  <span className="w-3 h-3 rounded-full" style={{ background: selectedNode._mod.color }} />
                  <span className="font-semibold" style={{ color: selectedNode._mod.color }}>{selectedNode._mod.name}</span>
                </div>
                <InfoRow label="Total Records" value={selectedNode._count} />
                <p className="text-slate-600 text-[10px] pt-1">Showing top 10 records on the map</p>
              </div>
            )}

            {selectedNode._rec && (
              <div className="space-y-2 text-slate-300">
                <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                  <span className="w-3 h-3 rounded-full" style={{ background: selectedNode._mod?.color }} />
                  <span className="text-[11px] font-semibold" style={{ color: selectedNode._mod?.color }}>
                    {selectedNode._mod?.name}
                  </span>
                </div>
                <InfoRow label="No" value={selectedNode._rec.no || selectedNode._rec.id || "—"} />
                <InfoRow label="Title" value={getLabel(selectedNode._mod, selectedNode._rec)} />
                {selectedNode._rec.status?.value && <InfoRow label="Status" value={selectedNode._rec.status.value} />}
                {selectedNode._rec.responsible && <InfoRow label="Responsible" value={selectedNode._rec.responsible} />}
                {selectedNode._rec.deadline && <InfoRow label="Deadline" value={selectedNode._rec.deadline} />}
                {selectedNode._rec.comment && (
                  <InfoRow label="Comment" value={String(selectedNode._rec.comment).slice(0, 80)} />
                )}
                <InfoRow label="Actions" value={selectedNode._actionCount || 0} />
              </div>
            )}

            {selectedNode._act && (
              <div className="space-y-2 text-slate-300">
                <InfoRow label="Title" value={selectedNode._act.title || "—"} />
                <InfoRow label="Status" value={selectedNode._act.status?.value || selectedNode._act.status || "—"} highlight={getActionColor(selectedNode._act.status?.value || selectedNode._act.status)} />
                <InfoRow label="Deadline" value={selectedNode._act.deadline || "—"} />
                {selectedNode._act.responsibleId && <InfoRow label="Responsible ID" value={selectedNode._act.responsibleId} />}
                {selectedNode._act.completionDate && <InfoRow label="Completed" value={selectedNode._act.completionDate} />}
                {selectedNode._act.comment && <InfoRow label="Comment" value={String(selectedNode._act.comment).slice(0, 80)} />}
              </div>
            )}
          </div>
        )}

        {/* ── Hint ── */}
        {!loading && (
          <div className="absolute bottom-4 right-4 text-[9px] text-slate-600 flex items-center gap-1.5">
            <i className="fas fa-circle-info" />
            Scroll zoom · Drag pan · Click for details
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value, highlight }) {
  return (
    <div className="flex items-start justify-between gap-2 text-[11px]">
      <span className="text-slate-500 shrink-0">{label}:</span>
      <span
        className="text-right break-words"
        style={highlight ? { color: highlight, fontWeight: 600 } : { color: "#cbd5e1" }}
      >
        {String(value)}
      </span>
    </div>
  );
}
