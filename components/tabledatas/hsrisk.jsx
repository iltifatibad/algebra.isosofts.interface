// MyTableBody.jsx (ayrı bir dosya olarak kaydedin)
import React from "react";
import { useState, useEffect } from "react";
import { hCheckboxChange } from "../profile.jsx";
const HsBody = ({
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
  const getArchivedData = async () => {
    setLoading(true); // Loading başla
    try {
const token = document.cookie.split("; ").find((r) => r.startsWith("auth_token="))?.split("=").slice(1).join("=") ?? "";
const response = await fetch(`/api/register/hsr/all?status=archived&token=${token}`);
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

  useEffect(() => {
    if (refresh) {
      if (!showArchived & !showDeleted & !showDeletedAction & activeHeader) {
        const timer = setTimeout(() => {
          getAll();
          setRefresh(false);
        }, 500);

        return () => clearTimeout(timer); // cleanup
      } else if (showArchived) {
        const timer = setTimeout(() => {
          getArchivedData();
          setRefresh(false);
        }, 500);

        return () => clearTimeout(timer); // cleanup
      } else if (showDeleted) {
        const timer = setTimeout(() => {
          getDeletedData();
          setRefresh(false);
        }, 500);

        return () => clearTimeout(timer); // cleanup
      } else if (!activeHeader) {
        const timer = setTimeout(() => {
          getAllActions(selectedRows);
          setRefresh(false);
        }, 500);
        return () => clearTimeout(timer); // cleanup
      } else if ((activeHeader == false) & (showDeletedAction == true)) {
        const timer = setTimeout(() => {
          getDeletedActionData();
          console.log("HERE HERE HERE");
          setRefresh(false);
        }, 500);
        return () => clearTimeout(timer); // cleanup
      }
    }
  }, [refresh]);

  useEffect(() => {
    if (showArchived) {
      getArchivedData(); // Async çağrı
    } else {
      setArchivedData([]); // Normal moda geçince temizle (opsiyonel)
    }
  }, [showArchived]); // Dependency: showArchived değişince

  const getDeletedData = async () => {
    setLoading(true); // Loading başla
    try {
const token = document.cookie.split("; ").find((r) => r.startsWith("auth_token="))?.split("=").slice(1).join("=") ?? "";
const response = await fetch(`/api/register/hsr/all?status=deleted&token=${token}`);
      if (!response.ok) {
        throw new Error("Failed To Get Datas From Deleted DataBase");
      }
      const fetchedData = await response.json();
      setDeletedData(fetchedData || []); // Veri set et, fallback []
      console.log("Arşiv verileri:", fetchedData);
    } catch (err) {
      console.error("Error While Fetching Deleted Datas:", err);
      setDeletedData([]); // Hata durumunda boş array set et (null değil!)
    } finally {
      setLoading(false); // Loading bitir
    }
  };
  useEffect(() => {
    if (showDeleted) {
      getDeletedData(); // Async çağrı
    } else {
      setDeletedData([]); // Normal moda geçince temizle (opsiyonel)
    }
  }, [showDeleted]); // Dependency: showArchived değişince

  const getDeletedActionData = async () => {
    setLoading(true); // Loading başla
    const selectedRowsArray = [...selectedRows];
    try {
      const firstRowId = selectedRowsArray[0];
const token = document.cookie.split("; ").find((r) => r.startsWith("auth_token="))?.split("=").slice(1).join("=") ?? "";
const url = `/api/register/component/action/all?registerId=${firstRowId}&status=deleted&token=${token}`;
const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed To Get Datas From Deleted DataBase");
      }
      const fetchedData = await response.json();
      setDeletedActionData(fetchedData || []); // Veri set et, fallback []
      console.log("Arşiv Action verileri:", fetchedData);
    } catch (err) {
      console.error("Error While Fetching Deleted Datas:", err);
      setDeletedActionData([]); // Hata durumunda boş array set et (null değil!)
    } finally {
      setLoading(false); // Loading bitir
    }
  };
  useEffect(() => {
    if (!activeHeader && showDeletedAction) {
      getDeletedActionData(); // Async çağrı
    } else {
      setDeletedActionData([]); // Normal moda geçince temizle (opsiyonel)
    }
  }, [showDeletedAction]); // Dependency: showArchived değişince

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [tableData, setTableData] = useState([]);
const getAll = async () => {
  setLoading(true);
  const token = document.cookie.split("; ").find((r) => r.startsWith("auth_token="))?.split("=").slice(1).join("=") ?? "";
  fetch(`/api/register/hsr/all?token=${token}`)
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

  const getAllActions = async (selectedRows) => {
    setLoading(true);
    getDeletedActionData();
    // Set'i Array'e çevir (bu kritik kısım!)
    const selectedRowsArray = [...selectedRows];

    if (selectedRowsArray.length === 0) {
      console.error("Seçili satır yok!"); // Hata kontrolü
      setLoading(false);
      return; // Erken çık
    }

    const firstRowId = selectedRowsArray[0]; // Artık ID'yi alabilirsin: "I234884J501LA657g6S20N2Nc2V71p"
 // 1️⃣ Cookie’den auth_token al
const token = document.cookie
  .split("; ")
  .find(c => c.startsWith("auth_token="))
  ?.split("=")[1] || "";

// 2️⃣ Mevcut URL
let url = `/api/register/component/action/all?registerId=${firstRowId}&status=active`;

// 3️⃣ Token’ı ekle
url += `&token=${encodeURIComponent(token)}`;

console.log(url);

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log("AAA", selectedRows); // Bu zaten Set'i gösteriyor
        if (!response.ok) {
          throw new Error(
            `Failed To Get Actions: ${response.status} - ${response.statusText}`,
          );
        }
        return response.json();
      })
      .then((data) => {
        // Başarılı veriyi işle, örneğin setActions(data);
        console.log("Fetched data:", data); // Debug için ekle
        setActionData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch hatası:", err); // Hata detayını logla
        setError(err.message);
        setLoading(false);
      });
  };

    const getRiskLevel = (severity, likelihood) => {
  const score = Number(severity) * Number(likelihood);

  if (score >= 1 && score <= 6) {
    return {
      label: "Low",
      color: "bg-gray-100 text-black border border-gray-200",
    };
  }

  if (score >= 8 && score <= 10) {
    return {
      label: "Medium",
      color: "bg-gray-100 text-black border border-gray-200",
    };
  }

  if (score >= 12 && score <= 25) {
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

  useEffect(() => {
    if (!activeHeader && selectedRows.size > 0) {
      // selectedRows.size ile Set'in boş olup olmadığını kontrol et
      getAllActions(selectedRows);
      console.log("Function Running");
    }
  }, [activeHeader, selectedRows]); // Dependency array ekle: selectedRows değişirse tekrar çalışsın
  if (loading) return;
  if (error) return;
  const SoftBadge = ({ value, color }) =>
    value ? (
      <span
        className={`inline-block px-1.5 py-0.5 rounded-full text-xs font-medium shadow-sm ${color}`}
      >
        {value}
      </span>
    ) : null;

  if (showDeleted) {
    return (
      <tbody className="text-xs">
        {loading ? (
          <tr>
            <td colSpan={25} className="text-center py-4 text-gray-600">
              Deleted verileri yükleniyor...
            </td>
          </tr>
        ) : !deletedData || deletedData.length === 0 ? (
          <tr>
            <td colSpan={25} className="text-center py-4 text-gray-500">
              No Data
            </td>
          </tr>
        ) : (
          deletedData.map((row, index) => {
            const numActions = row.actionPlan ? row.actionPlan.length : 1;
            const actions = Array.isArray(row.actionPlan)
              ? row.actionPlan
              : [row.actionPlan];

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
                {/* Ana row */}
                <tr
                  className={`border-b h-16 min-h-16 align-middle border-gray-200 ${
                    index % 2 === 0
                      ? "bg-white hover:bg-gray-200"
                      : "bg-green-100 hover:bg-green-200"
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

                  {/* Process */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.process?.value} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Hazard */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.hazard?.value} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Risk */}
<td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
  <SoftBadge value={row.risk?.value} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Affected Positions */}
<td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
  <SoftBadge value={row.affectedPositions?.value} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* ecm */}
<td className="border border-gray-200 px-2 py-1 w-48" rowSpan={1}>
  <SoftBadge value={row.ecm || `${row.ecm}`} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Initial Risk Severity */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.initialRiskSeverity} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Initial Risk Likelihood */}
<td className="border border-gray-200 px-2 py-1 w-24" rowSpan={1}>
  <SoftBadge value={row.initialRiskLikelihood} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Initial Risk Level */}
<td className="border border-gray-200 px-2 py-1 w-20">
  {(() => {
    const risk = getRiskLevel(row.initialRiskSeverity, row.initialRiskLikelihood);
    return <SoftBadge value={risk.label} color={risk.color} />;
  })()}
</td>

{/* ACM */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.acm} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Residual Risk Severity */}
<td className="border border-gray-200 px-2 py-1 w-24" rowSpan={1}>
  <SoftBadge value={row.residualRiskSeverity} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Residual Risk Likelihood */}
<td className="border border-gray-200 px-2 py-1 w-24" rowSpan={1}>
  <SoftBadge value={row.residualRiskLikelihood} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Residual Risk Level */}
<td className="border border-gray-200 px-2 py-1 w-20">
  {(() => {
    const risk = getRiskLevel(row.residualRiskSeverity, row.residualRiskLikelihood);
    return <SoftBadge value={risk.label} color={risk.color} />;
  })()}
</td>

{/* Comment */}
<td className="border border-gray-200 px-2 py-1 min-w-[200px] max-w-[280px] align-top" rowSpan={1}>
  {row.comment && <p className="text-xs leading-relaxed bg-gray-100 text-black border border-gray-200 rounded-md px-2 py-1 whitespace-normal break-words">{row.comment}</p>}
</td>
                </tr>

                {/* Ek Actions */}
              </React.Fragment>
            );
          })
        )}
      </tbody>
    );
  } else if (showArchived) {
    return (
      <tbody className="text-xs">
        {loading ? (
          <tr>
            <td colSpan={25} className="text-center py-4 text-gray-600">
              Arşiv verileri yükleniyor...
            </td>
          </tr>
        ) : !archivedData || archivedData.length === 0 ? (
          <tr>
            <td colSpan={25} className="text-center py-4 text-gray-500">
              No Data
            </td>
          </tr>
        ) : (
          archivedData.map((row, index) => {
            const numActions = row.actionPlan ? row.actionPlan.length : 1;
            const actions = Array.isArray(row.actionPlan)
              ? row.actionPlan
              : [row.actionPlan];

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
                {/* Ana row */}
                <tr
                  className={`border-b h-16 min-h-16 align-middle border-gray-200 ${
                    index % 2 === 0
                      ? "bg-white hover:bg-gray-200"
                      : "bg-green-100 hover:bg-green-200"
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

                  {/* Process */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.process?.value} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Hazard */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.hazard?.value} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Risk */}
<td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
  <SoftBadge value={row.risk?.value} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Affected Positions */}
<td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
  <SoftBadge value={row.affectedPositions?.value} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* ecm */}
<td className="border border-gray-200 px-2 py-1 w-48" rowSpan={1}>
  <SoftBadge value={row.ecm} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Initial Risk Severity */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.initialRiskSeverity} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Initial Risk Likelihood */}
<td className="border border-gray-200 px-2 py-1 w-24" rowSpan={1}>
  <SoftBadge value={row.initialRiskLikelihood} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Initial Risk Level */}
<td className="border border-gray-200 px-2 py-1 w-20">
  {(() => {
    const risk = getRiskLevel(row.initialRiskSeverity, row.initialRiskLikelihood);
    return <SoftBadge value={risk.label} color={risk.color} />;
  })()}
</td>

{/* ACM */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.acm} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Residual Risk Severity */}
<td className="border border-gray-200 px-2 py-1 w-24" rowSpan={1}>
  <SoftBadge value={row.residualRiskSeverity} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Residual Risk Likelihood */}
<td className="border border-gray-200 px-2 py-1 w-24" rowSpan={1}>
  <SoftBadge value={row.residualRiskLikelihood} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Residual Risk Level */}
<td className="border border-gray-200 px-2 py-1 w-20">
  {(() => {
    const risk = getRiskLevel(row.residualRiskSeverity, row.residualRiskLikelihood);
    return <SoftBadge value={risk.label} color={risk.color} />;
  })()}
</td>

{/* Comment */}
<td className="border border-gray-200 px-2 py-1 min-w-[200px] max-w-[280px] align-top" rowSpan={1}>
  {row.comment && <p className="text-xs leading-relaxed bg-gray-100 text-black border border-gray-200 rounded-md px-2 py-1 whitespace-normal break-words">{row.comment}</p>}
</td>
                </tr>

                {/* Ek Actions */}
              </React.Fragment>
            );
          })
        )}
      </tbody>
    );
  } else if (!activeHeader && showDeletedAction === false) {
    return (
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={25} className="text-center py-4">
              Deleted verileri yükleniyor...
            </td>
          </tr>
        ) : selectedTable && actionData && selectedTable.length > 0 ? (
          actionData.map((row, index) => {
            const numActions = row.actionPlan ? row.actionPlan.length : 1;

            // Soft badge
            const SoftBadge = ({ value }) =>
              value ? (
                <span className="px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
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
                  {/* # column */}
                  <td
                    className="border-b border-gray-200 px-2 py-1 w-16 sticky left-[-1px] top-0 z-10 bg-white -ml-px"
                    rowSpan={numActions}
                  >
                    {actionData?.[index]?.no}
                    <input
                      checked={selectedRowsForActions.has(actionData[index].id)}
                      onChange={() =>
                        onCheckboxChangeForActions(
                          actionData[index].id,
                          actionData,
                        )
                      }
                      type="checkbox"
                      className="ml-2"
                    />
                  </td>
                  {/* FIRST ACTION PLAN FIELDS */}
                  <td className="border-b border-gray-200 px-2 py-1 w-32">
                    <SoftBadge value={actionData?.[index]?.title} />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 w-32">
                    <SoftBadge value={actionData?.[index]?.raiseDate} />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 w-24">
                    <SoftBadge
                      value={actionData?.[index]?.resources?.toString() || ""}
                    />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 w-28">
                    <SoftBadge
                      value={actionData?.[index]?.relativeFunction?.value}
                    />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 w-28">
                    <SoftBadge
                      value={actionData?.[index]?.responsible?.value}
                    />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 w-24">
                    <SoftBadge value={actionData?.[index]?.deadline} />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 w-36">
                    <SoftBadge
                      value={actionData?.[index]?.confirmation?.value}
                    />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 w-24">
                    <SoftBadge
                      value={actionData?.[index]?.status?.value?.toString()}
                    />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 w-24">
                    <SoftBadge value={actionData?.[index]?.completionDate} />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 w-32">
                    <SoftBadge
                      value={actionData?.[index]?.verificationStatus?.value}
                    />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 min-w-[200px] max-w-[280px] align-top">
                    {actionData?.[index]?.comment && <p className="text-xs leading-relaxed bg-gray-100 text-black rounded-md px-2 py-1 whitespace-normal break-words">{actionData?.[index]?.comment}</p>}
                  </td>
                  {/* MONITORING MONTH COLUMNS */}
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
                      key={`${actionData?.[index]?.id}-${month}`}
                      className="border-b border-gray-200 px-2 py-1 w-24"
                    >
                      {/* Assuming monitoring data is stored in actionData[index].monitoring[month] or similar; adjust as needed */}
                      <SoftBadge
                        value={
                          actionData?.[index]?.[month.toLowerCase()]?.value ||
                          ""
                        }
                      />
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            );
          })
        ) : (
          <tr>
            <td colSpan={25} className="text-center py-4">
              No Data
            </td>
          </tr>
        )}
      </tbody>
    );
  } else if (!activeHeader && showDeletedAction === true) {
    return (
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={25} className="text-center py-4">
              Deleted verileri yükleniyor...
            </td>
          </tr>
        ) : selectedTable && deletedActionData && selectedTable.length > 0 ? (
          deletedActionData.map((row, index) => {
            const numActions = row.actionPlan ? row.actionPlan.length : 1;
            console.log("WORKINGGGGG !!!");
            // Soft badge
            const SoftBadge = ({ value }) =>
              value ? (
                <span className="px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
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
                  {/* # column */}
                  <td
                    className="border-b border-gray-200 px-2 py-1 w-16 sticky left-[-1px] top-0 z-10 bg-white -ml-px"
                    rowSpan={numActions}
                  >
                    {deletedActionData?.[index]?.no}
                    <input
                      checked={selectedRowsForActions.has(
                        deletedActionData[index].id,
                      )}
                      onChange={() =>
                        onCheckboxChangeForActions(
                          deletedActionData[index].id,
                          deletedActionData,
                        )
                      }
                      type="checkbox"
                      className="ml-2"
                    />
                  </td>
                  {/* FIRST ACTION PLAN FIELDS */}
                  <td className="border-b border-gray-200 px-2 py-1 w-32">
                    <SoftBadge value={deletedActionData?.[index]?.title} />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 w-32">
                    <SoftBadge value={deletedActionData?.[index]?.raiseDate} />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 w-24">
                    <SoftBadge
                      value={
                        deletedActionData?.[index]?.resources?.toString() || ""
                      }
                    />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 w-28">
                    <SoftBadge
                      value={
                        deletedActionData?.[index]?.relativeFunction?.value
                      }
                    />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 w-28">
                    <SoftBadge
                      value={deletedActionData?.[index]?.responsible?.value}
                    />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 w-24">
                    <SoftBadge value={deletedActionData?.[index]?.deadline} />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 w-36">
                    <SoftBadge
                      value={deletedActionData?.[index]?.confirmation?.value}
                    />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 w-24">
                    <SoftBadge
                      value={deletedActionData?.[
                        index
                      ]?.status?.value?.toString()}
                    />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 w-24">
                    <SoftBadge
                      value={deletedActionData?.[index]?.completionDate}
                    />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 w-32">
                    <SoftBadge
                      value={
                        deletedActionData?.[index]?.verificationStatus?.value
                      }
                    />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 min-w-[200px] max-w-[280px] align-top">
                    {deletedActionData?.[index]?.comment && <p className="text-xs leading-relaxed bg-gray-100 text-black rounded-md px-2 py-1 whitespace-normal break-words">{deletedActionData?.[index]?.comment}</p>}
                  </td>
                  {/* MONITORING MONTH COLUMNS */}
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
                      key={`$deletedActionData?.[index]?.id}-${month}`}
                      className="border-b border-gray-200 px-2 py-1 w-24"
                    >
                      {/* Assuming monitoring data is stored indeletedActionData[index].monitoring[month] or similar; adjust as needed */}
                      <SoftBadge
                        value={
                          deletedActionData?.[index]?.[month.toLowerCase()]
                            ?.value || ""
                        }
                      />
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            );
          })
        ) : (
          <tr>
            <td colSpan={25} className="text-center py-4">
              No Data
            </td>
          </tr>
        )}
      </tbody>
    );
  } else {
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
                  {/* Process */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.process?.value} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Hazard */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.hazard?.value} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Risk */}
