import { toast } from "./utils/toast.js";
import { fetchStaffList } from "./utils/staffListCache.js";
import React, { useState, useEffect, act } from "react";
import VenBody from "./tabledatas/venrisk.jsx";
import VenHeaders from "./tableheaders/venheaders.jsx";

import ReactECharts from "echarts-for-react";
import HelpModal from "./utils/HelpModal.jsx";
import ExportButton from "./utils/ExportButton.jsx";
import { venHelpContent } from "./utils/helpContents.js";

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

const VenProfile = () => {
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
    { id: "ven-reg", name: "Vendor" },
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
  const [staffList, setStaffList] = useState([]);
  useEffect(() => { fetchStaffList().then(setStaffList); }, []);
  const [modalMode, setModalMode] = useState("add");
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    regNumber: "",
    scope1: "",
    scope2: "",
    scope3: "",
    registrationDate: "",
    nrd: "",
    evaluationDone: 0,
    comment: "",
  });

  const [formDataHs, setFormDataHs] = useState({
    id: 0,
    name: "",
    serialNumber: "",
    certificateNo: "",
    inspectionFrequency: "",
    icd: "",
    nvcd: "",
    competencyStatus: 0,
    actionPlan: [
      {
        action: "",
        raiseDate: "",
        resources: "",
        function: "",
        responsible: "",
        approverId: "",
        sendNotification: 0,
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
        approverId: "",
        sendNotification: 0,
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
        name: "",
        regNumber: "",
        scope1: "",
        scope2: "",
        scope3: "",
        registrationDate: "",
        nrd: "",
        evaluationDone: 0,
        comment: "",
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
        approverId: "",
        sendNotification: 0,
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
        id: selectedTable[0].id,
        name: row.name,
        regNumber: row.regNumber,
        scope1: row.scope1.id || String(row.scope1),
        scope2: row.scope2.id || String(row.scope2),
        scope3: row.scope3.id || String(row.scope3),
        registrationDate: row.registrationDate,
        nrd: row.nrd,
        evaluationDone: row.evaluationDone.id || String(row.evaluationDone),
        comment: row.comment
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
              row.relativeFunction?.id ?? "",
            responsible: row.responsibleId ?? row.responsible?.id ?? "",
            approverId: row.approverId ?? "",
            deadline: row.deadline,
            confirmation:
              row.confirmation?.id ?? "",
            status: row.status?.id ?? row.status ?? "",
            completionDate: row.completionDate || "",
            verificationStatus: row.verificationStatus?.id ?? "",
            comment: row.comment || "",
            january: row.january?.id ?? row.january ?? "",
            february: row.february?.id ?? row.february ?? "",
            march: row.march?.id ?? row.march ?? "",
            april: row.april?.id ?? row.april ?? "",
            may: row.may?.id ?? row.may ?? "",
            june: row.june?.id ?? row.june ?? "",
            july: row.july?.id ?? row.july ?? "",
            august: row.august?.id ?? row.august ?? "",
            september: row.september?.id ?? row.september ?? "",
            october: row.october?.id ?? row.october ?? "",
            november: row.november?.id ?? row.november ?? "",
            december: row.december?.id ?? row.december ?? "",
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
    } else if (selectedRisk === "ven-reg") {
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
                name: formData.name,
                regNumber: formData.regNumber,
                scope1: formData.scope1,
                scope2: formData.scope2,
                scope3: formData.scope3,
                registrationDate: formData.registrationDate,
                nrd: formData.nrd,
                evaluationDone: parseInt(formData.evaluationDone),
                comment: formData.comment
            };
            console.log("Gönderilen body:", payload); // Debug: Tam beklenen format mı?
            fetch(`/api/register/ven/one?token=${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload), // Direkt obje – array yapma!
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
                registerType: "ven",
                title: actionData.actionPlan?.[0]?.title || "",
                resources: actionData.actionPlan?.[0]?.resources || "",
                raiseDate: actionData.actionPlan?.[0]?.raiseDate || "",
                currency: actionData.actionPlan?.[0]?.currency || "",
                relativeFunction: actionData.actionPlan?.[0]?.relativeFunction || "",
                responsibleId: actionData.actionPlan?.[0]?.responsible || "",
        approverId: actionData.actionPlan?.[0]?.approverId || "",
                deadline: actionData.actionPlan?.[0]?.deadline || "",
                confirmation: actionData.actionPlan?.[0]?.confirmation || "",
                status: actionData.actionPlan?.[0]?.status || 0,
                completionDate: actionData.actionPlan?.[0]?.completionDate || "",
                verificationStatus:
                    actionData.actionPlan?.[0]?.verificationStatus || "",
                comment: actionData.actionPlan?.[0]?.comment || "",
                january: actionData.actionPlan?.[0]?.january || "",
                february: actionData.actionPlan?.[0]?.february || "",
                march: actionData.actionPlan?.[0]?.march || "",
                april: actionData.actionPlan?.[0]?.april || "",
                may: actionData.actionPlan?.[0]?.may || "",
                june: actionData.actionPlan?.[0]?.june || "",
                july: actionData.actionPlan?.[0]?.july || "",
                august: actionData.actionPlan?.[0]?.august || "",
                september: actionData.actionPlan?.[0]?.september || "",
                october: actionData.actionPlan?.[0]?.october || "",
                november: actionData.actionPlan?.[0]?.november || "",
                december: actionData.actionPlan?.[0]?.december || "",
            };
            console.log("Gönderilen body:", payload); // Debug: Tam beklenen format mı?
            fetch(`/api/register/component/action/one?token=${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload), // Direkt obje – array yapma!
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
        // Sadece backend beklediği alanları al (diğerlerini sil)
    } else {
        if (!showAction) {
            const payload = {
                id: selectedTable[0].id,
                name: formData.name,
                regNumber: formData.regNumber,
                scope1: formData.scope1.id || String(formData.scope1),
                scope2: formData.scope2.id || String(formData.scope2),
                scope3: formData.scope3.id || String(formData.scope3),
                registrationDate: formData.registrationDate,
                nrd: formData.nrd,
                evaluationDone: parseInt(formData.evaluationDone),
                comment: formData.comment
            };
            console.log("Gönderilen body:", payload); // Debug: Tam beklenen format mı?
            const url = `/api/register/ven/one/${selectedTable[0].id}?token=${token}`;
            fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload), // Direkt obje – array yapma!
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
        } else {
        const payload = {
          title: actionData.actionPlan?.[0]?.title || "",
          raiseDate: actionData.actionPlan?.[0]?.raiseDate || "",
          resources: actionData.actionPlan?.[0]?.resources || "",
          currency: actionData.actionPlan?.[0]?.currency || "",
          relativeFunction: actionData.actionPlan?.[0]?.relativeFunction || "",
          responsibleId: actionData.actionPlan?.[0]?.responsible || "",
          approverId: actionData.actionPlan?.[0]?.approverId || "",
          sendNotification: actionData.actionPlan?.[0]?.sendNotification ?? 0,
          deadline: actionData.actionPlan?.[0]?.deadline || "",
          confirmation: actionData.actionPlan?.[0]?.confirmation || "",
          status: actionData.actionPlan?.[0]?.status || 0,
          completionDate: actionData.actionPlan?.[0]?.completionDate || "",
          verificationStatus: actionData.actionPlan?.[0]?.verificationStatus || "",
          comment: actionData.actionPlan?.[0]?.comment || "",
          january: actionData.actionPlan?.[0]?.january || "",
          february: actionData.actionPlan?.[0]?.february || "",
          march: actionData.actionPlan?.[0]?.march || "",
          april: actionData.actionPlan?.[0]?.april || "",
          may: actionData.actionPlan?.[0]?.may || "",
          june: actionData.actionPlan?.[0]?.june || "",
          july: actionData.actionPlan?.[0]?.july || "",
          august: actionData.actionPlan?.[0]?.august || "",
          september: actionData.actionPlan?.[0]?.september || "",
          october: actionData.actionPlan?.[0]?.october || "",
          november: actionData.actionPlan?.[0]?.november || "",
          december: actionData.actionPlan?.[0]?.december || "",
        };
            console.log("Gönderilen body:", payload); // Debug: Tam beklenen format mı?
            const url = `/api/register/component/action/one/${[...selectedRowsForActions][0]}?token=${token}`;
            fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload), // Direkt obje – array yapma!
            })
                .then((response) => {
                    if (!response.ok) {
                        toast.error("Record could not be saved.");
                    } else {
                        console.log("SELECTED actionData ", actionData);
                        console.log("SELECTED PAYLOAD ", payload);
                        setActionData([payload]);
                        setSelectedTableForActions([payload]);
                        console.log("SELECTED actionData ", actionData);
                        toast.success("Record saved successfully.");
                    }
                })
                .catch((error) => toast.error("An error occurred. Please try again."));
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
  const token = document.cookie.split("; ").find((r) => r.startsWith("auth_token="))?.split("=").slice(1).join("=") ?? "";

  if (activeHeader) {
    if (!showDeleted) {
      fetch(`/api/register/ven/all/delete?token=${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: [...selectedRows],
        }),
      })
        .then((response) => {
          if (!response.ok) {
            toast.error("Delete failed. Please try again.");
          } else {
            toast.success("Record deleted successfully.");
            selectedRows.clear();
            setSelectedTable([]);
            setShowDeleteModal(false);
            setRefresh(true);
          }
        })
        .catch((error) => toast.error("Delete failed. Please try again."));
    } else {
      fetch(`/api/register/ven/all/undelete?token=${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: [...selectedRows],
        }),
      })
        .then((response) => {
          if (!response.ok) {
            toast.error("Delete failed. Please try again.");
          } else {
            toast.success("Record deleted successfully.");
            selectedRows.clear();
            setSelectedTable([]);
            setShowDeleteModal(false);
          }
        })
        .catch((error) => toast.error("Delete failed. Please try again."));
      setRefresh(true);
    }
  } else {
    if (!showDeletedAction) {
      console.log("AAABBB: ", selectedRowsForActions);
      fetch(`/api/register/component/action/all/delete?token=${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: [...selectedRowsForActions],
        }),
      })
        .then((response) => {
          if (!response.ok) {
            toast.error("Delete failed. Please try again.");
          } else {
            toast.success("Record deleted successfully.");
            setSelectedTableForActions([]);
            setSelectedRowsForActions(new Set());
            setShowDeleteModal(false);
            setRefresh(true);
          }
        })
        .catch((error) => toast.error("Delete failed. Please try again."));
      setRefresh(true);
    } else {
      console.log("CCC: ", selectedRowsForActions);
      fetch(`/api/register/component/action/all/undelete?token=${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: [...selectedRowsForActions],
        }),
      })
        .then((response) => {
          if (!response.ok) {
            toast.error("Delete failed. Please try again.");
          } else {
            toast.success("Record restored successfully.");
            setSelectedTableForActions([]);
            setSelectedRowsForActions(new Set());
            setRefresh(true);
            setShowDeleteModal(false);
          }
        })
        .catch((error) => toast.error("Delete failed. Please try again."));
      setRefresh(true);
    }
  }
};

