import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { initialAppointments, saveAppointments } from '../../../data/adminState';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState('All Doctors');
  const [selectedDept, setSelectedDept] = useState('All Depts');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedDate, setSelectedDate] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    initialAppointments().then(data => setAppointments(data));
  }, []);

  const saveAndSetAppointments = (newApts) => {
    setAppointments(newApts);
    saveAppointments(newApts);
  };

  const handleUpdateStatus = (id, newStatus) => {
    const updated = appointments.map(apt => {
      if (apt.id === id) {
        return { ...apt, status: newStatus };
      }
      return apt;
    });
    saveAndSetAppointments(updated);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete appointment ${id}?`)) {
      const updated = appointments.filter(apt => apt.id !== id);
      saveAndSetAppointments(updated);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDoc('All Doctors');
    setSelectedDept('All Depts');
    setSelectedStatus('All Status');
    setSelectedDate('');
  };

  // Filter list
  const filtered = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          apt.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDoc = selectedDoc === 'All Doctors' || apt.doctorName === selectedDoc;
    const matchesDept = selectedDept === 'All Depts' || apt.department === selectedDept;
    const matchesStatus = selectedStatus === 'All Status' || apt.status === selectedStatus;
    
    let matchesDate = true;
    if (selectedDate) {
      // simple substring match or comparison
      matchesDate = apt.dateTime.toLowerCase().includes(selectedDate.toLowerCase());
    }

    return matchesSearch && matchesDoc && matchesDept && matchesStatus && matchesDate;
  });

  // Unique lists for filters
  const docList = Array.from(new Set(appointments.map(a => a.doctorName)));
  const deptList = Array.from(new Set(appointments.map(a => a.department)));

  // Calculate summary counts
  const totalCount = appointments.length;
  const pendingCount = appointments.filter(a => a.status === 'Pending').length;
  const confirmedCount = appointments.filter(a => a.status === 'Confirmed').length;
  const completedCount = appointments.filter(a => a.status === 'Completed').length;
  const cancelledCount = appointments.filter(a => a.status === 'Cancelled').length;

  return (
    <div className="space-y-6">
      {/* Breadcrumbs and Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-slate-400 text-xs mb-2 font-medium">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-600 font-bold">Appointments</span>
          </nav>
          <h2 className="text-2xl font-bold text-slate-800">Appointments Management</h2>
          <p className="text-sm text-slate-500">Manage patient appointments, schedules, and medical consultations.</p>
        </div>
        <Link 
          to="/admin/add-appointment" 
          className="flex items-center gap-2 bg-[#fea619] hover:bg-amber-500 text-slate-900 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          <span>Add Manual Appointment</span>
        </Link>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total</p>
          <div className="flex items-end justify-between">
            <h3 className="font-bold text-xl text-slate-800">{totalCount}</h3>
            <span className="text-[9px] text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-md font-bold">Active</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pending</p>
          <div className="flex items-end justify-between">
            <h3 className="font-bold text-xl text-slate-800">{pendingCount}</h3>
            <span className="material-symbols-outlined text-amber-500 text-lg">pending_actions</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Confirmed</p>
          <div className="flex items-end justify-between">
            <h3 className="font-bold text-xl text-slate-800">{confirmedCount}</h3>
            <span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Completed</p>
          <div className="flex items-end justify-between">
            <h3 className="font-bold text-xl text-slate-800">{completedCount}</h3>
            <span className="material-symbols-outlined text-green-600 text-lg font-fill">verified</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Cancelled</p>
          <div className="flex items-end justify-between">
            <h3 className="font-bold text-xl text-slate-800">{cancelledCount}</h3>
            <span className="material-symbols-outlined text-red-500 text-lg">cancel</span>
          </div>
        </div>

        <div className="bg-[#1e3a8a]/5 p-4 rounded-xl border border-[#1e3a8a]/15 shadow-sm">
          <p className="text-[10px] font-bold text-[#1e3a8a] uppercase tracking-wider mb-1">Clinic load</p>
          <div className="flex items-end justify-between">
            <h3 className="font-bold text-xl text-[#1e3a8a]">{totalCount - cancelledCount}</h3>
            <span className="material-symbols-outlined text-[#1e3a8a] text-lg font-fill">calendar_today</span>
          </div>
        </div>
      </div>

      {/* Filters Row */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Search Patient</label>
          <input 
            type="text"
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none"
            placeholder="Patient name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-[180px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Doctor</label>
          <select 
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
            value={selectedDoc}
            onChange={(e) => setSelectedDoc(e.target.value)}
          >
            <option>All Doctors</option>
            {docList.map(doc => <option key={doc} value={doc}>{doc}</option>)}
          </select>
        </div>
        <div className="w-[150px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Department</label>
          <select 
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option>All Depts</option>
            {deptList.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="w-[130px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Status</label>
          <select 
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>
        <button 
          onClick={handleResetFilters}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-bold transition-all"
        >
          Reset
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-slate-500 font-bold uppercase">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Patient Name</th>
              <th className="px-4 py-3">Doctor / Dept</th>
              <th className="px-4 py-3">Date &amp; Time</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-slate-400 font-medium">No matching appointments found.</td>
              </tr>
            ) : (
              filtered.map((apt) => {
                const initLetters = apt.patientName ? apt.patientName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'PT';
                return (
                  <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-[#1e3a8a]">{apt.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-xs">
                          {initLetters}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{apt.patientName}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">{apt.patientPhone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-700">{apt.doctorName}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{apt.department}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-700">{apt.dateTime}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        apt.payment === 'Paid'
                          ? 'bg-green-50 text-green-600 border border-green-100'
                          : apt.payment === 'Partial'
                          ? 'bg-amber-50 text-amber-600 border border-amber-100'
                          : 'bg-red-50 text-red-600 border border-red-100'
                      }`}>
                        {apt.payment}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        apt.status === 'Completed' || apt.status === 'Confirmed'
                          ? 'bg-green-50 text-green-600 border border-green-100'
                          : apt.status === 'Cancelled'
                          ? 'bg-red-50 text-red-600 border border-red-100'
                          : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        {apt.status === 'Pending' && (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(apt.id, 'Confirmed')}
                              className="w-7 h-7 rounded bg-green-50 hover:bg-green-100 text-green-600 border border-green-100 flex items-center justify-center transition-all"
                              title="Confirm Appointment"
                            >
                              <span className="material-symbols-outlined text-[16px]">check</span>
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(apt.id, 'Cancelled')}
                              className="w-7 h-7 rounded bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 flex items-center justify-center transition-all"
                              title="Cancel Appointment"
                            >
                              <span className="material-symbols-outlined text-[16px]">cancel</span>
                            </button>
                          </>
                        )}
                        {apt.status === 'Confirmed' && (
                          <button 
                            onClick={() => handleUpdateStatus(apt.id, 'Completed')}
                            className="w-7 h-7 rounded bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 flex items-center justify-center transition-all"
                            title="Complete Consultation"
                          >
                            <span className="material-symbols-outlined text-[16px]">done_all</span>
                          </button>
                        )}
                        <button 
                          onClick={() => navigate(`/admin/add-appointment?edit=${apt.id}`)}
                          className="w-7 h-7 rounded bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center transition-all"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(apt.id)}
                          className="w-7 h-7 rounded bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 flex items-center justify-center transition-all"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointments;
