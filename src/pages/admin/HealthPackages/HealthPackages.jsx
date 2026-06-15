import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loadAdminData, saveAdminData } from '../../../data/adminState';

const defaultPackages = [
  {
    id: 'PKG-001',
    name: 'Basic Cardiac Assessment',
    description: 'Essential heart checkup, including ECG, blood sugar, lipid profile, and cardiologist consultation.',
    price: 1500,
    testsCount: 8,
    status: 'Active',
    lastUpdated: '10 Oct 2023'
  },
  {
    id: 'PKG-002',
    name: 'Executive Whole Body Screening',
    description: 'Comprehensive health monitoring including liver, kidney, thyroid profiles, chest x-ray, and abdominal ultrasound.',
    price: 4500,
    testsCount: 24,
    status: 'Active',
    lastUpdated: '15 Oct 2023'
  },
  {
    id: 'PKG-003',
    name: 'Senior Citizen Health Package (Female)',
    description: 'Tailored health monitoring including mammography, bone density tests, and rheumatology consultations.',
    price: 3200,
    testsCount: 18,
    status: 'Active',
    lastUpdated: '18 Oct 2023'
  }
];

const HealthPackages = () => {
  const [packages, setPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  const navigate = useNavigate();

  useEffect(() => {
    setPackages(loadAdminData('bhaktivedanta_admin_packages', defaultPackages));
  }, []);

  const saveAndSetPackages = (newPkgs) => {
    setPackages(newPkgs);
    saveAdminData('bhaktivedanta_admin_packages', newPkgs);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      const updated = packages.filter(p => p.id !== id);
      saveAndSetPackages(updated);
    }
  };

  const handleToggleStatus = (id) => {
    const updated = packages.map(p => {
      if (p.id === id) {
        return { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' };
      }
      return p;
    });
    saveAndSetPackages(updated);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('All Status');
  };

  const filtered = packages.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All Status' || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-slate-400 text-xs mb-1 font-medium">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-600 font-bold">Health Packages</span>
          </nav>
          <h2 className="text-2xl font-bold text-slate-800">Preventive Health Packages</h2>
          <p className="text-sm text-slate-500 font-medium">Manage hospital wellness check-up packages and prices.</p>
        </div>
        <Link 
          to="/admin/add-health-package" 
          className="flex items-center gap-2 bg-[#fea619] hover:bg-amber-500 text-slate-900 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          <span>Add New Package</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Quick Search</label>
          <input 
            type="text"
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none"
            placeholder="Search package name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-[180px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Status</label>
          <select 
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
        <button 
          onClick={handleResetFilters}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-bold transition-all"
        >
          Reset Filters
        </button>
      </div>

      {/* Packages Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-slate-500 font-bold uppercase">
              <th className="px-4 py-3">Package Details</th>
              <th className="px-4 py-3 text-center">Tests Included</th>
              <th className="px-4 py-3">Price (INR)</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-slate-400 font-medium">No matching packages found.</td>
              </tr>
            ) : (
              filtered.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-sm leading-snug">{pkg.name}</span>
                      <span className="text-[10px] text-slate-400 font-semibold line-clamp-2 max-w-lg mt-0.5">{pkg.description}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-blue-600">{pkg.testsCount} Tests</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">₹{pkg.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      pkg.status === 'Active'
                        ? 'bg-green-50 text-green-600 border border-green-100'
                        : 'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                      {pkg.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button 
                        onClick={() => handleToggleStatus(pkg.id)}
                        className={`w-7 h-7 rounded flex items-center justify-center border transition-all ${
                          pkg.status === 'Active'
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-600 border-amber-200'
                            : 'bg-green-50 hover:bg-green-100 text-green-600 border-green-200'
                        }`}
                        title={pkg.status === 'Active' ? 'Deactivate' : 'Activate'}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {pkg.status === 'Active' ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                      <button 
                        onClick={() => navigate(`/admin/add-health-package?edit=${pkg.id}`)}
                        className="w-7 h-7 rounded bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center transition-all"
                        title="Edit Details"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(pkg.id)}
                        className="w-7 h-7 rounded bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 flex items-center justify-center transition-all"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HealthPackages;
