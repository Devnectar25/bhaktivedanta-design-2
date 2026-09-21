import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Plus, X, Sparkles, CheckCircle2, Trash2 } from 'lucide-react';
import SpiritualServicesManager from './SpiritualServicesManager';
import EducationalProgrammesManager from './EducationalProgrammesManager';
import SpiritualRetreatsManager from './SpiritualRetreatsManager';
import PublicationsManager from './PublicationsManager';
import DynamicSectionManager from './DynamicSectionManager';
import { getSpiritualCareState, saveSpiritualCareState } from '../../../utils/api';
import { defaultSpiritualCareState, ensureStandardSpiritualSections } from '../../../data/defaultSpiritualCare';

const AVAILABLE_ICONS = [
  'spa', 'school', 'nature_people', 'library_books', 'volunteer_activism',
  'favorite', 'self_improvement', 'psychology', 'menu_book', 'health_and_safety',
  'groups', 'lightbulb', 'healing', 'diversity_1', 'handshake'
];

export default function SpiritualCare() {
  const location = useLocation();
  const navigate = useNavigate();
  const { section } = useParams();

  const [state, setState] = useState(() => ensureStandardSpiritualSections(defaultSpiritualCareState));
  const [activeTabId, setActiveTabId] = useState('spiritual-care-services');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New section modal form state
  const [newSectionForm, setNewSectionForm] = useState({
    title: '',
    icon: 'volunteer_activism',
    layout: 'tabs',
    description: ''
  });

  const fetchState = () => {
    getSpiritualCareState(defaultSpiritualCareState).then(res => {
      const validated = ensureStandardSpiritualSections(res || defaultSpiritualCareState);
      setState(validated);
    });
  };

  useEffect(() => {
    fetchState();
    window.addEventListener('storage', fetchState);
    window.addEventListener('admin_data_updated', fetchState);
    return () => {
      window.removeEventListener('storage', fetchState);
      window.removeEventListener('admin_data_updated', fetchState);
    };
  }, []);

  const sections = state.sections || [];

  // Determine active tab
  useEffect(() => {
    if (section) {
      const match = sections.find(s => s.id === section || s.id.includes(section));
      if (match) {
        setActiveTabId(match.id);
        return;
      }
    }
    if (sections.length > 0 && !sections.some(s => s.id === activeTabId)) {
      setActiveTabId(sections[0].id);
    }
  }, [section, sections.length]);

  const handleTabChange = (tabId) => {
    setActiveTabId(tabId);
    navigate(`/admin/spiritual-care/${tabId}`);
  };

  // Add New Dynamic Section
  const handleCreateSection = async (e) => {
    e.preventDefault();
    if (!newSectionForm.title.trim()) {
      alert('Please enter a section title.');
      return;
    }

    const newId = `spiritual-${newSectionForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;
    
    let initialTabs = [];
    let initialCards = [];
    let initialItems = [];

    if (newSectionForm.layout === 'tabs') {
      initialTabs = [
        {
          id: `tab-overview`,
          label: 'Overview',
          title: 'Overview',
          type: 'rich_text',
          blocks: [
            {
              id: `b-${Date.now()}`,
              type: 'paragraph',
              title: 'Overview & Philosophy',
              content: `<p>Welcome to ${newSectionForm.title}. Dedicated to holistic wellness and spiritual comfort.</p>`
            }
          ]
        }
      ];
    } else if (newSectionForm.layout === 'card-grid') {
      initialCards = [
        {
          id: `card-1`,
          title: 'Foundation Course',
          badge: 'Introductory',
          duration: '4 Sessions',
          description: 'Introduction to holistic spiritual healing practices.',
          image: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=800&q=80',
          destinationType: 'detail_page',
          enabled: true
        }
      ];
    } else if (newSectionForm.layout === 'list') {
      initialItems = [
        {
          id: `item-1`,
          title: 'Clinical Efficacy and Outcome Metrics',
          authors: ['Faculty Research Team'],
          journal: 'Journal of Spiritual Care',
          year: new Date().getFullYear().toString(),
          volume: 'Vol. 1, Issue 1',
          url: 'https://bhaktivedantahospital.com',
          thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=400&q=80',
          abstract: 'Investigating clinical improvements and spiritual wellness outcomes in hospitalized patients.',
          status: 'Published'
        }
      ];
    }

    const newSection = {
      id: newId,
      title: newSectionForm.title.trim(),
      icon: newSectionForm.icon || 'volunteer_activism',
      order: sections.length + 1,
      enabled: true,
      layout: newSectionForm.layout || 'tabs',
      description: newSectionForm.description.trim() || `${newSectionForm.title} Module`,
      hero: {
        badge: 'Spiritual Care Department',
        title: newSectionForm.title.trim(),
        subtitle: newSectionForm.description.trim() || `${newSectionForm.title} guidance and patient wellness resources.`
      },
      tabs: initialTabs,
      cards: initialCards,
      items: initialItems,
      blocks: [],
      contact: {
        title: `${newSectionForm.title.trim()} Desk`,
        phones: ['+91 22 2845 6000'],
        days: 'Monday – Saturday',
        timings: '9:00 AM – 5:00 PM',
        location: 'Ground Floor, Spiritual Care Central Desk',
        email: 'spiritualcare@bhaktivedantahospital.com'
      }
    };

    const updatedSections = [...sections, newSection];
    const updatedState = { ...state, sections: updatedSections };

    setState(updatedState);
    await saveSpiritualCareState(updatedState);
    window.dispatchEvent(new Event('admin_data_updated'));
    window.dispatchEvent(new Event('storage'));

    setIsAddModalOpen(false);
    setNewSectionForm({ title: '', icon: 'volunteer_activism', layout: 'tabs', description: '' });
    handleTabChange(newId);
  };

  // Update Dynamic Section
  const handleUpdateDynamicSection = async (updatedSection) => {
    const updatedSections = sections.map(s => s.id === updatedSection.id ? updatedSection : s);
    const updatedState = { ...state, sections: updatedSections };
    setState(updatedState);
    await saveSpiritualCareState(updatedState);
    window.dispatchEvent(new Event('admin_data_updated'));
    window.dispatchEvent(new Event('storage'));
  };

  // Delete Dynamic Section
  const handleDeleteDynamicSection = async (sectionId) => {
    const confirmed = window.confirm('Are you sure you want to remove this section? It will be removed from the navbar and modal.');
    if (!confirmed) return;

    const updatedSections = sections.filter(s => s.id !== sectionId);
    const updatedState = { ...state, sections: updatedSections };
    setState(updatedState);
    await saveSpiritualCareState(updatedState);
    window.dispatchEvent(new Event('admin_data_updated'));
    window.dispatchEvent(new Event('storage'));

    if (activeTabId === sectionId) {
      setActiveTabId(updatedSections[0]?.id || 'spiritual-care-services');
    }
  };

  const activeSectionObj = sections.find(s => s.id === activeTabId);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-[#1e3a8a] via-[#2563eb] to-[#1e3a8a] text-white p-6 rounded-2xl shadow-xl border border-blue-400/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-sm">spa</span>
              <span>Spiritual Care Administration</span>
            </div>
            <h1 className="text-2xl font-bold font-serif">Dynamic Spiritual Care Manager</h1>
            <p className="text-xs text-blue-100/80 mt-1 max-w-2xl">
              Manage public-facing Spiritual Care sections dynamically. Add new sub-tabs, courses, retreat activities, or research publications without touching code.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-md shadow-orange-500/20"
            >
              <Plus size={16} />
              <span>Add New Section</span>
            </button>

            <a
              href="/spiritual-care/spiritual-care-services"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors"
            >
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              <span>View Public Page</span>
            </a>
          </div>
        </div>

        {/* Dynamic Section Tabs Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 mt-6 pt-6 border-t border-white/10">
          {sections.map((sec) => {
            const isActive = activeTabId === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => handleTabChange(sec.id)}
                className={`p-3.5 rounded-xl text-left transition-all border flex items-start gap-3 relative group ${
                  isActive
                    ? 'bg-orange-500 text-white border-orange-400 shadow-md shadow-orange-500/20'
                    : 'bg-white/10 hover:bg-white/20 text-blue-100 border-white/15 hover:border-white/30'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-amber-400'
                }`}>
                  <span className="material-symbols-outlined text-lg">{sec.icon || 'spa'}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-xs block truncate">{sec.title}</span>
                  <span className={`text-[10px] block truncate mt-0.5 ${isActive ? 'text-white/80' : 'text-blue-200/70'}`}>
                    {sec.layout ? `Layout: ${sec.layout}` : (sec.description || '')}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Quick Add Button Tab */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="p-3.5 rounded-xl text-left transition-all border border-dashed border-white/20 bg-white/5 hover:bg-white/15 text-blue-200 hover:text-white flex items-center gap-3 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-blue-200 group-hover:text-white">
              <Plus size={16} />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-xs block">+ Add Sub-Tab</span>
              <span className="text-[10px] block text-blue-200/60">Create new section</span>
            </div>
          </button>
        </div>
      </div>

      {/* Dynamic Content Panel Renderer */}
      <div className="transition-opacity duration-200">
        {activeTabId === 'spiritual-care-services' || activeTabId === 'services' ? (
          <SpiritualServicesManager />
        ) : activeTabId === 'educational-programmes' || activeTabId === 'programmes' ? (
          <EducationalProgrammesManager />
        ) : activeTabId === 'spiritual-retreats' || activeTabId === 'retreats' ? (
          <SpiritualRetreatsManager />
        ) : activeTabId === 'publications' ? (
          <PublicationsManager />
        ) : activeSectionObj ? (
          <DynamicSectionManager
            section={activeSectionObj}
            onUpdateSection={handleUpdateDynamicSection}
            onDeleteSection={() => handleDeleteDynamicSection(activeSectionObj.id)}
          />
        ) : (
          <SpiritualServicesManager />
        )}
      </div>

      {/* Add New Section Modal Dialog */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-400">add_circle</span>
                <h3 className="font-serif font-bold text-lg">Add New Spiritual Care Section</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSection} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Section Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Holistic Counseling, Youth Outreach, Vedic Research"
                  value={newSectionForm.title}
                  onChange={(e) => setNewSectionForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white outline-none focus:border-orange-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Layout Pattern *
                  </label>
                  <select
                    value={newSectionForm.layout}
                    onChange={(e) => setNewSectionForm(p => ({ ...p, layout: e.target.value }))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white outline-none focus:border-orange-500"
                  >
                    <option value="tabs">Multi-Tab (Block Editor per Tab)</option>
                    <option value="card-grid">Card Grid (Programs/Activities)</option>
                    <option value="list">Item List (Publications/Resources)</option>
                    <option value="flexible">Single Page Block Editor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Icon
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-lg">{newSectionForm.icon}</span>
                    </div>
                    <select
                      value={newSectionForm.icon}
                      onChange={(e) => setNewSectionForm(p => ({ ...p, icon: e.target.value }))}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white outline-none focus:border-orange-500"
                    >
                      {AVAILABLE_ICONS.map(ic => (
                        <option key={ic} value={ic}>{ic}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description / Subtitle
                </label>
                <textarea
                  rows={2}
                  placeholder="Short description shown in section banners and modal headers..."
                  value={newSectionForm.description}
                  onChange={(e) => setNewSectionForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white transition-colors shadow-md shadow-orange-500/20"
                >
                  Create Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
