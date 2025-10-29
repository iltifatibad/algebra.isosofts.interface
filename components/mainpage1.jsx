import React, { useState, useMemo } from 'react';

// Sample data - equivalent to Vue's ref data
const initialRisks = [
  { id: 'bg-reg', name: 'BG Reg' },
  { id: 'hs-risks', name: 'HS Risks' },
  { id: 'leg-reg', name: 'Leg Reg' },
  { id: 'enc-aspects', name: 'Enc Aspects' },
  { id: 'equipment-reg', name: 'Equipment Reg' },
  { id: 'training-reg', name: 'Training Reg' },
  { id: 'document-reg', name: 'Document Reg' },
  { id: 'vendor-reg', name: 'Vendor Reg' },
  { id: 'customer-reg', name: 'Customer Reg' }
];

const initialTableData = [
  {
    id: 1,
    swot: 'Strength',
    pestle: 'Political',
    interestedParty: 'Stakeholders',
    riskOpportunity: 'Market Expansion',
    objective: 'Increase Revenue',
    kpi: 'Revenue Growth %',
    process: 'Sales Process',
    existingRisk: 'Market Analysis',
    initialRisk: {
      severity: 'High',
      likelihood: 'Medium',
      riskLevel: '7'
    },
    actionPlan: {
      action: 'Market Research',
      raiseDate: '2025-01-15',
      resources: '$50K',
      function: 'Marketing',
      responsible: 'John Doe',
      deadline: '2025-03-30',
      actionStatus: 'In Progress',
      verification: 'Pending',
      comment: 'On track'
    },
    residualRisk: 'Medium',
    archived: false
  },
  {
    id: 2,
    swot: 'Weakness',
    pestle: 'Economic',
    interestedParty: 'Customers',
    riskOpportunity: 'Cost Reduction',
    objective: 'Optimize Operations',
    kpi: 'Cost Savings %',
    process: 'Operations',
    existingRisk: 'Process Review',
    initialRisk: {
      severity: 'Medium',
      likelihood: 'High',
      riskLevel: '6'
    },
    actionPlan: {
      action: 'Process Optimization',
      raiseDate: '2025-01-20',
      resources: '$30K',
      function: 'Operations',
      responsible: 'Jane Smith',
      deadline: '2025-04-15',
      actionStatus: 'Planning',
      verification: 'Not Started',
      comment: 'Resource allocation pending'
    },
    residualRisk: 'Low',
    archived: false
  },
  {
    id: 3,
    swot: 'Opportunity',
    pestle: 'Social',
    interestedParty: 'Employees',
    riskOpportunity: 'Technology Adoption',
    objective: 'Digital Transformation',
    kpi: 'Automation Rate %',
    process: 'IT Process',
    existingRisk: 'Technology Assessment',
    initialRisk: {
      severity: 'Low',
      likelihood: 'High',
      riskLevel: '4'
    },
    actionPlan: {
      action: 'System Implementation',
      raiseDate: '2025-02-01',
      resources: '$100K',
      function: 'IT',
      responsible: 'Mike Johnson',
      deadline: '2025-06-30',
      actionStatus: 'Not Started',
      verification: 'Not Started',
      comment: 'Budget approved'
    },
    residualRisk: 'Very Low',
    archived: false
  }
];

const initialFormData = {
  swot: '',
  pestle: '',
  interestedParty: '',
  riskOpportunity: '',
  objective: '',
  kpi: '',
  process: '',
  existingRisk: '',
  initialRisk: {
    severity: '',
    likelihood: '',
    riskLevel: ''
  },
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
};

