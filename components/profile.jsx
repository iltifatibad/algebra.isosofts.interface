import React, { useState, useEffect, act } from "react";
import BgRiskBody from "./tabledatas/bgrisk.jsx";
import BgHeaders from "./tableheaders/tableheards.jsx";

import ReactECharts from "echarts-for-react";

const getToken = () =>
  document.cookie
    .split("; ")
    .find((r) => r.startsWith("auth_token="))
    ?.split("=")
    .slice(1)
    .join("=") ?? "";

export const hCheckboxChange =
  (setSelectedRows, setSelectedTable) => (id, table) => {
    // id'ye uygun objeyi bul
    const selectedItem = table.find((item) => item.id === id);

    setSelectedTable((prev) => {
      const exists = prev.find((item) => item.id === id);
      let newTables;
      if (exists) {
        // zaten varsa çıkar
        newTables = prev.filter((item) => item.id !== id);
      } else {
        // yoksa ekle
        newTables = [...prev, selectedItem];
      }

      console.log("Seçili tablolar (selectedTables):", newTables);
      return newTables;
    });

    // Seçili satırları update et
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      console.log("Seçili satırlar (selectedRows):", Array.from(newSet));
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

const RisksAssessment = () => {
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

    // Diğer risk kategorileri eklenebilir
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
  const [formData, setFormData] = useState({
    id: 0,
    swot: "",
    pestle: "",
    interestedParty: "",
    riskOpportunity: "",
    objective: "",
    kpi: "",
    process: "",
    ecm: "",
    acm: "",
    initialRiskSeverity: "",
    initialRiskLikelihood: "",
    residualRiskSeverity: "",
    residualRiskLikelihood: "",
  });

  const [formDataHs, setFormDataHs] = useState({
    id: 0,
    process: "",
    hazard: "",
    risk: "",
    affectedPositions: "",
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

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false); // Bulk delete için yeni state
  const [deletingId, setDeletingId] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set()); // Checkbox state'i ekle
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
    const token = getToken();
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

  // Filtered data based on archived

  // Seçili row sayısı
  const selectedCount = selectedRows.size;
  const selectedCountForActions = selectedRowsForActions.size;
  const getSelectedRow = () => selectedTable[0];
  const getSelectedRowForAction = () => selectedTableForActions[0];
  // Handlers
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
        swot: "",
        pestle: "",
        interestedParty: "",
        riskOpportunity: "",
        objective: "",
        kpi: "",
        process: "",
        ecm: "",
        acm: "",
        initialRiskSeverity: 0,
        initialRiskLikelihood: 0,
        residualRiskSeverity: 0,
        residualRiskLikelihood: 0,
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
        swot: row.swot.id || String(row.swot),
        pestle: row.pestle.id || String(row.pestle),
        interestedParty: row.interestedParty.id || String(row.interestedParty),
        process: row.process.id || String(row.process),
        riskOpportunity: row.riskOpportunity,
        objective: row.objective,
        kpi: row.kpi,
        ecm: row.ecm,
        acm: row.acm,
        initialRiskSeverity: row.initialRiskSeverity,
        initialRiskLikelihood: row.initialRiskLikelihood,
        residualRiskSeverity: row.residualRiskSeverity,
        residualRiskLikelihood: row.residualRiskLikelihood,
      });
    } else {
      setActionData({
        actionPlan: [
          {
            title: row.title,
            raiseDate: row.raiseDate,
            resources:
              row.resources?.id || String(row.resources) || "",
            currency: "",
            relativeFunction:
              row.relativeFunction?.id || String(row.relativeFunction) || "",
            responsible: row.responsible?.id || String(row.responsible) || "",
            deadline: row.deadline,
            confirmation:
              row.confirmation?.id || String(row.confirmation) || "",
            status: row.status?.id || parseInt(row.status) || "",
            completionDate: row.completionDate || "",
            verificationStatus:
              row.verificationStatus?.id ||
              parseInt(row.verificationStatus) ||
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
      // Derin clone: array veya object
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
    } else if (selectedRisk === "bg-reg") {
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
    if (modalMode === "add") {
      if (!showAction) {
        const payload = {
          swot: formData.swot,
          pestle: formData.pestle,
          interestedParty: formData.interestedParty,
          riskOpportunity: formData.riskOpportunity,
          objective: formData.objective,
          kpi: formData.kpi,
          process: formData.process,
          ecm: formData.ecm,
          acm: formData.acm,
          initialRiskSeverity: formData.initialRiskSeverity,
          initialRiskLikelihood: formData.initialRiskLikelihood,
          residualRiskSeverity: formData.residualRiskSeverity,
          residualRiskLikelihood: formData.residualRiskLikelihood,
        };
        console.log("Gönderilen body:", payload);
        const token = getToken();
        const url = `/api/register/br/one?token=${token}`;
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
          .then((response) => {
            if (!response.ok) {
              console.error("Kaydetme başarısız:", response.statusText);
            } else {
              console.log("Kayıt başarıyla kaydedildi.");
            }
          })
          .catch((error) => console.error("Hata:", error));
        setRefresh(true);
      } else {
        const payload = {
          registerId: Array.from(selectedRows)[0],
          registerType: "br",
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
          verificationStatus:
            actionData.actionPlan[0]?.verificationStatus || "",
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
        const token = getToken();
        const url = `/api/register/component/action/one?token=${token}`;
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
          .then((response) => {
            if (!response.ok) {
              console.error("Kaydetme başarısız:", response.statusText);
            } else {
              console.log("Kayıt başarıyla kaydedildi.");
            }
          })
          .catch((error) => console.error("Hata:", error));
        setRefresh(true);
      }
    } else {
      if (!showAction) {
        const payload = {
          id: selectedTable[0].id,
          swot: formData.swot,
          pestle: formData.pestle,
          interestedParty: formData.interestedParty,
          riskOpportunity: formData.riskOpportunity,
          objective: formData.objective,
          kpi: formData.kpi,
          process: formData.process,
          ecm: formData.ecm,
          acm: formData.acm,
          initialRiskSeverity: formData.initialRiskSeverity,
          initialRiskLikelihood: formData.initialRiskLikelihood,
          residualRiskSeverity: formData.residualRiskSeverity,
          residualRiskLikelihood: formData.residualRiskLikelihood,
        };
        console.log("Gönderilen body:", payload);
        const token = getToken();
        const url = `/api/register/br/one/${selectedTable[0].id}?token=${token}`;
        fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
          .then((response) => {
            if (!response.ok) {
              console.error("Kaydetme başarısız:", response.statusText);
            } else {
              setSelectedTable([payload]);
              setFormData([payload]);
              console.log("Kayıt başarıyla kaydedildi. Yeni state:", [payload]);
            }
          })
          .catch((error) => console.error("Hata:", error));
        setRefresh(true);
      } else {
        setActionData({
          actionPlan: [
            {
              id: [...selectedRowsForActions][0],
              title: actionData.actionPlan[0].title,
              raiseDate: actionData.raiseDate,
              resources: actionData.actionPlan[0].resources.id || "",
              currency: "",
              relativeFunction: actionData.relativeFunction?.id || "",
              responsible: actionData.responsible?.id || "",
              deadline: actionData.deadline,
              confirmation: actionData.actionPlan[0].confirmation?.id || "",
              status: actionData.actionPlan[0].status?.id,
              completionDate: actionData.completionDate,
              verificationStatus: actionData.verificationStatus?.id,
              comment: actionData.comment?.id || "",
              january: actionData.january?.id || "",
              february: actionData.february?.id || "",
              march: actionData.march?.id || "",
              april: actionData.april?.id || "",
              may: actionData.may?.id || "",
              june: actionData.june?.id || "",
              july: actionData.july?.id || "",
              august: actionData.august?.id || "",
              september: actionData.september?.id || "",
              october: actionData.october?.id || "",
              november: actionData.november?.id || "",
              december: actionData.december?.id || "",
            },
          ],
        });
        const payload = { ...actionData.actionPlan[0] };
        console.log("Gönderilen body:", payload);
        const token = getToken();
        const url = `/api/register/component/action/one/${[...selectedRowsForActions][0]}?token=${token}`;
        fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
          .then((response) => {
            if (!response.ok) {
              console.error("Kaydetme başarısız:", response.statusText);
            } else {
              console.log("SELECTED actionData ", actionData);
              console.log("SELECTED PAYLOAD ", payload);
              setActionData([payload]);
              setSelectedTableForActions([payload]);
              console.log("SELECTED actionData ", actionData);
              console.log("Kayıt başarıyla kaydedildi.");
            }
          })
          .catch((error) => console.error("Hata:", error));
        setRefresh(true);
      }
    }
    closeModal();
  };
  // Bulk delete için confirm
  const confirmBulkDelete = () => {
    setIsBulkDelete(true);
    setShowDeleteModal(true);
  };

  // Single delete için confirm
  const confirmSingleDelete = (id) => {
    setIsBulkDelete(false);
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  // Bulk delete handler
  const bulkDelete = () => {
    setTableData((prev) => prev.filter((row) => !selectedRows.has(row.id)));
    setSelectedRows(new Set());
    setShowDeleteModal(false);
    setIsBulkDelete(false);
  };

  // Single delete handler
  const singleDelete = () => {
    setTableData((prev) => prev.filter((row) => row.id !== deletingId));
    setShowDeleteModal(false);
    setIsBulkDelete(false);
  };

  // Delete modal'da çağırma
  const handleDeleteConfirm = () => {
    if (activeHeader) {
      if (!showDeleted) {
        const token = getToken();
        const url = `/api/register/br/all/delete?token=${token}`;
        fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ids: [...selectedRows],
          }),
        })
          .then((response) => {
            if (!response.ok) {
              console.log(" Failed Deleting Registers ");
            } else {
              console.log(" Deleting Success");
              selectedRows.clear();
              setSelectedTable([]);
              setShowDeleteModal(false);
              setRefresh(true);
            }
          })
          .catch((error) => console.log(" Error While Deleting: ", error));
      } else {
        const token = getToken();
        const url = `/api/register/br/all/undelete?token=${token}`;
        fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ids: [...selectedRows],
          }),
        })
          .then((response) => {
            if (!response.ok) {
              console.log(" Failed Deleting Registers ");
            } else {
              console.log(" Deleting Success");
              selectedRows.clear();
              setSelectedTable([]);
              setShowDeleteModal(false);
            }
          })
          .catch((error) => console.log(" Error While Deleting: ", error));
        setRefresh(true);
      }
    } else {
      if (!showDeletedAction) {
        console.log("AAABBB: ", selectedRowsForActions);
        const token = getToken();
        const url = `/api/register/component/action/all/delete?token=${token}`;
        fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ids: [...selectedRowsForActions],
          }),
        })
          .then((response) => {
            if (!response.ok) {
              console.log(" Failed Deleting Registers ");
            } else {
              console.log(" Deleting Success");
              setSelectedTableForActions([]);
              setSelectedRowsForActions(new Set());
              setShowDeleteModal(false);
              setRefresh(true);
            }
          })
          .catch((error) => console.log(" Error While Deleting: ", error));
        setRefresh(true);
      } else {
        console.log("CCC: ", selectedRowsForActions);
        const token = getToken();
        const url = `/api/register/component/action/all/undelete?token=${token}`;
        fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ids: [...selectedRowsForActions],
          }),
        })
          .then((response) => {
            if (!response.ok) {
              console.log(" Failed Deleting Registers ");
            } else {
              console.log(" UnDeleting Successsss");
              setSelectedTableForActions([]);
              setSelectedRowsForActions(new Set());
              setRefresh(true);
              setShowDeleteModal(false);
            }
          })
          .catch((error) => console.log(" Error While Deleting: ", error));
        setRefresh(true);
      }
    }
  };

  const archiveData = (id) => {
    if (showArchived) {
      const token = getToken();
      const url = `/api/register/br/all/unarchive?token=${token}`;
      fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: [...selectedRows],
        }),
      })
        .then((response) => {
          if (!response.ok) {
            console.log(" UnArchiving Failed ");
          } else {
            selectedRows.clear();
            setSelectedTable([]);
            console.log(" UnArchiving Success ");
          }
        })
        .catch((error) => console.log(" Error While UnArchiving : ", error));
      setRefresh(true);
    } else {
      const token = getToken();
      const url = `/api/register/br/all/archive?token=${token}`;
      fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [...selectedRows] }),
      })
        .then((response) => {
          if (!response.ok) {
            console.log(selectedRows);
            console.log(" Archiving Failed ");
          } else {
            selectedRows.clear();
            setSelectedTable([]);
            console.log(" Archiving Success ");
          }
        })
        .catch((error) => console.log(" Error While Archiving : ", error));
      setRefresh(true);
    }
  };

  // Bulk actions
  const bulkArchive = () => {
    const row = getSelectedRow();
    setTableData((prev) =>
      prev.map((row) =>
        selectedRows.has(row.id) ? { ...row, archived: !row.archived } : row,
      ),
    );
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
    <div className="h-full w-full bg-gradient-to-br from-blue-50/50 to-white overflow-hidden flex flex-col">
      {/* İçerik Alanı - ml-64 KALDIRILDI */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="w-full h-full max-w-full mx-auto">
          
          {selectedOption === "e-chart" ? (
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-blue-100">
              <div className="p-6 border-b border-blue-100 flex justify-between items-center bg-white/50">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent italic">
                  E-CHART ANALYSIS
                </h3>
                <button
                  onClick={() => setSelectedOption("datas")}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-md flex items-center gap-2"
                >
                  <i className="fas fa-table"></i> View Data Table
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(100vh-250px)]">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* KPI Gauge */}
                  <div className="bg-slate-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h4 className="text-lg font-bold mb-4 text-slate-700 uppercase tracking-tight">KPI Performance</h4>
                    <ReactECharts style={{ height: "350px", width: "100%" }} option={{ /* Senin chart opsiyonun */ }} />
                  </div>
                  {/* Risk Heatmap */}
                  <div className="bg-slate-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h4 className="text-lg font-bold mb-4 text-slate-700 uppercase tracking-tight">Risk Heatmap</h4>
                    <ReactECharts style={{ height: "350px" }} option={riskHeatmapOption} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-blue-100 flex flex-col h-full">
              {/* Tablo Header */}
              <div className="p-6 border-b border-blue-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-indigo-200 transition-all">
                    + Add New Risk
                  </button>
                  <button onClick={() => setSelectedOption("e-chart")} className="text-blue-600 bg-blue-50 px-5 py-2.5 rounded-xl font-bold hover:bg-blue-100 transition-all">
                    <i className="fas fa-chart-line mr-2"></i> Charts View
                  </button>
                </div>
              </div>

              {/* TABLO KONTEYNERI */}
              <div className="flex-1 overflow-auto w-full">
                {/* min-w sayesinde daralınca tablo bozulmaz, scroll çıkar */}
                <div className="min-w-[1200px] w-full h-full">
                  <table className="w-full border-collapse">
                    <BgHeaders />
                    {/* Body içeriği */}
                    <BgRiskBody />
                  </table>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};


export default RisksAssessment;