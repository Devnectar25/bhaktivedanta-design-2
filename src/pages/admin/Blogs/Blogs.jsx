import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getBlogs, deleteBlog, updateBlog } from '../../../utils/api';
import { showConfirmDialog, showSuccessAlert, showErrorAlert } from '../../../utils/swal';

const defaultFallbackBlogs = [
  {
    id: 'blog-1',
    title: 'Advancements in Robotic Cardiac Surgery: A New Era of Precision',
    slug: 'advancements-in-robotic-cardiac-surgery',
    category: 'Cardiology',
    author: 'Dr. Anand Sharma',
    authorRole: 'Senior Consultant Cardiologist',
    date: 'September 15, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800',
    summary: 'Discover how robotic-assisted cardiac procedures minimize recovery time, enhance surgical precision, and improve patient outcomes at Bhaktivedanta Hospital.',
    content: '<p>Robotic surgery represents one of the most remarkable breakthroughs in modern cardiovascular medicine...</p>',
    tags: ['Cardiology', 'Robotic Surgery', 'Heart Care'],
    status: 'Published',
    views: 1240,
    created_at: '2026-09-15T10:00:00.000Z'
  },
  {
    id: 'blog-2',
    title: 'Holistic Healing: Combining Modern Medical Science with Spiritual Care',
    slug: 'holistic-healing-modern-medicine-spiritual-care',
    category: 'Spiritual Care',
    author: 'Spiritual Care Department',
    authorRole: 'Bhaktivedanta Institute',
    date: 'September 10, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
    summary: 'Exploring how integrating spiritual support, meditation, and compassionate care alongside advanced clinical treatments leads to faster physical and emotional recovery.',
    content: '<p>At Bhaktivedanta Hospital, we believe true healing encompasses the body, mind, and spirit...</p>',
    tags: ['Spiritual Care', 'Holistic Health', 'Wellness'],
    status: 'Published',
    views: 890,
    created_at: '2026-09-10T09:30:00.000Z'
  },
  {
    id: 'blog-3',
    title: 'Preventive Oncology: Early Screening and Lifestyle Modifications',
    slug: 'preventive-oncology-early-screening-lifestyle',
    category: 'Oncology',
    author: 'Dr. Rajesh Patel',
    authorRole: 'Head of Surgical Oncology',
    date: 'September 05, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
    summary: 'Understanding the importance of annual health checkups, tumor marker screenings, and proactive dietary habits in cancer prevention.',
    content: '<p>Early detection remains the single most powerful tool in winning the fight against cancer...</p>',
    tags: ['Oncology', 'Preventive Health', 'Awareness'],
    status: 'Published',
    views: 1560,
    created_at: '2026-09-05T14:15:00.000Z'
  },
  {
    id: 'blog-4',
    title: 'Childhood Immunization Guide: Protecting Your Little Ones',
    slug: 'childhood-immunization-guide-protecting-kids',
    category: 'Pediatrics',
    author: 'Dr. Sneha Verma',
    authorRole: 'Consultant Pediatrician',
    date: 'August 28, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1cdb?auto=format&fit=crop&q=80&w=800',
    summary: 'A comprehensive vaccination schedule for newborns, infants, and adolescents to safeguard against preventable infectious diseases.',
    content: '<p>Vaccines train your child immune system to recognize and fight harmful pathogens...</p>',
    tags: ['Pediatrics', 'Vaccination', 'Child Health'],
    status: 'Draft',
    views: 320,
    created_at: '2026-08-28T11:45:00.000Z'
  }
];

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const navigate = useNavigate();

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const data = await getBlogs(defaultFallbackBlogs);
      setBlogs(Array.isArray(data) ? data : defaultFallbackBlogs);
    } catch (err) {
      console.error('Failed to load blogs:', err);
      setBlogs(defaultFallbackBlogs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleDelete = async (id, title) => {
    const confirm = await showConfirmDialog(
      'Delete Blog Post?',
      `Are you sure you want to permanently delete "${title}"?`,
      'Yes, Delete Post'
    );
    if (confirm.isConfirmed) {
      try {
        await deleteBlog(id);
        setBlogs(prev => prev.filter(b => b.id !== id));
        showSuccessAlert('Deleted!', 'Blog post deleted successfully.');
      } catch (err) {
        showErrorAlert('Error', 'Failed to delete blog post. Please try again.');
      }
    }
  };

  const handleToggleStatus = async (blog) => {
    const newStatus = blog.status === 'Published' ? 'Draft' : 'Published';
    try {
      const updated = { ...blog, status: newStatus };
      await updateBlog(blog.id, updated);
      setBlogs(prev => prev.map(b => b.id === blog.id ? updated : b));
      showSuccessAlert('Status Updated', `Blog status changed to ${newStatus}.`);
    } catch (err) {
      showErrorAlert('Error', 'Could not update blog status.');
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories');
    setSelectedStatus('All Status');
  };

  // Extract unique categories
  const categories = ['All Categories', ...new Set(blogs.map(b => b.category).filter(Boolean))];

  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = (b.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (b.author || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (b.summary || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || b.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All Status' || b.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPublished = blogs.filter(b => b.status === 'Published').length;
  const totalDrafts = blogs.filter(b => b.status === 'Draft').length;
  const totalViews = blogs.reduce((acc, curr) => acc + (parseInt(curr.views) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Blogs Management</h2>
          <p className="text-sm text-slate-500 font-medium">Create, edit, and publish healthcare articles, medical insights, and wellness guides.</p>
        </div>
        <Link 
          to="/admin/blogs/add" 
          className="flex items-center gap-2 bg-[#fea619] hover:bg-amber-500 text-slate-900 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95 w-fit"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          <span>Add New Blog</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Articles</p>
            <p className="text-2xl font-extrabold text-slate-800 mt-1">{blogs.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">article</span>
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
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Views</p>
            <p className="text-2xl font-extrabold text-purple-600 mt-1">{totalViews.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">visibility</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex flex-wrap gap-4 items-end shadow-sm">
        <div className="flex-1 min-w-[240px] space-y-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase px-1">Search Blogs</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2 text-slate-400 text-lg">search</span>
            <input 
              type="text"
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 pl-9 pr-3 py-1.5 text-xs rounded-lg outline-none transition-all"
              placeholder="Search by title, author, or keywords..."
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

      {/* Blogs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-400 font-medium text-sm flex items-center justify-center gap-2">
            <span className="material-symbols-outlined animate-spin">progress_activity</span>
            <span>Loading blogs list...</span>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 mb-2">article</span>
            <h3 className="text-base font-bold text-slate-700">No blog posts found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No blogs match your current search filters or none have been published yet.
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
                  <th className="py-3 px-3 w-[34%]">Article</th>
                  <th className="py-3 px-3 w-[14%]">Category</th>
                  <th className="py-3 px-3 w-[18%]">Author</th>
                  <th className="py-3 px-3 w-[14%]">Date</th>
                  <th className="py-3 px-3 w-[10%]">Status</th>
                  <th className="py-3 px-2 w-[5%]">Views</th>
                  <th className="py-3 px-3 w-[5%] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 min-w-0">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img 
                          src={blog.image || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800'} 
                          alt={blog.title} 
                          className="w-12 h-9 object-cover rounded-lg border border-slate-200 flex-shrink-0 bg-slate-100"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-slate-800 text-xs md:text-sm truncate leading-tight hover:text-blue-600 transition-colors" title={blog.title}>
                            {blog.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5" title={blog.summary || blog.readTime}>
                            {blog.summary || blog.readTime || 'No excerpt available.'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100 inline-block truncate max-w-[120px]">
                        {blog.category || 'General'}
                      </span>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap min-w-0">
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-slate-800 truncate" title={blog.author}>{blog.author || 'Admin'}</span>
                        {blog.authorRole && (
                          <span className="text-[10px] text-slate-400 truncate" title={blog.authorRole}>{blog.authorRole}</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap text-slate-500">
                      <div className="flex flex-col">
                        <span className="truncate">{blog.date}</span>
                        <span className="text-[10px] text-slate-400">{blog.readTime || '3 min read'}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(blog)}
                        title="Click to toggle status"
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-all ${
                          blog.status === 'Published'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${blog.status === 'Published' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        <span>{blog.status || 'Draft'}</span>
                      </button>
                    </td>

                    <td className="py-3 px-2 whitespace-nowrap text-slate-500 font-semibold">
                      <span className="flex items-center gap-1 text-slate-600">
                        <span className="material-symbols-outlined text-xs text-slate-400">visibility</span>
                        {blog.views || 0}
                      </span>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/admin/blogs/edit/${blog.id}`)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit Blog Post"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id, blog.title)}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Delete Blog Post"
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

export default Blogs;
