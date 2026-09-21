import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Settings, 
  Save, 
  CheckCircle2, 
  Layout, 
  Layers, 
  Grid, 
  ListFilter, 
  FileText, 
  Image, 
  List, 
  Phone, 
  Sparkles,
  Edit3
} from 'lucide-react';
import RichTextEditor from '../../../components/admin/RichTextEditor/RichTextEditor';

const ICON_CHOICES = [
  'spa', 'school', 'nature_people', 'library_books', 'volunteer_activism', 
  'favorite', 'self_improvement', 'psychology', 'menu_book', 'health_and_safety', 
  'groups', 'lightbulb', 'healing', 'diversity_1', 'handshake'
];

export default function DynamicSectionManager({ section, onUpdateSection, onDeleteSection }) {
  const [secData, setSecData] = useState(JSON.parse(JSON.stringify(section)));
  const [activeSubTab, setActiveSubTab] = useState(secData.tabs?.[0]?.id || 'tab-1');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [editingSettings, setEditingSettings] = useState(false);

  // Sync when prop changes
  React.useEffect(() => {
    setSecData(JSON.parse(JSON.stringify(section)));
    if (section.tabs?.length > 0 && !section.tabs.some(t => t.id === activeSubTab)) {
      setActiveSubTab(section.tabs[0].id);
    }
  }, [section.id]);

  const handleSave = () => {
    setIsSaving(true);
    onUpdateSection(secData);
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }, 400);
  };

  /* ---------------- Tabs Layout Helpers ---------------- */
  const handleAddTab = () => {
    const newTabId = `tab-${Date.now()}`;
    const newTab = {
      id: newTabId,
      label: `New Tab ${(secData.tabs?.length || 0) + 1}`,
      title: `New Tab ${(secData.tabs?.length || 0) + 1}`,
      type: 'rich_text',
      blocks: [
        {
          id: `b-${Date.now()}`,
          type: 'paragraph',
          title: 'Section Overview',
          content: '<p>Write your detailed content here using rich formatting or blocks.</p>'
        }
      ]
    };
    const updatedTabs = [...(secData.tabs || []), newTab];
    setSecData(prev => ({ ...prev, tabs: updatedTabs }));
    setActiveSubTab(newTabId);
  };

  const handleDeleteTab = (tabId) => {
    if ((secData.tabs || []).length <= 1) {
      alert('A tabs layout section must have at least one tab.');
      return;
    }
    const updatedTabs = secData.tabs.filter(t => t.id !== tabId);
    setSecData(prev => ({ ...prev, tabs: updatedTabs }));
    if (activeSubTab === tabId) {
      setActiveSubTab(updatedTabs[0]?.id || '');
    }
  };

  /* ---------------- Block Editor Helpers ---------------- */
  const currentTab = (secData.tabs || []).find(t => t.id === activeSubTab) || secData.tabs?.[0];

  const handleAddBlock = (type) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      enabled: true
    };

    if (type === 'heading') {
      newBlock.title = 'New Heading Title';
      newBlock.subtitle = 'Subtitle or brief description';
      newBlock.level = 2;
    } else if (type === 'paragraph') {
      newBlock.title = 'Overview';
      newBlock.content = '<p>Enter detailed paragraph content here...</p>';
    } else if (type === 'image') {
      newBlock.url = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop';
      newBlock.caption = 'Image description / caption';
    } else if (type === 'bullet-list') {
      newBlock.title = 'Key Features & Guidelines';
      newBlock.columns = 2;
      newBlock.items = ['First point or guideline', 'Second point or guideline', 'Third point or guideline'];
    } else if (type === 'topic-card-grid') {
      newBlock.title = 'Core Focus Areas';
      newBlock.columns = 2;
      newBlock.cards = [
        {
          id: `tc-1`,
          title: 'Primary Module',
          subtitle: 'Module Description',
          icon: 'spa',
          bulletPoints: ['Point one', 'Point two']
        }
      ];
    } else if (type === 'contact') {
      newBlock.title = `${secData.title} Desk & Helpline`;
      newBlock.phones = ['+91 22 2845 6000'];
      newBlock.days = 'Monday – Saturday';
      newBlock.timings = '9:00 AM – 5:00 PM';
      newBlock.location = 'Ground Floor, Spiritual Care Central Desk';
      newBlock.email = 'spiritualcare@bhaktivedantahospital.com';
    }

    if (secData.layout === 'tabs' && currentTab) {
      const updatedBlocks = [...(currentTab.blocks || []), newBlock];
      const updatedTabs = secData.tabs.map(t => t.id === currentTab.id ? { ...t, blocks: updatedBlocks } : t);
      setSecData(prev => ({ ...prev, tabs: updatedTabs }));
    } else {
      const updatedBlocks = [...(secData.blocks || []), newBlock];
      setSecData(prev => ({ ...prev, blocks: updatedBlocks }));
    }
  };

  const handleUpdateBlock = (blockId, updatedFields) => {
    if (secData.layout === 'tabs' && currentTab) {
      const updatedBlocks = (currentTab.blocks || []).map(b => b.id === blockId ? { ...b, ...updatedFields } : b);
      const updatedTabs = secData.tabs.map(t => t.id === currentTab.id ? { ...t, blocks: updatedBlocks } : t);
      setSecData(prev => ({ ...prev, tabs: updatedTabs }));
    } else {
      const updatedBlocks = (secData.blocks || []).map(b => b.id === blockId ? { ...b, ...updatedFields } : b);
      setSecData(prev => ({ ...prev, blocks: updatedBlocks }));
    }
  };

  const handleDeleteBlock = (blockId) => {
    if (secData.layout === 'tabs' && currentTab) {
      const updatedBlocks = (currentTab.blocks || []).filter(b => b.id !== blockId);
      const updatedTabs = secData.tabs.map(t => t.id === currentTab.id ? { ...t, blocks: updatedBlocks } : t);
      setSecData(prev => ({ ...prev, tabs: updatedTabs }));
    } else {
      const updatedBlocks = (secData.blocks || []).filter(b => b.id !== blockId);
      setSecData(prev => ({ ...prev, blocks: updatedBlocks }));
    }
  };

  /* ---------------- Card Grid Layout Helpers ---------------- */
  const handleAddCard = () => {
    const newCard = {
      id: `card-${Date.now()}`,
      title: 'New Program / Activity',
      badge: 'Program Category',
      duration: 'Ongoing Sessions',
      description: 'Brief overview description of this program or activity.',
      image: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=800&q=80',
      destinationType: 'detail_page',
      enabled: true,
      detailPage: {
        title: 'New Program Details',
        subtitle: 'Comprehensive program outline and spiritual guidance curriculum.',
        blocks: [
          {
            id: `b1`,
            type: 'paragraph',
            title: 'About This Program',
            content: '<p>Enter comprehensive description and spiritual counseling objectives here.</p>'
          }
        ]
      }
    };
    setSecData(prev => ({ ...prev, cards: [...(prev.cards || []), newCard] }));
  };

  const handleDeleteCard = (cardId) => {
    setSecData(prev => ({ ...prev, cards: (prev.cards || []).filter(c => c.id !== cardId) }));
  };

  const handleUpdateCard = (cardId, updatedFields) => {
    setSecData(prev => ({
      ...prev,
      cards: (prev.cards || []).map(c => c.id === cardId ? { ...c, ...updatedFields } : c)
    }));
  };

  /* ---------------- List Layout Helpers ---------------- */
  const handleAddListItem = () => {
    const newItem = {
      id: `item-${Date.now()}`,
      title: 'New Research Paper / Publication Title',
      authors: ['Senior Clinical Faculty', 'Spiritual Care Dept'],
      journal: 'Journal of Holistic Healthcare',
      year: new Date().getFullYear().toString(),
      volume: 'Vol. 1, Issue 1',
      doi: '10.1000/182',
      url: 'https://bhaktivedantahospital.com',
      thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=400&q=80',
      abstract: 'Abstract summary of the paper and findings.',
      status: 'Published'
    };
    setSecData(prev => ({ ...prev, items: [...(prev.items || []), newItem] }));
  };

  const handleDeleteListItem = (itemId) => {
    setSecData(prev => ({ ...prev, items: (prev.items || []).filter(i => i.id !== itemId) }));
  };

  const handleUpdateListItem = (itemId, updatedFields) => {
    setSecData(prev => ({
      ...prev,
      items: (prev.items || []).map(i => i.id === itemId ? { ...i, ...updatedFields } : i)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-2xl">
            <span className="material-symbols-outlined text-2xl">{secData.icon || 'spa'}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-serif text-slate-900">{secData.title}</h2>
              <span className="bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-slate-200">
                Layout: {secData.layout || 'tabs'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {secData.description || 'Configurable dynamic spiritual section rendered in navbar and modal.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setEditingSettings(!editingSettings)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Settings size={15} />
            <span>{editingSettings ? 'Close Settings' : 'Section Settings'}</span>
          </button>

          <button
            type="button"
            onClick={onDeleteSection}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
          >
            <Trash2 size={15} />
            <span>Delete Section</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all ${
              savedSuccess ? 'bg-emerald-600' : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 size={16} />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Optional Metadata Settings Drawer */}
      {editingSettings && (
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Section Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Section Title</label>
              <input
                type="text"
                value={secData.title}
                onChange={(e) => setSecData(p => ({ ...p, title: e.target.value }))}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Icon</label>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-700">{secData.icon || 'spa'}</span>
                <select
                  value={secData.icon || 'spa'}
                  onChange={(e) => setSecData(p => ({ ...p, icon: e.target.value }))}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white outline-none focus:border-orange-500"
                >
                  {ICON_CHOICES.map(ic => (
                    <option key={ic} value={ic}>{ic}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Layout Mode</label>
              <select
                value={secData.layout || 'tabs'}
                onChange={(e) => setSecData(p => ({ ...p, layout: e.target.value }))}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white outline-none focus:border-orange-500"
              >
                <option value="tabs">Multi-Tab Layout with Block Editor</option>
                <option value="card-grid">Interactive Cards Grid (Programs/Courses)</option>
                <option value="list">Searchable Item List (Publications/Resources)</option>
                <option value="flexible">Single Page Block Editor</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Short Description / Subtitle</label>
            <input
              type="text"
              value={secData.description || ''}
              onChange={(e) => setSecData(p => ({ ...p, description: e.target.value }))}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white outline-none focus:border-orange-500"
              placeholder="Brief subtitle explaining the section scope..."
            />
          </div>
        </div>
      )}

      {/* ---------------- 1. TABS LAYOUT MANAGER ---------------- */}
      {secData.layout === 'tabs' && (
        <div className="space-y-6">
          {/* Tabs bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {(secData.tabs || []).map((t) => {
                const isActive = t.id === activeSubTab;
                return (
                  <div
                    key={t.id}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                      isActive
                        ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveSubTab(t.id)}
                      className="cursor-pointer"
                    >
                      {t.label || t.title}
                    </button>
                    {(secData.tabs || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteTab(t.id)}
                        className={`text-[10px] hover:opacity-100 opacity-60 ml-1`}
                        title="Delete Tab"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                );
              })}

              <button
                type="button"
                onClick={handleAddTab}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 border border-dashed border-slate-300 hover:bg-slate-200 transition-colors"
              >
                <Plus size={14} />
                <span>Add Tab</span>
              </button>
            </div>

            {currentTab && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Editing Tab Label:</span>
                <input
                  type="text"
                  value={currentTab.label || currentTab.title || ''}
                  onChange={(e) => {
                    const newLabel = e.target.value;
                    const updatedTabs = (secData.tabs || []).map(t => t.id === currentTab.id ? { ...t, label: newLabel, title: newLabel } : t);
                    setSecData(p => ({ ...p, tabs: updatedTabs }));
                  }}
                  className="text-xs p-1.5 px-2.5 rounded-lg border border-slate-300 bg-white outline-none focus:border-orange-500 w-44 font-semibold text-slate-800"
                />
              </div>
            )}
          </div>

          {/* Block Editor for Active Tab */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Content Blocks inside "{currentTab?.label || 'Tab'}"
              </h3>
              
              {/* Add Block Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Add Content Block:</span>
                <button
                  type="button"
                  onClick={() => handleAddBlock('paragraph')}
                  className="inline-flex items-center gap-1 bg-white hover:bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700"
                >
                  <FileText size={13} className="text-blue-500" />
                  <span>Rich Text</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddBlock('bullet-list')}
                  className="inline-flex items-center gap-1 bg-white hover:bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700"
                >
                  <List size={13} className="text-emerald-500" />
                  <span>Bullet List</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddBlock('topic-card-grid')}
                  className="inline-flex items-center gap-1 bg-white hover:bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700"
                >
                  <Grid size={13} className="text-purple-500" />
                  <span>Topic Card Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddBlock('contact')}
                  className="inline-flex items-center gap-1 bg-white hover:bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700"
                >
                  <Phone size={13} className="text-orange-500" />
                  <span>Contact Desk</span>
                </button>
              </div>
            </div>

            {/* List of Blocks */}
            <div className="space-y-4">
              {(currentTab?.blocks || []).map((block, bIdx) => (
                <div key={block.id || bIdx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px]">
                        {bIdx + 1}
                      </span>
                      <span>Block Type: {block.type}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteBlock(block.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-semibold"
                    >
                      Remove Block
                    </button>
                  </div>

                  {block.type === 'paragraph' && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Block Heading (e.g. Overview & Purpose)"
                        value={block.title || ''}
                        onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-semibold"
                      />
                      <RichTextEditor
                        value={block.content || ''}
                        onChange={(html) => handleUpdateBlock(block.id, { content: html })}
                        placeholder="Write detailed paragraph content..."
                      />
                    </div>
                  )}

                  {block.type === 'bullet-list' && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Bullet List Heading"
                        value={block.title || ''}
                        onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-semibold"
                      />
                      <textarea
                        rows={4}
                        placeholder="Enter points (one per line)"
                        value={Array.isArray(block.items) ? block.items.join('\n') : ''}
                        onChange={(e) => handleUpdateBlock(block.id, { items: e.target.value.split('\n').filter(Boolean) })}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-mono"
                      />
                    </div>
                  )}

                  {block.type === 'contact' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Desk Title"
                        value={block.title || ''}
                        onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                        className="text-xs p-2 rounded-lg border border-slate-300 bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Phone (e.g. +91 22 2845 6000)"
                        value={Array.isArray(block.phones) ? block.phones.join(', ') : block.phones || ''}
                        onChange={(e) => handleUpdateBlock(block.id, { phones: e.target.value.split(',').map(s => s.trim()) })}
                        className="text-xs p-2 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 2. CARD-GRID LAYOUT MANAGER ---------------- */}
      {secData.layout === 'card-grid' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Interactive Program Cards ({(secData.cards || []).length})
            </h3>
            <button
              type="button"
              onClick={handleAddCard}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-sm"
            >
              <Plus size={14} />
              <span>Add Program Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(secData.cards || []).map((card, cIdx) => (
              <div key={card.id || cIdx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Card #{cIdx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteCard(card.id)}
                    className="text-red-500 hover:text-red-700 text-xs font-semibold"
                  >
                    Delete
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Card Title"
                    value={card.title || ''}
                    onChange={(e) => handleUpdateCard(card.id, { title: e.target.value })}
                    className="text-xs p-2 rounded-lg border border-slate-300 bg-white font-semibold"
                  />
                  <input
                    type="text"
                    placeholder="Badge (e.g. Prenatal Care)"
                    value={card.badge || ''}
                    onChange={(e) => handleUpdateCard(card.id, { badge: e.target.value })}
                    className="text-xs p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Image URL"
                  value={card.image || ''}
                  onChange={(e) => handleUpdateCard(card.id, { image: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                />

                <textarea
                  rows={2}
                  placeholder="Card short description"
                  value={card.description || ''}
                  onChange={(e) => handleUpdateCard(card.id, { description: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- 3. LIST LAYOUT MANAGER ---------------- */}
      {secData.layout === 'list' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Publications / List Items ({(secData.items || []).length})
            </h3>
            <button
              type="button"
              onClick={handleAddListItem}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-sm"
            >
              <Plus size={14} />
              <span>Add List Item</span>
            </button>
          </div>

          <div className="space-y-3">
            {(secData.items || []).map((item, iIdx) => (
              <div key={item.id || iIdx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    placeholder="Publication / Item Title"
                    value={item.title || ''}
                    onChange={(e) => handleUpdateListItem(item.id, { title: e.target.value })}
                    className="w-full text-xs font-bold p-1.5 rounded-md border border-slate-300 bg-white"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Authors (comma-separated)"
                      value={Array.isArray(item.authors) ? item.authors.join(', ') : item.authors || ''}
                      onChange={(e) => handleUpdateListItem(item.id, { authors: e.target.value.split(',').map(s => s.trim()) })}
                      className="text-xs p-1.5 rounded-md border border-slate-300 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Journal / Organization"
                      value={item.journal || ''}
                      onChange={(e) => handleUpdateListItem(item.id, { journal: e.target.value })}
                      className="text-xs p-1.5 rounded-md border border-slate-300 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="External URL"
                      value={item.url || ''}
                      onChange={(e) => handleUpdateListItem(item.id, { url: e.target.value })}
                      className="text-xs p-1.5 rounded-md border border-slate-300 bg-white text-blue-600 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteListItem(item.id)}
                  className="text-red-500 hover:text-red-700 text-xs font-semibold p-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
