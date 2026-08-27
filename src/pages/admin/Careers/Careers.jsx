import React, { useState } from 'react';

const Careers = () => {
  const [openings, setOpenings] = useState([
    { id: 'car-1', title: 'Consultant Cardiologist', department: 'Cardiology', openings: '2 Posts', experience: '5+ Years', status: 'Active' },
    { id: 'car-2', title: 'Senior Staff Nurse (ICU)', department: 'Nursing', openings: '8 Posts', experience: '2+ Years', status: 'Active' },
    { id: 'car-3', title: 'Lab Technician (Pathology)', department: 'Diagnostics', openings: '3 Posts', experience: '1+ Year', status: 'Active' }
  ]);

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Careers &amp; Job Openings</h2>
        <p className="text-sm text-slate-500">Manage hospital job postings, doctor recruitment, and nursing vacancies</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
            <tr>
              <th className="px-4 py-3">Job Role Title</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Vacancies</th>
              <th className="px-4 py-3">Experience</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {openings.map(o => (
              <tr key={o.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3 font-bold text-slate-800">{o.title}</td>
                <td className="px-4 py-3 text-slate-600 font-medium">{o.department}</td>
                <td className="px-4 py-3 font-bold text-amber-600">{o.openings}</td>
                <td className="px-4 py-3 text-slate-500">{o.experience}</td>
                <td className="px-4 py-3"><span className="bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded-full border border-green-200">{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Careers;
