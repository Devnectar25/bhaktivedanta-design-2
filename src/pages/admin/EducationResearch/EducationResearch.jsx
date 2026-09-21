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
  deleteDnbInquiry
} from '../../../utils/api';
import { dnbProgramData } from '../../../data/dnbProgramData';
import Swal from 'sweetalert2';

// 10 Section Identifiers
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
  { id: 'inquiries', name: 'Course Inquiries', icon: Mail, badge: 'Admissions' }
];

const EducationResearch = () => {
  const [eduData, setEduData] = useState(dnbProgramData);
  const [inquiries, setInquiries] = useState([]);
  const [activeSection, setActiveSection] = useState('dnb');
  const [dnbSubtab, setDnbSubtab] = useState('programs');
  const [searchTerm, setSearchTerm] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('all');

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
      const inqList = await getDnbInquiries([]);
      setInquiries(Array.isArray(inqList) ? inqList : []);
    } catch (err) {
      console.warn('Error loading education research state:', err);
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
  // INQUIRIES HANDLERS
  // ==========================================
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
                className={`p-3 rounded-xl flex flex-col items-start gap-1 transition text-left relative ${
                  isActive
                    ? 'bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-sm'
                    : 'bg-slate-50/70 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Icon size={18} className={isActive ? 'text-white' : 'text-orange-600'} />
                  <span
                    className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-800'
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
                className="px-4 py-1.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg flex items-center gap-1.5 transition shadow-2xs"
              >
                <Edit2 size={14} /> Edit School Details
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
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-800 font-bold rounded">
                      {c.seats} Seats
                    </span>
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
            <a
              href="/education/cne"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition"
            >
              <ExternalLink size={13} /> View Live CNE Page
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {(eduData.cneProgram?.focusAreas || []).map((fa, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{fa.title}</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded text-[10px]">MNC Accredited</span>
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
            <a
              href="/education/spiritual-care-course"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition"
            >
              <ExternalLink size={13} /> View Live Course Page
            </a>
          </div>

          <div className="p-4 bg-orange-50/60 border border-orange-200 rounded-xl text-xs space-y-2">
            <span className="font-bold text-orange-950 uppercase">Program Overview</span>
            <p className="text-slate-700 leading-relaxed">{eduData.spiritualCareCourse?.overview}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {(eduData.spiritualCareCourse?.dimensions || []).map((d, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Dimension 0{idx + 1}</span>
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
            <a
              href="/education/clinical-research-course"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition"
            >
              <ExternalLink size={13} /> View Live PGCR Page
            </a>
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
              {(eduData.clinicalResearchCourse?.modules || []).map((m) => (
                <div key={m.moduleNo} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-800 font-bold rounded text-[10px]">
                    Module {m.moduleNo}
                  </span>
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
            <a
              href="/education/clinical-trials"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition"
            >
              <ExternalLink size={13} /> View Live Trials Page
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-400 font-semibold">Total Trials</span>
              <div className="text-xl font-black text-slate-900 mt-1">45+ Trials</div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-400 font-semibold">Accreditation</span>
              <div className="text-sm font-bold text-blue-700 mt-1">NABH Certified</div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-400 font-semibold">Investigators</span>
              <div className="text-xl font-black text-emerald-600 mt-1">25+ Certified</div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-400 font-semibold">Audit Record</span>
              <div className="text-sm font-bold text-slate-900 mt-1">Zero 483 / Warning</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-800">Therapeutic Areas &amp; Infrastructure</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {(eduData.clinicalTrials?.infrastructure || []).map((inf, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <h5 className="font-bold text-slate-900">{inf.facility}</h5>
                  <p className="text-slate-600 text-[11px]">{inf.details}</p>
                </div>
              ))}
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
            <a
              href="/education/ethics-committee"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition"
            >
              <ExternalLink size={13} /> View Live Ethics Page
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {(eduData.ethicsCommittee?.committees || []).map((comm) => (
              <div key={comm.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">{comm.name}</h4>
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
                    <th className="px-3 py-2">Sr</th>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Qualification</th>
                    <th className="px-3 py-2">Designation / Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(eduData.research?.ethicsCommittee || []).map((m) => (
                    <tr key={m.sr} className="hover:bg-slate-50">
                      <td className="px-3 py-2 font-semibold text-slate-500">{m.sr}</td>
                      <td className="px-3 py-2 font-bold text-slate-900">{m.name}</td>
                      <td className="px-3 py-2">{m.qualification}</td>
                      <td className="px-3 py-2 font-semibold text-blue-700">{m.role}</td>
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
            <a
              href="/education/publications"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition"
            >
              <ExternalLink size={13} /> View Live Publications
            </a>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase">
                <tr>
                  <th className="px-3 py-2">Sr</th>
                  <th className="px-3 py-2">Authors</th>
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Year</th>
                  <th className="px-3 py-2">Journal / Citation</th>
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
            <a
              href="/education/government-accreditation"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition"
            >
              <ExternalLink size={13} /> View Live Accreditation Page
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {(eduData.governmentAccreditation?.badges || []).map((b, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded text-[10px]">
                  {b.authority}
                </span>
                <h4 className="font-bold text-slate-900 text-sm pt-1">{b.title}</h4>
                <p className="text-slate-600 text-[11px] leading-relaxed">{b.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 11: ALL COURSE INQUIRIES
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
    </div>
  );
};

export default EducationResearch;
