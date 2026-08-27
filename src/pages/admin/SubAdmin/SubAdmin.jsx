import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSubadmins, updateSubadmin, deleteSubadmin, addSubadmin } from '../../../utils/api';

const defaultSubAdmins = [
  {
    username: 'admin.sneha',
    email: 'sneha@bhaktivedantahospital.com',
    role: 'Administration',
    status: 'Active',
    created: '12 Oct 2023'
  },
  {
    username: 'admin.rajesh',
    email: 'rajesh@bhaktivedantahospital.com',
    role: 'Clinical Manager',
    status: 'Active',
    created: '15 Oct 2023'
  },
  {
    username: 'admin.support',
    email: 'helpdesk@bhaktivedantahospital.com',
    role: 'Helpdesk Manager',
    status: 'Active',
    created: '20 Jan 2024'
  }
];

const SubAdmin = () => {
  const [subadmins, setSubadmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubAdmin, setNewSubAdmin] = useState({
    username: '',
    email: '',
    role: 'Administration',
    status: 'Active'
  });

  useEffect(() => {
    getSubadmins(defaultSubAdmins).then(data => setSubadmins(data || defaultSubAdmins));
  }, []);

  const handleToggleStatus = (username, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    updateSubadmin(username, { status: nextStatus }, subadmins).then(() => {
      setSubadmins(prev => prev.map(s => s.username === username ? { ...s, status: nextStatus } : s));
    });
  };

  const handleDelete = (username) => {
    if (window.confirm(`Are you sure you want to delete sub-admin account "${username}"?`)) {
      deleteSubadmin(username, subadmins).then(() => {
        setSubadmins(prev => prev.filter(s => s.username !== username));
      });
    }
  };

  const handleCreateSubAdmin = (e) => {
    e.preventDefault();
    if (!newSubAdmin.username || !newSubAdmin.email) {
      alert("Username and Email are required.");
      return;
    }

    const createdObj = {
      username: newSubAdmin.username.trim(),
      email: newSubAdmin.email.trim(),
      role: newSubAdmin.role,
      status: newSubAdmin.status,
      created: new Date().toLocaleDateString()
    };

    addSubadmin(createdObj, subadmins).then(() => {
      setSubadmins(prev => [...prev, createdObj]);
      setShowAddModal(false);
      setNewSubAdmin({ username: '', email: '', role: 'Administration', status: 'Active' });
      alert(`Sub-admin account "${createdObj.username}" created successfully.`);
    });
  };

  const filtered = subadmins.filter(s => {
    const matchesSearch = s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || s.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <nav className="flex items-center gap-2 text-slate-400 text-xs mb-1 font-medium">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-600 font-bold">Sub-Admin Accounts</span>
          </nav>
          <h2 className="text-2xl font-bold text-slate-800">Sub-Admin Management</h2>
          <p className="text-sm text-slate-500">Configure sub-admin accounts, role permissions, and access privileges across modules</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-[#fea619] hover:bg-amber-500 text-slate-900 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          <span>Add New Sub-Admin</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200/50 shadow-sm border-l-4 border-l-[#1e3a8a]">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Sub-Admins</span>
          <p className="text-2xl font-bold text-slate-800 mt-2">{subadmins.length}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200/50 shadow-sm border-l-4 border-l-green-500">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Active Accounts</span>
          <p className="text-2xl font-bold text-slate-800 mt-2">{subadmins.filter(s => s.status === 'Active').length}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200/50 shadow-sm border-l-4 border-l-amber-500">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Role Categories</span>
          <p className="text-2xl font-bold text-slate-800 mt-2">4 Roles</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Search Account</label>
          <input 
            type="text"
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none"
            placeholder="Username or Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-[180px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Role Filter</label>
          <select 
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="Administration">Administration</option>
            <option value="Clinical Manager">Clinical Manager</option>
            <option value="Helpdesk Manager">Helpdesk Manager</option>
            <option value="Content Editor">Content Editor</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
            <tr>
              <th className="px-4 py-3">Sub-Admin Username</th>
              <th className="px-4 py-3">Email Address</th>
              <th className="px-4 py-3">Assigned Role</th>
              <th className="px-4 py-3">Created Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-slate-400 font-medium">No sub-admin accounts found.</td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s.username} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs uppercase border border-amber-200">
                        {s.username.substring(0, 2)}
                      </div>
                      <span>{s.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-medium">{s.email}</td>
                  <td className="px-4 py-3 font-bold text-[#1e3a8a]">{s.role}</td>
                  <td className="px-4 py-3 text-slate-500 font-medium">{s.created}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      s.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button 
                        onClick={() => handleToggleStatus(s.username, s.status)}
                        className={`px-2.5 py-1 rounded text-xs font-bold border transition-all ${
                          s.status === 'Active' ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                        }`}
                      >
                        {s.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => handleDelete(s.username)}
                        className="w-7 h-7 rounded bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 flex items-center justify-center transition-all"
                        title="Delete Account"
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

      {/* Add Sub-Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">Add New Sub-Admin Account</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateSubAdmin} className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Username *</label>
                <input 
                  type="text" 
                  required
                  placeholder="admin.name"
                  value={newSubAdmin.username}
                  onChange={(e) => setNewSubAdmin({ ...newSubAdmin, username: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@bhaktivedantahospital.com"
                  value={newSubAdmin.email}
                  onChange={(e) => setNewSubAdmin({ ...newSubAdmin, email: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role &amp; Permissions</label>
                <select 
                  value={newSubAdmin.role}
                  onChange={(e) => setNewSubAdmin({ ...newSubAdmin, role: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none cursor-pointer"
                >
                  <option value="Administration">Administration</option>
                  <option value="Clinical Manager">Clinical Manager</option>
                  <option value="Helpdesk Manager">Helpdesk Manager</option>
                  <option value="Content Editor">Content Editor</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)} 
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 rounded-lg bg-[#fea619] text-slate-900 font-bold hover:bg-amber-500 shadow-md"
                >
                  Create Sub-Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubAdmin;
