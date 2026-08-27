import React, { useState } from 'react';

const defaultGuides = [
  { id: 'pc-1', title: 'Patient Admission & Rights Policy', category: 'Inpatient Guide', updated: '2026-08-20', status: 'Published' },
  { id: 'pc-2', title: 'Visiting Hours & ICU Guidelines', category: 'Visitor Rules', updated: '2026-08-15', status: 'Published' },
  { id: 'pc-3', title: 'Insurance & Cashless Desk Procedure', category: 'Billing Help', updated: '2026-08-10', status: 'Published' }
];

const PatientsCorner = () => {
  const [guides, setGuides] = useState(defaultGuides);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Inpatient Guide');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title) return;
    const newGuide = {
      id: `pc-${Date.now()}`,
      title,
      category,
      updated: new Date().toISOString().split('T')[0],
      status: 'Published'
    };
    setGuides([newGuide, ...guides]);
    setTitle('');
    alert('Patient guide published successfully!');
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete patient information guide?")) {
      setGuides(guides.filter(g => g.id !== id));
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Patients Corner Management</h2>
          <p className="text-sm text-slate-500">Manage patient guidelines, admission rules, and downloadable resources</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-sm">Add Patient Guide / Information Notice</h3>
        <form onSubmit={handleAdd} className="flex gap-3 items-end text-xs">
          <div className="flex-1 space-y-1">
            <label className="font-bold text-slate-600">Guide Title</label>
            <input 
              type="text" 
              placeholder="e.g. Visitor Policy during Flu Season"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none"
            />
          </div>
          <div className="w-[200px] space-y-1">
            <label className="font-bold text-slate-600">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none cursor-pointer"
            >
              <option>Inpatient Guide</option>
              <option>Visitor Rules</option>
              <option>Billing Help</option>
              <option>Discharge Process</option>
            </select>
          </div>
          <button type="submit" className="bg-[#1e3a8a] text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-900">
            Publish Notice
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Last Updated</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {guides.map(g => (
              <tr key={g.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3 font-bold text-slate-800">{g.title}</td>
                <td className="px-4 py-3 font-medium text-slate-600">{g.category}</td>
                <td className="px-4 py-3 text-slate-400">{g.updated}</td>
                <td className="px-4 py-3">
                  <span className="bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded-full border border-green-200">
                    {g.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleDelete(g.id)} className="text-red-500 hover:text-red-700 font-bold">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientsCorner;
