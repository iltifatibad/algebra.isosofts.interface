import React, { useState, useMemo } from "react";
import RiskTableee from "./test/test";

// Sample data - equivalent to Vue's ref data
const initialRisks = [
  { id: "bg-reg", name: "BG Reg" },
  { id: "hs-risks", name: "HS Risks" },
  { id: "leg-reg", name: "Leg Reg" },
  { id: "enc-aspects", name: "Enc Aspects" },
  { id: "equipment-reg", name: "Equipment Reg" },
  { id: "training-reg", name: "Training Reg" },
  { id: "document-reg", name: "Document Reg" },
  { id: "vendor-reg", name: "Vendor Reg" },
  { id: "customer-reg", name: "Customer Reg" },
  { id: "ac-reg", name: "Action Logs" },
];

const initialTableData = [
  {
    id: 1,
    swot: "Strength",
    pestle: "Political",
    interestedParty: "Stakeholders",
    riskOpportunity: "Market Expansion",
    objective: "Increase Revenue",
    kpi: "Revenue Growth %",
    process: "Sales Process",
    existingRisk: "Market Analysis",
    initialRisk: {
      severity: "High",
      likelihood: "Medium",
      riskLevel: "7",
    },
    actionPlan: {
      action: "Market Research",
      raiseDate: "2025-01-15",
      resources: "$50K",
      function: "Marketing",
      responsible: "John Doe",
      deadline: "2025-03-30",
      actionStatus: "In Progress",
      verification: "Pending",
      comment: "On track",
    },
    residualRisk: "Medium",
    archived: false,
  },
  {
    id: 2,
    swot: "Weakness",
    pestle: "Economic",
    interestedParty: "Customers",
    riskOpportunity: "Cost Reduction",
    objective: "Optimize Operations",
    kpi: "Cost Savings %",
    process: "Operations",
    existingRisk: "Process Review",
    initialRisk: {
      severity: "Medium",
      likelihood: "High",
      riskLevel: "6",
    },
    actionPlan: {
      action: "Process Optimization",
      raiseDate: "2025-01-20",
      resources: "$30K",
      function: "Operations",
      responsible: "Jane Smith",
      deadline: "2025-04-15",
      actionStatus: "Planning",
      verification: "Not Started",
      comment: "Resource allocation pending",
    },
    residualRisk: "Low",
    archived: false,
  },
  {
    id: 3,
    swot: "Opportunity",
    pestle: "Social",
    interestedParty: "Employees",
    riskOpportunity: "Technology Adoption",
    objective: "Digital Transformation",
    kpi: "Automation Rate %",
    process: "IT Process",
    existingRisk: "Technology Assessment",
    initialRisk: {
      severity: "Low",
      likelihood: "High",
      riskLevel: "4",
    },
    actionPlan: {
      action: "System Implementation",
      raiseDate: "2025-02-01",
      resources: "$100K",
      function: "IT",
      responsible: "Mike Johnson",
      deadline: "2025-06-30",
      actionStatus: "Not Started",
      verification: "Not Started",
      comment: "Budget approved",
    },
    residualRisk: "Very Low",
    archived: false,
  },
];

const initialFormData = {
  swot: "",
  pestle: "",
  interestedParty: "",
  riskOpportunity: "",
  objective: "",
  kpi: "",
  process: "",
  existingRisk: "",
  initialRisk: {
    severity: "",
    likelihood: "",
    riskLevel: "",
  },
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
};

