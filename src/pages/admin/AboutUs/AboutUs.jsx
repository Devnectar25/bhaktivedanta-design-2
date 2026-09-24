import React, { useState, useEffect } from 'react';
import {
  Building2,
  Calendar,
  UserCheck,
  Sparkles,
  Award,
  Save,
  RotateCcw,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Layers,
  HeartHandshake,
  HelpCircle,
  Target,
  Compass,
  Trophy,
  Image,
  Newspaper,
  Heart,
  Users,
  TrendingUp
} from 'lucide-react';
import Swal from 'sweetalert2';
import { getAboutUsState, saveAboutUsState, resetAboutUsState } from '../../../utils/api';
import { defaultAboutUsData } from '../../../data/aboutUsData';

export default function AdminAboutUs() {
  const [activeTab, setActiveTab] = useState('aboutHospital');
  const [aboutState, setAboutState] = useState(defaultAboutUsData);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // History timeline edit modal
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState({
    sr: '',
    year: '',
    title: '',
    location: '',
    detail: ''
  });

  // Logo element edit modal
  const [editingLogoElem, setEditingLogoElem] = useState(null);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [logoElemForm, setLogoElemForm] = useState({
    sr: '',
    name: '',
    color: '',
    description: ''
  });

  // Award item edit modal
  const [editingAward, setEditingAward] = useState(null);
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [awardForm, setAwardForm] = useState({
    id: null,
    title: '',
    imageUrl: ''
  });

  // Events & News subtab in Admin
  const [eventsNewsSubTab, setEventsNewsSubTab] = useState('events');

  // Event item edit modal
  const [editingEvent, setEditingEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventForm, setEventForm] = useState({
    id: null,
    title: '',
    imageUrl: '',
    description: '',
    link: ''
  });

  // News item edit modal
  const [editingNews, setEditingNews] = useState(null);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [newsForm, setNewsForm] = useState({
    id: null,
    title: '',
    imageUrl: '',
    link: ''
  });

  // Management Team edit modal
  const [editingTeamMember, setEditingTeamMember] = useState(null);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teamForm, setTeamForm] = useState({
    id: null,
    name: '',
    designation: '',
    photoUrl: '',
    bio: ''
  });

  // New Developments edit modal
  const [editingDev, setEditingDev] = useState(null);
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);
  const [devForm, setDevForm] = useState({
    id: null,
    title: '',
    description: '',
    imageUrl: '',
    readMoreLink: ''
  });

  // Spiritual Advisors edit modal
  const [editingAdvisor, setEditingAdvisor] = useState(null);
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);
  const [advisorForm, setAdvisorForm] = useState({
    id: null,
    name: '',
    designation: 'Spiritual Advisor',
    photoUrl: '',
    bio: ''
  });

  useEffect(() => {
    loadData();
    const handleSync = () => loadData();
    window.addEventListener('storage', handleSync);
    window.addEventListener('admin_data_updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('admin_data_updated', handleSync);
    };
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAboutUsState(defaultAboutUsData);
      if (data && typeof data === 'object') {
        setAboutState({
          ...defaultAboutUsData,
          ...data,
          managementTeam: (Array.isArray(data.managementTeam) && data.managementTeam.length > 0)
            ? data.managementTeam
            : defaultAboutUsData.managementTeam,
          newDevelopments: (Array.isArray(data.newDevelopments) && data.newDevelopments.length > 0)
            ? data.newDevelopments
            : defaultAboutUsData.newDevelopments,
          spiritualAdvisors: (Array.isArray(data.spiritualAdvisors) && data.spiritualAdvisors.length > 0)
            ? data.spiritualAdvisors
            : defaultAboutUsData.spiritualAdvisors
        });
      }
    } catch (err) {
      console.warn('Could not fetch About Us state:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await saveAboutUsState(aboutState);
      Swal.fire({
        icon: 'success',
        title: 'Saved Successfully!',
        text: 'All About Us sections have been stored in the database and synchronized.',
        confirmButtonColor: '#ea580c',
        timer: 2000
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: err.message || 'Could not save About Us data to database'
      });
    } finally {
      setSaving(false);
    }
  };

  const commitAndSave = async (nextState, successMsg = null) => {
    setAboutState(nextState);
    try {
      await saveAboutUsState(nextState);
      if (successMsg) {
        Swal.fire({
          icon: 'success',
          title: 'Saved to Database',
          text: successMsg,
          timer: 1600,
          showConfirmButton: false
        });
      }
    } catch (err) {
      console.warn('Database auto-save error:', err);
    }
  };

  const handleResetDefaults = async () => {
    const result = await Swal.fire({
      title: 'Reset to Official Webpage Defaults?',
      text: 'This will restore all About Us sections from the official Bhaktivedanta Hospital website and overwrite current custom edits in the database.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Reset'
    });

    if (result.isConfirmed) {
      setSaving(true);
      try {
        const res = await resetAboutUsState();
        if (res) {
          setAboutState(res);
        } else {
          setAboutState(defaultAboutUsData);
        }
        Swal.fire('Reset Completed', 'All sections restored to official live website data.', 'success');
      } catch (err) {
        Swal.fire('Error', 'Could not reset data', 'error');
      } finally {
        setSaving(false);
      }
    }
  };

  // Helper updates
  const updateHospitalField = (field, val) => {
    setAboutState(prev => ({
      ...prev,
      aboutHospital: {
        ...prev.aboutHospital,
        [field]: val
      }
    }));
  };

  const updateChairmanField = (field, val) => {
    setAboutState(prev => ({
      ...prev,
      chairmansMessage: {
        ...prev.chairmansMessage,
        [field]: val
      }
    }));
  };

  const updatePrabhupadaField = (field, val) => {
    setAboutState(prev => ({
      ...prev,
      ourInspiration: {
        ...prev.ourInspiration,
        prabhupada: {
          ...prev.ourInspiration?.prabhupada,
          [field]: val
        }
      }
    }));
  };

  const updateRadhanathField = (field, val) => {
    setAboutState(prev => ({
      ...prev,
      ourInspiration: {
        ...prev.ourInspiration,
        radhanathSwami: {
          ...prev.ourInspiration?.radhanathSwami,
          [field]: val
        }
      }
    }));
  };

  // Vision, Mission & Values helpers
  const updateVMVRoot = (field, val) => {
    setAboutState(prev => ({
      ...prev,
      visionMissionValues: {
        ...prev.visionMissionValues,
        [field]: val
      }
    }));
  };

  const updateVMVSection = (section, field, val) => {
    setAboutState(prev => ({
      ...prev,
      visionMissionValues: {
        ...prev.visionMissionValues,
        [section]: {
          ...prev.visionMissionValues?.[section],
          [field]: val
        }
      }
    }));
  };
    const updateTrustRoot = (field, val) => {
      setAboutState(prev => ({
        ...prev,
        sriChaitanyaTrust: {
          ...prev.sriChaitanyaTrust,
          [field]: val
        }
      }));
    };

    const updateTrustAbout = (field, val) => {
      setAboutState(prev => ({
        ...prev,
        sriChaitanyaTrust: {
          ...prev.sriChaitanyaTrust,
          about: {
            ...prev.sriChaitanyaTrust?.about,
            [field]: val
          }
        }
      }));
    };

    const updateTrustGov = (field, val) => {
      setAboutState(prev => ({
        ...prev,
        sriChaitanyaTrust: {
          ...prev.sriChaitanyaTrust,
          governance: {
            ...prev.sriChaitanyaTrust?.governance,
            [field]: val
          }
        }
      }));
    };

    const handleAddVisionPoint = async () => {
      const currentPoints = aboutState.visionMissionValues?.vision?.points || [];
      const nextState = {
        ...aboutState,
        visionMissionValues: {
          ...aboutState.visionMissionValues,
          vision: {
            ...aboutState.visionMissionValues?.vision,
            points: [...currentPoints, 'New vision statement...']
          }
        }
      };
      await commitAndSave(nextState);
    };

    const handleUpdateVisionPoint = (idx, text) => {
      const currentPoints = [...(aboutState.visionMissionValues?.vision?.points || [])];
      currentPoints[idx] = text;
      updateVMVSection('vision', 'points', currentPoints);
    };

    const handleDeleteVisionPoint = async (idx) => {
      const currentPoints = (aboutState.visionMissionValues?.vision?.points || []).filter((_, i) => i !== idx);
      const nextState = {
        ...aboutState,
        visionMissionValues: {
          ...aboutState.visionMissionValues,
          vision: {
            ...aboutState.visionMissionValues?.vision,
            points: currentPoints
          }
        }
      };
      await commitAndSave(nextState, 'Vision statement removed from database!');
    };

    const handleAddValuePillar = async () => {
      const currentPillars = aboutState.visionMissionValues?.values?.pillars || [];
      const nextState = {
        ...aboutState,
        visionMissionValues: {
          ...aboutState.visionMissionValues,
          values: {
            ...aboutState.visionMissionValues?.values,
            pillars: [...currentPillars, 'New Core Value']
          }
        }
      };
      await commitAndSave(nextState);
    };

    const handleUpdateValuePillar = (idx, text) => {
      const currentPillars = [...(aboutState.visionMissionValues?.values?.pillars || [])];
      currentPillars[idx] = text;
      updateVMVSection('values', 'pillars', currentPillars);
    };

    const handleDeleteValuePillar = async (idx) => {
      const currentPillars = (aboutState.visionMissionValues?.values?.pillars || []).filter((_, i) => i !== idx);
      const nextState = {
        ...aboutState,
        visionMissionValues: {
          ...aboutState.visionMissionValues,
          values: {
            ...aboutState.visionMissionValues?.values,
            pillars: currentPillars
          }
        }
      };
      await commitAndSave(nextState, 'Value pillar removed from database!');
    };

    // Awards & Accreditation helpers
    const updateAwardsRoot = (field, val) => {
      setAboutState(prev => ({
        ...prev,
        awardsAccreditation: {
          ...prev.awardsAccreditation,
          [field]: val
        }
      }));
    };

    const updateAccreditationField = (field, val) => {
      setAboutState(prev => ({
        ...prev,
        awardsAccreditation: {
          ...prev.awardsAccreditation,
          accreditation: {
            ...prev.awardsAccreditation?.accreditation,
            [field]: val
          }
        }
      }));
    };

    const updateAwardsSubField = (field, val) => {
      setAboutState(prev => ({
        ...prev,
        awardsAccreditation: {
          ...prev.awardsAccreditation,
          awards: {
            ...prev.awardsAccreditation?.awards,
            [field]: val
          }
        }
      }));
    };

    const handleOpenAwardModal = (award = null) => {
      if (award) {
        setEditingAward(award);
        setAwardForm({ ...award });
      } else {
        setEditingAward(null);
        setAwardForm({
          id: Date.now(),
          title: '',
          imageUrl: ''
        });
      }
      setIsAwardModalOpen(true);
    };

    const handleSaveAward = async (e) => {
      e.preventDefault();
      if (!awardForm.title || !awardForm.imageUrl) {
        Swal.fire('Error', 'Award Title and Image URL are required', 'error');
        return;
      }

      let updatedItems = [...(aboutState.awardsAccreditation?.awards?.items || [])];
      if (editingAward) {
        updatedItems = updatedItems.map(item => item.id === editingAward.id ? { ...awardForm } : item);
      } else {
        updatedItems.push({ ...awardForm, id: awardForm.id || Date.now() });
      }

      const nextState = {
        ...aboutState,
        awardsAccreditation: {
          ...aboutState.awardsAccreditation,
          awards: {
            ...aboutState.awardsAccreditation?.awards,
            items: updatedItems
          }
        }
      };
      setIsAwardModalOpen(false);
      await commitAndSave(nextState, editingAward ? 'Award updated and saved to database!' : 'Award added and saved to database!');
    };

    const handleDeleteAward = (id) => {
      Swal.fire({
        title: 'Delete Award?',
        text: 'Are you sure you want to remove this award recognition?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626'
      }).then(async (res) => {
        if (res.isConfirmed) {
          const updatedItems = (aboutState.awardsAccreditation?.awards?.items || []).filter(item => item.id !== id);
          const nextState = {
            ...aboutState,
            awardsAccreditation: {
              ...aboutState.awardsAccreditation,
              awards: {
                ...aboutState.awardsAccreditation?.awards,
                items: updatedItems
              }
            }
          };
          await commitAndSave(nextState, 'Award removed from database!');
        }
      });
    };

    // Events & Hospital In News helpers
    const updateEventsNewsRoot = (field, val) => {
      setAboutState(prev => ({
        ...prev,
        eventsAndNews: {
          ...prev.eventsAndNews,
          [field]: val
        }
      }));
    };

    const handleOpenEventModal = (event = null) => {
      if (event) {
        setEditingEvent(event);
        setEventForm({ ...event });
      } else {
        setEditingEvent(null);
        setEventForm({
          id: Date.now(),
          title: '',
          imageUrl: '',
          description: '',
          link: ''
        });
      }
      setIsEventModalOpen(true);
    };

    const handleSaveEvent = async (e) => {
      e.preventDefault();
      if (!eventForm.title || !eventForm.imageUrl) {
        Swal.fire('Error', 'Event Title and Image URL are required', 'error');
        return;
      }

      let updatedEvents = [...(aboutState.eventsAndNews?.events || [])];
      if (editingEvent) {
        updatedEvents = updatedEvents.map(ev => ev.id === editingEvent.id ? { ...eventForm } : ev);
      } else {
        updatedEvents.push({ ...eventForm, id: eventForm.id || Date.now() });
      }

      const nextState = {
        ...aboutState,
        eventsAndNews: {
          ...aboutState.eventsAndNews,
          events: updatedEvents
        }
      };
      setIsEventModalOpen(false);
      await commitAndSave(nextState, editingEvent ? 'Event updated and saved to database!' : 'Event created and saved to database!');
    };

    const handleDeleteEvent = (id) => {
      Swal.fire({
        title: 'Delete Event?',
        text: 'Are you sure you want to remove this event item?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626'
      }).then(async (res) => {
        if (res.isConfirmed) {
          const updatedEvents = (aboutState.eventsAndNews?.events || []).filter(ev => ev.id !== id);
          const nextState = {
            ...aboutState,
            eventsAndNews: {
              ...aboutState.eventsAndNews,
              events: updatedEvents
            }
          };
          await commitAndSave(nextState, 'Event removed from database!');
        }
      });
    };

    const handleOpenNewsModal = (news = null) => {
      if (news) {
        setEditingNews(news);
        setNewsForm({ ...news });
      } else {
        setEditingNews(null);
        setNewsForm({
          id: Date.now(),
          title: '',
          imageUrl: '',
          link: ''
        });
      }
      setIsNewsModalOpen(true);
    };

    const handleSaveNews = async (e) => {
      e.preventDefault();
      if (!newsForm.title || !newsForm.imageUrl) {
        Swal.fire('Error', 'News Title and Image URL are required', 'error');
        return;
      }

      let updatedNews = [...(aboutState.eventsAndNews?.hospitalInNews || [])];
      if (editingNews) {
        updatedNews = updatedNews.map(n => n.id === editingNews.id ? { ...newsForm } : n);
      } else {
        updatedNews.push({ ...newsForm, id: newsForm.id || Date.now() });
      }

      const nextState = {
        ...aboutState,
        eventsAndNews: {
          ...aboutState.eventsAndNews,
          hospitalInNews: updatedNews
        }
      };
      setIsNewsModalOpen(false);
      await commitAndSave(nextState, editingNews ? 'News clipping updated and saved to database!' : 'News clipping added and saved to database!');
    };

    const handleDeleteNews = (id) => {
      Swal.fire({
        title: 'Delete News Clipping?',
        text: 'Are you sure you want to remove this news coverage item?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626'
      }).then(async (res) => {
        if (res.isConfirmed) {
          const updatedNews = (aboutState.eventsAndNews?.hospitalInNews || []).filter(n => n.id !== id);
          const nextState = {
            ...aboutState,
            eventsAndNews: {
              ...aboutState.eventsAndNews,
              hospitalInNews: updatedNews
            }
          };
          await commitAndSave(nextState, 'News clipping removed from database!');
        }
      });
    };

    // History timeline operations
    const handleOpenMilestoneModal = (milestone = null) => {
      if (milestone) {
        setEditingMilestone(milestone);
        setMilestoneForm({ ...milestone });
      } else {
        setEditingMilestone(null);
        setMilestoneForm({
          sr: (aboutState.history?.length || 0) + 1,
          year: new Date().getFullYear().toString(),
          title: '',
          location: 'Mira Road, Maharashtra',
          detail: ''
        });
      }
      setIsMilestoneModalOpen(true);
    };

    const handleSaveMilestone = async (e) => {
      e.preventDefault();
      if (!milestoneForm.year || !milestoneForm.title) {
        Swal.fire('Error', 'Year and Title are required', 'error');
        return;
      }

      let updatedHistory = [...(aboutState.history || [])];
      if (editingMilestone) {
        updatedHistory = updatedHistory.map(m => m.sr === editingMilestone.sr ? { ...milestoneForm } : m);
      } else {
        updatedHistory.push({
          ...milestoneForm,
          sr: updatedHistory.length + 1
        });
      }

      const nextState = { ...aboutState, history: updatedHistory };
      setIsMilestoneModalOpen(false);
      await commitAndSave(nextState, editingMilestone ? 'Milestone updated and saved to database!' : 'Milestone added and saved to database!');
    };

    const handleDeleteMilestone = (sr) => {
      Swal.fire({
        title: 'Delete Milestone?',
        text: 'Are you sure you want to delete this historical milestone?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626'
      }).then(async (res) => {
        if (res.isConfirmed) {
          const nextState = {
            ...aboutState,
            history: (aboutState.history || []).filter(m => m.sr !== sr)
          };
          await commitAndSave(nextState, 'Milestone deleted from database!');
        }
      });
    };

    // Logo element operations
    const handleOpenLogoModal = (element = null) => {
      if (element) {
        setEditingLogoElem(element);
        setLogoElemForm({ ...element });
      } else {
        setEditingLogoElem(null);
        setLogoElemForm({
          sr: `0${(aboutState.logo?.elements?.length || 0) + 1}`,
          name: '',
          color: '',
          description: ''
        });
      }
      setIsLogoModalOpen(true);
    };

    const handleSaveLogoElem = async (e) => {
      e.preventDefault();
      if (!logoElemForm.name || !logoElemForm.description) {
        Swal.fire('Error', 'Name and Description are required', 'error');
        return;
      }

      let updatedElements = [...(aboutState.logo?.elements || [])];
      if (editingLogoElem) {
        updatedElements = updatedElements.map(el => el.sr === editingLogoElem.sr ? { ...logoElemForm } : el);
      } else {
        updatedElements.push({ ...logoElemForm });
      }

      const nextState = {
        ...aboutState,
        logo: {
          ...aboutState.logo,
          elements: updatedElements
        }
      };
      setIsLogoModalOpen(false);
      await commitAndSave(nextState, editingLogoElem ? 'Logo element updated and saved to database!' : 'Logo element added and saved to database!');
    };

    const handleDeleteLogoElem = (sr) => {
      Swal.fire({
        title: 'Delete Logo Element?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626'
      }).then(async (res) => {
        if (res.isConfirmed) {
          const nextState = {
            ...aboutState,
            logo: {
              ...aboutState.logo,
              elements: (aboutState.logo?.elements || []).filter(el => el.sr !== sr)
            }
          };
          await commitAndSave(nextState, 'Logo element deleted from database!');
        }
      });
    };

    // Management Team Handlers
    const handleOpenTeamModal = (member = null) => {
      if (member) {
        setEditingTeamMember(member);
        setTeamForm({ ...member });
      } else {
        setEditingTeamMember(null);
        setTeamForm({
          id: Date.now(),
          name: '',
          designation: '',
          photoUrl: '',
          bio: ''
        });
      }
      setIsTeamModalOpen(true);
    };

    const handleSaveTeamMember = async (e) => {
      e.preventDefault();
      if (!teamForm.name || !teamForm.designation) {
        Swal.fire('Error', 'Name and Designation are required', 'error');
        return;
      }

      let updatedTeam = [...(aboutState.managementTeam || [])];
      if (editingTeamMember) {
        updatedTeam = updatedTeam.map(m => m.id === editingTeamMember.id ? { ...teamForm } : m);
      } else {
        updatedTeam.push({ ...teamForm, id: teamForm.id || Date.now() });
      }

      const nextState = {
        ...aboutState,
        managementTeam: updatedTeam
      };
      setIsTeamModalOpen(false);
      await commitAndSave(nextState, editingTeamMember ? 'Team member updated and saved to database!' : 'Team member added and saved to database!');
    };

    const handleDeleteTeamMember = (id) => {
      Swal.fire({
        title: 'Delete Team Member?',
        text: 'Are you sure you want to remove this leader from the management team?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626'
      }).then(async (res) => {
        if (res.isConfirmed) {
          const nextState = {
            ...aboutState,
            managementTeam: (aboutState.managementTeam || []).filter(m => m.id !== id)
          };
          await commitAndSave(nextState, 'Team member deleted from database!');
        }
      });
    };

    // New Developments Handlers
    const handleOpenDevModal = (dev = null) => {
      if (dev) {
        setEditingDev(dev);
        setDevForm({ ...dev });
      } else {
        setEditingDev(null);
        setDevForm({
          id: Date.now(),
          title: '',
          description: '',
          imageUrl: '',
          readMoreLink: ''
        });
      }
      setIsDevModalOpen(true);
    };

    const handleSaveDev = async (e) => {
      e.preventDefault();
      if (!devForm.title) {
        Swal.fire('Error', 'Title is required', 'error');
        return;
      }

      let updatedDevs = [...(aboutState.newDevelopments || [])];
      if (editingDev) {
        updatedDevs = updatedDevs.map(d => d.id === editingDev.id ? { ...devForm } : d);
      } else {
        updatedDevs.unshift({ ...devForm, id: devForm.id || Date.now() });
      }

      const nextState = {
        ...aboutState,
        newDevelopments: updatedDevs
      };
      setIsDevModalOpen(false);
      await commitAndSave(nextState, editingDev ? 'Development post updated and saved to database!' : 'Development post added and saved to database!');
    };

    const handleDeleteDev = (id) => {
      Swal.fire({
        title: 'Delete Development Post?',
        text: 'Are you sure you want to remove this development update?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626'
      }).then(async (res) => {
        if (res.isConfirmed) {
          const nextState = {
            ...aboutState,
            newDevelopments: (aboutState.newDevelopments || []).filter(d => d.id !== id)
          };
          await commitAndSave(nextState, 'Development post deleted from database!');
        }
      });
    };

    // Spiritual Advisors Handlers
    const handleOpenAdvisorModal = (advisor = null) => {
      if (advisor) {
        setEditingAdvisor(advisor);
        setAdvisorForm({ ...advisor });
      } else {
        setEditingAdvisor(null);
        setAdvisorForm({
          id: Date.now(),
          name: '',
          designation: 'Spiritual Advisor',
          photoUrl: '',
          bio: ''
        });
      }
      setIsAdvisorModalOpen(true);
    };

    const handleSaveAdvisor = async (e) => {
      e.preventDefault();
      if (!advisorForm.name) {
        Swal.fire('Error', 'Name is required', 'error');
        return;
      }

      let updatedAdvisors = [...(aboutState.spiritualAdvisors || [])];
      if (editingAdvisor) {
        updatedAdvisors = updatedAdvisors.map(a => a.id === editingAdvisor.id ? { ...advisorForm } : a);
      } else {
        updatedAdvisors.push({ ...advisorForm, id: advisorForm.id || Date.now() });
      }

      const nextState = {
        ...aboutState,
        spiritualAdvisors: updatedAdvisors
      };
      setIsAdvisorModalOpen(false);
      await commitAndSave(nextState, editingAdvisor ? 'Spiritual Advisor updated and saved to database!' : 'Spiritual Advisor added and saved to database!');
    };

    const handleDeleteAdvisor = (id) => {
      Swal.fire({
        title: 'Delete Spiritual Advisor?',
        text: 'Are you sure you want to remove this spiritual advisor from the website?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626'
      }).then(async (res) => {
        if (res.isConfirmed) {
          const nextState = {
            ...aboutState,
            spiritualAdvisors: (aboutState.spiritualAdvisors || []).filter(a => a.id !== id)
          };
          await commitAndSave(nextState, 'Spiritual Advisor deleted from database!');
        }
      });
    };

    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase tracking-wider">
                Hospital Profile & Heritage
              </span>
              <span className="text-xs text-slate-500 font-medium">Source: Official Live Website</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mt-2 flex items-center gap-2">
              <Building2 className="text-amber-600" size={28} />
              About Us Management Console
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage hospital overview, historical timeline, Chairman's message, inspirational founders and logo symbolism.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <a
              href="/about-us/about-hospital"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-semibold text-sm transition-all shadow-sm"
            >
              <ExternalLink size={16} />
              View Public Page
            </a>
            <button
              onClick={handleResetDefaults}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl font-semibold text-sm transition-all"
              title="Restore official website content"
            >
              <RotateCcw size={16} />
              Reset Defaults
            </button>
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <Save size={18} />
              {saving ? 'Saving to Database...' : 'Save All Changes'}
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          {[
            { id: 'aboutHospital', label: '1. About Hospital', icon: Building2 },
            { id: 'history', label: `2. History Timeline (${aboutState.history?.length || 0})`, icon: Calendar },
            { id: 'chairman', label: "3. Chairman's Message", icon: UserCheck },
            { id: 'inspiration', label: '4. Our Inspiration', icon: Sparkles },
            { id: 'logo', label: '5. Hospital Logo & Meaning', icon: Award },
            { id: 'visionMission', label: '6. Vision, Mission & Values', icon: Target },
            { id: 'awards', label: `7. Awards & Accreditation (${aboutState.awardsAccreditation?.awards?.items?.length || 0})`, icon: Trophy },
            { id: 'eventsNews', label: `8. Events & Hospital In News (${(aboutState.eventsAndNews?.events?.length || 0) + (aboutState.eventsAndNews?.hospitalInNews?.length || 0)})`, icon: Newspaper },
            { id: 'sriChaitanyaTrust', label: '9. Shri Chaitanya Health & Care Trust', icon: Heart },
            { id: 'managementTeam', label: `10. Our Management Team (${aboutState.managementTeam?.length || 0})`, icon: Users },
            { id: 'newDevelopments', label: `11. New Developments (${aboutState.newDevelopments?.length || 0})`, icon: TrendingUp },
            { id: 'spiritualAdvisors', label: `12. Spiritual Advisors (${aboutState.spiritualAdvisors?.length || 0})`, icon: Sparkles }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${isActive
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: ABOUT HOSPITAL */}
        {activeTab === 'aboutHospital' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-3">
                <Building2 size={20} className="text-orange-600" />
                General Hospital Profile & Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hospital Title</label>
                  <input
                    type="text"
                    value={aboutState.aboutHospital?.title || ''}
                    onChange={e => updateHospitalField('title', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-semibold focus:bg-white focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tagline / Motto</label>
                  <input
                    type="text"
                    value={aboutState.aboutHospital?.tagline || ''}
                    onChange={e => updateHospitalField('tagline', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-semibold focus:bg-white focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Accreditation Badge</label>
                <input
                  type="text"
                  value={aboutState.aboutHospital?.badge || ''}
                  onChange={e => updateHospitalField('badge', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-semibold focus:bg-white focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hero / Lead Intro</label>
                <textarea
                  rows={2}
                  value={aboutState.aboutHospital?.heroIntro || ''}
                  onChange={e => updateHospitalField('heroIntro', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-orange-500 outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Detailed About Paragraphs (Official Website Content)
                </label>
                {(aboutState.aboutHospital?.descriptionParagraphs || []).map((para, pIdx) => (
                  <div key={pIdx} className="mb-3 flex gap-2 items-start">
                    <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0 mt-1">
                      #{pIdx + 1}
                    </span>
                    <textarea
                      rows={3}
                      value={para}
                      onChange={e => {
                        const updated = [...(aboutState.aboutHospital?.descriptionParagraphs || [])];
                        updated[pIdx] = e.target.value;
                        updateHospitalField('descriptionParagraphs', updated);
                      }}
                      className="flex-1 px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-orange-500 outline-none leading-relaxed text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (aboutState.aboutHospital?.descriptionParagraphs || []).filter((_, i) => i !== pIdx);
                        updateHospitalField('descriptionParagraphs', updated);
                      }}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all mt-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...(aboutState.aboutHospital?.descriptionParagraphs || []), ''];
                    updateHospitalField('descriptionParagraphs', updated);
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all"
                >
                  <Plus size={14} /> Add Paragraph
                </button>
              </div>
            </div>

            {/* Key Features / Commitments */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <HeartHandshake size={20} className="text-orange-600" />
                  Core Commitments &amp; Key Highlights
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    const updated = [
                      ...(aboutState.aboutHospital?.features || []),
                      { title: 'New Highlight', description: 'Highlight description...' }
                    ];
                    updateHospitalField('features', updated);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-lg text-xs font-bold transition-all"
                >
                  <Plus size={14} /> Add Highlight
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(aboutState.aboutHospital?.features || []).map((feat, fIdx) => (
                  <div key={fIdx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 relative group">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={feat.title || ''}
                        onChange={e => {
                          const updated = [...aboutState.aboutHospital.features];
                          updated[fIdx].title = e.target.value;
                          updateHospitalField('features', updated);
                        }}
                        className="font-bold text-slate-800 bg-transparent border-b border-transparent focus:border-orange-500 outline-none w-full mr-2"
                        placeholder="Highlight Title"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = aboutState.aboutHospital.features.filter((_, i) => i !== fIdx);
                          updateHospitalField('features', updated);
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={feat.description || ''}
                      onChange={e => {
                        const updated = [...aboutState.aboutHospital.features];
                        updated[fIdx].description = e.target.value;
                        updateHospitalField('features', updated);
                      }}
                      className="w-full text-xs text-slate-600 bg-white border border-slate-200 rounded-lg p-2 focus:border-orange-500 outline-none"
                      placeholder="Highlight description..."
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HISTORY TIMELINE */}
        {activeTab === 'history' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Calendar size={20} className="text-orange-600" />
                  Hospital History Timeline (1986 to 2022)
                </h2>
                <p className="text-xs text-slate-500">
                  Chronological journey of outreach camps, hospitals, polyclinics, nursing school and major healthcare centres.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenMilestoneModal()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
              >
                <Plus size={16} /> Add Milestone Year
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 w-16 text-center">Sr</th>
                    <th className="py-3 px-4 w-28">Year</th>
                    <th className="py-3 px-4 w-60">Milestone Title</th>
                    <th className="py-3 px-4 w-48">Location</th>
                    <th className="py-3 px-4">Event Details</th>
                    <th className="py-3 px-4 w-28 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(aboutState.history || []).map((m, idx) => (
                    <tr key={idx} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3.5 px-4 text-center font-bold text-slate-400">{m.sr || idx + 1}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-md font-bold text-xs">
                          {m.year}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">{m.title}</td>
                      <td className="py-3.5 px-4 text-slate-600 text-xs font-medium">{m.location}</td>
                      <td className="py-3.5 px-4 text-slate-600 text-xs leading-relaxed">{m.detail}</td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenMilestoneModal(m)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit Milestone"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMilestone(m.sr)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Delete Milestone"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CHAIRMAN'S MESSAGE */}
        {activeTab === 'chairman' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-3">
              <UserCheck size={20} className="text-orange-600" />
              Message from the Desk of the Chairman
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Chairman Name</label>
                <input
                  type="text"
                  value={aboutState.chairmansMessage?.name || ''}
                  onChange={e => updateChairmanField('name', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-bold focus:bg-white focus:border-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Designation &amp; Trust</label>
                <input
                  type="text"
                  value={aboutState.chairmansMessage?.designation || ''}
                  onChange={e => updateChairmanField('designation', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-medium focus:bg-white focus:border-orange-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Key Quote / Highlights Banner</label>
              <input
                type="text"
                value={aboutState.chairmansMessage?.introQuote || ''}
                onChange={e => updateChairmanField('introQuote', e.target.value)}
                className="w-full px-4 py-2.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 font-semibold focus:bg-white focus:border-orange-500 outline-none italic"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Message Paragraphs</label>
              {(aboutState.chairmansMessage?.paragraphs || []).map((para, pIdx) => (
                <div key={pIdx} className="mb-3 flex gap-2 items-start">
                  <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0 mt-1">
                    #{pIdx + 1}
                  </span>
                  <textarea
                    rows={3}
                    value={para}
                    onChange={e => {
                      const updated = [...(aboutState.chairmansMessage?.paragraphs || [])];
                      updated[pIdx] = e.target.value;
                      updateChairmanField('paragraphs', updated);
                    }}
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:border-orange-500 outline-none leading-relaxed text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (aboutState.chairmansMessage?.paragraphs || []).filter((_, i) => i !== pIdx);
                      updateChairmanField('paragraphs', updated);
                    }}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all mt-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const updated = [...(aboutState.chairmansMessage?.paragraphs || []), ''];
                  updateChairmanField('paragraphs', updated);
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all"
              >
                <Plus size={14} /> Add Paragraph
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Closing Prayer</label>
              <textarea
                rows={2}
                value={aboutState.chairmansMessage?.closingPrayer || ''}
                onChange={e => updateChairmanField('closingPrayer', e.target.value)}
                className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-xl text-amber-900 font-medium focus:bg-white focus:border-orange-500 outline-none italic"
              />
            </div>
          </div>
        )}

        {/* TAB 4: OUR INSPIRATION */}
        {activeTab === 'inspiration' && (
          <div className="space-y-6">
            {/* Srila Prabhupada Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-3">
                <Sparkles size={20} className="text-amber-600" />
                1. His Divine Grace A.C. Bhaktivedanta Swami Prabhupada
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title</label>
                  <input
                    type="text"
                    value={aboutState.ourInspiration?.prabhupada?.title || ''}
                    onChange={e => updatePrabhupadaField('title', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-bold focus:bg-white focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={aboutState.ourInspiration?.prabhupada?.subtitle || ''}
                    onChange={e => updatePrabhupadaField('subtitle', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-semibold focus:bg-white focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Inspirational Quote</label>
                <textarea
                  rows={2}
                  value={aboutState.ourInspiration?.prabhupada?.quote || ''}
                  onChange={e => updatePrabhupadaField('quote', e.target.value)}
                  className="w-full px-4 py-2 bg-amber-50/50 border border-amber-200 rounded-xl text-amber-900 italic text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Biographical Paragraphs</label>
                {(aboutState.ourInspiration?.prabhupada?.paragraphs || []).map((para, pIdx) => (
                  <div key={pIdx} className="mb-3 flex gap-2 items-start">
                    <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0 mt-1">
                      #{pIdx + 1}
                    </span>
                    <textarea
                      rows={3}
                      value={para}
                      onChange={e => {
                        const updated = [...(aboutState.ourInspiration?.prabhupada?.paragraphs || [])];
                        updated[pIdx] = e.target.value;
                        updatePrabhupadaField('paragraphs', updated);
                      }}
                      className="flex-1 px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-orange-500 outline-none leading-relaxed"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (aboutState.ourInspiration?.prabhupada?.paragraphs || []).filter((_, i) => i !== pIdx);
                        updatePrabhupadaField('paragraphs', updated);
                      }}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all mt-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...(aboutState.ourInspiration?.prabhupada?.paragraphs || []), ''];
                    updatePrabhupadaField('paragraphs', updated);
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all"
                >
                  <Plus size={14} /> Add Bio Paragraph
                </button>
              </div>
            </div>

            {/* Radhanath Swami Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-3">
                <Sparkles size={20} className="text-orange-600" />
                2. Inspired by the Vision of H.H. Radhanath Swami Maharaj
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title</label>
                  <input
                    type="text"
                    value={aboutState.ourInspiration?.radhanathSwami?.title || ''}
                    onChange={e => updateRadhanathField('title', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-bold focus:bg-white focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={aboutState.ourInspiration?.radhanathSwami?.subtitle || ''}
                    onChange={e => updateRadhanathField('subtitle', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-semibold focus:bg-white focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Inspirational Quote</label>
                <textarea
                  rows={2}
                  value={aboutState.ourInspiration?.radhanathSwami?.quote || ''}
                  onChange={e => updateRadhanathField('quote', e.target.value)}
                  className="w-full px-4 py-2 bg-amber-50/50 border border-amber-200 rounded-xl text-amber-900 italic text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Biographical Paragraphs</label>
                {(aboutState.ourInspiration?.radhanathSwami?.paragraphs || []).map((para, pIdx) => (
                  <div key={pIdx} className="mb-3 flex gap-2 items-start">
                    <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0 mt-1">
                      #{pIdx + 1}
                    </span>
                    <textarea
                      rows={3}
                      value={para}
                      onChange={e => {
                        const updated = [...(aboutState.ourInspiration?.radhanathSwami?.paragraphs || [])];
                        updated[pIdx] = e.target.value;
                        updateRadhanathField('paragraphs', updated);
                      }}
                      className="flex-1 px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-orange-500 outline-none leading-relaxed"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (aboutState.ourInspiration?.radhanathSwami?.paragraphs || []).filter((_, i) => i !== pIdx);
                        updateRadhanathField('paragraphs', updated);
                      }}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all mt-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...(aboutState.ourInspiration?.radhanathSwami?.paragraphs || []), ''];
                    updateRadhanathField('paragraphs', updated);
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all"
                >
                  <Plus size={14} /> Add Bio Paragraph
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: LOGO & SYMBOLISM */}
        {activeTab === 'logo' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Award size={20} className="text-orange-600" />
                  Hospital Logo &amp; Sacred Symbolism
                </h2>
                <p className="text-xs text-slate-500">
                  Detailed anatomical symbolism of the hospital emblem (Lotus circle, base arc, petals, and human figure).
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenLogoModal()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
              >
                <Plus size={16} /> Add Logo Element
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Section Title</label>
                <input
                  type="text"
                  value={aboutState.logo?.title || ''}
                  onChange={e => setAboutState(prev => ({ ...prev, logo: { ...prev.logo, title: e.target.value } }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-bold focus:bg-white focus:border-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Section Subtitle</label>
                <input
                  type="text"
                  value={aboutState.logo?.subtitle || ''}
                  onChange={e => setAboutState(prev => ({ ...prev, logo: { ...prev.logo, subtitle: e.target.value } }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-semibold focus:bg-white focus:border-orange-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Intro Description</label>
              <textarea
                rows={2}
                value={aboutState.logo?.intro || ''}
                onChange={e => setAboutState(prev => ({ ...prev, logo: { ...prev.logo, intro: e.target.value } }))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-orange-500 outline-none"
              />
            </div>

            {/* Logo Elements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {(aboutState.logo?.elements || []).map((elem, idx) => (
                <div key={idx} className="p-5 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl shadow-sm space-y-3 relative group">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-md font-bold text-xs">
                      Element {elem.sr || idx + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenLogoModal(elem)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteLogoElem(elem.sr)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <h4 className="font-bold text-slate-800 text-base">{elem.name}</h4>
                  {elem.color && (
                    <span className="inline-block px-2 py-0.5 bg-slate-200 text-slate-700 text-[11px] font-semibold rounded">
                      Color: {elem.color}
                    </span>
                  )}
                  <p className="text-xs text-slate-600 leading-relaxed">{elem.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: VISION, MISSION, QUALITY POLICY & VALUES */}
        {activeTab === 'visionMission' && (
          <div className="space-y-6">
            {/* Main Title & Subtitle banner */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-3">
                <Target size={20} className="text-orange-600" />
                Vision, Mission, Quality Policy &amp; Values Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Section Title</label>
                  <input
                    type="text"
                    value={aboutState.visionMissionValues?.title || ''}
                    onChange={e => updateVMVRoot('title', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-bold focus:bg-white focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Section Subtitle</label>
                  <input
                    type="text"
                    value={aboutState.visionMissionValues?.subtitle || ''}
                    onChange={e => updateVMVRoot('subtitle', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-semibold focus:bg-white focus:border-orange-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 1. Our Vision Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Compass size={20} className="text-amber-600" />
                  1. Our Vision
                </h3>
                <button
                  type="button"
                  onClick={handleAddVisionPoint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-lg text-xs font-bold transition-all"
                >
                  <Plus size={14} /> Add Vision Point
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Card Heading</label>
                <input
                  type="text"
                  value={aboutState.visionMissionValues?.vision?.title || 'Our Vision'}
                  onChange={e => updateVMVSection('vision', 'title', e.target.value)}
                  className="w-full max-w-md px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-bold text-sm focus:bg-white focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Vision Statements / Bullet Points</label>
                <div className="space-y-3">
                  {(aboutState.visionMissionValues?.vision?.points || []).map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                        {idx + 1}
                      </span>
                      <textarea
                        rows={2}
                        value={point}
                        onChange={e => handleUpdateVisionPoint(idx, e.target.value)}
                        className="flex-1 px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-orange-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteVisionPoint(idx)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all mt-1"
                        title="Remove point"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Our Mission Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-3">
                <Target size={20} className="text-orange-600" />
                2. Our Mission
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Card Heading</label>
                <input
                  type="text"
                  value={aboutState.visionMissionValues?.mission?.title || 'Our Mission'}
                  onChange={e => updateVMVSection('mission', 'title', e.target.value)}
                  className="w-full max-w-md px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-bold text-sm focus:bg-white focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mission Statement (Quotation)</label>
                <textarea
                  rows={3}
                  value={aboutState.visionMissionValues?.mission?.statement || ''}
                  onChange={e => updateVMVSection('mission', 'statement', e.target.value)}
                  className="w-full px-4 py-3 bg-amber-50/40 border border-amber-200 rounded-xl text-amber-950 font-medium italic text-sm focus:bg-white focus:border-orange-500 outline-none leading-relaxed"
                  placeholder="With love and devotion we will offer..."
                />
              </div>
            </div>

            {/* 3. Quality Policy Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-3">
                <CheckCircle2 size={20} className="text-emerald-600" />
                3. Quality Policy
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Card Heading</label>
                <input
                  type="text"
                  value={aboutState.visionMissionValues?.qualityPolicy?.title || 'Quality Policy'}
                  onChange={e => updateVMVSection('qualityPolicy', 'title', e.target.value)}
                  className="w-full max-w-md px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-bold text-sm focus:bg-white focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Primary Summary (Initial Visible Text)</label>
                <textarea
                  rows={3}
                  value={aboutState.visionMissionValues?.qualityPolicy?.intro || ''}
                  onChange={e => updateVMVSection('qualityPolicy', 'intro', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-orange-500 outline-none"
                  placeholder="We at Bhaktivedanta Hospital &amp; Research Institute, are committed to serving..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Expanded Content (Shown on 'Read More')</label>
                <textarea
                  rows={3}
                  value={aboutState.visionMissionValues?.qualityPolicy?.fullText || ''}
                  onChange={e => updateVMVSection('qualityPolicy', 'fullText', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-orange-500 outline-none"
                  placeholder="qualified staff with spiritual understanding..."
                />
              </div>
            </div>

            {/* 4. Our Values Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-3">
                <HeartHandshake size={20} className="text-rose-600" />
                4. Our Values
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Card Heading</label>
                <input
                  type="text"
                  value={aboutState.visionMissionValues?.values?.title || 'Our Values'}
                  onChange={e => updateVMVSection('values', 'title', e.target.value)}
                  className="w-full max-w-md px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-bold text-sm focus:bg-white focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Introductory Text (Visible initially before Read More)</label>
                <textarea
                  rows={3}
                  value={aboutState.visionMissionValues?.values?.intro || ''}
                  onChange={e => updateVMVSection('values', 'intro', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Expanded Hospital Standards &amp; Philosophy (Shown on 'Read More')</label>
                <textarea
                  rows={6}
                  value={aboutState.visionMissionValues?.values?.fullText || ''}
                  onChange={e => updateVMVSection('values', 'fullText', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-orange-500 outline-none leading-relaxed"
                />
              </div>

              {/* Core Value Pillars */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Four Core Value Pillars
                  </label>
                  <button
                    type="button"
                    onClick={handleAddValuePillar}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-lg text-xs font-bold transition-all"
                  >
                    <Plus size={14} /> Add Pillar
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {(aboutState.visionMissionValues?.values?.pillars || []).map((pillar, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                      <input
                        type="text"
                        value={pillar}
                        onChange={e => handleUpdateValuePillar(pIdx, e.target.value)}
                        className="flex-1 bg-transparent text-sm font-semibold text-slate-800 outline-none px-1"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteValuePillar(pIdx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: AWARDS & ACCREDITATION */}
        {activeTab === 'awards' && (
          <div className="space-y-6">
            {/* Main Title Banner */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-3">
                <Trophy size={20} className="text-orange-600" />
                Awards &amp; Accreditation Management
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Page Section Title</label>
                <input
                  type="text"
                  value={aboutState.awardsAccreditation?.title || 'Awards & Accreditation'}
                  onChange={e => updateAwardsRoot('title', e.target.value)}
                  className="w-full max-w-md px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-bold focus:bg-white focus:border-orange-500 outline-none"
                />
              </div>
            </div>

            {/* Section 1: Accreditation */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-3">
                <CheckCircle2 size={20} className="text-emerald-600" />
                1. Accreditation (NABH &amp; ISQua Standards)
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Heading</label>
                <input
                  type="text"
                  value={aboutState.awardsAccreditation?.accreditation?.heading || 'Accreditation'}
                  onChange={e => updateAccreditationField('heading', e.target.value)}
                  className="w-full max-w-md px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-bold text-sm focus:bg-white focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Accreditation Statement / Description</label>
                <textarea
                  rows={4}
                  value={aboutState.awardsAccreditation?.accreditation?.description || ''}
                  onChange={e => updateAccreditationField('description', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-orange-500 outline-none leading-relaxed"
                  placeholder="Bhaktivedanta Hospital & Research Institute has been accredited by National Accreditation Board for Hospitals & Healthcare Providers (NABH)..."
                />
              </div>
            </div>

            {/* Section 2: Awards & Recognition Gallery */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Award size={20} className="text-amber-600" />
                    2. Awards &amp; Recognition Gallery ({aboutState.awardsAccreditation?.awards?.items?.length || 0})
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Card grid showcasing national &amp; international awards, honours, and stage felicitations.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenAwardModal()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md transition-all self-start sm:self-auto"
                >
                  <Plus size={16} /> Add New Award
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Gallery Heading</label>
                <input
                  type="text"
                  value={aboutState.awardsAccreditation?.awards?.heading || 'Awards & Recognition'}
                  onChange={e => updateAwardsSubField('heading', e.target.value)}
                  className="w-full max-w-md px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-bold text-sm focus:bg-white focus:border-orange-500 outline-none"
                />
              </div>

              {/* Awards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
                {(aboutState.awardsAccreditation?.awards?.items || []).map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-200 flex flex-col group relative"
                    style={{ minHeight: '260px' }}
                  >
                    {/* Image Backdrop */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                      style={{ backgroundImage: `url('${item.imageUrl}')` }}
                    />

                    {/* Actions overlay top right */}
                    <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10 bg-black/60 p-1 rounded-xl backdrop-blur-sm">
                      <button
                        type="button"
                        onClick={() => handleOpenAwardModal(item)}
                        className="p-1.5 text-blue-300 hover:text-white hover:bg-blue-600 rounded-lg transition-all"
                        title="Edit Award"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAward(item.id)}
                        className="p-1.5 text-rose-300 hover:text-white hover:bg-rose-600 rounded-lg transition-all"
                        title="Delete Award"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Bottom Text Banner */}
                    <div className="mt-auto relative z-10 bg-gradient-to-t from-black via-black/80 to-transparent p-4 pt-8">
                      <span className="text-[11px] font-bold text-orange-400 block mb-1">
                        Award #{idx + 1}
                      </span>
                      <p className="text-xs font-semibold text-white line-clamp-3 leading-snug">
                        {item.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: EVENTS & HOSPITAL IN NEWS */}
        {activeTab === 'eventsNews' && (
          <div className="space-y-6">
            {/* Main Title Banner */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-3">
                <Newspaper size={20} className="text-orange-600" />
                Events &amp; Hospital In News Management
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Page Section Title</label>
                <input
                  type="text"
                  value={aboutState.eventsAndNews?.title || 'Events & Hospital In News'}
                  onChange={e => updateEventsNewsRoot('title', e.target.value)}
                  className="w-full max-w-md px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-bold focus:bg-white focus:border-orange-500 outline-none"
                />
              </div>
            </div>

            {/* Sub-Tabs Switcher in Admin */}
            <div className="flex items-center gap-3 border-b pb-3">
              <button
                type="button"
                onClick={() => setEventsNewsSubTab('events')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${eventsNewsSubTab === 'events'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
              >
                Events ({aboutState.eventsAndNews?.events?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setEventsNewsSubTab('news')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${eventsNewsSubTab === 'news'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
              >
                Hospital In News ({aboutState.eventsAndNews?.hospitalInNews?.length || 0})
              </button>
            </div>

            {/* SUBTAB 1: EVENTS */}
            {eventsNewsSubTab === 'events' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      Hospital Events List ({aboutState.eventsAndNews?.events?.length || 0})
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Manage key hospital ceremonies, celebrations, conferences, and ward inaugurations.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenEventModal()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md transition-all self-start sm:self-auto"
                  >
                    <Plus size={16} /> Add New Event
                  </button>
                </div>

                <div className="space-y-4 pt-2">
                  {(aboutState.eventsAndNews?.events || []).map((event, idx) => (
                    <div
                      key={event.id || idx}
                      className="flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-amber-50/20 transition-all relative group"
                    >
                      {/* Thumbnail */}
                      <div className="w-full md:w-56 h-36 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0 relative">
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-full h-full object-cover"
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <span className="text-[11px] font-bold text-orange-600 uppercase">
                            Event #{idx + 1}
                          </span>
                          <h4 className="text-base font-bold text-slate-800 mt-1">
                            {event.title}
                          </h4>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {event.description}
                          </p>
                        </div>

                        {event.link && (
                          <div className="pt-2">
                            <a
                              href={event.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                            >
                              <ExternalLink size={13} /> Link: {event.link.slice(0, 45)}...
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex md:flex-col items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEventModal(event)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit Event"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Delete Event"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUBTAB 2: HOSPITAL IN NEWS */}
            {eventsNewsSubTab === 'news' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      Hospital In News Clippings ({aboutState.eventsAndNews?.hospitalInNews?.length || 0})
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Press coverage, news articles, and print media publications.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenNewsModal()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md transition-all self-start sm:self-auto"
                  >
                    <Plus size={16} /> Add News Clipping
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {(aboutState.eventsAndNews?.hospitalInNews || []).map((news, idx) => (
                    <div
                      key={news.id || idx}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-amber-50/30 transition-all flex flex-col sm:flex-row gap-3 relative group"
                    >
                      {/* Clipping Thumbnail */}
                      <div className="w-full sm:w-36 h-28 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                        <img
                          src={news.imageUrl}
                          alt="Clipping"
                          className="w-full h-full object-cover"
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-orange-600 uppercase">
                            Article #{idx + 1}
                          </span>
                          <h4 className="text-xs font-bold text-slate-800 mt-0.5 line-clamp-3 leading-snug">
                            {news.title}
                          </h4>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                          {news.link ? (
                            <a
                              href={news.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline"
                            >
                              <ExternalLink size={12} /> View PDF / Article
                            </a>
                          ) : (
                            <span className="text-[11px] text-slate-400">No external link</span>
                          )}

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenNewsModal(news)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteNews(news.id)}
                              className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 9: SHRI CHAITANYA HEALTH AND CARE TRUST */}
        {activeTab === 'sriChaitanyaTrust' && (
          <div className="space-y-6">
            {/* Header & Overview Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Heart size={20} className="text-orange-600" />
                  Shri Chaitanya Health and Care Trust (CST)
                </h2>
                <a
                  href="/about-us/sri-chaitanya-health-care-and-trust-cst"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-lg text-xs font-bold border border-orange-200 transition-all"
                >
                  <ExternalLink size={14} /> Open Public CST Page
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Trust Name</label>
                  <input
                    type="text"
                    value={aboutState.sriChaitanyaTrust?.title || ''}
                    onChange={e => updateTrustRoot('title', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-semibold focus:bg-white focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subtitle / Motto</label>
                  <input
                    type="text"
                    value={aboutState.sriChaitanyaTrust?.subtitle || ''}
                    onChange={e => updateTrustRoot('subtitle', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-semibold focus:bg-white focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hero Banner Image URL</label>
                <input
                  type="text"
                  value={aboutState.sriChaitanyaTrust?.bannerUrl || ''}
                  onChange={e => updateTrustRoot('bannerUrl', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">About Heading</label>
                <input
                  type="text"
                  value={aboutState.sriChaitanyaTrust?.about?.heading || ''}
                  onChange={e => updateTrustAbout('heading', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-semibold focus:bg-white focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Trust Mission &amp; Overview Description</label>
                <textarea
                  rows={3}
                  value={aboutState.sriChaitanyaTrust?.about?.description || ''}
                  onChange={e => updateTrustAbout('description', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-orange-500 outline-none"
                />
              </div>
            </div>

            {/* Statutory Registrations Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <h3 className="text-base font-bold text-slate-800 border-b pb-2">
                Statutory Approvals &amp; Registrations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(aboutState.sriChaitanyaTrust?.about?.regDetails || []).map((reg, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-700 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                    <span>{reg}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Governance PDF Documents Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <h3 className="text-base font-bold text-slate-800 border-b pb-2">
                Governance, Awards &amp; Journey PDFs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Board of Trustees PDF</label>
                  <input
                    type="text"
                    value={aboutState.sriChaitanyaTrust?.governance?.boardOfTrusteesPdf || ''}
                    onChange={e => updateTrustGov('boardOfTrusteesPdf', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Awards &amp; Recognition PDF</label>
                  <input
                    type="text"
                    value={aboutState.sriChaitanyaTrust?.governance?.awardsPdf || ''}
                    onChange={e => updateTrustGov('awardsPdf', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Our Journey PDF</label>
                  <input
                    type="text"
                    value={aboutState.sriChaitanyaTrust?.governance?.journeyPdf || ''}
                    onChange={e => updateTrustGov('journeyPdf', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: OUR MANAGEMENT TEAM */}
        {activeTab === 'managementTeam' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Users size={20} className="text-orange-600" />
                    Our Management Team ({aboutState.managementTeam?.length || 0})
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage leadership trustees, directors, superintendent and departmental HOD profiles shown on the public page.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href="/about-us/our-management-team"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                  >
                    <ExternalLink size={14} /> View Public Team Page
                  </a>
                  <button
                    type="button"
                    onClick={() => handleOpenTeamModal()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                  >
                    <Plus size={16} /> Add Team Member
                  </button>
                </div>
              </div>

              {/* Grid of Team Members */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
                {(aboutState.managementTeam || []).map((member, idx) => (
                  <div
                    key={member.id || idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-amber-50/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-orange-100 border-2 border-orange-400 flex-shrink-0">
                          {member.photoUrl ? (
                            <img
                              src={member.photoUrl}
                              alt={member.name}
                              className="w-full h-full object-cover"
                              onError={e => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-orange-600 font-bold text-xs">
                              {member.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-800 truncate">
                            {member.name}
                          </h4>
                          <p className="text-xs font-semibold text-orange-600 truncate">
                            {member.designation}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {member.bio || 'No bio specified.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-slate-200/60">
                      <button
                        type="button"
                        onClick={() => handleOpenTeamModal(member)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-semibold flex items-center gap-1"
                        title="Edit Member"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTeamMember(member.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center gap-1"
                        title="Delete Member"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 11: NEW DEVELOPMENTS & UPDATES */}
        {activeTab === 'newDevelopments' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <TrendingUp size={20} className="text-orange-600" />
                    New Developments &amp; Updates ({aboutState.newDevelopments?.length || 0})
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage hospital clinical symposiums, equipment inaugurations, medical camps, and community updates.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href="/about-us/new-developments-updates"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                  >
                    <ExternalLink size={14} /> View Public Updates Page
                  </a>
                  <button
                    type="button"
                    onClick={() => handleOpenDevModal()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                  >
                    <Plus size={16} /> Add Development Post
                  </button>
                </div>
              </div>

              {/* Grid of Development Posts */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-6">
                {(aboutState.newDevelopments || []).map((dev, idx) => (
                  <div
                    key={dev.id || idx}
                    className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="w-full h-36 bg-slate-100 overflow-hidden">
                        <img
                          src={dev.imageUrl}
                          alt={dev.title}
                          className="w-full h-full object-cover"
                          onError={e => {
                            e.target.src = 'https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/banner/17037550688385.png';
                          }}
                        />
                      </div>

                      <div className="p-4">
                        <h4 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug mb-1.5">
                          {dev.title.replace(/&amp;/g, '&').replace(/&quot;/g, '"')}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                          {dev.description.replace(/&amp;/g, '&').replace(/&#039;/g, "'")}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between">
                      {dev.readMoreLink ? (
                        <a
                          href={dev.readMoreLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-orange-600 hover:underline inline-flex items-center gap-1"
                        >
                          <ExternalLink size={12} /> Read More
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400">No external link</span>
                      )}

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenDevModal(dev)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDev(dev.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 12: OUR SPIRITUAL ADVISORS */}
        {activeTab === 'spiritualAdvisors' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Sparkles size={20} className="text-orange-600" />
                    Our Spiritual Advisors ({aboutState.spiritualAdvisors?.length || 0})
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage spiritual mentors and advisors providing devotional guidance, ethics, and Vedic wisdom to the hospital.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href="/about-us/spiritual-advisors"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                  >
                    <ExternalLink size={14} /> View Public Page
                  </a>
                  <button
                    type="button"
                    onClick={() => handleOpenAdvisorModal()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                  >
                    <Plus size={16} /> Add Spiritual Advisor
                  </button>
                </div>
              </div>

              {/* Grid of Spiritual Advisors */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                {(aboutState.spiritualAdvisors || []).map((advisor, idx) => (
                  <div
                    key={advisor.id || idx}
                    className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-orange-300 hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-orange-50 border border-orange-200 flex-shrink-0 flex items-center justify-center">
                          {advisor.photoUrl ? (
                            <img
                              src={advisor.photoUrl}
                              alt={advisor.name}
                              className="w-full h-full object-cover"
                              onError={e => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <Sparkles size={24} className="text-orange-500" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-base leading-snug">
                            {advisor.name}
                          </h4>
                          <span className="text-xs font-semibold text-orange-600">
                            {advisor.designation || 'Spiritual Advisor'}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {advisor.bio || 'No biography text provided.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                      <span className="text-[11px] text-slate-400 font-medium">
                        Advisor #{idx + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenAdvisorModal(advisor)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit Advisor"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAdvisor(advisor.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete Advisor"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MILESTONE EDIT MODAL */}
        {isMilestoneModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <h3 className="text-lg font-bold text-slate-800">
                {editingMilestone ? 'Edit Historical Milestone' : 'Add New Historical Milestone'}
              </h3>
              <form onSubmit={handleSaveMilestone} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Year *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1998"
                      value={milestoneForm.year}
                      onChange={e => setMilestoneForm({ ...milestoneForm, year: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Mira Road, Maharashtra"
                      value={milestoneForm.location}
                      onChange={e => setMilestoneForm({ ...milestoneForm, location: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Milestone Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Inauguration of Cancer Centre"
                    value={milestoneForm.title}
                    onChange={e => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Event Detail &amp; Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe the milestone event..."
                    value={milestoneForm.detail}
                    onChange={e => setMilestoneForm({ ...milestoneForm, detail: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsMilestoneModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold shadow"
                  >
                    Save Milestone
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* LOGO ELEMENT EDIT MODAL */}
        {isLogoModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <h3 className="text-lg font-bold text-slate-800">
                {editingLogoElem ? 'Edit Logo Element' : 'Add Logo Element'}
              </h3>
              <form onSubmit={handleSaveLogoElem} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Order / Sr</label>
                    <input
                      type="text"
                      value={logoElemForm.sr}
                      onChange={e => setLogoElemForm({ ...logoElemForm, sr: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Element Color</label>
                    <input
                      type="text"
                      placeholder="e.g. Saffron / Medical Blue"
                      value={logoElemForm.color}
                      onChange={e => setLogoElemForm({ ...logoElemForm, color: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Element Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Outer Circle (Lotus Shape)"
                    value={logoElemForm.name}
                    onChange={e => setLogoElemForm({ ...logoElemForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Symbolic Meaning &amp; Description *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Explain what this part of the emblem signifies..."
                    value={logoElemForm.description}
                    onChange={e => setLogoElemForm({ ...logoElemForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsLogoModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold shadow"
                  >
                    Save Logo Element
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* AWARD ITEM EDIT MODAL */}
        {isAwardModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Trophy size={20} className="text-orange-600" />
                {editingAward ? 'Edit Award Recognition' : 'Add New Award Recognition'}
              </h3>
              <form onSubmit={handleSaveAward} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Award Image URL *</label>
                  <input
                    type="text"
                    required
                    placeholder="https://... or /awards/..."
                    value={awardForm.imageUrl}
                    onChange={e => setAwardForm({ ...awardForm, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:border-orange-500"
                  />
                </div>

                {/* Live Preview */}
                {awardForm.imageUrl && (
                  <div className="relative rounded-xl overflow-hidden h-36 bg-slate-100 border border-slate-200">
                    <img
                      src={awardForm.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={e => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-[10px] text-white rounded font-bold">
                      Image Preview
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Award Title &amp; Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Cyber Security Excellence Awards 2022 Presented For Best..."
                    value={awardForm.title}
                    onChange={e => setAwardForm({ ...awardForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-medium outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAwardModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold shadow"
                  >
                    Save Award
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EVENT ITEM EDIT MODAL */}
        {isEventModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Calendar size={20} className="text-orange-600" />
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h3>
              <form onSubmit={handleSaveEvent} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dietetics Department Celebrated The 2nd National..."
                    value={eventForm.title}
                    onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Event Thumbnail Image URL *</label>
                  <input
                    type="text"
                    required
                    placeholder="https://... or /events/..."
                    value={eventForm.imageUrl}
                    onChange={e => setEventForm({ ...eventForm, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:border-orange-500"
                  />
                </div>

                {/* Live Preview */}
                {eventForm.imageUrl && (
                  <div className="relative rounded-xl overflow-hidden h-36 bg-slate-100 border border-slate-200">
                    <img
                      src={eventForm.imageUrl}
                      alt="Event Preview"
                      className="w-full h-full object-cover"
                      onError={e => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-[10px] text-white rounded font-bold">
                      Image Preview
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description / Summary</label>
                  <textarea
                    rows={3}
                    placeholder="Short description of the event..."
                    value={eventForm.description}
                    onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-medium outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Article / Read More Link</label>
                  <input
                    type="text"
                    placeholder="https://... (URL to full article or video)"
                    value={eventForm.link}
                    onChange={e => setEventForm({ ...eventForm, link: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEventModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold shadow"
                  >
                    Save Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* HOSPITAL IN NEWS EDIT MODAL */}
        {isNewsModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Newspaper size={20} className="text-orange-600" />
                {editingNews ? 'Edit News Clipping' : 'Add News Clipping'}
              </h3>
              <form onSubmit={handleSaveNews} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">News Headline / Caption *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Local Newspaper Coverage Of The Inauguration Of Second Cathlab..."
                    value={newsForm.title}
                    onChange={e => setNewsForm({ ...newsForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Newspaper Clipping Image URL *</label>
                  <input
                    type="text"
                    required
                    placeholder="https://... or /news/..."
                    value={newsForm.imageUrl}
                    onChange={e => setNewsForm({ ...newsForm, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:border-orange-500"
                  />
                </div>

                {/* Live Preview */}
                {newsForm.imageUrl && (
                  <div className="relative rounded-xl overflow-hidden h-36 bg-slate-100 border border-slate-200">
                    <img
                      src={newsForm.imageUrl}
                      alt="News Preview"
                      className="w-full h-full object-contain bg-white"
                      onError={e => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-[10px] text-white rounded font-bold">
                      Clipping Preview
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">PDF Download / Article URL</label>
                  <input
                    type="text"
                    placeholder="https://... (URL to PDF clipping or web article)"
                    value={newsForm.link}
                    onChange={e => setNewsForm({ ...newsForm, link: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsNewsModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold shadow"
                  >
                    Save News
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TEAM MEMBER EDIT MODAL */}
        {isTeamModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Users size={20} className="text-orange-600" />
                {editingTeamMember ? 'Edit Management Leader Profile' : 'Add New Management Leader'}
              </h3>
              <form onSubmit={handleSaveTeamMember} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name &amp; Honorifics *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Ajay Sankhe"
                    value={teamForm.name}
                    onChange={e => setTeamForm({ ...teamForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Designation &amp; Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Director & Founder Member"
                    value={teamForm.designation}
                    onChange={e => setTeamForm({ ...teamForm, designation: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Photo Image URL</label>
                  <input
                    type="text"
                    placeholder="https://... (URL to portrait image)"
                    value={teamForm.photoUrl}
                    onChange={e => setTeamForm({ ...teamForm, photoUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:border-orange-500"
                  />
                </div>

                {/* Photo Preview */}
                {teamForm.photoUrl && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                      <img
                        src={teamForm.photoUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    </div>
                    <div className="text-xs text-slate-500">
                      Preview of leaf card avatar portrait
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Biography &amp; Professional Background</label>
                  <textarea
                    rows={4}
                    placeholder="Enter professional biography, experience, academic credentials..."
                    value={teamForm.bio}
                    onChange={e => setTeamForm({ ...teamForm, bio: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsTeamModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold shadow"
                  >
                    Save Leader
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DEVELOPMENT POST EDIT MODAL */}
        {isDevModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp size={20} className="text-orange-600" />
                {editingDev ? 'Edit Development Update' : 'Add New Development Update'}
              </h3>
              <form onSubmit={handleSaveDev} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Post Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5th Annual Critical Care Symposium"
                    value={devForm.title}
                    onChange={e => setDevForm({ ...devForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cover Image URL</label>
                  <input
                    type="text"
                    placeholder="https://... (URL to post image)"
                    value={devForm.imageUrl}
                    onChange={e => setDevForm({ ...devForm, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:border-orange-500"
                  />
                </div>

                {/* Image Preview */}
                {devForm.imageUrl && (
                  <div className="h-32 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={devForm.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description / Summary Excerpt</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of the event, milestone or medical conference..."
                    value={devForm.description}
                    onChange={e => setDevForm({ ...devForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Read More Article / Link URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={devForm.readMoreLink}
                    onChange={e => setDevForm({ ...devForm, readMoreLink: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsDevModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold shadow"
                  >
                    Save Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* SPIRITUAL ADVISOR EDIT MODAL */}
        {isAdvisorModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <h3 className="text-lg font-bold text-slate-800">
                {editingAdvisor ? 'Edit Spiritual Advisor' : 'Add New Spiritual Advisor'}
              </h3>
              <form onSubmit={handleSaveAdvisor} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Advisor Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. H.G Shyamananda Das"
                    value={advisorForm.name}
                    onChange={e => setAdvisorForm({ ...advisorForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Spiritual Advisor"
                    value={advisorForm.designation}
                    onChange={e => setAdvisorForm({ ...advisorForm, designation: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Portrait Image URL</label>
                  <input
                    type="text"
                    placeholder="https://... or /images/..."
                    value={advisorForm.photoUrl}
                    onChange={e => setAdvisorForm({ ...advisorForm, photoUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:border-orange-500"
                  />
                </div>

                {advisorForm.photoUrl && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <img
                      src={advisorForm.photoUrl}
                      alt="Preview"
                      className="w-12 h-12 rounded-lg object-cover border"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    <span className="text-xs text-slate-500 font-medium">Portrait preview</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Biography / Guidance Profile</label>
                  <textarea
                    rows={5}
                    placeholder="Enter comprehensive background, outreach, and role..."
                    value={advisorForm.bio}
                    onChange={e => setAdvisorForm({ ...advisorForm, bio: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm leading-relaxed outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAdvisorModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold shadow"
                  >
                    Save Advisor
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
}