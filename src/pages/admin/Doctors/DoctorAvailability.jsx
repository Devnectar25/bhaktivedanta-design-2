import React, { useState, useEffect } from 'react';
import { initialDoctors, saveDoctors } from '../../../data/adminState';

const DoctorAvailability = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedStatus, setSelectedStatus] = useState('Any Status');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('16:00');
  const [slotDuration, setSlotDuration] = useState('20 mins');
  const [status, setStatus] = useState('Available');
  const [selectedDays, setSelectedDays] = useState({
    Mon: true, Tue: false, Wed: true, Thu: false, Fri: true, Sat: false, Sun: false
  });

  useEffect(() => {
    initialDoctors().then(data => setDoctors(data));
  }, []);

  const saveAndSetDoctors = (newDocs) => {
    setDoctors(newDocs);
    saveDoctors(newDocs);
  };

  const handleToggleDay = (day) => {
    setSelectedDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const handleSaveAvailability = (e) => {
    e.preventDefault();
    if (!selectedDocId) {
      alert("Please select a doctor.");
      return;
    }

    const activeDays = Object.keys(selectedDays).filter(k => selectedDays[k]).join(', ') || 'Mon';
    const timings = `${startTime} AM - ${endTime} PM`; // simple display format

    const updated = doctors.map(doc => {
      if (doc.id === selectedDocId) {
        return {
          ...doc,
          availability: status,
          availableDays: activeDays,
          consultationTime: `${startTime} - ${endTime}`,
          slotDuration: slotDuration
        };
      }
      return doc;
    });

    saveAndSetDoctors(updated);
    setIsModalOpen(false);
    // Reset modal
    setSelectedDocId('');
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedDept('All Departments');
    setSelectedStatus('Any Status');
  };

  const filtered = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All Departments' || doc.department === selectedDept;
    const matchesStatus = selectedStatus === 'Any Status' || doc.availability === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const totalCount = doctors.length;
  const availableCount = doctors.filter(d => d.availability === 'Available').length;
  const busyCount = doctors.filter(d => d.availability === 'Busy').length;
  const leaveCount = doctors.filter(d => d.availability === 'On Leave').length;

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-slate-400 text-xs mb-2 font-medium">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-600 font-bold">Doctor Availability</span>
          </nav>
          <h2 className="text-2xl font-bold text-slate-800 font-sans">Doctor Availability</h2>
          <p className="text-sm text-slate-500">Manage doctor schedules and consultation timings</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#fea619] hover:bg-amber-500 text-slate-900 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          <span>Add Availability</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200/50 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Scheduled</span>
            <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">badge</span>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-2xl text-slate-800">{totalCount}</h3>
            <p className="text-[10px] text-green-600 font-bold flex items-center gap-0.5 mt-1">Live schedule</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/50 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Available Today</span>
            <div className="w-9 h-9 bg-green-50 text-green-700 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">event_available</span>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-2xl text-slate-800">{availableCount}</h3>
            <p className="text-[10px] text-slate-500 font-bold mt-1">In clinic consultations</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/50 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Busy Doctors</span>
            <div className="w-9 h-9 bg-amber-50 text-amber-500 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">timer</span>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-2xl text-slate-800">{busyCount}</h3>
            <p className="text-[10px] text-slate-500 font-bold mt-1">Currently in surgery / busy</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/50 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">On Leave</span>
            <div className="w-9 h-9 bg-red-50 text-red-500 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">person_off</span>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-2xl text-slate-800">{leaveCount}</h3>
            <p className="text-[10px] text-red-500 font-bold mt-1">Leave approved</p>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Filter by Doctor Name</label>
          <input 
            type="text"
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none"
            placeholder="Search Doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-[180px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Department</label>
          <select 
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option>All Departments</option>
            <option>Cardiology</option>
            <option>Pediatrics</option>
            <option>Orthopedics</option>
            <option>Oncology</option>
          </select>
        </div>
        <div className="w-[150px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Availability Status</label>
          <select 
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option>Any Status</option>
            <option>Available</option>
            <option>Busy</option>
            <option>On Leave</option>
          </select>
        </div>
        <button 
          onClick={handleClearFilters}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-bold transition-all"
        >
          Reset Filters
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-slate-500 font-bold uppercase">
              <th className="px-4 py-3">Doctor</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Speciality</th>
              <th className="px-4 py-3">Available Days</th>
              <th className="px-4 py-3">Consultation Time</th>
              <th className="px-4 py-3">Slot</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.map((doc) => {
              const days = doc.availableDays || 'Mon, Wed, Fri';
              const time = doc.consultationTime || '10:00 AM - 04:00 PM';
              const slot = doc.slotDuration || '20 mins';

              return (
                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img className="w-8 h-8 rounded-full object-cover border border-slate-100" src={doc.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuARXeu4luOd8GQQLzu8wu-OFmQWyR6q11VQmjO9CVE8Qa5omvHneBdrg_Wi-Xa1lMk-N6_ck1IzebvAJBWox8X3ng5uwUeYaxUWkksnNEo03mrijsKUlCR6-1_T3RABeSR508ZmKO_9OjurzGjM6I80oFy4pIUR0q11TN5f6q23TPwRPKRJCAEi_cznj0NbxbdKCdSvg6c9epN7qYSvngqcLX1IIqBuRBhiL58hBsnKBegMWU928brCJcUpOcTTlsGlGqosuKiazY'} alt={doc.name} />
                      <div>
                        <p className="font-bold text-slate-800 text-sm leading-tight">{doc.name}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">ID: {doc.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-700">{doc.department}</td>
                  <td className="px-4 py-3 text-slate-500 font-medium">{doc.subSpeciality || 'Consultant'}</td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold px-2 py-0.5 rounded">
                      {days}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-600">{time}</td>
                  <td className="px-4 py-3 text-slate-500 font-semibold">{slot}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      doc.availability === 'Available'
                        ? 'bg-green-50 text-green-600 border border-green-100'
                        : doc.availability === 'Busy'
                        ? 'bg-amber-50 text-amber-600 border border-amber-100'
                        : 'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                      {doc.availability}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => {
                          setSelectedDocId(doc.id);
                          setStatus(doc.availability || 'Available');
                          setSlotDuration(doc.slotDuration || '20 mins');
                          setIsModalOpen(true);
                        }}
                        className="w-7 h-7 rounded bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center transition-all"
                        title="Edit Availability"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Overlay: Add/Edit Doctor Availability */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden relative border border-slate-200 animate-in fade-in zoom-in duration-200 text-xs text-slate-700">
            <div className="p-4 bg-[#1e3a8a] text-white flex justify-between items-center">
              <h3 className="font-bold text-sm">Manage Doctor Availability</h3>
              <button className="hover:bg-white/10 rounded-full p-1" onClick={() => setIsModalOpen(false)}>
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveAvailability} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="font-bold text-slate-500 uppercase px-1">Select Doctor</label>
                  <select 
                    className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 text-xs rounded-lg outline-none cursor-pointer"
                    value={selectedDocId}
                    onChange={(e) => setSelectedDocId(e.target.value)}
                  >
                    <option value="">Choose a doctor...</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.department})</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-span-2 space-y-1">
                  <label className="font-bold text-slate-500 uppercase px-1 font-sans">Available Days</label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {Object.keys(selectedDays).map(day => (
                      <button
                        type="button"
                        key={day}
                        onClick={() => handleToggleDay(day)}
                        className={`px-3 py-1 border rounded-lg font-semibold transition-all ${
                          selectedDays[day]
                            ? 'bg-[#1e3a8a] text-white border-[#1e3a8a]'
                            : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase px-1">Start Time</label>
                  <input 
                    className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 text-xs rounded-lg outline-none" 
                    type="time" 
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase px-1">End Time</label>
                  <input 
                    className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 text-xs rounded-lg outline-none" 
                    type="time" 
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase px-1">Slot Duration</label>
                  <select 
                    className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 text-xs rounded-lg outline-none cursor-pointer"
                    value={slotDuration}
                    onChange={(e) => setSlotDuration(e.target.value)}
                  >
                    <option value="15 mins">15 mins</option>
                    <option value="20 mins">20 mins</option>
                    <option value="30 mins">30 mins</option>
                    <option value="45 mins">45 mins</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase px-1">Availability Status</label>
                  <select 
                    className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 text-xs rounded-lg outline-none cursor-pointer"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Available">Available</option>
                    <option value="Busy">Busy</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-[#fea619] hover:bg-amber-500 text-slate-900 px-5 py-2 rounded-lg font-bold transition-all shadow-sm"
                >
                  Save Availability
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAvailability;
