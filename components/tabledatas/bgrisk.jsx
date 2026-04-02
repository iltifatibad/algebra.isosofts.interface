import React, { useState, useEffect } from "react";

// ─── Helpers ────────────────────────────────────────────────────────────────

const getToken = () =>
  document.cookie
    .split("; ")
    .find((r) => r.startsWith("auth_token="))
    ?.split("=")
    .slice(1)
    .join("=") ?? "";

const SoftBadge = ({ value, color = "bg-gray-100 text-gray-700 border border-gray-200" }) =>
  value ? (
    <span className={`inline-block px-2 py-1 rounded-full text-sm font-medium shadow-sm ${color}`}>
      {value}
    </span>
  ) : null;

const getRiskLevel = (severity, likelihood) => {
  const score = Number(severity) * Number(likelihood);
  if (score >= 1 && score <= 6)  return { label: "Low",    color: "bg-emerald-100 text-emerald-700 border border-emerald-200" };
  if (score > 6  && score <= 12) return { label: "Medium", color: "bg-yellow-100 text-yellow-700 border border-yellow-200" };
  if (score > 12 && score <= 25) return { label: "High",   color: "bg-rose-100 text-rose-700 border border-rose-200" };
  return { label: "-", color: "bg-gray-100 text-gray-500 border border-gray-200" };
};

// ─── Shared Row Renderers ────────────────────────────────────────────────────

