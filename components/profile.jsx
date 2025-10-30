import React, { useState, useEffect } from "react";

const RisksAssessment = () => {
  // Sample data - gerçek projede API'den veya props'tan gelebilir
  const [risks, setRisks] = useState([
    { id: "bg-reg", name: "BG Reg" },
    // Diğer risk kategorileri eklenebilir
  ]);

  const [selectedRisk, setSelectedRisk] = useState("bg-reg");
  const [tableData, setTableData] = useState([
    // Sample table data
    {
      id: 1,
      swot: "Strengths",
      pestle: "Political",
      interestedParty: "Stakeholder A",
      riskOpportunity: "Market Risk",
      objective: "Increase Revenue",
      kpi: "10% Growth",
      process: "Sales Process",
      existingRisk: "Current Mitigation",
      initialRisk: {
        severity: "High",
        likelihood: "Medium",
        riskLevel: "High",
      },
      actionPlan: {
        action: "Implement Plan",
        raiseDate: "2025-01-01",
        resources: "Team A",
        function: "Marketing",
        responsible: "John Doe",
        deadline: "2025-06-01",
        actionStatus: "In Progress",
        verification: "Verified",
        comment: "On track",
      },
      residualRisk: "Low",
      archived: false,
    },
    // Daha fazla row eklenebilir
  ]);

  const [showArchived, setShowArchived] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState({
    swot: "",
    pestle: "",
    interestedParty: "",
    riskOpportunity: "",
    objective: "",
    kpi: "",
    process: "",
    existingRisk: "",
    initialRisk: { severity: "", likelihood: "", riskLevel: "" },
    actionPlan: {
      action: "",
      raiseDate: "",
      resources: "",
      function: "",
      responsible: "",
      deadline: "",
      actionStatus: "",
      verification: "",
      comment: "",
    },
    residualRisk: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false); // Bulk delete için yeni state
  const [deletingId, setDeletingId] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set()); // Checkbox state'i ekle

  // Filtered data based on archived
  const filteredTableData = tableData.filter(
    (row) => showArchived || !row.archived,
  );

  // Checkbox handler
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

  // Seçili row sayısı
  const selectedCount = selectedRows.size;
  const getSelectedRow = () =>
    filteredTableData.find((row) => selectedRows.has(row.id)) || null;

  // Handlers
  const toggleArchiveView = () => setShowArchived(!showArchived);

  const openAddModal = () => {
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
      existingRisk: "",
      initialRisk: { severity: "", likelihood: "", riskLevel: "" },
      actionPlan: {
        action: "",
        raiseDate: "",
        resources: "",
        function: "",
        responsible: "",
        deadline: "",
        actionStatus: "",
        verification: "",
        comment: "",
      },
      residualRisk: "",
    });
    setShowModal(true);
  };

  const openEditModal = (row) => {
    setModalMode("edit");
    setEditingRow(row);
    setFormData({
      ...row,
      initialRisk: { ...row.initialRisk },
      actionPlan: { ...row.actionPlan },
    });
    setShowModal(true);
  };

  const handleFormChange = (path, value) => {
    const updateNested = (obj, pathArr, val) => {
      const newObj = { ...obj };
      let current = newObj;
      for (let i = 0; i < pathArr.length - 1; i++) {
        const key = pathArr[i];
        current[key] = { ...current[key] };
        current = current[key];
      }
      current[pathArr[pathArr.length - 1]] = val;
      return newObj;
    };

    const pathArr = path.split(".");
    setFormData((prev) => updateNested(prev, pathArr, value));
  };

  const closeModal = () => setShowModal(false);

  const saveRisk = () => {
    if (modalMode === "add") {
      const newId = Math.max(...tableData.map((r) => r.id), 0) + 1;
      setTableData((prev) => [
        ...prev,
        { ...formData, id: newId, archived: false },
      ]);
    } else {
      setTableData((prev) =>
        prev.map((row) =>
          row.id === editingRow.id ? { ...formData, id: row.id } : row,
        ),
      );
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
    if (isBulkDelete) {
      bulkDelete();
    } else {
      singleDelete();
    }
  };

  const toggleArchive = (id) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, archived: !row.archived } : row,
      ),
    );
  };

  // Bulk actions
  const bulkArchive = () => {
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

  const archiveSingle = () => {
    const row = getSelectedRow();
    if (row) toggleArchive(row.id);
  };

  return (
    <div className="pt-20 h-screen overflow-hidden">
      <div className="flex h-full">
        {/* Left Sidebar */}
        <div className="w-64 bg-white shadow-lg border-r border-blue-100 fixed left-0 top-20 h-full overflow-y-auto z-10">
          <div className="p-6 border-b border-blue-100">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Risks
            </h2>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              {risks.map((risk) => (
                <li key={risk.id}>
                  <button
                    onClick={() => setSelectedRisk(risk.id)}
                    className={[
                      "w-full text-left px-4 py-3 !rounded-button transition-all duration-300 cursor-pointer whitespace-nowrap",
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
        </div>
        {/* Main Content Area */}
        <div className="flex-1 ml-64 p-8 bg-gradient-to-br from-blue-50/50 to-white h-full overflow-y-auto">
          {selectedRisk === "bg-reg" ? (
            <div className="bg-white !rounded-button shadow-lg overflow-hidden">
              <div className="p-6 border-b border-blue-100 flex justify-between items-center">
                <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  BG Reg Risk Assessment
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
                  {/* Actions butonları header'a taşındı */}
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={editSingle}
                      disabled={selectedCount !== 1}
                      className={[
                        "!rounded-button whitespace-nowrap cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-1 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-xs shadow-sm",
                        selectedCount !== 1
                          ? "opacity-50 cursor-not-allowed"
                          : "",
                      ].join(" ")}
                      title="Edit (Single Selection Only)"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={bulkArchive}
                      disabled={selectedCount === 0}
                      className={[
                        "!rounded-button whitespace-nowrap cursor-pointer px-2 py-1 transition-all duration-300 text-xs shadow-sm",
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
                        "!rounded-button whitespace-nowrap cursor-pointer bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 hover:from-red-600 hover:to-red-700 transition-all duration-300 text-xs shadow-sm",
                        selectedCount === 0
                          ? "opacity-50 cursor-not-allowed"
                          : "",
                      ].join(" ")}
                      title="Delete Selected"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto overflow-y-auto relative min-w-0">
                <table className="w-full text-sm table-auto border-collapse border-spacing-0 border border-blue-500 min-w-[2000px]">
                  <thead className="bg-gradient-to-r from-blue-100 via-blue-150 to-blue-200">
                    {/* Level 1: Ana sütunlar rowSpan=2 ile 2 satırı kaplar, Initial ve Action üst başlıkları yan yana */}
                    <tr>
                      <th
                        className=" min-w-15 border border-blue-500 sticky left-[-1px] top-0 z-10 bg-white -ml-px"
                        rowSpan={2}
                      >
                        #
                      </th>
                      <th
                        className=" min-w-15 border border-blue-500"
                        rowSpan={2}
                      >
                        SWOT
                      </th>
                      <th
                        className=" min-w-15 border border-blue-500"
                        rowSpan={2}
                      >
                        PESTLE
                      </th>
                      <th
                        className=" min-w-15 border border-blue-500"
                        rowSpan={2}
                      >
                        Interested Party
                      </th>
                      <th
                        className=" min-w-15 border border-blue-500"
                        rowSpan={2}
                      >
                        Risk/Oppurtunity
                      </th>
                      <th
                        className=" min-w-15 border border-blue-500"
                        rowSpan={2}
                      >
                        Objective
                      </th>
                      <th
                        className=" min-w-15 border border-blue-500"
                        rowSpan={2}
                      >
                        KPI
                      </th>
                      <th
                        className=" min-w-15 border border-blue-500"
                        rowSpan={2}
                      >
                        Process
                      </th>
                      <th
                        className=" min-w-50 border border-blue-500"
                        rowSpan={2}
                      >
                        Existing Risk Mitigation/Exploting Opportunity's Actions
                      </th>
                      <th
                        className=" min-w-15 border border-blue-500"
                        colSpan={3}
                      >
                        Initial Risk
                      </th>{" "}
                      {/* Sol grup: Initial Risk */}
                      <th
                        className=" min-w-15 border border-blue-500"
                        colSpan={11}
                      >
                        Action Plan
                      </th>{" "}
                      <th
                        className=" min-w-15 border border-blue-500"
                        colSpan={3}
                      >
                        Residual Risk/Opportunity Level
                      </th>
                      {/* Sağ grup: Initial'in yanında Action Plan */}
                    </tr>
                    {/* Level 2: Ana sütunlar rowSpan ile kaplı, Initial ve Action alt başlıkları yan yana (her grup 3'er th) */}
                    <tr>
                      <th className=" min-w-15 border border-blue-500">
                        Severity
                      </th>
                      <th className=" min-w-15 border border-blue-500">
                        Likelyhood
                      </th>
                      <th className=" min-w-15 border border-blue-500">Risk</th>
                      {/* Initial alt th'leri bitti, şimdi Action alt th'leri (Initial'in sağında) */}
                      <th className=" min-w-15 border border-blue-500">
                        Action
                      </th>
                      <th className=" min-w-15 border border-blue-500">
                        Action Raise Date
                      </th>
                      <th className=" min-w-15 border border-blue-500">
                        Resources
                      </th>
                      <th className=" min-w-15 border border-blue-500">
                        Relactive Function
                      </th>
                      <th className=" min-w-15 border border-blue-500">
                        Responsible
                      </th>
                      <th className=" min-w-15 border border-blue-500">
                        Deadline
                      </th>
                      <th className=" min-w-15 border border-blue-500">
                        Action Confirmation
                      </th>
                      <th className=" min-w-15 border border-blue-500">
                        Action Status
                      </th>
                      <th className=" min-w-15 border border-blue-500">
                        Compilation Date
                      </th>
                      <th className=" min-w-15 border border-blue-500">
                        Status Of Verification
                      </th>
                      <th className=" min-w-15 border border-blue-500">
                        Comment
                      </th>
                      {/* Level 3*/}
                      <th className=" min-w-15 border border-blue-500">
                        Severity
                      </th>
                      <th className=" min-w-15 border border-blue-500">
                        Likelyhood
                      </th>
                      <th className=" min-w-15 border border-blue-500">
                        Risk Opportunity Level
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-blue-500 px-2 py-1 w-16 sticky left-[-1px] top-0 z-10 bg-white -ml-px">
                        1
                      </td>{" "}
                      {/* # sütunu */}
                      <td className="border border-blue-500 px-2 py-1 w-20">
                        Strength
                      </td>{" "}
                      {/* SWOT */}
                      <td className="border border-blue-500 px-2 py-1 w-20">
                        Political
                      </td>{" "}
                      {/* PESTLE */}
                      <td className="border border-blue-500 px-2 py-1 w-32">
                        Stakeholder
                      </td>{" "}
                      {/* Interested Party */}
                      <td className="border border-blue-500 px-2 py-1 w-32">
                        Risk
                      </td>{" "}
                      {/* Risk/Opportunity */}
                      <td className="border border-blue-500 px-2 py-1 w-28">
                        Mitigate
                      </td>{" "}
                      {/* Objective */}
                      <td className="border border-blue-500 px-2 py-1 w-20">
                        KPI1
                      </td>{" "}
                      {/* KPI */}
                      <td className="border border-blue-500 px-2 py-1 w-24">
                        Process1
                      </td>{" "}
                      {/* Process */}
                      <td className="border border-blue-500 px-2 py-1 w-48">
                        Mitigation Action
                      </td>{" "}
                      {/* Existing Actions */}
                      {/* Initial Risk (3 td) */}
                      <td className="border border-blue-500 px-2 py-1 w-20">
                        High
                      </td>
                      <td className="border border-blue-500 px-2 py-1 w-24">
                        Likely
                      </td>
                      <td className="border border-blue-500 px-2 py-1 w-20">
                        Medium
                      </td>
                      {/* Action Plan (11 td) */}
                      <td className="border border-blue-500 px-2 py-1 w-32">
                        Implement Policy
                      </td>
                      <td className="border border-blue-500 px-2 py-1 w-32">
                        2025-10-30
                      </td>
                      <td className="border border-blue-500 px-2 py-1 w-24">
                        Budget
                      </td>
                      <td className="border border-blue-500 px-2 py-1 w-28">
                        Finance
                      </td>
                      <td className="border border-blue-500 px-2 py-1 w-28">
                        Manager
                      </td>
                      <td className="border border-blue-500 px-2 py-1 w-24">
                        2025-12-31
                      </td>
                      <td className="border border-blue-500 px-2 py-1 w-36">
                        Confirmed
                      </td>
                      <td className="border border-blue-500 px-2 py-1 w-24">
                        In Progress
                      </td>
                      <td className="border border-blue-500 px-2 py-1 w-32">
                        2025-11-15
                      </td>
                      <td className="border border-blue-500 px-2 py-1 w-36">
                        Verified
                      </td>
                      <td className="border border-blue-500 px-2 py-1 w-40">
                        No issues
                      </td>{" "}
                      <td className="border border-blue-500 px-2 py-1 w-24">
                        In Progress
                      </td>
                      <td className="border border-blue-500 px-2 py-1 w-32">
                        2025-11-15
                      </td>
                      <td className="border border-blue-500 px-2 py-1 w-36">
                        Verified
                      </td>
                      {/* Comment */}
                    </tr>

                    {/* Daha fazla satır ekle: Her satır aynı yapıda 23 td olsun */}
                    <tr>
                      {/* İkinci satır verilerini buraya kopyala, değerleri değiştir */}
                      <td className="border border-blue-500 px-2 py-1 w-16 sticky left-[-1px] top-0 z-10 bg-white -ml-px">
                        2
                      </td>
                      {/* ... devamı, 22 td daha */}
                    </tr>
                  </tbody>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
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
                    <input
                      value={formData.swot}
                      onChange={(e) => handleFormChange("swot", e.target.value)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PESTLE
                    </label>
                    <input
                      value={formData.pestle}
                      onChange={(e) =>
                        handleFormChange("pestle", e.target.value)
                      }
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interested Party
                    </label>
                    <input
                      value={formData.interestedParty}
                      onChange={(e) =>
                        handleFormChange("interestedParty", e.target.value)
                      }
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
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
                    <input
                      value={formData.process}
                      onChange={(e) =>
                        handleFormChange("process", e.target.value)
                      }
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Existing Risk Mitigation
                    </label>
                    <input
                      value={formData.existingRisk}
                      onChange={(e) =>
                        handleFormChange("existingRisk", e.target.value)
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
                      <input
                        value={formData.initialRisk.severity}
                        onChange={(e) =>
                          handleFormChange(
                            "initialRisk.severity",
                            e.target.value,
                          )
                        }
                        type="text"
                        placeholder="Severity"
                        className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <input
                        value={formData.initialRisk.likelihood}
                        onChange={(e) =>
                          handleFormChange(
                            "initialRisk.likelihood",
                            e.target.value,
                          )
                        }
                        type="text"
                        placeholder="Likelihood"
                        className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <input
                        value={formData.initialRisk.riskLevel}
                        onChange={(e) =>
                          handleFormChange(
                            "initialRisk.riskLevel",
                            e.target.value,
                          )
                        }
                        type="text"
                        placeholder="Risk Level"
                        className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Action Plan
                    </label>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          value={formData.actionPlan.action}
                          onChange={(e) =>
                            handleFormChange(
                              "actionPlan.action",
                              e.target.value,
                            )
                          }
                          type="text"
                          placeholder="Action"
                          className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <input
                          value={formData.actionPlan.raiseDate}
                          onChange={(e) =>
                            handleFormChange(
                              "actionPlan.raiseDate",
                              e.target.value,
                            )
                          }
                          type="date"
                          placeholder="Raise Date"
                          className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <input
                          value={formData.actionPlan.resources}
                          onChange={(e) =>
                            handleFormChange(
                              "actionPlan.resources",
                              e.target.value,
                            )
                          }
                          type="text"
                          placeholder="Resources"
                          className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          value={formData.actionPlan.function}
                          onChange={(e) =>
                            handleFormChange(
                              "actionPlan.function",
                              e.target.value,
                            )
                          }
                          type="text"
                          placeholder="Function"
                          className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <input
                          value={formData.actionPlan.responsible}
                          onChange={(e) =>
                            handleFormChange(
                              "actionPlan.responsible",
                              e.target.value,
                            )
                          }
                          type="text"
                          placeholder="Responsible"
                          className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <input
                          value={formData.actionPlan.deadline}
                          onChange={(e) =>
                            handleFormChange(
                              "actionPlan.deadline",
                              e.target.value,
                            )
                          }
                          type="date"
                          placeholder="Deadline"
                          className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          value={formData.actionPlan.actionStatus}
                          onChange={(e) =>
                            handleFormChange(
                              "actionPlan.actionStatus",
                              e.target.value,
                            )
                          }
                          type="text"
                          placeholder="Action Status"
                          className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <input
                          value={formData.actionPlan.verification}
                          onChange={(e) =>
                            handleFormChange(
                              "actionPlan.verification",
                              e.target.value,
                            )
                          }
                          type="text"
                          placeholder="Verification"
                          className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <input
                          value={formData.actionPlan.comment}
                          onChange={(e) =>
                            handleFormChange(
                              "actionPlan.comment",
                              e.target.value,
                            )
                          }
                          type="text"
                          placeholder="Comment"
                          className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Residual Risk Level
                    </label>
                    <input
                      value={formData.residualRisk}
                      onChange={(e) =>
                        handleFormChange("residualRisk", e.target.value)
                      }
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
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
                  ? `Are you sure you want to delete ${selectedCount} selected risk item(s)? This action cannot be undone.`
                  : "Are you sure you want to delete this risk item? This action cannot be undone."}
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
