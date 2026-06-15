import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loadAdminData, saveAdminData } from '../../../data/adminState';

const defaultServices = [
  {
    id: 'SRV-001',
    name: 'Holistic Wellness',
    description: 'Integrative healthcare combining modern medicine with traditional practices.',
    slug: '/holistic-wellness',
    sections: 5,
    status: 'Active',
    icon: 'self_improvement',
    lastUpdated: 'Today, 10:45 AM'
  },
  {
    id: 'SRV-002',
    name: 'ISKCON Devotees Healthcare Services',
    description: 'Specialized healthcare services tailored for the ISKCON devotee community.',
    slug: '/iskcon-healthcare',
    sections: 3,
    status: 'Active',
    icon: 'diversity_1',
    lastUpdated: 'Yesterday, 02:30 PM'
  },
  {
    id: 'SRV-003',
    name: 'Palliative Care',
    description: 'Compassionate end-of-life care and symptom management.',
    slug: '/palliative-care',
    sections: 4,
    status: 'Draft',
    icon: 'volunteer_activism',
    lastUpdated: 'Oct 28, 2023'
  },
  {
    id: 'SRV-004',
    name: 'Community Services',
    description: 'Outreach programs and medical camps for rural and underserved areas.',
    slug: '/community-services',
    sections: 6,
    status: 'Active',
    icon: 'groups',
    lastUpdated: 'Oct 15, 2023'
  },
  {
    id: 'SRV-005',
    name: 'Garbha Samskar',
    description: 'Ayurvedic prenatal education and holistic pregnancy care.',
    slug: '/garbha-samskar',
    sections: 2,
    status: 'Active',
    icon: 'pregnant_woman',
    lastUpdated: 'Oct 05, 2023'
  },
  {
    id: 'SRV-006',
    name: 'Speech & Audiology',
    description: 'Comprehensive hearing assessments and speech therapy.',
    slug: '/speech-audiology',
    sections: 3,
    status: 'Active',
    icon: 'hearing',
    lastUpdated: 'Sep 28, 2023'
  }
];

const Services = () => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  const navigate = useNavigate();

  useEffect(() => {
    setServices(loadAdminData('bhaktivedanta_admin_services', defaultServices));
  }, []);

  const saveAndSetServices = (newServices) => {
    setServices(newServices);
    saveAdminData('bhaktivedanta_admin_services', newServices);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      const updated = services.filter(srv => srv.id !== id);
      saveAndSetServices(updated);
    }
  };

  const handleToggleStatus = (id) => {
    const updated = services.map(srv => {
      if (srv.id === id) {
        return { ...srv, status: srv.status === 'Active' ? 'Draft' : 'Active' };
      }
      return srv;
    });
    saveAndSetServices(updated);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('All Status');
  };

  const filtered = services.filter(srv => {
    const matchesSearch = srv.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          srv.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All Status' || srv.status === selectedStatus;
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
            <span className="text-slate-600 font-bold">Services</span>
          </nav>
          <h2 className="text-2xl font-bold text-slate-800">Healthcare Services</h2>
          <p className="text-sm text-slate-500 font-medium">Manage clinical and support service descriptions shown to patients.</p>
        </div>
        <Link 
          to="/admin/add-service" 
          className="flex items-center gap-2 bg-[#fea619] hover:bg-amber-500 text-slate-900 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          <span>Add New Service</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Quick Search</label>
          <input 
            type="text"
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none"
            placeholder="Search service name or keyword..."
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
            <option>Draft</option>
          </select>
        </div>
        <button 
          onClick={handleResetFilters}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-bold transition-all"
        >
          Reset Filters
        </button>
      </div>

      {/* Services Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-slate-500 font-bold uppercase">
              <th className="px-4 py-3 w-16">Icon</th>
              <th className="px-4 py-3">Service Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3 text-center">Total Sections</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-slate-400 font-medium">No matching services found.</td>
              </tr>
            ) : (
              filtered.map((srv) => (
                <tr key={srv.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-10 h-8 rounded bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-lg">{srv.icon || 'medical_services'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-sm leading-snug">{srv.name}</span>
                      <span className="text-[10px] text-slate-400 font-semibold line-clamp-1 max-w-sm mt-0.5">{srv.description}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-500">{srv.slug}</td>
                  <td className="px-4 py-3 text-center font-bold text-blue-600">{srv.sections}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      srv.status === 'Active'
                        ? 'bg-green-50 text-green-600 border border-green-100'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}>
                      {srv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button 
                        onClick={() => handleToggleStatus(srv.id)}
                        className={`w-7 h-7 rounded flex items-center justify-center border transition-all ${
                          srv.status === 'Active'
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-600 border-amber-200'
                            : 'bg-green-50 hover:bg-green-100 text-green-600 border-green-200'
                        }`}
                        title={srv.status === 'Active' ? 'Set as Draft' : 'Publish'}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {srv.status === 'Active' ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                      <button 
                        onClick={() => navigate(`/admin/add-service?edit=${srv.id}`)}
                        className="w-7 h-7 rounded bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center transition-all"
                        title="Edit Details"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(srv.id)}
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

export default Services;
