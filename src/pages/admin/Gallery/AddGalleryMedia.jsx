import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initialGallery, saveGallery } from '../../../data/adminState';

const AddGalleryMedia = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Infrastructure');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('Active');

  const [galleryList, setGalleryList] = useState([]);

  useEffect(() => {
    initialGallery().then(list => setGalleryList(list));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !imageUrl) {
      alert("Please fill in all fields (Title, Image URL).");
      return;
    }

    const newItem = {
      id: `GAL-${Date.now().toString().substring(8)}`,
      title,
      category,
      imageUrl,
      status
    };

    const updatedList = [newItem, ...galleryList];
    saveGallery(updatedList);
    navigate('/admin/gallery');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-slate-400 text-xs mb-2 font-medium font-sans">
        <span>Dashboard</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span>Gallery</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-slate-600 font-bold">Add Media</span>
      </nav>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Upload Gallery Media</h2>
        <p className="text-sm text-slate-500 font-medium font-sans">Add photos representing hospital infrastructure, technology, or social outreach events.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 text-xs text-slate-700 font-sans">
        <div className="space-y-1">
          <label className="font-bold text-slate-500 uppercase">Media Title *</label>
          <input 
            type="text" 
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
            placeholder="e.g. Main Hospital Building"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase">Category Tag</label>
            <select 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium cursor-pointer"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Infrastructure">Infrastructure</option>
              <option value="Technology">Technology</option>
              <option value="Events">Events</option>
              <option value="Community">Community</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase">Media Status</label>
            <select 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium cursor-pointer"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-500 uppercase">Image URL *</label>
          <input 
            type="text" 
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
            placeholder="https://images.unsplash.com/..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button 
            type="button" 
            onClick={() => navigate('/admin/gallery')} 
            className="px-5 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 font-semibold"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="bg-[#fea619] hover:bg-amber-500 text-slate-900 px-6 py-2 rounded-lg font-bold transition-all shadow-sm"
          >
            Publish Media
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddGalleryMedia;
