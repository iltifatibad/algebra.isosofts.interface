// MyTableBody.jsx (ayrı bir dosya olarak kaydedin)
import React from "react";
import { useState, useEffect } from "react";
import { hCheckboxChange } from "../profile.jsx";
const FbBody = ({
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
    const response = await fetch(`/api/register/fb/all?status=archived&token=${token}`);
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
const response = await fetch(`/api/register/fb/all?status=deleted&token=${token}`);
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
  setLoading(true);
  const selectedRowsArray = [...selectedRowsForActions];
  try {
    const firstRowId = selectedRowsArray[0];
    const token = document.cookie.split("; ").find((r) => r.startsWith("auth_token="))?.split("=").slice(1).join("=") ?? "";
    const url = `/api/register/component/vendorFeedback/all?registerId=${firstRowId}&status=deleted&token=${token}`;
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
  // ── Filters ────────────────────────────────────────────────────────────
  const [filters, setFilters] = useState({});

  const applyFilters = (data) => {
    if (!data?.length) return data || [];
    const active = Object.entries(filters).filter(([, v]) => v?.trim());
    if (!active.length) return data;
    return data.filter(row =>
      active.every(([key, val]) => {
        const parts = key.replace(/\?/g, "").split(".");
        let v = row;
        for (const p of parts) v = v?.[p];
        return String(v ?? "").toLowerCase().includes(val.toLowerCase());
      })
    );
  };

  const filteredData         = applyFilters(tableData);
  const filteredArchivedData = applyFilters(archivedData);
  const filteredDeletedData  = applyFilters(deletedData);
  // ────────────────────────────────────────────────────────────────────────


  const [tableData, setTableData] = useState([]);
  
const getAll = async () => {
  setLoading(true);
  const token = document.cookie.split("; ").find((r) => r.startsWith("auth_token="))?.split("=").slice(1).join("=") ?? "";
  fetch(`/api/register/fb/all?token=${token}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed To Get Datas From Database");
      }
      return response.json();
    })
    .then(async (fetchedData) => {
      console.log("FETCHEDDDDD", fetchedData);
      const updatedData = await Promise.all(
        fetchedData.map(async (item) => {
          if (item.customerId) {
            try {
              const res = await fetch(`/api/register/cus/one/${item.customerId}?token=${token}`);
              if (!res.ok) throw new Error("Customer fetch failed");
              const customer = await res.json();
              return {
                ...item,
                customerName: customer.Name || customer.name || item.customerId,
              };
            } catch (err) {
              console.error(err);
              return { ...item, customerName: item.customerId };
            }
          }
          return { ...item, customerName: "" };
        }),
      );
      setTableData(updatedData);
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
const url = `/api/register/component/vendorFeedback/all?registerId=${firstRowId}&status=active&token=${token}`;
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
      .then(async (data) => {
        // Başarılı veriyi işle, örneğin setActions(data);
        console.log("Fetched data:", data); // Debug için ekle

        const updatedData = await Promise.all(
data.map(async (item) => {
  const token = document.cookie.split("; ").find((r) => r.startsWith("auth_token="))?.split("=").slice(1).join("=") ?? "";
  if (item.vendorId) {
    try {
      const res = await fetch(`/api/register/ven/one/${item.vendorId}?token=${token}`);
      if (!res.ok) throw new Error(" Vendor Fetch Failed ");
      const vendor = await res.json();
      return {
        ...item,
        vendorName: vendor.Name || vendor.name || item.vendorId,
      };
    } catch (err) {
      console.log(err);
      return { ...item, vendorName: item.vendorId };
    }
  }
  return { ...item, vendorName: "" };
})
        )
        console.log(" COSGUNNNNN  "+ updatedData.vendorId);
        setActionData(updatedData);
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
                  className={`inline-block px-1.5 py-0.5 rounded-full text-xs font-medium shadow-sm ${color}`}
                >
                  {value}
                </span>
              ) : null;

  if (showDeleted) {
    return (
      <tbody className="text-xs">
            {/* ── Filter Row ── */}
            <tr className="bg-gray-50 border-b-2 border-blue-200">
              <td className="border border-gray-200 px-1 py-1 sticky left-[-1px] z-10 bg-gray-50">
                <button
                  onClick={() => setFilters({})}
                  className="text-[10px] bg-blue-500 text-white rounded px-1.5 py-0.5 hover:bg-blue-600 whitespace-nowrap"
                  title="Filtreleri Temizle"
                >✕ Clear</button>
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["jobNumber"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "jobNumber": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["jobStartDate"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "jobStartDate": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["jobCompletionDate"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "jobCompletionDate": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["scope?.value"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "scope?.value": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["customerName"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "customerName": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["typeOfFinding?.value"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "typeOfFinding?.value": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["qgs"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "qgs": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["communication"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "communication": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["otd"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "otd": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["documentation"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "documentation": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["hs"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "hs": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["environment"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "environment": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["comment"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "comment": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
            </tr>

        {loading ? (
          <tr>
            <td colSpan={25} className="text-center py-4 text-gray-600">
              Deleted verileri yükleniyor...
            </td>
          </tr>
        ) : !filteredDeletedData || filteredDeletedData.length === 0 ? (
          <tr>
            <td colSpan={25} className="text-center py-4 text-gray-500">
              No Data
            </td>
          </tr>
        ) : (
          filteredDeletedData.map((row, index) => {
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
                        onChange={() => onCheckboxChange(row.id, deletedData)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                    </div>
                  </td>

                  {/* <td
                    className="border border-gray-200 px-2 py-1 w-20"
                    rowSpan={1}
                  >
                    {row.name && (
                      <span className="inline-block px-3 py-1 bg-gray-100 text-black border border-gray-200 rounded-full shadow-sm">
                        {row.name}
                      </span>
                    )}
                  </td> */}

                 {/* Job Number */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.jobNumber} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Job Start Date */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.jobStartDate} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Job Completion Date */}
<td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
  <SoftBadge value={row.jobCompletionDate} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Scope */}
<td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
  <SoftBadge value={row.scope?.value} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Name Of Customer */}
<td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
  <SoftBadge value={row.customerName} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Type Of Finding */}
<td className="border border-gray-200 px-2 py-1 w-28" rowSpan={1}>
  <SoftBadge value={row.typeOfFinding?.value} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Quality Of Services */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.qgs} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Communication */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.communication} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* On Time Delivery */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.otd} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Documentation */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.documentation} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Health And Safety */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.hs} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Environment */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.environment} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Total Score */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge
value={
  (
    (Number(row.qgs) || 0) +
    (Number(row.communication) || 0) +
    (Number(row.otd) || 0) +
    (Number(row.documentation) || 0) +
    (Number(row.hs) || 0) +
    (Number(row.environment) || 0)
  )
}
    color="bg-gray-100 text-black border border-gray-200"
  />
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
            {/* ── Filter Row ── */}
            <tr className="bg-gray-50 border-b-2 border-blue-200">
              <td className="border border-gray-200 px-1 py-1 sticky left-[-1px] z-10 bg-gray-50">
                <button
                  onClick={() => setFilters({})}
                  className="text-[10px] bg-blue-500 text-white rounded px-1.5 py-0.5 hover:bg-blue-600 whitespace-nowrap"
                  title="Filtreleri Temizle"
                >✕ Clear</button>
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["jobNumber"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "jobNumber": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["jobStartDate"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "jobStartDate": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["jobCompletionDate"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "jobCompletionDate": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["scope?.value"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "scope?.value": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["customerName"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "customerName": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["typeOfFinding?.value"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "typeOfFinding?.value": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["qgs"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "qgs": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["communication"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "communication": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["otd"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "otd": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["documentation"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "documentation": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["hs"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "hs": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["environment"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "environment": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["comment"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "comment": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
            </tr>

        {loading ? (
          <tr>
            <td colSpan={25} className="text-center py-4 text-gray-600">
              Arşiv verileri yükleniyor...
            </td>
          </tr>
        ) : !filteredArchivedData || filteredArchivedData.length === 0 ? (
          <tr>
            <td colSpan={25} className="text-center py-4 text-gray-500">
              No Data
            </td>
          </tr>
        ) : (
          filteredArchivedData.map((row, index) => {
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
                        onChange={() => onCheckboxChange(row.id, archivedData)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                    </div>
                  </td>

                  {/* <td
                    className="border border-gray-200 px-2 py-1 w-20"
                    rowSpan={1}
                  >
                    {row.name && (
                      <span className="inline-block px-3 py-1 bg-gray-100 text-black border border-gray-200 rounded-full shadow-sm">
                        {row.name}
                      </span>
                    )}
                  </td> */}

                  {/* Job Number */}
                 {/* Job Number */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.jobNumber} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Job Start Date */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.jobStartDate} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Job Completion Date */}
<td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
  <SoftBadge value={row.jobCompletionDate} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Scope */}
<td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
  <SoftBadge value={row.scope?.value} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Name Of Customer */}
<td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
  <SoftBadge value={row.customerName} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Type Of Finding */}
<td className="border border-gray-200 px-2 py-1 w-28" rowSpan={1}>
  <SoftBadge value={row.typeOfFinding?.value} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Quality Of Services */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.qgs} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Communication */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.communication} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* On Time Delivery */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.otd} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Documentation */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.documentation} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Health And Safety */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.hs} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Environment */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.environment} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Total Score */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge
value={
  (
    (Number(row.qgs) || 0) +
    (Number(row.communication) || 0) +
    (Number(row.otd) || 0) +
    (Number(row.documentation) || 0) +
    (Number(row.hs) || 0) +
    (Number(row.environment) || 0)
  )
}
    color="bg-gray-100 text-black border border-gray-200"
  />
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
      <tbody className="text-xs">
            {/* ── Filter Row ── */}
            <tr className="bg-gray-50 border-b-2 border-blue-200">
              <td className="border border-gray-200 px-1 py-1 sticky left-[-1px] z-10 bg-gray-50">
                <button
                  onClick={() => setFilters({})}
                  className="text-[10px] bg-blue-500 text-white rounded px-1.5 py-0.5 hover:bg-blue-600 whitespace-nowrap"
                  title="Filtreleri Temizle"
                >✕ Clear</button>
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["jobNumber"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "jobNumber": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["jobStartDate"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "jobStartDate": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["jobCompletionDate"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "jobCompletionDate": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["scope?.value"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "scope?.value": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["customerName"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "customerName": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["typeOfFinding?.value"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "typeOfFinding?.value": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["qgs"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "qgs": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["communication"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "communication": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["otd"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "otd": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["documentation"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "documentation": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["hs"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "hs": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["environment"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "environment": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["comment"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "comment": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
            </tr>

        {loading ? (
          <tr>
            <td colSpan={25} className="text-center py-6 text-gray-600">
              Arşiv verileri yükleniyor...
            </td>
          </tr>
        ) : !actionData || actionData.length === 0 ? (
          <tr>
            <td colSpan={25} className="text-center py-6 text-gray-500">
              No Data
            </td>
          </tr>
        ) : (
          actionData.map((row, index) => {
            console.log(" ACTION DATA UPDATED CHECK" + actionData);
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
                    className="border border-gray-200 px-2 py-1 w-16 sticky left-[-1px] top-0 z-10 bg-white"
                    rowSpan={1}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">
                        {row.no}
                      </span>
                      <input
                        type="checkbox"
                        checked={selectedRowsForActions.has(row.id)}
                        onChange={() =>
                          onCheckboxChangeForActions(row.id, actionData)
                        }
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                    </div>
                  </td>

                  <td
                    className="border border-gray-200 px-2 py-1 w-20"
                    rowSpan={1}
                  >
                    {row.scope && (
                      <span className="inline-block px-3 py-1 bg-gray-100 text-black border border-gray-200 rounded-full shadow-sm">
                        {row.scope?.value}
                      </span>
                    )}
                  </td>

                  {/* Scope */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-32"
                    rowSpan={1}
                  >
                    {row.vendorName && (
                      <span className="inline-block px-3 py-1 bg-gray-100 text-black border border-gray-200 rounded-full shadow-sm">
                        {row.vendorName}
                      </span>
                    )}
                  </td>

                  {/* Name Of Customer */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-32"
                    rowSpan={1}
                  >
                    {row.typeOfFinding && (
                      <span className="inline-block px-3 py-1 bg-gray-100 text-black border border-gray-200 rounded-full shadow-sm">
                        {row.typeOfFinding?.value}
                      </span>
                    )}
                  </td>

                  {/* Type Of Finding */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-28"
                    rowSpan={1}
                  >
                    {row.qgs}
                  </td>

                  {/* Quality Of Services */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-20"
                    rowSpan={1}
                  >
                    {row.communication}
                  </td>

                  {/* Communication */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-20"
                    rowSpan={1}
                  >
                    {row.otd}
                  </td>

                  {/* On Time Delivery */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-20"
                    rowSpan={1}
                  >
                    {row.documentation}
                  </td>

                  {/* Documentation */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-20"
                    rowSpan={1}
                  >
                    {row.hs}
                  </td>

                  {/* Health And Safety */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-20"
                    rowSpan={1}
                  >
                    {row.environment}
                  </td>

                  <td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
                    {(() => {
                      const values = [row.qgs, row.communication, row.otd, row.documentation, row.hs, row.environment];
                      const valid = values.filter(v => v !== null && v !== undefined && v !== "");
                      if (valid.length === 0) return "";
                      const avg = (valid.reduce((sum, v) => sum + Number(v), 0));
                      return (
                        <SoftBadge
                          value={avg}
                          color={
                            avg >= 4 ? "bg-gray-100 text-black border border-gray-200" :
                            avg >= 2.5 ? "bg-gray-100 text-black border border-gray-200" :
                                        "bg-gray-100 text-black border border-gray-200"
                          }
                        />
                      );
                    })()}
                  </td>

                  {/* Environment
                  <td
                    className="border border-gray-200 px-2 py-1 w-20"
                    rowSpan={1}
                  >
                    {row.actual?.value}
                  </td> */}
                </tr>
              </React.Fragment>
            );
          })
        )}
      </tbody>
    );
  } else if (!activeHeader && showDeletedAction === true) {
    return (
      <tbody className="text-xs">
            {/* ── Filter Row ── */}
            <tr className="bg-gray-50 border-b-2 border-blue-200">
              <td className="border border-gray-200 px-1 py-1 sticky left-[-1px] z-10 bg-gray-50">
                <button
                  onClick={() => setFilters({})}
                  className="text-[10px] bg-blue-500 text-white rounded px-1.5 py-0.5 hover:bg-blue-600 whitespace-nowrap"
                  title="Filtreleri Temizle"
                >✕ Clear</button>
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["jobNumber"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "jobNumber": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["jobStartDate"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "jobStartDate": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["jobCompletionDate"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "jobCompletionDate": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["scope?.value"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "scope?.value": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["customerName"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "customerName": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["typeOfFinding?.value"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "typeOfFinding?.value": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["qgs"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "qgs": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["communication"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "communication": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["otd"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "otd": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["documentation"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "documentation": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["hs"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "hs": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["environment"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "environment": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["comment"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "comment": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
            </tr>

        {loading ? (
          <tr>
            <td colSpan={25} className="text-center py-6 text-gray-600">
              Arşiv verileri yükleniyor...
            </td>
          </tr>
        ) : !actionData || actionData.length === 0 ? (
          <tr>
            <td colSpan={25} className="text-center py-6 text-gray-500">
              No Data
            </td>
          </tr>
        ) : (
          actionData.map((row, index) => {
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
                    className="border border-gray-200 px-2 py-1 w-16 sticky left-[-1px] top-0 z-10 bg-white"
                    rowSpan={1}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">
                        {row.no}
                      </span>
                      <input
                        type="checkbox"
                        checked={selectedRowsForActions.has(row.id)}
                        onChange={() =>
                          onCheckboxChangeForActions(row.id, actionData)
                        }
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                    </div>
                  </td>

                  <td
                    className="border border-gray-200 px-2 py-1 w-20"
                    rowSpan={1}
                  >
                    {row.name && (
                      <span className="inline-block px-3 py-1 bg-gray-100 text-black border border-gray-200 rounded-full shadow-sm">
                        {row.name}
                      </span>
                    )}
                  </td>

                  {/* Scope */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-32"
                    rowSpan={1}
                  >
                    {row.issuer && (
                      <span className="inline-block px-3 py-1 bg-gray-100 text-black border border-gray-200 rounded-full shadow-sm">
                        {row.issuer}
                      </span>
                    )}
                  </td>

                  {/* Name Of Customer */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-32"
                    rowSpan={1}
                  >
                    {row.vendorName && (
                      <span className="inline-block px-3 py-1 bg-gray-100 text-black border border-gray-200 rounded-full shadow-sm">
                        {row.vendorName}
                      </span>
                    )}
                  </td>

                  {/* Type Of Finding */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-28"
                    rowSpan={1}
                  >
                    {row.issueDate}
                  </td>

                  {/* Quality Of Services */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-20"
                    rowSpan={1}
                  >
                    {row.nextReviewDate}
                  </td>

                  {/* Communication */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-20"
                    rowSpan={1}
                  >
                    {row.nextReviewDate}
                  </td>

                  {/* On Time Delivery */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-20"
                    rowSpan={1}
                  >
                    {row.actual?.value}
                  </td>

                  {/* Documentation */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-20"
                    rowSpan={1}
                  >
                    {row.actual?.value}
                  </td>

                  {/* Health And Safety */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-20"
                    rowSpan={1}
                  >
                    {row.actual?.value}
                  </td>

                  <td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
                    {(() => {
                      const values = [row.qgs, row.communication, row.otd, row.documentation, row.hs, row.environment];
                      const valid = values.filter(v => v !== null && v !== undefined && v !== "");
                      if (valid.length === 0) return "";
                      const avg = (valid.reduce((sum, v) => sum + Number(v), 0));
                      return (
                        <SoftBadge
                          value={avg}
                          color={
                            avg >= 4 ? "bg-gray-100 text-black border border-gray-200" :
                            avg >= 2.5 ? "bg-gray-100 text-black border border-gray-200" :
                                        "bg-gray-100 text-black border border-gray-200"
                          }
                        />
                      );
                    })()}
                  </td>
                  
                  {/* Environment
                  <td
                    className="border border-gray-200 px-2 py-1 w-20"
                    rowSpan={1}
                  >
                    {row.actual?.value}
                  </td> */}
                </tr>
              </React.Fragment>
            );
          })
        )}
      </tbody>
    );
  } else {
    // 🟩 Normal (aktif) tablo
    return (
      <tbody className="text-xs">
            {/* ── Filter Row ── */}
            <tr className="bg-gray-50 border-b-2 border-blue-200">
              <td className="border border-gray-200 px-1 py-1 sticky left-[-1px] z-10 bg-gray-50">
                <button
                  onClick={() => setFilters({})}
                  className="text-[10px] bg-blue-500 text-white rounded px-1.5 py-0.5 hover:bg-blue-600 whitespace-nowrap"
                  title="Filtreleri Temizle"
                >✕ Clear</button>
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["jobNumber"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "jobNumber": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["jobStartDate"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "jobStartDate": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["jobCompletionDate"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "jobCompletionDate": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["scope?.value"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "scope?.value": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["customerName"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "customerName": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["typeOfFinding?.value"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "typeOfFinding?.value": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["qgs"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "qgs": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["communication"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "communication": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["otd"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "otd": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["documentation"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "documentation": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["hs"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "hs": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["environment"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "environment": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="border border-gray-200 px-1 py-1 bg-gray-50 min-w-[60px]">
                <input
                  value={filters["comment"] || ""}
                  onChange={e => setFilters(prev => ({...prev, "comment": e.target.value}))}
                  placeholder="Filtrele..."
                  className="w-full text-[10px] border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-400"
                />
              </td>
            </tr>

        {loading ? (
          <tr>
            <td colSpan={25} className="text-center py-6 text-gray-600">
              Arşiv verileri yükleniyor...
            </td>
          </tr>
        ) : !filteredData || filteredData.length === 0 ? (
          <tr>
            <td colSpan={25} className="text-center py-6 text-gray-500">
              No Data
            </td>
          </tr>
        ) : (
          filteredData.map((row, index) => {
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

                  {/* <td
                    className="border border-gray-200 px-2 py-1 w-20"
                    rowSpan={1}
                  >
                    {row.name && (
                      <span className="inline-block px-3 py-1 bg-gray-100 text-black border border-gray-200 rounded-full shadow-sm">
                        {row.name}
                      </span>
                    )}
                  </td> */}

{/* Job Number */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.jobNumber} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Job Start Date */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.jobStartDate} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Job Completion Date */}
<td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
  <SoftBadge value={row.jobCompletionDate} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Scope */}
<td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
  <SoftBadge value={row.scope?.value} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Name Of Customer */}
<td className="border border-gray-200 px-2 py-1 w-32" rowSpan={1}>
  <SoftBadge value={row.customerName} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Type Of Finding */}
<td className="border border-gray-200 px-2 py-1 w-28" rowSpan={1}>
  <SoftBadge value={row.typeOfFinding?.value} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Quality Of Services */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.qgs} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Communication */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.communication} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* On Time Delivery */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.otd} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Documentation */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.documentation} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Health And Safety */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.hs} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Environment */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge value={row.environment} color="bg-gray-100 text-black border border-gray-200" />
</td>

{/* Total Score */}
<td className="border border-gray-200 px-2 py-1 w-20" rowSpan={1}>
  <SoftBadge
value={
  (
    (Number(row.qgs) || 0) +
    (Number(row.communication) || 0) +
    (Number(row.otd) || 0) +
    (Number(row.documentation) || 0) +
    (Number(row.hs) || 0) +
    (Number(row.environment) || 0)
  )
}
    color="bg-gray-100 text-black border border-gray-200"
  />
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

export default FbBody;
