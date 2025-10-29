import React, { useState, useEffect } from 'react';

const RisksAssessment = () => {
  // Sample data - gerçek projede API'den veya props'tan gelebilir
  const [risks, setRisks] = useState([
    { id: 'bg-reg', name: 'BG Reg' },
    // Diğer risk kategorileri eklenebilir
  ]);

  const [selectedRisk, setSelectedRisk] = useState('bg-reg');
  const [tableData, setTableData] = useState([
    // Sample table data
    {
      id: 1,
      swot: 'Strengths',
      pestle: 'Political',
      interestedParty: 'Stakeholder A',
      riskOpportunity: 'Market Risk',
      objective: 'Increase Revenue',
      kpi: '10% Growth',
      process: 'Sales Process',
      existingRisk: 'Current Mitigation',
      initialRisk: { severity: 'High', likelihood: 'Medium', riskLevel: 'High' },
      actionPlan: {
        action: 'Implement Plan',
        raiseDate: '2025-01-01',
        resources: 'Team A',
        function: 'Marketing',
        responsible: 'John Doe',
        deadline: '2025-06-01',
        actionStatus: 'In Progress',
        verification: 'Verified',
        comment: 'On track'
      },
      residualRisk: 'Low',
      archived: false
    },
    // Daha fazla row eklenebilir
  ]);

  const [showArchived, setShowArchived] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState({
    swot: '',
    pestle: '',
    interestedParty: '',
    riskOpportunity: '',
    objective: '',
    kpi: '',
    process: '',
    existingRisk: '',
    initialRisk: { severity: '', likelihood: '', riskLevel: '' },
    actionPlan: {
      action: '',
      raiseDate: '',
      resources: '',
      function: '',
      responsible: '',
      deadline: '',
      actionStatus: '',
      verification: '',
      comment: ''
    },
    residualRisk: ''
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set()); // Checkbox state'i ekle

  // Filtered data based on archived
  const filteredTableData = tableData.filter(row => showArchived || !row.archived);

  // Checkbox handler
  const handleCheckboxChange = (id) => {
    setSelectedRows(prev => {
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
  const getSelectedRow = () => filteredTableData.find(row => selectedRows.has(row.id)) || null;

  // Handlers
  const toggleArchiveView = () => setShowArchived(!showArchived);

  const openAddModal = () => {
    setModalMode('add');
    setEditingRow(null);
    setFormData({
      swot: '',
      pestle: '',
      interestedParty: '',
      riskOpportunity: '',
      objective: '',
      kpi: '',
      process: '',
      existingRisk: '',
      initialRisk: { severity: '', likelihood: '', riskLevel: '' },
      actionPlan: {
        action: '',
        raiseDate: '',
        resources: '',
        function: '',
        responsible: '',
        deadline: '',
        actionStatus: '',
        verification: '',
        comment: ''
      },
      residualRisk: ''
    });
    setShowModal(true);
  };

  const openEditModal = (row) => {
    setModalMode('edit');
    setEditingRow(row);
    setFormData({
      ...row,
      initialRisk: { ...row.initialRisk },
      actionPlan: { ...row.actionPlan }
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

    const pathArr = path.split('.');
    setFormData(prev => updateNested(prev, pathArr, value));
  };

  const closeModal = () => setShowModal(false);

  const saveRisk = () => {
    if (modalMode === 'add') {
      const newId = Math.max(...tableData.map(r => r.id), 0) + 1;
      setTableData(prev => [...prev, { ...formData, id: newId, archived: false }]);
    } else {
      setTableData(prev => prev.map(row => row.id === editingRow.id ? { ...formData, id: row.id } : row));
    }
    closeModal();
  };

  const confirmDelete = (id) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const deleteRisk = () => {
    setTableData(prev => prev.filter(row => row.id !== deletingId));
    setShowDeleteModal(false);
  };

  const toggleArchive = (id) => {
    setTableData(prev => prev.map(row => row.id === id ? { ...row, archived: !row.archived } : row));
  };

  // Bulk actions
  const bulkArchive = () => {
    setTableData(prev => prev.map(row => selectedRows.has(row.id) ? { ...row, archived: !row.archived } : row));
    setSelectedRows(new Set());
  };

  const bulkDelete = () => {
    setTableData(prev => prev.filter(row => !selectedRows.has(row.id)));
    setShowDeleteModal(false);
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
              {risks.map(risk => (
                <li key={risk.id}>
                  <button
                    onClick={() => setSelectedRisk(risk.id)}
                    className={[
                      'w-full text-left px-4 py-3 !rounded-button transition-all duration-300 cursor-pointer whitespace-nowrap',
                      selectedRisk === risk.id
                        ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    ].join(' ')}
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
          {selectedRisk === 'bg-reg' ? (
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
                      '!rounded-button whitespace-nowrap cursor-pointer px-4 py-2 transition-all duration-300 shadow-md hover:shadow-lg text-sm',
                      showArchived
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                        : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700'
                    ].join(' ')}
                  >
                    <i className="fas fa-archive mr-2"></i>{showArchived ? 'Hide Archived' : 'Show Archived'}
                  </button>
                  {/* Actions butonları header'a taşındı */}
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={editSingle}
                      disabled={selectedCount !== 1}
                      className={[
                        '!rounded-button whitespace-nowrap cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-1 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-xs shadow-sm',
                        selectedCount !== 1 ? 'opacity-50 cursor-not-allowed' : ''
                      ].join(' ')}
                      title="Edit (Single Selection Only)"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={bulkArchive}
                      disabled={selectedCount === 0}
                      className={[
                        '!rounded-button whitespace-nowrap cursor-pointer px-2 py-1 transition-all duration-300 text-xs shadow-sm',
                        selectedCount === 0 ? 'opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                      ].join(' ')}
                      title="Archive/Restore Selected"
                    >
                      <i className={showArchived ? 'fas fa-undo' : 'fas fa-archive'}></i>
                    </button>
                    <button
                      onClick={() => confirmDelete(Array.from(selectedRows)[0] || 0)} // Bulk için showDeleteModal'ı uyarla
                      disabled={selectedCount === 0}
                      className={[
                        '!rounded-button whitespace-nowrap cursor-pointer bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 hover:from-red-600 hover:to-red-700 transition-all duration-300 text-xs shadow-sm',
                        selectedCount === 0 ? 'opacity-50 cursor-not-allowed' : ''
                      ].join(' ')}
                      title="Delete Selected"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto relative min-w-full">
                <table className="w-full text-sm table-fixed">
                  <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-blue-800 border-r border-blue-200 sticky left-0 bg-gradient-to-r from-blue-50 to-blue-100 z-20 w-[40px]"></th> {/* Checkbox th */}
                      <th className="px-4 py-3 text-left font-semibold text-blue-800 border-r border-blue-200 sticky left-4 bg-gradient-to-r from-blue-50 to-blue-100 z-20 w-[40px]">ID</th> {/* ID sticky güncelle */}
                      <th className="px-4 py-3 text-left font-semibold text-blue-800 border-r border-blue-200 w-[120px]">SWOT</th>
                      <th className="px-4 py-3 text-left font-semibold text-blue-800 border-r border-blue-200 w-[100px]">PESTLE</th>
                      <th className="px-4 py-3 text-left font-semibold text-blue-800 border-r border-blue-200 w-[112px]">Interested Party</th>
                      <th className="px-4 py-3 text-left font-semibold text-blue-800 border-r border-blue-200 w-[160px]">Risk / Opportunity</th>
                      <th className="px-4 py-3 text-left font-semibold text-blue-800 border-r border-blue-200 w-[120px]">Objective</th>
                      <th className="px-4 py-3 text-left font-semibold text-blue-800 border-r border-blue-200 w-[100px]">KPI</th>
                      <th className="px-4 py-3 text-left font-semibold text-blue-800 border-r border-blue-200 w-[100px]">Process</th>
                      <th className="px-4 py-3 text-left font-semibold text-blue-800 border-r border-blue-200 w-[200px]">Existing Risk Mitigation</th>
                      <th className="px-4 py-3 text-left font-semibold text-blue-800 border-r border-blue-200 w-64">
                        <div className="text-center">Initial Risk</div>
                        <div className="grid grid-cols-3 gap-1 mt-2 text-xs">
                          <div className="border-r border-blue-300 pr-1">Severity</div>
                          <div className="border-r border-blue-300 px-1">Likelihood</div>
                          <div className="pl-1">Risk Level</div>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-blue-800 border-r border-blue-200 w-80">
                        <div className="text-center">Action Plan</div>
                        <div className="grid grid-cols-3 gap-1 mt-2 text-xs">
                          <div className="border-r border-blue-300 pr-1">Action</div>
                          <div className="border-r border-blue-300 px-1">Raise Date</div>
                          <div className="pl-1">Resources</div>
                        </div>
                        <div className="grid grid-cols-3 gap-1 mt-1 text-xs">
                          <div className="border-r border-blue-300 pr-1">Function</div>
                          <div className="border-r border-blue-300 px-1">Responsible</div>
                          <div className="pl-1">Deadline</div>
                        </div>
                        <div className="grid grid-cols-3 gap-1 mt-1 text-xs">
                          <div className="border-r border-blue-300 pr-1">Action Status</div>
                          <div className="border-r border-blue-300 px-1">Verification</div>
                          <div className="pl-1">Comment</div>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-blue-800">Residual Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTableData.map((row, index) => (
                      <tr key={row.id} className={[index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30', row.archived ? 'opacity-60' : ''].join(' ')}>
                        <td className="px-4 py-3 border-r border-blue-100 sticky left-0 z-10">
                          <input
                            type="checkbox"
                            checked={selectedRows.has(row.id)}
                            onChange={() => handleCheckboxChange(row.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className={['px-4 py-3 border-r border-blue-100 sticky left-4 z-10 font-semibold text-blue-800', index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'].join(' ')}>
                          {row.id}
                        </td>
                        <td className="px-4 py-3 border-r border-blue-100">{row.swot}</td>
                        <td className="px-4 py-3 border-r border-blue-100">{row.pestle}</td>
                        <td className="px-4 py-3 border-r border-blue-100">{row.interestedParty}</td>
                        <td className="px-4 py-3 border-r border-blue-100">{row.riskOpportunity}</td>
                        <td className="px-4 py-3 border-r border-blue-100">{row.objective}</td>
                        <td className="px-4 py-3 border-r border-blue-100">{row.kpi}</td>
                        <td className="px-4 py-3 border-r border-blue-100">{row.process}</td>
                        <td className="px-4 py-3 border-r border-blue-100">{row.existingRisk}</td>
                        <td className="px-4 py-3 border-r border-blue-100">
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center">{row.initialRisk.severity}</div>
                            <div className="text-center">{row.initialRisk.likelihood}</div>
                            <div className="text-center">{row.initialRisk.riskLevel}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 border-r border-blue-100">
                          <div className="grid grid-cols-3 gap-2 text-xs mb-1">
                            <div>{row.actionPlan.action}</div>
                            <div>{row.actionPlan.raiseDate}</div>
                            <div>{row.actionPlan.resources}</div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs mb-1">
                            <div>{row.actionPlan.function}</div>
                            <div>{row.actionPlan.responsible}</div>
                            <div>{row.actionPlan.deadline}</div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>{row.actionPlan.actionStatus}</div>
                            <div>{row.actionPlan.verification}</div>
                            <div>{row.actionPlan.comment}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">{row.residualRisk}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white !rounded-button shadow-lg p-8 text-center">
              <i className="fas fa-chart-bar text-6xl text-blue-300 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Risk Category</h3>
              <p className="text-gray-500">Choose a risk category from the sidebar to view detailed assessment data.</p>
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
                {modalMode === 'add' ? 'Add New Risk' : 'Edit Risk'}
              </h3>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SWOT</label>
                    <input
                      value={formData.swot}
                      onChange={(e) => handleFormChange('swot', e.target.value)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PESTLE</label>
                    <input
                      value={formData.pestle}
                      onChange={(e) => handleFormChange('pestle', e.target.value)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Interested Party</label>
                    <input
                      value={formData.interestedParty}
                      onChange={(e) => handleFormChange('interestedParty', e.target.value)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Risk / Opportunity</label>
                    <input
                      value={formData.riskOpportunity}
                      onChange={(e) => handleFormChange('riskOpportunity', e.target.value)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Objective</label>
                    <input
                      value={formData.objective}
                      onChange={(e) => handleFormChange('objective', e.target.value)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">KPI</label>
                    <input
                      value={formData.kpi}
                      onChange={(e) => handleFormChange('kpi', e.target.value)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Process</label>
                    <input
                      value={formData.process}
                      onChange={(e) => handleFormChange('process', e.target.value)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Existing Risk Mitigation</label>
                    <input
                      value={formData.existingRisk}
                      onChange={(e) => handleFormChange('existingRisk', e.target.value)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Initial Risk</label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        value={formData.initialRisk.severity}
                        onChange={(e) => handleFormChange('initialRisk.severity', e.target.value)}
                        type="text"
                        placeholder="Severity"
                        className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <input
                        value={formData.initialRisk.likelihood}
                        onChange={(e) => handleFormChange('initialRisk.likelihood', e.target.value)}
                        type="text"
                        placeholder="Likelihood"
                        className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <input
                        value={formData.initialRisk.riskLevel}
                        onChange={(e) => handleFormChange('initialRisk.riskLevel', e.target.value)}
                        type="text"
                        placeholder="Risk Level"
                        className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Action Plan</label>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          value={formData.actionPlan.action}
                          onChange={(e) => handleFormChange('actionPlan.action', e.target.value)}
                          type="text"
                          placeholder="Action"
                          className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <input
                          value={formData.actionPlan.raiseDate}
                          onChange={(e) => handleFormChange('actionPlan.raiseDate', e.target.value)}
                          type="date"
                          placeholder="Raise Date"
                          className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <input
                          value={formData.actionPlan.resources}
                          onChange={(e) => handleFormChange('actionPlan.resources', e.target.value)}
                          type="text"
                          placeholder="Resources"
                          className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          value={formData.actionPlan.function}
                          onChange={(e) => handleFormChange('actionPlan.function', e.target.value)}
                          type="text"
                          placeholder="Function"
                          className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <input
                          value={formData.actionPlan.responsible}
                          onChange={(e) => handleFormChange('actionPlan.responsible', e.target.value)}
                          type="text"
                          placeholder="Responsible"
                          className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <input
                          value={formData.actionPlan.deadline}
                          onChange={(e) => handleFormChange('actionPlan.deadline', e.target.value)}
                          type="date"
                          placeholder="Deadline"
                          className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          value={formData.actionPlan.actionStatus}
                          onChange={(e) => handleFormChange('actionPlan.actionStatus', e.target.value)}
                          type="text"
                          placeholder="Action Status"
                          className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <input
                          value={formData.actionPlan.verification}
                          onChange={(e) => handleFormChange('actionPlan.verification', e.target.value)}
                          type="text"
                          placeholder="Verification"
                          className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <input
                          value={formData.actionPlan.comment}
                          onChange={(e) => handleFormChange('actionPlan.comment', e.target.value)}
                          type="text"
                          placeholder="Comment"
                          className="w-full px-3 py-2 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Residual Risk Level</label>
                    <input
                      value={formData.residualRisk}
                      onChange={(e) => handleFormChange('residualRisk', e.target.value)}
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
                {modalMode === 'add' ? 'Add Risk' : 'Update Risk'}
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
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this risk item? This action cannot be undone.</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="!rounded-button whitespace-nowrap cursor-pointer border-2 border-gray-300 text-gray-600 px-4 py-2 hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteRisk}
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
