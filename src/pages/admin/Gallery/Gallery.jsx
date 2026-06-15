import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { initialGallery, saveGallery } from '../../../data/adminState';

const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const navigate = useNavigate();

  useEffect(() => {
    setGallery(initialGallery());
  }, []);

  const saveAndSetGallery = (newGallery) => {
    setGallery(newGallery);
    saveGallery(newGallery);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this media item?")) {
      const updated = gallery.filter(item => item.id !== id);
      saveAndSetGallery(updated);
    }
  };

  const filtered = gallery.filter(item => {
    return selectedCategory === 'All' || item.category === selectedCategory;
  });

  const categories = ['All', 'Infrastructure', 'Technology', 'Events', 'Community'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-slate-400 text-xs mb-1 font-medium">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-600 font-bold">Gallery</span>
          </nav>
          <h2 className="text-2xl font-bold text-slate-800">Gallery Management</h2>
          <p className="text-sm text-slate-500 font-medium">Manage hospital infrastructure, diagnostic technology, and social event media photos.</p>
        </div>
        <Link
          to="/admin/add-gallery-media"
          className="flex items-center gap-2 bg-[#fea619] hover:bg-amber-500 text-slate-900 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">cloud_upload</span>
          <span>Upload Media</span>
        </Link>
      </div>

      {/* Categories Filtering Pills */}
      <div className="flex flex-wrap gap-2 pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedCategory === cat
                ? 'bg-[#1e3a8a] text-white'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Media Items */}
      {filtered.length === 0 ? (
        <div className="bg-white p-8 text-center text-slate-400 font-medium rounded-xl border border-slate-200/50">
          No media items found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col group">
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-50 relative">
                <img
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                  src={item.imageUrl}
                />
                <span className="absolute top-2 left-2 bg-[#1e3a8a] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">
                  {item.category}
                </span>
              </div>
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs truncate leading-snug" title={item.title}>
                    {item.title}
                  </h4>
                  <p className="text-[9px] text-slate-400 font-bold mt-0.5">ID: {item.id}</p>
                </div>
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${item.status === 'Active'
                      ? 'bg-green-50 text-green-600 border border-green-100'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}>
                    {item.status || 'Active'}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-6 h-6 rounded bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 flex items-center justify-center transition-all"
                      title="Delete Image"
                    >
                      <span className="material-symbols-outlined text-[14px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
