import React, { useState, useEffect, act } from "react";
import DocBody from "./tabledatas/docrisk.jsx";
import DocHeaders from "./tableheaders/docheaders.jsx";

import ReactECharts from "echarts-for-react";

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

const DocProfile = () => {
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
    { id: "leg-reg", name: "Legislation" },
    { id: "env-reg", name: "Environmental Aspects & Impact" },
    { id: "eq-reg", name: "Equipment & Inventory" },
    { id: "tr-reg", name: "Training" },
    { id: "doc-reg", name: "Document" },
    { id: "ven-reg", name: "Vendor" },
    { id: "cus-reg", name: "Customer" },
    { id: "fb-reg", name: "Feedback" },
    { id: "ear-reg", name: "Employee Appraisal Register" },
    { id: "moc-reg", name: "Management Of Changes" },
    { id: "fl-reg", name: "Findings Log" },
    { id: "ao-reg", name: "Assurance & Oversight" },
    { id: "mr-reg", name: "Management Review Meeting" },

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
    name: "",
    origin: "",
    number: "",
    type: "",
    depntFunctionName: "",
    serialNumber: "",
    revNumber: "",
    issuer: "",
    approver: "",
    issueDate: "",
    nextReviewDate: "",
    actual: 0,
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
        resources: 0,
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
    const url = "http://localhost:8000/api/tablecomponent/dropdownlistitem";
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
        origin: "",
        number: "",
        depntFunctionName: "",
        type: "",
        serialNumber: "",
        revNumber: "",
        issuer: "",
        approver: "",
        issueDate: "",
        nextReviewDate: "",
        actual: 0,
      });
      setShowModal(true);
    } else {
      setActionData({
        title: "",
        raiseDate: "",
        resources: 0,
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
        name: row.name,
        origin: row.origin.id || String(row.origin),
        number: row.number,
        depntFunctionName:
        row.depntFunctionName || String(row.depntFunctionName),
        type: row.type || String(row.type),
        serialNumber: row.serialNumber,
        revNumber: row.revNumber,
        issuer: row.issuer,
        approver: row.approver,
        issueDate: row.issueDate,
        nextReviewDate: row.nextReviewDate,
        actual: row.actual.id || String(row.actual),
      });
    } else {
      setActionData({
        actionPlan: [
          {
            title: row.title,
            raiseDate: row.raiseDate,
            resources:
              parseInt(row.resources?.id) || parseInt(row.resources) || 0,
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
    } else if (selectedRisk === "doc-reg") {
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
          name: formData.name,
          origin: formData.origin,
          number: formData.number,
          type: formData.type.id,
          depntFunctionName: formData.depntFunctionName.id,
          serialNumber: formData.serialNumber,
          revNumber: formData.revNumber,
          issuer: formData.issuer,
          approver: formData.approver,
          issueDate: formData.issueDate,
          nextReviewDate: formData.nextReviewDate,
          actual: parseInt(formData.actual),
        };
        console.log("Gönderilen body:", payload); // Debug: Tam beklenen format mı?

        fetch("http://localhost:8000/api/register/doc/one", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload), // Direkt obje – array yapma!
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
          title: actionData.actionPlan[0]?.title || "",
          resources: parseInt(actionData.actionPlan[0]?.resources) || 0,
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
        console.log("Gönderilen body:", payload); // Debug: Tam beklenen format mı?

        fetch("http://localhost:8000/api/register/component/action/one", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload), // Direkt obje – array yapma!
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
      // Sadece backend beklediği alanları al (diğerlerini sil)
    } else {
      if (!showAction) {
        const payload = {
          id: selectedTable[0].id,
          name: formData.name,
          origin: formData.origin,
          number: formData.number,
          type: formData.type.id || String(formData.type),
          depntFunctionName: formData.depntFunctionName.id || String(formData.depntFunctionName),
          serialNumber: formData.serialNumber,
          revNumber: formData.revNumber,
          issuer: formData.issuer,
          approver: formData.approver,
          issueDate: formData.issueDate,
          nextReviewDate: formData.nextReviewDate,
          actual: parseInt(formData.actual),
        };
        console.log("Gönderilen body:", payload); // Debug: Tam beklenen format mı?
        const url =
          "http://localhost:8000/api/register/doc/one/" + selectedTable[0].id;
        fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload), // Direkt obje – array yapma!
        })
          .then((response) => {
            if (!response.ok) {
              console.error("Kaydetme başarısız:", response.statusText);
            } else {
              setSelectedTable(prev => [
            {
              ...prev[0],
              ...payload,

              type: formData.type,
              depntFunctionName: formData.depntFunctionName,
            },
          ]);

          setFormData(prev => ({
            ...prev,
            ...payload,

            type: formData.type,
            depntFunctionName: formData.depntFunctionName,
          }));

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
              resources: parseInt(actionData.actionPlan[0].resources.id) || 0,
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
        console.log("Gönderilen body:", payload); // Debug: Tam beklenen format mı?

        const url =
          "http://localhost:8000/api/register/component/action/one/" +
          [...selectedRowsForActions][0];
        fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload), // Direkt obje – array yapma!
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
        fetch("http://localhost:8000/api/register/doc/all/delete", {
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
        fetch("http://localhost:8000/api/register/doc/all/undelete", {
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
        fetch(
          "http://localhost:8000/api/register/component/action/all/delete",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ids: [...selectedRowsForActions],
            }),
          },
        )
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
        fetch(
          "http://localhost:8000/api/register/component/action/all/undelete",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ids: [...selectedRowsForActions],
            }),
          },
        )
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
      fetch("http://localhost:8000/api/register/doc/all/unarchive", {
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
      fetch("http://localhost:8000/api/register/doc/all/archive", {
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
    <div className="pt-20 h-screen overflow-hidden">
      <div className="flex h-full">
        {/* Main Content Area */}
        <div className="flex-1 ml-64 p-8 bg-gradient-to-br from-blue-50/50 to-white h-full overflow-y-auto">
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
                <div className="flex items-center space-x-3">
                  <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    Datas
                  </h3>

                  <button
                    onClick={openAddModal}
                    className="!rounded-button whitespace-nowrap cursor-pointer bg-white text-blue-600 px-4 py-2 hover:bg-gray-50 hover:text-blue-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                  >
                    <i className="fas fa-plus mr-2 text-blue-600 hover:text-blue-700"></i>
                    {!showAction ? "Add Risk" : "Add Action"}
                  </button>
                  <button
                    onClick={toggleArchiveView}
                    className={[
                      "!rounded-button whitespace-nowrap cursor-pointer bg-white text-blue-600 px-4 py-2 hover:bg-gray-50 hover:text-blue-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm",
                      showArchived ? "" : "",
                    ].join(" ")}
                  >
                    <i className="fas fa-archive mr-2 text-blue-600 hover:text-blue-700"></i>
                    {showArchived ? "Hide Archived" : "Show Archived"}
                  </button>
                  <button
                    onClick={toggleDeleteView}
                    className={[
                      "!rounded-button whitespace-nowrap cursor-pointer bg-white text-blue-600 px-4 py-2 hover:bg-gray-50 hover:text-blue-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm",
                      showDeleted ? "" : "",
                    ].join(" ")}
                  >
                    <i className="fas fa-archive mr-2 text-blue-600 hover:text-blue-700"></i>
                    {activeHeader
                      ? showDeleted
                        ? "Hide Deleted"
                        : "Show Deleted"
                      : showDeletedAction
                        ? "Hide Deleted Action"
                        : "Show Deleted Action"}
                  </button>
                  <button
                    onClick={toggleActionView}
                    disabled={selectedCount !== 1}
                    className={[
                      "!rounded-button whitespace-nowrap cursor-pointer bg-white text-blue-600 px-4 py-2 hover:bg-gray-50 hover:text-blue-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm",
                      !(selectedCount >= 1 && selectedCount < 2)
                        ? "opacity-50 cursor-not-allowed"
                        : "",
                      showAction ? "" : "",
                    ].join(" ")}
                  >
                    <i className="fas fa-archive mr-2 text-blue-600 hover:text-blue-700"></i>
                    {showAction ? "Hide Action" : "Show Action"}
                  </button>
                  {/* Actions butonları */}
                  <div className="flex space-x-2">
                    <button
                      onClick={editSingle}
                      disabled={
                        !(selectedCount === 1 || selectedCountForActions === 1)
                      }
                      className={[
                        "!rounded-button whitespace-nowrap cursor-pointer bg-white text-blue-600 px-4 py-2 hover:bg-gray-50 hover:text-blue-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm",
                        !(selectedCount === 1 || selectedCountForActions === 1)
                          ? "opacity-50 cursor-not-allowed"
                          : "",
                      ].join(" ")}
                      title="Edit (Single Selection Only)"
                    >
                      <i className="fas fa-edit text-blue-600 hover:text-blue-700"></i>
                    </button>
                    <button
                      onClick={archive}
                      disabled={
                        !(selectedCount >= 1 && !showDeleted) || !activeHeader
                      }
                      className={[
                        "!rounded-button whitespace-nowrap cursor-pointer bg-white text-blue-600 px-4 py-2 hover:bg-gray-50 hover:text-blue-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm",
                        !(selectedCount >= 1 && !showDeleted)
                          ? "opacity-50 cursor-not-allowed"
                          : "",
                        !activeHeader ? "opacity-50 cursor-not-allowed" : "",
                      ].join(" ")}
                      title="Archive/Restore Selected"
                    >
                      <i
                        className={`fas ${showArchived ? "fa-undo" : "fa-archive"} text-blue-600 hover:text-blue-700`}
                      ></i>
                    </button>
                    <button
                      onClick={selectedCount > 0 ? confirmBulkDelete : () => {}}
                      disabled={selectedCount === 0}
                      className={[
                        "!rounded-button whitespace-nowrap cursor-pointer bg-white text-blue-600 px-4 py-2 hover:bg-gray-50 hover:text-blue-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm",
                        selectedCount === 0
                          ? "opacity-50 cursor-not-allowed"
                          : "",
                      ].join(" ")}
                      title="Delete Selected"
                    >
                      <i
                        className={`fas ${
                          activeHeader
                            ? showDeleted
                              ? "fa-trash-restore"
                              : "fa-trash"
                            : showDeletedAction
                              ? "fa-trash-restore"
                              : "fa-trash"
                        } text-blue-600 hover:text-blue-700`}
                      ></i>
                    </button>
                  </div>
                </div>

                {/* Sağdaki E-Chart butonu */}
                {/* <div className="ml-auto">
                  <button
                    onClick={() => setSelectedOption("e-chart")}
                    className={[
                      "!rounded-button whitespace-nowrap cursor-pointer bg-white text-blue-600 px-4 py-2 hover:bg-gray-50 hover:text-blue-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm",
                      selectedOption ? "" : "",
                    ].join(" ")}
                  >
                    <i className="fas fa-archive mr-2 text-blue-600 hover:text-blue-700"></i>
                    {selectedOption ? "E-Chart" : "Data"}
                  </button>{" "}
                </div> */}
              </div>

              {/* Tablo */}
              <div className="overflow-x-auto max-h-[75vh] overflow-y-auto">
                <table>
                  <DocHeaders activeHeader={activeHeader} />
                  <DocBody
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white !rounded-button shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
              <div className="p-6 border-b border-blue-100">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  {modalMode === "add" ? "Add New Risk" : "Edit Risk"}
                </h3>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        value={formData.name}
                        onChange={(e) =>
                          handleFormChange("name", e.target.value)
                        }
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Origin
                      </label>
                      <select
                        value={formData.origin || ""} // Null-safe
                        onChange={(e) => {
                          console.log(
                            "Select onChange tetiklendi! Yeni value:",
                            e.target.value,
                          ); // Debug: Bu çıkmıyorsa onChange patlıyor
                          handleFormChange("origin", e.target.value); // String path + value – obje değil!
                        }}
                      >
                        <option value="">Seçiniz</option>
                        {dropdownData?.documentOrigin?.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.value}
                          </option>
                        ))}
                      </select>
                    </div>

                    {formData.origin === "Su1o957i68896Jz58zz3hkW9C62H25" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Departamen / Function Name
                        </label>
                        <select
                          value={formData.depntFunctionName?.id || ""} // Null-safe
                          onChange={(e) => {
                            console.log(
                              "Select onChange tetiklendi! Yeni value:",
                              e.target.value,
                            ); // Debug: Bu çıkmıyorsa onChange patlıyor
                            handleFormChange(
                              "depntFunctionName.id",
                              e.target.value,
                            ); // String path + value – obje değil!
                          }}
                        >
                          <option value="">Seçiniz</option>
                          {dropdownData?.depntFunctionName?.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.value}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {formData.origin === "Su1o957i68896Jz58zz3hkW9C62H25" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Type
                        </label>
                        <select
                          value={formData.type?.id || ""} // Null-safe
                          onChange={(e) => {
                            console.log(
                              "Select onChange tetiklendi! Yeni value:",
                              e.target.value,
                            ); // Debug: Bu çıkmıyorsa onChange patlıyor
                            handleFormChange("type.id", e.target.value); // String path + value – obje değil!
                          }}
                        >
                          <option value="">Seçiniz</option>
                          {dropdownData?.documentType?.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.value}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {formData.origin === "phA8k3tQ0Veosm24712C95944uynfa" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number
                        </label>
                        <input
                          value={formData.number?.id}
                          onChange={(e) =>
                            handleFormChange("number", e.target.value)
                          }
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Revision Number
                      </label>
                      <input
                        value={formData.revNumber}
                        onChange={(e) =>
                          handleFormChange("revNumber", e.target.value)
                        }
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        R
                      </label>
                      <input
                        value={formData.ncd}
                        onChange={(e) =>
                          handleFormChange("ncd", e.target.value)
                        }
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div> */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Issuer
                      </label>
                      <input
                        value={formData.issuer}
                        onChange={(e) =>
                          handleFormChange("issuer", e.target.value)
                        }
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Approver
                      </label>
                      <input
                        value={formData.approver}
                        onChange={(e) =>
                          handleFormChange("approver", e.target.value)
                        }
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Issue Date
                      </label>
                      <input
                        value={formData.issueDate}
                        onChange={(e) =>
                          handleFormChange("issueDate", e.target.value)
                        }
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Next Review Date
                      </label>
                      <input
                        value={formData.nextReviewDate}
                        onChange={(e) =>
                          handleFormChange("nextReviewDate", e.target.value)
                        }
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Actual
                      </label>
                      <select
                        value={formData.actual}
                        onChange={(e) =>
                          handleFormChange("actual", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-blue-100 flex justify-end space-x-4">
                <button
                  onClick={closeModal}
                  className="!rounded-button whitespace-nowrap cursor-pointer border-2 border-gray-300 text-gray-600 px-6 py-2 hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={saveRisk}
                  className="!rounded-button whitespace-nowrap cursor-pointer bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 hover:from-blue-600 hover:to-blue-800 transition-all duration-300"
                >
                  {modalMode === "add" ? "Add Risk" : "Update Risk"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white !rounded-button shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
              <div className="p-6 border-b border-blue-100">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  {modalMode === "add" ? "Add New Action " : "Edit Action"}
                </h3>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-1 gap-6">
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-1 gap-6">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Action Plan
                          </label>

                          <div className="space-y-6">
                            {/* Row 1 */}
                            <div className="grid grid-cols-3 gap-4">
                              {/* Action */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Action
                                </label>
                                <input
                                  value={
                                    actionData?.actionPlan?.[0]?.title || ""
                                  }
                                  onChange={(e) =>
                                    handleFormChange(
                                      "actionPlan[0].title",
                                      e.target.value,
                                    )
                                  }
                                  type="text"
                                  placeholder="Action"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                              </div>

                              {/* Raise Date with Label */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Raise Date
                                </label>
                                <input
                                  value={
                                    actionData?.actionPlan?.[0]?.raiseDate || ""
                                  }
                                  onChange={(e) =>
                                    handleFormChange(
                                      "actionPlan[0].raiseDate",
                                      e.target.value,
                                    )
                                  }
                                  type="date"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                />
                              </div>

                              {/* Resources */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Resources
                                </label>
                                <input
                                  value={
                                    actionData.actionPlan?.[0]?.resources || ""
                                  }
                                  onChange={(e) =>
                                    handleFormChange(
                                      "actionPlan[0].resources",
                                      parseInt(e.target.value),
                                    )
                                  }
                                  type="text"
                                  placeholder="Resources"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                              </div>
                            </div>

                            {/* Row 2 */}
                            <div className="grid grid-cols-3 gap-4">
                              {/* Relative Function */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Relative Function
                                </label>
                                <select
                                  value={
                                    actionData.actionPlan?.[0]
                                      ?.relativeFunction || ""
                                  }
                                  onChange={(e) =>
                                    handleFormChange(
                                      "actionPlan[0].relativeFunction",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                >
                                  <option value="">Seçiniz</option>
                                  {dropdownData?.relativeFunction?.map(
                                    (item) => (
                                      <option key={item.id} value={item.id}>
                                        {item.value}
                                      </option>
                                    ),
                                  )}
                                </select>
                              </div>

                              {/* Responsible */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Responsible
                                </label>
                                <select
                                  value={
                                    actionData.actionPlan?.[0]?.responsible ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    handleFormChange(
                                      "actionPlan[0].responsible",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                >
                                  <option value="">Seçiniz</option>
                                  {dropdownData?.affectedPosition?.map(
                                    (item) => (
                                      <option key={item.id} value={item.id}>
                                        {item.value}
                                      </option>
                                    ),
                                  )}
                                </select>
                              </div>

                              {/* Deadline (Calendar) */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Deadline
                                </label>
                                <input
                                  value={
                                    actionData.actionPlan?.[0]?.deadline || ""
                                  }
                                  onChange={(e) =>
                                    handleFormChange(
                                      "actionPlan[0].deadline",
                                      e.target.value,
                                    )
                                  }
                                  type="date"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                />
                              </div>
                            </div>

                            {/* Row 3 */}
                            <div className="grid grid-cols-3 gap-4">
                              {/* Action Confirmation */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Action Confirmation
                                </label>
                                <select
                                  value={
                                    actionData.actionPlan?.[0]?.confirmation ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    handleFormChange(
                                      "actionPlan[0].confirmation",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                >
                                  <option value="">Seçiniz</option>
                                  {dropdownData?.confirmation?.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.value}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Action Status */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Action Status
                                </label>
                                <select
                                  value={
                                    actionData.actionPlan?.[0]?.status || ""
                                  }
                                  onChange={(e) =>
                                    handleFormChange(
                                      "actionPlan[0].status",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                >
                                  <option value="">Seçiniz</option>
                                  {dropdownData?.status?.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.value}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Completion Date (Calendar) */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Completion Date
                                </label>
                                <input
                                  value={
                                    actionData.actionPlan?.[0]
                                      ?.completionDate || ""
                                  }
                                  onChange={(e) =>
                                    handleFormChange(
                                      "actionPlan[0].completionDate",
                                      e.target.value,
                                    )
                                  }
                                  type="date"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                />
                              </div>
                            </div>

                            {/* Row 4 */}
                            <div className="grid grid-cols-2 gap-4">
                              {/* Verification Status */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Verification Status
                                </label>
                                <select
                                  value={
                                    actionData.actionPlan?.[0]
                                      ?.verificationStatus || ""
                                  }
                                  onChange={(e) =>
                                    handleFormChange(
                                      "actionPlan[0].verificationStatus",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                >
                                  <option value="">Seçiniz</option>
                                  {dropdownData?.status?.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.value}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Comment */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Comment
                                </label>
                                <input
                                  value={
                                    actionData.actionPlan?.[0]?.comment || ""
                                  }
                                  onChange={(e) =>
                                    handleFormChange(
                                      "actionPlan[0].comment",
                                      e.target.value,
                                    )
                                  }
                                  type="text"
                                  placeholder="Comment"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                              </div>
                            </div>
                          </div>
                          <label className="block text-sm font-medium text-gray-700 mt-2 mb-2">
                            Action Status
                          </label>
                          <div className="space-y-6">
                            {/* Row 1 */}
                            <div className="grid grid-cols-3 gap-4">
                              {/* Action */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  January
                                </label>
                                <select
                                  value={
                                    actionData?.actionPlan?.[0]?.january || ""
                                  }
                                  onChange={(e) =>
                                    handleFormChange(
                                      "actionPlan[0].january",
                                      e.target.value,
                                    )
                                  }
                                  type="text"
                                  placeholder="Action"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                  <option value="">Seçiniz</option>
                                  {dropdownData?.status?.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.value}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Raise Date with Label */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  February
                                </label>
                                <select
                                  value={
                                    actionData?.actionPlan?.[0]?.february || ""
                                  }
                                  onChange={(e) =>
                                    handleFormChange(
                                      "actionPlan[0].february",
                                      e.target.value,
                                    )
                                  }
                                  type="date"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                >
                                  <option value="">Seçiniz</option>
                                  {dropdownData?.status?.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.value}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Resources */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  March
                                </label>
                                <select
                                  value={
                                    actionData.actionPlan?.[0]?.march || ""
                                  }
                                  onChange={(e) =>
                                    handleFormChange(
                                      "actionPlan[0].march",
                                      e.target.value,
                                    )
                                  }
                                  type="text"
                                  placeholder="Resources"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                  <option value="">Seçiniz</option>
                                  {dropdownData?.status?.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.value}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Row 2 */}
                            <div className="grid grid-cols-3 gap-4">
                              {/* Relative Function */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  April
                                </label>
                                <select
                                  value={
                                    actionData.actionPlan?.[0]?.april || ""
                                  }
                                  onChange={(e) =>
                                    handleFormChange(
                                      "actionPlan[0].april",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                >
                                  <option value="">Seçiniz</option>
                                  {dropdownData?.status?.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.value}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Responsible */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  May
                                </label>
                                <select
                                  value={actionData.actionPlan?.[0]?.may || ""}
                                  onChange={(e) =>
                                    handleFormChange(
                                      "actionPlan[0].may",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                >
                                  <option value="">Seçiniz</option>
                                  {dropdownData?.status?.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.value}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Deadline (Calendar) */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  June
                                </label>
                                <select
                                  value={actionData.actionPlan?.[0]?.june || ""}
                                  onChange={(e) =>
                                    handleFormChange(
                                      "actionPlan[0].june",
                                      e.target.value,
                                    )
                                  }
                                  type="date"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                >
                                  <option value="">Seçiniz</option>
                                  {dropdownData?.status?.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.value}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Row 3 */}
                            <div className="grid grid-cols-3 gap-4">
                              {/* Action Confirmation */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  July
                                </label>
                                <select
                                  value={actionData.actionPlan?.[0]?.july || ""}
                                  onChange={(e) =>
                                    handleFormChange(
                                      "actionPlan[0].july",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                >
                                  <option value="">Seçiniz</option>
                                  {dropdownData?.status?.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.value}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Action Status */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  August
                                </label>
                                <select
                                  value={
                                    actionData.actionPlan?.[0]?.august || ""
                                  }
                                  onChange={(e) =>
                                    handleFormChange(
                                      "actionPlan[0].august",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                >
                                  <option value="">Seçiniz</option>
                                  {dropdownData?.status?.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.value}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Completion Date (Calendar) */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  September
                                </label>
                                <select
                                  value={
                                    actionData.actionPlan?.[0]?.september || ""
                                  }
                                  onChange={(e) =>
                                    handleFormChange(
                                      "actionPlan[0].september",
                                      e.target.value,
                                    )
                                  }
                                  type="date"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                >
                                  <option value="">Seçiniz</option>
                                  {dropdownData?.status?.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.value}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Row 4 */}
                            <div className="grid grid-cols-3 gap-4">
                              {/* Verification Status */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  October
                                </label>
                                <select
                                  value={
                                    actionData.actionPlan?.[0]?.october || ""
                                  }
                                  onChange={(e) =>
                                    handleFormChange(
                                      "actionPlan[0].october",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                >
                                  <option value="">Seçiniz</option>
                                  {dropdownData?.status?.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.value}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Comment */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  November
                                </label>
                                <select
                                  value={
                                    actionData.actionPlan?.[0]?.november || ""
                                  }
                                  onChange={(e) =>
                                    handleFormChange(
                                      "actionPlan[0].november",
                                      e.target.value,
                                    )
                                  }
                                  type="text"
                                  placeholder="Comment"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                  <option value="">Seçiniz</option>
                                  {dropdownData?.status?.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.value}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  December
                                </label>
                                <select
                                  value={
                                    actionData.actionPlan?.[0]?.december || ""
                                  }
                                  onChange={(e) =>
                                    handleFormChange(
                                      "actionPlan[0].december",
                                      e.target.value,
                                    )
                                  }
                                  type="text"
                                  placeholder="Comment"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                  <option value="">Seçiniz</option>
                                  {dropdownData?.status?.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.value}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-blue-100 flex justify-end space-x-4">
                <button
                  onClick={closeModal}
                  className="!rounded-button whitespace-nowrap cursor-pointer border-2 border-gray-300 text-gray-600 px-6 py-2 hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={saveRisk}
                  className="!rounded-button whitespace-nowrap cursor-pointer bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 hover:from-blue-600 hover:to-blue-800 transition-all duration-300"
                >
                  {modalMode === "add" ? "Add Action" : "Update Action"}
                </button>
              </div>
            </div>
          </div>
        ))}
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white !rounded-button shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Confirm Delete
              </h3>
              <p className="text-gray-600 mb-6">
                {isBulkDelete
                  ? `Are you sure you want to delete ${selectedCount} selected risk item(s)? This action can be undo..`
                  : "Are you sure you want to delete this risk item? This action can be undo..."}
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="!rounded-button whitespace-nowrap cursor-pointer border-2 border-gray-300 text-gray-600 px-4 py-2 hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="!rounded-button whitespace-nowrap cursor-pointer bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 hover:from-red-600 hover:to-red-700 transition-all duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocProfile;
