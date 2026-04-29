const actionFields = [
  { name: "Action", type: "Text", required: true, description: "The action to be taken to address the risk or issue. Describe clearly what needs to be done.", example: "Update safety procedure document" },
  { name: "Raise Date", type: "Date", required: true, description: "The date the action was raised/created.", example: "2025-01-15" },
  { name: "Resources", type: "Text", required: false, description: "Resources needed to complete this action (budget, personnel, equipment).", example: "HSE Team, $500 budget" },
  { name: "Relative Function", type: "Dropdown", required: false, description: "The department or function responsible for this action.", example: "Operations" },
  { name: "Responsible", type: "Dropdown", required: true, description: "The person responsible for completing the action.", example: "John Smith" },
  { name: "Deadline", type: "Date", required: true, description: "The target date by which the action must be completed.", example: "2025-03-31" },
  { name: "Action Confirmation", type: "Dropdown", required: false, description: "Confirmation status — whether the action has been verified and confirmed.", example: "Confirmed" },
  { name: "Action Status", type: "Dropdown", required: true, description: "Current progress status of the action (Open, In Progress, Closed, etc.).", example: "In Progress" },
  { name: "Completion Date", type: "Date", required: false, description: "The actual date the action was completed.", example: "2025-02-28" },
  { name: "Verification Status", type: "Dropdown", required: false, description: "Whether the completed action has been independently verified as effective.", example: "Verified" },
  { name: "Comment", type: "Text", required: false, description: "Any additional notes or remarks about the action.", example: "Escalated to management for approval" },
];

const monthlyFields = ["January","February","March","April","May","June","July","August","September","October","November","December"].map(m => ({
  name: m,
  type: "Dropdown",
  required: false,
  description: `Action status for ${m}. Select the status that applies for this month.`,
  example: "On Track",
}));

const howToAddGeneric = (moduleName) => [
  `Click the "Add ${moduleName}" button in the toolbar.`,
  "Fill in all required fields marked in the form.",
  "Review optional fields and fill them where applicable.",
  `Click "Add ${moduleName}" to save the record.`,
  "To edit: select one row using the checkbox, then click the Edit (pencil) icon.",
  "To delete: select rows using checkboxes, then click the Delete (trash) icon.",
  "To archive: select rows and click the Archive icon.",
  "To view archived/deleted records: click the 'Show Archived' or 'Show Deleted' button.",
];

