import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Users,
  Building2,
  BookOpen,
  Mail,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  ExternalLink,
  RotateCcw,
  Video,
  Award,
  FlaskConical,
  X,
  HeartHandshake,
  Settings,
  Calendar,
  Sparkles,
  FileText,
  Clock,
  Filter,
  ShieldCheck,
  Stethoscope,
  Activity,
  Layers,
  MapPin,
  PhoneCall
} from 'lucide-react';
import {
  getEducationResearchState,
  saveEducationResearchState,
  getDnbInquiries,
  submitDnbInquiry,
  updateDnbInquiry,
  deleteDnbInquiry,
  getEducationPrograms,
  createEducationProgram,
  deleteEducationProgram
} from '../../../utils/api';
import { dnbProgramData } from '../../../data/dnbProgramData';
import Swal from 'sweetalert2';

// 12 Section Identifiers
const SECTION_TABS = [
  { id: 'dnb', name: 'DNB Program', icon: GraduationCap, badge: 'NBE Accredited' },
  { id: 'nursing', name: 'Nursing Program', icon: Stethoscope, badge: 'MNC & INC' },
  { id: 'cme', name: 'CME', icon: Calendar, badge: 'MMC Credit' },
  { id: 'cne', name: 'CNE', icon: Activity, badge: 'MNC Points' },
  { id: 'spiritualCare', name: 'Spiritual Care Course', icon: HeartHandshake, badge: 'Since 2010' },
  { id: 'clinicalResearch', name: 'Clinical Research (PGCR)', icon: BookOpen, badge: '15 Months' },
  { id: 'clinicalTrials', name: 'Clinical Trials', icon: FlaskConical, badge: 'NABH Accredited' },
  { id: 'ethics', name: 'Ethics Committee', icon: ShieldCheck, badge: 'CDSCO & DHR' },
  { id: 'publications', name: 'Publications', icon: FileText, badge: 'Indexed Theses' },
  { id: 'accreditation', name: 'Government Accreditation', icon: Award, badge: 'Govt Approved' },
  { id: 'customPrograms', name: 'New Education Courses', icon: Layers, badge: 'Dynamic Programs' },
  { id: 'inquiries', name: 'Course Inquiries', icon: Mail, badge: 'Admissions' }
];