const RegisterCols = ({ row }) => {
  const initialRisk  = getRiskLevel(row.initialRiskSeverity, row.initialRiskLikelihood);
  const residualRisk = getRiskLevel(row.residualRiskSeverity, row.residualRiskLikelihood);
  return (
    <>
      <td className="border border-gray-200 px-2 py-1 w-20"><SoftBadge value={row.swot?.value}           color="bg-rose-100 text-rose-700 border border-rose-200" /></td>
      <td className="border border-gray-200 px-2 py-1 w-20"><SoftBadge value={row.pestle?.value}         color="bg-blue-100 text-blue-700 border border-blue-200" /></td>
      <td className="border border-gray-200 px-2 py-1 w-32"><SoftBadge value={row.interestedParty?.value} color="bg-violet-100 text-violet-700 border border-violet-200" /></td>
      <td className="border border-gray-200 px-2 py-1 w-32"><SoftBadge value={row.riskOpportunity}       color="bg-amber-100 text-amber-700 border border-amber-200" /></td>
      <td className="border border-gray-200 px-2 py-1 w-28"><SoftBadge value={row.objective}             color="bg-cyan-100 text-cyan-700 border border-cyan-200" /></td>
      <td className="border border-gray-200 px-2 py-1 w-20"><SoftBadge value={row.kpi}                   color="bg-teal-100 text-teal-700 border border-teal-200" /></td>
      <td className="border border-gray-200 px-2 py-1 w-24"><SoftBadge value={row.process?.value}        color="bg-indigo-100 text-indigo-700 border border-indigo-200" /></td>
      <td className="border border-gray-200 px-2 py-1 w-48"><SoftBadge value={row.ecm?.value || `${row.ecm}`} color="bg-pink-100 text-pink-700 border border-pink-200" /></td>
      <td className="border border-gray-200 px-2 py-1 w-20"><SoftBadge value={row.initialRiskSeverity}   color="bg-orange-100 text-orange-700 border border-orange-200" /></td>
      <td className="border border-gray-200 px-2 py-1 w-24"><SoftBadge value={row.initialRiskLikelihood} color="bg-lime-100 text-lime-700 border border-lime-200" /></td>
      <td className="border border-gray-200 px-2 py-1 w-20"><SoftBadge value={initialRisk.label}         color={initialRisk.color} /></td>
      <td className="border border-gray-200 px-2 py-1 w-20"><SoftBadge value={row.acm}                   color="bg-teal-100 text-teal-700 border border-teal-200" /></td>
      <td className="border border-gray-200 px-2 py-1 w-24"><SoftBadge value={row.residualRiskSeverity}  color="bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200" /></td>
      <td className="border border-gray-200 px-2 py-1 w-24"><SoftBadge value={row.residualRiskLikelihood} color="bg-sky-100 text-sky-700 border border-sky-200" /></td>
      <td className="border border-gray-200 px-2 py-1 w-24"><SoftBadge value={row.residualRiskLikelihood} color="bg-sky-100 text-sky-700 border border-sky-200" /></td>
      <td className="border border-gray-200 px-2 py-1 w-20"><SoftBadge value={residualRisk.label}        color={residualRisk.color} /></td>
    </>
  );
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const ActionCols = ({ row }) => (
  <>
    <td className="border-b border-gray-200 px-2 py-1 w-32"><SoftBadge value={row?.title} /></td>
    <td className="border-b border-gray-200 px-2 py-1 w-32"><SoftBadge value={row?.raiseDate} /></td>
    <td className="border-b border-gray-200 px-2 py-1 w-24"><SoftBadge value={row?.resources?.toString() || ""} /></td>
    <td className="border-b border-gray-200 px-2 py-1 w-28"><SoftBadge value={row?.relativeFunction?.value} /></td>
    <td className="border-b border-gray-200 px-2 py-1 w-28"><SoftBadge value={row?.responsible?.value} /></td>
    <td className="border-b border-gray-200 px-2 py-1 w-24"><SoftBadge value={row?.deadline} /></td>
    <td className="border-b border-gray-200 px-2 py-1 w-36"><SoftBadge value={row?.confirmation?.value} /></td>
    <td className="border-b border-gray-200 px-2 py-1 w-24"><SoftBadge value={row?.status?.value?.toString()} /></td>
    <td className="border-b border-gray-200 px-2 py-1 w-24"><SoftBadge value={row?.completionDate} /></td>
    <td className="border-b border-gray-200 px-2 py-1 w-32"><SoftBadge value={row?.verificationStatus?.value} /></td>
    <td className="border-b border-gray-200 px-2 py-1 w-40"><SoftBadge value={row?.comment} /></td>
    {MONTHS.map((month) => (
      <td key={`${row?.id}-${month}`} className="border-b border-gray-200 px-2 py-1 w-24">
        <SoftBadge value={row?.[month.toLowerCase()]?.value || ""} />
      </td>
    ))}
  </>
);

// ─── Fetch Helpers ───────────────────────────────────────────────────────────

const fetchData = async (url, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch failed: ${url}`);
    setter(await res.json() || []);
  } catch (err) {
    console.error(err);
    setter([]);
  } finally {
    setLoading(false);
  }
};

// ─── Main Component ──────────────────────────────────────────────────────────

const MyTableBody = ({
  selectedRows, selectedRowsForActions,
  showArchived, showDeleted, showDeletedAction,
  onCheckboxChange, onCheckboxChangeForActions,
  setSelectedRows, setSelectedTable,
  activeHeader, selectedTable,
  refresh, setRefresh,
}) => {
  const token = getToken();
  const [tableData,       setTableData]       = useState([]);
  const [archivedData,    setArchivedData]     = useState([]);
  const [deletedData,     setDeletedData]      = useState([]);
  const [actionData,      setActionData]       = useState([]);
  const [deletedActionData, setDeletedActionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const firstRowId = [...selectedRows][0];

  const getAll            = () => fetchData(`/api/register/br/all?token=${token}`, setTableData, setLoading);
  const getArchivedData   = () => fetchData(`/api/register/br/all?status=archived&token=${token}`, setArchivedData, setLoading);
  const getDeletedData    = () => fetchData(`/api/register/br/all?status=deleted&token=${token}`, setDeletedData, setLoading);
  const getDeletedActionData = () => firstRowId
    ? fetchData(`/api/register/component/action/all?registerId=${firstRowId}&status=deleted&token=${token}`, setDeletedActionData, setLoading)
    : setLoading(false);
  const getAllActions      = () => firstRowId
    ? fetchData(`/api/register/component/action/all?registerId=${firstRowId}&status=active&token=${token}`, setActionData, setLoading)
    : setLoading(false);

  // Triggered fetches based on mode flags
  useEffect(() => { showArchived ? getArchivedData() : setArchivedData([]); }, [showArchived]);
  useEffect(() => { showDeleted  ? getDeletedData()  : setDeletedData([]);  }, [showDeleted]);
  useEffect(() => { !activeHeader && showDeletedAction ? getDeletedActionData() : setDeletedActionData([]); }, [showDeletedAction]);
  useEffect(() => { if (!showArchived && !showDeleted && activeHeader) getAll(); }, [showArchived, showDeleted]);
  useEffect(() => { if (!activeHeader && selectedRows.size > 0) getAllActions(); }, [activeHeader, selectedRows]);

  // Refresh handler
  useEffect(() => {
    if (!refresh) return;
    const fn =
      showArchived                          ? getArchivedData   :
      showDeleted                           ? getDeletedData    :
      !activeHeader && showDeletedAction    ? getDeletedActionData :
      !activeHeader                         ? getAllActions     :
                                              getAll;
    const timer = setTimeout(() => { fn(); setRefresh(false); }, 500);
    return () => clearTimeout(timer);
  }, [refresh]);

  if (loading) return null;
  if (error)   return null;

  // ── Row stripe helper ──
  const rowClass = (i) =>
    `border-b h-16 min-h-16 align-middle border-gray-200 ${
      i % 2 === 0 ? "bg-white hover:bg-gray-200" : "bg-green-100 hover:bg-green-200"
    }`;

  // ── Register-style tbody (active / archived / deleted) ──
  const renderRegisterBody = (data, onCheck) => (
    <tbody className="text-sm">
      {!data || data.length === 0 ? (
        <tr><td colSpan={26} className="text-center py-4 text-gray-500">No Data</td></tr>
      ) : data.map((row, i) => (
        <React.Fragment key={row.id}>
          <tr className={rowClass(i)}>
            <td className="border border-gray-200 px-3 py-2 w-16 sticky left-[-1px] top-0 z-10 bg-white" rowSpan={1}>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">{row.no}</span>
                <input type="checkbox" checked={selectedRows.has(row.id)} onChange={() => onCheck(row.id, data)} className="h-4 w-4 text-blue-600 rounded" />
              </div>
            </td>
            <RegisterCols row={row} />
          </tr>
        </React.Fragment>
      ))}
    </tbody>
  );

  // ── Action-style tbody (active actions / deleted actions) ──
  const renderActionBody = (data, onCheck, checkedSet) => (
    <tbody>
      {!selectedTable || !Array.isArray(data) || data.length === 0 || selectedTable.length === 0 ? (
        <tr><td colSpan={25} className="text-center py-4">No Data</td></tr>
      ) : data.map((row, i) => (
        <React.Fragment key={row.id}>
          <tr className={rowClass(i)}>
            <td className="border-b border-gray-200 px-2 py-1 w-16 sticky left-[-1px] top-0 z-10 bg-white -ml-px">
              {selectedTable[0].no}
              <input type="checkbox" checked={checkedSet.has(row.id)} onChange={() => onCheck(row.id, data)} className="ml-2" />
            </td>
            <ActionCols row={row} />
          </tr>
        </React.Fragment>
      ))}
    </tbody>
  );

  // ── Route to correct view ──
  if (showDeleted)                         return renderRegisterBody(deletedData, onCheckboxChange);
  if (showArchived)                        return renderRegisterBody(archivedData, onCheckboxChange);
  if (!activeHeader && showDeletedAction)  return renderActionBody(deletedActionData, onCheckboxChangeForActions, selectedRowsForActions);
  if (!activeHeader)                       return renderActionBody(actionData, onCheckboxChangeForActions, selectedRowsForActions);
  return renderRegisterBody(tableData, onCheckboxChange);
};

export default MyTableBody;