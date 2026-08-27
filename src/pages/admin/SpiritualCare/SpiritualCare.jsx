import React, { useState } from 'react';

const SpiritualCare = () => {
  const [programs, setPrograms] = useState([
    { id: 'sc-1', title: 'Daily Prayer & Chanting Support', Timing: 'Every Morning 7:30 AM', Counselor: 'Dr. H. G. Damodara Das', status: 'Active' },
    { id: 'sc-2', title: 'Patient & Family Spiritual Counseling', Timing: 'On Request (24/7)', Counselor: 'Spiritual Care Wing Team', status: 'Active' }
  ]);
  const [title, setTitle] = useState('');
  const [counselor, setCounselor] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title) return;
    setPrograms([...programs, { id: `sc-${Date.now()}`, title, Timing: 'Daily OPD Hours', Counselor: counselor || 'Spiritual Care Team', status: 'Active' }]);
    setTitle('');
    setCounselor('');
    alert('Spiritual Care program added.');
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Spiritual Care Management</h2>
        <p className="text-sm text-slate-500">Manage holistic healing initiatives, spiritual counselors, and daily prayer schedules</p>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-3 text-xs">
        <h3 className="font-bold text-slate-800">Add Spiritual Care Program</h3>
        <form onSubmit={handleAdd} className="flex gap-3 items-end">
          <input 
            type="text" 
            placeholder="Program Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 outline-none"
          />
          <input 
            type="text" 
            placeholder="Counselor Name" 
            value={counselor} 
            onChange={(e) => setCounselor(e.target.value)} 
            className="w-[200px] border border-slate-300 rounded-lg px-3 py-2 outline-none"
          />
          <button type="submit" className="bg-[#1e3a8a] text-white px-5 py-2 rounded-lg font-bold">Add Program</button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
            <tr>
              <th className="px-4 py-3">Program Title</th>
              <th className="px-4 py-3">Counselor / Lead</th>
              <th className="px-4 py-3">Timing</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {programs.map(p => (
              <tr key={p.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3 font-bold text-slate-800">{p.title}</td>
                <td className="px-4 py-3 text-slate-600 font-medium">{p.Counselor}</td>
                <td className="px-4 py-3 text-slate-400">{p.Timing}</td>
                <td className="px-4 py-3"><span className="bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded-full border border-green-200">{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpiritualCare;
