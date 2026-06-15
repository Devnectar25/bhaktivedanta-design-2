import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initialSubAdmins, saveSubAdmins } from '../../../data/adminState';

const AddSubAdmin = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Administration');
  const [status, setStatus] = useState('Active');

  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    initialSubAdmins().then(list => setUsersList(list));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !email) {
      alert("Please fill in Username and Email.");
      return;
    }

    const newUser = {
      username: username.trim(),
      email: email.trim(),
      role,
      status,
      created: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    const updated = [...usersList, newUser];
    saveSubAdmins(updated);
    navigate('/admin/admin-users');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-slate-400 text-xs mb-2 font-medium font-sans">
        <span>Dashboard</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span>Admin Users</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-slate-600 font-bold">Add Sub Admin</span>
      </nav>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Add New Sub Admin</h2>
        <p className="text-sm text-slate-500 font-medium font-sans font-sans">Configure access details and role authorizations for a sub administrator.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 text-xs text-slate-700 font-sans">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase">Username *</label>
            <input 
              type="text" 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
              placeholder="e.g. admin.sneha"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase">Email Address *</label>
            <input 
              type="email" 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
              placeholder="sneha@bhaktivedantahospital.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase">Role Authorization</label>
            <select 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium cursor-pointer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Administration">Administration</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Editor">Editor</option>
            </select>
          </div>

          <div className="space-y-1">
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

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button 
            type="button" 
            onClick={() => navigate('/admin/admin-users')} 
            className="px-5 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 font-semibold"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="bg-[#fea619] hover:bg-amber-500 text-slate-900 px-6 py-2 rounded-lg font-bold transition-all shadow-sm"
          >
            Save Admin
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSubAdmin;