// ─────────────────────────────────────────────
// Business Risk (BG-Risk) — profile.jsx
// ─────────────────────────────────────────────
export const bgHelpContent = {
  title: "Business Risk Register",
  subtitle: "ISO 9001 / Context of Organization",
  description: "Record and manage business-level risks and opportunities identified through SWOT/PESTLE analysis. Each entry links an interested party and organizational objective to a risk, with control measures and risk scoring.",
  howToAdd: howToAddGeneric("Risk"),
  sections: [
    {
      title: "Risk Details",
      icon: "fa-shield-halved",
      fields: [
        { name: "SWOT", type: "Text", required: false, description: "SWOT classification — Strength, Weakness, Opportunity, or Threat.", example: "Weakness" },
        { name: "PESTLE", type: "Text", required: false, description: "PESTLE factor — Political, Economic, Social, Technological, Legal, or Environmental.", example: "Legal" },
        { name: "Interested Party", type: "Text", required: false, description: "The stakeholder or interested party related to this risk.", example: "Regulatory Authority" },
        { name: "Risk / Opportunity", type: "Text", required: true, description: "Description of the identified risk or opportunity.", example: "Non-compliance with new ISO standard requirements" },
        { name: "Objective", type: "Text", required: false, description: "The organizational objective this risk relates to.", example: "Maintain ISO 9001 certification" },
        { name: "KPI", type: "Text", required: false, description: "The Key Performance Indicator used to measure this risk area.", example: "Audit findings < 5 per year" },
        { name: "Process", type: "Dropdown", required: true, description: "The business process associated with this risk.", example: "Quality Management" },
        { name: "Existing Control Measures (ECM)", type: "Text", required: false, description: "Controls already in place to manage this risk.", example: "Annual internal audits" },
        { name: "Additional Control Measures (ACM)", type: "Text", required: false, description: "New or additional controls to be implemented.", example: "Quarterly compliance reviews" },
        { name: "Comment", type: "Text", required: false, description: "Any additional information about this risk entry.", example: "Review scheduled for Q2" },
      ],
    },
    {
      title: "Initial Risk Scoring",
      icon: "fa-triangle-exclamation",
      fields: [
        { name: "Severity", type: "Number (1–5)", required: true, description: "How severe the impact would be if the risk occurs. 1 = Negligible, 5 = Catastrophic.", example: "4" },
        { name: "Likelihood", type: "Number (1–5)", required: true, description: "How likely the risk is to occur before any additional controls. 1 = Rare, 5 = Almost certain.", example: "3" },
        { name: "Level", type: "Auto-calculated", required: false, description: "Risk level calculated automatically: Severity × Likelihood. Low (1–6), Medium (8–10), High (12–25).", example: "High" },
      ],
    },
    {
      title: "Residual Risk Scoring",
      icon: "fa-chart-line",
      fields: [
        { name: "Severity", type: "Number (1–5)", required: true, description: "Severity after existing and additional control measures are applied.", example: "2" },
        { name: "Likelihood", type: "Number (1–5)", required: true, description: "Likelihood after controls are applied.", example: "2" },
        { name: "Level", type: "Auto-calculated", required: false, description: "Residual risk level after controls. Target should be Low.", example: "Low" },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// Health & Safety — hsprofile.jsx
// ─────────────────────────────────────────────
export const hsHelpContent = {
  title: "Health & Safety Risk Register",
  subtitle: "ISO 45001 / Hazard Identification",
  description: "Identify and assess workplace hazards and their associated health & safety risks. Link each hazard to a process, assign affected positions, and apply control measures to reduce risk to acceptable levels.",
  howToAdd: howToAddGeneric("H&S Risk"),
  sections: [
    {
      title: "Hazard Details",
      icon: "fa-hard-hat",
      fields: [
        { name: "Process", type: "Dropdown", required: true, description: "The work process or activity where the hazard exists.", example: "Welding Operations" },
        { name: "Hazard", type: "Text", required: true, description: "The source of potential harm or danger identified.", example: "UV radiation from welding arc" },
        { name: "Risk", type: "Text", required: true, description: "The potential injury or harm that could result from the hazard.", example: "Eye damage / Arc eye" },
        { name: "Affected Position", type: "Dropdown", required: true, description: "Job role(s) exposed to this hazard.", example: "Welder, Supervisor" },
        { name: "ERMA", type: "Text", required: false, description: "Existing Risk Mitigation Actions — controls currently in place.", example: "Welding screens, PPE provided" },
        { name: "Existing Control Measures (ECM)", type: "Text", required: false, description: "Detailed description of existing engineering or administrative controls.", example: "Local exhaust ventilation, safety screens" },
        { name: "Additional Control Measures (ACM)", type: "Text", required: false, description: "New controls to be implemented to further reduce risk.", example: "Mandatory eye protection, signage" },
        { name: "Comment", type: "Text", required: false, description: "Additional remarks about this hazard.", example: "Training scheduled for Q1" },
      ],
    },
    {
      title: "Initial Risk Scoring",
      icon: "fa-triangle-exclamation",
      fields: [
        { name: "Severity", type: "Number (1–5)", required: true, description: "Potential severity of injury. 1 = First Aid, 5 = Fatality.", example: "4" },
        { name: "Likelihood", type: "Number (1–5)", required: true, description: "Likelihood of the incident occurring without additional controls.", example: "3" },
        { name: "Level", type: "Auto-calculated", required: false, description: "Risk level: Severity × Likelihood. Low (1–6), Medium (8–10), High (12–25).", example: "High" },
      ],
    },
    {
      title: "Residual Risk Scoring",
      icon: "fa-chart-line",
      fields: [
        { name: "Severity", type: "Number (1–5)", required: true, description: "Severity after all control measures are applied.", example: "2" },
        { name: "Likelihood", type: "Number (1–5)", required: true, description: "Likelihood after all controls are applied.", example: "2" },
        { name: "Level", type: "Auto-calculated", required: false, description: "Residual risk level. Should be Low after effective controls.", example: "Low" },
      ],
    },
    {
      title: "Action Plan Fields",
      icon: "fa-list-check",
      fields: actionFields,
    },
  ],
};

// ─────────────────────────────────────────────
// Legislation — legprofile.jsx
// ─────────────────────────────────────────────
export const legHelpContent = {
  title: "Legal & Compliance Register",
  subtitle: "Regulatory Requirements Tracking",
  description: "Track all applicable legal, regulatory, and other compliance requirements. For each requirement, assess the risk of violation and document controls to ensure compliance.",
  howToAdd: howToAddGeneric("Legislation"),
  sections: [
    {
      title: "Legislation Details",
      icon: "fa-scale-balanced",
      fields: [
        { name: "Process", type: "Dropdown", required: true, description: "The business process this legislation applies to.", example: "Environmental Management" },
        { name: "Legislation", type: "Text", required: true, description: "Name or title of the applicable law, regulation, or standard.", example: "ISO 14001:2015, Environmental Protection Act" },
        { name: "Section", type: "Text", required: false, description: "The specific section, clause, or article of the legislation.", example: "Section 4.3 – Compliance Obligations" },
        { name: "Requirement", type: "Text", required: true, description: "What the legislation requires the organization to do.", example: "Maintain a register of applicable environmental legislation" },
        { name: "Risk of Violation", type: "Text", required: false, description: "Description of the risk or consequence if the requirement is not met.", example: "Regulatory fine, loss of operating license" },
        { name: "Affected Position", type: "Dropdown", required: false, description: "Job roles responsible for or affected by this requirement.", example: "Environmental Manager, Operations Director" },
        { name: "Existing Control Measures (ECM)", type: "Text", required: false, description: "Controls currently in place to ensure compliance.", example: "Annual compliance audit" },
        { name: "Additional Control Measures (ACM)", type: "Text", required: false, description: "Additional controls needed to ensure ongoing compliance.", example: "Monthly compliance checklist review" },
        { name: "Comment", type: "Text", required: false, description: "Any additional notes about this compliance requirement.", example: "Next review: Q3 2025" },
      ],
    },
    {
      title: "Initial Risk Scoring",
      icon: "fa-triangle-exclamation",
      fields: [
        { name: "Severity", type: "Number (1–5)", required: true, description: "Severity of impact if the legislation is violated.", example: "5" },
        { name: "Likelihood", type: "Number (1–5)", required: true, description: "Likelihood of a violation occurring without controls.", example: "2" },
        { name: "Level", type: "Auto-calculated", required: false, description: "Risk level automatically calculated. High scores require urgent action.", example: "Medium" },
      ],
    },
    {
      title: "Residual Risk Scoring",
      icon: "fa-chart-line",
      fields: [
        { name: "Severity", type: "Number (1–5)", required: true, description: "Severity after controls are applied.", example: "3" },
        { name: "Likelihood", type: "Number (1–5)", required: true, description: "Likelihood after controls are applied.", example: "1" },
        { name: "Level", type: "Auto-calculated", required: false, description: "Residual risk after compliance controls.", example: "Low" },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// Environmental — envprofile.jsx
// ─────────────────────────────────────────────
export const envHelpContent = {
  title: "Environmental Aspects & Impacts",
  subtitle: "ISO 14001 / Environmental Register",
  description: "Identify and evaluate the environmental aspects of your operations and their associated impacts. Use the IDOS methodology (Probability, Severity, Duration, Scale) to score both initial and residual significance.",
  howToAdd: howToAddGeneric("Environmental Entry"),
  sections: [
    {
      title: "Aspect & Impact Details",
      icon: "fa-leaf",
      fields: [
        { name: "Process", type: "Dropdown", required: true, description: "The process or activity that produces this environmental aspect.", example: "Chemical Storage" },
        { name: "Aspect", type: "Text", required: true, description: "The element of the activity that can interact with the environment.", example: "Chemical spillage" },
        { name: "Impact", type: "Text", required: true, description: "The change to the environment resulting from the aspect.", example: "Soil and groundwater contamination" },
        { name: "Affected Receptors", type: "Text", required: false, description: "Environmental components or communities affected.", example: "Local groundwater, nearby residents" },
        { name: "Existing Control Measures (ECM)", type: "Text", required: false, description: "Controls already in place to manage the environmental impact.", example: "Secondary containment bunds" },
        { name: "Additional Control Measures (ACM)", type: "Text", required: false, description: "New controls to reduce the environmental significance.", example: "Spill response training" },
        { name: "Comment", type: "Text", required: false, description: "Additional notes about this aspect/impact entry.", example: "Next review after facility expansion" },
      ],
    },
    {
      title: "Initial Significance (IDOS)",
      icon: "fa-triangle-exclamation",
      fields: [
        { name: "Probability", type: "Number (1–5)", required: true, description: "How likely the aspect is to occur.", example: "3" },
        { name: "Severity", type: "Number (1–5)", required: true, description: "How severe the environmental impact would be.", example: "4" },
        { name: "Duration", type: "Number (1–5)", required: true, description: "How long the environmental impact would last.", example: "3" },
        { name: "Scale", type: "Number (1–5)", required: true, description: "The geographic scale of the impact (local to global).", example: "2" },
      ],
    },
    {
      title: "Residual Significance (RDOS)",
      icon: "fa-chart-line",
      fields: [
        { name: "Probability", type: "Number (1–5)", required: true, description: "Probability after controls are applied.", example: "1" },
        { name: "Severity", type: "Number (1–5)", required: true, description: "Severity after controls are applied.", example: "2" },
        { name: "Duration", type: "Number (1–5)", required: true, description: "Duration after controls are applied.", example: "1" },
        { name: "Scale", type: "Number (1–5)", required: true, description: "Scale after controls are applied.", example: "1" },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// Equipment & Inventories — eiprofile.jsx
// ─────────────────────────────────────────────
export const eiHelpContent = {
  title: "Equipment & Inventories Register",
  subtitle: "Asset Tracking & Calibration",
  description: "Maintain a complete register of equipment and tools. Track calibration requirements, inspection frequencies, certification numbers, and equipment status to ensure assets remain fit for purpose.",
  howToAdd: howToAddGeneric("Equipment"),
  sections: [
    {
      title: "Equipment Details",
      icon: "fa-wrench",
      fields: [
        { name: "Name", type: "Text", required: true, description: "Full name or description of the equipment item.", example: "Digital Pressure Gauge – Model DPG-200" },
        { name: "Type", type: "Dropdown", required: false, description: "Category or type of equipment.", example: "Measuring Instrument" },
        { name: "Serial Number", type: "Text", required: false, description: "Manufacturer serial number for unique identification.", example: "SN-2024-00451" },
        { name: "Certificate No.", type: "Text", required: false, description: "Calibration or certification certificate number.", example: "CAL-2024-0023" },
        { name: "Calibration Required", type: "Dropdown (Yes/No)", required: true, description: "Indicates whether this equipment requires periodic calibration.", example: "Yes" },
        { name: "Inspection Frequency", type: "Dropdown", required: false, description: "How often the equipment should be inspected or calibrated.", example: "Annual" },
        { name: "ICD (Initial Calibration Date)", type: "Date", required: false, description: "The date the equipment was first calibrated or put into service.", example: "2024-01-10" },
        { name: "NVCD (Next Valid Calibration Date)", type: "Date", required: false, description: "The date by which the next calibration must be completed.", example: "2025-01-10" },
        { name: "EIS (Equipment in Service)", type: "Dropdown", required: false, description: "Indicates whether the equipment is currently active and in use.", example: "Active" },
        { name: "Comment", type: "Text", required: false, description: "Any additional notes about the equipment.", example: "Stored in Lab Room 3" },
      ],
    },
    {
      title: "Action Plan Fields",
      icon: "fa-list-check",
      fields: actionFields,
    },
  ],
};

// ─────────────────────────────────────────────
// Trainings — trprofile.jsx
// ─────────────────────────────────────────────
export const trHelpContent = {
  title: "Training Register",
  subtitle: "Competency & Training Records",
  description: "Track employee training records, competency status, and certification validity. Ensure all personnel hold the required qualifications and schedule refresher training before certifications expire.",
  howToAdd: howToAddGeneric("Training Record"),
  sections: [
    {
      title: "Training Details",
      icon: "fa-graduation-cap",
      fields: [
        { name: "Employee Name", type: "Text", required: true, description: "Full name of the employee.", example: "Ahmed Al-Rashid" },
        { name: "TCLN (Training/Cert. No.)", type: "Text", required: false, description: "Training or certification identification number.", example: "CERT-2024-HSE-017" },
        { name: "Position", type: "Dropdown", required: true, description: "The employee's job role or position.", example: "HSE Officer" },
        { name: "CL Number (Course/License No.)", type: "Text", required: false, description: "Course number or license number for the training.", example: "NEBOSH-IG-2024" },
        { name: "Training Frequency", type: "Dropdown", required: false, description: "How often this training must be refreshed.", example: "Every 2 Years" },
        { name: "NCD (Next Competency Date)", type: "Date", required: false, description: "Date by which competency must be reassessed or training renewed.", example: "2026-06-30" },
        { name: "NVCD (Next Valid Cert. Date)", type: "Date", required: false, description: "Date when the certification expires and must be renewed.", example: "2026-01-15" },
        { name: "Effectiveness", type: "Dropdown", required: false, description: "Assessment of whether the training was effective in improving competency.", example: "Effective" },
        { name: "Validity Status", type: "Dropdown", required: false, description: "Current validity status of the training certificate.", example: "Valid" },
        { name: "Comment", type: "Text", required: false, description: "Additional notes about this training record.", example: "Renewal reminder sent to employee" },
      ],
    },
    {
      title: "Action Plan Fields",
      icon: "fa-list-check",
      fields: actionFields,
    },
  ],
};

// ─────────────────────────────────────────────
// Documents — docprofile.jsx
// ─────────────────────────────────────────────
export const docHelpContent = {
  title: "Document Register",
  subtitle: "Controlled Document Management",
  description: "Manage and control all organizational documents including procedures, work instructions, policies, and external documents. Track revision history, approval status, and review dates.",
  howToAdd: howToAddGeneric("Document"),
  sections: [
    {
      title: "Document Details",
      icon: "fa-file-lines",
      fields: [
        { name: "Name", type: "Text", required: true, description: "Full title of the document.", example: "HSE Management Procedure – Incident Reporting" },
        { name: "Origin", type: "Dropdown", required: false, description: "Source of the document — Internal (created by the organization) or External (from a regulatory body or client).", example: "Internal" },
        { name: "Number", type: "Text", required: false, description: "Document reference number or identifier.", example: "HSE-PRO-007" },
        { name: "Type", type: "Dropdown", required: false, description: "Document type (Procedure, Work Instruction, Policy, Form, etc.).", example: "Procedure" },
        { name: "Dept/Function Name", type: "Text", required: false, description: "The department or function that owns and maintains this document.", example: "HSE Department" },
        { name: "Serial Number", type: "Text", required: false, description: "Unique serial number assigned to the document.", example: "DOC-2024-0134" },
        { name: "Revision Number", type: "Text", required: false, description: "Current revision or version number.", example: "Rev 03" },
        { name: "Issuer", type: "Text", required: false, description: "Person who authored or issued the document.", example: "Sarah Johnson" },
        { name: "Approver", type: "Dropdown", required: false, description: "Person who approved the document.", example: "Operations Director" },
        { name: "Issue Date", type: "Date", required: false, description: "Date the current revision was issued.", example: "2024-07-01" },
        { name: "Next Review Date", type: "Date", required: false, description: "Scheduled date for the next document review.", example: "2025-07-01" },
        { name: "Actual", type: "Dropdown (Yes/No)", required: false, description: "Indicates whether this is the current/active version of the document.", example: "Yes" },
        { name: "Comment", type: "Text", required: false, description: "Additional notes about the document.", example: "Pending annual review" },
      ],
    },
    {
      title: "Action Plan Fields",
      icon: "fa-list-check",
      fields: actionFields,
    },
  ],
};

// ─────────────────────────────────────────────
// Vendors — venprofile.jsx
// ─────────────────────────────────────────────
export const venHelpContent = {
  title: "Vendor Register",
  subtitle: "Supplier Qualification & Evaluation",
  description: "Maintain a register of all approved vendors and suppliers. Track their scope of service, registration details, and evaluation status to ensure supply chain quality and compliance.",
  howToAdd: howToAddGeneric("Vendor"),
  sections: [
    {
      title: "Vendor Details",
      icon: "fa-truck",
      fields: [
        { name: "Name", type: "Text", required: true, description: "Full legal name of the vendor or supplier.", example: "Al-Masri Engineering Co." },
        { name: "Registration Number", type: "Text", required: false, description: "Official business or trade registration number.", example: "CR-2019-00847" },
        { name: "Scope 1", type: "Text", required: false, description: "Primary scope of services or products provided.", example: "Mechanical maintenance and repair" },
        { name: "Scope 2", type: "Text", required: false, description: "Secondary scope of services.", example: "Spare parts supply" },
        { name: "Scope 3", type: "Text", required: false, description: "Additional scope of services.", example: "Emergency call-out services" },
        { name: "Registration Date", type: "Date", required: false, description: "Date the vendor was registered or approved.", example: "2022-03-15" },
        { name: "NRD (Next Review Date)", type: "Date", required: false, description: "Date by which the vendor must be re-evaluated.", example: "2025-03-15" },
        { name: "Evaluation Done", type: "Dropdown (Yes/No)", required: false, description: "Indicates whether the current-period evaluation has been completed.", example: "Yes" },
        { name: "Comment", type: "Text", required: false, description: "Additional notes about the vendor.", example: "ISO 9001 certified supplier" },
      ],
    },
    {
      title: "Action Plan Fields",
      icon: "fa-list-check",
      fields: actionFields,
    },
  ],
};

// ─────────────────────────────────────────────
// Customers — customerprofile.jsx
// ─────────────────────────────────────────────
export const customerHelpContent = {
  title: "Customer Register",
  subtitle: "Client Relationship Management",
  description: "Maintain a register of all customers and clients. Track their contract scope, registration details, and satisfaction review status to ensure customer requirements are being met.",
  howToAdd: howToAddGeneric("Customer"),
  sections: [
    {
      title: "Customer Details",
      icon: "fa-building-user",
      fields: [
        { name: "Name", type: "Text", required: true, description: "Full name of the customer or client organization.", example: "Gulf Petroleum Services Ltd." },
        { name: "Registration Number", type: "Text", required: false, description: "Customer's official business registration or contract number.", example: "CTR-2023-0091" },
        { name: "Scope 1", type: "Text", required: false, description: "Primary scope of the contract or service provided to this customer.", example: "Annual HSE consultancy" },
        { name: "Scope 2", type: "Text", required: false, description: "Secondary scope of services.", example: "Training delivery" },
        { name: "Scope 3", type: "Text", required: false, description: "Additional scope of services.", example: "Document control support" },
        { name: "Registration Date", type: "Date", required: false, description: "Date the customer was registered or the contract started.", example: "2023-01-01" },
        { name: "Review Date", type: "Date", required: false, description: "Date scheduled for the next customer satisfaction review.", example: "2025-01-01" },
        { name: "Evaluation Done", type: "Dropdown (Yes/No)", required: false, description: "Whether the customer satisfaction evaluation has been completed for the current period.", example: "Yes" },
        { name: "Comment", type: "Text", required: false, description: "Additional notes about this customer.", example: "Key account – priority service" },
      ],
    },
    {
      title: "Action Plan Fields",
      icon: "fa-list-check",
      fields: actionFields,
    },
  ],
};

// ─────────────────────────────────────────────
// Feedbacks — fbprofile.jsx
// ─────────────────────────────────────────────
export const fbHelpContent = {
  title: "Feedback Register",
  subtitle: "Customer & Stakeholder Feedback",
  description: "Record and track feedback, complaints, and observations from customers and stakeholders. Each entry captures job details and evaluates quality, communication, and compliance performance.",
  howToAdd: howToAddGeneric("Feedback"),
  sections: [
    {
      title: "Feedback Details",
      icon: "fa-comments",
      fields: [
        { name: "Job Number", type: "Text", required: false, description: "Reference number of the job or project this feedback relates to.", example: "JOB-2024-0312" },
        { name: "Job Start Date", type: "Date", required: false, description: "The date the job or project began.", example: "2024-09-01" },
        { name: "Job Completion Date", type: "Date", required: false, description: "The date the job or project was completed.", example: "2024-11-15" },
        { name: "Scope", type: "Text", required: false, description: "Description of the work scope this feedback covers.", example: "Offshore pipeline inspection" },
        { name: "Customer", type: "Dropdown", required: false, description: "The customer who provided this feedback.", example: "Gulf Petroleum Services Ltd." },
        { name: "Type of Finding", type: "Dropdown", required: false, description: "Classification of the feedback (Positive, Improvement, Complaint, etc.).", example: "Improvement" },
        { name: "QGS (Quality of Goods/Services)", type: "Dropdown", required: false, description: "Customer rating for the quality of goods or services provided.", example: "Good" },
        { name: "Communication", type: "Dropdown", required: false, description: "Customer rating for communication quality.", example: "Excellent" },
        { name: "HS (Health & Safety)", type: "Dropdown", required: false, description: "Customer rating for health and safety performance.", example: "Good" },
        { name: "Environment", type: "Dropdown", required: false, description: "Customer rating for environmental performance.", example: "Satisfactory" },
        { name: "Comment", type: "Text", required: false, description: "Additional notes or details about the feedback.", example: "Customer satisfied overall, minor delay noted" },
      ],
    },
    {
      title: "Action Plan Fields",
      icon: "fa-list-check",
      fields: actionFields,
    },
  ],
};

// ─────────────────────────────────────────────
// Employee Appraisals — earprofile.jsx
// ─────────────────────────────────────────────
export const earHelpContent = {
  title: "Employee Appraisal Register",
  subtitle: "Performance Review & Competency",
  description: "Record and track employee performance appraisals. Evaluate key competencies including job quality, leadership, management, and behavioral skills. Plan training needs based on appraisal results.",
  howToAdd: howToAddGeneric("Appraisal"),
  sections: [
    {
      title: "Appraisal Details",
      icon: "fa-user-check",
      fields: [
        { name: "Employee Name", type: "Text", required: true, description: "Full name of the employee being appraised.", example: "Mohammed Al-Qahtani" },
        { name: "Position", type: "Dropdown", required: true, description: "Employee's current job position.", example: "HSE Engineer" },
        { name: "Line Manager", type: "Dropdown", required: false, description: "The direct line manager conducting or responsible for the appraisal.", example: "Operations Manager" },
        { name: "ESD (Employment Start Date)", type: "Date", required: false, description: "The date the employee joined the organization.", example: "2021-03-01" },
        { name: "Appraisal Date", type: "Date", required: true, description: "The date this appraisal was conducted.", example: "2025-01-15" },
        { name: "Next Appraisal Date", type: "Date", required: false, description: "Scheduled date for the employee's next appraisal.", example: "2026-01-15" },
        { name: "Appraisal Type", type: "Dropdown", required: false, description: "Type of appraisal (Annual, Probationary, Mid-Year, etc.).", example: "Annual" },
        { name: "TCA (Training & Competency Assessment)", type: "Text", required: false, description: "Summary of training needs identified during the appraisal.", example: "Leadership training required" },
        { name: "Skills Appraisal", type: "Text", required: false, description: "Overall assessment of the employee's skills and competencies.", example: "Strong technical skills, developing leadership" },
        { name: "Comment", type: "Text", required: false, description: "Additional notes about the appraisal.", example: "Recommended for promotion review" },
      ],
    },
    {
      title: "Performance Scores (0–5)",
      icon: "fa-star-half-stroke",
      fields: [
        { name: "Job Quality", type: "Number (0–5)", required: false, description: "Score for the quality and accuracy of the employee's work output.", example: "4" },
        { name: "Leadership Skills", type: "Number (0–5)", required: false, description: "Score for leadership ability and initiative.", example: "3" },
        { name: "Management Skills", type: "Number (0–5)", required: false, description: "Score for planning, organization, and management capability.", example: "3" },
        { name: "Behavioral Skills", type: "Number (0–5)", required: false, description: "Score for teamwork, communication, and professional conduct.", example: "5" },
        { name: "Effectiveness of Trainings", type: "Number (0–5)", required: false, description: "Score indicating how well the employee applied training received.", example: "4" },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// Findings Log — flog.jsx
// ─────────────────────────────────────────────
export const flogHelpContent = {
  title: "Findings Log",
  subtitle: "Non-Conformances & Observations",
  description: "Record and track all findings, non-conformances, observations, and corrective actions arising from audits, inspections, and customer feedback. Manage each finding through to effective closure.",
  howToAdd: howToAddGeneric("Finding"),
  sections: [
    {
      title: "Finding Details",
      icon: "fa-magnifying-glass",
      fields: [
        { name: "Issuer", type: "Text", required: true, description: "Name of the person who raised or identified this finding.", example: "Internal Audit Team" },
        { name: "Finding Date", type: "Date", required: true, description: "Date the finding was identified.", example: "2025-01-20" },
        { name: "Job Number", type: "Text", required: false, description: "Job or project number associated with this finding.", example: "JOB-2025-0041" },
        { name: "Process", type: "Dropdown", required: false, description: "The process or area where the finding was identified.", example: "Document Control" },
        { name: "Category of Finding", type: "Dropdown", required: false, description: "Classification: Non-Conformance (NC), Observation (OBS), Opportunity for Improvement (OFI), etc.", example: "NC – Major" },
        { name: "Type of Finding", type: "Dropdown", required: false, description: "Further classification of the finding type.", example: "Documentation Gap" },
        { name: "Source of Finding", type: "Dropdown", required: false, description: "Origin of the finding (Internal Audit, External Audit, Customer Complaint, Inspection, etc.).", example: "External Audit" },
        { name: "Customer", type: "Dropdown", required: false, description: "Customer associated with this finding, if applicable.", example: "ISO Certification Body" },
        { name: "Vendor", type: "Dropdown", required: false, description: "Vendor associated with this finding, if applicable.", example: "N/A" },
        { name: "Description", type: "Text", required: true, description: "Detailed description of the finding.", example: "Calibration records missing for 3 instruments" },
        { name: "Containment Action", type: "Text", required: false, description: "Immediate action taken to contain the impact of the finding.", example: "Instruments quarantined pending recalibration" },
        { name: "Root Causes", type: "Text", required: false, description: "Root cause analysis result — the underlying cause of the finding.", example: "Calibration schedule not monitored" },
        { name: "Finding Status", type: "Dropdown", required: false, description: "Current status of the finding (Open, In Progress, Closed, Verified, etc.).", example: "In Progress" },
        { name: "Comment", type: "Text", required: false, description: "Additional notes about the finding.", example: "Closure target: 15 Feb 2025" },
      ],
    },
    {
      title: "Action Plan Fields",
      icon: "fa-list-check",
      fields: actionFields,
    },
  ],
};

// ─────────────────────────────────────────────
// Assurances & Oversights — aoprofile.jsx
// ─────────────────────────────────────────────
export const aoHelpContent = {
  title: "Assurance & Oversight Register",
  subtitle: "Audits, Inspections & Reviews",
  description: "Plan and record all assurance and oversight activities including audits, inspections, and management reviews. Track activity status, frequency, and next scheduled dates.",
  howToAdd: howToAddGeneric("A&O Activity"),
  sections: [
    {
      title: "Activity Details",
      icon: "fa-clipboard-check",
      fields: [
        { name: "Activity Description", type: "Text", required: true, description: "Description of the audit, inspection, or oversight activity.", example: "Annual ISO 9001 Internal Audit – Quality Management System" },
        { name: "Auditor / Inspector", type: "Text", required: false, description: "Name of the person conducting the audit or inspection.", example: "Lead Auditor: Ahmed Hassan" },
        { name: "Auditee / Inspectee", type: "Text", required: false, description: "Name of the person, department, or area being audited.", example: "Operations Department" },
        { name: "Reviewed Premises", type: "Text", required: false, description: "Physical location or facility being reviewed.", example: "Warehouse Block B, Site 3" },
        { name: "Reviewed Process", type: "Dropdown", required: false, description: "Business process that is the subject of this review.", example: "Procurement" },
        { name: "RTIC (Risk Type / Issue Category)", type: "Text", required: false, description: "The risk type or compliance area being assessed.", example: "Supplier qualification compliance" },
        { name: "Frequency", type: "Dropdown", required: false, description: "How often this oversight activity is scheduled.", example: "Annual" },
        { name: "AOA Date (Activity Date)", type: "Date", required: false, description: "The date this assurance activity took place.", example: "2025-01-10" },
        { name: "Inspection Frequency", type: "Dropdown", required: false, description: "Frequency of inspection for this specific area.", example: "Quarterly" },
        { name: "Next AOA Date", type: "Date", required: false, description: "Scheduled date for the next occurrence of this activity.", example: "2026-01-10" },
        { name: "AOA Status", type: "Dropdown", required: false, description: "Current status of the activity (Planned, In Progress, Completed, Overdue).", example: "Completed" },
        { name: "Comment", type: "Text", required: false, description: "Additional notes about the activity.", example: "2 minor findings raised, see Findings Log" },
      ],
    },
    {
      title: "Action Plan Fields",
      icon: "fa-list-check",
      fields: actionFields,
    },
  ],
};

// ─────────────────────────────────────────────
// Management Review — mrmprofile.jsx
// ─────────────────────────────────────────────
export const mrmHelpContent = {
  title: "Management Review",
  subtitle: "Top Management Review Records",
  description: "Document management review meeting inputs and outputs. Track review topics by process and record inputs and decisions from senior management reviews of the management system.",
  howToAdd: howToAddGeneric("Review Item"),
  sections: [
    {
      title: "Review Details",
      icon: "fa-users-gear",
      fields: [
        { name: "RISOS (Review Input / Source)", type: "Text", required: false, description: "The input source for this review item — what triggered this topic for discussion.", example: "Customer complaints data Q4 2024" },
        { name: "Topic", type: "Text", required: true, description: "The management review agenda topic or subject.", example: "Customer satisfaction performance review" },
        { name: "Process", type: "Dropdown", required: false, description: "The process being reviewed.", example: "Customer Relations" },
        { name: "Comment", type: "Text", required: false, description: "Management decisions, actions, or notes from the review.", example: "Agreed to improve response time target to 24 hours" },
      ],
    },
    {
      title: "Action Plan Fields",
      icon: "fa-list-check",
      fields: actionFields,
    },
  ],
};

// ─────────────────────────────────────────────
// Management of Changes — mocprofile.jsx
// ─────────────────────────────────────────────
export const mocHelpContent = {
  title: "Management of Change (MoC)",
  subtitle: "Change Control Register",
  description: "Control and manage all changes to processes, equipment, personnel, and procedures. Assess the risks introduced by each change before and after control measures are applied.",
  howToAdd: howToAddGeneric("MoC"),
  sections: [
    {
      title: "Change Details",
      icon: "fa-arrows-rotate",
      fields: [
        { name: "Issuer", type: "Text", required: true, description: "Name of the person or department requesting the change.", example: "Operations Manager" },
        { name: "MoC Issue Date", type: "Date", required: true, description: "Date the change request was raised.", example: "2025-02-01" },
        { name: "Reason of Change", type: "Text", required: true, description: "The reason or business justification for this change.", example: "New regulatory requirement for pressure testing" },
        { name: "Process", type: "Dropdown", required: true, description: "The process affected by this change.", example: "Pressure Testing Operations" },
        { name: "Change Description", type: "Text", required: true, description: "Detailed description of what is being changed.", example: "Update pressure test procedure to include new leak test protocol" },
        { name: "Existing Control Measures (ECM)", type: "Text", required: false, description: "Controls already in place before this change is implemented.", example: "Existing pressure test procedure Rev 02" },
        { name: "Risks", type: "Text", required: false, description: "Risks associated with implementing this change.", example: "Risk of incorrect test parameters being used" },
        { name: "Approved", type: "Dropdown (Yes/No)", required: true, description: "Indicates whether the change has received management approval.", example: "Yes" },
        { name: "Additional Control Measures (ACM)", type: "Text", required: false, description: "New controls to mitigate risks introduced by this change.", example: "Mandatory sign-off by Operations Director before implementation" },
        { name: "Comment", type: "Text", required: false, description: "Additional notes about this change.", example: "Implementation planned for 01 March 2025" },
      ],
    },
    {
      title: "Initial Risk Scoring",
      icon: "fa-triangle-exclamation",
      fields: [
        { name: "Severity", type: "Number (1–5)", required: true, description: "Severity of the risk introduced by this change before controls.", example: "4" },
        { name: "Likelihood", type: "Number (1–5)", required: true, description: "Likelihood of the risk occurring before additional controls.", example: "3" },
        { name: "Level", type: "Auto-calculated", required: false, description: "Risk level automatically calculated. High changes require senior approval.", example: "High" },
      ],
    },
    {
      title: "Residual Risk Scoring",
      icon: "fa-chart-line",
      fields: [
        { name: "Severity", type: "Number (1–5)", required: true, description: "Severity after additional controls are applied.", example: "2" },
        { name: "Likelihood", type: "Number (1–5)", required: true, description: "Likelihood after additional controls are applied.", example: "2" },
        { name: "Level", type: "Auto-calculated", required: false, description: "Residual risk after change controls. Should be Low before approval.", example: "Low" },
      ],
    },
    {
      title: "Action Plan Fields",
      icon: "fa-list-check",
      fields: actionFields,
    },
  ],
};

// ─────────────────────────────────────────────
// KPIs — kpiprofile.jsx
// ─────────────────────────────────────────────
export const kpiHelpContent = {
  title: "Key Performance Indicators (KPIs)",
  subtitle: "Performance Measurement",
  description: "Define and track Key Performance Indicators for each function. Set annual targets and monitor Last Year KPI values to measure organizational performance against objectives.",
  howToAdd: howToAddGeneric("KPI"),
  sections: [
    {
      title: "KPI Details",
      icon: "fa-gauge-high",
      fields: [
        { name: "Function", type: "Dropdown", required: true, description: "The department or function this KPI measures.", example: "HSE" },
        { name: "LY KPI (Last Year KPI)", type: "Number", required: false, description: "KPI value achieved in the previous year — used as a baseline for target setting.", example: "87.5" },
        { name: "Annual Target", type: "Number", required: true, description: "The target KPI value to be achieved by year end.", example: "90.0" },
      ],
    },
    {
      title: "Action Plan Fields",
      icon: "fa-list-check",
      fields: actionFields,
    },
  ],
};

// ─────────────────────────────────────────────
// OPIs — opiprofile.jsx
// ─────────────────────────────────────────────
export const opiHelpContent = {
  title: "Operational Performance Indicators (OPIs)",
  subtitle: "Monthly Performance Tracking",
  description: "Track Operational Performance Indicators month by month. Enter actual monthly values to monitor performance trends against annual targets throughout the year.",
  howToAdd: howToAddGeneric("OPI"),
  sections: [
    {
      title: "OPI Details",
      icon: "fa-chart-bar",
      fields: [
        { name: "Title", type: "Text", required: true, description: "Name or title of the operational performance indicator.", example: "Lost Time Injury Frequency Rate (LTIFR)" },
        { name: "Function", type: "Dropdown", required: true, description: "The department or function this OPI measures.", example: "HSE" },
        { name: "LY KPI (Last Year Value)", type: "Number", required: false, description: "Value achieved in the previous year.", example: "0.35" },
        { name: "Actual KPI", type: "Number", required: false, description: "Current actual KPI value for the period.", example: "0.28" },
        { name: "Annual Target", type: "Number", required: true, description: "Target value for the full year.", example: "0.25" },
      ],
    },
    {
      title: "Monthly Values",
      icon: "fa-calendar-days",
      fields: monthlyFields,
    },
    {
      title: "Action Plan Fields",
      icon: "fa-list-check",
      fields: actionFields,
    },
  ],
};

// ─────────────────────────────────────────────
// Action Logs — actionprofile.jsx
// ─────────────────────────────────────────────
export const actionHelpContent = {
  title: "Action Log Register",
  subtitle: "Cross-Module Action Tracking",
  description: "View and manage all action plans raised across all modules (H&S, Legislation, Environmental, etc.) in one consolidated register. Actions can be filtered by module and tracked to completion.",
  howToAdd: [
    "Actions are created from within each individual module (H&S, MoC, Findings, etc.).",
    "Navigate to the relevant module and select a record using the checkbox.",
    "Click 'Show Action' to view associated actions, or 'Add Action' to create a new one.",
    "Actions created here are linked to the selected parent record.",
    "Use this Action Log page to monitor all actions across all modules in one view.",
    "To edit: select one action using the checkbox, then click the Edit (pencil) icon.",
    "To delete: select actions using checkboxes, then click the Delete (trash) icon.",
  ],
  sections: [
    {
      title: "Action Fields",
      icon: "fa-list-check",
      fields: [
        ...actionFields,
        { name: "Monthly Status (Jan–Dec)", type: "Dropdown", required: false, description: "Track the status of this action for each month of the year.", example: "On Track / Delayed / Completed" },
      ],
    },
  ],
};
