import React, { useState } from 'react';

const EducationResearch = () => {
  const [courses, setCourses] = useState([
    { id: 'er-1', title: 'DNB Residency Program in Anesthesiology', department: 'Academic Medicine', duration: '3 Years', seats: '4 Seats', status: 'Enrolling' },
    { id: 'er-2', title: 'Fellowship in Critical Care Nursing', department: 'Nursing College', duration: '1 Year', seats: '10 Seats', status: 'Enrolling' }
  ]);

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Education &amp; Medical Research</h2>
        <p className="text-sm text-slate-500">Manage DNB courses, clinical research programs, and medical fellowships</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
            <tr>
              <th className="px-4 py-3">Course / Research Title</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Available Seats</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {courses.map(c => (
              <tr key={c.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3 font-bold text-slate-800">{c.title}</td>
                <td className="px-4 py-3 font-medium text-slate-600">{c.department}</td>
                <td className="px-4 py-3 text-slate-500">{c.duration}</td>
                <td className="px-4 py-3 font-bold text-blue-700">{c.seats}</td>
                <td className="px-4 py-3"><span className="bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded-full border border-green-200">{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EducationResearch;