const EducationResearch = () => {
  const [eduData, setEduData] = useState(dnbProgramData);
  const [inquiries, setInquiries] = useState([]);
  const [customPrograms, setCustomPrograms] = useState([]);
  const [activeSection, setActiveSection] = useState('dnb');
  const [dnbSubtab, setDnbSubtab] = useState('programs');
  const [searchTerm, setSearchTerm] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('all');

  // Dynamic Education Creation Modal
  const [isNewEducationModalOpen, setIsNewEducationModalOpen] = useState(false);
  const [newEducationForm, setNewEducationForm] = useState({
    title: '',
    category: 'Post Doctoral Fellowship',
    badge: 'Accredited',
    duration: '1 Year',
    seats: 2,
    eligibility: '',
    overview: '',
    highlights: '',
    faculty: '',
    phone: '022 2845 8000',
    email: 'education@bhaktivedantahospital.com'
  });

  // ==========================================
  // MODALS STATE
  // ==========================================

  // 1. DNB Hero & Video Form
  const [isDnbHeroModalOpen, setIsDnbHeroModalOpen] = useState(false);
  const [dnbHeroForm, setDnbHeroForm] = useState({
    title: '',
    heroIntro: '',
    quote: '',
    directorVideoTitle: '',
    directorVideoUrl: ''
  });

  // 2. DNB Program Modal
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [programForm, setProgramForm] = useState({
    id: '',
    title: '',
    seats: 2,
    about: '',
    aboutHighlight: '',
    integratedMedicine: '',
    academicSchedule: []
  });

  // 3. DNB Faculty Modal
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [facultyForm, setFacultyForm] = useState({
    specialtyId: '',
    name: '',
    designation: '',
    qualification: '',
    experience: '',
    image: ''
  });

  // 4. DNB Facility Modal
  const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [facilityForm, setFacilityForm] = useState({
    title: '',
    image: '',
    caption: ''
  });

  // 5. Nursing Course Modal
  const [isNursingModalOpen, setIsNursingModalOpen] = useState(false);
  const [nursingForm, setNursingForm] = useState({
    title: '',
    subtitle: '',
    overview: '',
    established: '',
    intakeSeats: 30,
    duration: '',
    affiliation: '',
    phone: '',
    email: '',
    campus: ''
  });

  // 6. Generic Simple Modal (for CME, CNE, Spiritual, PGCR, Trials, Accreditation)
  const [isGenericModalOpen, setIsGenericModalOpen] = useState(false);
  const [genericModalConfig, setGenericModalConfig] = useState({
    title: '',
    type: '', // 'cme-item', 'cne-focus', 'pgcr-module', 'trial-infra', 'acc-badge', etc.
    fields: []
  });
  const [genericFormData, setGenericFormData] = useState({});

  // 7. Manual Inquiry Modal
  const [isManualInquiryModalOpen, setIsManualInquiryModalOpen] = useState(false);
  const [manualInquiryForm, setManualInquiryForm] = useState({
    candidateName: '',
    email: '',
    phone: '',
    specialty: 'DNB General Medicine',
    neetScore: '',
    message: ''
  });

  // ==========================================
  // DATA LOADING & PERSISTENCE
  // ==========================================

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
      const liveData = await getEducationResearchState(dnbProgramData);
      if (liveData) {
        setEduData(liveData);
      }
      const [inqList, progs] = await Promise.all([
        getDnbInquiries([]),
        getEducationPrograms([])
      ]);
      setInquiries(Array.isArray(inqList) ? inqList : []);
      setCustomPrograms(Array.isArray(progs) && progs.length > 0 ? progs : (liveData?.customPrograms || []));
    } catch (err) {
      console.warn('Error loading education research state:', err);
    }
  };

  const handleCreateNewEducation = async (e) => {
    e.preventDefault();
    if (!newEducationForm.title.trim()) {
      Swal.fire('Error', 'Education Program Title is required', 'error');
      return;
    }

    try {
      const payload = {
        ...newEducationForm,
        slug: newEducationForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      };
      await createEducationProgram(payload);
      await loadData();
      setIsNewEducationModalOpen(false);
      Swal.fire({
        icon: 'success',
        title: 'Education Program Created!',
        text: `"${payload.title}" is now saved to PostgreSQL database and live at /education/${payload.slug}`,
        confirmButtonColor: '#ea580c'
      });
      setActiveSection('customPrograms');
    } catch (err) {
      console.error('Error creating education program:', err);
      Swal.fire('Error', 'Failed to create education program in database', 'error');
    }
  };

  const handleDeleteCustomProgram = async (id, title) => {
    const res = await Swal.fire({
      title: `Delete "${title}"?`,
      text: 'This will remove the education program and all its records permanently from the database.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Yes, Delete from Database'
    });
    if (res.isConfirmed) {
      try {
        await deleteEducationProgram(id);
        await loadData();
        Swal.fire('Deleted', 'Program removed from database.', 'success');
      } catch (err) {
        Swal.fire('Error', 'Could not delete program', 'error');
      }
    }
  };

  const persistData = async (updated) => {
    setEduData(updated);
    try {
      await saveEducationResearchState(updated);
      Swal.fire({
        icon: 'success',
        title: 'Saved to Database',
        text: 'All changes are permanently stored in the backend database.',
        timer: 1400,
        showConfirmButton: false
      });
    } catch (err) {
      console.error('Database save error:', err);
      Swal.fire('Error', 'Could not save to database', 'error');
    }
  };

  // ==========================================
  // DNB SECTION HANDLERS
  // ==========================================
  const handleSaveDnbHero = async (e) => {
    e.preventDefault();
    const updated = {
      ...eduData,
      title: dnbHeroForm.title.trim() || 'DNB Program',
      heroIntro: dnbHeroForm.heroIntro.trim(),
      quote: dnbHeroForm.quote.trim(),
      directorVideo: {
        title: dnbHeroForm.directorVideoTitle.trim() || "From the Director's Desk",
        embedUrl: dnbHeroForm.directorVideoUrl.trim()
      }
    };
    await persistData(updated);
    setIsDnbHeroModalOpen(false);
  };

  const handleSaveProgram = async (e) => {
    e.preventDefault();
    if (!programForm.title.trim()) return;

    const seatsNum = Number(programForm.seats) || 1;
    let updatedSpecs = [...(eduData.specialities || [])];
    let updatedMatrix = [...(eduData.seatsMatrix || [])];

    if (editingProgram) {
      updatedSpecs = updatedSpecs.map((s) =>
        s.id === editingProgram.id ? { ...s, ...programForm, seats: seatsNum } : s
      );
      updatedMatrix = updatedMatrix.map((m) =>
        m.specialty === editingProgram.title || m.id === editingProgram.id
          ? { ...m, specialty: programForm.title, seats: seatsNum }
          : m
      );
    } else {
      const newSpec = {
        ...programForm,
        seats: seatsNum,
        faculties: [],
        videos: []
      };
      updatedSpecs.push(newSpec);
      updatedMatrix.push({
        id: updatedMatrix.length + 1,
        specialty: programForm.title,
        seats: seatsNum
      });
    }

    await persistData({
      ...eduData,
      specialities: updatedSpecs,
      seatsMatrix: updatedMatrix
    });
    setIsProgramModalOpen(false);
  };

  const handleDeleteProgram = async (specId, specTitle) => {
    const res = await Swal.fire({
      title: 'Delete DNB Program?',
      text: `Remove "${specTitle}" from database?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Delete'
    });

    if (res.isConfirmed) {
      const updatedSpecs = (eduData.specialities || []).filter((s) => s.id !== specId);
      const updatedMatrix = (eduData.seatsMatrix || []).filter(
        (m) => m.specialty !== specTitle && m.id !== specId
      );
      await persistData({
        ...eduData,
        specialities: updatedSpecs,
        seatsMatrix: updatedMatrix
      });
    }
  };

  // ==========================================
  // NURSING HANDLERS
  // ==========================================
  const openEditNursing = () => {
    const n = eduData.nursingProgram || {};
    setNursingForm({
      title: n.title || 'Rosalind S. Teton School of Nursing',
      subtitle: n.subtitle || 'Excellence in Nursing Education & Clinical Compassion',
      overview: n.overview || '',
      established: n.established || '2005',
      intakeSeats: n.intakeSeats || 30,
      duration: n.duration || '3 Years (Full Time)',
      affiliation: n.affiliation || 'MNC & INC',
      phone: n.contactInfo?.phone || '8291103508',
      email: n.contactInfo?.email || 'bhaktinursingschool@yahoo.co.in',
      campus: n.contactInfo?.campus || 'Sheth P. V. Doshi Hospital, Mira Road (E), Thane'
    });
    setIsNursingModalOpen(true);
  };

  const handleSaveNursing = async (e) => {
    e.preventDefault();
    const updatedNursing = {
      ...(eduData.nursingProgram || {}),
      title: nursingForm.title.trim(),
      subtitle: nursingForm.subtitle.trim(),
      overview: nursingForm.overview.trim(),
      established: nursingForm.established.trim(),
      intakeSeats: Number(nursingForm.intakeSeats) || 30,
      duration: nursingForm.duration.trim(),
      affiliation: nursingForm.affiliation.trim(),
      contactInfo: {
        campus: nursingForm.campus.trim(),
        phone: nursingForm.phone.trim(),
        email: nursingForm.email.trim()
      }
    };

    await persistData({
      ...eduData,
      nursingProgram: updatedNursing
    });
    setIsNursingModalOpen(false);
  };

  // ==========================================
  // CME & CNE HANDLERS
  // ==========================================
  const handleAddCmeItem = async (newCme) => {
    const currentList = eduData.cmeProgram?.upcomingAndRecent || [];
    const updatedCmeProgram = {
      ...(eduData.cmeProgram || {}),
      upcomingAndRecent: [newCme, ...currentList]
    };
    await persistData({ ...eduData, cmeProgram: updatedCmeProgram });
  };

  const handleDeleteCmeItem = async (idx) => {
    const currentList = (eduData.cmeProgram?.upcomingAndRecent || []).filter((_, i) => i !== idx);
    await persistData({
      ...eduData,
      cmeProgram: { ...(eduData.cmeProgram || {}), upcomingAndRecent: currentList }
    });
  };

  // ==========================================
  // NURSING COURSE HANDLERS
  // ==========================================
    const handleAddNursingCourse = async (newCourse) => {
      const courses = eduData.nursingProgram?.courses || [];
      const updated = {
        ...eduData,
        nursingProgram: {
          ...(eduData.nursingProgram || {}),
          courses: [...courses, newCourse]
        }
      };
      await persistData(updated);
    };

    const handleDeleteNursingCourse = async (idx) => {
      const courses = (eduData.nursingProgram?.courses || []).filter((_, i) => i !== idx);
      const updated = {
        ...eduData,
        nursingProgram: {
          ...(eduData.nursingProgram || {}),
          courses
        }
      };
      await persistData(updated);
    };

    const handleEditNursingInfo = async (info) => {
      const updated = {
        ...eduData,
        nursingProgram: {
          ...(eduData.nursingProgram || {}),
          ...info
        }
      };
      await persistData(updated);
    };

    // ==========================================
    // CNE HANDLERS
    // ==========================================
    const handleAddCneFocus = async (newItem) => {
      const list = eduData.cneProgram?.focusAreas || [];
      const updated = {
        ...eduData,
        cneProgram: {
          ...(eduData.cneProgram || {}),
          focusAreas: [...list, newItem]
        }
      };
      await persistData(updated);
    };

    const handleDeleteCneFocus = async (idx) => {
      const list = (eduData.cneProgram?.focusAreas || []).filter((_, i) => i !== idx);
      const updated = {
        ...eduData,
        cneProgram: {
          ...(eduData.cneProgram || {}),
          focusAreas: list
        }
      };
      await persistData(updated);
    };

    // ==========================================
    // SPIRITUAL CARE HANDLERS
    // ==========================================
    const handleAddSpiritualDimension = async (newDim) => {
      const dims = eduData.spiritualCareCourse?.dimensions || [];
      const updated = {
        ...eduData,
        spiritualCareCourse: {
          ...(eduData.spiritualCareCourse || {}),
          dimensions: [...dims, newDim]
        }
      };
      await persistData(updated);
    };

    const handleDeleteSpiritualDimension = async (idx) => {
      const dims = (eduData.spiritualCareCourse?.dimensions || []).filter((_, i) => i !== idx);
      const updated = {
        ...eduData,
        spiritualCareCourse: {
          ...(eduData.spiritualCareCourse || {}),
          dimensions: dims
        }
      };
      await persistData(updated);
    };

    const handleEditSpiritualCourse = async (info) => {
      const updated = {
        ...eduData,
        spiritualCareCourse: {
          ...(eduData.spiritualCareCourse || {}),
          ...info
        }
      };
      await persistData(updated);
    };

    // ==========================================
    // CLINICAL RESEARCH (PGCR) HANDLERS
    // ==========================================
    const handleAddPgcrModule = async (newModule) => {
      const modules = eduData.clinicalResearchCourse?.modules || [];
      const updated = {
        ...eduData,
        clinicalResearchCourse: {
          ...(eduData.clinicalResearchCourse || {}),
          modules: [...modules, newModule]
        }
      };
      await persistData(updated);
    };

    const handleDeletePgcrModule = async (idx) => {
      const modules = (eduData.clinicalResearchCourse?.modules || []).filter((_, i) => i !== idx);
      const updated = {
        ...eduData,
        clinicalResearchCourse: {
          ...(eduData.clinicalResearchCourse || {}),
          modules
        }
      };
      await persistData(updated);
    };

    const handleEditPgcrDetails = async (details) => {
      const updated = {
        ...eduData,
        clinicalResearchCourse: {
          ...(eduData.clinicalResearchCourse || {}),
          ...details
        }
      };
      await persistData(updated);
    };

    // ==========================================
    // CLINICAL TRIALS HANDLERS
    // ==========================================
    const handleAddTrialFacility = async (newFac) => {
      const infra = eduData.clinicalTrials?.infrastructure || [];
      const updated = {
        ...eduData,
        clinicalTrials: {
          ...(eduData.clinicalTrials || {}),
          infrastructure: [...infra, newFac]
        }
      };
      await persistData(updated);
    };

    const handleDeleteTrialFacility = async (idx) => {
      const infra = (eduData.clinicalTrials?.infrastructure || []).filter((_, i) => i !== idx);
      const updated = {
        ...eduData,
        clinicalTrials: {
          ...(eduData.clinicalTrials || {}),
          infrastructure: infra
        }
      };
      await persistData(updated);
    };

    const handleAddTrialArea = async (area) => {
      const areas = eduData.clinicalTrials?.therapeuticAreas || [];
      const updated = {
        ...eduData,
        clinicalTrials: {
          ...(eduData.clinicalTrials || {}),
          therapeuticAreas: [...areas, area]
        }
      };
      await persistData(updated);
    };

    const handleDeleteTrialArea = async (idx) => {
      const areas = (eduData.clinicalTrials?.therapeuticAreas || []).filter((_, i) => i !== idx);
      const updated = {
        ...eduData,
        clinicalTrials: {
          ...(eduData.clinicalTrials || {}),
          therapeuticAreas: areas
        }
      };
      await persistData(updated);
    };

    const handleEditClinicalTrialsStats = async (stats) => {
      const updated = {
        ...eduData,
        clinicalTrials: {
          ...(eduData.clinicalTrials || {}),
          ...stats
        }
      };
      await persistData(updated);
    };

    // ==========================================
    // ETHICS COMMITTEE HANDLERS
    // ==========================================
    const handleAddEthicsMember = async (newMem) => {
      const currentMembers = eduData.research?.ethicsCommittee || [];
      const updated = {
        ...eduData,
        research: {
          ...(eduData.research || {}),
          ethicsCommittee: [...currentMembers, newMem]
        }
      };
      await persistData(updated);
    };

    const handleDeleteEthicsMember = async (sr) => {
      const currentMembers = (eduData.research?.ethicsCommittee || []).filter((m) => m.sr !== sr);
      const updated = {
        ...eduData,
        research: {
          ...(eduData.research || {}),
          ethicsCommittee: currentMembers
        }
      };
      await persistData(updated);
    };

    const handleAddEthicsCommittee = async (newComm) => {
      const comms = eduData.ethicsCommittee?.committees || [];
      const updated = {
        ...eduData,
        ethicsCommittee: {
          ...(eduData.ethicsCommittee || {}),
          committees: [...comms, newComm]
        }
      };
      await persistData(updated);
    };

    const handleDeleteEthicsCommittee = async (id) => {
      const comms = (eduData.ethicsCommittee?.committees || []).filter((c) => c.id !== id);
      const updated = {
        ...eduData,
        ethicsCommittee: {
          ...(eduData.ethicsCommittee || {}),
          committees: comms
        }
      };
      await persistData(updated);
    };

    // ==========================================
    // PUBLICATIONS HANDLERS
    // ==========================================
    const handleAddPublication = async (newPub) => {
      const pubs = eduData.research?.publications || [];
      const updated = {
        ...eduData,
        research: {
          ...(eduData.research || {}),
          publications: [newPub, ...pubs]
        }
      };
      await persistData(updated);
    };

    const handleDeletePublication = async (sr) => {
      const pubs = (eduData.research?.publications || []).filter((p) => p.sr !== sr);
      const updated = {
        ...eduData,
        research: {
          ...(eduData.research || {}),
          publications: pubs
        }
      };
      await persistData(updated);
    };

    // ==========================================
    // ACCREDITATION HANDLERS
    // ==========================================
    const handleAddAccreditation = async (newBadge) => {
      const badges = eduData.governmentAccreditation?.badges || [];
      const updated = {
        ...eduData,
        governmentAccreditation: {
          ...(eduData.governmentAccreditation || {}),
          badges: [...badges, newBadge]
        }
      };
      await persistData(updated);
    };

    const handleDeleteAccreditation = async (idx) => {
      const badges = (eduData.governmentAccreditation?.badges || []).filter((_, i) => i !== idx);
      const updated = {
        ...eduData,
        governmentAccreditation: {
          ...(eduData.governmentAccreditation || {}),
          badges
        }
      };
      await persistData(updated);
    };

    const handleSaveManualInquiry = async (e) => {
      e.preventDefault();
      if (!manualInquiryForm.candidateName.trim() || !manualInquiryForm.email.trim()) {
        Swal.fire('Error', 'Name and Email are required', 'error');
        return;
      }

      try {
        await submitDnbInquiry(manualInquiryForm);
        const inqList = await getDnbInquiries([]);
        setInquiries(inqList);
        setIsManualInquiryModalOpen(false);
        Swal.fire('Success', 'Inquiry logged in database.', 'success');
      } catch (err) {
        Swal.fire('Error', 'Could not save inquiry', 'error');
      }
    };

    const handleUpdateInquiryStatus = async (inqId, newStatus) => {
      await updateDnbInquiry(inqId, { status: newStatus });
      const inqList = await getDnbInquiries([]);
      setInquiries(inqList);
    };

    const handleDeleteInquiry = async (inqId) => {
      const res = await Swal.fire({
        title: 'Delete Inquiry?',
        text: 'Remove this inquiry from database?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Delete'
      });
      if (res.isConfirmed) {
        await deleteDnbInquiry(inqId);
        const inqList = await getDnbInquiries([]);
        setInquiries(inqList);
      }
    };

    // Reset all to database defaults
    const handleResetDefaults = async () => {
      const res = await Swal.fire({
        title: 'Reset All 10 Education & Research Modules?',
        text: 'This will restore all default data for DNB, Nursing, CME, CNE, Spiritual Care, Clinical Research, Trials, and Accreditations.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#ea580c',
        confirmButtonText: 'Yes, Restore Defaults'
      });
      if (res.isConfirmed) {
        try {
          await fetch('http://localhost:5000/api/education-research/reset', { method: 'POST' });
          await loadData();
          Swal.fire('Restored', 'Database restored to hospital defaults.', 'success');
        } catch (err) {
          await persistData(dnbProgramData);
        }
      }
    };

    return (
      <div className="space-y-6 font-sans text-slate-800 pb-16">
        {/* Top Banner Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <GraduationCap className="text-orange-600" size={30} />
              Education &amp; Medical Research Master Console
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Database management console covering all 10 programs from start to end (DNB, Nursing, CME, CNE, Clinical Research, Trials, IEC &amp; Accreditations).
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 transition shadow-2xs"
            >
              <RotateCcw size={14} />
              Reset Database Defaults
            </button>
            <button
              type="button"
              onClick={() => {
                setNewEducationForm({
                  title: '',
                  category: 'Post Doctoral Fellowship',
                  badge: 'Accredited',
                  duration: '1 Year',
                  seats: 2,
                  eligibility: '',
                  overview: '',
                  highlights: '',
                  faculty: '',
                  phone: '022 2845 8000',
                  email: 'education@bhaktivedantahospital.com'
                });
                setIsNewEducationModalOpen(true);
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg flex items-center gap-1.5 transition shadow-2xs"
            >
              <Plus size={15} />
              Create New Education Program
            </button>
            <a
              href="/education/dnb-program"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 transition shadow-2xs"
            >
              <ExternalLink size={14} />
              Open Public Portal
            </a>
          </div>
        </div>

        {/* Primary Section Selector (All 10 Programs + Inquiries) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-2.5 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs font-semibold">
            {SECTION_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`p-3 rounded-xl flex flex-col items-start gap-1 transition text-left relative ${isActive
                      ? 'bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-sm'
                      : 'bg-slate-50/70 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                    }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <Icon size={18} className={isActive ? 'text-white' : 'text-orange-600'} />
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-800'
                        }`}
                    >
                      {tab.badge}
                    </span>
                  </div>
                  <span className="font-bold text-xs mt-1 truncate w-full">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
          VIEW 1: DNB POSTGRADUATE PROGRAM
          ========================================================================= */}
        {activeSection === 'dnb' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="text-orange-600" size={20} />
                  DNB Postgraduate Medical Residency Program
                </h3>
                <p className="text-xs text-slate-500">
                  Manage 7 accredited specialty courses, seats matrix, clinical faculties, and facilities.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setDnbHeroForm({
                      title: eduData.title || '',
                      heroIntro: eduData.heroIntro || '',
                      quote: eduData.quote || '',
                      directorVideoTitle: eduData.directorVideo?.title || '',
                      directorVideoUrl: eduData.directorVideo?.embedUrl || ''
                    });
                    setIsDnbHeroModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition"
                >
                  <Settings size={14} className="text-orange-600" />
                  Hero &amp; Video Settings
                </button>
                <button
                  onClick={() => {
                    setEditingProgram(null);
                    setProgramForm({
                      id: `dnb-${Date.now()}`,
                      title: '',
                      seats: 2,
                      about: '',
                      aboutHighlight: '',
                      integratedMedicine: '',
                      academicSchedule: [
                        { day: 'Monday', schedule: 'Bedside Clinics & Ward Teaching' },
                        { day: 'Tuesday', schedule: 'Grand Rounds & Case Presentation' },
                        { day: 'Wednesday', schedule: 'Faculty Teaching & Seminars' },
                        { day: 'Thursday', schedule: 'Department Audit & Mortality Meet' },
                        { day: 'Friday', schedule: 'Journal Club & Subject Review' },
                        { day: 'Saturday', schedule: 'Thesis Update & Clinical Audit' }
                      ]
                    });
                    setIsProgramModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg flex items-center gap-1.5 transition shadow-2xs"
                >
                  <Plus size={14} /> Add DNB Specialty
                </button>
              </div>
            </div>

            {/* DNB Specialties Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Specialty Program</th>
                    <th className="px-4 py-3 text-center">Accredited Seats</th>
                    <th className="px-4 py-3">Department Overview Excerpt</th>
                    <th className="px-4 py-3 text-center">Faculties</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(eduData.specialities || []).map((spec, idx) => (
                    <tr key={spec.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3 font-semibold text-slate-500">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 text-sm">{spec.title}</div>
                        <div className="text-[10px] text-slate-400">ID: {spec.id}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-bold rounded-full border border-blue-200 text-xs">
                          {spec.seats} {spec.seats === 1 ? 'Seat' : 'Seats'}
                        </span>
                      </td>
                      <td className="px-4 py-3 max-w-xs text-slate-600 truncate">{spec.about}</td>
                      <td className="px-4 py-3 text-center font-bold text-slate-700">
                        {spec.faculties ? spec.faculties.length : 0} Doctors
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingProgram(spec);
                              setProgramForm({ ...spec });
                              setIsProgramModalOpen(true);
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit specialty"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteProgram(spec.id, spec.title)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            title="Delete specialty"
                          >
                            <Trash2 size={14} />
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

        {/* =========================================================================
          VIEW 2: NURSING PROGRAM (Rosalind S. Teton School of Nursing)
          ========================================================================= */}
        {activeSection === 'nursing' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Stethoscope className="text-orange-600" size={20} />
                  Rosalind S. Teton School of Nursing
                </h3>
                <p className="text-xs text-slate-500">
                  Manage nursing school accreditation, G.N.M. diploma courses, intake seats, and clinical training.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/education/nursing-program"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition"
                >
                  <ExternalLink size={13} /> View Live Nursing Page
                </a>
                <button
                  onClick={openEditNursing}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition"
                >
                  <Edit2 size={13} /> Edit School Details
                </button>
                <button
                  onClick={() => {
                    Swal.fire({
                      title: 'Add New Nursing Course / Diploma',
                      html: `
                        <input id="sw-n-name" class="swal2-input" placeholder="Course Name (e.g. GNM / B.Sc Nursing)">
                        <input id="sw-n-dur" class="swal2-input" placeholder="Duration (e.g. 3 Years)">
                        <input id="sw-n-seats" class="swal2-input" placeholder="Seats (e.g. 30 Seats)">
                        <input id="sw-n-elig" class="swal2-input" placeholder="Eligibility Criteria">
                        <textarea id="sw-n-desc" class="swal2-textarea" placeholder="Course description and clinical focus"></textarea>
                      `,
                      focusConfirm: false,
                      showCancelButton: true,
                      confirmButtonText: 'Add to Database',
                      confirmButtonColor: '#ea580c',
                      preConfirm: () => {
                        const name = document.getElementById('sw-n-name').value;
                        if (!name) {
                          Swal.showValidationMessage('Course Name is required');
                          return false;
                        }
                        return {
                          name,
                          duration: document.getElementById('sw-n-dur').value || '3 Years',
                          seats: document.getElementById('sw-n-seats').value || '30 Seats',
                          eligibility: document.getElementById('sw-n-elig').value || '10+2 Any Stream',
                          description: document.getElementById('sw-n-desc').value || 'Bedside clinical training diploma.'
                        };
                      }
                    }).then((res) => {
                      if (res.isConfirmed && res.value) {
                        handleAddNursingCourse(res.value);
                      }
                    });
                  }}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg flex items-center gap-1.5 transition shadow-2xs"
                >
                  <Plus size={14} /> Add Nursing Course
                </button>
                <button
                  onClick={() => {
                    const np = eduData.nursingProgram || {};
                    Swal.fire({
                      title: 'Edit Nursing School Information',
                      html: `
                        <label style="display:block;text-align:left;font-weight:bold;margin-top:10px;font-size:12px;">Established Year:</label>
                        <input id="sw-np-est" class="swal2-input" style="margin:5px 0;" value="${np.established || '2005'}">
                        <label style="display:block;text-align:left;font-weight:bold;margin-top:10px;font-size:12px;">Annual Intake Seats:</label>
                        <input id="sw-np-intake" class="swal2-input" type="number" style="margin:5px 0;" value="${np.intakeSeats || 30}">
                        <label style="display:block;text-align:left;font-weight:bold;margin-top:10px;font-size:12px;">Affiliation Bodies:</label>
                        <input id="sw-np-aff" class="swal2-input" style="margin:5px 0;" value="${np.affiliation || 'MNC & INC'}">
                        <label style="display:block;text-align:left;font-weight:bold;margin-top:10px;font-size:12px;">Campus Phone:</label>
                        <input id="sw-np-phone" class="swal2-input" style="margin:5px 0;" value="${np.contactInfo?.phone || '8291103508'}">
                        <label style="display:block;text-align:left;font-weight:bold;margin-top:10px;font-size:12px;">School Overview & Mission:</label>
                        <textarea id="sw-np-over" class="swal2-textarea" style="margin:5px 0;">${np.overview || ''}</textarea>
                      `,
                      focusConfirm: false,
                      showCancelButton: true,
                      confirmButtonText: 'Save to Database',
                      confirmButtonColor: '#ea580c',
                      preConfirm: () => {
                        return {
                          established: document.getElementById('sw-np-est').value,
                          intakeSeats: Number(document.getElementById('sw-np-intake').value) || 30,
                          affiliation: document.getElementById('sw-np-aff').value,
                          contactInfo: {
                            ...(np.contactInfo || {}),
                            phone: document.getElementById('sw-np-phone').value
                          },
                          overview: document.getElementById('sw-np-over').value
                        };
                      }
                    }).then((res) => {
                      if (res.isConfirmed && res.value) {
                        handleEditNursingInfo(res.value);
                      }
                    });
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition"
                >
                  <Edit2 size={13} /> Edit School Info
                </button>
              </div>
            </div>

            {/* Nursing Snapshot Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-semibold">Established</span>
                <div className="text-xl font-black text-slate-900 mt-1">
                  {eduData.nursingProgram?.established || '2005'}
                </div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-semibold">Annual Intake</span>
                <div className="text-xl font-black text-orange-600 mt-1">
                  {eduData.nursingProgram?.intakeSeats || 30} Seats
                </div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-semibold">Affiliation</span>
                <div className="text-xs font-bold text-blue-700 mt-1">
                  {eduData.nursingProgram?.affiliation || 'MNC & INC'}
                </div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-semibold">Campus Phone</span>
                <div className="text-xs font-bold text-slate-800 mt-1 truncate">
                  {eduData.nursingProgram?.contactInfo?.phone || '8291103508'}
                </div>
              </div>
            </div>

            {/* School Overview */}
            <div className="p-4 bg-orange-50/50 border border-orange-200 rounded-xl space-y-1.5 text-xs">
              <span className="font-bold text-orange-950 uppercase tracking-wide">School Mission &amp; Overview</span>
              <p className="text-slate-700 leading-relaxed">{eduData.nursingProgram?.overview}</p>
            </div>

            {/* Courses List */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-800">Nursing Courses &amp; Programs</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {(eduData.nursingProgram?.courses || []).map((c, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{c.name}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-800 font-bold rounded">
                          {c.seats} Seats
                        </span>
                        <button
                          onClick={() => handleDeleteNursingCourse(idx)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded"
                          title="Delete course"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-600">{c.description}</p>
                    <div className="pt-2 border-t border-slate-200 text-slate-500">
                      <strong>Eligibility:</strong> {c.eligibility}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
          VIEW 3: CME (Continuing Medical Education)
          ========================================================================= */}
        {activeSection === 'cme' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="text-orange-600" size={20} />
                  Continuing Medical Education (CME)
                </h3>
                <p className="text-xs text-slate-500">
                  Maharashtra Medical Council (MMC) accredited clinical conferences, symposia and credit hours.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/education/cme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition"
                >
                  <ExternalLink size={13} /> View Live CME Page
                </a>
                <button
                  onClick={() => {
                    Swal.fire({
                      title: 'Add New CME Conference',
                      html: `
                      <input id="swal-topic" class="swal2-input" placeholder="Conference Topic">
                      <input id="swal-date" class="swal2-input" placeholder="Date (e.g. April 2024)">
                      <input id="swal-credit" class="swal2-input" placeholder="Credit Points (e.g. 2 MMC Points)">
                      <input id="swal-faculty" class="swal2-input" placeholder="Key Faculty / Dept">
                    `,
                      focusConfirm: false,
                      showCancelButton: true,
                      confirmButtonText: 'Add to Database',
                      confirmButtonColor: '#ea580c',
                      preConfirm: () => {
                        return {
                          topic: document.getElementById('swal-topic').value,
                          date: document.getElementById('swal-date').value,
                          creditHours: document.getElementById('swal-credit').value,
                          faculty: document.getElementById('swal-faculty').value
                        };
                      }
                    }).then((res) => {
                      if (res.isConfirmed && res.value.topic) {
                        handleAddCmeItem(res.value);
                      }
                    });
                  }}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg flex items-center gap-1.5 transition shadow-2xs"
                >
                  <Plus size={14} /> Add CME Conference
                </button>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase">
                  <tr>
                    <th className="px-4 py-3">CME Conference Topic</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-center">Credit Points</th>
                    <th className="px-4 py-3">Faculty / Department</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(eduData.cmeProgram?.upcomingAndRecent || []).map((cme, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3 font-bold text-slate-900">{cme.topic}</td>
                      <td className="px-4 py-3 text-slate-600">{cme.date}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded border border-blue-200 text-[11px]">
                          {cme.creditHours}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{cme.faculty}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDeleteCmeItem(idx)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded"
                          title="Delete conference"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
          VIEW 4: CNE (Continuing Nursing Education)
          ========================================================================= */}
        {activeSection === 'cne' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="text-orange-600" size={20} />
                  Continuing Nursing Education (CNE)
                </h3>
                <p className="text-xs text-slate-500">
                  Maharashtra Nursing Council (MNC) recognized clinical nursing skill workshops.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/education/cne"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition"
                >
                  <ExternalLink size={13} /> View Live CNE Page
                </a>
                <button
                  onClick={() => {
                    Swal.fire({
                      title: 'Add CNE Training Focus Area',
                      html: `
                        <input id="sw-cne-t" class="swal2-input" placeholder="Training Focus Area Title">
                        <textarea id="sw-cne-d" class="swal2-textarea" placeholder="Clinical competencies & nursing procedures"></textarea>
                      `,
                      focusConfirm: false,
                      showCancelButton: true,
                      confirmButtonText: 'Add to Database',
                      confirmButtonColor: '#ea580c',
                      preConfirm: () => {
                        const title = document.getElementById('sw-cne-t').value;
                        if (!title) {
                          Swal.showValidationMessage('Title is required');
                          return false;
                        }
                        return {
                          title,
                          desc: document.getElementById('sw-cne-d').value || ''
                        };
                      }
                    }).then((res) => {
                      if (res.isConfirmed && res.value) {
                        handleAddCneFocus(res.value);
                      }
                    });
                  }}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg flex items-center gap-1.5 transition shadow-2xs"
                >
                  <Plus size={14} /> Add CNE Area
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {(eduData.cneProgram?.focusAreas || []).map((fa, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{fa.title}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded text-[10px]">MNC Accredited</span>
                      <button
                        onClick={() => handleDeleteCneFocus(idx)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded"
                        title="Delete CNE Area"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{fa.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
          VIEW 5: SPIRITUAL CARE COURSE
          ========================================================================= */}
        {activeSection === 'spiritualCare' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <HeartHandshake className="text-orange-600" size={20} />
                  Spiritual Care Certificate Course (Since 2010)
                </h3>
                <p className="text-xs text-slate-500">
                  Equipping doctors, nurses and counselors with holistic spiritual bedside healing skills.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/education/spiritual-care-course"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition"
                >
                  <ExternalLink size={13} /> View Live Course Page
                </a>
                <button
                  onClick={() => {
                    const sc = eduData.spiritualCareCourse || {};
                    Swal.fire({
                      title: 'Edit Spiritual Care Overview & Quote',
                      html: `
                        <label style="display:block;text-align:left;font-weight:bold;margin-top:10px;font-size:12px;">Philosophical Quote:</label>
                        <textarea id="sw-sc-quote" class="swal2-textarea" style="margin:5px 0;">${sc.quote || ''}</textarea>
                        <label style="display:block;text-align:left;font-weight:bold;margin-top:10px;font-size:12px;">Course Overview:</label>
                        <textarea id="sw-sc-over" class="swal2-textarea" style="margin:5px 0;">${sc.overview || ''}</textarea>
                        <label style="display:block;text-align:left;font-weight:bold;margin-top:10px;font-size:12px;">Course Eligibility:</label>
                        <input id="sw-sc-elig" class="swal2-input" style="margin:5px 0;" value="${sc.eligibility || ''}">
                      `,
                      focusConfirm: false,
                      showCancelButton: true,
                      confirmButtonText: 'Save to Database',
                      confirmButtonColor: '#ea580c',
                      preConfirm: () => {
                        return {
                          quote: document.getElementById('sw-sc-quote').value,
                          overview: document.getElementById('sw-sc-over').value,
                          eligibility: document.getElementById('sw-sc-elig').value
                        };
                      }
                    }).then((res) => {
                      if (res.isConfirmed && res.value) {
                        handleEditSpiritualCourse(res.value);
                      }
                    });
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition"
                >
                  <Edit2 size={13} /> Edit Quote &amp; Info
                </button>
                <button
                  onClick={() => {
                    Swal.fire({
                      title: 'Add Core Spiritual Care Dimension',
                      html: `
                        <input id="sw-sc-dtitle" class="swal2-input" placeholder="Dimension Title (e.g. Physical Dimension)">
                        <textarea id="sw-sc-ddesc" class="swal2-textarea" placeholder="Dimension description and healing modalities"></textarea>
                      `,
                      focusConfirm: false,
                      showCancelButton: true,
                      confirmButtonText: 'Add to Database',
                      confirmButtonColor: '#ea580c',
                      preConfirm: () => {
                        const title = document.getElementById('sw-sc-dtitle').value;
                        if (!title) {
                          Swal.showValidationMessage('Title is required');
                          return false;
                        }
                        return {
                          title,
                          desc: document.getElementById('sw-sc-ddesc').value || ''
                        };
                      }
                    }).then((res) => {
                      if (res.isConfirmed && res.value) {
                        handleAddSpiritualDimension(res.value);
                      }
                    });
                  }}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg flex items-center gap-1.5 transition shadow-2xs"
                >
                  <Plus size={14} /> Add Dimension
                </button>
              </div>
            </div>

            <div className="p-4 bg-orange-50/60 border border-orange-200 rounded-xl text-xs space-y-2">
              <span className="font-bold text-orange-950 uppercase">Program Overview</span>
              <p className="text-slate-700 leading-relaxed">{eduData.spiritualCareCourse?.overview}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {(eduData.spiritualCareCourse?.dimensions || []).map((d, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Dimension 0{idx + 1}</span>
                    <button
                      onClick={() => handleDeleteSpiritualDimension(idx)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                      title="Delete dimension"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{d.title}</h4>
                  <p className="text-slate-600">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* =========================================================================
          VIEW 6: CLINICAL RESEARCH COURSE (PGCR)
          ========================================================================= */}
        {activeSection === 'clinicalResearch' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="text-orange-600" size={20} />
                  Post Graduate Certificate in Clinical Research (PGCR)
                </h3>
                <p className="text-xs text-slate-500">
                  15-Month course with full clinical trial hospital internship and placement support.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/education/clinical-research-course"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition"
                >
                  <ExternalLink size={13} /> View Live PGCR Page
                </a>
                <button
                  onClick={() => {
                    const cr = eduData.clinicalResearchCourse || {};
                    Swal.fire({
                      title: 'Edit PGCR Course Details',
                      html: `
                        <label style="display:block;text-align:left;font-weight:bold;margin-top:10px;font-size:12px;">Course Duration:</label>
                        <input id="sw-pgcr-dur" class="swal2-input" style="margin:5px 0;" value="${cr.duration || ''}">
                        <label style="display:block;text-align:left;font-weight:bold;margin-top:10px;font-size:12px;">Admissions Open:</label>
                        <input id="sw-pgcr-adm" class="swal2-input" style="margin:5px 0;" value="${cr.admissionsOpen || ''}">
                        <label style="display:block;text-align:left;font-weight:bold;margin-top:10px;font-size:12px;">Course Eligibility:</label>
                        <textarea id="sw-pgcr-elig" class="swal2-textarea" style="margin:5px 0;">${cr.eligibility || ''}</textarea>
                        <label style="display:block;text-align:left;font-weight:bold;margin-top:10px;font-size:12px;">Placement Support:</label>
                        <textarea id="sw-pgcr-place" class="swal2-textarea" style="margin:5px 0;">${cr.placementSupport || ''}</textarea>
                      `,
                      focusConfirm: false,
                      showCancelButton: true,
                      confirmButtonText: 'Save to Database',
                      confirmButtonColor: '#ea580c',
                      preConfirm: () => {
                        return {
                          duration: document.getElementById('sw-pgcr-dur').value,
                          admissionsOpen: document.getElementById('sw-pgcr-adm').value,
                          eligibility: document.getElementById('sw-pgcr-elig').value,
                          placementSupport: document.getElementById('sw-pgcr-place').value
                        };
                      }
                    }).then((res) => {
                      if (res.isConfirmed && res.value) {
                        handleEditPgcrDetails(res.value);
                      }
                    });
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition"
                >
                  <Edit2 size={13} /> Edit Course Details
                </button>
                <button
                  onClick={() => {
                    const nextNo = ((eduData.clinicalResearchCourse?.modules || []).length || 0) + 1;
                    Swal.fire({
                      title: 'Add PGCR Curriculum Module',
                      html: `
                        <input id="sw-mod-no" class="swal2-input" type="number" placeholder="Module Number" value="${nextNo}">
                        <input id="sw-mod-title" class="swal2-input" placeholder="Module Title (e.g. Clinical Trial Operations)">
                        <textarea id="sw-mod-desc" class="swal2-textarea" placeholder="Curriculum & syllabus details"></textarea>
                      `,
                      focusConfirm: false,
                      showCancelButton: true,
                      confirmButtonText: 'Add to Database',
                      confirmButtonColor: '#ea580c',
                      preConfirm: () => {
                        const title = document.getElementById('sw-mod-title').value;
                        if (!title) {
                          Swal.showValidationMessage('Title is required');
                          return false;
                        }
                        return {
                          moduleNo: Number(document.getElementById('sw-mod-no').value) || nextNo,
                          title,
                          desc: document.getElementById('sw-mod-desc').value || ''
                        };
                      }
                    }).then((res) => {
                      if (res.isConfirmed && res.value) {
                        handleAddPgcrModule(res.value);
                      }
                    });
                  }}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg flex items-center gap-1.5 transition shadow-2xs"
                >
                  <Plus size={14} /> Add Curriculum Module
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-semibold">Duration</span>
                <div className="text-base font-bold text-slate-900 mt-1">{eduData.clinicalResearchCourse?.duration}</div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-semibold">Admissions</span>
                <div className="text-base font-bold text-orange-600 mt-1">{eduData.clinicalResearchCourse?.admissionsOpen}</div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-semibold">Eligibility</span>
                <div className="text-xs font-medium text-slate-700 mt-1 truncate">{eduData.clinicalResearchCourse?.eligibility}</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-800">Academic Curriculum Modules</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {(eduData.clinicalResearchCourse?.modules || []).map((m, idx) => (
                  <div key={m.moduleNo || idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-800 font-bold rounded text-[10px]">
                        Module {m.moduleNo}
                      </span>
                      <button
                        onClick={() => handleDeletePgcrModule(idx)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded"
                        title="Delete module"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <h5 className="font-bold text-slate-900 text-xs pt-1">{m.title}</h5>
                    <p className="text-slate-600 text-[11px]">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
          VIEW 7: CLINICAL TRIALS
          ========================================================================= */}
        {activeSection === 'clinicalTrials' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FlaskConical className="text-orange-600" size={20} />
                  Clinical Trials Centre of Excellence
                </h3>
                <p className="text-xs text-slate-500">
                  NABH accredited clinical research site executing Phase II-IV trials since 2013.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/education/clinical-trials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition"
                >
                  <ExternalLink size={13} /> View Live Trials Page
                </a>
                <button
                  onClick={() => {
                    const ct = eduData.clinicalTrials || {};
                    Swal.fire({
                      title: 'Edit Clinical Trials Metrics & Snapshot',
                      html: `
                        <label style="display:block;text-align:left;font-weight:bold;margin-top:10px;font-size:12px;">Total Trials Count:</label>
                        <input id="sw-ct-tot" class="swal2-input" style="margin:5px 0;" value="${ct.totalTrials || '45+ Trials'}">
                        <label style="display:block;text-align:left;font-weight:bold;margin-top:10px;font-size:12px;">Accreditation Status:</label>
                        <input id="sw-ct-acc" class="swal2-input" style="margin:5px 0;" value="${ct.accreditation || 'NABH Certified'}">
                        <label style="display:block;text-align:left;font-weight:bold;margin-top:10px;font-size:12px;">Investigators Count:</label>
                        <input id="sw-ct-inv" class="swal2-input" style="margin:5px 0;" value="${ct.investigators || '25+ Certified'}">
                        <label style="display:block;text-align:left;font-weight:bold;margin-top:10px;font-size:12px;">Audit Track Record:</label>
                        <input id="sw-ct-aud" class="swal2-input" style="margin:5px 0;" value="${ct.auditRecord || 'Zero 483 / Warning'}">
                      `,
                      focusConfirm: false,
                      showCancelButton: true,
                      confirmButtonText: 'Save to Database',
                      confirmButtonColor: '#ea580c',
                      preConfirm: () => {
                        return {
                          totalTrials: document.getElementById('sw-ct-tot').value,
                          accreditation: document.getElementById('sw-ct-acc').value,
                          investigators: document.getElementById('sw-ct-inv').value,
                          auditRecord: document.getElementById('sw-ct-aud').value
                        };
                      }
                    }).then((res) => {
                      if (res.isConfirmed && res.value) {
                        handleEditClinicalTrialsStats(res.value);
                      }
                    });
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition"
                >
                  <Edit2 size={13} /> Edit Metrics
                </button>
                <button
                  onClick={() => {
                    Swal.fire({
                      title: 'Add Research Infrastructure Facility',
                      html: `
                        <input id="sw-tr-f" class="swal2-input" placeholder="Facility Name (e.g. Dedicated CRU)">
                        <textarea id="sw-tr-d" class="swal2-textarea" placeholder="Facility equipment, cold storage, or features"></textarea>
                      `,
                      focusConfirm: false,
                      showCancelButton: true,
                      confirmButtonText: 'Add to Database',
                      confirmButtonColor: '#ea580c',
                      preConfirm: () => {
                        const facility = document.getElementById('sw-tr-f').value;
                        if (!facility) {
                          Swal.showValidationMessage('Facility name is required');
                          return false;
                        }
                        return {
                          facility,
                          details: document.getElementById('sw-tr-d').value || ''
                        };
                      }
                    }).then((res) => {
                      if (res.isConfirmed && res.value) {
                        handleAddTrialFacility(res.value);
                      }
                    });
                  }}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg flex items-center gap-1.5 transition shadow-2xs"
                >
                  <Plus size={14} /> Add Trial Facility
                </button>
                <button
                  onClick={() => {
                    Swal.fire({
                      title: 'Add Therapeutic Specialty',
                      input: 'text',
                      inputPlaceholder: 'e.g. Medical Oncology & Chemotherapy Protocols',
                      showCancelButton: true,
                      confirmButtonText: 'Add Specialty',
                      confirmButtonColor: '#ea580c'
                    }).then((res) => {
                      if (res.isConfirmed && res.value) {
                        handleAddTrialArea(res.value);
                      }
                    });
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition"
                >
                  <Plus size={14} /> Add Therapeutic Area
                </button>
              </div>
            </div>


            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-semibold">Total Trials</span>
                <div className="text-xl font-black text-slate-900 mt-1">
                  {eduData.clinicalTrials?.totalTrials || '45+ Trials'}
                </div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-semibold">Accreditation</span>
                <div className="text-sm font-bold text-blue-700 mt-1">
                  {eduData.clinicalTrials?.accreditation || 'NABH Certified'}
                </div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-semibold">Investigators</span>
                <div className="text-xl font-black text-emerald-600 mt-1">
                  {eduData.clinicalTrials?.investigators || '25+ Certified'}
                </div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-semibold">Audit Record</span>
                <div className="text-sm font-bold text-slate-900 mt-1">
                  {eduData.clinicalTrials?.auditRecord || 'Zero 483 / Warning'}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-800">Clinical Research Infrastructure</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {(eduData.clinicalTrials?.infrastructure || []).map((inf, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-slate-900">{inf.facility}</h5>
                        <button
                          onClick={() => handleDeleteTrialFacility(idx)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded"
                          title="Delete facility"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <p className="text-slate-600 text-[11px]">{inf.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Therapeutic Specialties Tag Cloud */}
              <div className="space-y-2 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800">Accredited Therapeutic Specialties</h4>
                  <span className="text-xs text-slate-400">
                    {(eduData.clinicalTrials?.therapeuticAreas || []).length} Specialties
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(eduData.clinicalTrials?.therapeuticAreas || []).map((area, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-800 rounded-full text-xs font-medium border border-slate-200 hover:bg-slate-200 transition"
                    >
                      {area}
                      <button
                        type="button"
                        onClick={() => handleDeleteTrialArea(idx)}
                        className="text-slate-400 hover:text-red-600 rounded-full p-0.5"
                        title="Delete specialty"
                      >
                        <Trash2 size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
          VIEW 8: INSTITUTIONAL ETHICS COMMITTEES
          ========================================================================= */}
        {activeSection === 'ethics' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="text-blue-600" size={20} />
                  Institutional Ethics Committees (IEC)
                </h3>
                <p className="text-xs text-slate-500">
                  CDSCO/DCGI registered and DHR/ICMR approved ethical oversight for clinical trials &amp; biomedical studies.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/education/ethics-committee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition"
                >
                  <ExternalLink size={13} /> View Live Ethics Page
                </a>
                <button
                  onClick={() => {
                    const nextSr = ((eduData.research?.ethicsCommittee || []).length || 0) + 1;
                    Swal.fire({
                      title: 'Add Ethics Committee Member',
                      html: `
                        <input id="sw-ec-sr" class="swal2-input" type="number" placeholder="Sr No." value="${nextSr}">
                        <input id="sw-ec-name" class="swal2-input" placeholder="Doctor / Member Name">
                        <input id="sw-ec-qual" class="swal2-input" placeholder="Qualification (e.g. MD, MS, PhD)">
                        <input id="sw-ec-role" class="swal2-input" placeholder="Role (e.g. Chairperson, Clinician, Legal Expert)">
                      `,
                      focusConfirm: false,
                      showCancelButton: true,
                      confirmButtonText: 'Add to Database',
                      confirmButtonColor: '#ea580c',
                      preConfirm: () => {
                        const name = document.getElementById('sw-ec-name').value;
                        if (!name) {
                          Swal.showValidationMessage('Name is required');
                          return false;
                        }
                        return {
                          sr: Number(document.getElementById('sw-ec-sr').value) || nextSr,
                          name,
                          qualification: document.getElementById('sw-ec-qual').value || '',
                          role: document.getElementById('sw-ec-role').value || 'Member'
                        };
                      }
                    }).then((res) => {
                      if (res.isConfirmed && res.value) {
                        handleAddEthicsMember(res.value);
                      }
                    });
                  }}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg flex items-center gap-1.5 transition shadow-2xs"
                >
                  <Plus size={14} /> Add Committee Member
                </button>
                <button
                  onClick={() => {
                    Swal.fire({
                      title: 'Add Statutory Ethics Committee',
                      html: `
                        <input id="sw-comm-id" class="swal2-input" placeholder="Committee ID (e.g. iec-ct-2)">
                        <input id="sw-comm-name" class="swal2-input" placeholder="Committee Name">
                        <input id="sw-comm-auth" class="swal2-input" placeholder="Registration Authority">
                        <input id="sw-comm-reg" class="swal2-input" placeholder="Registration Number">
                        <textarea id="sw-comm-mand" class="swal2-textarea" placeholder="Mandate / Review Scope"></textarea>
                      `,
                      focusConfirm: false,
                      showCancelButton: true,
                      confirmButtonText: 'Add Committee',
                      confirmButtonColor: '#ea580c',
                      preConfirm: () => {
                        const name = document.getElementById('sw-comm-name').value;
                        if (!name) {
                          Swal.showValidationMessage('Committee Name is required');
                          return false;
                        }
                        return {
                          id: document.getElementById('sw-comm-id').value || `comm-${Date.now()}`,
                          name,
                          regAuthority: document.getElementById('sw-comm-auth').value || '',
                          regNumber: document.getElementById('sw-comm-reg').value || '',
                          mandate: document.getElementById('sw-comm-mand').value || ''
                        };
                      }
                    }).then((res) => {
                      if (res.isConfirmed && res.value) {
                        handleAddEthicsCommittee(res.value);
                      }
                    });
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition"
                >
                  <Plus size={14} /> Add Committee
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {(eduData.ethicsCommittee?.committees || []).map((comm) => (
                <div key={comm.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">{comm.name}</h4>
                    <button
                      onClick={() => handleDeleteEthicsCommittee(comm.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                      title="Delete committee"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div className="text-blue-700 font-semibold">{comm.regAuthority}</div>
                  <div className="p-2 bg-white rounded border border-slate-200 font-mono text-[11px]">
                    <strong>Reg No:</strong> {comm.regNumber}
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">{comm.mandate}</p>
                </div>
              ))}
            </div>

            {/* Members Table */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <h4 className="text-sm font-bold text-slate-800">Current Committee Member Roster</h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase">
                    <tr>
                      <th className="px-3 py-2 w-14">Sr</th>
                      <th className="px-3 py-2">Name</th>
                      <th className="px-3 py-2">Qualification</th>
                      <th className="px-3 py-2">Designation / Role</th>
                      <th className="px-3 py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(eduData.research?.ethicsCommittee || []).map((m) => (
                      <tr key={m.sr} className="hover:bg-slate-50">
                        <td className="px-3 py-2 font-semibold text-slate-500">{m.sr}</td>
                        <td className="px-3 py-2 font-bold text-slate-900">{m.name}</td>
                        <td className="px-3 py-2">{m.qualification}</td>
                        <td className="px-3 py-2 font-semibold text-blue-700">{m.role}</td>
                        <td className="px-3 py-2 text-right">
                          <button
                            onClick={() => handleDeleteEthicsMember(m.sr)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded"
                            title="Delete member"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
          VIEW 9: PUBLICATIONS
          ========================================================================= */}
        {activeSection === 'publications' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="text-orange-600" size={20} />
                  Medical Publications &amp; DNB Theses ({eduData.research?.publications?.length || 0})
                </h3>
                <p className="text-xs text-slate-500">
                  Indexed biomedical studies and postgraduate dissertations authored by hospital consultants.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/education/publications"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition"
                >
                  <ExternalLink size={13} /> View Live Publications
                </a>
                <button
                  onClick={() => {
                    const nextSr = ((eduData.research?.publications || []).length || 0) + 1;
                    Swal.fire({
                      title: 'Add Medical Publication / Thesis',
                      html: `
                        <input id="sw-p-title" class="swal2-input" placeholder="Publication Title / Dissertation">
                        <input id="sw-p-auth" class="swal2-input" placeholder="Authors (e.g. Dr. Ajay Shankhe, et al.)">
                        <input id="sw-p-yr" class="swal2-input" placeholder="Year (e.g. 2024)">
                        <input id="sw-p-jnl" class="swal2-input" placeholder="Journal / Indexed Citation">
                      `,
                      focusConfirm: false,
                      showCancelButton: true,
                      confirmButtonText: 'Add to Database',
                      confirmButtonColor: '#ea580c',
                      preConfirm: () => {
                        const title = document.getElementById('sw-p-title').value;
                        if (!title) {
                          Swal.showValidationMessage('Title is required');
                          return false;
                        }
                        return {
                          sr: nextSr,
                          title,
                          citation: document.getElementById('sw-p-auth').value || '',
                          year: document.getElementById('sw-p-yr').value || new Date().getFullYear().toString(),
                          journal: document.getElementById('sw-p-jnl').value || ''
                        };
                      }
                    }).then((res) => {
                      if (res.isConfirmed && res.value) {
                        handleAddPublication(res.value);
                      }
                    });
                  }}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg flex items-center gap-1.5 transition shadow-2xs"
                >
                  <Plus size={14} /> Add Publication
                </button>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase">
                  <tr>
                    <th className="px-3 py-2 w-14">Sr</th>
                    <th className="px-3 py-2">Authors</th>
                    <th className="px-3 py-2">Title</th>
                    <th className="px-3 py-2 w-16">Year</th>
                    <th className="px-3 py-2">Journal / Citation</th>
                    <th className="px-3 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(eduData.research?.publications || []).map((pub) => (
                    <tr key={pub.sr} className="hover:bg-slate-50">
                      <td className="px-3 py-2 font-semibold text-slate-500">{pub.sr}</td>
                      <td className="px-3 py-2 text-slate-700 max-w-[180px]">{pub.citation}</td>
                      <td className="px-3 py-2 font-bold text-slate-900">{pub.title}</td>
                      <td className="px-3 py-2">{pub.year}</td>
                      <td className="px-3 py-2 text-blue-700 font-medium">{pub.journal}</td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => handleDeletePublication(pub.sr)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded"
                          title="Delete publication"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
          VIEW 10: GOVERNMENT ACCREDITATIONS
          ========================================================================= */}
        {activeSection === 'accreditation' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="text-orange-600" size={20} />
                  Government Accreditations &amp; Quality Approvals
                </h3>
                <p className="text-xs text-slate-500">
                  Statutory recognitions: NABH Clinical Trials, DCGI, DHR/ICMR, NBE, MMC, and MNC.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/education/government-accreditation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition"
                >
                  <ExternalLink size={13} /> View Live Accreditation Page
                </a>
                <button
                  onClick={() => {
                    Swal.fire({
                      title: 'Add Statutory Accreditation',
                      html: `
                        <input id="sw-ac-auth" class="swal2-input" placeholder="Authority (e.g. NABH / DCGI / ICMR)">
                        <input id="sw-ac-title" class="swal2-input" placeholder="Accreditation Title">
                        <textarea id="sw-ac-det" class="swal2-textarea" placeholder="Registration / Certification details"></textarea>
                      `,
                      focusConfirm: false,
                      showCancelButton: true,
                      confirmButtonText: 'Add to Database',
                      confirmButtonColor: '#ea580c',
                      preConfirm: () => {
                        const title = document.getElementById('sw-ac-title').value;
                        if (!title) {
                          Swal.showValidationMessage('Title is required');
                          return false;
                        }
                        return {
                          authority: document.getElementById('sw-ac-auth').value || 'Accredited',
                          title,
                          detail: document.getElementById('sw-ac-det').value || ''
                        };
                      }
                    }).then((res) => {
                      if (res.isConfirmed && res.value) {
                        handleAddAccreditation(res.value);
                      }
                    });
                  }}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg flex items-center gap-1.5 transition shadow-2xs"
                >
                  <Plus size={14} /> Add Accreditation
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {(eduData.governmentAccreditation?.badges || []).map((b, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded text-[10px]">
                      {b.authority}
                    </span>
                    <button
                      onClick={() => handleDeleteAccreditation(idx)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                      title="Delete accreditation"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm pt-1">{b.title}</h4>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{b.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
          VIEW 11: DYNAMIC / CUSTOM EDUCATION PROGRAMS (POSTGRESQL DATABASE)
          ========================================================================= */}
        {activeSection === 'customPrograms' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="text-orange-600" size={20} />
                  Custom Education Programs &amp; Courses ({customPrograms.length})
                </h3>
                <p className="text-xs text-slate-500">
                  New academic offerings created by administration, saved to PostgreSQL database, and rendered dynamically on the public portal.
                </p>
              </div>
              <button
                onClick={() => {
                  setNewEducationForm({
                    title: '',
                    category: 'Post Doctoral Fellowship',
                    badge: 'Accredited',
                    duration: '1 Year',
                    seats: 2,
                    eligibility: '',
                    overview: '',
                    highlights: '',
                    faculty: '',
                    phone: '022 2845 8000',
                    email: 'education@bhaktivedantahospital.com'
                  });
                  setIsNewEducationModalOpen(true);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg flex items-center gap-1.5 transition shadow-2xs"
              >
                <Plus size={14} /> Create New Education Program
              </button>
            </div>

            {customPrograms.length === 0 ? (
              <div className="text-center py-12 px-4 border border-dashed border-slate-300 rounded-2xl bg-slate-50/50 space-y-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                  <GraduationCap size={24} />
                </div>
                <h4 className="text-base font-bold text-slate-800">No Custom Education Programs Added Yet</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Admins can create new academic programs (such as Fellowships, Paramedical Diplomas, or Certificate Courses) with custom eligibility, seats, and curriculum that are stored directly in PostgreSQL database.
                </p>
                <button
                  onClick={() => setIsNewEducationModalOpen(true)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg inline-flex items-center gap-1.5 transition"
                >
                  <Plus size={14} /> Add First Program Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {customPrograms.map((prog) => (
                  <div key={prog.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 hover:shadow-xs transition">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded text-[10px]">
                          {prog.category || 'Academic Program'}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-1">{prog.title}</h4>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDeleteCustomProgram(prog.id, prog.title)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete from database"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-2.5 bg-white border border-slate-200 rounded-xl">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">Duration</span>
                        <div className="font-bold text-slate-800">{prog.duration || '1 Year'}</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">Intake</span>
                        <div className="font-bold text-orange-600">{prog.seats ? `${prog.seats} Seats` : 'Contact Dept'}</div>
                      </div>
                    </div>

                    {prog.eligibility && (
                      <div className="text-[11px] text-slate-600">
                        <strong className="text-slate-800">Eligibility:</strong> {prog.eligibility}
                      </div>
                    )}

                    <p className="text-slate-600 text-[11px] line-clamp-2 leading-relaxed">
                      {prog.overview}
                    </p>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono">
                        Route: /education/{prog.slug}
                      </span>
                      <a
                        href={`/education/${prog.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1 transition"
                      >
                        <ExternalLink size={12} /> View Live Page
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
          VIEW 12: ALL COURSE INQUIRIES
          ========================================================================= */}
        {activeSection === 'inquiries' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Admissions &amp; Course Inquiries Pipeline ({inquiries.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Candidate submissions from DNB, Nursing, PGCR, Spiritual Care, and CME/CNE programs.
                </p>
              </div>

              <button
                onClick={() => setIsManualInquiryModalOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 transition shadow-2xs self-start"
              >
                <Plus size={14} /> Add Manual Lead
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase">
                  <tr>
                    <th className="px-3 py-2.5">Candidate Name</th>
                    <th className="px-3 py-2.5">Contact Details</th>
                    <th className="px-3 py-2.5">Applied Course</th>
                    <th className="px-3 py-2.5">Score / Qualifications</th>
                    <th className="px-3 py-2.5">Message</th>
                    <th className="px-3 py-2.5">Status</th>
                    <th className="px-3 py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inquiries.map((inq) => (
                    <tr key={inq.id || inq.email} className="hover:bg-slate-50">
                      <td className="px-3 py-2.5 font-bold text-slate-900">{inq.candidateName}</td>
                      <td className="px-3 py-2.5">
                        <div>{inq.email}</div>
                        <div className="text-slate-500">{inq.phone}</div>
                      </td>
                      <td className="px-3 py-2.5 font-semibold text-blue-700">{inq.specialty}</td>
                      <td className="px-3 py-2.5">{inq.neetScore || '—'}</td>
                      <td className="px-3 py-2.5 max-w-xs text-slate-600 truncate">{inq.message || '—'}</td>
                      <td className="px-3 py-2.5">
                        <select
                          value={inq.status || 'New'}
                          onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                          className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-semibold focus:outline-none"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Counselling Scheduled">Counselling Scheduled</option>
                          <option value="Enrolled">Enrolled</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
          MODALS
          ========================================================================= */}

        {/* 1. NURSING EDIT MODAL */}
        {isNursingModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 text-xs space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-800">Edit Rosalind S. Teton School of Nursing</h3>
                <button onClick={() => setIsNursingModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveNursing} className="space-y-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">School Name</label>
                  <input
                    type="text"
                    required
                    value={nursingForm.title}
                    onChange={(e) => setNursingForm({ ...nursingForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Subtitle / Tagline</label>
                  <input
                    type="text"
                    value={nursingForm.subtitle}
                    onChange={(e) => setNursingForm({ ...nursingForm, subtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Overview / History</label>
                  <textarea
                    rows="4"
                    value={nursingForm.overview}
                    onChange={(e) => setNursingForm({ ...nursingForm, overview: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">Annual Intake Seats</label>
                    <input
                      type="number"
                      value={nursingForm.intakeSeats}
                      onChange={(e) => setNursingForm({ ...nursingForm, intakeSeats: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">Established Year</label>
                    <input
                      type="text"
                      value={nursingForm.established}
                      onChange={(e) => setNursingForm({ ...nursingForm, established: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">Campus Phone</label>
                    <input
                      type="text"
                      value={nursingForm.phone}
                      onChange={(e) => setNursingForm({ ...nursingForm, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">Campus Email</label>
                    <input
                      type="text"
                      value={nursingForm.email}
                      onChange={(e) => setNursingForm({ ...nursingForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Campus Address</label>
                  <input
                    type="text"
                    value={nursingForm.campus}
                    onChange={(e) => setNursingForm({ ...nursingForm, campus: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsNursingModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg"
                  >
                    Save Nursing to Database
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 2. DNB HERO MODAL */}
        {isDnbHeroModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 text-xs space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-800">DNB Hero &amp; Video Settings</h3>
                <button onClick={() => setIsDnbHeroModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveDnbHero} className="space-y-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Page Headline Title</label>
                  <input
                    type="text"
                    required
                    value={dnbHeroForm.title}
                    onChange={(e) => setDnbHeroForm({ ...dnbHeroForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Hero Introduction Paragraph</label>
                  <textarea
                    rows="4"
                    required
                    value={dnbHeroForm.heroIntro}
                    onChange={(e) => setDnbHeroForm({ ...dnbHeroForm, heroIntro: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  ></textarea>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Director's Quote</label>
                  <textarea
                    rows="3"
                    value={dnbHeroForm.quote}
                    onChange={(e) => setDnbHeroForm({ ...dnbHeroForm, quote: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  ></textarea>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Director Video Embed URL</label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/embed/..."
                    value={dnbHeroForm.directorVideoUrl}
                    onChange={(e) => setDnbHeroForm({ ...dnbHeroForm, directorVideoUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsDnbHeroModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg"
                  >
                    Save Settings to Database
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 3. DNB PROGRAM MODAL */}
        {isProgramModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 text-xs space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-800">
                  {editingProgram ? 'Edit DNB Specialty Program' : 'Add DNB Specialty Program'}
                </h3>
                <button onClick={() => setIsProgramModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveProgram} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">Program Title *</label>
                    <input
                      type="text"
                      required
                      value={programForm.title}
                      onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">Accredited Seats *</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      required
                      value={programForm.seats}
                      onChange={(e) => setProgramForm({ ...programForm, seats: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700">About Department Overview</label>
                  <textarea
                    rows="3"
                    value={programForm.about}
                    onChange={(e) => setProgramForm({ ...programForm, about: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  ></textarea>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Integrated Medicine Paradigm</label>
                  <textarea
                    rows="2"
                    value={programForm.integratedMedicine}
                    onChange={(e) => setProgramForm({ ...programForm, integratedMedicine: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsProgramModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg"
                  >
                    Save to Database
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 4. MANUAL INQUIRY MODAL */}
        {isManualInquiryModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-800">Add Course Inquiry (Manual Lead)</h3>
                <button onClick={() => setIsManualInquiryModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveManualInquiry} className="space-y-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Candidate Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. / Nurse Name"
                    value={manualInquiryForm.candidateName}
                    onChange={(e) => setManualInquiryForm({ ...manualInquiryForm, candidateName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">Email *</label>
                    <input
                      type="email"
                      required
                      value={manualInquiryForm.email}
                      onChange={(e) => setManualInquiryForm({ ...manualInquiryForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">Phone</label>
                    <input
                      type="tel"
                      value={manualInquiryForm.phone}
                      onChange={(e) => setManualInquiryForm({ ...manualInquiryForm, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Course / Program</label>
                  <select
                    value={manualInquiryForm.specialty}
                    onChange={(e) => setManualInquiryForm({ ...manualInquiryForm, specialty: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="DNB General Medicine">DNB General Medicine</option>
                    <option value="DNB Paediatrics">DNB Paediatrics</option>
                    <option value="DNB Ophthalmology">DNB Ophthalmology</option>
                    <option value="DNB Obstetrics & Gynaecology">DNB Obstetrics &amp; Gynaecology</option>
                    <option value="Diploma in Radio Diagnosis">Diploma in Radio Diagnosis</option>
                    <option value="DNB Urology">DNB Urology</option>
                    <option value="DNB Anesthesiology">DNB Anesthesiology</option>
                    <option value="General Nursing & Midwifery (GNM)">General Nursing &amp; Midwifery (GNM)</option>
                    <option value="Post Graduation in Clinical Research (PGCR)">Post Graduation in Clinical Research (PGCR)</option>
                    <option value="Spiritual Care Certificate Course">Spiritual Care Certificate Course</option>
                    <option value="CME Program">CME Program</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Message / Query Note</label>
                  <textarea
                    rows="3"
                    value={manualInquiryForm.message}
                    onChange={(e) => setManualInquiryForm({ ...manualInquiryForm, message: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsManualInquiryModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                  >
                    Save Inquiry to Database
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dynamic New Education Program Creation Modal */}
        {isNewEducationModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="text-orange-600" size={20} />
                  Create New Education Program (PostgreSQL)
                </h3>
                <button
                  type="button"
                  onClick={() => setIsNewEducationModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateNewEducation} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Program / Course Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fellowship in Critical Care Medicine"
                    value={newEducationForm.title}
                    onChange={(e) => setNewEducationForm({ ...newEducationForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">Category</label>
                    <select
                      value={newEducationForm.category}
                      onChange={(e) => setNewEducationForm({ ...newEducationForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="Post Doctoral Fellowship">Post Doctoral Fellowship</option>
                      <option value="Medical Specialty Course">Medical Specialty Course</option>
                      <option value="Nursing Degree / Diploma">Nursing Degree / Diploma</option>
                      <option value="Clinical Research Program">Clinical Research Program</option>
                      <option value="Certificate Course">Certificate Course</option>
                      <option value="Allied Health Science">Allied Health Science</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">Accreditation / Badge</label>
                    <input
                      type="text"
                      placeholder="e.g. MUHS Accredited / NBE Approved"
                      value={newEducationForm.badge}
                      onChange={(e) => setNewEducationForm({ ...newEducationForm, badge: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 2 Years / 15 Months"
                      value={newEducationForm.duration}
                      onChange={(e) => setNewEducationForm({ ...newEducationForm, duration: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">Intake Seats</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 4"
                      value={newEducationForm.seats}
                      onChange={(e) => setNewEducationForm({ ...newEducationForm, seats: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Candidate Eligibility</label>
                  <textarea
                    rows="2"
                    placeholder="e.g. MD/DNB in Internal Medicine or Anaesthesia from an MCI recognized university."
                    value={newEducationForm.eligibility}
                    onChange={(e) => setNewEducationForm({ ...newEducationForm, eligibility: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  ></textarea>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Department Overview &amp; Curriculum Mission</label>
                  <textarea
                    rows="3"
                    placeholder="Describe clinical exposure, bedside training, research methodology and fellowship rotations..."
                    value={newEducationForm.overview}
                    onChange={(e) => setNewEducationForm({ ...newEducationForm, overview: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">Contact Phone</label>
                    <input
                      type="tel"
                      value={newEducationForm.phone}
                      onChange={(e) => setNewEducationForm({ ...newEducationForm, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">Contact Email</label>
                    <input
                      type="email"
                      value={newEducationForm.email}
                      onChange={(e) => setNewEducationForm({ ...newEducationForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsNewEducationModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg shadow-xs"
                  >
                    Save to Database &amp; Publish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
};

export default EducationResearch;
