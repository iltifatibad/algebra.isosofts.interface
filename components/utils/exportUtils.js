import * as XLSX from "xlsx";

export const getToken = () =>
  document.cookie
    .split("; ")
    .find((r) => r.startsWith("auth_token="))
    ?.split("=")
    .slice(1)
    .join("=") ?? "";

const flat = (val) => {
  if (val === null || val === undefined) return "";
  if (typeof val === "object" && val.value !== undefined) return val.value ?? "";
  if (typeof val === "object") return JSON.stringify(val);
  return val;
};

const riskLevel = (s, l) => {
  const score = (s || 0) * (l || 0);
  if (score === 0) return "";
  if (score <= 6) return `Low (${score})`;
  if (score <= 10) return `Medium (${score})`;
  return `High (${score})`;
};

const months = ["january","february","march","april","may","june","july","august","september","october","november","december"];
const monthLabels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export const MODULE_CONFIGS = {
  "kpi": {
    name: "KPI",
    endpoint: "/api/dashboard/kpi",
    statuses: ["active"],
    isKpiOpi: true,
    columns: [
      { key:"no", label:"No" },
      { key:"title", label:"KPI" },
      { key:"function", label:"Function" },
      { key:"lykpi", label:"Last Year KPI" },
      { key:"actualKPI", label:"Actual KPI" },
      { key:"annualTarget", label:"Annual Target" },
      ...months.map((m, i) => ({ key: m, label: monthLabels[i] })),
    ],
  },
  "opi": {
    name: "OPI",
    endpoint: "/api/dashboard/opi/all",
    statuses: ["active","archived","deleted"],
    isKpiOpi: true,
    columns: [
      { key:"no", label:"No" },
      { key:"title", label:"Title" },
      { key:"function", label:"Function" },
      { key:"lykpi", label:"Last Year Value" },
      { key:"actualKPI", label:"Actual KPI" },
      { key:"annualTarget", label:"Annual Target" },
      ...months.map((m, i) => ({ key: m, label: monthLabels[i] })),
    ],
  },
  "bg-reg": {
    name: "Business Risk Register",
    endpoint: "/api/register/br/all",
    statuses: ["active","archived","deleted"],
    columns: [
      { key:"no", label:"No" },
      { key:"swot", label:"SWOT" },
      { key:"pestle", label:"PESTLE" },
      { key:"interestedParty", label:"Interested Party" },
      { key:"riskOpportunity", label:"Risk / Opportunity" },
      { key:"objective", label:"Objective" },
      { key:"kpi", label:"KPI" },
      { key:"process", label:"Process" },
      { key:"ecm", label:"Existing Controls (ECM)" },
      { key:"acm", label:"Additional Controls (ACM)" },
      { key:"initialRiskSeverity", label:"Initial Severity" },
      { key:"initialRiskLikelihood", label:"Initial Likelihood" },
      { label:"Initial Risk Level", getValue: r => riskLevel(r.initialRiskSeverity, r.initialRiskLikelihood) },
      { key:"residualRiskSeverity", label:"Residual Severity" },
      { key:"residualRiskLikelihood", label:"Residual Likelihood" },
      { label:"Residual Risk Level", getValue: r => riskLevel(r.residualRiskSeverity, r.residualRiskLikelihood) },
      { key:"comment", label:"Comment" },
    ],
  },
  "hs-reg": {
    name: "H&S Risk Register",
    endpoint: "/api/register/hsr/all",
    statuses: ["active","archived","deleted"],
    columns: [
      { key:"no", label:"No" },
      { key:"process", label:"Process" },
      { key:"hazard", label:"Hazard" },
      { key:"risk", label:"Risk" },
      { key:"affectedPositions", label:"Affected Position" },
      { key:"ecm", label:"Existing Controls (ECM)" },
      { key:"acm", label:"Additional Controls (ACM)" },
      { key:"initialRiskSeverity", label:"Initial Severity" },
      { key:"initialRiskLikelihood", label:"Initial Likelihood" },
      { label:"Initial Risk Level", getValue: r => riskLevel(r.initialRiskSeverity, r.initialRiskLikelihood) },
      { key:"residualRiskSeverity", label:"Residual Severity" },
      { key:"residualRiskLikelihood", label:"Residual Likelihood" },
      { label:"Residual Risk Level", getValue: r => riskLevel(r.residualRiskSeverity, r.residualRiskLikelihood) },
      { key:"comment", label:"Comment" },
    ],
  },
  "leg-reg": {
    name: "Legal & Compliance Register",
    endpoint: "/api/register/leg/all",
    statuses: ["active","archived","deleted"],
    columns: [
      { key:"no", label:"No" },
      { key:"process", label:"Process" },
      { key:"legislation", label:"Legislation" },
      { key:"section", label:"Section" },
      { key:"requirement", label:"Requirement" },
      { key:"riskOfViolation", label:"Risk of Violation" },
      { key:"affectedPositions", label:"Affected Position" },
      { key:"ecm", label:"Existing Controls (ECM)" },
      { key:"acm", label:"Additional Controls (ACM)" },
      { key:"initialRiskSeverity", label:"Initial Severity" },
      { key:"initialRiskLikelihood", label:"Initial Likelihood" },
      { label:"Initial Risk Level", getValue: r => riskLevel(r.initialRiskSeverity, r.initialRiskLikelihood) },
      { key:"residualRiskSeverity", label:"Residual Severity" },
      { key:"residualRiskLikelihood", label:"Residual Likelihood" },
      { label:"Residual Risk Level", getValue: r => riskLevel(r.residualRiskSeverity, r.residualRiskLikelihood) },
      { key:"comment", label:"Comment" },
    ],
  },
  "env-reg": {
    name: "Environmental Aspects & Impacts",
    endpoint: "/api/register/eai/all",
    statuses: ["active","archived","deleted"],
    columns: [
      { key:"no", label:"No" },
      { key:"process", label:"Process" },
      { key:"aspect", label:"Aspect" },
      { key:"impact", label:"Impact" },
      { key:"affectedReceptors", label:"Affected Receptors" },
      { key:"ecm", label:"Existing Controls (ECM)" },
      { key:"acm", label:"Additional Controls (ACM)" },
      { key:"idosProbability", label:"Initial Probability" },
      { key:"idosSeverity", label:"Initial Severity" },
      { key:"idosDuration", label:"Initial Duration" },
      { key:"idosScale", label:"Initial Scale" },
      { label:"Initial Significance", getValue: r => ((r.idosProbability||0)*(r.idosSeverity||0)*(r.idosDuration||0)*(r.idosScale||0)) || "" },
      { key:"rdosProbability", label:"Residual Probability" },
      { key:"rdosSeverity", label:"Residual Severity" },
      { key:"rdosDuration", label:"Residual Duration" },
      { key:"rdosScale", label:"Residual Scale" },
      { label:"Residual Significance", getValue: r => ((r.rdosProbability||0)*(r.rdosSeverity||0)*(r.rdosDuration||0)*(r.rdosScale||0)) || "" },
      { key:"comment", label:"Comment" },
    ],
  },
  "eq-reg": {
    name: "Equipment & Inventories",
    endpoint: "/api/register/ei/all",
    statuses: ["active","archived","deleted"],
    columns: [
      { key:"no", label:"No" },
      { key:"name", label:"Name" },
      { key:"type", label:"Type" },
      { key:"serialNumber", label:"Serial Number" },
      { key:"certificateNo", label:"Certificate No." },
      { key:"calibrationRequired", label:"Calibration Required" },
      { key:"inspectionFrequency", label:"Inspection Frequency" },
      { key:"icd", label:"ICD (Initial Calibration Date)" },
      { key:"nvcd", label:"NVCD (Next Valid Calibration Date)" },
      { key:"comment", label:"Comment" },
    ],
  },
  "tr-reg": {
    name: "Training Register",
    endpoint: "/api/register/tra/all",
    statuses: ["active","archived","deleted"],
    columns: [
      { key:"no", label:"No" },
      { key:"employeeName", label:"Employee Name" },
      { key:"tcln", label:"TCLN" },
      { key:"position", label:"Position" },
      { key:"clnumber", label:"CL Number" },
      { key:"trainingFrequency", label:"Training Frequency" },
      { key:"ncd", label:"NCD (Next Competency Date)" },
      { key:"nvcd", label:"NVCD (Next Valid Cert. Date)" },
      { key:"effectiveness", label:"Effectiveness" },
      { key:"comment", label:"Comment" },
    ],
  },
  "doc-reg": {
    name: "Document Register",
    endpoint: "/api/register/doc/all",
    statuses: ["active","archived","deleted"],
    columns: [
      { key:"no", label:"No" },
      { key:"name", label:"Document Name" },
      { key:"origin", label:"Origin" },
      { key:"number", label:"Number" },
      { key:"type", label:"Type" },
      { key:"revNumber", label:"Revision Number" },
      { key:"issuer", label:"Issuer" },
      { key:"approver", label:"Approver" },
      { key:"issueDate", label:"Issue Date" },
      { key:"nextReviewDate", label:"Next Review Date" },
      { key:"comment", label:"Comment" },
    ],
  },
  "ven-reg": {
    name: "Vendor Register",
    endpoint: "/api/register/ven/all",
    statuses: ["active","archived","deleted"],
    columns: [
      { key:"no", label:"No" },
      { key:"name", label:"Vendor Name" },
      { key:"regNumber", label:"Registration Number" },
      { key:"scope1", label:"Scope 1" },
      { key:"scope2", label:"Scope 2" },
      { key:"scope3", label:"Scope 3" },
      { key:"registrationDate", label:"Registration Date" },
      { key:"nrd", label:"Next Review Date" },
      { key:"comment", label:"Comment" },
    ],
  },
  "cus-reg": {
    name: "Customer Register",
    endpoint: "/api/register/cus/all",
    statuses: ["active","archived","deleted"],
    columns: [
      { key:"no", label:"No" },
      { key:"name", label:"Customer Name" },
      { key:"regNumber", label:"Registration Number" },
      { key:"scope1", label:"Scope 1" },
      { key:"scope2", label:"Scope 2" },
      { key:"scope3", label:"Scope 3" },
      { key:"registrationDate", label:"Registration Date" },
      { key:"reviewDate", label:"Review Date" },
      { key:"comment", label:"Comment" },
    ],
  },
  "fb-reg": {
    name: "Feedback Register",
    endpoint: "/api/register/fb/all",
    statuses: ["active","archived","deleted"],
    columns: [
      { key:"no", label:"No" },
      { key:"jobNumber", label:"Job Number" },
      { key:"jobStartDate", label:"Job Start Date" },
      { key:"jobCompletionDate", label:"Job Completion Date" },
      { key:"customerName", label:"Customer" },
      { key:"qgs", label:"Quality of Goods/Services" },
      { key:"communication", label:"Communication" },
      { key:"hs", label:"Health & Safety" },
      { key:"environment", label:"Environment" },
      { key:"otd", label:"On-Time Delivery" },
      { key:"documentation", label:"Documentation" },
      { key:"comment", label:"Comment" },
    ],
  },
  "ear-reg": {
    name: "Employee Appraisal Register",
    endpoint: "/api/register/ea/all",
    statuses: ["active","archived","deleted"],
    columns: [
      { key:"no", label:"No" },
      { key:"employeeName", label:"Employee Name" },
      { key:"position", label:"Position" },
      { key:"lineManager", label:"Line Manager" },
      { key:"esd", label:"Employment Start Date" },
      { key:"appraisalDate", label:"Appraisal Date" },
      { key:"nextAppraisalDate", label:"Next Appraisal Date" },
      { key:"appraisalType", label:"Appraisal Type" },
      { key:"jobQuality", label:"Job Quality (0-5)" },
      { key:"leadershipSkills", label:"Leadership Skills (0-5)" },
      { key:"managementSkills", label:"Management Skills (0-5)" },
      { key:"behavioralSkills", label:"Behavioral Skills (0-5)" },
      { key:"effectivenessOfTrainings", label:"Training Effectiveness (0-5)" },
      { key:"tca", label:"Training & Competency Assessment" },
      { key:"skillsAppraisal", label:"Skills Appraisal" },
      { key:"comment", label:"Comment" },
    ],
  },
  "fl-reg": {
    name: "Findings Log",
    endpoint: "/api/register/fin/all",
    statuses: ["active","archived","deleted"],
    columns: [
      { key:"no", label:"No" },
      { key:"issuer", label:"Issuer" },
      { key:"findingDate", label:"Finding Date" },
      { key:"jobNumber", label:"Job Number" },
      { key:"process", label:"Process" },
      { key:"categoryOfFinding", label:"Category" },
      { key:"typeOfFinding", label:"Type" },
      { key:"sourceOfFinding", label:"Source" },
      { key:"customerName", label:"Customer" },
      { key:"vendorName", label:"Vendor" },
      { key:"description", label:"Description" },
      { key:"containmentAction", label:"Containment Action" },
      { key:"rootCauses", label:"Root Causes" },
      { key:"findingStatus", label:"Status" },
      { key:"comment", label:"Comment" },
    ],
  },
  "ao-reg": {
    name: "Assurance & Oversight",
    endpoint: "/api/register/aop/all",
    statuses: ["active","archived","deleted"],
    columns: [
      { key:"no", label:"No" },
      { key:"activityDescription", label:"Activity Description" },
      { key:"auditorInspector", label:"Auditor / Inspector" },
      { key:"auditeeInspectee", label:"Auditee / Inspectee" },
      { key:"reviewedPremises", label:"Reviewed Premises" },
      { key:"reviewedProcess", label:"Reviewed Process" },
      { key:"rtic", label:"RTIC" },
      { key:"inspectionFrequency", label:"Frequency" },
      { key:"aoaDate", label:"Activity Date" },
      { key:"nextAoaDate", label:"Next Activity Date" },
      { key:"comment", label:"Comment" },
    ],
  },
  "mr-reg": {
    name: "Management Review",
    endpoint: "/api/register/mrm/all",
    statuses: ["active","archived","deleted"],
    columns: [
      { key:"no", label:"No" },
      { key:"risos", label:"Review Input / Source" },
      { key:"topic", label:"Topic" },
      { key:"process", label:"Process" },
      { key:"comment", label:"Comment" },
    ],
  },
  "moc-reg": {
    name: "Management of Change",
    endpoint: "/api/register/moc/all",
    statuses: ["active","archived","deleted"],
    columns: [
      { key:"no", label:"No" },
      { key:"issuer", label:"Issuer" },
      { key:"issuerDate", label:"Issue Date" },
      { key:"reasonOfChange", label:"Reason of Change" },
      { key:"process", label:"Process" },
      { key:"changeDescription", label:"Change Description" },
      { key:"ecm", label:"Existing Controls (ECM)" },
      { key:"risks", label:"Risks" },
      { key:"approval", label:"Approved" },
      { key:"acm", label:"Additional Controls (ACM)" },
      { key:"initialRiskSeverity", label:"Initial Severity" },
      { key:"initialRiskLikelihood", label:"Initial Likelihood" },
      { label:"Initial Risk Level", getValue: r => riskLevel(r.initialRiskSeverity, r.initialRiskLikelihood) },
      { key:"residualRiskSeverity", label:"Residual Severity" },
      { key:"residualRiskLikelihood", label:"Residual Likelihood" },
      { label:"Residual Risk Level", getValue: r => riskLevel(r.residualRiskSeverity, r.residualRiskLikelihood) },
      { key:"comment", label:"Comment" },
    ],
  },
  "ac-reg": {
    name: "Action Log",
    endpoint: "/api/dashboard/actionLog/all?status=active",
    statuses: ["active"],
    columns: [
      { key:"no", label:"No" },
      { key:"title", label:"Action" },
      { key:"raiseDate", label:"Raise Date" },
      { key:"resources", label:"Resources" },
      { key:"relativeFunction", label:"Relative Function" },
      { key:"responsible", label:"Responsible" },
      { key:"deadline", label:"Deadline" },
      { key:"confirmation", label:"Confirmation" },
      { key:"status", label:"Status" },
      { key:"completionDate", label:"Completion Date" },
      { key:"verificationStatus", label:"Verification Status" },
      { key:"comment", label:"Comment" },
    ],
  },
};

