// MyTableBody.jsx (ayrı bir dosya olarak kaydedin)
import React from "react";
import { useState, useEffect } from "react";
import { hCheckboxChange } from "../profile.jsx";
const VenBody = ({
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
  setLoading(true);
  try {
    const token = document.cookie.split("; ").find((r) => r.startsWith("auth_token="))?.split("=").slice(1).join("=") ?? "";
    const response = await fetch(`/api/register/ven/all?status=archived&token=${token}`);
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
  setLoading(true);
  try {
    const token = document.cookie.split("; ").find((r) => r.startsWith("auth_token="))?.split("=").slice(1).join("=") ?? "";
    const response = await fetch(`/api/register/ven/all?status=deleted&token=${token}`);
    if (!response.ok) {
      throw new Error("Failed To Get Datas From Deleted DataBase");
    }
    const fetchedData = await response.json();
    setDeletedData(fetchedData || []);
    console.log("Arşiv verileri:", fetchedData);
  } catch (err) {
    console.error("Error While Fetching Deleted Datas:", err);
    setDeletedData([]);
  } finally {
    setLoading(false);
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
  setLoading(true);
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
    setDeletedActionData(fetchedData || []);
    console.log("Arşiv Action verileri:", fetchedData);
  } catch (err) {
    console.error("Error While Fetching Deleted Datas:", err);
    setDeletedActionData([]);
  } finally {
    setLoading(false);
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
  fetch(`/api/register/ven/all?token=${token}`)
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
const token = document.cookie.split("; ").find((r) => r.startsWith("auth_token="))?.split("=").slice(1).join("=") ?? "";
const url = `/api/register/component/action/all?registerId=${firstRowId}&status=active&token=${token}`;
console.log("URL:", url); // Debug: URL'yi konsola yazdır, registerId'yi kontrol et

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
                  className={`inline-block px-2 py-1 rounded-full text-sm font-medium shadow-sm ${color}`}
                >
                  {value}
                </span>
              ) : null;

  if (showDeleted) {
    return (
      <tbody className="text-sm">
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
                    className="border border-gray-200 px-3 py-2 w-16 sticky left-[-1px] top-0 z-10 bg-white"
                    rowSpan={1}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">
                        {row.no}
                      </span>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(row.id)}
                        onChange={() => onCheckboxChange(row.id, deletedData)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                    </div>
                  </td>

{/* Name */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge value={row.name} color="bg-rose-100 text-rose-700 border border-rose-200" />
</td>

{/* Reg Number */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge value={row.regNumber} color="bg-blue-100 text-blue-700 border border-blue-200" />
</td>

{/* Scope 1 */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge value={row.scope1?.value} color="bg-violet-100 text-violet-700 border border-violet-200" />
</td>

{/* Scope 2 */}
<td className="border border-gray-200 px-3 py-2 w-32" rowSpan={1}>
  <SoftBadge value={row.scope2?.value} color="bg-amber-100 text-amber-700 border border-amber-200" />
</td>

{/* Scope 3 */}
<td className="border border-gray-200 px-3 py-2 w-32" rowSpan={1}>
  <SoftBadge value={row.scope3?.value} color="bg-cyan-100 text-cyan-700 border border-cyan-200" />
</td>

{/* Registration Date */}
<td className="border border-gray-200 px-3 py-2 w-32" rowSpan={1}>
  <SoftBadge value={row.registrationDate} color="bg-teal-100 text-teal-700 border border-teal-200" />
</td>

{/* Next Review Date */}
<td className="border border-gray-200 px-3 py-2 w-28" rowSpan={1}>
  <SoftBadge value={row.nrd} color="bg-indigo-100 text-indigo-700 border border-indigo-200" />
</td>

{/* Days Difference */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  {(() => {
    if (!row.registrationDate || !row.nrd) return "";
    const diffInDays = Math.ceil((new Date(row.nrd) - new Date()) / (1000 * 60 * 60 * 24));
    return (
      <SoftBadge value={`${diffInDays} Days`} color="bg-sky-100 text-sky-700 border border-sky-200" />
    );
  })()}
</td>

{/* Valid Status */}
{/* <td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  {(() => {
    if (!row.registrationDate || !row.nrd) return "";
    const diffInDays = Math.ceil((new Date(row.nrd) - new Date(row.registrationDate)) / (1000 * 60 * 60 * 24));
    const isValid = diffInDays > 0;
    return (
      <SoftBadge
        value={isValid ? "Yes" : "No"}
        color={
          isValid
            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
            : "bg-rose-100 text-rose-700 border border-rose-200"
        }
      />
    );
  })()}
</td> */}

<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  {(() => {
    if (!row.nrd) return (
      <SoftBadge value="No" color="bg-orange-100 text-orange-700 border border-orange-200" />
    );
    const diffInDays = Math.ceil((new Date(row.nrd) - new Date()) / (1000 * 60 * 60 * 24));
    const isValid = diffInDays >= 0;
    return (
      <SoftBadge
        value={isValid ? "Yes" : "No"}
        color={
          isValid
            ? "bg-green-100 text-green-700 border border-green-200"
            : "bg-orange-100 text-orange-700 border border-orange-200"
        }
      />
    );
  })()}
</td>

{/* QGS */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge value={row.qgs} color="bg-orange-100 text-orange-700 border border-orange-200" />
</td>

{/* Communication */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge value={row.communication} color="bg-pink-100 text-pink-700 border border-pink-200" />
</td>

{/* OTD */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge value={row.otd} color="bg-lime-100 text-lime-700 border border-lime-200" />
</td>

{/* Documentation */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge value={row.documentation} color="bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200" />
</td>

{/* HS */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge value={row.hs} color="bg-yellow-100 text-yellow-700 border border-yellow-200" />
</td>

{/* Environment */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge value={row.environment} color="bg-green-100 text-green-700 border border-green-200" />
</td>

{/* Total Score */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge
    value={
      (
        (Number(row.qgs) || 0) +
        (Number(row.communication) || 0) +
        (Number(row.otd) || 0) +
        (Number(row.documentation) || 0) +
        (Number(row.hs) || 0) +
        (Number(row.environment) || 0)
      ) / 6
    }
    color="bg-slate-100 text-slate-700 border border-slate-200"
  />
</td>

{/* Comment */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge value={row.comment} color="bg-green-100 text-green-700 border border-green-200" />
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
      <tbody className="text-sm">
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
                    className="border border-gray-200 px-3 py-2 w-16 sticky left-[-1px] top-0 z-10 bg-white"
                    rowSpan={1}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">
                        {row.no}
                      </span>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(row.id)}
                        onChange={() => onCheckboxChange(row.id, archivedData)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                    </div>
                  </td>

                  {/* Name */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge value={row.name} color="bg-rose-100 text-rose-700 border border-rose-200" />
</td>

{/* Reg Number */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge value={row.regNumber} color="bg-blue-100 text-blue-700 border border-blue-200" />
</td>

{/* Scope 1 */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge value={row.scope1?.value} color="bg-violet-100 text-violet-700 border border-violet-200" />
</td>

{/* Scope 2 */}
<td className="border border-gray-200 px-3 py-2 w-32" rowSpan={1}>
  <SoftBadge value={row.scope2?.value} color="bg-amber-100 text-amber-700 border border-amber-200" />
</td>

{/* Scope 3 */}
<td className="border border-gray-200 px-3 py-2 w-32" rowSpan={1}>
  <SoftBadge value={row.scope3?.value} color="bg-cyan-100 text-cyan-700 border border-cyan-200" />
</td>

{/* Registration Date */}
<td className="border border-gray-200 px-3 py-2 w-32" rowSpan={1}>
  <SoftBadge value={row.registrationDate} color="bg-teal-100 text-teal-700 border border-teal-200" />
</td>

{/* Next Review Date */}
<td className="border border-gray-200 px-3 py-2 w-28" rowSpan={1}>
  <SoftBadge value={row.nrd} color="bg-indigo-100 text-indigo-700 border border-indigo-200" />
</td>

{/* Days Difference */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  {(() => {
    if (!row.registrationDate || !row.nrd) return "";
    const diffInDays = Math.ceil((new Date(row.nrd) - new Date()) / (1000 * 60 * 60 * 24));
    return (
      <SoftBadge value={`${diffInDays} Days`} color="bg-sky-100 text-sky-700 border border-sky-200" />
    );
  })()}
</td>

{/* Valid Status */}
{/* <td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  {(() => {
    if (!row.registrationDate || !row.nrd) return "";
    const diffInDays = Math.ceil((new Date(row.nrd) - new Date(row.registrationDate)) / (1000 * 60 * 60 * 24));
    const isValid = diffInDays > 0;
    return (
      <SoftBadge
        value={isValid ? "Yes" : "No"}
        color={
          isValid
            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
            : "bg-rose-100 text-rose-700 border border-rose-200"
        }
      />
    );
  })()}
</td> */}

<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  {(() => {
    if (!row.nrd) return (
      <SoftBadge value="No" color="bg-orange-100 text-orange-700 border border-orange-200" />
    );
    const diffInDays = Math.ceil((new Date(row.nrd) - new Date()) / (1000 * 60 * 60 * 24));
    const isValid = diffInDays >= 0;
    return (
      <SoftBadge
        value={isValid ? "Yes" : "No"}
        color={
          isValid
            ? "bg-green-100 text-green-700 border border-green-200"
            : "bg-orange-100 text-orange-700 border border-orange-200"
        }
      />
    );
  })()}
</td>

{/* QGS */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge value={row.qgs} color="bg-orange-100 text-orange-700 border border-orange-200" />
</td>

{/* Communication */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge value={row.communication} color="bg-pink-100 text-pink-700 border border-pink-200" />
</td>

{/* OTD */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge value={row.otd} color="bg-lime-100 text-lime-700 border border-lime-200" />
</td>

{/* Documentation */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge value={row.documentation} color="bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200" />
</td>

{/* HS */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge value={row.hs} color="bg-yellow-100 text-yellow-700 border border-yellow-200" />
</td>

{/* Environment */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge value={row.environment} color="bg-green-100 text-green-700 border border-green-200" />
</td>

{/* Total Score */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge
    value={
      (
        (Number(row.qgs) || 0) +
        (Number(row.communication) || 0) +
        (Number(row.otd) || 0) +
        (Number(row.documentation) || 0) +
        (Number(row.hs) || 0) +
        (Number(row.environment) || 0)
      ) / 6
    }
    color="bg-slate-100 text-slate-700 border border-slate-200"
  />
</td>

{/* Comment */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge value={row.comment} color="bg-green-100 text-green-700 border border-green-200" />
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
                <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
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
                  <td className="border-b border-gray-200 px-2 py-1 w-40">
                    <SoftBadge value={actionData?.[index]?.comment} />
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
                <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
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
                  <td className="border-b border-gray-200 px-2 py-1 w-40">
                    <SoftBadge value={deletedActionData?.[index]?.comment} />
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
      <tbody className="text-sm">
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
                    className="border border-gray-200 px-3 py-2 w-16 sticky left-[-1px] top-0 z-10 bg-white"
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

                 {/* Name */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge value={row.name} color="bg-rose-100 text-rose-700 border border-rose-200" />
</td>

{/* Reg Number */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge value={row.regNumber} color="bg-blue-100 text-blue-700 border border-blue-200" />
</td>

{/* Scope 1 */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge value={row.scope1?.value} color="bg-violet-100 text-violet-700 border border-violet-200" />
</td>

{/* Scope 2 */}
<td className="border border-gray-200 px-3 py-2 w-32" rowSpan={1}>
  <SoftBadge value={row.scope2?.value} color="bg-amber-100 text-amber-700 border border-amber-200" />
</td>

{/* Scope 3 */}
<td className="border border-gray-200 px-3 py-2 w-32" rowSpan={1}>
  <SoftBadge value={row.scope3?.value} color="bg-cyan-100 text-cyan-700 border border-cyan-200" />
</td>

{/* Registration Date */}
<td className="border border-gray-200 px-3 py-2 w-32" rowSpan={1}>
  <SoftBadge value={row.registrationDate} color="bg-teal-100 text-teal-700 border border-teal-200" />
</td>

{/* Next Review Date */}
<td className="border border-gray-200 px-3 py-2 w-28" rowSpan={1}>
  <SoftBadge value={row.nrd} color="bg-indigo-100 text-indigo-700 border border-indigo-200" />
</td>

{/* Days Difference */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  {(() => {
    if (!row.registrationDate || !row.nrd) return "";
    const diffInDays = Math.ceil((new Date(row.nrd) - new Date()) / (1000 * 60 * 60 * 24));
    return (
      <SoftBadge value={`${diffInDays} Days`} color="bg-sky-100 text-sky-700 border border-sky-200" />
    );
  })()}
</td>

<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  {(() => {
    if (!row.nrd) return (
      <SoftBadge value="No" color="bg-orange-100 text-orange-700 border border-orange-200" />
    );
    const diffInDays = Math.ceil((new Date(row.nrd) - new Date()) / (1000 * 60 * 60 * 24));
    const isValid = diffInDays >= 0;
    return (
      <SoftBadge
        value={isValid ? "Yes" : "No"}
        color={
          isValid
            ? "bg-green-100 text-green-700 border border-green-200"
            : "bg-orange-100 text-orange-700 border border-orange-200"
        }
      />
    );
  })()}
</td>

{/* QGS */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge value={row.qgs} color="bg-orange-100 text-orange-700 border border-orange-200" />
</td>

{/* Communication */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge value={row.communication} color="bg-pink-100 text-pink-700 border border-pink-200" />
</td>

{/* OTD */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge value={row.otd} color="bg-lime-100 text-lime-700 border border-lime-200" />
</td>

{/* Documentation */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge value={row.documentation} color="bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200" />
</td>

{/* HS */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge value={row.hs} color="bg-yellow-100 text-yellow-700 border border-yellow-200" />
</td>

{/* Environment */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge value={row.environment} color="bg-green-100 text-green-700 border border-green-200" />
</td>

{/* Total Score */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge
    value={
      (
        (Number(row.qgs) || 0) +
        (Number(row.communication) || 0) +
        (Number(row.otd) || 0) +
        (Number(row.documentation) || 0) +
        (Number(row.hs) || 0) +
        (Number(row.environment) || 0)
      ) / 6
    }
    color="bg-slate-100 text-slate-700 border border-slate-200"
  />
</td>

{/* Comment */}
<td className="border border-gray-200 px-3 py-2 w-20" rowSpan={1}>
  <SoftBadge value={row.comment} color="bg-green-100 text-green-700 border border-green-200" />
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

export default VenBody;
