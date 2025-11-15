import React, { useState, useEffect } from "react";
import BgRiskBody from "./tabledatas/bgrisk.jsx";
import BgHeaders from "./tableheaders/tableheards.jsx";
export const hCheckboxChange =
  (setSelectedRows, setSelectedTable) => (id, table) => {
    // id'ye uygun objeyi bul
    const selectedItem = table.find((item) => item.id === id);

    // Seçili tabloları güncelle
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

const RisksAssessment = () => {
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

  const [logs, setLogs] = useState([{ id: "a-l", name: "Action Log" }]);
  const [selectedTable, setSelectedTable] = useState([]);
  const [activeHeader, setActiveHeader] = useState(true);
  const [selectedOption, setSelectedOption] = useState("e-chart");
  const [selectedRisk, setSelectedRisk] = useState("bg-reg");
  const [isOpenReg, setIsOpenReg] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false); // Bulk delete için yeni state
  const [deletingId, setDeletingId] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set()); // Checkbox state'i ekle
  const [dropdownData, setDropdownData] = useState({});
  const handleCheckboxChange = hCheckboxChange(
    setSelectedRows,
    setSelectedTable,
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

  // Handlers
  const toggleArchiveView = () => {
    setShowArchived(!showArchived);
    if (showDeleted || showAction) {
      setShowDeleted(false);
      setShowAction(false);
    }
  };
  const toggleDeleteView = () => {
    setShowDeleted(!showDeleted);
    if (showArchived || showAction) {
      setShowArchived(false);
      setShowAction(false);
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
    const dropdownData = await getDefaultDropdownList();
    setModalMode("add");
    setEditingRow(null);
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
  };

  const openEditModal = async (row) => {
    const dropdownData = await getDefaultDropdownList();
    setModalMode("edit");
    setEditingRow(row);

    setShowModal(true);
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
  };

  const handleFormChange = (arg1, arg2) => {
    if (typeof arg1 === "string") {
      // Input/select path-value modu (mevcut mantık, ama güvenli hale getir)
      const updateNested = (obj, pathArr, val) => {
        const newObj = { ...(obj || {}) }; // prev undefined ise boş obje
        let current = newObj;
        for (let i = 0; i < pathArr.length - 1; i++) {
          const key = pathArr[i];
          if (!current[key]) current[key] = {}; // Boş obje oluştur
          current[key] = { ...current[key] };
          current = current[key];
        }
        current[pathArr[pathArr.length - 1]] = val;
        return newObj;
      };
      const pathArr = arg1.split(".");
      setFormData((prev) => updateNested(prev, pathArr, arg2));
    } else if (arg1 && typeof arg1 === "object") {
      // Select obje modu (eğer { ...formData, swot: value } geçiriyorsan)
      setFormData((prev) => ({ ...(prev || {}), ...arg1 }));
    } else {
      console.warn("handleFormChange: Beklenen string path veya obje");
    }
  };
  const closeModal = () => setShowModal(false);

  const saveRisk = () => {
    if (modalMode === "add") {
      // Sadece backend beklediği alanları al (diğerlerini sil)
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
    } else {
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
    const row = getSelectedRow();
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
                    onClick={() => setSelectedRisk(risk.id)}
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
        {/* Main Content Area */}
        <div className="flex-1 ml-64 p-8 bg-gradient-to-br from-blue-50/50 to-white h-full overflow-y-auto">
          {selectedRisk === "bg-reg" && selectedOption === "e-chart" ? (
            <div className="bg-white !rounded-button shadow-lg overflow-hidden">
              <div className="p-6 border-b border-blue-100 flex justify-between items-center">
                <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  E-Chart
                </h3>
                <div className="flex space-x-3 items-center">
                  <button
                    onClick={openAddModal}
                    className="!rounded-button whitespace-nowrap cursor-pointer bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                  >
                    <i className="fas fa-plus mr-2"></i>Add Risk
                  </button>
                  <button
                    onClick={toggleArchiveView}
                    className={[
                      "!rounded-button whitespace-nowrap cursor-pointer px-4 py-2 transition-all duration-300 shadow-md hover:shadow-lg text-sm",
                      showArchived
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                        : "bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700",
                    ].join(" ")}
                  >
                    <i className="fas fa-archive mr-2"></i>
                    {showArchived ? "Hide Archived" : "Show Archived"}
                  </button>
                  <button
                    onClick={toggleDeleteView}
                    className={[
                      "!rounded-button whitespace-nowrap cursor-pointer px-4 py-2 transition-all duration-300 shadow-md hover:shadow-lg text-sm",
                      showDeleted
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                        : "bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700",
                    ].join(" ")}
                  >
                    <i className="fas fa-archive mr-2"></i>
                    {showDeleted ? "Hide Deleted" : "Show Deleted"}
                  </button>
                <button
                    onClick={toggleActionView}
                    className={[
                      "!rounded-button whitespace-nowrap cursor-pointer px-4 py-2 transition-all duration-300 shadow-md hover:shadow-lg text-sm",
                      showAction
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                        : "bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700",
                    ].join(" ")}
                  >
                    <i className="fas fa-archive mr-2"></i>
                    {showAction ? "Hide Action" : "Show Action"}
                  </button>


                  <button
                    onClick={() => {
                      setSelectedOption("datas"); // selectedOption'ı "datas" yap
                    }}
                    className={[
                      "!rounded-button whitespace-nowrap cursor-pointer px-4 py-2 transition-all duration-300 shadow-md hover:shadow-lg text-sm",
                      selectedOption
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                        : "bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700",
                    ].join(" ")}
                  >
                    <i className="fas fa-archive mr-2"></i>
                    {selectedOption ? "Data" : "E-Chart"}
                  </button>

                  {/* Actions butonları header'a taşındı */}
                  <div className="flex space-x-2">
                    <button
                      onClick={editSingle}
                      disabled={selectedCount !== 1}
                      className={[
                        "!rounded-button whitespace-nowrap cursor-pointer bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm",
                        selectedCount !== 1
                          ? "opacity-50 cursor-not-allowed"
                          : "",
                      ].join(" ")}
                      title="Edit (Single Selection Only)"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={archive}
                      disabled={selectedCount === 0}
                      className={[
                        "!rounded-button whitespace-nowrap cursor-pointer bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm",
                        selectedCount === 0
                          ? "opacity-50 cursor-not-allowed"
                          : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700",
                      ].join(" ")}
                      title="Archive/Restore Selected"
                    >
                      <i
                        className={
                          showArchived ? "fas fa-undo" : "fas fa-archive"
                        }
                      ></i>
                    </button>
                    <button
                      onClick={selectedCount > 0 ? confirmBulkDelete : () => {}} // Bulk delete için güncellendi
                      disabled={selectedCount === 0}
                      className={[
                        "!rounded-button whitespace-nowrap cursor-pointer bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm",
                        selectedCount === 0
                          ? "opacity-50 cursor-not-allowed"
                          : "",
                      ].join(" ")}
                      title="Delete Selected"
                    >
                      <i className={
                        showDeleted ? "fas fa-trash-restore" : "fas fa-trash"}></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto max-h-[75vh] overflow-y-auto">
                {/* e-chart için özel içerik: Örneğin bir chart component'i buraya koy (ECharts, Recharts vs.) */}
                <div className="p-6">
                  <h4 className="text-lg font-medium mb-4">E-Chart View</h4>
                  {/* Placeholder: Gerçek chart component'ini buraya ekle, örneğin <EChart data={riskData} /> */}
                  <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">
                      E-Chart Placeholder (Risk verileri için grafik)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : selectedRisk === "bg-reg" && selectedOption === "datas" ? (
            <div className="bg-white !rounded-button shadow-lg overflow-hidden">
              <div className="p-6 border-b border-blue-100 flex justify-between items-center">
                <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Datas
                </h3>
                <div className="flex space-x-3 items-center">
                  <button
                    onClick={openAddModal}
                    className="!rounded-button whitespace-nowrap cursor-pointer bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                  >
                    <i className="fas fa-plus mr-2"></i>Add Risk
                  </button>
                  <button
                    onClick={toggleArchiveView}
                    className={[
                      "!rounded-button whitespace-nowrap cursor-pointer px-4 py-2 transition-all duration-300 shadow-md hover:shadow-lg text-sm",
                      showArchived
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                        : "bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700",
                    ].join(" ")}
                  >
                    <i className="fas fa-archive mr-2"></i>
                    {showArchived ? "Hide Archived" : "Show Archived"}
                  </button>
                  <button
                    onClick={toggleDeleteView}
                    className={[
                      "!rounded-button whitespace-nowrap cursor-pointer px-4 py-2 transition-all duration-300 shadow-md hover:shadow-lg text-sm",
                      showDeleted
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                        : "bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700",
                    ].join(" ")}
                  >
                    <i className="fas fa-archive mr-2"></i>
                    {showDeleted ? "Hide Deleted" : "Show Deleted"}
                  </button>
                <button
                    onClick={toggleActionView}
                    className={[
                      "!rounded-button whitespace-nowrap cursor-pointer px-4 py-2 transition-all duration-300 shadow-md hover:shadow-lg text-sm",
                      showAction
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                        : "bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700",
                    ].join(" ")}
                  >
                    <i className="fas fa-archive mr-2"></i>
                    {showAction ? "Hide Action" : "Show Action"}
                  </button>


                  <button
                    onClick={() => {
                      setSelectedOption("e-chart"); // selectedOption'ı "datas" yap
                    }}
                    className={[
                      "!rounded-button whitespace-nowrap cursor-pointer px-4 py-2 transition-all duration-300 shadow-md hover:shadow-lg text-sm",
                      selectedOption
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                        : "bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700",
                    ].join(" ")}
                  >
                    <i className="fas fa-archive mr-2"></i>
                    {selectedOption ? "E-Chart" : "Data"}
                  </button>

                  {/* Actions butonları header'a taşındı */}
                  <div className="flex space-x-2">
                    <button
                      onClick={editSingle}
                      disabled={!(selectedCount >= 1 && !showDeleted)}
                      className={[
                        "!rounded-button whitespace-nowrap cursor-pointer bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm",
                        !(selectedCount >= 1 && !showDeleted)
                          ? "opacity-50 cursor-not-allowed"
                          : "",
                      ].join(" ")}
                      title="Edit (Single Selection Only)"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={archive}
                      disabled={!(selectedCount >= 1 && !showDeleted)}
                      className={[
                        "!rounded-button whitespace-nowrap cursor-pointer bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm",
                        !(selectedCount >= 1 && !showDeleted)
                          ? "opacity-50 cursor-not-allowed"
                          : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700",
                      ].join(" ")}
                      title="Archive/Restore Selected"
                    >
                      <i
                        className={
                          showArchived ? "fas fa-undo" : "fas fa-archive"
                        }
                      ></i>
                    </button>

                    <button
                      onClick={selectedCount > 0 ? confirmBulkDelete : () => {}} // Bulk delete için güncellendi
                      disabled={selectedCount === 0}
                      className={[
                        "!rounded-button whitespace-nowrap cursor-pointer bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm",
                        selectedCount === 0
                          ? "opacity-50 cursor-not-allowed"
                          : "",
                      ].join(" ")}
                      title="Delete Selected"
                    >
                       <i className={
                        showDeleted ? "fas fa-trash-restore" : "fas fa-trash"}></i>

                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto max-h-[75vh] overflow-y-auto">
                {" "}
                  <table>
                  <BgHeaders activeHeader={activeHeader} />
                  <BgRiskBody
                    selectedRows={selectedRows}
                    showArchived={showArchived}
                    showDeleted={showDeleted}
                    onCheckboxChange={handleCheckboxChange}
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
      {showModal && (
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
                      SWOT
                    </label>
                    <select
                      value={formData.swot || ""} // Null-safe
                      onChange={(e) => {
                        console.log(
                          "Select onChange tetiklendi! Yeni value:",
                          e.target.value,
                        ); // Debug: Bu çıkmıyorsa onChange patlıyor
                        handleFormChange("swot", e.target.value); // String path + value – obje değil!
                      }}
                    >
                      <option value="">Seçiniz</option>
                      {dropdownData?.swot?.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.value}
                        </option>
                      ))}
                    </select>{" "}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PESTLE
                    </label>
                    <select
                      value={formData.pestle || ""} // Null-safe
                      onChange={(e) => {
                        console.log(
                          "Select onChange tetiklendi! Yeni value:",
                          e.target.value,
                        ); // Debug: Bu çıkmıyorsa onChange patlıyor
                        handleFormChange("pestle", e.target.value); // String path + value – obje değil!
                      }}
                    >
                      <option value="">Seçiniz</option>
                      {dropdownData?.pestle?.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.value}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interested Party
                    </label>
                    <select
                      value={formData.interestedParty}
                      onChange={(e) => {
                        console.log(
                          "Select onChange tetiklendi! Yeni value:",
                          e.target.value,
                        ); // Debug: Bu çıkmıyorsa onChange patlıyor
                        handleFormChange("interestedParty", e.target.value); // String path + value – obje değil!
                      }}
                    >
                      <option value="">Seçiniz</option>
                      {dropdownData?.interestedParty?.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.value}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Risk / Opportunity
                    </label>
                    <input
                      value={formData.riskOpportunity}
                      onChange={(e) =>
                        handleFormChange("riskOpportunity", e.target.value)
                      }
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Objective
                    </label>
                    <input
                      value={formData.objective}
                      onChange={(e) =>
                        handleFormChange("objective", e.target.value)
                      }
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      KPI
                    </label>
                    <input
                      value={formData.kpi}
                      onChange={(e) => handleFormChange("kpi", e.target.value)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Process
                    </label>
                    <select
                      value={formData.process}
                      onChange={(e) => {
                        console.log(
                          "Select onChange tetiklendi! Yeni value:",
                          e.target.value,
                        ); // Debug: Bu çıkmıyorsa onChange patlıyor
                        handleFormChange("process", e.target.value); // String path + value – obje değil!
                      }}
                    >
                      <option value="">Seçiniz</option>
                      {dropdownData?.process?.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.value}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Existing Risk Mitigation
                    </label>
                    <input
                      value={formData.ermeoa}
                      onChange={(e) =>
                        handleFormChange("ermeoa", e.target.value)
                      }
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Initial Risk
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <select
                        value={formData.initialRiskSeverity}
                        onChange={(e) => {
                          console.log(
                            "Select onChange tetiklendi! Yeni value:",
                            e.target.value,
                          ); // Debug: Bu çıkmıyorsa onChange patlıyor
                          const newValue = parseInt(e.target.value, 10) || 0;
                          handleFormChange("initialRiskSeverity", newValue); // String path + value – obje değil!
                        }}
                      >
                        <option value="">Seçiniz</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </select>
                      <select
                        value={formData.initialRiskLikelyhood}
                        onChange={(e) => {
                          console.log(
                            "Select onChange tetiklendi! Yeni value:",
                            e.target.value,
                          ); // Debug: Bu çıkmıyorsa onChange patlıyor
                          const newValue = parseInt(e.target.value, 10) || 0;
                          handleFormChange("initialRiskLikelyhood", newValue); // String path + value – obje değil!
                        }}
                      >
                        <option value="">Seçiniz</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </select>
                    </div>
                  </div>
                  {/* // <div>
                  //   <label className="block text-sm font-medium text-gray-700 mb-2">
                  //     Action Plan
                  //   </label>
                  //   <div className="space-y-3">
                  //     <div className="grid grid-cols-3 gap-2">
                  //       <input
                  //         value={formData.actionPlan.action}
                  //         onChange={(e) =>
                  //           handleFormChange(
                  //             "actionPlan.action",
                  //             e.target.value,
                  //           )
                  //         }
                  //         type="text"
                  //         placeholder="Action"
                  //         className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  //       />
                  //       <input
                  //         value={formData.actionPlan.raiseDate}
                  //         onChange={(e) =>
                  //           handleFormChange(
                  //             "actionPlan.raiseDate",
                  //             e.target.value,
                  //           )
                  //         }
                  //         type="text"
                  //         placeholder="Raise Date"
                  //         className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  //       />
                  //       <input
                  //         value={formData.actionPlan.resources}
                  //         onChange={(e) =>
                  //           handleFormChange(
                  //             "actionPlan.resources",
                  //             e.target.value,
                  //           )
                  //         }
                  //         type="text"
                  //         placeholder="Resources"
                  //         className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  //       />
                  //     </div>
                  //     <div className="grid grid-cols-3 gap-2">
                  //       <input
                  //         value={formData.actionPlan.function}
                  //         onChange={(e) =>
                  //           handleFormChange(
                  //             "actionPlan.function",
                  //             e.target.value,
                  //           )
                  //         }
                  //         type="text"
                  //         placeholder="Relative Function"
                  //         className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  //       />
                  //       <input
                  //         value={formData.actionPlan.responsible}
                  //         onChange={(e) =>
                  //           handleFormChange(
                  //             "actionPlan.responsible",
                  //             e.target.value,
                  //           )
                  //         }
                  //         type="text"
                  //         placeholder="Responsible"
                  //         className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  //       />
                  //       <input
                  //         value={formData.actionPlan.deadline}
                  //         onChange={(e) =>
                  //           handleFormChange(
                  //             "actionPlan.deadline",
                  //             e.target.value,
                  //           )
                  //         }
                  //         type="text"
                  //         placeholder="Deadline"
                  //         className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  //       />
                  //     </div>
                  //     <div className="grid grid-cols-3 gap-2">
                  //       <input
                  //         value={formData.actionPlan.actionConfirmation}
                  //         onChange={(e) =>
                  //           handleFormChange(
                  //             "actionPlan.actionConfirmation",
                  //             e.target.value,
                  //           )
                  //         }
                  //         type="text"
                  //         placeholder="Action Confirmation"
                  //         className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  //       />
                  //       <input
                  //         value={formData.actionPlan.actionStatus}
                  //         onChange={(e) =>
                  //           handleFormChange(
                  //             "actionPlan.actionStatus",
                  //             e.target.value,
                  //           )
                  //         }
                  //         type="text"
                  //         placeholder="Action Status"
                  //         className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  //       />
                  //       <input
                  //         value={formData.actionPlan.compilationDate}
                  //         onChange={(e) =>
                  //           handleFormChange(
                  //             "actionPlan.compilationDate",
                  //             e.target.value,
                  //           )
                  //         }
                  //         type="text"
                  //         placeholder="Compilation Date"
                  //         className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  //       />
                  //     </div>
                  //     <div className="grid grid-cols-2 gap-2">
                  //       <input
                  //         value={formData.actionPlan.verification}
                  //         onChange={(e) =>
                  //           handleFormChange(
                  //             "actionPlan.verification",
                  //             e.target.value,
                  //           )
                  //         }
                  //         type="text"
                  //         placeholder="Status Of Verification"
                  //         className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  //       />
                  //       <input
                  //         value={formData.actionPlan.comment}
                  //         onChange={(e) =>
                  //           handleFormChange(
                  //             "actionPlan.comment",
                  //             e.target.value,
                  //           )
                  //         }
                  //         type="text"
                  //         placeholder="Comment"
                  //         className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  //       />
                  //     </div>
                  //   </div>
                  // </div> */}
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Residual Risk / Opportunity Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={formData.residualRiskSeverity}
                      onChange={(e) => {
                        console.log(
                          "Select onChange tetiklendi! Yeni value:",
                          e.target.value,
                        ); // Debug: Bu çıkmıyorsa onChange patlıyor
                        const newValue = parseInt(e.target.value, 10) || 0;
                        handleFormChange("residualRiskSeverity", newValue); // String path + value – obje değil!
                      }}
                    >
                      <option value="">Seçiniz</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </select>
                    <select
                      value={formData.residualRiskLikelyhood}
                      onChange={(e) => {
                        console.log(
                          "Select onChange tetiklendi! Yeni value:",
                          e.target.value,
                        ); // Debug: Bu çıkmıyorsa onChange patlıyor
                        const newValue = parseInt(e.target.value, 10) || 0;
                        handleFormChange("residualRiskLikelyhood", newValue); // String path + value – obje değil!
                      }}
                    >
                      <option value="">Seçiniz</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
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
      )}
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

export default RisksAssessment;