// ── Data Fetching ─────────────────────────────────────────────

export const fetchData = async (endpoint, status) => {
  const token = getToken();
  const sep = endpoint.includes("?") ? "&" : "?";
  const statusParam = status === "active" ? "" : `&status=${status}`;
  const url = `${endpoint}${sep}token=${token}${statusParam}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

// ── Data → Rows ───────────────────────────────────────────────

export const dataToRows = (data, columns, visual = false) => {
  const headers = columns.map((c) => c.label);
  const rows = data.map((row) =>
    columns.map((col) => {
      if (col.getValue) return col.getValue(row);
      const val = row[col.key];
      return flat(val);
    })
  );
  return [headers, ...rows];
};

// ── Column Width Auto-fit ─────────────────────────────────────

const setColWidths = (ws, rows) => {
  if (!rows.length) return;
  const cols = rows[0].map((_, ci) => ({
    wch: Math.min(40, Math.max(10, ...rows.map((r) => String(r[ci] ?? "").length + 2))),
  }));
  ws["!cols"] = cols;
};

// ── Style helpers ─────────────────────────────────────────────

const applyHeaderStyle = (ws, colCount) => {
  for (let c = 0; c < colCount; c++) {
    const addr = XLSX.utils.encode_cell({ r: 0, c });
    if (!ws[addr]) continue;
    ws[addr].s = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "3B5998" } },
      alignment: { horizontal: "center" },
    };
  }
};

// ── KPI/OPI Visual Export ─────────────────────────────────────

const buildKpiOpiVisual = (data, config) => {
  const rows = [
    [...config.columns.map((c) => c.label), "Performance"],
    ...data.map((row) => {
      const vals = config.columns.map((col) => {
        if (col.getValue) return col.getValue(row);
        return flat(row[col.key]);
      });
      const actual = row.actualKPI ?? 0;
      const target = row.annualTarget ?? 0;
      const perf =
        target === 0
          ? "N/A"
          : actual >= target
          ? "✅ On Target"
          : actual >= target * 0.9
          ? "⚠️ Near Target"
          : "❌ Below Target";
      return [...vals, perf];
    }),
  ];
  return rows;
};

// ── Sheet name sanitizer ──────────────────────────────────────

const sheetName = (name, suffix = "") => {
  const s = `${name}${suffix ? " " + suffix : ""}`.replace(/[\\/*?[\]:]/g, "-");
  return s.length > 31 ? s.substring(0, 31) : s;
};

// ── Single Module Export ──────────────────────────────────────

export const exportModule = async (moduleKey, statuses, visual = false) => {
  const config = MODULE_CONFIGS[moduleKey];
  if (!config) return;

  const wb = XLSX.utils.book_new();
  const allowedStatuses = statuses.filter((s) => config.statuses.includes(s));

  for (const status of allowedStatuses) {
    const data = await fetchData(config.endpoint, status);
    if (!data.length) continue;

    const rows =
      visual && config.isKpiOpi
        ? buildKpiOpiVisual(data, config)
        : dataToRows(data, config.columns);

    const ws = XLSX.utils.aoa_to_sheet(rows);
    setColWidths(ws, rows);
    applyHeaderStyle(ws, config.columns.length);
    XLSX.utils.book_append_sheet(wb, ws, sheetName(status.charAt(0).toUpperCase() + status.slice(1)));
  }

  if (!wb.SheetNames.length) {
    alert("No data found for the selected filters.");
    return;
  }

  XLSX.writeFile(wb, `${config.name}.xlsx`);
};

// ── All Modules Export ────────────────────────────────────────

export const exportAll = async (statuses, visual = false, onProgress) => {
  const wb = XLSX.utils.book_new();
  const entries = Object.entries(MODULE_CONFIGS);
  let done = 0;

  for (const [key, config] of entries) {
    const allowedStatuses = statuses.filter((s) => config.statuses.includes(s));
    for (const status of allowedStatuses) {
      const data = await fetchData(config.endpoint, status);
      if (data.length) {
        const rows =
          visual && config.isKpiOpi
            ? buildKpiOpiVisual(data, config)
            : dataToRows(data, config.columns);
        const ws = XLSX.utils.aoa_to_sheet(rows);
        setColWidths(ws, rows);
        applyHeaderStyle(ws, config.columns.length);
        const sn = sheetName(
          config.name.substring(0, 20),
          status === "active" ? "" : `(${status.charAt(0).toUpperCase()})`
        );
        XLSX.utils.book_append_sheet(wb, ws, sn);
      }
    }
    done++;
    if (onProgress) onProgress(Math.round((done / entries.length) * 100));
  }

  if (!wb.SheetNames.length) {
    alert("No data found for the selected filters.");
    return;
  }

  XLSX.writeFile(wb, "IsoSofts_Full_Export.xlsx");
};
