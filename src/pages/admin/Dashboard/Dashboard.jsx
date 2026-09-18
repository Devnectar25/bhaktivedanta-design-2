import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  initialDoctors, 
  initialEvents, 
  initialTestimonials, 
  initialNews, 
  initialGallery 
} from '../../../data/adminState';
import { defaultSpecialitiesState } from '../../../data/defaultSpecialities';
import { getSpecialitiesState } from '../../../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();

  // Load actual state lengths
  const [doctorsCount, setDoctorsCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [testimonialsCount, setTestimonialsCount] = useState(0);
  const [newsCount, setNewsCount] = useState(0);
  const [galleryCount, setGalleryCount] = useState(0);
  const [specialitiesCount, setSpecialitiesCount] = useState(0);

  useEffect(() => {
    Promise.all([
      initialDoctors(),
      initialEvents(),
      initialTestimonials(),
      initialNews(),
      initialGallery(),
      getSpecialitiesState(defaultSpecialitiesState)
    ]).then(([docs, evts, tests, nws, gal, specsState]) => {
      setDoctorsCount(docs.length);
      setEventsCount(evts.length);
      setTestimonialsCount(tests.length);
      setNewsCount(nws.length);
      setGalleryCount(gal.length);
      if (specsState && specsState.specialities) {
        setSpecialitiesCount(specsState.specialities.length);
      } else {
        setSpecialitiesCount(defaultSpecialitiesState.specialities.length);
      }
    }).catch(err => {
      console.error('Error loading dashboard stats:', err);
    });
  }, []);

  const [systemLogs] = useState([
    {
      dateTime: '24 Jun, 10:24 AM',
      action: "Updated Dr. Kshama Shah's availability",
      user: 'Admin. Rajesh',
      userImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTBA4LrDYeKBfibOaNGGYbilb9Fb8I5YV2R3DdMGndMP8xLcxSKgCxZ512fDAHESzr5YzJrYJ2KrBuZmpmNd17ZnadDIn0hIH65nIVEkqTRuGg4paTiGNfnTzXDLgYFWLMhaCgfjmMLixMqNEtlw00g17Mmgao7n4-oCjaaB5JqwCzpFW7e7jtbXVw4jwhKYbz3aumMZ9hzWS_2WyGnJ9sktoesMXutYAHqW99s58GZkkBme6YzP5i3KllRazvqEgLjjgmHdB0zeA',
      status: 'Success'
    },
    {
      dateTime: '24 Jun, 09:15 AM',
      action: 'Added "Cardiac Wellness" Speciality',
      user: 'Admin. Sneha',
      userImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqH_SwvrfMu907W25LQYSlf9K53vJpZDvk_tAY80FcAt4Sq5jjrVveVrTjRq--EA6WcZQCEjnHnqV9WpHB4rzyFNCG3JFyiTljqOUbXNar0alBZr8DladMa2lztVZExnQPi8j_3tR9OpRcYl3NFHNbNIC5hDSwOB-q6KCQfJLvjnZLjWLG-ct3zVM0VAJ6R649qc-NmV4EyXARU1HOwj4zuocRVivcZRsMZw4s3dR8VtC0dgbi3eQVgzZ9zxqIdes3uvm_-ORW87A',
      status: 'Success'
    },
    {
      dateTime: '23 Jun, 05:45 PM',
      action: 'Gallery bulk upload (24 items)',
      user: 'Admin. Amit',
      userImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5lo0M9TBxsSuVJ8Or4QNwK3PCBKHT2PQ9EInNalIvAQrIngHwrz_FcXQe4hn_vZthqwZLVdWfuho5YBB0l-JOBNGKtV37gNmcRtXfw4SCunUCxxLRSne9k-YqSaBctZhpKtRClADeJla1cnsNvrdgxgmCVoGSnuTd2f-1Pt2qxhVV-4aAqjI32fhgUkJAJfnPts4x2Ns5Pr5H-QH3ZF2srEWIPl19fg1o9YKqGFn417t2fcpmF95JQg7onQJRy7T2uPQ0nLrXqaY',
      status: 'Processing'
    }
  ]);

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-[4px_4px_15px_rgba(30,58,138,0.04)] border border-slate-200/50 hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-lg text-[#1e3a8a]">
              <span className="material-symbols-outlined font-fill">group</span>
            </div>
            <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[10px] font-bold">165 Live</span>
          </div>
          <p className="text-slate-400 text-xs uppercase tracking-wide font-semibold">Total Doctors</p>
          <h3 className="mt-1 font-bold text-2xl text-slate-800">{doctorsCount}</h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-[4px_4px_15px_rgba(30,58,138,0.04)] border border-slate-200/50 hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
              <span className="material-symbols-outlined font-fill">star</span>
            </div>
            <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[10px] font-bold">Live</span>
          </div>
          <p className="text-slate-400 text-xs uppercase tracking-wide font-semibold">Specialities</p>
          <h3 className="mt-1 font-bold text-2xl text-slate-800">{specialitiesCount}</h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-[4px_4px_15px_rgba(30,58,138,0.04)] border border-slate-200/50 hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-sky-50 rounded-lg text-sky-600">
              <span className="material-symbols-outlined font-fill">newspaper</span>
            </div>
          </div>
          <p className="text-slate-400 text-xs uppercase tracking-wide font-semibold">Total News</p>
          <h3 className="mt-1 font-bold text-2xl text-slate-800">{newsCount}</h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-[4px_4px_15px_rgba(30,58,138,0.04)] border border-slate-200/50 hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 rounded-lg text-orange-500">
              <span className="material-symbols-outlined font-fill">event</span>
            </div>
          </div>
          <p className="text-slate-400 text-xs uppercase tracking-wide font-semibold">Total Events</p>
          <h3 className="mt-1 font-bold text-2xl text-slate-800">{eventsCount}</h3>
        </div>
      </section>

      {/* External Portals Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a 
          href="https://www.bhaktivedantahospital.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-blue-900 to-indigo-900 p-6 rounded-xl shadow-md text-white flex items-center justify-between hover:opacity-95 transition-opacity"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400">calendar_month</span>
              <h4 className="text-lg font-bold">Book Appointment Portal</h4>
            </div>
            <p className="text-xs text-blue-200">Patient appointments and scheduling are managed on the official external portal.</p>
          </div>
          <span className="material-symbols-outlined text-2xl text-amber-400">open_in_new</span>
        </a>

        <a 
          href="https://www.bhaktivedantahospital.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-xl shadow-md text-white flex items-center justify-between hover:opacity-95 transition-opacity"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-green-400">analytics</span>
              <h4 className="text-lg font-bold">Patient Report Portal</h4>
            </div>
            <p className="text-xs text-slate-300">Access and download diagnostic lab and patient reports on the external portal.</p>
          </div>
          <span className="material-symbols-outlined text-2xl text-green-400">open_in_new</span>
        </a>
      </div>

      {/* Quick Actions & Recent Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 bg-slate-50 p-5 rounded-xl border border-slate-200/60">
          <h4 className="text-xs font-bold text-[#1e3a8a] uppercase tracking-widest mb-4">Quick Actions</h4>
          <div className="flex flex-col gap-2">
            <Link to="/admin/add-doctor" className="flex items-center gap-3 bg-[#fea619] hover:bg-amber-500 hover:shadow text-slate-900 px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm">
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>Add New Doctor</span>
            </Link>
            <Link to="/admin/add-service" className="flex items-center gap-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm">
              <span className="material-symbols-outlined text-amber-500 text-[18px]">add_task</span>
              <span>Create Service</span>
            </Link>
            <Link to="/admin/add-news" className="flex items-center gap-3 bg-[#fea619] hover:bg-amber-500 hover:shadow text-slate-900 px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm">
              <span className="material-symbols-outlined text-[18px]">post_add</span>
              <span>Publish News</span>
            </Link>
            <Link to="/admin/add-event" className="flex items-center gap-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm">
              <span className="material-symbols-outlined text-red-500 text-[18px]">event_note</span>
              <span>Setup Event</span>
            </Link>
            <Link to="/admin/add-gallery-media" className="flex items-center gap-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm">
              <span className="material-symbols-outlined text-slate-500 text-[18px]">cloud_upload</span>
              <span>Upload to Gallery</span>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white p-5 rounded-xl shadow-[4px_4px_15px_rgba(30,58,138,0.04)] border border-slate-200/50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-base font-bold text-[#1e3a8a]">System Log</h4>
            <span className="text-xs text-[#d97706] font-semibold">Live System Logs</span>
          </div>
          <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-slate-500 font-bold uppercase tracking-wider">
                  <th className="px-4 py-3">Date &amp; Time</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Admin User</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {systemLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium whitespace-nowrap">{log.dateTime}</td>
                    <td className="px-4 py-3">{log.action}</td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <img alt={log.user} className="w-5 h-5 rounded-full object-cover border border-slate-100" src={log.userImg} />
                      <span className="font-semibold">{log.user}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.status === 'Success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
