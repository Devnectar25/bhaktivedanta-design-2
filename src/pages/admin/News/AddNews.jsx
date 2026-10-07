import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, useParams, Link } from 'react-router-dom';
import { getNews, addNews, updateNews, uploadPatientCornerImage } from '../../../utils/api';
import RichTextEditor from '../../../components/admin/RichTextEditor/RichTextEditor';
import { showSuccessAlert, showErrorAlert } from '../../../utils/swal';

const SAMPLE_ANNOUNCEMENT_IMAGES = [
  { label: 'Hospital Building / Center', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800' },
  { label: 'State-of-the-art ICU / Facility', url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800' },
  { label: 'Advanced Medical Diagnostics', url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800' },
  { label: 'Healthcare Team & Doctors', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800' },
  { label: 'Super-Speciality Care / Technology', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800' },
];

const CATEGORIES = [
  'Announcements',
  'Achievements',
  'Inaugurations',
  'Updates',
  'Public Notices',
  'Press Releases',
  'Events',
  'Clinical Milestones'
];

const AddNews = ({ mode = 'add' }) => {
  const [searchParams] = useSearchParams();
  const { id: paramId } = useParams();
  const editId = paramId || searchParams.get('edit');
  const navigate = useNavigate();
  const isEdit = mode === 'edit' || Boolean(editId);
  const fileInputRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Announcements',
    customCategory: '',
    author: 'Hospital Management',
    authorRole: 'Medical Directorate',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
    summary: '',
    content: '',
    tagsStr: 'Announcements, Hospital News',
    status: 'Published',
    views: 0
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editId) {
      const fetchNewsItem = async () => {
        setLoading(true);
        try {
          const list = await getNews([]);
          const match = Array.isArray(list) ? list.find(n => n.id === editId) : null;
          if (match) {
            setFormData({
              title: match.title || '',
              slug: match.slug || (match.title ? match.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : ''),
              category: CATEGORIES.includes(match.category) ? match.category : (match.category ? 'Other' : 'Announcements'),
              customCategory: CATEGORIES.includes(match.category) ? '' : (match.category || ''),
              author: match.author || 'Hospital Management',
              authorRole: match.authorRole || 'Medical Directorate',
              date: match.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              readTime: match.readTime || '3 min read',
              image: match.image || '',
              summary: match.summary || '',
              content: match.content || '',
              tagsStr: Array.isArray(match.tags) ? match.tags.join(', ') : (match.tags || 'Announcements, Hospital News'),
              status: match.status || 'Published',
              views: match.views || 0
            });
          }
        } catch (err) {
          console.error('Error fetching announcement details:', err);
          showErrorAlert('Error', 'Could not load announcement details.');
        } finally {
          setLoading(false);
        }
      };
      fetchNewsItem();
    }
  }, [editId]);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData(prev => ({
      ...prev,
      title: val,
      slug: prev.slug === '' || prev.slug === generatedSlug.substring(0, prev.slug.length) ? generatedSlug : prev.slug
    }));
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const uploadedUrl = await uploadPatientCornerImage(file, 'announcements');
      if (uploadedUrl) {
        setFormData(prev => ({ ...prev, image: uploadedUrl }));
        showSuccessAlert('Image Uploaded', 'Announcement image uploaded and stored in Supabase Storage.');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      showErrorAlert('Upload Error', err.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e, targetStatus = formData.status) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!formData.title.trim()) {
      showErrorAlert('Validation Error', 'Please enter a title for the announcement.');
      return;
    }

    setSubmitting(true);
    const finalCategory = formData.category === 'Other' ? (formData.customCategory || 'Announcements') : formData.category;
    const tags = formData.tagsStr.split(',').map(t => t.trim()).filter(Boolean);

    const payload = {
      ...formData,
      category: finalCategory,
      tags,
      status: targetStatus,
      id: isEdit ? editId : `NWS-${Date.now().toString().substring(8)}`
    };

    try {
      if (isEdit) {
        await updateNews(editId, payload);
        await showSuccessAlert('Updated!', `Announcement "${formData.title}" updated successfully.`);
      } else {
        await addNews(payload);
        await showSuccessAlert('Published!', `Announcement "${formData.title}" published successfully.`);
      }
      navigate('/admin/news');
    } catch (err) {
      console.error('Failed to save announcement:', err);
      showErrorAlert('Error', 'Failed to save announcement. Please check your inputs and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-slate-500 flex items-center justify-center gap-2 font-sans">
        <span className="material-symbols-outlined animate-spin text-2xl text-[#fea619]">progress_activity</span>
        <span>Loading announcement editor...</span>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => handleSubmit(e, 'Published')} className="space-y-6 max-w-5xl mx-auto pb-12 font-sans">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link 
            to="/admin/news" 
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all"
            title="Back to News & Announcements list"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </Link>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {isEdit ? 'Edit Announcement' : 'Create New Announcement'}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              {isEdit ? 'Update details, banner image, and public notice content.' : 'Publish official notices, new facility inaugurations, and achievements.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'Draft')}
            disabled={submitting}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-all"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 bg-[#fea619] hover:bg-amber-500 text-slate-900 text-xs font-bold rounded-lg shadow-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            {submitting && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
            <span>{isEdit ? 'Update Announcement' : 'Publish Announcement'}</span>
          </button>
        </div>
      </div>

      {/* Form Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Main Fields & Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Title & Excerpt */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Announcement Title *</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white px-3.5 py-2 text-sm rounded-xl outline-none font-semibold text-slate-800 transition-all" 
                placeholder="e.g. Bhaktivedanta Hospital Inaugurates State-of-the-Art ICU"
                value={formData.title}
                onChange={handleTitleChange}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">URL Slug</label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                <span className="text-xs text-slate-400 font-mono select-none">/announcements/</span>
                <input 
                  type="text"
                  className="w-full bg-transparent text-xs font-mono text-slate-700 outline-none pl-1"
                  placeholder="bhaktivedanta-hospital-inaugurates-icu"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Short Excerpt / Summary</label>
              <textarea 
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white p-3 text-xs rounded-xl outline-none text-slate-700 transition-all"
                placeholder="Brief summary of the notice shown in announcement list cards..."
                value={formData.summary}
                onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
              />
            </div>
          </div>

          {/* Detailed Body Content Rich Text Editor */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">Detailed Announcement Body Content</label>
              <span className="text-[11px] text-slate-400 font-medium">Use headings, paragraphs, bullet points, and images</span>
            </div>

            <div className="min-h-[360px] border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
              <RichTextEditor 
                value={formData.content}
                onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
                placeholder="Enter complete announcement details, features, location, and key contacts..."
                uploadFolder="announcements"
              />
            </div>
          </div>
        </div>

        {/* Right 1 Column: Metadata & Featured Banner Image */}
        <div className="space-y-6">
          {/* Publishing Info Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Publishing Info</h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 px-3 py-2 text-xs rounded-xl outline-none font-semibold text-slate-700 cursor-pointer"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="Published">Published (Live on Website)</option>
                <option value="Draft">Draft (Hidden)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 px-3 py-2 text-xs rounded-xl outline-none text-slate-700 font-medium cursor-pointer"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              >
                {CATEGORIES.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
                <option value="Other">Custom Category...</option>
              </select>
              {formData.category === 'Other' && (
                <input 
                  type="text"
                  className="mt-2 w-full bg-slate-50 border border-slate-200 focus:border-blue-500 px-3 py-1.5 text-xs rounded-xl outline-none text-slate-700"
                  placeholder="Enter custom category..."
                  value={formData.customCategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, customCategory: e.target.value }))}
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Issued By / Author</label>
              <input 
                type="text"
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 px-3 py-1.5 text-xs rounded-xl outline-none text-slate-700"
                placeholder="e.g. Hospital Management"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Author Role / Designation</label>
              <input 
                type="text"
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 px-3 py-1.5 text-xs rounded-xl outline-none text-slate-700"
                placeholder="e.g. Medical Directorate / Quality Cell"
                value={formData.authorRole}
                onChange={(e) => setFormData(prev => ({ ...prev, authorRole: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Publish Date</label>
                <input 
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 px-2.5 py-1.5 text-xs rounded-xl outline-none text-slate-700"
                  placeholder="e.g. October 10, 2026"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Estimated Read Time</label>
                <input 
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 px-2.5 py-1.5 text-xs rounded-xl outline-none text-slate-700"
                  placeholder="e.g. 3 min read"
                  value={formData.readTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tags (Comma-separated)</label>
              <input 
                type="text"
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 px-3 py-1.5 text-xs rounded-xl outline-none text-slate-700"
                placeholder="Announcements, Quality, Healthcare"
                value={formData.tagsStr}
                onChange={(e) => setFormData(prev => ({ ...prev, tagsStr: e.target.value }))}
              />
            </div>
          </div>

          {/* Banner Image Section */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              Banner / Featured Image
            </h3>

            <div className="grid grid-cols-1 gap-3 bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
              {/* Image Preview Box */}
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-white h-36 flex items-center justify-center shadow-2xs">
                {formData.image ? (
                  <img 
                    src={formData.image} 
                    alt="Announcement Banner Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'; }}
                  />
                ) : (
                  <div className="text-center p-3 text-slate-400">
                    <span className="material-symbols-outlined text-3xl text-slate-300">wallpaper</span>
                    <p className="text-[11px] font-medium mt-0.5">No Banner Image Uploaded</p>
                  </div>
                )}
              </div>

              {/* Upload Controls & URL Input */}
              <div className="space-y-2">
                <div className="flex gap-2 items-center">
                  <label className={`flex-1 flex items-center justify-center gap-2 border border-dashed rounded-lg px-3 py-2 cursor-pointer font-bold text-xs transition-all ${
                    uploadingImage ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-white border-blue-300 text-blue-700 hover:bg-blue-50 shadow-2xs'
                  }`}>
                    <span className="material-symbols-outlined text-sm">
                      {uploadingImage ? 'sync' : 'cloud_upload'}
                    </span>
                    <span>{uploadingImage ? 'Uploading to Supabase...' : 'Upload Banner Image'}</span>
                    <input 
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageFileChange}
                      disabled={uploadingImage}
                    />
                  </label>

                  {formData.image && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      className="px-3 py-2 text-xs text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg font-bold border border-rose-200 transition-colors cursor-pointer"
                      title="Remove Image"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div>
                  <input 
                    type="text"
                    className="w-full bg-white border border-slate-200 focus:border-blue-500 px-3 py-1.5 text-xs rounded-lg outline-none text-slate-700 font-mono"
                    placeholder="Image URL (Auto-filled on upload or paste custom URL)"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold text-slate-500 mb-1.5">Or Select Sample Banner:</p>
              <div className="grid grid-cols-1 gap-1.5">
                {SAMPLE_ANNOUNCEMENT_IMAGES.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: sample.url }))}
                    className="text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-lg truncate text-left transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs text-slate-400">image</span>
                    <span>{sample.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
        <Link
          to="/admin/news"
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
        >
          Cancel
        </Link>
        <button
          type="button"
          onClick={(e) => handleSubmit(e, 'Draft')}
          disabled={submitting}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
        >
          Save as Draft
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-[#fea619] hover:bg-amber-500 text-slate-900 text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
        >
          {submitting && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
          <span>{isEdit ? 'Update Announcement' : 'Publish Announcement'}</span>
        </button>
      </div>
    </form>
  );
};

export default AddNews;
