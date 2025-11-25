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
          deletedData.map((row) => {
            const numActions = row.actionPlan ? row.actionPlan.length : 1;
            const actions = Array.isArray(row.actionPlan)
              ? row.actionPlan
              : [row.actionPlan];

            const SoftBadge = ({ value, color }) =>
              value ? (
                <span
                  className={`inline-block px-2 py-1 rounded-full text-sm font-medium shadow-sm ${color}`}
                >
                  {value}
                </span>
              ) : null;

            return (
              <React.Fragment key={row.id}>
                {/* Ana row */}
                <tr className="hover:bg-gray-50">
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

                  {/* SWOT */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-20"
                    rowSpan={1}
                  >
                    <SoftBadge
                      value={row.swot?.value}
                      color="bg-rose-100 text-rose-700 border border-rose-200"
                    />
                  </td>

                  {/* PESTLE */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-20"
                    rowSpan={1}
                  >
                    <SoftBadge
                      value={row.pestle?.value}
                      color="bg-blue-100 text-blue-700 border border-blue-200"
                    />
                  </td>

                  {/* Interested Party */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-32"
                    rowSpan={1}
                  >
                    <SoftBadge
                      value={row.interestedParty?.value}
                      color="bg-green-100 text-green-700 border border-green-200"
                    />
                  </td>

                  {/* Text Fields */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-32"
                    rowSpan={1}
                  >
                    {row.riskOpportunity}
                  </td>
                  <td
                    className="border border-gray-200 px-2 py-1 w-28"
                    rowSpan={1}
                  >
                    {row.objective}
                  </td>
                  <td
                    className="border border-gray-200 px-2 py-1 w-20"
                    rowSpan={1}
                  >
                    {row.kpi}
                  </td>

                  {/* Process */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-24"
                    rowSpan={1}
                  >
                    <SoftBadge
                      value={row.process?.value}
                      color="bg-cyan-100 text-cyan-700 border border-cyan-200"
                    />
                  </td>

                  {/* Ermeoa */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-48"
                    rowSpan={1}
                  >
                    {row.ermeoa?.value || `${row.objective} Action`}
                  </td>

                  {/* Initial Risk */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-20"
                    rowSpan={1}
                  >
                    <SoftBadge
                      value={row.initialRiskSeverity}
                      color="bg-emerald-100 text-emerald-700 border border-emerald-200"
                    />
                  </td>
                  <td
                    className="border border-gray-200 px-2 py-1 w-24"
                    rowSpan={1}
                  >
                    <SoftBadge
                      value={row.initialRiskLikelyhood}
                      color="bg-emerald-100 text-emerald-700 border border-emerald-200"
                    />
                  </td>

                  {/* Risk Level */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-20"
                    rowSpan={1}
                  >
                    <SoftBadge
                      value="Medium"
                      color="bg-yellow-100 text-yellow-700 border border-yellow-200"
                    />
                  </td>

                  {/* İlk Action */}
                  

                  {/* Residual Risk */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-24"
                    rowSpan={1}
                  >
                    <SoftBadge
                      value={row.residualRiskSeverity}
                      color="bg-rose-100 text-rose-700 border border-rose-200"
                    />
                  </td>
                  <td
                    className="border border-gray-200 px-2 py-1 w-24"
                    rowSpan={1}
                  >
                    <SoftBadge
                      value={row.residualRiskLikelyhood}
                      color="bg-rose-100 text-rose-700 border border-rose-200"
                    />
                  </td>
                  <td
                    className="border border-gray-200 px-2 py-1 w-20"
                    rowSpan={1}
                  >
                    <SoftBadge
                      value="Low"
                      color="bg-emerald-100 text-emerald-700 border border-emerald-200"
                    />
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
    // 🟨 Arşivlenmiş dosyalar
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
          archivedData.map((row) => {
            const numActions = row.actionPlan ? row.actionPlan.length : 1;
            const actions = Array.isArray(row.actionPlan)
              ? row.actionPlan
              : [row.actionPlan];

            const SoftBadge = ({ value, color }) =>
              value ? (
                <span
                  className={`inline-block px-2 py-1 rounded-full text-sm font-medium shadow-sm ${color}`}
                >
                  {value}
                </span>
              ) : null;

            return (
              <React.Fragment key={row.id}>
                {/* Ana row */}
                <tr className="hover:bg-gray-50">
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

                  {/* SWOT */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-20"
                    rowSpan={1}
                  >
                    <SoftBadge
                      value={row.swot?.value}
                      color="bg-rose-100 text-rose-700 border border-rose-200"
                    />
                  </td>

                  {/* PESTLE */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-20"
                    rowSpan={1}
                  >
                    <SoftBadge
                      value={row.pestle?.value}
                      color="bg-blue-100 text-blue-700 border border-blue-200"
                    />
                  </td>

                  {/* Interested Party */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-32"
                    rowSpan={1}
                  >
                    <SoftBadge
                      value={row.interestedParty?.value}
                      color="bg-green-100 text-green-700 border border-green-200"
                    />
                  </td>

                  {/* Text Fields */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-32"
                    rowSpan={1}
                  >
                    {row.riskOpportunity}
                  </td>
                  <td
                    className="border border-gray-200 px-2 py-1 w-28"
                    rowSpan={1}
                  >
                    {row.objective}
                  </td>
                  <td
                    className="border border-gray-200 px-2 py-1 w-20"
                    rowSpan={1}
                  >
                    {row.kpi}
                  </td>

                  {/* Process */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-24"
                    rowSpan={1}
                  >
                    <SoftBadge
                      value={row.process?.value}
                      color="bg-cyan-100 text-cyan-700 border border-cyan-200"
                    />
                  </td>

                  {/* Ermeoa */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-48"
                    rowSpan={1}
                  >
                    {row.ermeoa?.value || `${row.objective} Action`}
                  </td>

                  {/* Initial Risk */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-20"
                    rowSpan={1}
                  >
                    <SoftBadge
                      value={row.initialRiskSeverity}
                      color="bg-emerald-100 text-emerald-700 border border-emerald-200"
                    />
                  </td>
                  <td
                    className="border border-gray-200 px-2 py-1 w-24"
                    rowSpan={1}
                  >
                    <SoftBadge
                      value={row.initialRiskLikelyhood}
                      color="bg-emerald-100 text-emerald-700 border border-emerald-200"
                    />
                  </td>

                  {/* Risk Level */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-20"
                    rowSpan={1}
                  >
                    <SoftBadge
                      value="Medium"
                      color="bg-yellow-100 text-yellow-700 border border-yellow-200"
                    />
                  </td>

                  {/* İlk Action */}
                  

                  {/* Residual Risk */}
                  <td
                    className="border border-gray-200 px-2 py-1 w-24"
                    rowSpan={1}
                  >
                    <SoftBadge
                      value={row.residualRiskSeverity}
                      color="bg-rose-100 text-rose-700 border border-rose-200"
                    />
                  </td>
                  <td
                    className="border border-gray-200 px-2 py-1 w-24"
                    rowSpan={1}
                  >
                    <SoftBadge
                      value={row.residualRiskLikelyhood}
                      color="bg-rose-100 text-rose-700 border border-rose-200"
                    />
                  </td>
                  <td
                    className="border border-gray-200 px-2 py-1 w-20"
                    rowSpan={1}
                  >
                    <SoftBadge
                      value="Low"
                      color="bg-emerald-100 text-emerald-700 border border-emerald-200"
                    />
                  </td>
                </tr>

                {/* Ek Actions */}
                
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
                <tr>
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
          tableData.map((row) => {
            const numActions = row.actions ? row.actions.length : 1;
            const actions = Array.isArray(row.actions)
              ? row.actions
              : [row.actions];

            return (
              <React.Fragment key={row.id}>
                <tr className="hover:bg-gray-50">
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

                  {/* SWOT */}
                  <td
                    className="border border-gray-200 px-3 py-2 w-20"
                    rowSpan={1}
                  >
                    {row.swot?.value && (
                      <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 border border-rose-200 rounded-full shadow-sm">
                        {row.swot.value}
                      </span>
                    )}
                  </td>

                  {/* PESTLE */}
                  <td
                    className="border border-gray-200 px-3 py-2 w-20"
                    rowSpan={1}
                  >
                    {row.pestle?.value && (
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 border border-blue-200 rounded-full shadow-sm">
                        {row.pestle.value}
                      </span>
                    )}
                  </td>

                  {/* Interested Party */}
                  <td
                    className="border border-gray-200 px-3 py-2 w-32"
                    rowSpan={1}
                  >
                    {row.interestedParty?.value && (
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 border border-green-200 rounded-full shadow-sm">
                        {row.interestedParty.value}
                      </span>
                    )}
                  </td>

                  {/* Text Fields */}
                  <td
                    className="border border-gray-200 px-3 py-2 w-32"
                    rowSpan={1}
                  >
                    {row.riskOpportunity}
                  </td>

                  <td
                    className="border border-gray-200 px-3 py-2 w-28"
                    rowSpan={1}
                  >
                    {row.objective}
                  </td>

                  <td
                    className="border border-gray-200 px-3 py-2 w-20"
                    rowSpan={1}
                  >
                    {row.kpi}
                  </td>

                  {/* Process */}
                  <td
                    className="border border-gray-200 px-3 py-2 w-24"
                    rowSpan={1}
                  >
                    {row.process?.value && (
                      <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-700 border border-cyan-200 rounded-full shadow-sm">
                        {row.process.value}
                      </span>
                    )}
                  </td>

                  {/* Ermeoa */}
                  <td
                    className="border border-gray-200 px-3 py-2 w-48"
                    rowSpan={1}
                  >
                    {row.ermeoa?.value || `${row.objective} Action`}
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
  }
};

export default MyTableBody;
