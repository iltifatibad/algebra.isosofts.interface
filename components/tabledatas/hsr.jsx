// MyTableBody.jsx (ayrı bir dosya olarak kaydedin)
import React from "react";
import { useState, useEffect } from "react";
import { hCheckboxChange } from "../profile.jsx";
const HsrBody = ({
  selectedRows,
  selectedRowsForActions,
  showArchived,
  onCheckboxChange,
  onCheckboxChangeForActions,
  showDeleted,
  showDeletedAction,
  activeHeader,
  selectedTable,
  refresh,
  setRefresh,
}) => {
  console.log("ACTIVE HEADERRRRR : ", activeHeader);
  const [complexData, setComplexData] = useState([]);

  const [archivedData, setArchivedData] = useState([]);
  const [deletedData, setDeletedData] = useState([]);
  const [deletedActionData, setDeletedActionData] = useState([]);
  const [actionData, setActionData] = useState([]);
  const [editData, setEditData] = useState([]);
  const getArchivedData = async () => {
    setLoading(true); // Loading başla
    try {
      const response = await fetch(
        "http://localhost:8000/api/register/hsr/all?status=archived",
      );
      if (!response.ok) {
        throw new Error("Failed To Get Datas From Archived DataBase");
      }
      const fetchedData = await response.json();
      setComplexData(fetchedData || []);
      console.log("Arşiv verileri:", fetchedData);
    } catch (err) {
      console.error("Error While Fetching Archived Datas:", err);
      setComplexData([]); 
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
      } else if (!activeHeader && !showDeletedAction){
        const timer = setTimeout(() => {
          getAllActions(selectedRows);
          setRefresh(false);
        }, 500);
      } else if (!activeHeader && showDeletedAction){
        const timer = setTimeout(() => {
          getDeletedActionData();
          setRefresh(false);
        }, 500);
      }
    }
  }, [refresh]);

  useEffect(() => {
    if (showArchived) {
      getArchivedData(); // Async çağrı
    } else {
      setComplexData([]); // Normal moda geçince temizle (opsiyonel)
    }
  }, [showArchived]); // Dependency: showArchived değişince

  const getDeletedData = async () => {
    setLoading(true); // Loading başla
    try {
      const response = await fetch(
        "http://localhost:8000/api/register/hsr/all?status=deleted",
      );
      if (!response.ok) {
        throw new Error("Failed To Get Datas From Deleted DataBase");
      }
      const fetchedData = await response.json();
      setComplexData(fetchedData || []); // Veri set et, fallback []
      console.log("Arşiv verileri:", fetchedData);
    } catch (err) {
      console.error("Error While Fetching Deleted Datas:", err);
      setComplexData([]); // Hata durumunda boş array set et (null değil!)
    } finally {
      setLoading(false); // Loading bitir
    }
  };
  useEffect(() => {
    if (showDeleted) {
      getDeletedData(); // Async çağrı
    } else {
      setComplexData([]); // Normal moda geçince temizle (opsiyonel)
    }
  }, [showDeleted]); // Dependency: showArchived değişince

  const getDeletedActionData = async () => {
    setLoading(true); // Loading başla
    const selectedRowsArray = [...selectedRows];
    try {
      const firstRowId = selectedRowsArray[0];
      const url = `http://localhost:8000/api/register/component/action/all?registerId=${firstRowId}&status=deleted`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed To Get Datas From Deleted DataBase");
      }
      const fetchedData = await response.json();
      setDeletedActionData(fetchedData || []); // Veri set et, fallback []
      console.log("DELETED Action verileri:", fetchedData);
    } catch (err) {
      console.error("Error While Fetching Deleted Datas:", err);
      setDeletedActionData([]); // Hata durumunda boş array set et (null değil!)
    } finally {
      setLoading(false); // Loading bitir
    }
  };
  useEffect(() => {
    if (showDeletedAction) {
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
    fetch("http://localhost:8000/api/register/hsr/all")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed To Get Datas From Database");
        }
        return response.json();
      })
      .then((fetchedData) => {
        setComplexData(fetchedData);
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

    const selectedRowsArray = [...selectedRows];

    if (selectedRowsArray.length === 0) {
      console.error("Seçili satır yok!"); // Hata kontrolü
      setLoading(false);
      return; // Erken çık
    }

    const firstRowId = selectedRowsArray[0];
    const url = `http://localhost:8000/api/register/component/action/all?registerId=${firstRowId}&status=active`;

    console.log("URL:", url); // Debug: URL'yi konsola yazdır, registerId'yi kontrol et

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log("AAA", selectedRowsForActions); // Bu zaten Set'i gösteriyor
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
  if (activeHeader == true){
        return (
      <tbody className="text-sm">
        {loading ? (
          <tr>
            <td colSpan={25} className="text-center py-6 text-gray-600">
              Arşiv verileri yükleniyor...
            </td>
          </tr>
        ) : !complexData || complexData.length === 0 ? (
          <tr>
            <td colSpan={25} className="text-center py-6 text-gray-500">
              No Data
            </td>
          </tr>
        ) : (
          complexData.map((row, index) => {
            const numActions = row.actions ? row.actions.length : 1;
            const actions = Array.isArray(row.actions)
              ? row.actions
              : [row.actions];
              console.log("COMPLEX DATA TABLE", row);

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
                        onChange={() => onCheckboxChange(row.id, complexData)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                    </div>
                  </td>

                  {/* Process */}
                  <td
                    className="border border-gray-200 px-3 py-2 w-20"
                    rowSpan={1}
                  >
                    {row.process?.value && (
                      <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 border border-rose-200 rounded-full shadow-sm">
                        {row.process.value}
                      </span>
                    )}
                  </td>

                  {/* Hazard */}
                  <td
                    className="border border-gray-200 px-3 py-2 w-20"
                    rowSpan={1}
                  >
                    {row.hazard?.value && (
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 border border-blue-200 rounded-full shadow-sm">
                        {row.hazard.value}
                      </span>
                    )}
                  </td>

                  {/* Risk */}
                  <td
                    className="border border-gray-200 px-3 py-2 w-32"
                    rowSpan={1}
                  >
                    {row.risk?.value && (
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 border border-green-200 rounded-full shadow-sm">
                        {row.risk.value}
                      </span>
                    )}
                  </td>

                  {/* Affected Positions */}
                  <td
                    className="border border-gray-200 px-3 py-2 w-32"
                    rowSpan={1}
                  >
                    {row.affectedPositions.value}
                  </td>

                  {/* ERMA */}
                  <td
                    className="border border-gray-200 px-3 py-2 w-24"
                    rowSpan={1}
                  >
                  {(row.erma || (row.erma?.value)) && (
                      <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-700 border border-cyan-200 rounded-full shadow-sm">
                          {row.erma?.value || row.erma}
                      </span>
                  )}
                  </td>

                  {/* Initial Risk Severity */}
                  <td
                    className="border border-gray-200 px-3 py-2 w-20"
                    rowSpan={1}
                  >
                    {row.initialRiskSeverity && (
                      <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full shadow-sm">
                        {row.initialRiskSeverity}
                      </span>
                    )}
                  </td>

                  {/* Likelyhood */}
                  <td
                    className="border border-gray-200 px-3 py-2 w-24"
                    rowSpan={1}
                  >
                    {row.initialRiskLikelyhood && (
                      <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full shadow-sm">
                        {row.initialRiskLikelyhood}
                      </span>
                    )}
                  </td>

                  {/* Risk Level */}
                  <td
                    className="border border-gray-200 px-3 py-2 w-20"
                    rowSpan={1}
                  >
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-full shadow-sm">
                      Medium
                    </span>
                  </td>

                  {/* Residual Severity */}
                  <td
                    className="border border-gray-200 px-3 py-2 w-24"
                    rowSpan={1}
                  >
                    {row.residualRiskSeverity && (
                      <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 border border-rose-200 rounded-full shadow-sm">
                        {row.residualRiskSeverity}
                      </span>
                    )}
                  </td>

                  {/* Residual Likelyhood */}
                  <td
                    className="border border-gray-200 px-3 py-2 w-24"
                    rowSpan={1}
                  >
                    {row.residualRiskLikelyhood && (
                      <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 border border-rose-200 rounded-full shadow-sm">
                        {row.residualRiskLikelyhood}
                      </span>
                    )}
                  </td>

                  {/* Final Risk Level */}
                  <td
                    className="border border-gray-200 px-3 py-2 w-20"
                    rowSpan={1}
                  >
                    <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full shadow-sm">
                      Low
                    </span>
                  </td>
                </tr>
              </React.Fragment>
            );
          })
        )}
      </tbody>
  );
  } else if (activeHeader == false && showDeletedAction == false) {
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
                      {selectedTable[0].no}
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
  } else if (activeHeader == false && showDeletedAction == true) {
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
                    {selectedTable[0].no}
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
  }
  
};

export default HsrBody;