<td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
  <SoftBadge value={row.risk?.value} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Affected Positions */}
<td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
  <SoftBadge value={row.affectedPositions?.value} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* ecm */}
<td className="border border-gray-200 px-2 py-1 w-48" rowSpan={1}>
  <SoftBadge value={row.ecm || `${row.ecm}`} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Initial Risk Severity */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.initialRiskSeverity} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Initial Risk Likelihood */}
<td className="border border-gray-200 px-2 py-1 w-24" rowSpan={1}>
  <SoftBadge value={row.initialRiskLikelihood} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Initial Risk Level */}
<td className="border border-gray-200 px-2 py-1 w-20">
  {(() => {
    const risk = getRiskLevel(row.initialRiskSeverity, row.initialRiskLikelihood);
    return <SoftBadge value={risk.label} color={risk.color} />;
  })()}
</td>

{/* ACM */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.acm} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Residual Risk Severity */}
<td className="border border-gray-200 px-2 py-1 w-24" rowSpan={1}>
  <SoftBadge value={row.residualRiskSeverity} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Residual Risk Likelihood */}
<td className="border border-gray-200 px-2 py-1 w-24" rowSpan={1}>
  <SoftBadge value={row.residualRiskLikelihood} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Residual Risk Level */}
<td className="border border-gray-200 px-2 py-1 w-20">
  {(() => {
    const risk = getRiskLevel(row.residualRiskSeverity, row.residualRiskLikelihood);
    return <SoftBadge value={risk.label} color={risk.color} />;
  })()}
</td>

{/* Comment */}
<td className="border border-gray-200 px-2 py-1 min-w-[200px] max-w-[280px] align-top" rowSpan={1}>
  {row.comment && <p className="text-xs leading-relaxed bg-gray-100 text-black border border-gray-200 rounded-md px-2 py-1 whitespace-normal break-words">{row.comment}</p>}
</td>
                </tr>
              </React.Fragment>
            );
          })
        )}
      </tbody>
    );
  }
};

export default HsBody;
