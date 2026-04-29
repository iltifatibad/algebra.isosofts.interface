import { toast } from "./utils/toast.js";
import React, { useState, useEffect, act } from "react";

import ReactECharts from "echarts-for-react";
import KpiHeaders from "./tableheaders/kpiheaders.jsx";
import KPIBody from "./tabledatas/kpirisk.jsx";
import HelpModal from "./utils/HelpModal.jsx";
import { kpiHelpContent } from "./utils/helpContents.js";

export const hCheckboxChange =
  (setSelectedRows, setSelectedTable) => (id, table) => {
    const selectedItem = table.find((item) => item.id === id);

    setSelectedTable((prev) => {
      const exists = prev.find((item) => item.id === id);
      if (exists) {
        return prev.filter((item) => item.id !== id);
      } else {
        return [selectedItem]; // sadece son seçileni tut, eskiyi temizle
      }
    });

    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.clear();  // eskiyi temizle
        newSet.add(id);  // sadece yeniyi ekle
      }
      return newSet;
    });
  };

export const hCheckboxChangeForActions =
  (setSelectedRowsForActions, setSelectedTableForActions) => (id, table) => {
    const selectedItem = table.find((item) => item.id === id);
    setSelectedTableForActions((prev) => {
      const exists = prev.find((item) => item.id === id);
      let newTables;
      if (exists) {
        newTables = prev.filter((item) => item.id !== id);
      } else {
        newTables = [...prev, selectedItem];
      }
      console.log(" Selected Tables For Actions ", newTables);
      return newTables;
    });
    setSelectedRowsForActions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }

      console.log(" Selected Rows For Actions :", Array.from(newSet));
      return newSet;
    });
  };

