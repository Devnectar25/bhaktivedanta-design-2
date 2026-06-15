import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loadAdminData, saveAdminData } from '../../../data/adminState';

const AddService = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [sections, setSections] = useState('3');
  const [status, setStatus] = useState('Active');
  const [icon, setIcon] = useState('medical_services');

  const [servicesList, setServicesList] = useState([]);

  useEffect(() => {
    const list = loadAdminData('bhaktivedanta_admin_services', []);
    setServicesList(list);

    if (editId) {
      const match = list.find(s => s.id === editId);
      if (match) {
        setName(match.name || '');
        setDescription(match.description || '');
        setSlug(match.slug || '');
        setSections(match.sections ? match.sections.toString() : '3');
        setStatus(match.status || 'Active');
        setIcon(match.icon || 'medical_services');
      }
    }
  }, [editId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name) {
      alert("Service name is required.");
      return;
    }

    let updatedList;
    if (editId) {
      updatedList = servicesList.map(srv => {
        if (srv.id === editId) {
          return {
            ...srv,
            name,
            description,
            slug: slug || `/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            sections: parseInt(sections) || 3,
            status,
            icon,
            lastUpdated: 'Just now'
          };
        }
        return srv;
      });
    } else {
      const newSrv = {
        id: `SRV-${Date.now().toString().substring(8)}`,
        name,
        description,
        slug: slug || `/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        sections: parseInt(sections) || 3,
        status,
        icon,
        lastUpdated: 'Just now'
      };
      updatedList = [newSrv, ...servicesList];
    }

    saveAdminData('bhaktivedanta_admin_services', updatedList);
    navigate('/admin/services');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-slate-400 text-xs mb-2 font-medium font-sans">
        <span>Dashboard</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span>Services</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-slate-600 font-bold">{editId ? 'Edit Service' : 'Add Service'}</span>
      </nav>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{editId ? 'Edit Service Details' : 'Add New Service'}</h2>
        <p className="text-sm text-slate-500 font-medium">Configure clinical and departmental service offerings for public display.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 text-xs text-slate-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1 sm:col-span-2">
            <label className="font-bold text-slate-500 uppercase">Service Name *</label>
            <input 
              type="text" 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
              placeholder="e.g. Holistic Wellness"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase">Page Slug</label>
            <input 
              type="text" 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
              placeholder="e.g. /holistic-wellness"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase">Google Material Icon Identifier</label>
            <input 
              type="text" 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
              placeholder="e.g. self_improvement"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase">Number of Layout Sections</label>
            <input 
              type="number" 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
              value={sections}
              onChange={(e) => setSections(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase">Status</label>
            <select 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium cursor-pointer"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-500 uppercase">Service Summary / Short Description</label>
          <textarea 
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
            placeholder="Introduce the service to give patients a quick insight..."
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button 
            type="button" 
            onClick={() => navigate('/admin/services')} 
            className="px-5 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 font-semibold"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="bg-[#fea619] hover:bg-amber-500 text-slate-900 px-6 py-2 rounded-lg font-bold transition-all shadow-sm"
          >
            {editId ? 'Save Service' : 'Publish Service'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddService;
