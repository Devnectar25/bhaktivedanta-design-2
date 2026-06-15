import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  initialDoctors, 
  initialAppointments, 
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
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [testimonialsCount, setTestimonialsCount] = useState(0);
  const [newsCount, setNewsCount] = useState(0);
  const [galleryCount, setGalleryCount] = useState(0);
  const [specialitiesCount, setSpecialitiesCount] = useState(0);

  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    Promise.all([
      initialDoctors(),
      initialAppointments(),
      initialEvents(),
      initialTestimonials(),
      initialNews(),
      initialGallery(),
      getSpecialitiesState(defaultSpecialitiesState)
    ]).then(([docs, apts, evts, tests, nws, gal, specsState]) => {
      setDoctorsCount(docs.length);
      setAppointmentsCount(apts.length);
      setRecentAppointments(apts.slice(0, 3));
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
      action: "Updated Dr. Sharma's availability",
      user: 'Admin. Rajesh',
      userImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTBA4LrDYeKBfibOaNGGYbilb9Fb8I5YV2R3DdMGndMP8xLcxSKgCxZ512fDAHESzr5YzJrYJ2KrBuZmpmNd17ZnadDIn0hIH65nIVEkqTRuGg4paTiGNfnTzXDLgYFWLMhaCgfjmMLixMqNEtlw00g17Mmgao7n4-oCjaaB5JqwCzpFW7e7jtbXVw4jwhKYbz3aumMZ9hzWS_2WyGnJ9sktoesMXutYAHqW99s58GZkkBme6YzP5i3KllRazvqEgLjjgmHdB0zeA',
      status: 'Success'
    },
    {
      dateTime: '24 Jun, 09:15 AM',
      action: 'Added "Cardiac Wellness" Package',
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
            <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[10px] font-bold">+12%</span>
          </div>
          <p className="text-slate-400 text-xs uppercase tracking-wide font-semibold">Total Doctors</p>
          <h3 className="mt-1 font-bold text-2xl text-slate-800">{doctorsCount}</h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-[4px_4px_15px_rgba(30,58,138,0.04)] border border-slate-200/50 hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 rounded-lg text-[#d97706]">
              <span className="material-symbols-outlined font-fill">medical_services</span>
            </div>
            <span className="text-blue-800 bg-blue-100 px-2 py-0.5 rounded text-[10px] font-bold">Stable</span>
          </div>
          <p className="text-slate-400 text-xs uppercase tracking-wide font-semibold">Total Services</p>
          <h3 className="mt-1 font-bold text-2xl text-slate-800">86</h3>
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
            <div className="p-3 bg-red-50 rounded-lg text-red-600">
              <span className="material-symbols-outlined font-fill">calendar_today</span>
            </div>
            <span className="text-red-800 bg-red-100 px-2 py-0.5 rounded text-[10px] font-bold">Active</span>
          </div>
          <p className="text-slate-400 text-xs uppercase tracking-wide font-semibold">Appointments</p>
          <h3 className="mt-1 font-bold text-2xl text-slate-800">{appointmentsCount}</h3>
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

        <div className="bg-white p-5 rounded-xl shadow-[4px_4px_15px_rgba(30,58,138,0.04)] border border-slate-200/50 hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-pink-50 rounded-lg text-pink-600">
              <span className="material-symbols-outlined font-fill">reviews</span>
            </div>
          </div>
          <p className="text-slate-400 text-xs uppercase tracking-wide font-semibold">Testimonials</p>
          <h3 className="mt-1 font-bold text-2xl text-slate-800">{testimonialsCount}</h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-[4px_4px_15px_rgba(30,58,138,0.04)] border border-slate-200/50 hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-100 rounded-lg text-slate-600">
              <span className="material-symbols-outlined font-fill">image</span>
            </div>
          </div>
          <p className="text-slate-400 text-xs uppercase tracking-wide font-semibold">Gallery Images</p>
          <h3 className="mt-1 font-bold text-2xl text-slate-800">{galleryCount}</h3>
        </div>
      </section>

      {/* Monthly Trends and Department Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-[4px_4px_15px_rgba(30,58,138,0.04)] border border-slate-200/50">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-lg font-bold text-[#1e3a8a]">Monthly Appointment Trends</h4>
              <p className="text-xs text-slate-400">Visual representation of patient visits over the last 6 months</p>
            </div>
            <select className="border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#1e3a8a]/20 transition-all px-3 py-1 text-xs rounded-lg outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[250px] w-full flex items-end justify-between gap-4 px-2">
            <div className="w-1/6 bg-blue-100 rounded-t-lg relative group transition-all" style={{ height: '40%' }}>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">420</div>
            </div>
            <div className="w-1/6 bg-blue-200 rounded-t-lg relative group transition-all" style={{ height: '65%' }}>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">680</div>
            </div>
            <div className="w-1/6 bg-blue-300 rounded-t-lg relative group transition-all" style={{ height: '55%' }}>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">590</div>
            </div>
            <div className="w-1/6 bg-blue-400 rounded-t-lg relative group transition-all" style={{ height: '85%' }}>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">910</div>
            </div>
            <div className="w-1/6 bg-blue-600 rounded-t-lg relative group transition-all" style={{ height: '75%' }}>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">820</div>
            </div>
            <div className="w-1/6 bg-[#fea619] rounded-t-lg relative group transition-all" style={{ height: '95%' }}>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">1,208</div>
            </div>
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-3 px-2 font-medium">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-[4px_4px_15px_rgba(30,58,138,0.04)] border border-slate-200/50 flex flex-col">
          <h4 className="text-lg font-bold text-[#1e3a8a] mb-1">Department Distribution</h4>
          <p className="text-xs text-slate-400 mb-6">Staff allocation by expertise</p>
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="relative w-40 h-40 rounded-full border-[12px] border-blue-600 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[12px] border-amber-500 border-t-transparent border-l-transparent border-b-transparent rotate-45"></div>
              <div className="text-center">
                <p className="text-xl font-bold text-slate-800">{doctorsCount}</p>
                <p className="text-[10px] text-slate-400 font-bold">Total Doctors</p>
              </div>
            </div>
            <div className="mt-6 w-full space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <span className="font-semibold text-slate-600">Cardiology</span>
                </div>
                <span className="font-bold text-slate-700">34%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="font-semibold text-slate-600">Pediatrics</span>
                </div>
                <span className="font-bold text-slate-700">28%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                  <span className="font-semibold text-slate-600">Others</span>
                </div>
                <span className="font-bold text-slate-700">38%</span>
              </div>
            </div>
          </div>
        </div>
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

      {/* Incoming Appointments Section */}
      <section className="bg-white p-5 rounded-xl shadow-[4px_4px_15px_rgba(30,58,138,0.04)] border border-slate-200/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h4 className="text-base font-bold text-[#1e3a8a]">Incoming Appointments</h4>
            <p className="text-xs text-slate-400">Manage and assign new patient requests</p>
          </div>
          <Link to="/admin/appointments" className="bg-[#fea619] hover:bg-amber-500 text-slate-900 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm">
            View All Appointments
          </Link>
        </div>
        <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-slate-500 font-bold uppercase">
                <th className="px-4 py-3">Patient Name</th>
                <th className="px-4 py-3">Doctor Assigned</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Date &amp; Time</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentAppointments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-slate-400 font-medium">No recent appointments.</td>
                </tr>
              ) : (
                recentAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-800">{apt.patientName}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">ID: {apt.id}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-600">{apt.doctorName}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[10px] font-bold border border-blue-100">
                        {apt.department}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{apt.dateTime}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        apt.status === 'Completed' || apt.status === 'Confirmed'
                          ? 'bg-green-50 text-green-600 border border-green-100'
                          : apt.status === 'Cancelled'
                          ? 'bg-red-50 text-red-600 border border-red-100'
                          : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
