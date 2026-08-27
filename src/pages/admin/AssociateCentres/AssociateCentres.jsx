import React, { useState } from 'react';

const AssociateCentres = () => {
  const [centres, setCentres] = useState([
    { id: 'ac-1', name: 'Bhaktivedanta Health Centre - Mira Road East', location: 'Mira Road, Thane', type: 'Satellite OPD', contact: '+91 22 2945 2500', status: 'Active' },
    { id: 'ac-2', name: 'Bhaktivedanta Mobile Medical Unit Unit 1', location: 'Palghar District', type: 'Rural Outreach', contact: '+91 98200 12345', status: 'Active' }
  ]);

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Our Associate Centres</h2>
        <p className="text-sm text-slate-500">Manage satellite clinics, rural outreach units, and affiliated diagnostic centers</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
            <tr>
              <th className="px-4 py-3">Centre Name</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Centre Type</th>
              <th className="px-4 py-3">Contact Desk</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {centres.map(c => (
              <tr key={c.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3 font-bold text-slate-800">{c.name}</td>
                <td className="px-4 py-3 text-slate-600 font-medium">{c.location}</td>
                <td className="px-4 py-3 text-slate-500">{c.type}</td>
                <td className="px-4 py-3 font-mono">{c.contact}</td>
                <td className="px-4 py-3"><span className="bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded-full border border-green-200">{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssociateCentres;
