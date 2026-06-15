import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loadAdminData, saveAdminData } from '../../../data/adminState';

const AddHealthPackage = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [testsCount, setTestsCount] = useState('8');
  const [status, setStatus] = useState('Active');

  const [packagesList, setPackagesList] = useState([]);

  useEffect(() => {
    const list = loadAdminData('bhaktivedanta_admin_packages', []);
    setPackagesList(list);

    if (editId) {
      const match = list.find(p => p.id === editId);
      if (match) {
        setName(match.name || '');
        setDescription(match.description || '');
        setPrice(match.price ? match.price.toString() : '');
        setTestsCount(match.testsCount ? match.testsCount.toString() : '8');
        setStatus(match.status || 'Active');
      }
    }
  }, [editId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !price) {
      alert("Please fill in the required fields (Name and Price).");
      return;
    }

    let updatedList;
    if (editId) {
      updatedList = packagesList.map(pkg => {
        if (pkg.id === editId) {
          return {
            ...pkg,
            name,
            description,
            price: parseFloat(price) || 0,
            testsCount: parseInt(testsCount) || 8,
            status,
            lastUpdated: 'Just now'
          };
        }
        return pkg;
      });
    } else {
      const newPkg = {
        id: `PKG-${Date.now().toString().substring(8)}`,
        name,
        description,
        price: parseFloat(price) || 0,
        testsCount: parseInt(testsCount) || 8,
        status,
        lastUpdated: 'Just now'
      };
      updatedList = [newPkg, ...packagesList];
    }

    saveAdminData('bhaktivedanta_admin_packages', updatedList);
    navigate('/admin/health-packages');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-slate-400 text-xs mb-2 font-medium font-sans">
        <span>Dashboard</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span>Health Packages</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-slate-600 font-bold">{editId ? 'Edit Package' : 'Add Package'}</span>
      </nav>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{editId ? 'Edit Package Details' : 'Add Health Package'}</h2>
        <p className="text-sm text-slate-500 font-medium font-sans">Configure preventive check-up packages, tests, and pricing.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 text-xs text-slate-700 font-sans">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1 sm:col-span-2">
            <label className="font-bold text-slate-500 uppercase">Package Name *</label>
            <input 
              type="text" 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
              placeholder="e.g. Basic Cardiac Checkup"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase">Pricing Amount (INR) *</label>
            <input 
              type="number" 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
              placeholder="1500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase">Number of Included Tests</label>
            <input 
              type="number" 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
              value={testsCount}
              onChange={(e) => setTestsCount(e.target.value)}
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="font-bold text-slate-500 uppercase">Status</label>
            <select 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium cursor-pointer"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-500 uppercase">Package Description</label>
          <textarea 
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
            placeholder="Details of what this medical check-up package contains..."
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button 
            type="button" 
            onClick={() => navigate('/admin/health-packages')} 
            className="px-5 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 font-semibold"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="bg-[#fea619] hover:bg-amber-500 text-slate-900 px-6 py-2 rounded-lg font-bold transition-all shadow-sm"
          >
            {editId ? 'Save Package' : 'Publish Package'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHealthPackage;
