import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { initialSubAdmins, saveSubAdmins } from '../../../data/adminState';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  const navigate = useNavigate();

  useEffect(() => {
    initialSubAdmins().then(data => setUsers(data));
  }, []);

  const saveAndSetUsers = (newUsers) => {
    setUsers(newUsers);
    saveSubAdmins(newUsers);
  };

  const handleDelete = (username) => {
    if (window.confirm(`Are you sure you want to delete admin user "${username}"?`)) {
      const updated = users.filter(u => u.username !== username);
      saveAndSetUsers(updated);
    }
  };

  const handleToggleStatus = (username) => {
    const updated = users.map(u => {
      if (u.username === username) {
        const nextStatus = u.status === 'Active' ? 'Inactive' : 'Active';
        return { ...u, status: nextStatus };
      }
      return u;
    });
    saveAndSetUsers(updated);
  };

  const handleResetPassword = (username) => {
    alert(`Password reset link generated for ${username}. A recovery email has been sent.`);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedRole('All Roles');
    setSelectedStatus('All Status');
  };

  // Filters
  const filtered = users.filter(u => {
    const matchesSearch = u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'All Roles' || u.role === selectedRole;
    const matchesStatus = selectedStatus === 'All Status' || u.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalCount = users.length;
  const activeCount = users.filter(u => u.status === 'Active').length;
  const inactiveCount = users.filter(u => u.status !== 'Active').length;

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <nav className="flex items-center gap-2 text-slate-400 text-xs mb-1 font-medium">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-600 font-bold">Admin Users</span>
          </nav>
          <h2 className="text-2xl font-bold text-slate-800">Admin Users Management</h2>
          <p className="text-sm text-slate-500">Manage hospital admin users, access permissions, and user roles</p>
        </div>
        <Link 
          to="/admin/add-admin-user" 
          className="flex items-center gap-2 bg-[#fea619] hover:bg-amber-500 text-slate-900 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          <span>Add Admin User</span>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200/50 shadow-sm flex flex-col justify-between border-l-4 border-l-[#1e3a8a]">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Admin Users</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-800">{totalCount}</span>
            <span className="text-[10px] text-green-600 font-bold flex items-center">+3% active</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/50 shadow-sm flex flex-col justify-between border-l-4 border-l-green-500">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Active Users</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-800">{activeCount}</span>
            <span className="text-[10px] text-slate-500 font-bold">Authorized staff</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/50 shadow-sm flex flex-col justify-between border-l-4 border-l-red-500">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Inactive/Disabled</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-800">{inactiveCount}</span>
            <span className="text-[10px] text-red-500 font-bold">Pending disablement</span>
          </div>
        </div>
      </div>

      {/* Filters Area */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Search User</label>
          <input 
            type="text"
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none"
            placeholder="Name, Email, or Username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-[180px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Role</label>
          <select 
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option>All Roles</option>
            <option>Super Admin</option>
            <option>Administration</option>
            <option>Editor</option>
          </select>
        </div>
        <div className="w-[150px] space-y-1">
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
          Reset
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-slate-500 font-bold uppercase">
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Email Address</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Created Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-slate-400 font-medium">No admin users found.</td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.username} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs uppercase border border-blue-100">
                        {u.username.substring(0, 2)}
                      </div>
                      <span className="font-bold text-slate-800">{u.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-secondary">{u.role || 'Administration'}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-medium">{u.created || '15 Jun, 2026'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      u.status === 'Active'
                        ? 'bg-green-50 text-green-600 border border-green-100'
                        : 'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button 
                        onClick={() => handleToggleStatus(u.username)}
                        className={`w-7 h-7 rounded flex items-center justify-center border transition-all ${
                          u.status === 'Active'
                            ? 'bg-red-50 hover:bg-red-100 text-red-500 border-red-100'
                            : 'bg-green-50 hover:bg-green-100 text-green-600 border-green-100'
                        }`}
                        title={u.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {u.status === 'Active' ? 'block' : 'check'}
                        </span>
                      </button>
                      <button 
                        onClick={() => handleResetPassword(u.username)}
                        className="w-7 h-7 rounded bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center transition-all"
                        title="Reset Password"
                      >
                        <span className="material-symbols-outlined text-[16px]">lock_reset</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(u.username)}
                        className="w-7 h-7 rounded bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 flex items-center justify-center transition-all"
                        title="Delete User"
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

export default AdminUsers;