const IsosoftsUIConcept = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [nextId, setNextId] = useState(4);
  const [risks] = useState(initialRisks);
  const [tableData, setTableData] = useState(initialTableData);
  const [formData, setFormData] = useState(initialFormData);

  const filteredTableData = useMemo(() => {
    return showArchived ? tableData : tableData.filter(item => !item.archived);
  }, [showArchived, tableData]);

  const openAddModal = () => {
    setModalMode('add');
    setEditingId(null);
    setFormData(initialFormData);
    setShowModal(true);
  };

  const openEditModal = (row) => {
    setModalMode('edit');
    setEditingId(row.id);
    setFormData(JSON.parse(JSON.stringify(row)));
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData(initialFormData);
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const saveRisk = () => {
    if (modalMode === 'add') {
      const newRisk = {
        id: nextId,
        ...formData,
        archived: false
      };
      setTableData([...tableData, newRisk]);
      setNextId(nextId + 1);
    } else {
      const index = tableData.findIndex(item => item.id === editingId);
      if (index !== -1) {
        const updatedTableData = [...tableData];
        updatedTableData[index] = {
          ...updatedTableData[index],
          ...formData
        };
        setTableData(updatedTableData);
      }
    }
    closeModal();
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const deleteRisk = () => {
    if (deleteId !== null) {
      const updatedTableData = tableData.filter(item => item.id !== deleteId);
      setTableData(updatedTableData);
    }
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const toggleArchive = (id) => {
    const updatedTableData = tableData.map(item =>
      item.id === id ? { ...item, archived: !item.archived } : item
    );
    setTableData(updatedTableData);
  };

  const toggleArchiveView = () => {
    setShowArchived(!showArchived);
  };

  const handleFormChange = (path, value) => {
    setFormData(prev => {
      const newForm = { ...prev };
      const keys = path.split('.');
      let current = newForm;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newForm;
    });
  };

  if (!showProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        {/* Navigation Bar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-blue-100 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent animate-pulse">
                  Isosofts
                </div>
                <div className="hidden md:flex space-x-6">
                  <a href="#" className="nav-link text-gray-700 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 cursor-pointer">Home</a>
                  <a href="https://readdy.ai/home/d3978a81-c561-4f54-9be8-e504f8386c69/27623cd4-447e-4005-9dce-bbdbf0e1cb83" data-readdy="true" className="nav-link text-gray-700 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 cursor-pointer">Services</a>
                  <a href="#" className="nav-link text-gray-700 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 cursor-pointer">About</a>
                  <a href="#" className="nav-link text-gray-700 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 cursor-pointer">Contact</a>
                </div>
              </div>
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="!rounded-button whitespace-nowrap cursor-pointer bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <i className="fas fa-user mr-2"></i>Profile
              </button>
            </div>
          </div>
        </nav>
        {/* Main Screen */}
        <div className="pt-20">
          {/* Hero Section */}
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('https://readdy.ai/api/search-image?query=modern%20abstract%20blue%20and%20white%20gradient%20background%20with%20soft%20flowing%20curves%20and%20gentle%20geometric%20shapes%20creating%20a%20peaceful%20corporate%20atmosphere%20with%20subtle%20lighting%20effects&width=1440&height=800&seq=hero-bg-001&orientation=landscape')` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent"></div>
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8 animate-fade-in-up">
                  <h1 className="text-6xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
                      Welcome to
                    </span>
                    <br />
                    <span className="text-gray-800 drop-shadow-lg">Isosofts</span>
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                    Experience the future of ISO management with our innovative, user-friendly platform designed for modern businesses seeking excellence in quality management systems.
                  </p>
                  <div className="flex space-x-4">
                    <button className="!rounded-button whitespace-nowrap cursor-pointer bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-4 text-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                      Get Started
                    </button>
                    <button className="!rounded-button whitespace-nowrap cursor-pointer border-2 border-blue-500 text-blue-600 px-8 py-4 text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Features Section */}
          <section className="py-20 bg-gradient-to-b from-white to-blue-50">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
                  Why Choose Isosofts?
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Streamline your ISO compliance journey with our comprehensive suite of tools designed for efficiency and excellence.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="feature-card bg-white p-8 !rounded-button shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 !rounded-button flex items-center justify-center mb-6">
                    <i className="fas fa-shield-alt text-2xl text-blue-600"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Risk Management</h3>
                  <p className="text-gray-600">Comprehensive risk assessment and management tools to ensure your organization stays compliant and secure.</p>
                </div>
                <div className="feature-card bg-white p-8 !rounded-button shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 !rounded-button flex items-center justify-center mb-6">
                    <i className="fas fa-chart-line text-2xl text-blue-600"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Analytics Dashboard</h3>
                  <p className="text-gray-600">Real-time insights and analytics to track your compliance progress and identify improvement opportunities.</p>
                </div>
                <div className="feature-card bg-white p-8 !rounded-button shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 !rounded-button flex items-center justify-center mb-6">
                    <i className="fas fa-users text-2xl text-blue-600"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Team Collaboration</h3>
                  <p className="text-gray-600">Seamless collaboration tools that enable your team to work together efficiently on compliance initiatives.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
        {/* Footer */}
        <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Isosofts
                </h3>
                <p className="text-blue-200 leading-relaxed">
                  Empowering organizations with innovative ISO management solutions for a compliant and efficient future.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Quick Links</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-blue-200 hover:text-white transition-colors duration-300 cursor-pointer">Home</a></li>
                  <li><a href="#" className="text-blue-200 hover:text-white transition-colors duration-300 cursor-pointer">Services</a></li>
                  <li><a href="#" className="text-blue-200 hover:text-white transition-colors duration-300 cursor-pointer">About</a></li>
                  <li><a href="#" className="text-blue-200 hover:text-white transition-colors duration-300 cursor-pointer">Contact</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Services</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-blue-200 hover:text-white transition-colors duration-300 cursor-pointer">Risk Management</a></li>
                  <li><a href="#" className="text-blue-200 hover:text-white transition-colors duration-300 cursor-pointer">Compliance Tracking</a></li>
                  <li><a href="#" className="text-blue-200 hover:text-white transition-colors duration-300 cursor-pointer">Analytics</a></li>
                  <li><a href="#" className="text-blue-200 hover:text-white transition-colors duration-300 cursor-pointer">Consulting</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Contact Info</h4>
                <div className="space-y-2 text-blue-200">
                  <p><i className="fas fa-envelope mr-2"></i>info@isosofts.com</p>
                  <p><i className="fas fa-phone mr-2"></i>+1 (555) 123-4567</p>
                  <p><i className="fas fa-map-marker-alt mr-2"></i>123 Business Ave, City, State</p>
                </div>
              </div>
            </div>
            <div className="border-t border-blue-700 mt-12 pt-8 text-center text-blue-200">
              <p>&copy; 2025 Isosofts. All rights reserved. | Privacy Policy | Terms of Service</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

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
                <div className="flex space-x-3">
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
                </div>
              </div>
              <div className="overflow-x-auto relative min-w-full">
                <table className="w-full text-sm table-fixed">
                  <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-blue-800 border-r border-blue-200 sticky left-0 bg-gradient-to-r from-blue-50 to-blue-100 z-20">ID</th>
                      <th className="px-4 py-3 text-left font-semibold text-blue-800 border-r border-blue-200 w-35">Actions</th>
                      <th className="px-4 py-3 text-left font-semibold text-blue-800 border-r border-blue-200 w-30">SWOT</th>
                      <th className="px-4 py-3 text-left font-semibold text-blue-800 border-r border-blue-200">PESTLE</th>
                      <th className="px-4 py-3 text-left font-semibold text-blue-800 border-r border-blue-200 w-28">Interested Party</th>
                      <th className="px-4 py-3 text-left font-semibold text-blue-800 border-r border-blue-200">Risk / Opportunity</th>
                      <th className="px-4 py-3 text-left font-semibold text-blue-800 border-r border-blue-200">Objective</th>
                      <th className="px-4 py-3 text-left font-semibold text-blue-800 border-r border-blue-200">KPI</th>
                      <th className="px-4 py-3 text-left font-semibold text-blue-800 border-r border-blue-200">Process</th>
                      <th className="px-4 py-3 text-left font-semibold text-blue-800 border-r border-blue-200">Existing Risk Mitigation</th>
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
                        <td className={['px-4 py-3 border-r border-blue-100 sticky left-0 z-10 font-semibold text-blue-800', index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'].join(' ')}>
                          {row.id}
                        </td>
                        <td className="px-4 py-3 border-r border-blue-100">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openEditModal(row)}
                              className="!rounded-button whitespace-nowrap cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-1 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-xs"
                              title="Edit"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => toggleArchive(row.id)}
                              className={[
                                '!rounded-button whitespace-nowrap cursor-pointer px-2 py-1 transition-all duration-300 text-xs',
                                row.archived
                                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                                  : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                              ].join(' ')}
                              title={row.archived ? 'Restore' : 'Archive'}
                            >
                              <i className={row.archived ? 'fas fa-undo' : 'fas fa-archive'}></i>
                            </button>
                            <button
                              onClick={() => confirmDelete(row.id)}
                              className="!rounded-button whitespace-nowrap cursor-pointer bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 hover:from-red-600 hover:to-red-700 transition-all duration-300 text-xs"
                              title="Delete"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
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

// Global styles (equivalent to <style> section)
const globalStyles = `
.nav-link {
  position: relative;
  font-weight: 500;
}
.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -4px;
  left: 50%;
  background: linear-gradient(to right, #3B82F6, #1E40AF);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}
.nav-link:hover::after {
  width: 100%;
}
.feature-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
}
.feature-card:hover {
  background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
  border-color: #cbd5e1;
}
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fade-in-up 1s ease-out;
}
.!rounded-button {
  border-radius: 12px !important;
}
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}
.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background: linear-gradient(to right, #3B82F6, #1E40AF);
  border-radius: 4px;
}
.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to right, #2563EB, #1D4ED8);
}
`;

// Inject global styles if needed (in a real app, use styled-components or CSS file)
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = globalStyles;
  document.head.appendChild(styleSheet);
}

export default IsosoftsUIConcept;
