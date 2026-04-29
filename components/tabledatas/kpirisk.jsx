import EmptyRow from "../utils/EmptyRow.jsx";
// MyTableBody.jsx (ayrı bir dosya olarak kaydedin)
import React from "react";
import { useState, useEffect } from "react";
import { hCheckboxChange } from "../profile.jsx";

const getToken = () =>
  document.cookie
    .split("; ")
    .find((r) => r.startsWith("auth_token="))
    ?.split("=")
    .slice(1)
    .join("=") ?? "";

const KPIBody = ({
  selectedRows,
  selectedRowsForActions,
  showArchived,
  onCheckboxChange,
  onCheckboxChangeForActions,
  showDeleted,
  showDeletedAction,
  setSelectedRows,
  setSelectedTable,
  activeHeader,
  selectedTable,
  refresh,
  setRefresh,
}) => {
  console.log("ACTIVE HEADERRRRR : ", activeHeader);
  const [archivedData, setArchivedData] = useState([]);
  const [deletedData, setDeletedData] = useState([]);
  const [deletedActionData, setDeletedActionData] = useState([]);
  const [actionData, setActionData] = useState([]);
  const [editData, setEditData] = useState([]);

  useEffect(() => {
    if (refresh) {
      if (!showArchived & !showDeleted & !showDeletedAction & activeHeader) {
        const timer = setTimeout(() => {
          getAll();
          setRefresh(false);
          setSelectedRows(new Set());
          setSelectedTable([]);
        }, 500);

        return () => clearTimeout(timer); // cleanup
      } 
    }
  }, [refresh]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // ── Filters ────────────────────────────────────────────────────────────
  const [filters, setFilters] = useState({});

  const applyFilters = (data) => {
    if (!data?.length) return data || [];
    const active = Object.entries(filters).filter(([, v]) => v?.trim());
    if (!active.length) return data;
    return data.filter(row =>
      active.every(([key, val]) => {
        if (!val?.trim()) return true;
        const parts = key.replace(/\?/g, "").split(".");
        let v = row;
        for (const p of parts) v = v?.[p];
        if (v === 1 || v === 0) return (v === 1 ? "yes" : "no").includes(val.toLowerCase());
        if (v !== null && typeof v === "object" && "value" in v) return String(v.value ?? "").toLowerCase().includes(val.toLowerCase());
        return String(v ?? "").toLowerCase().includes(val.toLowerCase());
      })
    );
  };

  // ────────────────────────────────────────────────────────────────────────


  const [tableData, setTableData] = useState([]);

  const filteredData         = applyFilters(tableData);
  const filteredArchivedData = applyFilters(archivedData);
  const filteredDeletedData  = applyFilters(deletedData);
  const getAll = async () => {
    setLoading(true);
    const token = getToken();
    fetch(`/api/dashboard/kpi?token=${token}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed To Get Datas From Database");
        }
        return response.json();
      })
      .then((fetchedData) => {
        setTableData(fetchedData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!showArchived && !showDeleted && activeHeader) {
      getAll();
    } else {
      console.log("");
    }
  }, [showArchived, showDeleted]);

  const getRiskLevel = (severity, likelihood) => {
  const score = Number(severity) * Number(likelihood);

  if (score >= 1 && score <= 6) {
    return {
      label: "Low",
      color: "bg-gray-100 text-black border border-gray-200",
    };
  }

  if (score > 6 && score <= 12) {
    return {
      label: "Medium",
      color: "bg-gray-100 text-black border border-gray-200",
    };
  }

  if (score > 12 && score <= 25) {
    return {
      label: "High",
      color: "bg-gray-100 text-black border border-gray-200",
    };
  }

  return {
    label: "-",
    color: "bg-gray-100 text-gray-500 border border-gray-200",
  };
};

  if (loading) return;
  if (error) return;
  // 🟩 Normal (aktif) tablo
  return (
      <tbody className="text-xs">
            {/* ── Filter Row ── */}
            <tr className="bg-gray-50 border-b-2 border-blue-200">
              <td className="border border-gray-200 px-1 py-1 sticky left-[-1px] z-10 bg-gray-50">
                <button onClick={() => setFilters({})}
                  className="text-[10px] bg-blue-500 text-white rounded px-1.5 py-0.5 hover:bg-blue-600 whitespace-nowrap"
                  title="Clear Filters">✕ Clear</button>
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["title"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "title": e.target.value}))}
                  placeholder="Filter..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["function?.value"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "function?.value": e.target.value}))}
                  placeholder="Filter..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["lykpi"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "lykpi": e.target.value}))}
                  placeholder="Filter..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["actualKPI"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "actualKPI": e.target.value}))}
                  placeholder="Filter..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["annualTarget"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "annualTarget": e.target.value}))}
                  placeholder="Filter..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["january"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "january": e.target.value}))}
                  placeholder="Filter..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["february"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "february": e.target.value}))}
                  placeholder="Filter..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["march"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "march": e.target.value}))}
                  placeholder="Filter..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["april"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "april": e.target.value}))}
                  placeholder="Filter..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["may"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "may": e.target.value}))}
                  placeholder="Filter..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["june"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "june": e.target.value}))}
                  placeholder="Filter..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["july"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "july": e.target.value}))}
                  placeholder="Filter..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["august"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "august": e.target.value}))}
                  placeholder="Filter..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["september"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "september": e.target.value}))}
                  placeholder="Filter..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["october"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "october": e.target.value}))}
                  placeholder="Filter..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["november"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "november": e.target.value}))}
                  placeholder="Filter..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["december"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "december": e.target.value}))}
                  placeholder="Filter..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              {/* <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["comment"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "comment": e.target.value}))}
                  placeholder="Filter..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td> */}
            </tr>

        {loading ? (
          <tr>
            <td colSpan={25} className="text-center py-6 text-gray-600">
              Arşiv verileri yükleniyor...
            </td>
          </tr>
        ) : !filteredData || filteredData.length === 0 ? (
          <EmptyRow colSpan={25} />
        ) : (
          filteredData.map((row, index) => {
            const numActions = row.actions ? row.actions.length : 1;
            const actions = Array.isArray(row.actions)
              ? row.actions
              : [row.actions];

            const SoftBadge = ({ value, color }) =>
              value ? (
                <span
                  className={`inline-block px-1.5 py-0.5 rounded-full text-xs font-medium shadow-sm ${color}`}
                >
                  {value}
                </span>
              ) : null;



            return (
              <React.Fragment key={row.id}>
                <tr
                  className={`border-b h-16 min-h-16 align-middle border-gray-200 ${
                    index % 2 === 0
                      ? "bg-white hover:bg-gray-200"
                      : "bg-green-100 hover:bg-green-200"
                  }`}
                >
                  {/* ID + Checkbox */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-16 sticky left-[-1px] top-0 z-10 bg-white"
                    rowSpan={1}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">
                        {row.no}
                      </span>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(row.id)}
                        onChange={() => onCheckboxChange(row.id, tableData)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                    </div>
                  </td>

                 {/* SWOT */}
                <td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
                  <SoftBadge value={row.title} color="bg-gray-100 text-black border border-gray-200" />
                </td>

                {/* PESTLE */}
                <td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
                  <SoftBadge value={row.function?.value} color="bg-gray-100 text-black border border-gray-200" />
                </td>

                {/* Interested Party */}
                <td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
                  <SoftBadge value={row.lykpi} color="bg-gray-100 text-black border border-gray-200" />
                </td>

                {/* Risk Opportunity */}
                <td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
                  <SoftBadge value={row.actualKPI} color="bg-gray-100 text-black border border-gray-200" />
                </td>

                {/* Objective */}
                <td className="border border-gray-200 px-2 py-1 w-28" rowSpan={1}>
                  <SoftBadge value={row.annualTarget} color="bg-gray-100 text-black border border-gray-200" />
                </td>

                {/* KPI */}
                <td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
                  <SoftBadge value={row.january} color="bg-gray-100 text-black border border-gray-200" />
                </td>

                {/* Process */}
                <td className="border border-gray-200 px-2 py-1 w-24" rowSpan={1}>
                  <SoftBadge value={row.february} color="bg-gray-100 text-black border border-gray-200" />
                </td>

                {/* ecm */}
                <td className="border border-gray-200 px-2 py-1 w-48" rowSpan={1}>
                  <SoftBadge value={row.march} color="bg-gray-100 text-black border border-gray-200" />
                </td>

                {/* Initial Risk Severity */}
                <td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
                  <SoftBadge value={row.april} color="bg-gray-100 text-black border border-gray-200" />
                </td>

                {/* Initial Risk Likelihood */}
                <td className="border border-gray-200 px-2 py-1 w-24" rowSpan={1}>
                  <SoftBadge value={row.may} color="bg-gray-100 text-black border border-gray-200" />
                </td>

                {/* Initial Risk Likelihood */}
                <td className="border border-gray-200 px-2 py-1 w-24" rowSpan={1}>
                  <SoftBadge value={row.june} color="bg-gray-100 text-black border border-gray-200" />
                </td>

                {/* ACM */}
                <td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
                  <SoftBadge value={row.july} color="bg-gray-100 text-black border border-gray-200" />
                </td>

                {/* Residual Risk Severity */}
                <td className="border border-gray-200 px-2 py-1 w-24" rowSpan={1}>
                  <SoftBadge value={row.august} color="bg-gray-100 text-black border border-gray-200" />
                </td>

                {/* Residual Risk Likelihood */}
                <td className="border border-gray-200 px-2 py-1 w-24" rowSpan={1}>
                  <SoftBadge value={row.september} color="bg-gray-100 text-black border border-gray-200" />
                </td>

                {/* Residual Risk Likelihood */}
                <td className="border border-gray-200 px-2 py-1 w-24" rowSpan={1}>
                  <SoftBadge value={row.october} color="bg-gray-100 text-black border border-gray-200" />
                </td>

                {/* Residual Risk Likelihood */}
                <td className="border border-gray-200 px-2 py-1 w-24" rowSpan={1}>
                  <SoftBadge value={row.november} color="bg-gray-100 text-black border border-gray-200" />
                </td>

                {/* Residual Risk Likelihood */}
                <td className="border border-gray-200 px-2 py-1 w-24" rowSpan={1}>
                  <SoftBadge value={row.december} color="bg-gray-100 text-black border border-gray-200" />
                </td>

                </tr>
              </React.Fragment>
            );
          })
        )}
      </tbody>
  );
  
};

export default KPIBody;