const IsosoftsUIConcept = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [nextId, setNextId] = useState(4);
  const [risks] = useState(initialRisks);
  const [tableData, setTableData] = useState(initialTableData);
  const [formData, setFormData] = useState(initialFormData);

  const filteredTableData = useMemo(() => {
    return showArchived
      ? tableData
      : tableData.filter((item) => !item.archived);
  }, [showArchived, tableData]);

  const openAddModal = () => {
    setModalMode("add");
    setEditingId(null);
    setFormData(initialFormData);
    setShowModal(true);
  };

  const openEditModal = (row) => {
    setModalMode("edit");
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
    if (modalMode === "add") {
      const newRisk = {
        id: nextId,
        ...formData,
        archived: false,
      };
      setTableData([...tableData, newRisk]);
      setNextId(nextId + 1);
    } else {
      const index = tableData.findIndex((item) => item.id === editingId);
      if (index !== -1) {
        const updatedTableData = [...tableData];
        updatedTableData[index] = {
          ...updatedTableData[index],
          ...formData,
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
      const updatedTableData = tableData.filter((item) => item.id !== deleteId);
      setTableData(updatedTableData);
    }
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const toggleArchive = (id) => {
    const updatedTableData = tableData.map((item) =>
      item.id === id ? { ...item, archived: !item.archived } : item,
    );
    setTableData(updatedTableData);
  };

  const toggleArchiveView = () => {
    setShowArchived(!showArchived);
  };

  const handleFormChange = (path, value) => {
    setFormData((prev) => {
      const newForm = { ...prev };
      const keys = path.split(".");
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
        {/* Main Screen */}
        <div className="pt-20">
          {/* Hero Section */}
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('https://readdy.ai/api/search-image?query=modern%20abstract%20blue%20and%20white%20gradient%20background%20with%20soft%20flowing%20curves%20and%20gentle%20geometric%20shapes%20creating%20a%20peaceful%20corporate%20atmosphere%20with%20subtle%20lighting%20effects&width=1440&height=800&seq=hero-bg-001&orientation=landscape')`,
              }}
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
                    <span className="text-gray-800 drop-shadow-lg">
                      Isosofts
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                    Experience the future of ISO management with our innovative,
                    user-friendly platform designed for modern businesses
                    seeking excellence in quality management systems.
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

          {/* <section>
            <RiskTableee/>
          </section> */}
          {/* Features Section */}
          <section className="py-20 bg-gradient-to-b from-white to-blue-50">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
                  Why Choose Isosofts?
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Streamline your ISO compliance journey with our comprehensive
                  suite of tools designed for efficiency and excellence.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="feature-card bg-white p-8 !rounded-button shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 !rounded-button flex items-center justify-center mb-6">
                    <i className="fas fa-shield-alt text-2xl text-blue-600"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Risk Management
                  </h3>
                  <p className="text-gray-600">
                    Comprehensive risk assessment and management tools to ensure
                    your organization stays compliant and secure.
                  </p>
                </div>
                <div className="feature-card bg-white p-8 !rounded-button shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 !rounded-button flex items-center justify-center mb-6">
                    <i className="fas fa-chart-line text-2xl text-blue-600"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Analytics Dashboard
                  </h3>
                  <p className="text-gray-600">
                    Real-time insights and analytics to track your compliance
                    progress and identify improvement opportunities.
                  </p>
                </div>
                <div className="feature-card bg-white p-8 !rounded-button shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 !rounded-button flex items-center justify-center mb-6">
                    <i className="fas fa-users text-2xl text-blue-600"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Team Collaboration
                  </h3>
                  <p className="text-gray-600">
                    Seamless collaboration tools that enable your team to work
                    together efficiently on compliance initiatives.
                  </p>
                </div>
              </div>
            </div>
          </section>


          <section className="py-20 bg-gradient-to-b from-white to-blue-50">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
                  Our Services
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="feature-card bg-white p-8 !rounded-button shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 !rounded-button flex items-center justify-center mb-6">
                    <i className="fas fa-shield-alt text-2xl text-blue-600"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Algebra
                  </h3>

                  <a href="/profile">
                  <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="rounded-button whitespace-nowrap cursor-pointer bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                     <i className=""></i> Go To Algebra
                   </button>
                  </a>
                </div>
                <div className="feature-card bg-white p-8 !rounded-button shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 !rounded-button flex items-center justify-center mb-6">
                    <i className="fas fa-chart-line text-2xl text-blue-600"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Phisics
                  </h3>
                  <a href="/">
                  <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="rounded-button whitespace-nowrap cursor-pointer bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                     <i className=""></i> Go To Phisics
                   </button>
                  </a>
                </div>
                <div className="feature-card bg-white p-8 !rounded-button shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 !rounded-button flex items-center justify-center mb-6">
                    <i className="fas fa-users text-2xl text-blue-600"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Geometry
                  </h3>
                 <a href="/">
                  <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="rounded-button whitespace-nowrap cursor-pointer bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                     <i className=""></i> Go To Geometry
                   </button>
                  </a>
                </div>
                <div className="feature-card bg-white p-8 !rounded-button shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 !rounded-button flex items-center justify-center mb-6">
                    <i className="fas fa-users text-2xl text-blue-600"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Pholosophy
                  </h3>
                  <a href="/">
                  <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="rounded-button whitespace-nowrap cursor-pointer bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                     <i className=""></i> Go To Pholosophy
                   </button>
                  </a>
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
                  Empowering organizations with innovative ISO management
                  solutions for a compliant and efficient future.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-blue-200 hover:text-white transition-colors duration-300 cursor-pointer"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-blue-200 hover:text-white transition-colors duration-300 cursor-pointer"
                    >
                      Services
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-blue-200 hover:text-white transition-colors duration-300 cursor-pointer"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-blue-200 hover:text-white transition-colors duration-300 cursor-pointer"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Services</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-blue-200 hover:text-white transition-colors duration-300 cursor-pointer"
                    >
                      Risk Management
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-blue-200 hover:text-white transition-colors duration-300 cursor-pointer"
                    >
                      Compliance Tracking
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-blue-200 hover:text-white transition-colors duration-300 cursor-pointer"
                    >
                      Analytics
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-blue-200 hover:text-white transition-colors duration-300 cursor-pointer"
                    >
                      Consulting
                    </a>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Contact Info</h4>
                <div className="space-y-2 text-blue-200">
                  <p>
                    <i className="fas fa-envelope mr-2"></i>info@isosofts.com
                  </p>
                  <p>
                    <i className="fas fa-phone mr-2"></i>+1 (555) 123-4567
                  </p>
                  <p>
                    <i className="fas fa-map-marker-alt mr-2"></i>123 Business
                    Ave, City, State
                  </p>
                </div>
              </div>
            </div>
            <div className="border-t border-blue-700 mt-12 pt-8 text-center text-blue-200">
              <p>
                &copy; 2025 Isosofts. All rights reserved. | Privacy Policy |
                Terms of Service
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  }
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
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = globalStyles;
  document.head.appendChild(styleSheet);
}

export default IsosoftsUIConcept;
