import React, { useState } from "react";
import { MODULE_CONFIGS, exportModule, exportAll } from "./exportUtils.js";

const ExportModal = ({ isOpen, onClose, moduleKey }) => {
  const [statuses, setStatuses] = useState(["active"]);
  const [scope, setScope] = useState(moduleKey ? "current" : "all");
  const [visual, setVisual] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  const config = moduleKey ? MODULE_CONFIGS[moduleKey] : null;
  const isKpiOpi = scope === "current" ? config?.isKpiOpi : true;

  const toggleStatus = (s) =>
    setStatuses((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const handleExport = async () => {
    if (!statuses.length) return;
    setLoading(true);
    setProgress(0);
    try {
      if (scope === "current" && moduleKey) {
        await exportModule(moduleKey, statuses, visual);
      } else {
        await exportAll(statuses, visual, (p) => setProgress(p));
      }
      onClose();
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!loading ? onClose : undefined} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <i className="fas fa-file-excel text-lg" />
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">Export to Excel</h2>
              <p className="text-emerald-100 text-xs mt-0.5">
                {config ? config.name : "All Modules"}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Scope — only show if moduleKey provided */}
          {moduleKey && (
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                Export Scope
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { val: "current", label: "This Module", icon: "fa-table" },
                  { val: "all", label: "All Modules", icon: "fa-layer-group" },
                ].map(({ val, label, icon }) => (
                  <button
                    key={val}
                    onClick={() => setScope(val)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all
                      ${scope === val
                        ? "bg-emerald-50 border-emerald-400 text-emerald-700"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <i className={`fas ${icon} text-xs`} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Status Filter */}
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Data Status
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: "active", label: "Active", color: "green" },
                { val: "archived", label: "Archived", color: "amber" },
                { val: "deleted", label: "Deleted", color: "red" },
              ].map(({ val, label, color }) => {
                const active = statuses.includes(val);
                return (
                  <button
                    key={val}
                    onClick={() => toggleStatus(val)}
                    className={`flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl border text-xs font-semibold transition-all
                      ${active
                        ? color === "green"
                          ? "bg-green-50 border-green-400 text-green-700"
                          : color === "amber"
                          ? "bg-amber-50 border-amber-400 text-amber-700"
                          : "bg-red-50 border-red-400 text-red-700"
                        : "border-gray-200 text-gray-400 hover:bg-gray-50"
                      }`}
                  >
                    <i className={`fas ${active ? "fa-square-check" : "fa-square"} text-xs`} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* KPI/OPI Visual Option */}
          {isKpiOpi && (
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                KPI / OPI Format
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { val: false, label: "Numerical", icon: "fa-hashtag" },
                  { val: true, label: "Visual", icon: "fa-chart-bar" },
                ].map(({ val, label, icon }) => (
                  <button
                    key={String(val)}
                    onClick={() => setVisual(val)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all
                      ${visual === val
                        ? "bg-indigo-50 border-indigo-400 text-indigo-700"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <i className={`fas ${icon} text-xs`} />
                    {label}
                  </button>
                ))}
              </div>
              {visual && (
                <p className="text-xs text-gray-400 mt-1.5">
                  Adds a Performance column (✅ On Target / ⚠️ Near / ❌ Below)
                </p>
              )}
            </div>
          )}

          {/* Progress Bar */}
          {loading && scope === "all" && (
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Exporting all modules...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={loading || !statuses.length}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <i className="fas fa-download text-xs" />
                Export
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
