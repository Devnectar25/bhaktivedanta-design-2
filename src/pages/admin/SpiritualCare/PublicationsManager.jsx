import React, { useState, useEffect } from 'react';
import { getSpiritualCareState, saveSpiritualCareState } from '../../../utils/api';
import { defaultSpiritualCareState } from '../../../data/defaultSpiritualCare';
import AlertModal from '../../../components/admin/AlertModal/AlertModal';
import ConfirmModal from '../../../components/admin/ConfirmModal/ConfirmModal';

export default function PublicationsManager() {
  const [publications, setPublications] = useState(defaultSpiritualCareState.publications);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPaper, setEditingPaper] = useState(null); // Paper object or null
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, targetId: null, title: '' });
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', type: 'success' });

  useEffect(() => {
    getSpiritualCareState(defaultSpiritualCareState).then(res => {
      if (res && res.publications) {
        setPublications(res.publications);
      }
    });
  }, []);

  const handleOpenAdd = () => {
    setEditingPaper({
      id: `pub-${Date.now()}`,
      title: '',
      authors: ['Dr. '],
      journal: '',
      year: new Date().getFullYear().toString(),
      volume: '',
      doi: '',
      url: '',
      thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=400&q=80',
      abstract: '',
      status: 'Published'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (paper) => {
    setEditingPaper({
      ...paper,
      authors: Array.isArray(paper.authors) ? paper.authors : [paper.authors]
    });
    setIsModalOpen(true);
  };

  const handleSavePaper = async (e) => {
    e.preventDefault();
    if (!editingPaper.title.trim()) {
      setAlertModal({
        isOpen: true,
        title: 'Validation Error',
        message: 'Please provide a title for the research publication.',
        type: 'error'
      });
      return;
    }

    setSaving(true);
    try {
      let updatedPubs = [];
      const exists = publications.some(p => p.id === editingPaper.id);
      if (exists) {
        updatedPubs = publications.map(p => p.id === editingPaper.id ? editingPaper : p);
      } else {
        updatedPubs = [editingPaper, ...publications];
      }

      setPublications(updatedPubs);

      const fullState = await getSpiritualCareState(defaultSpiritualCareState);
      const updatedFullState = {
        ...fullState,
        publications: updatedPubs
      };
      await saveSpiritualCareState(updatedFullState);
      setSaving(false);
      setIsModalOpen(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      window.dispatchEvent(new Event('admin_data_updated'));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      setSaving(false);
      setAlertModal({
        isOpen: true,
        title: 'Error Saving Paper',
        message: err.message || 'Could not save the publication paper. Please try again.',
        type: 'error'
      });
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.targetId) return;
    const updated = publications.filter(p => p.id !== deleteModal.targetId);
    setPublications(updated);
    setDeleteModal({ isOpen: false, targetId: null, title: '' });

    const fullState = await getSpiritualCareState(defaultSpiritualCareState);
    const updatedFullState = {
      ...fullState,
      publications: updated
    };
    await saveSpiritualCareState(updatedFullState);
    window.dispatchEvent(new Event('admin_data_updated'));
    window.dispatchEvent(new Event('storage'));
  };

  const filtered = publications.filter(p =>
    (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (Array.isArray(p.authors) ? p.authors.join(' ') : p.authors || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.journal || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Content Manager</span>
          <h2 className="text-2xl font-bold text-slate-800">Publications & Paper Presentations</h2>
          <p className="text-xs text-slate-500">Add, edit, or delete research papers, journals, DOI links, and clinical study abstracts</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-[#132A4C] hover:bg-[#1e3a8a] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>Add New Publication</span>
          </button>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-sm">search</span>
          <input
            type="text"
            placeholder="Search papers by title, author, journal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-none focus:border-orange-500"
          />
        </div>
        <span className="text-xs text-slate-500 font-semibold">
          Showing {filtered.length} of {publications.length} papers
        </span>
      </div>

      {/* Publications Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Thumbnail</th>
                <th className="px-5 py-3.5">Title & DOI</th>
                <th className="px-5 py-3.5">Authors</th>
                <th className="px-5 py-3.5">Journal & Year</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((paper) => (
                <tr key={paper.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="w-12 h-14 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img src={paper.thumbnail} alt={paper.title} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-5 py-3.5 max-w-sm">
                    <span className="font-bold text-slate-800 line-clamp-2 block leading-snug">{paper.title}</span>
                    {paper.doi && (
                      <span className="text-[11px] text-blue-600 font-mono block mt-1">
                        DOI: {paper.doi}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 font-medium">
                    {Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">
                    <span className="font-semibold block">{paper.journal || 'Peer Reviewed'}</span>
                    <span className="text-slate-400 text-[11px]">{paper.year} {paper.volume ? `• ${paper.volume}` : ''}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                      {paper.status || 'Published'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(paper)}
                      className="text-slate-600 hover:text-orange-600 font-bold px-2.5 py-1 rounded-md bg-slate-100 hover:bg-orange-50 transition-colors text-xs"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteModal({ isOpen: true, targetId: paper.id, title: paper.title })}
                      className="text-red-500 hover:text-red-700 font-bold px-2.5 py-1 rounded-md bg-red-50 hover:bg-red-100 transition-colors text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                    No publications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && editingPaper && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">
                {editingPaper.id.startsWith('pub-') ? 'Edit Publication Paper' : 'Add Publication Paper'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePaper} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Paper Title *</label>
                <input
                  type="text"
                  required
                  value={editingPaper.title || ''}
                  onChange={(e) => setEditingPaper(p => ({ ...p, title: e.target.value }))}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Authors (comma separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(editingPaper.authors) ? editingPaper.authors.join(', ') : editingPaper.authors || ''}
                    onChange={(e) => setEditingPaper(p => ({ ...p, authors: e.target.value.split(',').map(s => s.trim()) }))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Journal Name</label>
                  <input
                    type="text"
                    value={editingPaper.journal || ''}
                    onChange={(e) => setEditingPaper(p => ({ ...p, journal: e.target.value }))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Publication Year</label>
                  <input
                    type="text"
                    value={editingPaper.year || ''}
                    onChange={(e) => setEditingPaper(p => ({ ...p, year: e.target.value }))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Volume & Issue (e.g. Vol. 30, Issue 2)</label>
                  <input
                    type="text"
                    value={editingPaper.volume || ''}
                    onChange={(e) => setEditingPaper(p => ({ ...p, volume: e.target.value }))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">DOI (e.g. 10.4103/ijpc.ijpc_224_23)</label>
                  <input
                    type="text"
                    value={editingPaper.doi || ''}
                    onChange={(e) => setEditingPaper(p => ({ ...p, doi: e.target.value }))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">External Paper URL</label>
                  <input
                    type="text"
                    value={editingPaper.url || ''}
                    onChange={(e) => setEditingPaper(p => ({ ...p, url: e.target.value }))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Thumbnail Image URL</label>
                  <input
                    type="text"
                    value={editingPaper.thumbnail || ''}
                    onChange={(e) => setEditingPaper(p => ({ ...p, thumbnail: e.target.value }))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Abstract Summary</label>
                  <textarea
                    rows={3}
                    value={editingPaper.abstract || ''}
                    onChange={(e) => setEditingPaper(p => ({ ...p, abstract: e.target.value }))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#132A4C] hover:bg-[#1e3a8a] text-white rounded-xl font-bold shadow-md"
                >
                  {saving ? 'Saving...' : 'Save Publication'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Publication Paper?"
        message={`Are you sure you want to permanently delete "${deleteModal.title}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, targetId: null, title: '' })}
      />

      <AlertModal
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
        onClose={() => setAlertModal(p => ({ ...p, isOpen: false }))}
      />
    </div>
  );
}
