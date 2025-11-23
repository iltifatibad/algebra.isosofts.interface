// MyTableBody.jsx (ayrı bir dosya olarak kaydedin)
import React from "react";
import { useState, useEffect } from "react";
import { hCheckboxChange } from "../profile.jsx";
const MyTableBody = ({
  selectedRows,
  selectedRowsForActions,
  showArchived,
  onCheckboxChange,
  onCheckboxChangeForActions,
  showDeleted,
  activeHeader,
  selectedTable,
}) => {
  console.log("ACTIVE HEADERRRRR : ", activeHeader);
  const [archivedData, setArchivedData] = useState([]);
  const [deletedData, setDeletedData] = useState([]);
  const [actionData, setActionData] = useState([]);
  const [editData, setEditData] = useState([]);
  const getArchivedData = async () => {
    setLoading(true); // Loading başla
    try {
      const response = await fetch(
        "http://localhost:8000/api/register/br/all?status=archived",
      );
      if (!response.ok) {
        throw new Error("Failed To Get Datas From Archived DataBase");
      }
      const fetchedData = await response.json();
      setArchivedData(fetchedData || []); // Veri set et, fallback []
      console.log("Arşiv verileri:", fetchedData);
    } catch (err) {
      console.error("Error While Fetching Archived Datas:", err);
      setArchivedData([]); // Hata durumunda boş array set et (null değil!)
    } finally {
      setLoading(false); // Loading bitir
    }
  };
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
      const response = await fetch(
        "http://localhost:8000/api/register/br/all?status=deleted",
      );
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [tableData, setTableData] = useState([]);
  const getAll = async () => {
    setLoading(true);
    fetch("http://localhost:8000/api/register/br/all")
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

    // Set'i Array'e çevir (bu kritik kısım!)
    const selectedRowsArray = [...selectedRows];

    if (selectedRowsArray.length === 0) {
      console.error("Seçili satır yok!"); // Hata kontrolü
      setLoading(false);
      return; // Erken çık
    }

    const firstRowId = selectedRowsArray[0]; // Artık ID'yi alabilirsin: "I234884J501LA657g6S20N2Nc2V71p"
    const url = `http://localhost:8000/api/register/component/action/all?registerId=${firstRowId}&status=active`;

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

  if (showDeleted) {
    // 🟥 Silinmiş dosyalar
    return (
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={25} className="text-center py-4">
              Deleted verileri yükleniyor...
            </td>
          </tr>
        ) : deletedData && deletedData.length > 0 ? (
          deletedData.map((row) => {
            const numActions = row.actionPlan ? row.actionPlan.length : 1;
            const actions = Array.isArray(row.actionPlan)
              ? row.actionPlan
              : [row.actionPlan];

            return (
              <React.Fragment key={row.id}>
                {/* Ana row: Rowspan ile ana hücreler ve ilk action'ın detayları */}
                <tr>
                  {/* # sütunu - rowspan */}
                  <td
                    className="border border-blue-500 px-2 py-1 w-16 sticky left-[-1px] top-0 z-10 bg-white -ml-px"
                    rowSpan={numActions}
                  >
                    {row.no}
                    <input
                      checked={selectedRows.has(row.id)}
                      onChange={() => onCheckboxChange(row.id, deletedData)}
                      type="checkbox"
                    />
                  </td>
                  {/* SWOT - rowspan */}
                  <td
                    className="border border-blue-500 px-2 py-1 w-20"
                    rowSpan={numActions}
                  >
                    {row.swot.value}
                  </td>
                  {/* PESTLE - rowspan */}
                  <td
                    className="border border-blue-500 px-2 py-1 w-20"
                    rowSpan={numActions}
                  >
                    {row.pestle.value}
                  </td>
                  {/* Interested Party - rowspan */}
                  <td
                    className="border border-blue-500 px-2 py-1 w-32"
                    rowSpan={numActions}
                  >
                    {row.interestedParty.value}
                  </td>
                  {/* Risk/Opportunity - rowspan */}
                  <td
                    className="border border-blue-500 px-2 py-1 w-32"
                    rowSpan={numActions}
                  >
                    {row.riskOpportunity}
                  </td>
                  {/* Objective - rowspan */}
                  <td
                    className="border border-blue-500 px-2 py-1 w-28"
                    rowSpan={numActions}
                  >
                    {row.objective}
                  </td>
                  {/* KPI - rowspan */}
                  <td
                    className="border border-blue-500 px-2 py-1 w-20"
                    rowSpan={numActions}
                  >
                    {row.kpi}
                  </td>
                  {/* Process - rowspan */}
                  <td
                    className="border border-blue-500 px-2 py-1 w-24"
                    rowSpan={numActions}
                  >
                    {row.process.value}
                  </td>
                  {/* Existing Risk/Mitigation Action/Exploitation Action - rowspan */}
                  <td
                    className="border border-blue-500 px-2 py-1 w-48"
                    rowSpan={numActions}
                  >
                    {row.ermeoa.value || `${row.objective} Action`}
                  </td>
                  {/* Initial Risk: Severity - rowspan */}
                  <td
                    className="border border-blue-500 px-2 py-1 w-20"
                    rowSpan={numActions}
                  >
                    {row.initialRiskSeverity || ""}
                  </td>
                  {/* Initial Risk: Likelihood - rowspan */}
                  <td
                    className="border border-blue-500 px-2 py-1 w-24"
                    rowSpan={numActions}
                  >
                    {row.initialRiskLikelyhood || ""}
                  </td>
                  {/* Initial Risk: Risk Level - rowspan */}
                  <td
                    className="border border-blue-500 px-2 py-1 w-20"
                    rowSpan={numActions}
                  >
                    Medium
                  </td>
                  {/* İlk Action Plan'ın detayları */}
                  <td className="border border-blue-500 px-2 py-1 w-32">
                    {actions[0]?.action || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-32">
                    {actions[0]?.raiseDate || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-24">
                    {actions[0]?.resources || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-28">
                    {actions[0]?.function || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-28">
                    {actions[0]?.responsible || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-24">
                    {actions[0]?.deadline || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-36">
                    {actions[0]?.actionConfirmation || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-24">
                    {actions[0]?.actionStatus || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-24">
                    {actions[0]?.completionDate || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-32">
                    {actions[0]?.statusOfVerification || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-40">
                    {actions[0]?.comment || ""}
                  </td>
                  {/* Residual Risk/Opportunity Level - rowspan */}
                  <td
                    className="border border-blue-500 px-2 py-1 w-24"
                    rowSpan={numActions}
                  >
                    {row.residualRiskSeverity || ""}
                  </td>
                  <td
                    className="border border-blue-500 px-2 py-1 w-24"
                    rowSpan={numActions}
                  >
                    {row.residualRiskLikelyhood || ""}
                  </td>
                  <td
                    className="border border-blue-500 px-2 py-1 w-20"
                    rowSpan={numActions}
                  >
                    Low
                  </td>
                </tr>

                {/* Ek action plan'lar */}
                {actions.slice(1).map((action, actionIndex) => (
                  <tr key={`${row.id}-action-${actionIndex}`}>
                    <td className="border border-blue-500 px-2 py-1 w-32">
                      {action?.action || ""}
                    </td>
                    <td className="border border-blue-500 px-2 py-1 w-32">
                      {action?.raiseDate || ""}
                    </td>
                    <td className="border border-blue-500 px-2 py-1 w-24">
                      {action?.resources || ""}
                    </td>
                    <td className="border border-blue-500 px-2 py-1 w-28">
                      {action?.function || ""}
                    </td>
                    <td className="border border-blue-500 px-2 py-1 w-28">
                      {action?.responsible || ""}
                    </td>
                    <td className="border border-blue-500 px-2 py-1 w-24">
                      {action?.deadline || ""}
                    </td>
                    <td className="border border-blue-500 px-2 py-1 w-36">
                      {action?.actionStatus || ""}
                    </td>
                    <td className="border border-blue-500 px-2 py-1 w-24">
                      {action?.verification || ""}
                    </td>
                    <td className="border border-blue-500 px-2 py-1 w-32">
                      {action?.comment || ""}
                    </td>
                    <td className="border border-blue-500 px-2 py-1 w-36">
                      {action?.verification || ""}
                    </td>
                    <td className="border border-blue-500 px-2 py-1 w-40">
                      {action?.comment || ""}
                    </td>
                  </tr>
                ))}
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
  } else if (showArchived) {
    // 🟨 Arşivlenmiş dosyalar
    return (
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={25} className="text-center py-4">
              Arşiv verileri yükleniyor...
            </td>
          </tr>
        ) : !archivedData || archivedData.length === 0 ? (
          <tr>
            <td colSpan={25} className="text-center py-4">
              No Data
            </td>
          </tr>
        ) : (
          archivedData.map((row) => {
            const numActions = row.actionPlan ? row.actionPlan.length : 1;
            const actions = Array.isArray(row.actionPlan)
              ? row.actionPlan
              : [row.actionPlan];

            return (
              <React.Fragment key={row.id}>
                {/* Ana row */}
                <tr>
                  <td
                    className="border border-blue-500 px-2 py-1 w-16 sticky left-[-1px] top-0 z-10 bg-white -ml-px"
                    rowSpan={numActions}
                  >
                    {row.no}
                    <input
                      checked={selectedRows.has(row.id)}
                      onChange={() => onCheckboxChange(row.id, archivedData)}
                      type="checkbox"
                    />
                  </td>

                  <td
                    className="border border-blue-500 px-2 py-1 w-20"
                    rowSpan={numActions}
                  >
                    {row.swot?.value}
                  </td>

                  <td
                    className="border border-blue-500 px-2 py-1 w-20"
                    rowSpan={numActions}
                  >
                    {row.pestle?.value}
                  </td>

                  <td
                    className="border border-blue-500 px-2 py-1 w-32"
                    rowSpan={numActions}
                  >
                    {row.interestedParty?.value}
                  </td>

                  <td
                    className="border border-blue-500 px-2 py-1 w-32"
                    rowSpan={numActions}
                  >
                    {row.riskOpportunity}
                  </td>

                  <td
                    className="border border-blue-500 px-2 py-1 w-28"
                    rowSpan={numActions}
                  >
                    {row.objective}
                  </td>

                  <td
                    className="border border-blue-500 px-2 py-1 w-20"
                    rowSpan={numActions}
                  >
                    {row.kpi}
                  </td>

                  <td
                    className="border border-blue-500 px-2 py-1 w-24"
                    rowSpan={numActions}
                  >
                    {row.process?.value}
                  </td>

                  <td
                    className="border border-blue-500 px-2 py-1 w-48"
                    rowSpan={numActions}
                  >
                    {row.ermeoa?.value || `${row.objective} Action`}
                  </td>

                  <td
                    className="border border-blue-500 px-2 py-1 w-20"
                    rowSpan={numActions}
                  >
                    {row.initialRiskSeverity || ""}
                  </td>

                  <td
                    className="border border-blue-500 px-2 py-1 w-24"
                    rowSpan={numActions}
                  >
                    {row.initialRiskLikelyhood || ""}
                  </td>

                  <td
                    className="border border-blue-500 px-2 py-1 w-20"
                    rowSpan={numActions}
                  >
                    Medium
                  </td>

                  {/* İlk Action */}
                  <td className="border border-blue-500 px-2 py-1 w-32">
                    {actions[0]?.action || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-32">
                    {actions[0]?.raiseDate || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-24">
                    {actions[0]?.resources || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-28">
                    {actions[0]?.function || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-28">
                    {actions[0]?.responsible || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-24">
                    {actions[0]?.deadline || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-36">
                    {actions[0]?.actionConfirmation || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-24">
                    {actions[0]?.actionStatus || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-24">
                    {actions[0]?.completionDate || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-32">
                    {actions[0]?.statusOfVerification || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-40">
                    {actions[0]?.comment || ""}
                  </td>

                  <td
                    className="border border-blue-500 px-2 py-1 w-24"
                    rowSpan={numActions}
                  >
                    {row.residualRiskSeverity || ""}
                  </td>

                  <td
                    className="border border-blue-500 px-2 py-1 w-24"
                    rowSpan={numActions}
                  >
                    {row.residualRiskLikelyhood || ""}
                  </td>

                  <td
                    className="border border-blue-500 px-2 py-1 w-20"
                    rowSpan={numActions}
                  >
                    Low
                  </td>
                </tr>

                {/* Ek Actions */}
                {actions.slice(1).map((action, actionIndex) => (
                  <tr key={`${row.id}-action-${actionIndex}`}>
                    <td className="border border-blue-500 px-2 py-1 w-32">
                      {action?.action || ""}
                    </td>
                    <td className="border border-blue-500 px-2 py-1 w-32">
                      {action?.raiseDate || ""}
                    </td>
                    <td className="border border-blue-500 px-2 py-1 w-24">
                      {action?.resources || ""}
                    </td>
                    <td className="border border-blue-500 px-2 py-1 w-28">
                      {action?.function || ""}
                    </td>
                    <td className="border border-blue-500 px-2 py-1 w-28">
                      {action?.responsible || ""}
                    </td>
                    <td className="border border-blue-500 px-2 py-1 w-24">
                      {action?.deadline || ""}
                    </td>
                    <td className="border border-blue-500 px-2 py-1 w-36">
                      {action?.actionStatus || ""}
                    </td>
                    <td className="border border-blue-500 px-2 py-1 w-24">
                      {action?.verification || ""}
                    </td>
                    <td className="border border-blue-560 px-2 py-2 w-32">
                      {action?.comment || ""}
                    </td>
                    <td className="border border-blue-500 px-2 py-1 w-36">
                      {action?.verification || ""}
                    </td>
                    <td className="border border-blue-500 px-2 py-1 w-40">
                      {action?.comment || ""}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            );
          })
        )}
      </tbody>
    );
  } else if (!activeHeader) {
    return (
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={25} className="text-center py-4">
              Deleted verileri yükleniyor...
            </td>
          </tr>
        ) : selectedTable && actionData && selectedTable.length > 0 ? (
          actionData.map((row,index) => {
            const numActions = row.actionPlan ? row.actionPlan.length : 1;
            const actions = Array.isArray(row.actionPlan)
              ? row.actionPlan
              : [row.actionPlan];

            return (
              <React.Fragment key={row.id}>
                {/* Ana row: Rowspan ile ana hücreler ve ilk action'ın detayları */}
                <tr>
                  {/* # sütunu - rowspan */}
                  <td
                    className="border border-blue-500 px-2 py-1 w-16 sticky left-[-1px] top-0 z-10 bg-white -ml-px"
                    rowSpan={numActions}
                  >
                    {selectedTable[0].no}
                    <input
                      checked={selectedRowsForActions.has(actionData[index].id)}
                      onChange={() => onCheckboxChangeForActions(actionData[index].id, actionData)}
                      type="checkbox"
                    />
                  </td>
                  {/* İlk Action Plan'ın detayları */}
                  <td className="border border-blue-500 px-2 py-1 w-32">
                    {actionData?.[index]?.title || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-32">
                    {actionData?.[index]?.raiseDate || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-24">
                    {actionData?.[index]?.resources?.toString() || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-28">
                    {actionData?.[index]?.relativeFunction?.value || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-28">
                    {actionData?.[index]?.responsible?.value || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-24">
                    {actionData?.[index]?.deadline || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-36">
                    {actionData?.[index]?.confirmation?.value || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-24">
                    {actionData?.[index]?.status?.value.toString() || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-24">
                    {actionData?.[index]?.completionDate || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-32">
                    {actionData?.[index]?.verificationStatus?.value || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-40">
                    {actionData?.[index]?.comment || ""}
                  </td>
                  {/* Residual Risk/Opportunity Level - rowspan */}
                </tr>

                {/* Ek action plan'lar */}
                
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
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={25} className="text-center py-4">
              Arşiv verileri yükleniyor...
            </td>
          </tr>
        ) : !tableData || tableData.length === 0 ? (
          <tr>
            <td colSpan={25} className="text-center py-4">
              No Data
            </td>
          </tr>
        ) : (
          tableData.map((row) => {

            const numActions = row.actions ? row.actions.length : 1;
            const actions = Array.isArray(row.actions)
              ? row.actions
              : [row.actions];

            return (
              <React.Fragment key={row.id}>
                <tr>
                  <td
                    className="border border-blue-500 px-2 py-1 w-16 sticky left-[-1px] top-0 z-10 bg-white -ml-px"
                    rowSpan={numActions}
                  >
                    {row.no}
                    <input
                      checked={selectedRows.has(row.id)}
                      onChange={() => onCheckboxChange(row.id, tableData)}
                      type="checkbox"
                    />
                  </td>

                  <td
                    className="border border-blue-500 px-2 py-1 w-20"
                    rowSpan={numActions}
                  >
                    {row.swot?.value}
                  </td>

                  <td
                    className="border border-blue-500 px-2 py-1 w-20"
                    rowSpan={numActions}
                  >
                    {row.pestle?.value}
                  </td>

                  <td
                    className="border border-blue-500 px-2 py-1 w-32"
                    rowSpan={numActions}
                  >
                    {row.interestedParty?.value}
                  </td>

                  <td
                    className="border border-blue-500 px-2 py-1 w-32"
                    rowSpan={numActions}
                  >
                    {row.riskOpportunity}
                  </td>

                  <td
                    className="border border-blue-500 px-2 py-1 w-28"
                    rowSpan={numActions}
                  >
                    {row.objective}
                  </td>

                  <td
                    className="border border-blue-500 px-2 py-1 w-20"
                    rowSpan={numActions}
                  >
                    {row.kpi}
                  </td>

                  <td
                    className="border border-blue-500 px-2 py-1 w-24"
                    rowSpan={numActions}
                  >
                    {row.process?.value}
                  </td>

                  <td
                    className="border border-blue-500 px-2 py-1 w-48"
                    rowSpan={numActions}
                  >
                    {row.ermeoa?.value || `${row.objective} Action`}
                  </td>

                  <td
                    className="border border-blue-500 px-2 py-1 w-20"
                    rowSpan={numActions}
                  >
                    {row.initialRiskSeverity || ""}
                  </td>

                  <td
                    className="border border-blue-500 px-2 py-1 w-24"
                    rowSpan={numActions}
                  >
                    {row.initialRiskLikelyhood || ""}
                  </td>

                  <td
                    className="border border-blue-500 px-2 py-1 w-20"
                    rowSpan={numActions}
                  >
                    Medium
                  </td>

                  {/* İlk Action Plan */}
                  <td className="border border-blue-500 px-2 py-1 w-32">
                    {actions[0]?.title || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-32">
                    {actions[0]?.raiseDate || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-24">
                    {actions[0]?.resources || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-28">
                    {actions[0]?.relativeFunction.value || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-28">
                    {actions[0]?.responsible.value || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-24">
                    {actions[0]?.deadline || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-36">
                    {actions[0]?.confirmation.value || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-24">
                    {actions[0]?.status.value || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-24">
                    {actions[0]?.completionDate || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-32">
                    {actions[0]?.verificationStatus.value || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-40">
                    {actions[0]?.comment || ""}
                  </td>

                  <td
                    className="border border-blue-500 px-2 py-1 w-24"
                    rowSpan={numActions}
                  >
                    {row.residualRiskSeverity || ""}
                  </td>

                  <td
                    className="border border-blue-500 px-2 py-1 w-24"
                    rowSpan={numActions}
                  >
                    {row.residualRiskLikelyhood || ""}
                  </td>

                  <td
                    className="border border-blue-500 px-2 py-1 w-20"
                    rowSpan={numActions}
                  >
                    Low
                  </td>
                </tr>

                {/* Ek Action Planlar */}
                {actions.slice(1).map((action, actionIndex) => (
                  <tr key={`${row.id}-action-${actionIndex}`}>
                   <td className="border border-blue-500 px-2 py-1 w-32">
                    {action?.title || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-32">
                    {action?.raiseDate || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-24">
                    {action?.resources || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-28">
                    {action?.relativeFunction.value || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-28">
                    {action?.responsible.value || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-24">
                    {action?.deadline || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-36">
                    {action?.confirmation.value || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-24">
                    {action?.status.value || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-24">
                    {action?.completionDate || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-32">
                    {action?.verificationStatus.value || ""}
                  </td>
                  <td className="border border-blue-500 px-2 py-1 w-40">
                    {action?.comment || ""}
                  </td>
                  </tr>
                ))}
              </React.Fragment>
            );
          })
        )}
      </tbody>
    );
  }
};

export default MyTableBody;
