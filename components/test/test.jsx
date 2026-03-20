import { useState } from "react";

export default function RiskTableee() {
  const [selectedRows, setSelectedRows] = useState(new Set());

  const onCheckboxChange = (id) => {
    const copy = new Set(selectedRows);
    copy.has(id) ? copy.delete(id) : copy.add(id);
    setSelectedRows(copy);
  };
  const getRiskLevel = (severity, likelihood) => {
  const score = severity * likelihood;

  if (score <= 5)
    return { label: "Low", color: "bg-green-100 text-green-700 border border-green-300" };
  if (score <= 12)
    return { label: "Medium", color: "bg-yellow-100 text-yellow-700 border border-yellow-300" };
  return { label: "High", color: "bg-red-100 text-red-700 border border-red-300" };
};
const SoftBadge = ({ value, color }) => {
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>
      {value}
    </span>
  );
};
const staticData = [
  {
    id: 1,
    no: 1,
    swot: { value: "S" },
    pestle: { value: "E" },
    interestedParty: { value: "Customer" },
    riskOpportunity: "System failure",
    objective: "Service continuity",
    kpi: "99%",
    process: { value: "IT" },
    ermeoa: { value: "ERP Failure" },
    initialRiskSeverity: 4,
    initialRiskLikelihood: 3,
    residualRiskSeverity: 2,
    residualRiskLikelihood: 2
  },
  {
    id: 2,
    no: 2,
    swot: { value: "W" },
    pestle: { value: "T" },
    interestedParty: { value: "Management" },
    riskOpportunity: "Data loss",
    objective: "Data safety",
    kpi: "100%",
    process: { value: "Security" },
    ermeoa: { value: "Backup risk" },
    initialRiskSeverity: 5,
    initialRiskLikelihood: 4,
    residualRiskSeverity: 2,
    residualRiskLikelihood: 1
  }
];


  return (
    <table className="border w-full border-collapse text-sm">
      <thead>
        <tr className="bg-gray-100 text-center font-semibold">
          <th>No</th>
          <th>SWOT</th>
          <th>PESTLE</th>
          <th>Party</th>
          <th>Risk</th>
          <th>Objective</th>
          <th>KPI</th>
          <th>Process</th>
          <th>ERMEOA</th>

          <th colSpan="3">Initial Risk</th>
          <th colSpan="3">Residual Risk</th>
        </tr>

        <tr className="bg-gray-200 text-center text-xs">
          <th colSpan={9}></th>

          <th>Severity</th>
          <th>Likelihood</th>
          <th>Level</th>

          <th>Severity</th>
          <th>Likelihood</th>
          <th>Level</th>
        </tr>
      </thead>

      <tbody>
        {staticData.map((row, index) => (
          <tr
            key={row.id}
            className={`border-b ${
              index % 2 === 0 ? "bg-white" : "bg-green-50"
            }`}
          >
            <td className="border px-2">
              <input
                type="checkbox"
                checked={selectedRows.has(row.id)}
                onChange={() => onCheckboxChange(row.id)}
              />{" "}
              {row.no}
            </td>

            <td className="border px-2"><SoftBadge value={row.swot.value} color="bg-rose-100 text-rose-700" /></td>
            <td className="border px-2"><SoftBadge value={row.pestle.value} color="bg-blue-100 text-blue-700" /></td>
            <td className="border px-2"><SoftBadge value={row.interestedParty.value} color="bg-green-100 text-green-700" /></td>

            <td className="border px-2">{row.riskOpportunity}</td>
            <td className="border px-2">{row.objective}</td>
            <td className="border px-2">{row.kpi}</td>
            <td className="border px-2"><SoftBadge value={row.process.value} color="bg-cyan-100 text-cyan-700" /></td>
            <td className="border px-2">{row.ermeoa.value}</td>

            {/* Initial */}
            <td className="border px-2">{row.initialRiskSeverity}</td>
            <td className="border px-2">{row.initialRiskLikelihood}</td>
            <td className="border px-2">
              <SoftBadge {...getRiskLevel(row.initialRiskSeverity, row.initialRiskLikelihood)} />
            </td>

            {/* Residual */}
            <td className="border px-2">{row.residualRiskSeverity}</td>
            <td className="border px-2">{row.residualRiskLikelihood}</td>
            <td className="border px-2">
              <SoftBadge {...getRiskLevel(row.residualRiskSeverity, row.residualRiskLikelihood)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
