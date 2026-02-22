// MyTableBody.jsx (ayrı bir dosya olarak kaydedin)
import React from "react";
import { useState, useEffect } from "react";
import { hCheckboxChange } from "../profile.jsx";

const EarBody = ({
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
      const response = await fetch("/api/register/ea/all?status=archived");
      if (!response.ok) {
        throw new Error("Failed To Get Datas From Archived DataBase");
      }
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

  const getDeletedData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/register/ea/all?status=deleted");
      if (!response.ok) {
        throw new Error("Failed To Get Datas From Deleted DataBase");
      }
      const fetchedData = await response.json();
      setDeletedData(fetchedData || []);
      console.log("Silinmiş veriler:", fetchedData);
    } catch (err) {
      console.error("Error While Fetching Deleted Datas:", err);
      setDeletedData([]);
    } finally {
      setLoading(false);
    }
  };

  const getDeletedActionData = async () => {
    setLoading(true);
    const selectedRowsArray = [...selectedRows];
    try {
      if (selectedRowsArray.length === 0) {
        console.error("Seçili satır yok!");
        setLoading(false);
        return;
      }
      const firstRowId = selectedRowsArray[0];
      const url = `/api/register/component/action/all?registerId=${firstRowId}&status=deleted`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed To Get Deleted Action Data");
      }
      const fetchedData = await response.json();
      setDeletedActionData(fetchedData || []);
      console.log("Silinmiş Action verileri:", fetchedData);
    } catch (err) {
      console.error("Error While Fetching Deleted Action Datas:", err);
      setDeletedActionData([]);
    } finally {
      setLoading(false);
    }
  };

  const getAll = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/register/ea/all");
      if (!response.ok) {
        throw new Error("Failed To Get Datas From Database");
      }
      const fetchedData = await response.json();
      setTableData(fetchedData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const getAllActions = async (selectedRows) => {
    setLoading(true);
    try {
      const selectedRowsArray = [...selectedRows];
      if (selectedRowsArray.length === 0) {
        console.error("Seçili satır yok!");
        setLoading(false);
        return;
      }
      const firstRowId = selectedRowsArray[0];
      const url = `/api/register/component/action/all?registerId=${firstRowId}&status=active`;
      console.log("Actions URL:", url);
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`Failed To Get Actions: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched actions:", data);
      setActionData(data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch hatası:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Refresh tetiklenince veri çek
  useEffect(() => {
    if (refresh) {
      if (!showArchived && !showDeleted && !showDeletedAction && activeHeader) {
        const timer = setTimeout(() => {
          getAll();
          setRefresh(false);
        }, 500);
        return () => clearTimeout(timer);
      } else if (showArchived) {
        const timer = setTimeout(() => {
          getArchivedData();
          setRefresh(false);
        }, 500);
        return () => clearTimeout(timer);
      } else if (showDeleted) {
        const timer = setTimeout(() => {
          getDeletedData();
          setRefresh(false);
        }, 500);
        return () => clearTimeout(timer);
      } else if (!activeHeader) {
        const timer = setTimeout(() => {
          getAllActions(selectedRows);
          setRefresh(false);
        }, 500);
        return () => clearTimeout(timer);
      } else if (!activeHeader && showDeletedAction) {
        const timer = setTimeout(() => {
          getDeletedActionData();
          setRefresh(false);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [refresh, showArchived, showDeleted, showDeletedAction, activeHeader, selectedRows]);

  // Show Archived değişince
  useEffect(() => {
    if (showArchived) getArchivedData();
    else setArchivedData([]);
  }, [showArchived]);

  // Show Deleted değişince
  useEffect(() => {
    if (showDeleted) getDeletedData();
    else setDeletedData([]);
  }, [showDeleted]);

  // Show Deleted Action değişince
  useEffect(() => {
    if (!activeHeader && showDeletedAction) getDeletedActionData();
    else setDeletedActionData([]);
  }, [showDeletedAction, activeHeader]);

  // Normal veri çekme
  useEffect(() => {
    if (!showArchived && !showDeleted && activeHeader) getAll();
  }, [showArchived, showDeleted, activeHeader]);

  // Action verilerini seçili satır değişince çek
  useEffect(() => {
    if (!activeHeader && selectedRows.size > 0) {
      getAllActions(selectedRows);
    }
  }, [activeHeader, selectedRows]);

  if (loading) {
    return (
      <tbody>
        <tr>
          <td colSpan={25} className="text-center py-6 text-gray-600">
            Veriler yükleniyor...
          </td>
        </tr>
      </tbody>
    );
  }

  if (error) {
    return (
      <tbody>
        <tr>
          <td colSpan={25} className="text-center py-6 text-red-600">
            Hata: {error}
          </td>
        </tr>
      </tbody>
    );
  }

  const SoftBadge = ({ value, color }) =>
    value ? (
      <span
        className={`inline-block px-2 py-1 rounded-full text-sm font-medium shadow-sm ${color || "bg-gray-100 text-gray-700"}`}
      >
        {value}
      </span>
    ) : null;

  // Deleted modu
  if (showDeleted) {
    return (
      <tbody className="text-sm">
        {deletedData?.length === 0 ? (
          <tr>
            <td colSpan={25} className="text-center py-4 text-gray-500">
              No Data
            </td>
          </tr>
        ) : (
          deletedData.map((row, index) => (
            <React.Fragment key={row.id}>
              <tr
                className={`border-b h-16 min-h-16 align-middle border-gray-200 ${
                  index % 2 === 0 ? "bg-white hover:bg-gray-200" : "bg-green-100 hover:bg-green-200"
                }`}
              >
                <td
                  className="border border-gray-200 px-2 py-1 w-16 sticky left-0 top-0 z-10 bg-white"
                  rowSpan={1}
                >
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{row.no}</span>
                    <input
                      checked={selectedRows.has(row.id)}
                      onChange={() => onCheckboxChange(row.id, deletedData)}
                      type="checkbox"
                      className="ml-2 h-4 w-4 text-blue-600"
                    />
                  </div>
                </td>
                <td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
                  <SoftBadge value={row.employeeName} color="bg-rose-100 text-rose-700 border border-rose-200" />
                </td>
                <td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
                  <SoftBadge value={row.position} color="bg-blue-100 text-blue-700 border border-blue-200" />
                </td>
                <td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
                  <SoftBadge value={row.lineManager} color="bg-violet-100 text-violet-700 border border-violet-200" />
                </td>
                <td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
                  <SoftBadge value={row.esd} color="bg-amber-100 text-amber-700 border border-amber-200" />
                </td>
                <td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
                  <SoftBadge value={row.appraisalDate} color="bg-cyan-100 text-cyan-700 border border-cyan-200" />
                </td>
                <td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
                  <SoftBadge value={row.appraisalType} color="bg-teal-100 text-teal-700 border border-teal-200" />
                </td>
                <td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
                  <SoftBadge value={row.tca} color="bg-indigo-100 text-indigo-700 border border-indigo-200" />
                </td>
                <td className="border border-gray-200 px-2 py-1 w-24" rowSpan={1}>
                  <SoftBadge value={row.skillsAppraisal} color="bg-pink-100 text-pink-700 border border-pink-200" />
                </td>
              </tr>
            </React.Fragment>
          ))
        )}
      </tbody>
    );
  }

  // Archived modu
  if (showArchived) {
    return (
      <tbody className="text-sm">
        {archivedData?.length === 0 ? (
          <tr>
            <td colSpan={25} className="text-center py-4 text-gray-500">
              No Data
            </td>
          </tr>
        ) : (
          archivedData.map((row, index) => (
            <React.Fragment key={row.id}>
              <tr
                className={`border-b h-16 min-h-16 align-middle border-gray-200 ${
                  index % 2 === 0 ? "bg-white hover:bg-gray-200" : "bg-green-100 hover:bg-green-200"
                }`}
              >
                <td
                  className="border border-gray-200 px-2 py-1 w-16 sticky left-0 top-0 z-10 bg-white"
                  rowSpan={1}
                >
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{row.no}</span>
                    <input
                      checked={selectedRows.has(row.id)}
                      onChange={() => onCheckboxChange(row.id, archivedData)}
                      type="checkbox"
                      className="ml-2 h-4 w-4 text-blue-600"
                    />
                  </div>
                </td>
                <td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
                  <SoftBadge value={row.employeeName} color="bg-rose-100 text-rose-700 border border-rose-200" />
                </td>
                <td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
                  <SoftBadge value={row.position} color="bg-blue-100 text-blue-700 border border-blue-200" />
                </td>
                <td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
                  <SoftBadge value={row.lineManager} color="bg-violet-100 text-violet-700 border border-violet-200" />
                </td>
                <td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
                  <SoftBadge value={row.esd} color="bg-amber-100 text-amber-700 border border-amber-200" />
                </td>
                <td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
                  <SoftBadge value={row.appraisalDate} color="bg-cyan-100 text-cyan-700 border border-cyan-200" />
                </td>
                <td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
                  <SoftBadge value={row.appraisalType} color="bg-teal-100 text-teal-700 border border-teal-200" />
                </td>
                <td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
                  <SoftBadge value={row.tca} color="bg-indigo-100 text-indigo-700 border border-indigo-200" />
                </td>
                <td className="border border-gray-200 px-2 py-1 w-24" rowSpan={1}>
                  <SoftBadge value={row.skillsAppraisal} color="bg-pink-100 text-pink-700 border border-pink-200" />
                </td>
              </tr>
            </React.Fragment>
          ))
        )}
      </tbody>
    );
  }

  // Action tablosu (normal / deleted action)
  if (!activeHeader) {
    const dataSource = showDeletedAction ? deletedActionData : actionData;

    return (
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={25} className="text-center py-4">
              Veriler yükleniyor...
            </td>
          </tr>
        ) : !dataSource || dataSource.length === 0 ? (
          <tr>
            <td colSpan={25} className="text-center py-4">
              No Data
            </td>
          </tr>
        ) : (
          dataSource.map((row, index) => {
            const numActions = row.actionPlan ? row.actionPlan.length : 1;

            return (
              <React.Fragment key={row.id}>
                <tr
                  className={`border-b h-16 min-h-16 align-middle border-gray-200 ${
                    index % 2 === 0 ? "bg-white hover:bg-gray-200" : "bg-green-100 hover:bg-green-200"
                  }`}
                >
                  <td
                    className="border-b border-gray-200 px-2 py-1 w-16 sticky left-[-1px] top-0 z-10 bg-white -ml-px"
                    rowSpan={numActions}
                  >
                    {selectedTable?.[0]?.no}
                    <input
                      checked={selectedRowsForActions.has(row.id)}
                      onChange={() =>
                        onCheckboxChangeForActions(row.id, dataSource)
                      }
                      type="checkbox"
                      className="ml-2"
                    />
                  </td>

                  <td className="border-b border-gray-200 px-2 py-1 w-32">
                    <SoftBadge value={row.title || ""} />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 w-32">
                    <SoftBadge value={row.raiseDate || ""} />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 w-24">
                    <SoftBadge value={row.resources?.toString() || ""} />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 w-28">
                    <SoftBadge value={row.relativeFunction?.value || ""} />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 w-28">
                    <SoftBadge value={row.responsible?.value || ""} />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 w-24">
                    <SoftBadge value={row.deadline || ""} />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 w-36">
                    <SoftBadge value={row.confirmation?.value || ""} />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 w-24">
                    <SoftBadge value={row.status?.value?.toString() || ""} />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 w-24">
                    <SoftBadge value={row.completionDate || ""} />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 w-32">
                    <SoftBadge value={row.verificationStatus?.value || ""} />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 w-40">
                    <SoftBadge value={row.comment || ""} />
                  </td>

                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((month) => (
                    <td
                      key={`${row.id}-${month}`}
                      className="border-b border-gray-200 px-2 py-1 w-24"
                    >
                      <SoftBadge
                        value={row[month.toLowerCase()]?.value || ""}
                      />
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            );
          })
        )}
      </tbody>
    );
  }

  // Normal (aktif) tablo
  return (
    <tbody className="text-sm">
      {loading ? (
        <tr>
          <td colSpan={25} className="text-center py-6 text-gray-600">
            Veriler yükleniyor...
          </td>
        </tr>
      ) : !tableData || tableData.length === 0 ? (
        <tr>
          <td colSpan={25} className="text-center py-6 text-gray-500">
            No Data
          </td>
        </tr>
      ) : (
        tableData.map((row, index) => (
          <React.Fragment key={row.id}>
            <tr
              className={`border-b h-16 min-h-16 align-middle border-gray-200 ${
                index % 2 === 0 ? "bg-white hover:bg-gray-200" : "bg-green-100 hover:bg-green-200"
              }`}
            >
              <td
                className="border border-gray-200 px-3 py-2 w-16 sticky left-[-1px] top-0 z-10 bg-white"
                rowSpan={1}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">{row.no}</span>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.id)}
                    onChange={() => onCheckboxChange(row.id, tableData)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                </div>
              </td>
              <td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
                <SoftBadge value={row.employeeName} color="bg-rose-100 text-rose-700 border border-rose-200" />
              </td>
              <td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
                <SoftBadge value={row.position} color="bg-blue-100 text-blue-700 border border-blue-200" />
              </td>
              <td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
                <SoftBadge value={row.lineManager} color="bg-violet-100 text-violet-700 border border-violet-200" />
              </td>
              <td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
                <SoftBadge value={row.esd} color="bg-amber-100 text-amber-700 border border-amber-200" />
              </td>
              <td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
                <SoftBadge value={row.appraisalDate} color="bg-cyan-100 text-cyan-700 border border-cyan-200" />
              </td>
              <td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
                <SoftBadge value={row.appraisalType} color="bg-teal-100 text-teal-700 border border-teal-200" />
              </td>
              <td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
                <SoftBadge value={row.tca} color="bg-indigo-100 text-indigo-700 border border-indigo-200" />
              </td>
              <td className="border border-gray-200 px-2 py-1 w-24" rowSpan={1}>
                <SoftBadge value={row.skillsAppraisal} color="bg-pink-100 text-pink-700 border border-pink-200" />
              </td>
            </tr>
          </React.Fragment>
        ))
      )}
    </tbody>
  );
};

export default EarBody;