import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { initialNews, saveNews } from '../../../data/adminState';

const News = () => {
  const [news, setNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  const navigate = useNavigate();

  useEffect(() => {
    initialNews().then(data => setNews(data));
  }, []);

  const saveAndSetNews = (newNews) => {
    setNews(newNews);
    saveNews(newNews);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this news post?")) {
      const updated = news.filter(n => n.id !== id);
      saveAndSetNews(updated);
    }
  };

  const handleToggleStatus = (id) => {
    const updated = news.map(n => {
      if (n.id === id) {
        const nextStatus = n.status === 'Published' ? 'Draft' : 'Published';
        return { ...n, status: nextStatus };
      }
      return n;
    });
    saveAndSetNews(updated);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('All Status');
  };

  const filtered = news.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          n.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All Status' || n.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-slate-400 text-xs mb-1 font-medium">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-600 font-bold">News</span>
          </nav>
          <h2 className="text-2xl font-bold text-slate-800">News Management</h2>
          <p className="text-sm text-slate-500 font-medium">Publish announcements, press releases, and articles on the hospital news desk.</p>
        </div>
        <Link 
          to="/admin/add-news" 
          className="flex items-center gap-2 bg-[#fea619] hover:bg-amber-500 text-slate-900 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          <span>Add News Post</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Search News</label>
          <input 
            type="text"
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none"
            placeholder="Search title, category, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-[180px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Status</label>
          <select 
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
          </select>
        </div>
        <button 
          onClick={handleResetFilters}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-bold transition-all"
        >
          Reset
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-slate-500 font-bold uppercase">
              <th className="px-4 py-3">News ID</th>
              <th className="px-4 py-3">Title Details</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Published Date</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-slate-400 font-medium">No news posts found.</td>
              </tr>
            ) : (
              filtered.map((n) => (
                <tr key={n.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-bold text-[#1e3a8a]">{n.id}</td>
                  <td className="px-4 py-3 max-w-sm">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-sm leading-snug">{n.title}</span>
                      <span className="text-[10px] text-slate-400 font-semibold line-clamp-1 mt-0.5">{n.content}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-700">{n.category}</td>
                  <td className="px-4 py-3 text-slate-500 font-medium">{n.date || '15 Jun, 2026'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      n.status === 'Published'
                        ? 'bg-green-50 text-green-600 border border-green-100'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}>
                      {n.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button 
                        onClick={() => handleToggleStatus(n.id)}
                        className={`w-7 h-7 rounded flex items-center justify-center border transition-all ${
                          n.status === 'Published'
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-600 border-amber-200'
                            : 'bg-green-50 hover:bg-green-100 text-green-600 border-green-200'
                        }`}
                        title={n.status === 'Published' ? 'Revert to Draft' : 'Publish'}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {n.status === 'Published' ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                      <button 
                        onClick={() => navigate(`/admin/add-news?edit=${n.id}`)}
                        className="w-7 h-7 rounded bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center transition-all"
                        title="Edit Post"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(n.id)}
                        className="w-7 h-7 rounded bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 flex items-center justify-center transition-all"
                        title="Delete Post"
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

export default News;