const archiveData = (id) => {
  const token = document.cookie.split("; ").find((r) => r.startsWith("auth_token="))?.split("=").slice(1).join("=") ?? "";

  if (showArchived) {
    fetch(`/api/register/ven/all/unarchive?token=${token}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ids: [...selectedRows],
      }),
    })
      .then((response) => {
        if (!response.ok) {
          toast.error("Restore from archive failed.");
        } else {
          selectedRows.clear();
          setSelectedTable([]);
          toast.success("Record restored from archive.");
        }
      })
      .catch((error) => toast.error("Restore from archive failed."));
    setRefresh(true);
  } else {
    fetch(`/api/register/ven/all/archive?token=${token}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [...selectedRows] }),
    })
      .then((response) => {
        if (!response.ok) {
          console.log(selectedRows);
          toast.error("Archive failed. Please try again.");
        } else {
          selectedRows.clear();
          setSelectedTable([]);
          toast.success("Record archived successfully.");
        }
      })
      .catch((error) => toast.error("Archive failed. Please try again."));
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
                      setSelectedOption("datas"); // selectedOption'ı "datas" yap
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

                  {/* düzgün chart grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* KPI Gauge */}
                    <div className="bg-white rounded-lg shadow p-4">
                      <h4 className="text-lg font-semibold mb-4 text-gray-700">
                        KPI Performance (ISO 9001)
                      </h4>
                      <ReactECharts
                        style={{ height: "300px", width: "100%" }}
                        option={{
                          tooltip: {
                            trigger: "axis",
                          },
                          legend: {
                            data: ["KPI", "Target"],
                            top: 10,
                          },
                          grid: {
                            left: "5%",
                            right: "5%",
                            bottom: "8%",
                            containLabel: true,
                          },
                          xAxis: {
                            type: "category",
                            data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                            axisLabel: { rotate: 30 },
                          },
                          yAxis: {
                            type: "value",
                            min: 0,
                            max: 100,
                          },
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
                              lineStyle: {
                                width: 2,
                                type: "dashed",
                                color: "#ff4d4d",
                              },
                              data: [80, 80, 80, 80, 80, 80],
                            },
                          ],
                        }}
                      />{" "}
                    </div>

                    {/* Risk Heatmap */}
                    <div className="bg-white rounded-lg shadow p-4">
                      <h4 className="text-md font-medium mb-2">Risk Heatmap</h4>
                      <ReactECharts
                        option={riskHeatmapOption}
                        style={{ height: "350px" }}
                      />
                    </div>

                    {/* KPI Trend */}
                    <div className="bg-white rounded-lg shadow p-4">
                      <h4 className="text-md font-medium mb-2">KPI Trend</h4>
                      <ReactECharts
                        option={kpiTrendOption}
                        style={{ height: "300px" }}
                      />
                    </div>

                    {/* Risk Categories */}
                    <div className="bg-white rounded-lg shadow p-4">
                      <h4 className="text-md font-medium mb-2">
                        Risk Categories
                      </h4>
                      <ReactECharts
                        option={riskPieOption}
                        style={{ height: "350px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : selectedOption === "datas" ? (
            <div className="bg-white !rounded-button shadow-lg overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-blue-100 flex items-center">
                {/* Başlık ve sol butonlar */}
<div className="flex items-center gap-4 flex-wrap">
  {/* Ana Ekleme Butonu – en dikkat çekici */}
  <button
    onClick={openAddModal}
    className={`
      group relative overflow-hidden px-6 py-2.5 rounded-xl font-medium text-sm tracking-wide
      bg-gradient-to-r from-indigo-600 to-blue-600 text-white
      shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40
      hover:from-indigo-700 hover:to-blue-700
      active:scale-[0.97]
      transition-all duration-300 ease-out
      flex items-center gap-2.5
    `}
  >
    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-xl" />
    <i className="fas fa-plus text-base transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
    {!showAction ? "Add Vendors" : "Add Action"}
  </button>

  {/* Archive Butonu */}
  <button
    onClick={toggleArchiveView}
    className={`
      group px-5 py-2.5 rounded-xl font-medium text-sm
      bg-white border border-slate-200 text-slate-700
      hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50/80
      shadow-sm hover:shadow-md
      transition-all duration-300 ease-out
      flex items-center gap-2.5
      ${showArchived ? "border-amber-300 text-amber-700 bg-amber-50/80 hover:bg-amber-100/70" : ""}
    `}
  >
    <i
      className={`
        fas ${showArchived ? "fa-undo" : "fa-archive"} 
        text-base transition-transform duration-300 
        group-hover:scale-110 group-hover:rotate-12
      `}
    />
    {showArchived ? "Hide Archived" : "Show Archived"}
  </button>

  {/* Show/Hide Deleted Butonu */}
  <button
    onClick={toggleDeleteView}
    className={`
      group px-5 py-2.5 rounded-xl font-medium text-sm
      bg-white border border-slate-200
      ${showDeleted || showDeletedAction
        ? "border-red-300 text-red-700 bg-red-50/80 hover:bg-red-100/70 hover:border-red-400"
        : "hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50/80"}
      shadow-sm hover:shadow-md
      transition-all duration-300 ease-out
      flex items-center gap-2.5
    `}
  >
    <i
      className={`
        fas ${showDeleted || showDeletedAction ? "fa-trash-restore" : "fa-trash-can"} 
        text-base transition-transform duration-300 
        group-hover:scale-110 group-hover:rotate-6
      `}
    />
    {activeHeader
      ? showDeleted
        ? "Hide Deleted"
        : "Show Deleted"
      : showDeletedAction
        ? "Hide Deleted Action"
        : "Show Deleted Action"}
  </button>

  {/* Show/Hide Action Butonu */}
  <button
    onClick={toggleActionView}
    disabled={selectedCount !== 1}
    className={`
      group px-5 py-2.5 rounded-xl font-medium text-sm
      bg-white border border-slate-200 text-slate-700
      disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
      hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50/80
      shadow-sm hover:shadow-md
      transition-all duration-300 ease-out
      flex items-center gap-2.5
      ${showAction ? "border-purple-300 text-purple-700 bg-purple-50/70 hover:bg-purple-100/60" : ""}
    `}
  >
    <i 
      className={`
        fas fa-list-check text-base transition-transform duration-300 
        group-hover:scale-110 group-hover:rotate-6
      `}
    />
    {showAction ? "Hide Action" : "Show Action"}
  </button>

  {/* Aksiyon ikon butonları grubu */}
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

    {/* Archive / Restore */}
    <button
      onClick={archive}
      disabled={!(selectedCount >= 1 && !showDeleted) || !activeHeader}
      className={`
        group p-3 rounded-xl
        bg-white border border-slate-200 text-slate-600
        disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
        ${showArchived
          ? "text-amber-600 border-amber-200 bg-amber-50/70 hover:bg-amber-100/70 hover:border-amber-300"
          : "hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700"}
        shadow-sm hover:shadow-md
        transition-all duration-300 ease-out
      `}
      title="Archive / Restore Selected"
    >
      <i
        className={`
          fas ${showArchived ? "fa-undo" : "fa-archive"} 
          text-lg transition-transform duration-300 
          group-hover:scale-110 group-hover:rotate-12
        `}
      />
    </button>

    {/* Delete / Restore */}
    <button
      onClick={selectedCount > 0 ? confirmBulkDelete : () => {}}
      disabled={selectedCount === 0}
      className={`
        group p-3 rounded-xl
        bg-white border border-slate-200
        ${showDeleted || showDeletedAction
          ? "text-emerald-600 border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70 hover:border-emerald-300"
          : "text-red-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700"}
        disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
        shadow-sm hover:shadow-md
        transition-all duration-300 ease-out
      `}
      title="Delete / Restore Selected"
    >
      <i
        className={`
          fas ${showDeleted || showDeletedAction ? "fa-trash-restore" : "fa-trash-can"} 
          text-lg transition-transform duration-300 
          group-hover:scale-110 group-hover:rotate-6
        `}
      />
    </button>
  </div>
</div>

                <div className="ml-auto flex items-center gap-2">
                  <ExportButton moduleKey="ven-reg" />
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
                  <VenHeaders activeHeader={activeHeader} />
                  <VenBody
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
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-100 modal-box">
        {/* Header */}
        <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full" />
            <h3 className="text-lg font-semibold text-gray-800">
              {modalMode === "add" ? "Add New Vendor" : "Edit Vendor"}
            </h3>
          </div>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-8 py-6 space-y-6">
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest">Vendor Details</p>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="group">
              <label className="block text-xs font-medium text-gray-500 mb-1.5 group-focus-within:text-blue-500 transition-colors">Name</label>
              <input
                value={formData.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                type="text"
                placeholder="Enter vendor name..."
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all"
              />
            </div>

            {/* Reg Number */}
            <div className="group">
              <label className="block text-xs font-medium text-gray-500 mb-1.5 group-focus-within:text-blue-500 transition-colors">Reg Number</label>
              <input
                value={formData.regNumber}
                onChange={(e) => handleFormChange("regNumber", e.target.value)}
                type="text"
                placeholder="Enter registration number..."
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all"
              />
            </div>

            {/* Scope 1 */}
            <div className="group">
              <label className="block text-xs font-medium text-gray-500 mb-1.5 group-focus-within:text-blue-500 transition-colors">Scope 1</label>
              <select
                value={formData.scope1 || ""}
                onChange={(e) => {
                  console.log("Select onChange tetiklendi! Yeni value:", e.target.value);
                  handleFormChange("scope1", e.target.value);
                }}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all"
              >
                <option value="">Select</option>
                {dropdownData?.scope?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.value}
                  </option>
                ))}
              </select>
            </div>

            {/* Scope 2 */}
            <div className="group">
              <label className="block text-xs font-medium text-gray-500 mb-1.5 group-focus-within:text-blue-500 transition-colors">Scope 2</label>
              <select
                value={formData.scope2 || ""}
                onChange={(e) => {
                  console.log("Select onChange tetiklendi! Yeni value:", e.target.value);
                  handleFormChange("scope2", e.target.value);
                }}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all"
              >
                <option value="">Select</option>
                {dropdownData?.scope?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.value}
                  </option>
                ))}
              </select>
            </div>

            {/* Scope 3 */}
            <div className="group">
              <label className="block text-xs font-medium text-gray-500 mb-1.5 group-focus-within:text-blue-500 transition-colors">Scope 3</label>
              <select
                value={formData.scope3 || ""}
                onChange={(e) => {
                  console.log("Select onChange tetiklendi! Yeni value:", e.target.value);
                  handleFormChange("scope3", e.target.value);
                }}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all"
              >
                <option value="">Select</option>
                {dropdownData?.scope?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.value}
                  </option>
                ))}
              </select>
            </div>

            {/* Reg Date */}
            <div className="group">
              <label className="block text-xs font-medium text-gray-500 mb-1.5 group-focus-within:text-blue-500 transition-colors">Registration Date</label>
              <input
                value={formData.registrationDate}
                onChange={(e) => handleFormChange("registrationDate", e.target.value)}
                type="date"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all"
              />
            </div>

            {/* Next Review Date */}
            <div className="group">
              <label className="block text-xs font-medium text-gray-500 mb-1.5 group-focus-within:text-blue-500 transition-colors">Next Review Date</label>
              <input
                value={formData.nrd}
                onChange={(e) => handleFormChange("nrd", e.target.value)}
                type="date"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all"
              />
            </div>

            <div className="group">
              <label className="block text-xs font-medium text-gray-500 mb-1.5 group-focus-within:text-blue-500 transition-colors">Comment</label>
              <input
                value={formData.comment}
                onChange={(e) => handleFormChange("comment", e.target.value)}
                type="text"
                placeholder="Enter comment..."
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all"
              />
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 rounded-b-2xl">
          <button
            onClick={closeModal}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={saveRisk}
            className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl hover:from-blue-600 hover:to-blue-800 shadow-sm shadow-blue-200 transition-all"
          >
            {modalMode === "add" ? "Add Vendor" : "Update Vendor"}
          </button>
        </div>
      </div>
    </div>
  ) : (
    // Action modal kısmı – önceki dönüşümle aynı, tekrar yazıyorum ki bütün parça tutarlı olsun
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-100 modal-box">
        {/* Header */}
        <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full" />
            <h3 className="text-lg font-semibold text-gray-800">
              {modalMode === "add" ? "Add New Action" : "Edit Action"}
            </h3>
          </div>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-8 py-6 space-y-8">
          {/* Action Plan Section */}
          <div>
            <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-4">Action Plan</p>
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="group">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 group-focus-within:text-blue-500 transition-colors">Action</label>
                  <input
                    value={actionData?.actionPlan?.[0]?.title || ""}
                    onChange={(e) => handleFormChange("actionPlan[0].title", e.target.value)}
                    type="text"
                    placeholder="Enter action..."
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all"
                  />
                </div>
                <div className="group">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 group-focus-within:text-blue-500 transition-colors">Raise Date</label>
                  <input
                    value={actionData?.actionPlan?.[0]?.raiseDate || ""}
                    onChange={(e) => handleFormChange("actionPlan[0].raiseDate", e.target.value)}
                    type="date"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all"
                  />
                </div>
                <div className="group">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 group-focus-within:text-blue-500 transition-colors">Resources</label>
                  <input
                    value={actionData?.actionPlan?.[0]?.resources || ""}
                    onChange={(e) => handleFormChange("actionPlan[0].resources", e.target.value)}
                    type="text"
                    placeholder="Enter resources..."
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Relative Function", field: "relativeFunction", options: dropdownData?.relativeFunction },
                  { label: "Responsible", field: "responsible", options: staffList },
                  { label: "Approver", field: "approverId", options: staffList },
                  { label: "Deadline", field: "deadline", type: "date" },
                ].map(({ label, field, options, type = "select" }) => (
                  <div key={field} className="group">
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 group-focus-within:text-blue-500 transition-colors">{label}</label>
                    {type === "date" ? (
                      <input
                        value={actionData?.actionPlan?.[0]?.[field] || ""}
                        onChange={(e) => handleFormChange(`actionPlan[0].${field}`, e.target.value)}
                        type="date"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all"
                      />
                    ) : (
                      <select
                        value={actionData?.actionPlan?.[0]?.[field] || ""}
                        onChange={(e) => handleFormChange(`actionPlan[0].${field}`, e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all"
                      >
                        <option value="">Select</option>
                        {options?.map((item) => (
                          <option key={item.id} value={item.id}>{item.value}</option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Action Confirmation", field: "confirmation", options: dropdownData?.confirmation },
                  { label: "Action Status", field: "status", options: dropdownData?.status },
                  { label: "Completion Date", field: "completionDate", type: "date" },
                ].map(({ label, field, options, type = "select" }) => (
                  <div key={field} className="group">
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 group-focus-within:text-blue-500 transition-colors">{label}</label>
                    {type === "date" ? (
                      <input
                        value={actionData?.actionPlan?.[0]?.[field] || ""}
                        onChange={(e) => handleFormChange(`actionPlan[0].${field}`, e.target.value)}
                        type="date"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all"
                      />
                    ) : (
                      <select
                        value={actionData?.actionPlan?.[0]?.[field] || ""}
                        onChange={(e) => handleFormChange(`actionPlan[0].${field}`, e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all"
                      >
                        <option value="">Select</option>
                        {options?.map((item) => (
                          <option key={item.id} value={item.id}>{item.value}</option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 group-focus-within:text-blue-500 transition-colors">Verification Status</label>
                  <select
                    value={actionData?.actionPlan?.[0]?.verificationStatus || ""}
                    onChange={(e) => handleFormChange("actionPlan[0].verificationStatus", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all"
                  >
                    <option value="">Select</option>
                    {dropdownData?.verificationStatus?.map((item) => (
                      <option key={item.id} value={item.id}>{item.value}</option>
                    ))}
                  </select>
                </div>
                <div className="group">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 group-focus-within:text-blue-500 transition-colors">Comment</label>
                  <input
                    value={actionData?.actionPlan?.[0]?.comment || ""}
                    onChange={(e) => handleFormChange("actionPlan[0].comment", e.target.value)}
                    type="text"
                    placeholder="Enter comment..."
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Status Section */}
          <div>
            <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-4">Monthly Action Status</p>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
              <div className="grid grid-cols-4 gap-4">
                {[
                  "january", "february", "march", "april",
                  "may", "june", "july", "august",
                  "september", "october", "november", "december"
                ].map((month) => (
                  <div key={month} className="group">
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 capitalize group-focus-within:text-blue-500 transition-colors">
                      {month.charAt(0).toUpperCase() + month.slice(1)}
                    </label>
                    <select
                      value={actionData?.actionPlan?.[0]?.[month] || ""}
                      onChange={(e) => handleFormChange(`actionPlan[0].${month}`, e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all"
                    >
                      <option value="">Select</option>
                      {dropdownData?.status?.map((item) => (
                        <option key={item.id} value={item.id}>{item.value}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between gap-3 bg-gray-50/50 rounded-b-2xl">
          {modalMode === "edit" && (
            <label className="flex items-center gap-2 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={actionData?.actionPlan?.[0]?.sendNotification === 1}
                onChange={e => handleFormChange("actionPlan[0].sendNotification", e.target.checked ? 1 : 0)}
                className="w-3.5 h-3.5 accent-blue-500 cursor-pointer rounded"
              />
              <span className="text-[11px] font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
                Send Notification About New Update
              </span>
            </label>
          )}
          <div className="flex gap-3 ml-auto">
            <button
              onClick={closeModal}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={saveRisk}
              className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl hover:from-blue-600 hover:to-blue-800 shadow-sm shadow-blue-200 transition-all"
            >
              {modalMode === "add" ? "Add Action" : "Update Action"}
            </button>
          </div>
        </div>
      </div>
    </div>
  ))}

{/* Delete Confirmation Modal */}
{showDeleteModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-gray-100 modal-box">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">Confirm Delete</h3>
            <p className="text-sm text-gray-500">
              {isBulkDelete
                ? `Are you sure you want to delete ${selectedCount} selected item(s)? This action can be undone.`
                : "Are you sure you want to delete this item? This action can be undone."}
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteConfirm}
            className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 shadow-sm shadow-red-200 transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
)}
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} helpData={venHelpContent} />
    </div>
  );
};

export default VenProfile;
