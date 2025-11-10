// MyTableBody.jsx (ayrı bir dosya olarak kaydedin)
import React from "react";
import { useState, useEffect } from "react";
import { hCheckboxChange } from "../profile.jsx";
const MyTableBody = ({ selectedRows, onCheckboxChange }) => {
  const [showArchived, setShowArchived] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8000/api/register/br/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed To Get Datas From Database");
        }
        return response.json();
      })
      .then((fetchedData) => {
        setTableData(fetchedData); // Array olarak al (JSON array'i)
        setLoading(false);
        console.log(fetchedData);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (tableData.length > 0) {
    console.log("Action Plan Length:", tableData[0]?.actionPlan?.length || 0);
  }
  if (loading) return;
  if (error) return;
  const filteredTableData = tableData.filter(
    (row) => showArchived || !row.archived,
  );

  return (
    <tbody>
      {tableData.map((row) => {
        const numActions = row.actionPlan ? row.actionPlan.length : 1; // actionPlan array ise uzunluğu, yoksa 1 (tek object için fallback)
        const actions = Array.isArray(row.actionPlan)
          ? row.actionPlan
          : [row.actionPlan]; // Array değilse array'e çevir

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
                  onChange={() => onCheckboxChange(row.id, tableData)}
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
              {/* Existing Risk/Mitigation Action/Exploitation Action - rowspan (içeriği objective'e göre değişebilir, burda generic yap) */}
              <td
                className="border border-blue-500 px-2 py-1 w-48"
                rowSpan={numActions}
              >
                {row.ermeoa.value || `${row.objective} Action`}{" "}
                {/* Örnek: "Mitigation Action" veya "Exploitation Action" */}
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
              {/* İlk Action Plan'ın detayları (11 td) */}
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
                {actions[0]?.actionStatus || ""}{" "}
                {/* Örnekte farklı field'lar var, uyarla */}
              </td>
              <td className="border border-blue-500 px-2 py-1 w-24">
                {actions[0]?.completionDate || ""}{" "}
                {/* Örnekte farklı field'lar var, uyarla */}
              </td>
              <td className="border border-blue-500 px-2 py-1 w-32">
                {actions[0]?.statusOfVerification || ""}{" "}
                {/* Örnekte deadline-like, ama uyarla */}
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
                {row.residualRiskLikelyhood || ""}{" "}
                {/* Varsa ekle, yoksa 'Unlikely' gibi */}
              </td>
              <td
                className="border border-blue-500 px-2 py-1 w-20"
                rowSpan={numActions}
              >
                Low {/* Varsa ekle */}
              </td>
            </tr>
            {/* Ek action plan'lar için sub-rows (ilkten sonrasını map'le) */}
            {actions.slice(1).map((action, actionIndex) => (
              <tr key={`${row.id}-action-${actionIndex}`}>
                {/* Action Plan detayları (11 td - rowspan yok, sadece action-specific) */}
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
                {/* Residual hücreler span ile kaplı, burada td yok */}
              </tr>
            ))}
          </React.Fragment>
        );
      })}
    </tbody>
  );
};

export default MyTableBody;
