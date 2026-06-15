import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { initialNews, saveNews } from '../../../data/adminState';

const AddNews = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Announcements');
  const [status, setStatus] = useState('Published');
  const [content, setContent] = useState('');

  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    initialNews().then(list => {
      setNewsList(list);

      if (editId) {
        const match = list.find(n => n.id === editId);
        if (match) {
          setTitle(match.title || '');
          setCategory(match.category || 'Announcements');
          setStatus(match.status || 'Published');
          setContent(match.content || '');
        }
      }
    });
  }, [editId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Please fill in the required fields (Title and News Content).");
      return;
    }

    let updatedList;
    if (editId) {
      updatedList = newsList.map(n => {
        if (n.id === editId) {
          return {
            ...n,
            title,
            category,
            status,
            content
          };
        }
        return n;
      });
    } else {
      const newPost = {
        id: `NWS-${Date.now().toString().substring(8)}`,
        title,
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        category,
        status,
        content
      };
      updatedList = [newPost, ...newsList];
    }

    saveNews(updatedList);
    navigate('/admin/news');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-slate-400 text-xs mb-2 font-medium font-sans">
        <span>Dashboard</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span>News</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-slate-600 font-bold">{editId ? 'Edit News Post' : 'Add News Post'}</span>
      </nav>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{editId ? 'Edit News Post' : 'Add News Desk Post'}</h2>
        <p className="text-sm text-slate-500 font-medium font-sans">Configure announcements, achievements, or health updates for patients.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 text-xs text-slate-700 font-sans">
        <div className="space-y-1">
          <label className="font-bold text-slate-500 uppercase">News Title *</label>
          <input 
            type="text" 
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
            placeholder="e.g. New Pediatric ICU Wing Inaugurated"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase">Category</label>
            <select 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium cursor-pointer"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Announcements">Announcements</option>
              <option value="Achievements">Achievements</option>
              <option value="Updates">Updates</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase">Publishing Status</label>
            <select 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium cursor-pointer"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-500 uppercase">News Desk Content *</label>
          <textarea 
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
            placeholder="Describe the announcements details..."
            rows="6"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button 
            type="button" 
            onClick={() => navigate('/admin/news')} 
            className="px-5 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 font-semibold"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="bg-[#fea619] hover:bg-amber-500 text-slate-900 px-6 py-2 rounded-lg font-bold transition-all shadow-sm"
          >
            {editId ? 'Save News' : 'Publish News'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNews;