const KpiProfile = () => {
  const kpiGaugeOption = {
    tooltip: { formatter: "{a}<br/>{c}%" },
    series: [
      {
        name: "KPI Score",
        type: "gauge",
        progress: { show: true },
        detail: { valueAnimation: true, formatter: "{value}%" },
        data: [{ value: 72, name: "KPI" }],
      },
    ],
  };

  const riskHeatmapOption = {
    tooltip: { position: "top" },
    grid: { height: "60%", top: "10%" },
    xAxis: {
      type: "category",
      data: ["1", "2", "3", "4", "5"],
      name: "Impact",
    },
    yAxis: {
      type: "category",
      data: ["1", "2", "3", "4", "5"],
      name: "Likelihood",
    },
    visualMap: {
      min: 1,
      max: 25,
      calculable: true,
      orient: "horizontal",
      left: "center",
      bottom: "5%",
    },
    series: [
      {
        name: "Risk Score",
        type: "heatmap",
        data: [
          [0, 0, 1],
          [1, 0, 4],
          [2, 0, 9],
          [3, 0, 16],
          [4, 0, 20],
          [0, 1, 2],
          [1, 1, 6],
          [2, 1, 12],
          [3, 1, 18],
          [4, 1, 22],
          [0, 2, 3],
          [1, 2, 8],
          [2, 2, 15],
          [3, 2, 19],
          [4, 2, 23],
          [0, 3, 4],
          [1, 3, 10],
          [2, 3, 17],
          [3, 3, 21],
          [4, 3, 24],
          [0, 4, 5],
          [1, 4, 11],
          [2, 4, 14],
          [3, 4, 18],
          [4, 4, 25],
        ],
        label: { show: true },
      },
    ],
  };

  const kpiTrendOption = {
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    },
    yAxis: { type: "value" },
    series: [
      {
        data: [50, 55, 62, 67, 70, 72],
        type: "line",
        smooth: true,
        areaStyle: {},
      },
    ],
  };

  const riskPieOption = {
    tooltip: { trigger: "item" },
    legend: { top: "bottom" },
    series: [
      {
        name: "Risk Categories",
        type: "pie",
        radius: ["40%", "70%"],
        data: [
          { value: 12, name: "Operational" },
          { value: 8, name: "Financial" },
          { value: 5, name: "Compliance" },
          { value: 4, name: "Strategic" },
        ],
      },
    ],
  };

  // Sample data - gerçek projede API'den veya props'tan gelebilir
  const [risks, setRisks] = useState([
    { id: "kpi", name: "Key Performance Indicators" },
    { id: "bg-reg", name: "Business Risks" },
    { id: "hs-reg", name: "Health & Safety Risks" },
    { id: "leg-reg", name: "Legislations" },
    { id: "env-reg", name: "Environmental Aspects & Impacts" },
    { id: "eq-reg", name: "Equipment & Inventories" },
    { id: "tr-reg", name: "Trainings" },
    { id: "doc-reg", name: "Documents" },
    { id: "ven-reg", name: "Vendors" },
    { id: "cus-reg", name: "Customers" },
    { id: "fb-reg", name: "Feedbacks" },
    { id: "ear-reg", name: "Employee Appraisals" },
    { id: "moc-reg", name: "Management Of Changes" },
    { id: "fl-reg", name: "Findings" },
    { id: "ao-reg", name: "Assurances & Oversights" },
    { id: "mr-reg", name: "Management Review" },
    { id: "ac-reg", name: "Action Logs" },
  ]);
  const [refresh, setRefresh] = useState(false);
  const [logs, setLogs] = useState([{ id: "a-l", name: "Action Log" }]);
  const [selectedTable, setSelectedTable] = useState([]);
  const [activeHeader, setActiveHeader] = useState(true);
  const [selectedOption, setSelectedOption] = useState("datas");
  const [selectedRisk, setSelectedRisk] = useState("");
  const [isOpenReg, setIsOpenReg] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [showDeletedAction, setShowDeletedAction] = useState(false);
  const [showAction, setShowAction] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editingRow, setEditingRow] = useState(null);
  //////////////////////////////////////
  const [formData, setFormData] = useState({
    function: "",
    lykpi: 0,
    annualTarget: 0
  });

  const [formDataHs, setFormDataHs] = useState({
    id: 0,
    process: "",
    hazard: "",
    risk: "",
    affectedPosition: "",
    ERMA: "",
    initialRiskSeverity: "",
    initialRiskLikelihood: "",
    actionPlan: [
      {
        action: "",
        raiseDate: "",
        resources: "",
        function: "",
        responsible: "",
        deadline: "",
        actionConfirmation: "",
        actionStatus: "",
        compilationData: "",
        verification: "",
        comment: "",
      },
    ],
    residualRiskSeverity: "",
    residualRiskLikelihood: "",
  });

  const [actionData, setActionData] = useState({
    actionPlan: [
      {
        title: "",
        raiseDate: "",
        resources: "",
        currency: "",
        relativeFunction: "",
        responsible: "",
        deadline: "",
        confirmation: "",
        status: "",
        completionDate: "",
        verificationStatus: "",
        comment: "",
        january: "",
        february: "",
        march: "",
        april: "",
        may: "",
        june: "",
        july: "",
        august: "",
        september: "",
        october: "",
        november: "",
        december: "",
      },
    ],
  });

  const [showHelp, setShowHelp] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [dropdownData, setDropdownData] = useState({});
  const [selectedRowsForActions, setSelectedRowsForActions] = useState(
    new Set(),
  );
  const [selectedTableForActions, setSelectedTableForActions] = useState([]);
  const handleCheckboxChange = hCheckboxChange(
    setSelectedRows,
    setSelectedTable,
  );
  const handleCheckboxChangeForActions = hCheckboxChangeForActions(
    setSelectedRowsForActions,
    setSelectedTableForActions,
  );
  async function getDefaultDropdownList() {
    const token = document.cookie.split("; ").find((r) => r.startsWith("auth_token="))?.split("=").slice(1).join("=") ?? "";
    const url = `/api/tablecomponent/dropdownlistitem?token=${token}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const result = await response.json();
      setDropdownData(result);
      console.log(result);
    } catch (error) {
      console.error(error.message);
    }
  }

  const selectedCount = selectedRows.size;
  const selectedCountForActions = selectedRowsForActions.size;
  const getSelectedRow = () => selectedTable[0];
  const getSelectedRowForAction = () => selectedTableForActions[0];

  const toggleArchiveView = () => {
    setShowArchived(!showArchived);
    selectedRows.clear();
    setSelectedTable([]);
    if (showDeleted || showAction) {
      if (!activeHeader) {
        setActiveHeader(!activeHeader);
      }
      setShowDeleted(false);
      setShowAction(false);
      setShowDeletedAction(false);
    }
  };

  const toggleDeleteView = () => {
    console.log("ACTIVE HEADERRRRR : ", activeHeader);
    if (activeHeader) {
      setShowDeleted((prev) => !prev);
      setShowArchived(false);
      selectedRows.clear();
      setSelectedTable([]);
    } else {
      selectedRowsForActions.clear();
      setSelectedTableForActions([]);
      setShowDeletedAction((prev) => !prev);
    }
  };

  const toggleActionView = () => {
    setShowAction(!showAction);
    setActiveHeader(!activeHeader);
    if (showArchived || showDeleted) {
      setShowArchived(false);
      setShowDeleted(false);
    }
  };

  const openAddModal = async () => {
    setModalMode("add");
    setEditingRow(null);
    const dropdownData = await getDefaultDropdownList();
    if (activeHeader) {
      setFormData({
        function: "",
        lykpi: 0,
        annualTarget: 0
      });
      setShowModal(true);
    } else {
      setActionData({
        title: "",
        raiseDate: "",
        resources: "",
        currency: "",
        relativeFunction: "",
        responsible: "",
        deadline: "",
        confirmation: "",
        status: "",
        completionDate: "",
        verificationStatus: "",
        comment: "",
        january: "",
        february: "",
        march: "",
        april: "",
        may: "",
        june: "",
        july: "",
        august: "",
        september: "",
        october: "",
        november: "",
        december: "",
      });
      setShowModal(true);
    }
  };

  const openEditModal = async (row) => {
    if (activeHeader) {
      setFormData({
        function: row.function?.id || String(row.function),
        lykpi: row.lykpi,
        annualTarget: row.annualTarget
      });
    } else {
      setActionData({
        actionPlan: [
          {
            title: row.title,
            raiseDate: row.raiseDate,
            resources:
              row.resources?.id || row.resources || "",
            currency: "",
            relativeFunction:
              row.relativeFunction?.id || String(row.relativeFunction) || "",
            responsible: row.responsible?.id || String(row.responsible) || "",
            deadline: row.deadline,
            confirmation:
              row.confirmation?.id || String(row.confirmation) || "",
            status: String(actionData.actionPlan[0].status?.id) || "",
            completionDate: row.completionDate || "",
            verificationStatus:
              row.verificationStatus?.id ||
              String(row.verificationStatus) ||
              "",
            comment: row.comment || "",
            january: row.january?.id || String(row.january) || "",
            february: row.february?.id || String(row.february) || "",
            march: row.march?.id || String(row.march) || "",
            april: row.april?.id || String(row.april) || "",
            may: row.may?.id || String(row.may) || "",
            june: row.june?.id || String(row.june) || "",
            july: row.july?.id || String(row.july) || "",
            august: row.august?.id || String(row.august) || "",
            september: row.september?.id || String(row.september) || "",
            october: row.october?.id || String(row.october) || "",
            november: row.november?.id || String(row.november) || "",
            december: row.december?.id || String(row.december) || "",
          },
        ],
      });
    }
    const dropdownData = await getDefaultDropdownList();
    setModalMode("edit");
    setEditingRow(row);

    setShowModal(true);
  };

  const handleFormChange = (arg1, arg2) => {
    const parsePath = (path) =>
      path
        .replace(/\]/g, "")
        .split(/\.|\[/)
        .map((p) => (isNaN(p) ? p : Number(p)));

    const updateNested = (obj, pathArr, val) => {
      const newObj = Array.isArray(obj) ? [...obj] : { ...obj };
      let current = newObj;

      for (let i = 0; i < pathArr.length - 1; i++) {
        const key = pathArr[i];
        const nextKey = pathArr[i + 1];

        if (typeof key === "number") {
          current[key] = current[key] ? { ...current[key] } : {};
          current = current[key];
        } else {
          current[key] =
            current[key] && typeof current[key] === "object"
              ? { ...current[key] }
              : typeof nextKey === "number"
                ? []
                : {};
          current = current[key];
        }
      }

      const lastKey = pathArr[pathArr.length - 1];
      current[lastKey] = val;
      return newObj;
    };

    let setter;
    if (showAction) {
      setter = setActionData;
    } else if (selectedRisk === "kpi") {
      setter = setFormData;
    } else {
      setter = setFormData;
    }

    if (typeof arg1 === "string") {
      const pathArr = parsePath(arg1);
      setter((prev) => updateNested(prev, pathArr, arg2));
    } else if (arg1 && typeof arg1 === "object") {
      setter((prev) => ({ ...(prev || {}), ...arg1 }));
    } else {
      console.warn("handleFormChange: Beklenen string path veya obje");
    }
  };

  const closeModal = () => setShowModal(false);

  const saveRisk = () => {
    const token = document.cookie.split("; ").find((r) => r.startsWith("auth_token="))?.split("=").slice(1).join("=") ?? "";

    if (modalMode === "add") {
      if (!showAction) {
        const payload = {
          process: formData.process,
          hazard: formData.hazard,
          risk: formData.risk,
          affectedPositions: formData.affectedPosition,
          erma: formData.erma,
          acm: formData.acm,
          initialRiskSeverity: formData.initialRiskSeverity,
          initialRiskLikelihood: formData.initialRiskLikelihood,
          residualRiskSeverity: formData.residualRiskSeverity,
          residualRiskLikelihood: formData.residualRiskLikelihood,
        };
        console.log("Gönderilen body:", payload);
        fetch(`/api/register/hsr/one?token=${token}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
          .then((response) => {
            if (!response.ok) {
              toast.error("Record could not be saved.");
            } else {
              toast.success("Record saved successfully.");
            }
          })
          .catch((error) => toast.error("An error occurred. Please try again."));
        setRefresh(true);
      } else {
        const payload = {
          registerId: Array.from(selectedRows)[0],
          registerType: "hsr",
          title: actionData.actionPlan[0]?.title || "",
          resources: actionData.actionPlan[0]?.resources || "",
          raiseDate: actionData.actionPlan[0]?.raiseDate || "",
          currency: actionData.actionPlan[0]?.currency || "",
          relativeFunction: actionData.actionPlan[0]?.relativeFunction || "",
          responsible: actionData.actionPlan[0]?.responsible || "",
          deadline: actionData.actionPlan[0]?.deadline || "",
          confirmation: actionData.actionPlan[0]?.confirmation || "",
          status: actionData.actionPlan[0]?.status || "",
          completionDate: actionData.actionPlan[0]?.completionDate || "",
          verificationStatus: actionData.actionPlan[0]?.verificationStatus || "",
          comment: actionData.actionPlan[0]?.comment || "",
          january: actionData.actionPlan[0]?.january || "",
          february: actionData.actionPlan[0]?.february || "",
          march: actionData.actionPlan[0]?.march || "",
          april: actionData.actionPlan[0]?.april || "",
          may: actionData.actionPlan[0]?.may || "",
          june: actionData.actionPlan[0]?.june || "",
          july: actionData.actionPlan[0]?.july || "",
          august: actionData.actionPlan[0]?.august || "",
          september: actionData.actionPlan[0]?.september || "",
          october: actionData.actionPlan[0]?.october || "",
          november: actionData.actionPlan[0]?.november || "",
          december: actionData.actionPlan[0]?.december || "",
        };
        console.log("Gönderilen body:", payload);
        fetch(`/api/register/component/action/one?token=${token}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
          .then((response) => {
            if (!response.ok) {
              toast.error("Record could not be saved.");
            } else {
              toast.success("Record saved successfully.");
            }
          })
          .catch((error) => toast.error("An error occurred. Please try again."));
        setRefresh(true);
      }
    } else {
      if (!showAction) {
        const payload = {
          function: formData.function,
          lykpi: Number(formData.lykpi),
          annualTarget: Number(formData.annualTarget)
        };
        console.log("Gönderilen body:", payload);
        const url = `/api/dashboard/kpi/${selectedTable[0].id}?token=${token}`;
        fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
          .then((response) => {
            if (!response.ok) {
              toast.error("Record could not be saved.");
            } else {
              setSelectedTable([payload]);
              setFormData([payload]);
              toast.success("Record saved successfully.");
            }
          })
          .catch((error) => toast.error("An error occurred. Please try again."));
        setRefresh(true);
      }
    }
    closeModal();
  };

  const confirmBulkDelete = () => {
    setIsBulkDelete(true);
    setShowDeleteModal(true);
  };

  const confirmSingleDelete = (id) => {
    setIsBulkDelete(false);
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const bulkDelete = () => {
    setSelectedRows(new Set());
    setShowDeleteModal(false);
    setIsBulkDelete(false);
  };

  const singleDelete = () => {
    setShowDeleteModal(false);
    setIsBulkDelete(false);
  };

  const bulkArchive = () => {
    const row = getSelectedRow();
    setSelectedRows(new Set());
  };

  const editSingle = () => {
    let row;
    if (activeHeader) {
      row = getSelectedRow();
    } else {
      row = getSelectedRowForAction();
      console.log("SELECTED ROW FOR EDIT ACTION", row);
    }
    if (row) openEditModal(row);
  };

  const archive = () => {
    const row = getSelectedRow();
    if (row) archiveData(row.id);
  };

  return (
    <div className="h-full overflow-hidden">
      <div className="flex h-full">
        {/* Main Content Area */}
        <div className="flex-1 p-8 bg-gradient-to-br from-blue-50/50 to-white h-full overflow-y-auto">
          {selectedOption === "e-chart" ? (
            <div className="bg-white !rounded-button shadow-lg overflow-hidden">
              <div className="p-6 border-b border-blue-100 flex justify-between items-center">
                <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  E-Chart
                </h3>
                <div className="flex space-x-3 items-center">
                  <button
                    onClick={() => {
                      setSelectedOption("datas");
                    }}
                    className={[
                      "!rounded-button whitespace-nowrap cursor-pointer bg-white text-blue-600 px-4 py-2 hover:bg-gray-50 hover:text-blue-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm",
                      selectedOption ? "" : "",
                    ].join(" ")}
                  >
                    <i className="fas fa-archive mr-2 text-blue-600 hover:text-blue-700"></i>
                    {selectedOption ? "Data" : "E-Chart"}
                  </button>{" "}
                </div>
              </div>
              <div className="overflow-x-auto max-h-[75vh] overflow-y-auto">
                <div className="p-6">
                  <h4 className="text-lg font-medium mb-4">E-Chart View</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow p-4">
                      <h4 className="text-lg font-semibold mb-4 text-gray-700">
                        KPI Performance (ISO 9001)
                      </h4>
                      <ReactECharts
                        style={{ height: "300px", width: "100%" }}
                        option={{
                          tooltip: { trigger: "axis" },
                          legend: { data: ["KPI", "Target"], top: 10 },
                          grid: { left: "5%", right: "5%", bottom: "8%", containLabel: true },
                          xAxis: {
                            type: "category",
                            data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                            axisLabel: { rotate: 30 },
                          },
                          yAxis: { type: "value", min: 0, max: 100 },
                          series: [
                            {
                              name: "KPI",
                              type: "line",
                              smooth: true,
                              symbol: "circle",
                              lineStyle: { width: 3 },
                              data: [72, 75, 78, 82, 87, 85],
                            },
                            {
                              name: "Target",
                              type: "line",
                              smooth: false,
                              symbol: "none",
                              lineStyle: { width: 2, type: "dashed", color: "#ff4d4d" },
                              data: [80, 80, 80, 80, 80, 80],
                            },
                          ],
                        }}
                      />{" "}
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                      <h4 className="text-md font-medium mb-2">Risk Heatmap</h4>
                      <ReactECharts option={riskHeatmapOption} style={{ height: "350px" }} />
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                      <h4 className="text-md font-medium mb-2">KPI Trend</h4>
                      <ReactECharts option={kpiTrendOption} style={{ height: "300px" }} />
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                      <h4 className="text-md font-medium mb-2">Risk Categories</h4>
                      <ReactECharts option={riskPieOption} style={{ height: "350px" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : selectedOption === "datas" ? (
            <div className="bg-white !rounded-button shadow-lg overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-blue-100 flex items-center">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2.5">
                    {/* Edit */}
                    <button
                      onClick={editSingle}
                      disabled={!(selectedCount === 1 || selectedCountForActions === 1)}
                      className={`
                        group p-3 rounded-xl
                        bg-white border border-slate-200 text-blue-600
                        disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
                        hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 hover:shadow-md
                        shadow-sm transition-all duration-300 ease-out
                      `}
                      title="Edit (Single Selection Only)"
                    >
                      <i className="fas fa-edit text-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                    </button>
                  </div>
                </div>
                <div className="ml-auto">
                  <button
                    onClick={() => setShowHelp(true)}
                    className="group p-3 rounded-xl bg-white border border-slate-200 text-indigo-500 hover:bg-indigo-50 hover:border-indigo-200 shadow-sm hover:shadow-md transition-all duration-300 ease-out"
                    title="Help – Field Descriptions"
                  >
                    <i className="fas fa-circle-question text-lg transition-transform duration-300 group-hover:scale-110" />
                  </button>
                </div>
              </div>

              {/* Tablo */}
              <div className="overflow-x-auto max-h-[75vh] overflow-y-auto">
                <table>
                  <KpiHeaders activeHeader={activeHeader} />
                  <KPIBody
                    selectedRows={selectedRows}
                    selectedRowsForActions={selectedRowsForActions}
                    showArchived={showArchived}
                    showDeleted={showDeleted}
                    showDeletedAction={showDeletedAction}
                    onCheckboxChange={handleCheckboxChange}
                    onCheckboxChangeForActions={handleCheckboxChangeForActions}
                    activeHeader={activeHeader}
                    selectedTable={selectedTable}
                    refresh={refresh}
                    setRefresh={setRefresh}
                    setSelectedRows={setSelectedRows}
                    setSelectedTable={setSelectedTable}
                  />
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white !rounded-button shadow-lg p-8 text-center">
              <i className="fas fa-chart-bar text-6xl text-blue-300 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Select a Risk Category
              </h3>
              <p className="text-gray-500">
                Choose a risk category from the sidebar to view detailed
                assessment data.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal &&
        (activeHeader ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-100">

              {/* Header */}
              <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    {modalMode === "add" ? "Add New KPI" : "Edit KPI"}
                  </h3>
                </div>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="px-8 py-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest">KPI Details</p>

                    <div className="group">
                      <label className="block text-xs font-medium text-gray-500 mb-1.5 group-focus-within:text-blue-500 transition-colors">Function</label>
                      <select
                        value={formData.function || ""}
                        onChange={(e) => handleFormChange("function", e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all"
                      >
                        <option value="">Select</option>
                        {dropdownData?.relativeFunction?.map((item) => (
                          <option key={item.id} value={item.id}>{item.value}</option>
                        ))}
                      </select>
                    </div>

                    <div className="group">
                      <label className="block text-xs font-medium text-gray-500 mb-1.5 group-focus-within:text-blue-500 transition-colors">Last Year KPI</label>
                      <input
                        value={formData.lykpi}
                        onChange={(e) => handleFormChange("lykpi", e.target.value)}
                        type="text"
                        placeholder="Enter Last Year KPI..."
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-xs font-medium text-gray-500 mb-1.5 group-focus-within:text-blue-500 transition-colors">Annual Target</label>
                      <input
                        value={formData.annualTarget}
                        onChange={(e) => handleFormChange("annualTarget", e.target.value)}
                        type="text"
                        placeholder="Enter Annual Target..."
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 rounded-b-2xl">
                <button onClick={closeModal} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button onClick={saveRisk} className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl hover:from-blue-600 hover:to-blue-800 shadow-sm shadow-blue-200 transition-all">
                  {modalMode === "add" ? "Add KPI" : "Update KPI"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <h1> Error </h1>
          </div>
        )
      )}
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} helpData={kpiHelpContent} />
    </div>
  );
};

export default KpiProfile;