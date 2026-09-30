import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  initialDoctors, 
  initialEvents, 
  initialNews, 
  initialGallery,
  initialQueries
} from '../../../data/adminState';
import { 
  getQueries,
  getAppErrors,
  getSpecialitiesState,
  getServicesState,
  getSpiritualCareState,
  getHeroBanners
} from '../../../utils/api';
import { defaultSpecialitiesState } from '../../../data/defaultSpecialities';
import { defaultServicesState } from '../../../data/defaultServices';
import { defaultSpiritualCareState, defaultSpiritualSections } from '../../../data/defaultSpiritualCare';

const Dashboard = () => {
  const navigate = useNavigate();

  // Dynamic API Counts & Data Lists
  const [loading, setLoading] = useState(true);
  const [doctorsCount, setDoctorsCount] = useState(0);
  const [specialitiesCount, setSpecialitiesCount] = useState(0);
  const [servicesCount, setServicesCount] = useState(0);
  const [queriesCount, setQueriesCount] = useState(0);
  const [pendingQueriesCount, setPendingQueriesCount] = useState(0);
  const [errorsCount, setErrorsCount] = useState(0);
  const [criticalErrorsCount, setCriticalErrorsCount] = useState(0);
  const [spiritualSectionsCount, setSpiritualSectionsCount] = useState(0);
  const [newsCount, setNewsCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [bannersCount, setBannersCount] = useState(0);

  // Recent Items lists
  const [recentQueries, setRecentQueries] = useState([]);
  const [recentErrors, setRecentErrors] = useState([]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const defaultQ = await initialQueries();
      
      const [
        docs,
        evts,
        nws,
        gal,
        specsState,
        servsState,
        spirState,
        queriesData,
        errorsData,
        bannersData
      ] = await Promise.all([
        initialDoctors().catch(() => []),
        initialEvents().catch(() => []),
        initialNews().catch(() => []),
        initialGallery().catch(() => []),
        getSpecialitiesState(defaultSpecialitiesState).catch(() => defaultSpecialitiesState),
        getServicesState(defaultServicesState).catch(() => defaultServicesState),
        getSpiritualCareState(defaultSpiritualCareState).catch(() => defaultSpiritualCareState),
        getQueries(defaultQ).catch(() => defaultQ),
        getAppErrors([]).catch(() => []),
        getHeroBanners([]).catch(() => [])
      ]);

      // Counts
      setDoctorsCount(Array.isArray(docs) ? docs.length : 0);
      setEventsCount(Array.isArray(evts) ? evts.length : 0);
      setNewsCount(Array.isArray(nws) ? nws.length : 0);
      
      const specsList = specsState?.specialities || defaultSpecialitiesState.specialities || [];
      setSpecialitiesCount(specsList.length);

      const servsList = servsState?.categories || defaultServicesState.categories || [];
      const totalServices = servsList.reduce((acc, cat) => acc + (cat.services?.length || 0), 0);
      setServicesCount(totalServices || servsList.length);

      const spirList = spirState?.sections || defaultSpiritualSections || [];
      setSpiritualSectionsCount(spirList.length);

      const qList = Array.isArray(queriesData) ? queriesData : [];
      setQueriesCount(qList.length);
      setPendingQueriesCount(qList.filter(q => q.status === 'Pending').length);
      setRecentQueries(qList.slice(0, 5));

      const errList = Array.isArray(errorsData) ? errorsData : [];
      setErrorsCount(errList.length);
      setCriticalErrorsCount(errList.filter(e => e.level === 'Critical').length);
      setRecentErrors(errList.slice(0, 4));

      setBannersCount(Array.isArray(bannersData) ? bannersData.length : 0);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    window.addEventListener('admin_data_updated', loadDashboardData);
    return () => window.removeEventListener('admin_data_updated', loadDashboardData);
  }, []);

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* Top Banner / Welcome Bar */}
      <div className="bg-gradient-to-r from-[#1e3a8a] via-[#172554] to-[#0f172a] text-white p-5 rounded-2xl shadow-md border border-slate-700/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Hospital Operations Control Panel</span>
          </div>
          <h1 className="text-xl font-bold font-serif">Bhaktivedanta Hospital Management</h1>
          <p className="text-xs text-blue-100/80 mt-0.5">
            Live overview of hospital clinical services, patient enquiries, medical staff, and system performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/add-doctor"
            className="flex items-center gap-1.5 bg-[#fea619] hover:bg-amber-500 text-slate-900 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            <span>Add Doctor</span>
          </Link>
          <Link
            to="/admin/add-service"
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
          >
            <span className="material-symbols-outlined text-base">add_task</span>
            <span>Add Service</span>
          </Link>
        </div>
      </div>

      {/* 6 KPI Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* Doctors Card */}
        <Link 
          to="/admin/doctors"
          className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#1e3a8a] flex items-center justify-center group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xl font-fill">group</span>
            </div>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md text-[10px] font-bold">
              Live
            </span>
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Medical Staff</p>
          <div className="flex items-baseline justify-between mt-1">
            <h3 className="text-xl font-bold text-slate-800">{doctorsCount}</h3>
            <span className="text-[11px] font-semibold text-blue-600 group-hover:underline">Doctors →</span>
          </div>
        </Link>

        {/* Specialities Card */}
        <Link 
          to="/admin/specialities"
          className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xl font-fill">stethoscope</span>
            </div>
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-md text-[10px] font-bold">
              Active
            </span>
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Specialities</p>
          <div className="flex items-baseline justify-between mt-1">
            <h3 className="text-xl font-bold text-slate-800">{specialitiesCount}</h3>
            <span className="text-[11px] font-semibold text-indigo-600 group-hover:underline">Manage →</span>
          </div>
        </Link>

        {/* Services Card */}
        <Link 
          to="/admin/services"
          className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm hover:border-amber-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xl font-fill">medical_services</span>
            </div>
            <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold">
              Services
            </span>
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hospital Services</p>
          <div className="flex items-baseline justify-between mt-1">
            <h3 className="text-xl font-bold text-slate-800">{servicesCount}</h3>
            <span className="text-[11px] font-semibold text-amber-600 group-hover:underline">Manage →</span>
          </div>
        </Link>

        {/* Patient Enquiries Card */}
        <Link 
          to="/admin/queries"
          className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm hover:border-orange-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xl font-fill">question_answer</span>
            </div>
            {pendingQueriesCount > 0 ? (
              <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-md text-[10px] font-bold animate-pulse">
                {pendingQueriesCount} Pending
              </span>
            ) : (
              <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-md text-[10px] font-bold">
                Up to date
              </span>
            )}
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Patient Queries</p>
          <div className="flex items-baseline justify-between mt-1">
            <h3 className="text-xl font-bold text-slate-800">{queriesCount}</h3>
            <span className="text-[11px] font-semibold text-orange-600 group-hover:underline">View Queries →</span>
          </div>
        </Link>

        {/* System Error Logs Card */}
        <Link 
          to="/admin/app-errors"
          className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm hover:border-red-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xl font-fill">bug_report</span>
            </div>
            {criticalErrorsCount > 0 ? (
              <span className="bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-md text-[10px] font-bold animate-pulse">
                {criticalErrorsCount} Critical
              </span>
            ) : (
              <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-md text-[10px] font-bold">
                Healthy
              </span>
            )}
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">App Error Logs</p>
          <div className="flex items-baseline justify-between mt-1">
            <h3 className="text-xl font-bold text-slate-800">{errorsCount}</h3>
            <span className="text-[11px] font-semibold text-red-600 group-hover:underline">Inspect Logs →</span>
          </div>
        </Link>

        {/* Spiritual Care Sections Card */}
        <Link 
          to="/admin/spiritual-care"
          className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm hover:border-teal-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xl font-fill">spa</span>
            </div>
            <span className="bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-md text-[10px] font-bold">
              Modular
            </span>
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Spiritual Care</p>
          <div className="flex items-baseline justify-between mt-1">
            <h3 className="text-xl font-bold text-slate-800">{spiritualSectionsCount}</h3>
            <span className="text-[11px] font-semibold text-teal-600 group-hover:underline">Manage →</span>
          </div>
        </Link>
      </section>

      {/* Main Content Grid: Enquiries Table & System Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 7 Cols: Recent Patient Queries */}
        <div className="lg:col-span-7 bg-white rounded-xl shadow-sm border border-slate-200/80 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1e3a8a] text-lg">forum</span>
                <h3 className="font-bold text-sm text-slate-800">Recent Patient Enquiries</h3>
              </div>
              <Link 
                to="/admin/queries" 
                className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
              >
                <span>View All ({queriesCount})</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-50 border-b border-slate-100">
                    <th className="px-3 py-2 w-[80px]">ID</th>
                    <th className="px-3 py-2 min-w-[130px]">Patient Name</th>
                    <th className="px-3 py-2 min-w-[160px]">Subject</th>
                    <th className="px-3 py-2 w-[100px]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentQueries.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-3 py-6 text-center text-slate-400 font-medium">
                        No patient enquiries recorded yet.
                      </td>
                    </tr>
                  ) : (
                    recentQueries.map((q) => (
                      <tr key={q.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-3 py-2 font-mono text-[11px] font-bold text-[#1e3a8a]">
                          {q.id}
                        </td>
                        <td className="px-3 py-2 font-bold text-slate-800">
                          {q.name}
                        </td>
                        <td className="px-3 py-2 text-slate-600 truncate max-w-[180px]" title={q.subject}>
                          {q.subject}
                        </td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            q.status === 'Resolved' 
                              ? 'bg-green-50 text-green-700 border border-green-200' 
                              : q.status === 'In Progress'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {q.status || 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing recent {recentQueries.length} of {queriesCount} queries</span>
            <Link to="/admin/add-query" className="text-amber-600 font-bold hover:underline flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">add_circle</span>
              Add Manual Entry
            </Link>
          </div>
        </div>

        {/* Right 5 Cols: System Health & Recent Error Logs */}
        <div className="lg:col-span-5 bg-white rounded-xl shadow-sm border border-slate-200/80 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600 text-lg">health_metrics</span>
                <h3 className="font-bold text-sm text-slate-800">System Diagnostics &amp; Health</h3>
              </div>
              <Link 
                to="/admin/app-errors" 
                className="text-xs font-bold text-red-600 hover:text-red-800 hover:underline flex items-center gap-1"
              >
                <span>Log Console ({errorsCount})</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </Link>
            </div>

            {/* Server Status Pill */}
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-700">API Server (Express / Port 5000)</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-green-700 bg-green-100 border border-green-200 px-2 py-0.5 rounded">
                ONLINE
              </span>
            </div>

            {/* Recent Errors List */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recent Error Exceptions</h4>
              {recentErrors.length === 0 ? (
                <div className="p-3 bg-green-50/60 border border-green-100 rounded-lg text-center text-xs text-green-700 font-semibold">
                  No system errors reported. API endpoints are functioning cleanly!
                </div>
              ) : (
                recentErrors.map((err) => (
                  <div key={err.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60 flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          err.level === 'Critical' ? 'bg-red-100 text-red-700 border border-red-200' :
                          err.level === 'Error' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {err.level}
                        </span>
                        <span className="font-bold text-xs text-slate-800 truncate">{err.source}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 truncate" title={err.message}>{err.message}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">{err.status || 'Logged'}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Critical Exceptions: <strong className="text-red-600">{criticalErrorsCount}</strong></span>
            <Link to="/admin/app-errors" className="text-blue-600 font-bold hover:underline">
              Inspect Full Error Log →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Administrative Operations Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <h3 className="text-xs font-bold text-[#1e3a8a] uppercase tracking-wider mb-3">
          Quick Management Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <Link 
            to="/admin/add-doctor"
            className="p-2.5 rounded-lg border border-slate-200/70 hover:border-amber-400 bg-slate-50 hover:bg-amber-50/40 flex items-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-amber-600 text-lg">person_add</span>
            <span className="text-xs font-bold text-slate-700">Add Doctor</span>
          </Link>

          <Link 
            to="/admin/add-service"
            className="p-2.5 rounded-lg border border-slate-200/70 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/40 flex items-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-blue-600 text-lg">add_task</span>
            <span className="text-xs font-bold text-slate-700">Create Service</span>
          </Link>

          <Link 
            to="/admin/add-speciality"
            className="p-2.5 rounded-lg border border-slate-200/70 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/40 flex items-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-indigo-600 text-lg">domain_add</span>
            <span className="text-xs font-bold text-slate-700">Add Speciality</span>
          </Link>

          <Link 
            to="/admin/hero-banners"
            className="p-2.5 rounded-lg border border-slate-200/70 hover:border-orange-400 bg-slate-50 hover:bg-orange-50/40 flex items-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-orange-600 text-lg">collections</span>
            <span className="text-xs font-bold text-slate-700">Hero Banners ({bannersCount})</span>
          </Link>

          <Link 
            to="/admin/add-news"
            className="p-2.5 rounded-lg border border-slate-200/70 hover:border-sky-400 bg-slate-50 hover:bg-sky-50/40 flex items-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-sky-600 text-lg">post_add</span>
            <span className="text-xs font-bold text-slate-700">Publish News ({newsCount})</span>
          </Link>

          <Link 
            to="/admin/settings"
            className="p-2.5 rounded-lg border border-slate-200/70 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 flex items-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-slate-600 text-lg">settings</span>
            <span className="text-xs font-bold text-slate-700">Hospital Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
