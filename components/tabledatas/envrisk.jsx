// MyTableBody.jsx (ayrı bir dosya olarak kaydedin)
import React from "react";
import { useState, useEffect } from "react";
import { hCheckboxChange } from "../profile.jsx";

const EnvBody = ({
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tableData, setTableData] = useState([]);

  const getArchivedData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/register/eai/all?status=archived");
      if (!response.ok) throw new Error("Failed To Get Datas From Archived DataBase");
      const fetchedData = await response.json();
      setArchivedData(fetchedData || []);
      console.log("Arşiv verileri:", fetchedData);
    } catch (err) {
      console.error("Error While Fetching Archived Datas:", err);
      setArchivedData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (refresh) {
      if (!showArchived & !showDeleted & !showDeletedAction & activeHeader) {
        const timer = setTimeout(() => { getAll(); setRefresh(false); }, 500);
        return () => clearTimeout(timer);
      } else if (showArchived) {
        const timer = setTimeout(() => { getArchivedData(); setRefresh(false); }, 500);
        return () => clearTimeout(timer);
      } else if (showDeleted) {
        const timer = setTimeout(() => { getDeletedData(); setRefresh(false); }, 500);
        return () => clearTimeout(timer);
      } else if (!activeHeader) {
        const timer = setTimeout(() => { getAllActions(selectedRows); setRefresh(false); }, 500);
        return () => clearTimeout(timer);
      } else if ((activeHeader == false) & (showDeletedAction == true)) {
        const timer = setTimeout(() => { getDeletedActionData(); setRefresh(false); }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [refresh]);

  useEffect(() => {
    if (showArchived) getArchivedData();
    else setArchivedData([]);
  }, [showArchived]);

  const getDeletedData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/register/eai/all?status=deleted");
      if (!response.ok) throw new Error("Failed To Get Datas From Deleted DataBase");
      const fetchedData = await response.json();
      setDeletedData(fetchedData || []);
      console.log("Deleted verileri:", fetchedData);
    } catch (err) {
      console.error("Error While Fetching Deleted Datas:", err);
      setDeletedData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showDeleted) getDeletedData();
    else setDeletedData([]);
  }, [showDeleted]);

  const getDeletedActionData = async () => {
    setLoading(true);
    const selectedRowsArray = [...selectedRows];
    try {
      const firstRowId = selectedRowsArray[0];
      const url = `/api/register/component/action/all?registerId=${firstRowId}&status=deleted`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed To Get Datas From Deleted DataBase");
      const fetchedData = await response.json();
      setDeletedActionData(fetchedData || []);
      console.log("Deleted Action verileri:", fetchedData);
    } catch (err) {
      console.error("Error While Fetching Deleted Datas:", err);
      setDeletedActionData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!activeHeader && showDeletedAction) getDeletedActionData();
    else setDeletedActionData([]);
  }, [showDeletedAction]);

  const getAll = async () => {
    setLoading(true);
    fetch("/api/register/eai/all")
      .then((response) => {
        if (!response.ok) throw new Error("Failed To Get Datas From Database");
        return response.json();
      })
      .then((fetchedData) => { setTableData(fetchedData); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  };

  useEffect(() => {
    if (!showArchived && !showDeleted && activeHeader) getAll();
  }, [showArchived, showDeleted]);

  const getAllActions = async (selectedRows) => {
    setLoading(true);
    getDeletedActionData();
    const selectedRowsArray = [...selectedRows];
    if (selectedRowsArray.length === 0) {
      console.error("Seçili satır yok!");
      setLoading(false);
      return;
    }
    const firstRowId = selectedRowsArray[0];
    const url = `/api/register/component/action/all?registerId=${firstRowId}&status=active`;
    console.log("URL:", url);
    fetch(url, { method: "GET", headers: { "Content-Type": "application/json" } })
      .then((response) => {
        if (!response.ok) throw new Error(`Failed To Get Actions: ${response.status} - ${response.statusText}`);
        return response.json();
      })
      .then((data) => { setActionData(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  };

  useEffect(() => {
    if (!activeHeader && selectedRows.size > 0) {
      getAllActions(selectedRows);
      console.log("Function Running");
    }
  }, [activeHeader, selectedRows]);

  if (loading) return;
  if (error) return;

  const SoftBadge = ({ value, color }) =>
    value ? (
      <span className={`inline-block px-2 py-1 rounded-full text-sm font-medium shadow-sm ${color}`}>
        {value}
      </span>
    ) : null;

  // ─── MONTHS HELPER ───────────────────────────────────────────────────────
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  // ─── DELETED VIEW ────────────────────────────────────────────────────────
  if (showDeleted) {
    return (
      <tbody className="text-sm">
        {loading ? (
          <tr><td colSpan={25} className="text-center py-4 text-gray-600">Deleted verileri yükleniyor...</td></tr>
        ) : !deletedData || deletedData.length === 0 ? (
          <tr><td colSpan={25} className="text-center py-4 text-gray-500">No Data</td></tr>
        ) : (
          deletedData.map((row, index) => (
            <React.Fragment key={row.id}>
              <tr className={`border-b h-16 min-h-16 align-middle border-gray-200 ${index % 2 === 0 ? "bg-white hover:bg-gray-200" : "bg-green-100 hover:bg-green-200"}`}>
                <td className="border border-gray-200 px-2 py-1 w-16 sticky left-0 top-0 z-10 bg-white" rowSpan={1}>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{row.no}</span>
                    <input checked={selectedRows.has(row.id)} onChange={() => onCheckboxChange(row.id, deletedData)} type="checkbox" className="ml-2 h-4 w-4 text-blue-600" />
                  </div>
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-16 sticky left-[-1px] top-0 z-10 bg-white -ml-px">
                  <SoftBadge value={row.no || ""} color="bg-slate-100 text-slate-700 border border-slate-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-32">
                  <SoftBadge value={row.title || ""} color="bg-rose-100 text-rose-700 border border-rose-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-32">
                  <SoftBadge value={row.raiseDate || ""} color="bg-blue-100 text-blue-700 border border-blue-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-24">
                  <SoftBadge value={row.resources?.toString() || ""} color="bg-violet-100 text-violet-700 border border-violet-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-28">
                  <SoftBadge value={row.relativeFunction?.value || ""} color="bg-amber-100 text-amber-700 border border-amber-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-28">
                  <SoftBadge value={row.responsible?.value || ""} color="bg-cyan-100 text-cyan-700 border border-cyan-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-24">
                  <SoftBadge value={row.deadline || ""} color="bg-teal-100 text-teal-700 border border-teal-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-36">
                  <SoftBadge value={row.confirmation?.value || ""} color="bg-indigo-100 text-indigo-700 border border-indigo-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-24">
                  <SoftBadge value={row.status?.value?.toString() || ""} color="bg-pink-100 text-pink-700 border border-pink-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-24">
                  <SoftBadge value={row.completionDate || ""} color="bg-orange-100 text-orange-700 border border-orange-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-32">
                  <SoftBadge value={row.verificationStatus?.value || ""} color="bg-lime-100 text-lime-700 border border-lime-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-40">
                  <SoftBadge value={row.comment || ""} color="bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200" />
                </td>
                {months.map((month) => {
                  const monthKey = month.toLowerCase();
                  return (
                    <td key={`${row.id}-${monthKey}`} className="border-b border-gray-200 px-2 py-1 w-24">
                      <SoftBadge value={row[monthKey]?.value || ""} color="bg-sky-100 text-sky-700 border border-sky-200" />
                    </td>
                  );
                })}
              </tr>
            </React.Fragment>
          ))
        )}
      </tbody>
    );

  // ─── ARCHIVED VIEW ───────────────────────────────────────────────────────
  } else if (showArchived) {
    return (
      <tbody className="text-sm">
        {loading ? (
          <tr><td colSpan={25} className="text-center py-4 text-gray-600">Arşiv verileri yükleniyor...</td></tr>
        ) : !archivedData || archivedData.length === 0 ? (
          <tr><td colSpan={25} className="text-center py-4 text-gray-500">No Data</td></tr>
        ) : (
          archivedData.map((row, index) => (
            <React.Fragment key={row.id}>
              <tr className={`border-b h-16 min-h-16 align-middle border-gray-200 ${index % 2 === 0 ? "bg-white hover:bg-gray-200" : "bg-green-100 hover:bg-green-200"}`}>
                <td className="border border-gray-200 px-2 py-1 w-16 sticky left-0 top-0 z-10 bg-white" rowSpan={1}>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{row.no}</span>
                    <input checked={selectedRows.has(row.id)} onChange={() => onCheckboxChange(row.id, archivedData)} type="checkbox" className="ml-2 h-4 w-4 text-blue-600" />
                  </div>
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-16 sticky left-[-1px] top-0 z-10 bg-white -ml-px">
                  <SoftBadge value={row.no || ""} color="bg-slate-100 text-slate-700 border border-slate-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-32">
                  <SoftBadge value={row.title || ""} color="bg-rose-100 text-rose-700 border border-rose-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-32">
                  <SoftBadge value={row.raiseDate || ""} color="bg-blue-100 text-blue-700 border border-blue-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-24">
                  <SoftBadge value={row.resources?.toString() || ""} color="bg-violet-100 text-violet-700 border border-violet-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-28">
                  <SoftBadge value={row.relativeFunction?.value || ""} color="bg-amber-100 text-amber-700 border border-amber-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-28">
                  <SoftBadge value={row.responsible?.value || ""} color="bg-cyan-100 text-cyan-700 border border-cyan-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-24">
                  <SoftBadge value={row.deadline || ""} color="bg-teal-100 text-teal-700 border border-teal-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-36">
                  <SoftBadge value={row.confirmation?.value || ""} color="bg-indigo-100 text-indigo-700 border border-indigo-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-24">
                  <SoftBadge value={row.status?.value?.toString() || ""} color="bg-pink-100 text-pink-700 border border-pink-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-24">
                  <SoftBadge value={row.completionDate || ""} color="bg-orange-100 text-orange-700 border border-orange-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-32">
                  <SoftBadge value={row.verificationStatus?.value || ""} color="bg-lime-100 text-lime-700 border border-lime-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-40">
                  <SoftBadge value={row.comment || ""} color="bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200" />
                </td>
                {months.map((month) => {
                  const monthKey = month.toLowerCase();
                  return (
                    <td key={`${row.id}-${monthKey}`} className="border-b border-gray-200 px-2 py-1 w-24">
                      <SoftBadge value={row[monthKey]?.value || ""} color="bg-sky-100 text-sky-700 border border-sky-200" />
                    </td>
                  );
                })}
              </tr>
            </React.Fragment>
          ))
        )}
      </tbody>
    );

  // ─── ACTION VIEW (active) ────────────────────────────────────────────────
  } else if (!activeHeader && showDeletedAction === false) {
    return (
      <tbody>
        {loading ? (
          <tr><td colSpan={25} className="text-center py-4">Deleted verileri yükleniyor...</td></tr>
        ) : selectedTable && actionData && selectedTable.length > 0 ? (
          actionData.map((row, index) => {
            const SoftBadge = ({ value }) =>
              value ? <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">{value}</span> : null;
            return (
              <React.Fragment key={row.id}>
                <tr className={`border-b h-16 min-h-16 align-middle border-gray-200 ${index % 2 === 0 ? "bg-white hover:bg-gray-200" : "bg-green-100 hover:bg-green-200"}`}>
                  <td className="border-b border-gray-200 px-2 py-1 w-16 sticky left-[-1px] top-0 z-10 bg-white -ml-px">
                    {selectedTable[0].no}
                    <input checked={selectedRowsForActions.has(actionData[index].id)} onChange={() => onCheckboxChangeForActions(actionData[index].id, actionData)} type="checkbox" className="ml-2" />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 w-32"><SoftBadge value={actionData?.[index]?.title} /></td>
                  <td className="border-b border-gray-200 px-2 py-1 w-32"><SoftBadge value={actionData?.[index]?.raiseDate} /></td>
                  <td className="border-b border-gray-200 px-2 py-1 w-24"><SoftBadge value={actionData?.[index]?.resources?.toString() || ""} /></td>
                  <td className="border-b border-gray-200 px-2 py-1 w-28"><SoftBadge value={actionData?.[index]?.relativeFunction?.value} /></td>
                  <td className="border-b border-gray-200 px-2 py-1 w-28"><SoftBadge value={actionData?.[index]?.responsible?.value} /></td>
                  <td className="border-b border-gray-200 px-2 py-1 w-24"><SoftBadge value={actionData?.[index]?.deadline} /></td>
                  <td className="border-b border-gray-200 px-2 py-1 w-36"><SoftBadge value={actionData?.[index]?.confirmation?.value} /></td>
                  <td className="border-b border-gray-200 px-2 py-1 w-24"><SoftBadge value={actionData?.[index]?.status?.value?.toString()} /></td>
                  <td className="border-b border-gray-200 px-2 py-1 w-24"><SoftBadge value={actionData?.[index]?.completionDate} /></td>
                  <td className="border-b border-gray-200 px-2 py-1 w-32"><SoftBadge value={actionData?.[index]?.verificationStatus?.value} /></td>
                  <td className="border-b border-gray-200 px-2 py-1 w-40"><SoftBadge value={actionData?.[index]?.comment} /></td>
                  {months.map((month) => (
                    <td key={`${actionData?.[index]?.id}-${month}`} className="border-b border-gray-200 px-2 py-1 w-24">
                      <SoftBadge value={actionData?.[index]?.[month.toLowerCase()]?.value || ""} />
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            );
          })
        ) : (
          <tr><td colSpan={25} className="text-center py-4">No Data</td></tr>
        )}
      </tbody>
    );

  // ─── DELETED ACTION VIEW ─────────────────────────────────────────────────
  } else if (!activeHeader && showDeletedAction === true) {
    return (
      <tbody>
        {loading ? (
          <tr><td colSpan={25} className="text-center py-4">Deleted verileri yükleniyor...</td></tr>
        ) : selectedTable && deletedActionData && selectedTable.length > 0 ? (
          deletedActionData.map((row, index) => {
            const SoftBadge = ({ value }) =>
              value ? <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">{value}</span> : null;
            return (
              <React.Fragment key={row.id}>
                <tr className={`border-b h-16 min-h-16 align-middle border-gray-200 ${index % 2 === 0 ? "bg-white hover:bg-gray-200" : "bg-green-100 hover:bg-green-200"}`}>
                  <td className="border-b border-gray-200 px-2 py-1 w-16 sticky left-[-1px] top-0 z-10 bg-white -ml-px">
                    {selectedTable[0].no}
                    <input checked={selectedRowsForActions.has(deletedActionData[index].id)} onChange={() => onCheckboxChangeForActions(deletedActionData[index].id, deletedActionData)} type="checkbox" className="ml-2" />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 w-32"><SoftBadge value={deletedActionData?.[index]?.title} /></td>
                  <td className="border-b border-gray-200 px-2 py-1 w-32"><SoftBadge value={deletedActionData?.[index]?.raiseDate} /></td>
                  <td className="border-b border-gray-200 px-2 py-1 w-24"><SoftBadge value={deletedActionData?.[index]?.resources?.toString() || ""} /></td>
                  <td className="border-b border-gray-200 px-2 py-1 w-28"><SoftBadge value={deletedActionData?.[index]?.relativeFunction?.value} /></td>
                  <td className="border-b border-gray-200 px-2 py-1 w-28"><SoftBadge value={deletedActionData?.[index]?.responsible?.value} /></td>
                  <td className="border-b border-gray-200 px-2 py-1 w-24"><SoftBadge value={deletedActionData?.[index]?.deadline} /></td>
                  <td className="border-b border-gray-200 px-2 py-1 w-36"><SoftBadge value={deletedActionData?.[index]?.confirmation?.value} /></td>
                  <td className="border-b border-gray-200 px-2 py-1 w-24"><SoftBadge value={deletedActionData?.[index]?.status?.value?.toString()} /></td>
                  <td className="border-b border-gray-200 px-2 py-1 w-24"><SoftBadge value={deletedActionData?.[index]?.completionDate} /></td>
                  <td className="border-b border-gray-200 px-2 py-1 w-32"><SoftBadge value={deletedActionData?.[index]?.verificationStatus?.value} /></td>
                  <td className="border-b border-gray-200 px-2 py-1 w-40"><SoftBadge value={deletedActionData?.[index]?.comment} /></td>
                  {months.map((month) => (
                    <td key={`${deletedActionData?.[index]?.id}-${month}`} className="border-b border-gray-200 px-2 py-1 w-24">
                      <SoftBadge value={deletedActionData?.[index]?.[month.toLowerCase()]?.value || ""} />
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            );
          })
        ) : (
          <tr><td colSpan={25} className="text-center py-4">No Data</td></tr>
        )}
      </tbody>
    );

  // ─── NORMAL (ACTIVE) TABLE ───────────────────────────────────────────────
  } else {
    return (
      <tbody className="text-sm">
        {loading ? (
          <tr><td colSpan={25} className="text-center py-6 text-gray-600">Veriler yükleniyor...</td></tr>
        ) : !tableData || tableData.length === 0 ? (
          <tr><td colSpan={25} className="text-center py-6 text-gray-500">No Data</td></tr>
        ) : (
          tableData.map((row, index) => (
            <React.Fragment key={row.id}>
              <tr className={`border-b h-16 min-h-16 align-middle border-gray-200 ${index % 2 === 0 ? "bg-white hover:bg-gray-200" : "bg-green-100 hover:bg-green-200"}`}>
                <td className="border border-gray-200 px-3 py-2 w-16 sticky left-[-1px] top-0 z-10 bg-white" rowSpan={1}>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">{row.no}</span>
                    <input type="checkbox" checked={selectedRows.has(row.id)} onChange={() => onCheckboxChange(row.id, tableData)} className="h-4 w-4 text-blue-600 rounded" />
                  </div>
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-16 sticky left-[-1px] top-0 z-10 bg-white -ml-px">
                  <SoftBadge value={row.no || ""} color="bg-slate-100 text-slate-700 border border-slate-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-32">
                  <SoftBadge value={row.title || ""} color="bg-rose-100 text-rose-700 border border-rose-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-32">
                  <SoftBadge value={row.raiseDate || ""} color="bg-blue-100 text-blue-700 border border-blue-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-24">
                  <SoftBadge value={row.resources?.toString() || ""} color="bg-violet-100 text-violet-700 border border-violet-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-28">
                  <SoftBadge value={row.relativeFunction?.value || ""} color="bg-amber-100 text-amber-700 border border-amber-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-28">
                  <SoftBadge value={row.responsible?.value || ""} color="bg-cyan-100 text-cyan-700 border border-cyan-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-24">
                  <SoftBadge value={row.deadline || ""} color="bg-teal-100 text-teal-700 border border-teal-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-36">
                  <SoftBadge value={row.confirmation?.value || ""} color="bg-indigo-100 text-indigo-700 border border-indigo-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-24">
                  <SoftBadge value={row.status?.value?.toString() || ""} color="bg-pink-100 text-pink-700 border border-pink-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-24">
                  <SoftBadge value={row.completionDate || ""} color="bg-orange-100 text-orange-700 border border-orange-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-32">
                  <SoftBadge value={row.verificationStatus?.value || ""} color="bg-lime-100 text-lime-700 border border-lime-200" />
                </td>
                <td className="border-b border-gray-200 px-2 py-1 w-40">
                  <SoftBadge value={row.comment || ""} color="bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200" />
                </td>
                {months.map((month) => {
                  const monthKey = month.toLowerCase();
                  return (
                    <td key={`${row.id}-${monthKey}`} className="border-b border-gray-200 px-2 py-1 w-24">
                      <SoftBadge value={row[monthKey]?.value || ""} color="bg-sky-100 text-sky-700 border border-sky-200" />
                    </td>
                  );
                })}
              </tr>
            </React.Fragment>
          ))
        )}
      </tbody>
    );
  }
};

export default EnvBody;