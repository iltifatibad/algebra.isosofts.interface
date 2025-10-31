// MyTableBody.jsx (ayrı bir dosya olarak kaydedin)
import React from "react";
import { useState, useEffect } from "react";

const MyTableBody = () => {
  const [showArchived, setShowArchived] = useState(false);



  const [selectedRows, setSelectedRows] = useState(new Set()); // Checkbox state'i ekle
  
  const handleCheckboxChange = (id) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    fetch('../../public/jsondatas/bgrisk.json') // Public klasöründen çek: '/bgrisk.json'
      .then(response => {
        if (!response.ok) {
          throw new Error('bgrisk.json yüklenemedi');
        }
        return response.json();
      })
      .then(fetchedData => {
        setTableData(fetchedData); // Array olarak al (JSON array'i)
        setLoading(false);
        console.log(fetchedData);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (tableData.length > 0) {
    console.log('Action Plan Length:', tableData[0].actionPlan.length);
  }
  if (loading) return ;
  if (error) return ;
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
                {row.id}
                <input onClick={handleCheckboxChange} type="checkbox" />
              </td>
              {/* SWOT - rowspan */}
              <td
                className="border border-blue-500 px-2 py-1 w-20"
                rowSpan={numActions}
              >
                {row.swot}
              </td>
              {/* PESTLE - rowspan */}
              <td
                className="border border-blue-500 px-2 py-1 w-20"
                rowSpan={numActions}
              >
                {row.pestle}
              </td>
              {/* Interested Party - rowspan */}
              <td
                className="border border-blue-500 px-2 py-1 w-32"
                rowSpan={numActions}
              >
                {row.interestedParty}
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
                {row.process}
              </td>
              {/* Existing Risk/Mitigation Action/Exploitation Action - rowspan (içeriği objective'e göre değişebilir, burda generic yap) */}
              <td
                className="border border-blue-500 px-2 py-1 w-48"
                rowSpan={numActions}
              >
                {row.existingRisk || `${row.objective} Action`}{" "}
                {/* Örnek: "Mitigation Action" veya "Exploitation Action" */}
              </td>
              {/* Initial Risk: Severity - rowspan */}
              <td
                className="border border-blue-500 px-2 py-1 w-20"
                rowSpan={numActions}
              >
                {row.initialRisk?.severity || "Medium"}
              </td>
              {/* Initial Risk: Likelihood - rowspan */}
              <td
                className="border border-blue-500 px-2 py-1 w-24"
                rowSpan={numActions}
              >
                {row.initialRisk?.likelihood || "Possible"}
              </td>
              {/* Initial Risk: Risk Level - rowspan */}
              <td
                className="border border-blue-500 px-2 py-1 w-20"
                rowSpan={numActions}
              >
                {row.initialRisk?.riskLevel || "Medium"}
              </td>
              {/* İlk Action Plan'ın detayları (11 td) */}
              <td className="border border-blue-500 px-2 py-1 w-32">
                {actions[0]?.action || "Default Action"}
              </td>
              <td className="border border-blue-500 px-2 py-1 w-32">
                {actions[0]?.raiseDate || "2025-01-01"}
              </td>
              <td className="border border-blue-500 px-2 py-1 w-24">
                {actions[0]?.resources || "Team"}
              </td>
              <td className="border border-blue-500 px-2 py-1 w-28">
                {actions[0]?.function || "Department"}
              </td>
              <td className="border border-blue-500 px-2 py-1 w-28">
                {actions[0]?.responsible || "Person"}
              </td>
              <td className="border border-blue-500 px-2 py-1 w-24">
                {actions[0]?.deadline || "2025-06-01"}
              </td>
              <td className="border border-blue-500 px-2 py-1 w-36">
                {actions[0]?.actionStatus || "Pending"}
              </td>
              <td className="border border-blue-500 px-2 py-1 w-24">
                {actions[0]?.verification || "Pending"}{" "}
                {/* Örnekte farklı field'lar var, uyarla */}
              </td>
              <td className="border border-blue-500 px-2 py-1 w-32">
                {actions[0]?.comment || "N/A"}{" "}
                {/* Örnekte deadline-like, ama uyarla */}
              </td>
              <td className="border border-blue-500 px-2 py-1 w-36">
                {actions[0]?.verification || "Pending"}{" "}
                {/* Tekrar, field'ları senin verine göre ayarla */}
              </td>
              <td className="border border-blue-500 px-2 py-1 w-40">
                {actions[0]?.comment || "On track"}
              </td>
              {/* Residual Risk/Opportunity Level - rowspan */}
              <td
                className="border border-blue-500 px-2 py-1 w-24"
                rowSpan={numActions}
              >
                {row.initialRisk.severity || "Low"}
              </td>
              <td
                className="border border-blue-500 px-2 py-1 w-24"
                rowSpan={numActions}
              >
                {row.initialRisk.likelihood || "Unlikely"}{" "}
                {/* Varsa ekle, yoksa 'Unlikely' gibi */}
              </td>
              <td
                className="border border-blue-500 px-2 py-1 w-20"
                rowSpan={numActions}
              >
                {row.initialRisk.riskLevel || "Low"} {/* Varsa ekle */}
              </td>
            </tr>
            {/* Ek action plan'lar için sub-rows (ilkten sonrasını map'le) */}
            {actions.slice(1).map((action, actionIndex) => (
              <tr key={`${row.id}-action-${actionIndex}`}>
                {/* Action Plan detayları (11 td - rowspan yok, sadece action-specific) */}
                <td className="border border-blue-500 px-2 py-1 w-32">
                  {action?.action || "Default Action"}
                </td>
                <td className="border border-blue-500 px-2 py-1 w-32">
                  {action?.raiseDate || "2025-01-01"}
                </td>
                <td className="border border-blue-500 px-2 py-1 w-24">
                  {action?.resources || "Team"}
                </td>
                <td className="border border-blue-500 px-2 py-1 w-28">
                  {action?.function || "Department"}
                </td>
                <td className="border border-blue-500 px-2 py-1 w-28">
                  {action?.responsible || "Person"}
                </td>
                <td className="border border-blue-500 px-2 py-1 w-24">
                  {action?.deadline || "2025-06-01"}
                </td>
                <td className="border border-blue-500 px-2 py-1 w-36">
                  {action?.actionStatus || "Pending"}
                </td>
                <td className="border border-blue-500 px-2 py-1 w-24">
                  {action?.verification || "Pending"}
                </td>
                <td className="border border-blue-500 px-2 py-1 w-32">
                  {action?.comment || "N/A"}
                </td>
                <td className="border border-blue-500 px-2 py-1 w-36">
                  {action?.verification || "Pending"}
                </td>
                <td className="border border-blue-500 px-2 py-1 w-40">
                  {action?.comment || "On track"}
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
