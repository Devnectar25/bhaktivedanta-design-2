import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getNews, deleteNews, updateNews } from '../../../utils/api';
import { showConfirmDialog, showSuccessAlert, showErrorAlert } from '../../../utils/swal';

const defaultFallbackNews = [
  {
    id: 'NWS-301',
    title: 'Bhaktivedanta Hospital Awarded NABH Accreditation',
    date: '10 Oct, 2023',
    category: 'Achievements',
    status: 'Published',
    author: 'Quality Department',
    summary: 'We are proud to announce that our hospital has successfully received NABH accreditation.',
    content: 'We are proud to announce that our hospital has successfully received NABH accreditation, validating our standard clinical quality.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'NWS-302',
    title: 'New Pediatric ICU Wing Inaugurated',
    date: '05 Oct, 2023',
    category: 'Announcements',
    status: 'Published',
    author: 'Hospital Management',
    summary: 'A state-of-the-art Pediatric Intensive Care Unit with 12 beds has been inaugurated on the 3rd floor.',
    content: 'A state-of-the-art Pediatric Intensive Care Unit with 12 beds has been inaugurated on the 3rd floor by our Director.',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800'
  }
];

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  const navigate = useNavigate();

  const loadNewsData = async () => {
    setLoading(true);
    try {
      const data = await getNews(defaultFallbackNews);
      setNews(Array.isArray(data) ? data : defaultFallbackNews);
    } catch (err) {
      console.error('Failed to load news:', err);
      setNews(defaultFallbackNews);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNewsData();
  }, []);

  const handleDelete = async (id, title) => {
    const res = await showConfirmDialog(
      'Delete Announcement / News?',
      `Are you sure you want to delete "${title || id}"?`,
      'Yes, Delete Post'
    );
    if (res.isConfirmed) {
      try {
        await deleteNews(id);
        setNews(prev => prev.filter(n => n.id !== id));
        showSuccessAlert('Deleted!', 'Announcement deleted successfully.');
      } catch (err) {
        showErrorAlert('Error', 'Failed to delete announcement. Please try again.');
      }
    }
  };

  const handleToggleStatus = async (item) => {
    const nextStatus = item.status === 'Published' ? 'Draft' : 'Published';
    try {
      const updated = { ...item, status: nextStatus };
      await updateNews(item.id, updated);
      setNews(prev => prev.map(n => n.id === item.id ? updated : n));
      showSuccessAlert('Status Updated', `Announcement status changed to ${nextStatus}.`);
    } catch (err) {
      showErrorAlert('Error', 'Could not update announcement status.');
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories');
    setSelectedStatus('All Status');
  };

  const categories = ['All Categories', ...new Set(news.map(n => n.category).filter(Boolean))];

  const filtered = news.filter(n => {
    const searchTarget = `${n.title || ''} ${n.content || ''} ${n.summary || ''} ${n.author || ''}`.toLowerCase();
    const matchesSearch = searchTarget.includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || n.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All Status' || n.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPublished = news.filter(n => n.status === 'Published').length;
  const totalDrafts = news.filter(n => n.status === 'Draft').length;
  const totalAnnouncements = news.filter(n => n.category === 'Announcements').length;

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-slate-400 text-xs mb-1 font-medium">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-600 font-bold">News & Announcements</span>
          </nav>
          <h2 className="text-2xl font-bold text-slate-800">News & Announcements Desk</h2>
          <p className="text-sm text-slate-500 font-medium">Publish official hospital notices, department inaugurations, achievements, and updates.</p>
        </div>
        <Link 
          to="/admin/add-news" 
          className="flex items-center gap-2 bg-[#fea619] hover:bg-amber-500 text-slate-900 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95 w-fit"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          <span>Add News / Announcement</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Notices</p>
            <p className="text-2xl font-extrabold text-slate-800 mt-1">{news.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">campaign</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Published</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{totalPublished}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">check_circle</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Drafts</p>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">{totalDrafts}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">edit_note</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Announcements</p>
            <p className="text-2xl font-extrabold text-orange-600 mt-1">{totalAnnouncements}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">announcement</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex flex-wrap gap-4 items-end shadow-sm">
        <div className="flex-1 min-w-[220px] space-y-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase px-1">Search Announcements</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2 text-slate-400 text-lg">search</span>
            <input 
              type="text"
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 pl-9 pr-3 py-1.5 text-xs rounded-lg outline-none transition-all"
              placeholder="Search title, category, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="w-[180px] space-y-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase px-1">Category</label>
          <select 
            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="w-[150px] space-y-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase px-1">Status</label>
          <select 
            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All Status">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        <button 
          onClick={handleResetFilters}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-sm">restart_alt</span>
          <span>Reset</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-400 font-medium text-sm flex items-center justify-center gap-2">
            <span className="material-symbols-outlined animate-spin text-[#fea619]">progress_activity</span>
            <span>Loading news and announcements...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 mb-2">campaign</span>
            <h3 className="text-base font-bold text-slate-700">No announcements found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No entries match your search criteria or none have been published yet.
            </p>
            <button 
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-all"
            >
              Clear Search Filters
            </button>
          </div>
        ) : (
          <div className="w-full overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-3 w-[36%]">Announcement Title & Overview</th>
                  <th className="py-3 px-3 w-[15%]">Category</th>
                  <th className="py-3 px-3 w-[16%]">Issued By</th>
                  <th className="py-3 px-3 w-[13%]">Date & Time</th>
                  <th className="py-3 px-3 w-[10%]">Status</th>
                  <th className="py-3 px-3 w-[10%] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filtered.map((n) => (
                  <tr key={n.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 min-w-0">
                      <div className="flex items-center gap-3 min-w-0">
                        {n.image ? (
                          <img 
                            src={n.image} 
                            alt={n.title} 
                            className="w-12 h-9 object-cover rounded-lg border border-slate-200 flex-shrink-0 bg-slate-100"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-12 h-9 rounded-lg bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-lg">campaign</span>
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-slate-800 text-xs md:text-sm truncate leading-tight hover:text-orange-600 transition-colors" title={n.title}>
                            {n.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5" title={n.summary || n.content}>
                            {n.summary || n.content || 'No summary provided.'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border inline-block truncate max-w-[130px] ${
                        n.category === 'Announcements'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : n.category === 'Achievements'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {n.category || 'Announcements'}
                      </span>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap min-w-0">
                      <span className="font-semibold text-slate-700 truncate block" title={n.author || 'Hospital Management'}>
                        {n.author || 'Hospital Management'}
                      </span>
                      {n.authorRole && (
                        <span className="text-[10px] text-slate-400 block truncate" title={n.authorRole}>
                          {n.authorRole}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap text-slate-500">
                      <div className="text-[11px] font-medium text-slate-700">{n.date || 'Recent'}</div>
                      <div className="text-[10px] text-slate-400">{n.readTime || '3 min read'}</div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(n)}
                        title="Click to toggle publishing status"
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-all ${
                          n.status === 'Published'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${n.status === 'Published' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        <span>{n.status || 'Draft'}</span>
                      </button>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/patients-corner/announcements/${n.slug || n.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                          title="View on Live Website"
                        >
                          <span className="material-symbols-outlined text-base">visibility</span>
                        </Link>
                        <button
                          onClick={() => navigate(`/admin/add-news?edit=${n.id}`)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit Announcement"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(n.id, n.title)}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Delete Announcement"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
