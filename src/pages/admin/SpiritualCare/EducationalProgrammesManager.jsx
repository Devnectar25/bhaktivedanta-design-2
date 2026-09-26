import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSpiritualCareState, saveSpiritualCareState } from '../../../utils/api';
import { defaultSpiritualCareState } from '../../../data/defaultSpiritualCare';
import RichTextEditor from '../../../components/admin/RichTextEditor/RichTextEditor';
import AlertModal from '../../../components/admin/AlertModal/AlertModal';
import ConfirmModal from '../../../components/admin/ConfirmModal/ConfirmModal';

const BLOCK_TYPES = [
  { type: 'heading', label: 'Heading (H2 / H3)', icon: 'title', color: 'blue' },
  { type: 'paragraph', label: 'Paragraph / Rich Text', icon: 'article', color: 'indigo' },
  { type: 'image', label: 'Image with Caption', icon: 'image', color: 'emerald' },
  { type: 'bullet-list', label: 'Bullet List / Checklist', icon: 'checklist', color: 'teal' },
  { type: 'topic-card-grid', label: 'Topic Card Grid (Colored Headers)', icon: 'view_module', color: 'amber' }
];

export default function EducationalProgrammesManager() {
  const [programmes, setProgrammes] = useState(defaultSpiritualCareState.programmes);
  const [selectedProgId, setSelectedProgId] = useState(defaultSpiritualCareState.programmes[0]?.id);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', type: 'success' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, targetId: null, title: '' });
  const navigate = useNavigate();

  useEffect(() => {
    getSpiritualCareState(defaultSpiritualCareState).then(res => {
      if (res && res.programmes && res.programmes.length > 0) {
        setProgrammes(res.programmes);
      }
    });
  }, []);

  const currentProg = programmes.find(p => p.id === selectedProgId) || programmes[0];

  const handleAddProgramme = () => {
    const timestamp = Date.now();
    const newId = `prog-${timestamp}`;
    const newProg = {
      id: newId,
      slug: `programme-${timestamp.toString().slice(-4)}`,
      title: 'New Educational Programme',
      badge: 'Educational',
      duration: 'Weekly Batches',
      description: 'Comprehensive educational initiative conducted by healthcare experts and spiritual educators.',
      image: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=800&q=80',
      destinationType: 'detail_page',
      enabled: true,
      detailPage: {
        title: 'New Educational Programme',
        subtitle: 'Value-based educational and holistic wellness initiative.',
        category: 'Educational Programmes',
        bannerImage: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1200&q=80',
        blocks: [
          {
            id: `b_${timestamp}_1`,
            type: 'paragraph',
            title: 'About This Programme',
            content: '<p>Enter detailed curriculum, objectives, and schedule information for this educational programme.</p>'
          }
        ]
      }
    };

    setProgrammes(prev => [...prev, newProg]);
    setSelectedProgId(newId);
  };

  const handleDeleteProgRequest = (prog, e) => {
    if (e) e.stopPropagation();
    setDeleteModal({
      isOpen: true,
      targetId: prog.id,
      title: prog.title || 'Educational Programme'
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.targetId) return;
    const targetId = deleteModal.targetId;
    const updated = programmes.filter(p => p.id !== targetId);
    setProgrammes(updated);
    setDeleteModal({ isOpen: false, targetId: null, title: '' });

    if (selectedProgId === targetId) {
      setSelectedProgId(updated.length > 0 ? updated[0].id : null);
    }

    try {
      const fullState = await getSpiritualCareState(defaultSpiritualCareState);
      const updatedFullState = {
        ...fullState,
        programmes: updated
      };
      await saveSpiritualCareState(updatedFullState);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      window.dispatchEvent(new Event('admin_data_updated'));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      setAlertModal({
        isOpen: true,
        title: 'Delete Failed',
        message: err.message || 'Unable to delete programme from database.',
        type: 'error'
      });
    }
  };

  const handleUpdateCurrentProg = (updater) => {
    setProgrammes(prev => prev.map(p => {
      if (p.id === selectedProgId) {
        return typeof updater === 'function' ? updater(p) : { ...p, ...updater };
      }
      return p;
    }));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const fullState = await getSpiritualCareState(defaultSpiritualCareState);
      const updatedFullState = {
        ...fullState,
        programmes
      };
      await saveSpiritualCareState(updatedFullState);
      setSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      setAlertModal({
        isOpen: true,
        title: 'Programmes Saved',
        message: 'All educational programmes and block content updated successfully.',
        type: 'success'
      });
      window.dispatchEvent(new Event('admin_data_updated'));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      setSaving(false);
      setAlertModal({
        isOpen: true,
        title: 'Save Failed',
        message: err.message || 'Unable to save programmes. Please try again.',
        type: 'error'
      });
    }
  };

  /* ---------------------------------------------------- */
  /* BLOCK EDITOR HANDLERS                                 */
  /* ---------------------------------------------------- */

  const handleAddBlock = (type) => {
    const blockId = `b_${Date.now()}`;
    let newBlock = { id: blockId, type };

    switch (type) {
      case 'heading':
        newBlock = { ...newBlock, title: 'New Heading', level: '2', subtitle: '', badge: '' };
        break;
      case 'paragraph':
        newBlock = { ...newBlock, title: '', content: '<p>Enter detailed educational description here.</p>' };
        break;
      case 'image':
        newBlock = { ...newBlock, image: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=800&q=80', caption: 'Clinical session photo', alt: '' };
        break;
      case 'bullet-list':
        newBlock = {
          ...newBlock,
          title: 'Curriculum Highlights',
          subtitle: 'Key learning points:',
          columns: 2,
          items: [
            { text: 'Structured interactive module 1', note: 'Conducted on weekends' },
            { text: 'Hands-on practical training & demonstrations', note: 'Expert guided' }
          ]
        };
        break;
      case 'topic-card-grid':
        newBlock = {
          ...newBlock,
          title: 'Core Workshop Topics',
          subtitle: 'Essential themes covered in this programme:',
          columns: 2,
          cards: [
            {
              id: `tc_${Date.now()}_1`,
              title: 'Module 1: Foundations',
              subtitle: 'Core principles',
              icon: 'school',
              headerColor: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
              bulletPoints: ['Essential guidelines', 'Practical wellness techniques']
            },
            {
              id: `tc_${Date.now()}_2`,
              title: 'Module 2: Advanced Care',
              subtitle: 'Specialized practices',
              icon: 'favorite',
              headerColor: 'linear-gradient(135deg, #C2410C 0%, #E8792B 100%)',
              bulletPoints: ['Lifestyle optimization', 'Post-course mentoring']
            }
          ]
        };
        break;
      default:
        break;
    }

    handleUpdateCurrentProg(p => {
      const detailPage = p.detailPage || { title: p.title, blocks: [] };
      const currentBlocks = detailPage.blocks || [];
      return {
        ...p,
        detailPage: {
          ...detailPage,
          blocks: [...currentBlocks, newBlock]
        }
      };
    });
  };

  const handleUpdateBlock = (blockId, blockData) => {
    handleUpdateCurrentProg(p => {
      const detailPage = p.detailPage || { title: p.title, blocks: [] };
      const updatedBlocks = (detailPage.blocks || []).map(b => b.id === blockId ? { ...b, ...blockData } : b);
      return {
        ...p,
        detailPage: {
          ...detailPage,
          blocks: updatedBlocks
        }
      };
    });
  };

  const handleDeleteBlock = (blockId) => {
    handleUpdateCurrentProg(p => {
      const detailPage = p.detailPage || { title: p.title, blocks: [] };
      const filtered = (detailPage.blocks || []).filter(b => b.id !== blockId);
      return {
        ...p,
        detailPage: {
          ...detailPage,
          blocks: filtered
        }
      };
    });
  };

  const handleMoveBlock = (index, direction) => {
    handleUpdateCurrentProg(p => {
      const detailPage = p.detailPage || { title: p.title, blocks: [] };
      const blocks = [...(detailPage.blocks || [])];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= blocks.length) return p;
      const temp = blocks[index];
      blocks[index] = blocks[targetIndex];
      blocks[targetIndex] = temp;
      return {
        ...p,
        detailPage: {
          ...detailPage,
          blocks
        }
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Content Manager</span>
          <h2 className="text-2xl font-bold text-slate-800">Educational Programmes</h2>
          <p className="text-xs text-slate-500">Manage program cards, destination routing, and custom detail block content</p>
        </div>
        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5 animate-fade-in">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              Saved
            </span>
          )}
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 bg-[#132A4C] hover:bg-[#1e3a8a] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-base">save</span>
            <span>{saving ? 'Saving...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Split: Program Selector + Program Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List of Program Cards (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between px-1 pb-1 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Programmes ({programmes.length})
            </span>
            <button
              type="button"
              onClick={handleAddProgramme}
              className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-white bg-orange-50 hover:bg-orange-600 border border-orange-200 hover:border-orange-600 px-2.5 py-1 rounded-lg transition-all"
              title="Add New Programme"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Add Programme</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-[620px] overflow-y-auto hide-scrollbar pr-0.5">
            {programmes.map((prog) => {
              const isSelected = prog.id === selectedProgId;
              const isExistingGarbha = prog.id === 'garbha-samskar' || prog.destinationType === 'existing';

              return (
                <div
                  key={prog.id}
                  onClick={() => setSelectedProgId(prog.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-200 border border-slate-300/60">
                    <img src={prog.image} alt={prog.title} className="w-full height-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800 truncate block">{prog.title}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                        {prog.badge || 'Program'}
                      </span>
                      {isExistingGarbha && (
                        <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                          Services Module
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleDeleteProgRequest(prog, e)}
                      className="w-7 h-7 rounded-lg border border-transparent hover:border-red-200 bg-transparent hover:bg-red-50 text-slate-400 hover:text-red-600 flex items-center justify-center transition-colors"
                      title={`Delete ${prog.title || 'programme'}`}
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                    <span className="material-symbols-outlined text-slate-400 text-sm">
                      {isSelected ? 'chevron_right' : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Program Card Editor & Block Builder (8 Cols) */}
        {currentProg && (
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Basic Card Meta */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-orange-500">edit_note</span>
                  Card Configuration: {currentProg.title}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-mono">ID: {currentProg.id}</span>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteProgRequest(currentProg, e)}
                    className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 px-2.5 py-1 rounded-lg transition-all"
                    title="Delete this programme"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Programme Title</label>
                  <input
                    type="text"
                    value={currentProg.title || ''}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      handleUpdateCurrentProg(p => {
                        const autoSlug = !p.slug || p.slug.startsWith('programme-') || p.slug === p.id;
                        const updatedSlug = autoSlug && newTitle.trim()
                          ? newTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
                          : p.slug;
                        return {
                          ...p,
                          title: newTitle,
                          slug: updatedSlug || p.slug,
                          detailPage: p.detailPage ? { ...p.detailPage, title: newTitle } : p.detailPage
                        };
                      });
                    }}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={currentProg.slug || ''}
                    onChange={(e) => handleUpdateCurrentProg({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-') })}
                    placeholder="programme-slug"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={currentProg.badge || ''}
                    onChange={(e) => handleUpdateCurrentProg({ badge: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration / Batch</label>
                  <input
                    type="text"
                    value={currentProg.duration || ''}
                    onChange={(e) => handleUpdateCurrentProg({ duration: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Card Image URL</label>
                  <input
                    type="text"
                    value={currentProg.image || ''}
                    onChange={(e) => {
                      const newImg = e.target.value;
                      handleUpdateCurrentProg(p => ({
                        ...p,
                        image: newImg,
                        detailPage: p.detailPage ? { ...p.detailPage, bannerImage: newImg } : p.detailPage
                      }));
                    }}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none font-mono text-[11px]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Card Summary Description</label>
                  <textarea
                    rows={2}
                    value={currentProg.description || ''}
                    onChange={(e) => handleUpdateCurrentProg({ description: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
                  />
                </div>
              </div>

              {/* Destination Picker */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  Card Click Destination:
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name={`dest-${currentProg.id}`}
                      checked={currentProg.destinationType === 'existing'}
                      onChange={() => handleUpdateCurrentProg({ destinationType: 'existing', existingRoute: '/services/garbha-samskar' })}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span>Existing Service Page (e.g. Garbha Samskar)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name={`dest-${currentProg.id}`}
                      checked={currentProg.destinationType === 'detail_page' || !currentProg.destinationType}
                      onChange={() => handleUpdateCurrentProg({ destinationType: 'detail_page' })}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span>Custom Flexible Detail Page (Block Editor)</span>
                  </label>
                </div>

                {currentProg.destinationType === 'existing' && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between gap-3 text-xs text-blue-900">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-blue-600">info</span>
                      <span>
                        This card routes directly to <strong>{currentProg.existingRoute || '/services/garbha-samskar'}</strong>.
                        It is managed under the <strong>Services</strong> module without duplicate admin records.
                      </span>
                    </div>
                    <Link
                      to="/admin/services"
                      className="shrink-0 bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded-md font-bold text-[11px]"
                    >
                      Manage in Services
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Block Editor (for custom detail page programs) */}
            {currentProg.destinationType !== 'existing' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <span className="material-symbols-outlined text-indigo-600">dashboard_customize</span>
                      Detail Page Content Blocks
                    </h3>
                    <p className="text-xs text-slate-500">Add, remove, and reorder content blocks to build the detail page</p>
                  </div>

                  {/* Add Block Dropdown / Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {BLOCK_TYPES.map(bt => (
                      <button
                        key={bt.type}
                        type="button"
                        onClick={() => handleAddBlock(bt.type)}
                        className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                        title={`Add ${bt.label}`}
                      >
                        <span className="material-symbols-outlined text-sm">{bt.icon}</span>
                        <span>+ {bt.label.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Blocks List */}
                <div className="space-y-4">
                  {(currentProg.detailPage?.blocks || []).map((block, bIdx) => (
                    <div key={block.id || bIdx} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
                      {/* Block Top Controls */}
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider bg-slate-200 px-2 py-0.5 rounded text-slate-700">
                            {block.type.replace(/-/g, ' ')}
                          </span>
                          <span className="text-[11px] text-slate-400">Block #{bIdx + 1}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveBlock(bIdx, -1)}
                            disabled={bIdx === 0}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                            title="Move Up"
                          >
                            <span className="material-symbols-outlined text-base">arrow_upward</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveBlock(bIdx, 1)}
                            disabled={bIdx === (currentProg.detailPage?.blocks?.length || 0) - 1}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                            title="Move Down"
                          >
                            <span className="material-symbols-outlined text-base">arrow_downward</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBlock(block.id)}
                            className="p-1 text-red-400 hover:text-red-600 ml-2"
                            title="Delete Block"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </div>

                      {/* Block Specific Form */}
                      {block.type === 'heading' && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Heading Text</label>
                            <input
                              type="text"
                              value={block.title || ''}
                              onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                              className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Badge (optional)</label>
                            <input
                              type="text"
                              value={block.badge || ''}
                              onChange={(e) => handleUpdateBlock(block.id, { badge: e.target.value })}
                              className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white"
                            />
                          </div>
                        </div>
                      )}

                      {block.type === 'paragraph' && (
                        <div className="space-y-2">
                          <label className="block text-[11px] font-bold text-slate-600">Narrative Content</label>
                          <div className="bg-white rounded-lg border border-slate-200">
                            <RichTextEditor
                              content={block.content || ''}
                              onChange={(html) => handleUpdateBlock(block.id, { content: html })}
                            />
                          </div>
                        </div>
                      )}

                      {block.type === 'image' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Image URL</label>
                            <input
                              type="text"
                              value={block.image || ''}
                              onChange={(e) => handleUpdateBlock(block.id, { image: e.target.value })}
                              className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Caption</label>
                            <input
                              type="text"
                              value={block.caption || ''}
                              onChange={(e) => handleUpdateBlock(block.id, { caption: e.target.value })}
                              className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white"
                            />
                          </div>
                        </div>
                      )}

                      {block.type === 'bullet-list' && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-0.5">List Section Title</label>
                              <input
                                type="text"
                                value={block.title || ''}
                                onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                                className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white font-semibold"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Subtitle</label>
                              <input
                                type="text"
                                value={block.subtitle || ''}
                                onChange={(e) => handleUpdateBlock(block.id, { subtitle: e.target.value })}
                                className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white"
                              />
                            </div>
                          </div>

                          {/* Bullet Items */}
                          <div className="space-y-2">
                            {(block.items || []).map((item, itIdx) => (
                              <div key={itIdx} className="flex items-center gap-2 bg-white p-2 border border-slate-200 rounded-lg">
                                <span className="material-symbols-outlined text-orange-500 text-sm">check_circle</span>
                                <input
                                  type="text"
                                  placeholder="Bullet text"
                                  value={typeof item === 'string' ? item : item.text}
                                  onChange={(e) => {
                                    const updated = [...(block.items || [])];
                                    updated[itIdx] = typeof item === 'string' ? e.target.value : { ...item, text: e.target.value };
                                    handleUpdateBlock(block.id, { items: updated });
                                  }}
                                  className="flex-1 border-0 text-xs text-slate-800 outline-none"
                                />
                                <input
                                  type="text"
                                  placeholder="Note (optional)"
                                  value={typeof item === 'object' ? item.note || '' : ''}
                                  onChange={(e) => {
                                    const updated = [...(block.items || [])];
                                    updated[itIdx] = typeof item === 'string' ? { text: item, note: e.target.value } : { ...item, note: e.target.value };
                                    handleUpdateBlock(block.id, { items: updated });
                                  }}
                                  className="w-40 border-0 border-l border-slate-200 pl-2 text-xs text-slate-500 outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = (block.items || []).filter((_, idx) => idx !== itIdx);
                                    handleUpdateBlock(block.id, { items: updated });
                                  }}
                                  className="text-slate-400 hover:text-red-500 p-0.5"
                                >
                                  <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...(block.items || []), { text: 'New item', note: '' }];
                                handleUpdateBlock(block.id, { items: updated });
                              }}
                              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 mt-1"
                            >
                              <span className="material-symbols-outlined text-sm">add</span>
                              Add Bullet Item
                            </button>
                          </div>
                        </div>
                      )}

                      {block.type === 'topic-card-grid' && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Topic Grid Title</label>
                              <input
                                type="text"
                                value={block.title || ''}
                                onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                                className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white font-semibold"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Subtitle</label>
                              <input
                                type="text"
                                value={block.subtitle || ''}
                                onChange={(e) => handleUpdateBlock(block.id, { subtitle: e.target.value })}
                                className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white"
                              />
                            </div>
                          </div>

                          {/* Topic Cards */}
                          <div className="space-y-3">
                            {(block.cards || []).map((card, cIdx) => (
                              <div key={card.id || cIdx} className="bg-white border border-slate-200 rounded-xl p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-800">Card #{cIdx + 1}: {card.title}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = (block.cards || []).filter((_, idx) => idx !== cIdx);
                                      handleUpdateBlock(block.id, { cards: updated });
                                    }}
                                    className="text-slate-400 hover:text-red-500 p-0.5"
                                  >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                  </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  <input
                                    type="text"
                                    placeholder="Card Title"
                                    value={card.title || ''}
                                    onChange={(e) => {
                                      const updated = [...(block.cards || [])];
                                      updated[cIdx] = { ...card, title: e.target.value };
                                      handleUpdateBlock(block.id, { cards: updated });
                                    }}
                                    className="border border-slate-300 rounded-lg px-2 py-1 text-xs"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Subtitle / Scope"
                                    value={card.subtitle || ''}
                                    onChange={(e) => {
                                      const updated = [...(block.cards || [])];
                                      updated[cIdx] = { ...card, subtitle: e.target.value };
                                      handleUpdateBlock(block.id, { cards: updated });
                                    }}
                                    className="border border-slate-300 rounded-lg px-2 py-1 text-xs"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Material Icon (e.g. fitness_center)"
                                    value={card.icon || ''}
                                    onChange={(e) => {
                                      const updated = [...(block.cards || [])];
                                      updated[cIdx] = { ...card, icon: e.target.value };
                                      handleUpdateBlock(block.id, { cards: updated });
                                    }}
                                    className="border border-slate-300 rounded-lg px-2 py-1 text-xs font-mono"
                                  />
                                </div>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                const newCard = {
                                  id: `tc_${Date.now()}`,
                                  title: 'New Topic',
                                  subtitle: 'Overview',
                                  icon: 'topic',
                                  bulletPoints: ['Point 1', 'Point 2']
                                };
                                handleUpdateBlock(block.id, { cards: [...(block.cards || []), newCard] });
                              }}
                              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-sm">add</span>
                              Add Topic Card
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!currentProg && (
          <div className="lg:col-span-8 bg-white p-12 rounded-2xl border border-slate-200/80 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">school</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">No Programmes Available</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                No educational programmes found. Create a new programme to begin adding curriculum highlights and detail blocks.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddProgramme}
              className="inline-flex items-center gap-1.5 bg-[#132A4C] hover:bg-[#1e3a8a] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Create New Programme</span>
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Programme?"
        message={`Are you sure you want to delete "${deleteModal.title}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, targetId: null, title: '' })}
        onClose={() => setDeleteModal({ isOpen: false, targetId: null, title: '' })}
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
