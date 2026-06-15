import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { initialDoctors, saveDoctors } from '../../../data/adminState';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedExp, setSelectedExp] = useState('Any Years');
  const [selectedAvail, setSelectedAvail] = useState('All Status');

  const navigate = useNavigate();

  useEffect(() => {
    initialDoctors().then(data => setDoctors(data));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this doctor profile?")) {
      const updated = doctors.filter(doc => doc.id !== id);
      setDoctors(updated);
      saveDoctors(updated);
    }
  };

  const handleToggleFeatured = (id) => {
    const updated = doctors.map(doc => {
      if (doc.id === id) {
        return { ...doc, featured: doc.featured === 'Yes' ? 'No' : 'Yes' };
      }
      return doc;
    });
    setDoctors(updated);
    saveDoctors(updated);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedDept('All Departments');
    setSelectedExp('Any Years');
    setSelectedAvail('All Status');
  };

  // Helper filters
  const filteredDoctors = doctors.filter(doc => {
    const nameMatch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const deptMatch = selectedDept === 'All Departments' || doc.department === selectedDept;
    
    let expMatch = true;
    if (selectedExp === '5+ Years') {
      const yrs = parseInt(doc.experience);
      expMatch = yrs >= 5;
    } else if (selectedExp === '10+ Years') {
      const yrs = parseInt(doc.experience);
      expMatch = yrs >= 10;
    } else if (selectedExp === '15+ Years') {
      const yrs = parseInt(doc.experience);
      expMatch = yrs >= 15;
    }

    const availMatch = selectedAvail === 'All Status' || doc.availability === selectedAvail;

    return nameMatch && deptMatch && expMatch && availMatch;
  });

  // Calculate statistics dynamically
  const totalCount = doctors.length;
  const availableToday = doctors.filter(d => d.availability === 'Available').length;
  const featuredCount = doctors.filter(d => d.featured === 'Yes').length;
  const onLeaveCount = doctors.filter(d => d.availability === 'On Leave').length;

  return (
    <div className="space-y-6">
      {/* Breadcrumbs and Action Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-slate-400 text-xs mb-2 font-medium">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-600 font-bold">Doctors</span>
          </nav>
          <h2 className="text-2xl font-bold text-slate-800">Doctors Directory</h2>
          <p className="text-sm text-slate-500">Manage medical practitioners, their profiles, and hospital availability.</p>
        </div>
        <Link 
          to="/admin/add-doctor" 
          className="flex items-center gap-2 bg-[#fea619] hover:bg-amber-500 text-slate-900 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          <span>Add New Doctor</span>
        </Link>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200/50 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Doctors</span>
            <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">groups</span>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-2xl text-slate-800">{totalCount}</h3>
            <p className="text-[10px] text-green-600 font-bold flex items-center gap-0.5 mt-1">
              <span className="material-symbols-outlined text-[12px]">trending_up</span> Live Directory
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/50 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Available Today</span>
            <div className="w-9 h-9 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">check_circle</span>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-2xl text-slate-800">{availableToday}</h3>
            <p className="text-[10px] text-slate-500 font-bold mt-1">Active staff on duty</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/50 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Featured Doctors</span>
            <div className="w-9 h-9 bg-amber-50 text-amber-500 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">verified</span>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-2xl text-slate-800">{featuredCount}</h3>
            <p className="text-[10px] text-slate-500 font-bold mt-1">Shown on home pages</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/50 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">On Leave</span>
            <div className="w-9 h-9 bg-red-50 text-red-500 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">event_busy</span>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-2xl text-slate-800">{onLeaveCount}</h3>
            <p className="text-[10px] text-red-500 font-bold mt-1">Temporary absences</p>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Search by Name</label>
          <input 
            type="text"
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none"
            placeholder="Search Dr. Name..."
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
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Experience</label>
          <select 
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
            value={selectedExp}
            onChange={(e) => setSelectedExp(e.target.value)}
          >
            <option>Any Years</option>
            <option>5+ Years</option>
            <option>10+ Years</option>
            <option>15+ Years</option>
          </select>
        </div>
        <div className="w-[150px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Availability</label>
          <select 
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
            value={selectedAvail}
            onChange={(e) => setSelectedAvail(e.target.value)}
          >
            <option>All Status</option>
            <option>Available</option>
            <option>Busy</option>
            <option>On Leave</option>
          </select>
        </div>
        <button 
          onClick={handleClearFilters}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold transition-all"
        >
          Clear Filters
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-slate-500 font-bold uppercase">
              <th className="px-4 py-3">Doctor Info</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Experience</th>
              <th className="px-4 py-3">Availability</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredDoctors.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-slate-400 font-medium">No matching doctors found.</td>
              </tr>
            ) : (
              filteredDoctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-50 border border-slate-200">
                        <img 
                          alt={doc.name} 
                          className="w-full h-full object-cover" 
                          src={doc.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuARaXeu4luOd8GQQLzu8wu-OFmQWyR6q11VQmjO9CVE8Qa5omvHneBdrg_Wi-Xa1lMk-N6_ck1IzebvAJBWox8X3ng5uwUeYaxUWkksnNEo03mrijsKUlCR6-1_T3RABeSR508ZmKO_9OjurzGjM6I80oFy4pIUR0q11TN5f6q23TPwRPKRJCAEi_cznj0NbxbdKCdSvg6c9epN7qYSvngqcLX1IIqBuRBhiL58hBsnKBegMWU928brCJcUpOcTTlsGlGqosuKiazY'} 
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm leading-snug">{doc.name}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">{doc.qualifications}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-700">{doc.department}</span>
                      <span className="text-[10px] text-slate-400">{doc.subSpeciality}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-600">{doc.experience}</td>
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
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => handleToggleFeatured(doc.id)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                        doc.featured === 'Yes'
                          ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100'
                          : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {doc.featured}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${doc.status === 'Active' ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                      <span className="font-semibold text-slate-600">{doc.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button 
                        onClick={() => navigate(`/admin/add-doctor?edit=${doc.id}`)}
                        className="w-7 h-7 rounded bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-[#1e3a8a] border border-slate-200 flex items-center justify-center transition-all"
                        title="Edit Profile"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(doc.id)}
                        className="w-7 h-7 rounded bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 flex items-center justify-center transition-all"
                        title="Delete Doctor"
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

export default Doctors;
