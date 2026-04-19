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

  const [tableData, setTableData] = useState([]);
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
        {loading ? (
          <tr>
            <td colSpan={25} className="text-center py-6 text-gray-600">
              Arşiv verileri yükleniyor...
            </td>
          </tr>
        ) : !tableData || tableData.length === 0 ? (
          <tr>
            <td colSpan={25} className="text-center py-6 text-gray-500">
              No Data
            </td>
          </tr>
        ) : (
          tableData.map((row, index) => {
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