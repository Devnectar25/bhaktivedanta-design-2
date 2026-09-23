import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getBlogs, getBlogById, addBlog, updateBlog } from '../../../utils/api';
import RichTextEditor from '../../../components/admin/RichTextEditor/RichTextEditor';
import { showSuccessAlert, showErrorAlert } from '../../../utils/swal';

const SAMPLE_IMAGES = [
  { label: 'Hospital Surgery / Tech', url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800' },
  { label: 'Spiritual / Meditation', url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800' },
  { label: 'Medical Research / Lab', url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800' },
  { label: 'Pediatrics / Care', url: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1cdb?auto=format&fit=crop&q=80&w=800' },
  { label: 'Doctor Consultation', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800' },
];

const CATEGORIES = [
  'Cardiology',
  'Oncology',
  'Pediatrics',
  'Orthopedics',
  'Neurology',
  'Spiritual Care',
  'Holistic Health',
  'Emergency Care',
  'General Health'
];

const AddBlog = ({ mode = 'add' }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = mode === 'edit' || Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'General Health',
    customCategory: '',
    author: 'Editorial Team',
    authorRole: 'Healthcare Specialist',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800',
    summary: '',
    content: '',
    tagsStr: 'Health, Wellness',
    status: 'Published',
    views: 0
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      const fetchBlog = async () => {
        setLoading(true);
        try {
          const blog = await getBlogById(id);
          if (blog) {
            setFormData({
              title: blog.title || '',
              slug: blog.slug || '',
              category: CATEGORIES.includes(blog.category) ? blog.category : 'Other',
              customCategory: CATEGORIES.includes(blog.category) ? '' : (blog.category || ''),
              author: blog.author || 'Editorial Team',
              authorRole: blog.authorRole || '',
              date: blog.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              readTime: blog.readTime || '5 min read',
              image: blog.image || '',
              summary: blog.summary || '',
              content: blog.content || '',
              tagsStr: Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags || ''),
              status: blog.status || 'Published',
              views: blog.views || 0
            });
          }
        } catch (err) {
          console.error('Error fetching blog post:', err);
          showErrorAlert('Error', 'Could not load blog post details.');
        } finally {
          setLoading(false);
        }
      };
      fetchBlog();
    }
  }, [isEdit, id]);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData(prev => ({
      ...prev,
      title: val,
      slug: prev.slug === '' || prev.slug === generatedSlug.substring(0, prev.slug.length) ? generatedSlug : prev.slug
    }));
  };

  const handleSave = async (targetStatus = formData.status) => {
    if (!formData.title.trim()) {
      showErrorAlert('Validation Error', 'Please enter a title for the blog article.');
      return;
    }

    setSubmitting(true);
    const finalCategory = formData.category === 'Other' ? (formData.customCategory || 'General Health') : formData.category;
    const tags = formData.tagsStr.split(',').map(t => t.trim()).filter(Boolean);

    const payload = {
      ...formData,
      category: finalCategory,
      tags,
      status: targetStatus,
      id: isEdit ? id : `blog-${Date.now()}`
    };

    try {
      if (isEdit) {
        await updateBlog(id, payload);
        await showSuccessAlert('Success!', `Blog article "${formData.title}" updated successfully.`);
      } else {
        await addBlog(payload);
        await showSuccessAlert('Created!', `New blog article "${formData.title}" created successfully.`);
      }
      navigate('/admin/blogs');
    } catch (err) {
      console.error('Failed to save blog:', err);
      showErrorAlert('Error', 'Failed to save blog article. Please check your inputs and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-slate-500 flex items-center justify-center gap-2">
        <span className="material-symbols-outlined animate-spin text-2xl text-blue-600">progress_activity</span>
        <span>Loading article editor...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link 
            to="/admin/blogs" 
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all"
            title="Back to Blogs list"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </Link>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {isEdit ? 'Edit Blog Article' : 'Create New Blog Article'}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              {isEdit ? 'Update details, author information, and rich content.' : 'Publish healthcare insights and wellness stories to the website.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSave('Draft')}
            disabled={submitting}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-all"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave('Published')}
            disabled={submitting}
            className="px-5 py-2 bg-[#fea619] hover:bg-amber-500 text-slate-900 text-xs font-bold rounded-lg shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
          >
            {submitting && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
            <span>{isEdit ? 'Update & Publish' : 'Publish Article'}</span>
          </button>
        </div>
      </div>

      {/* Form Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Main Fields & Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Article Title & Slug */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Article Title *</label>
              <input 
                type="text"
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white px-3.5 py-2 text-sm rounded-xl outline-none font-semibold text-slate-800 transition-all"
                placeholder="e.g. Advancements in Robotic Cardiac Surgery: A New Era of Precision"
                value={formData.title}
                onChange={handleTitleChange}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">URL Slug</label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                <span className="text-xs text-slate-400 font-mono select-none">/blog/</span>
                <input 
                  type="text"
                  className="w-full bg-transparent text-xs font-mono text-slate-700 outline-none pl-1"
                  placeholder="advancements-in-robotic-cardiac-surgery"
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
                placeholder="Brief 2-3 sentence overview shown in blog cards and social previews..."
                value={formData.summary}
                onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
              />
            </div>
          </div>

          {/* Detailed Content Rich Text Editor */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">Article Detailed Body Content</label>
              <span className="text-[11px] text-slate-400 font-medium">Use headings, formatting, lists, and images</span>
            </div>

            <div className="min-h-[360px] border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
              <RichTextEditor 
                value={formData.content}
                onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
                placeholder="Write your article here..."
              />
            </div>
          </div>
        </div>

        {/* Right 1 Column: Metadata, Cover Image & Attributes */}
        <div className="space-y-6">
          {/* Status & Publication Settings */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Publishing Info</h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 px-3 py-2 text-xs rounded-xl outline-none font-semibold text-slate-700"
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
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 px-3 py-2 text-xs rounded-xl outline-none text-slate-700 font-medium"
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Author Name</label>
              <input 
                type="text"
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 px-3 py-1.5 text-xs rounded-xl outline-none text-slate-700"
                placeholder="e.g. Dr. Anand Sharma"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Author Role / Designation</label>
              <input 
                type="text"
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 px-3 py-1.5 text-xs rounded-xl outline-none text-slate-700"
                placeholder="e.g. Senior Consultant Cardiologist"
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
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Estimated Read Time</label>
                <input 
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 px-2.5 py-1.5 text-xs rounded-xl outline-none text-slate-700"
                  placeholder="e.g. 5 min read"
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
                placeholder="Cardiology, Heart Health, Surgery"
                value={formData.tagsStr}
                onChange={(e) => setFormData(prev => ({ ...prev, tagsStr: e.target.value }))}
              />
            </div>
          </div>

          {/* Featured Image Section */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Featured Cover Image</h3>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Image URL</label>
              <input 
                type="text"
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 px-3 py-1.5 text-xs rounded-xl outline-none text-slate-700 font-mono"
                placeholder="https://images.unsplash.com/..."
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              />
            </div>

            {formData.image && (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video">
                <img 
                  src={formData.image} 
                  alt="Cover Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800'; }}
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium rounded-md">
                  Cover Preview
                </span>
              </div>
            )}

            <div>
              <p className="text-[11px] font-bold text-slate-500 mb-1.5">Or Choose Sample Image:</p>
              <div className="grid grid-cols-2 gap-1.5">
                {SAMPLE_IMAGES.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: sample.url }))}
                    className="text-[10px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-lg truncate text-left transition-colors"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBlog;
