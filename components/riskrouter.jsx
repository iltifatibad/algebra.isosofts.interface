import React, { useState, useEffect } from "react";
import BgRiskBody from "./tabledatas/bgrisk.jsx";
import BgHeaders from "./tableheaders/tableheards.jsx";

import HsHeaders from "./tableheaders/hsrheaders.jsx";
import HsrBody from "./tabledatas/hsr.jsx";


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
  (setSelectedRows, setSelectedTable) => (id, table) => {
    const selectedItem = table.find((item) => item.id === id);
    setSelectedTable((prev) => {
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
    setSelectedRows((prev) => {
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

const RiskRouter = () => {
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
  const [selectedOption, setSelectedOption] = useState("e-chart");
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
    ermeoa: "",
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
  const getSelectedRow = () => selectedTable[0];
  const getSelectedRowForAction = () => selectedTableForActions[0];
  // Handlers
  const toggleArchiveView = () => {
    setShowArchived(!showArchived);
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
    } else {
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
      if (selectedRisk == "bg-reg"){
      setFormData({
        swot: "",
        pestle: "",
        interestedParty: "",
        riskOpportunity: "",
        objective: "",
        kpi: "",
        process: "",
        ermeoa: "",
        initialRiskSeverity: 0,
        initialRiskLikelyhood: 0,
        residualRiskSeverity: 0,
        residualRiskLikelyhood: 0,
      });
      setShowModal(true);
      } else if (selectedRisk == "hs-reg") {
        setFormDataHs({
        process: "",
        hazard: "",
        risk: "",
        affectedPositions: "",
        ERMA: "",
        initialRiskSeverity: 0,
        initialRiskLikelyhood: 0,
        residualRiskSeverity: 0,
        residualRiskLikelyhood: 0,
      });
      setShowModal(true);
      }

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
        january: "10",
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
      if (selectedRisk == "bg-reg"){
          setFormData({
          swot: row.swot.id,
          pestle: row.pestle.id,
          interestedParty: row.interestedParty.id,
          process: row.process.id,
          riskOpportunity: row.riskOpportunity,
          objective: row.objective,
          kpi: row.kpi,
          ermeoa: row.ermeoa,
          initialRiskSeverity: row.initialRiskSeverity,
          initialRiskLikelyhood: row.initialRiskLikelyhood,
          residualRiskSeverity: row.residualRiskSeverity,
          residualRiskLikelyhood: row.residualRiskLikelyhood,
        });
      } else if(selectedRisk == "hs-reg"){
          setFormDataHs({
              process: row.hazard.id,
              hazard: "",
              risk: "",
              affectedPositions: "",
              ERMA: "",
              initialRiskSeverity: 0,
              initialRiskLikelyhood: 0,
              residualRiskSeverity: 0,
              residualRiskLikelyhood: 0,
            });
      }

    } else {
      setActionData({
        actionPlan: [
          {
            title: row.title,
            raiseDate: row.raiseDate,
            resources: row.resources,
            currency: "", // ✨ aynen kalacak
            relativeFunction: row.relativeFunction?.id || "",
            responsible: row.responsible?.id || "",
            deadline: row.deadline,
            confirmation: row.confirmation?.id || "",
            status: row.status?.id || "",
            completionDate: row.completionDate || "",
            verificationStatus: row.verificationStatus?.id || "",
            comment: row.comment || "",
            january: row.january.id || "",
            february: row.february.id || "",
            march: row.march.id || "",
            april: row.april.id || "",
            may: row.may.id || "",
            june: row.june.id || "",
            july: row.july.id || "",
            august: row.august.id || "",
            september: row.september.id || "",
            october: row.october.id || "",
            november: row.november.id || "",
            december: row.december.id || "",
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
    } else if (selectedRisk === "hs-reg") {
      setter = setFormDataHs;
    } else {
      setter = setFormData; // default fallback
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
        if (selectedRisk == "bg-reg"){
                   const payload = {
          swot: formData.swot,
          pestle: formData.pestle,
          interestedParty: formData.interestedParty,
          riskOpportunity: formData.riskOpportunity,
          objective: formData.objective,
          kpi: formData.kpi,
          process: formData.process,
          ermeoa: formData.ermeoa,
          initialRiskSeverity: formData.initialRiskSeverity, // Number
          initialRiskLikelyhood: formData.initialRiskLikelyhood, // Number, spelling uyumlu
          residualRiskSeverity: formData.residualRiskSeverity,
          residualRiskLikelyhood: formData.residualRiskLikelyhood,
        };
        console.log("Gönderilen body:", payload); // Debug: Tam beklenen format mı?
        
        fetch("http://localhost:8000/api/register/br/one", {
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
        } else if (selectedRisk == "hs-reg"){
          const payload = {
          process: formDataHs.process,
          hazard: formDataHs.hazard,
          risk: formDataHs.risk,
          affectedPositions: formDataHs.affectedPositions,
          erma: formDataHs.ERMA,
          initialRiskSeverity: formDataHs.initialRiskSeverity, // Number
          initialRiskLikelyhood: formDataHs.initialRiskLikelyhood, // Number, spelling uyumlu
          residualRiskSeverity: formDataHs.residualRiskSeverity,
          residualRiskLikelyhood: formDataHs.residualRiskLikelyhood,
        };
        console.log("Gönderilen body:", payload); // Debug: Tam beklenen format mı?
        
        fetch("http://localhost:8000/api/register/hsr/one", {
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
 
      } else {
        const payload = {
          registerId: Array.from(selectedRows)[0],
          title: actionData.actionPlan[0]?.title || "",
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
          swot: formData.swot,
          pestle: formData.pestle,
          interestedParty: formData.interestedParty,
          riskOpportunity: formData.riskOpportunity,
          objective: formData.objective,
          kpi: formData.kpi,
          process: formData.process,
          ermeoa: formData.ermeoa,
          initialRiskSeverity: formData.initialRiskSeverity, // Number
          initialRiskLikelyhood: formData.initialRiskLikelyhood, // Number, spelling uyumlu
          residualRiskSeverity: formData.residualRiskSeverity,
          residualRiskLikelyhood: formData.residualRiskLikelyhood,
        };
        console.log("Gönderilen body:", payload); // Debug: Tam beklenen format mı?
        const url =
          "http://localhost:8000/api/register/br/one/" + selectedTable[0].id;
        fetch(url, {
          method: "PUT",
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
        setActionData({
          actionPlan: [
            {
              title: actionData.actionPlan[0].title,
              raiseDate: actionData.raiseDate,
              resources: actionData.actionPlan[0].resources,
              currency: "", // ✨ aynen kalacak
              relativeFunction: actionData.relativeFunction?.id || "",
              responsible: actionData.responsible?.id || "",
              deadline: actionData.deadline,
              confirmation: actionData.actionPlan[0].confirmation?.id || "",
              status: actionData.actionPlan[0].status?.id,
              completionDate: actionData.completionDate,
              verificationStatus: actionData.verificationStatus?.id,
              comment: actionData.comment,
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
        const payload = { ...actionData.actionPlan[0] };
        console.log("Gönderilen body:", payload); // Debug: Tam beklenen format mı?
        const url =
          "http://localhost:8000/api/register/component/action/one/" +
          selectedTableForActions[0].id;
        fetch(url, {
          method: "PUT",
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
        fetch("http://localhost:8000/api/register/br/all/delete", {
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
              setShowDeleteModal(false);
              setRefresh(true);
            }
          })
          .catch((error) => console.log(" Error While Deleting: ", error));
      } else {
        fetch("http://localhost:8000/api/register/br/all/undelete", {
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
              setShowDeleteModal(false);
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
              console.log(" Deleting Success");
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
      fetch("http://localhost:8000/api/register/br/all/unarchive", {
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
            console.log(" UnArchiving Success ");
          }
        })
        .catch((error) => console.log(" Error While UnArchiving : ", error));
      setRefresh(true);
    } else {
      fetch("http://localhost:8000/api/register/br/all/archive", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [...selectedRows] }),
      })
        .then((response) => {
          if (!response.ok) {
            console.log(selectedRows);
            console.log(" Archiving Failed ");
          } else {
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
        {/* Left Sidebar */}
        <div className="w-64 bg-white shadow-lg border-r border-blue-100 fixed left-0 top-20 h-full overflow-y-auto z-10">
          <div
            className="p-6 border-b border-blue-100 cursor-pointer select-none" // Tıklanabilir hale getirdim
            onClick={() => setIsOpenReg(!isOpenReg)} // Tıkla aç/kapat
          >
            <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent flex items-center justify-between">
              <span>Risks</span> {/* Başlık metni */}
              {/* Açma/Kapama İkonu */}
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${isOpenReg ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </h2>
          </div>

          {/* Liste Bölümü - Conditional Render */}
          <nav
            className={`transition-all duration-300 ease-in-out ${isOpenReg ? "max-h-[83vh] p-4 overflow-auto" : "max-h-0 p-0 overflow-hidden"}`}
          >
            <ul className={`space-y-2 ${isOpenReg ? "block" : "hidden"}`}>
              {risks.map((risk) => (
                <li key={risk.id}>
                  <button
                    onClick={() => {
                      setSelectedRisk(risk.id);
                      console.log("SELECTED RISK (henüz state güncellenmeden):", risk.id);
                    }}
                    className={[
                      "w-full text-left px-4 py-3 !rounded-button transition-all duration-300 cursor-pointer", // whitespace-nowrap kaldırıldı (önceki sorun için)
                      selectedRisk === risk.id
                        ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600",
                    ].join(" ")}
                  >
                    {risk.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>{" "}
      </div>
    </div>
  );
};

export default RiskRouter;
