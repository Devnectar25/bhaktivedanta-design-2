import React, { useState, useEffect } from 'react';
import { 
  getCareerJobs, addCareerJob, updateCareerJob, deleteCareerJob,
  getCareerApplications, updateCareerApplication, deleteCareerApplication 
} from '../../../utils/api';
import Swal from 'sweetalert2';

const defaultJobs = [
  {
    id: 'JOB-101',
    category: 'Consultant Vacancy',
    title: 'Interventional Radiologist',
    department: 'Radiology & Imaging',
    positions: '01',
    qualification: 'DNB (Radio Diagnosis), Fellowship in Interventional Radiology',
    experience: '2-3 years of relevant experience',
    location: 'Mira Road, Mumbai',
    status: 'Active',
    description: 'Seeking a skilled Interventional Radiologist with experience in vascular and non-vascular interventions, fluoroscopy, and CT-guided procedures.',
    postedDate: '2026-08-15'
  },
  {
    id: 'JOB-102',
    category: 'Consultant Vacancy',
    title: 'Consultant Cardiologist',
    department: 'Cardiology',
    positions: '02',
    qualification: 'DM / DNB (Cardiology)',
    experience: '3-5 years of post-DM/DNB experience in clinical & interventional cardiology',
    location: 'Mira Road, Mumbai',
    status: 'Active',
    description: 'Full-time consultant required for our cardiac catheterization lab, echo cardiology, and OPD/IPD consultations.',
    postedDate: '2026-08-18'
  },
  {
    id: 'JOB-103',
    category: 'Nursing Vacancy',
    title: 'Senior Staff Nurse (ICU & Critical Care)',
    department: 'Critical Care / ICU',
    positions: '08',
    qualification: 'B.Sc Nursing / GNM with MNC registration',
    experience: '2+ years in Intensive Care Unit / Cardiac ICU',
    location: 'Mira Road, Mumbai',
    status: 'Active',
    description: 'Dedicated nursing professionals to deliver compassionate, skilled bedside care to critically ill patients.',
    postedDate: '2026-08-20'
  },
  {
    id: 'JOB-104',
    category: 'Nursing Vacancy',
    title: 'Staff Nurse (Operation Theatre - OT)',
    department: 'Operation Theatre',
    positions: '04',
    qualification: 'B.Sc Nursing / GNM with MNC registration',
    experience: '1-3 years of OT experience in multi-speciality setup',
    location: 'Mira Road, Mumbai',
    status: 'Active',
    description: 'Assisting surgical teams across Orthopedic, Cardiac, General Laparoscopic, and ENT surgical interventions.',
    postedDate: '2026-08-22'
  },
  {
    id: 'JOB-105',
    category: 'Paramedical Vacancy',
    title: 'Medical Laboratory Technologist (Pathology)',
    department: 'Pathology & Blood Bank',
    positions: '03',
    qualification: 'B.Sc / M.Sc in Medical Laboratory Technology (MLT)',
    experience: '1+ year experience in automated biochemistry and hematology',
    location: 'Mira Road, Mumbai',
    status: 'Active',
    description: 'Operating advanced hematology and biochemistry analyzers under NABL accredited quality guidelines.',
    postedDate: '2026-08-25'
  },
  {
    id: 'JOB-106',
    category: 'Paramedical Vacancy',
    title: 'Clinical Pharmacist',
    department: 'Pharmacy',
    positions: '03',
    qualification: 'B.Pharm / Pharm.D with State Pharmacy Council registration',
    experience: '1-2 years in hospital IPD/OPD dispensing',
    location: 'Mira Road, Mumbai',
    status: 'Active',
    description: 'Medication reconciliation, IPD prescription review, patient counselling, and inventory oversight.',
    postedDate: '2026-08-28'
  },
  {
    id: 'JOB-107',
    category: 'Admin & Support Vacancy',
    title: 'Patient Care Coordinator (Helpdesk & Admission)',
    department: 'Front Office & Guest Relations',
    positions: '04',
    qualification: 'Any Graduate / Healthcare Administration diploma',
    experience: '1-3 years in hospital reception, billing or patient coordination',
    location: 'Mira Road, Mumbai',
    status: 'Active',
    description: 'Welcoming patients, managing admission procedures, insurance coordination, and addressing patient queries.',
    postedDate: '2026-09-01'
  }
];

const defaultApplications = [
  {
    id: 'APP-1001',
    jobId: 'JOB-101',
    position: 'Interventional Radiologist',
    fullName: 'Dr. Rohan Deshmukh',
    email: 'rohan.deshmukh@gmail.com',
    phone: '+91 98201 44521',
    qualification: 'DNB (Radio Diagnosis)',
    experience: '3.5 Years',
    currentCtc: '22 LPA',
    expectedCtc: '28 LPA',
    noticePeriod: '30 Days',
    city: 'Mumbai',
    resumeUrl: '',
    resumeName: 'Dr_Rohan_Deshmukh_CV.pdf',
    coverNote: 'Experienced in peripheral and neurovascular interventions with fellowship from KEM Hospital.',
    status: 'Shortlisted',
    appliedDate: '2026-09-02',
    hrNotes: 'Credentials verified with MMC. Scheduled preliminary interview with HOD Radiology for next Tuesday.'
  },
  {
    id: 'APP-1002',
    jobId: 'JOB-103',
    position: 'Senior Staff Nurse (ICU & Critical Care)',
    fullName: 'Sneha Mary Varghese',
    email: 'sneha.varghese@yahoo.com',
    phone: '+91 97692 88123',
    qualification: 'B.Sc Nursing (MNC Reg: 148922)',
    experience: '4 Years',
    currentCtc: '4.2 LPA',
    expectedCtc: '5.5 LPA',
    noticePeriod: '15 Days',
    city: 'Thane',
    resumeUrl: '',
    resumeName: 'Sneha_Varghese_Resume.pdf',
    coverNote: 'Over 4 years of solid experience handling ventilator patients, arterial lines, and post-CABG cardiac monitoring.',
    status: 'Under Review',
    appliedDate: '2026-09-05',
    hrNotes: 'Good experience in tertiary hospital ICU. Nursing Superintendent to review shift availability.'
  },
  {
    id: 'APP-1003',
    jobId: 'JOB-106',
    position: 'Clinical Pharmacist',
    fullName: 'Amitesh Patil',
    email: 'amitesh.patil@outlook.com',
    phone: '+91 91370 55670',
    qualification: 'Pharm.D',
    experience: '2 Years',
    currentCtc: '3.6 LPA',
    expectedCtc: '4.8 LPA',
    noticePeriod: 'Immediate',
    city: 'Mumbai',
    resumeUrl: '',
    resumeName: 'Amitesh_Patil_PharmD.pdf',
    coverNote: 'Keen interest in antibiotic stewardship, clinical medication charting and NABH pharmacy documentation.',
    status: 'New',
    appliedDate: '2026-09-10',
    hrNotes: ''
  }
];

const Careers = () => {
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' | 'applications'
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States - Jobs
  const [jobSearch, setJobSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [jobStatusFilter, setJobStatusFilter] = useState('All');

  // Filter States - Applications
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('All');
  const [appJobFilter, setAppJobFilter] = useState('All');

  // Category Management State
  const defaultCategories = [
    'Consultant Vacancy',
    'Nursing Vacancy',
    'Paramedical Vacancy',
    'Admin & Support Vacancy'
  ];

  const [customCategories, setCustomCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('bhaktivedanta_career_categories');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryModalInput, setCategoryModalInput] = useState('');
  const [categoryModalError, setCategoryModalError] = useState('');

  // Dynamically merged categories list (guaranteed unique, preserving order)
  const allCategories = Array.from(new Set([
    ...defaultCategories,
    ...customCategories,
    ...jobs.map(j => j.category).filter(Boolean)
  ]));

  const saveCustomCategory = (name) => {
    const trimmed = (name || '').trim();
    if (!trimmed) return null;
    if (!allCategories.includes(trimmed)) {
      const updated = [...customCategories, trimmed];
      setCustomCategories(updated);
      try {
        localStorage.setItem('bhaktivedanta_career_categories', JSON.stringify(updated));
      } catch (err) {
        console.warn('Could not save category:', err);
      }
    }
    return trimmed;
  };

  const removeCustomCategory = (catToRemove) => {
    const updated = customCategories.filter(c => c !== catToRemove);
    setCustomCategories(updated);
    try {
      localStorage.setItem('bhaktivedanta_career_categories', JSON.stringify(updated));
    } catch (err) {
      console.warn('Could not update categories:', err);
    }
  };

  // Modals
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobForm, setJobForm] = useState({
    title: '',
    category: 'Consultant Vacancy',
    department: '',
    positions: '01',
    qualification: '',
    experience: '',
    location: 'Mira Road, Mumbai',
    status: 'Active',
    description: ''
  });

  const [selectedApp, setSelectedApp] = useState(null);
  const [appReviewStatus, setAppReviewStatus] = useState('');
  const [appReviewNotes, setAppReviewNotes] = useState('');

  // Prevent background scrolling when any modal is open
  useEffect(() => {
    if (showJobModal || selectedApp || showCategoryModal) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [showJobModal, selectedApp, showCategoryModal]);

  // Initial Data Fetching
  useEffect(() => {
    Promise.all([
      getCareerJobs(defaultJobs),
      getCareerApplications(defaultApplications)
    ]).then(([jobsData, appsData]) => {
      setJobs(Array.isArray(jobsData) && jobsData.length > 0 ? jobsData : defaultJobs);
      setApplications(Array.isArray(appsData) && appsData.length > 0 ? appsData : defaultApplications);
      setIsLoading(false);
    }).catch(err => {
      console.warn('Error fetching careers data:', err);
      setJobs(defaultJobs);
      setApplications(defaultApplications);
      setIsLoading(false);
    });
  }, []);

  // ----------------------------------------
  // JOB OPENINGS ACTIONS
  // ----------------------------------------
  const handleOpenAddJob = () => {
    setEditingJob(null);
    setJobForm({
      title: '',
      category: 'Consultant Vacancy',
      department: '',
      positions: '01',
      qualification: '',
      experience: '',
      location: 'Mira Road, Mumbai',
      status: 'Active',
      description: ''
    });
    setShowJobModal(true);
  };

  const handleOpenEditJob = (job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title || '',
      category: job.category || 'Consultant Vacancy',
      department: job.department || '',
      positions: job.positions || '01',
      qualification: job.qualification || '',
      experience: job.experience || '',
      location: job.location || 'Mira Road, Mumbai',
      status: job.status || 'Active',
      description: job.description || ''
    });
    setShowJobModal(true);
  };

  const handleSaveJob = (e) => {
    e.preventDefault();
    if (!jobForm.title.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Job Title Required',
        text: 'Please provide a job title / position name.',
        confirmButtonColor: '#1e3a8a'
      });
      return;
    }

    if (editingJob) {
      // Update
      const updated = { ...editingJob, ...jobForm };
      updateCareerJob(editingJob.id, updated, jobs).then(res => {
        setJobs(prev => prev.map(j => j.id === editingJob.id ? (res || updated) : j));
        setShowJobModal(false);
        setEditingJob(null);
        Swal.fire({
          icon: 'success',
          title: 'Job Opening Updated!',
          html: `
            <div style="text-align: center; padding: 0.35rem 0;">
              <p style="color: #475569; font-size: 0.95rem; margin-bottom: 0.6rem;">
                <strong>${updated.title}</strong> has been updated successfully.
              </p>
              <span style="background: #eff6ff; color: #1e3a8a; border: 1px solid #bfdbfe; padding: 4px 14px; border-radius: 6px; font-size: 0.82rem; font-weight: 700;">
                ${updated.category}
              </span>
            </div>
          `,
          confirmButtonText: 'Done',
          confirmButtonColor: '#1e3a8a',
          timer: 2500,
          timerProgressBar: true
        });
      });
    } else {
      // Create
      const newJobObj = {
        ...jobForm,
        id: `JOB-${Date.now().toString().slice(-4)}`,
        postedDate: new Date().toISOString().split('T')[0]
      };
      addCareerJob(newJobObj, jobs).then(res => {
        setJobs(prev => [res || newJobObj, ...prev]);
        setShowJobModal(false);
        Swal.fire({
          icon: 'success',
          title: 'Job Vacancy Published!',
          html: `
            <div style="text-align: center; padding: 0.35rem 0;">
              <p style="color: #475569; font-size: 0.95rem; margin-bottom: 0.6rem;">
                <strong>${newJobObj.title}</strong> is now live on the hospital careers portal.
              </p>
              <span style="background: #eff6ff; color: #1e3a8a; border: 1px solid #bfdbfe; padding: 4px 14px; border-radius: 6px; font-size: 0.82rem; font-weight: 700;">
                ${newJobObj.category}
              </span>
            </div>
          `,
          confirmButtonText: 'Great!',
          confirmButtonColor: '#1e3a8a',
          timer: 3000,
          timerProgressBar: true
        });
      });
    }
  };

  const handleDeleteJob = async (id) => {
    const targetJob = jobs.find(j => j.id === id);
    const confirmResult = await Swal.fire({
      title: 'Delete this job opening?',
      text: targetJob ? `Are you sure you want to remove "${targetJob.title}"? This cannot be undone.` : 'Are you sure you want to delete this vacancy?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel'
    });

    if (confirmResult.isConfirmed) {
      deleteCareerJob(id, jobs).then(() => {
        setJobs(prev => prev.filter(j => j.id !== id));
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Job vacancy removed successfully.',
          timer: 2000,
          showConfirmButton: false
        });
      });
    }
  };

  const handleToggleJobStatus = (job) => {
    const nextStatus = job.status === 'Active' ? 'Closed' : 'Active';
    const updated = { ...job, status: nextStatus };
    updateCareerJob(job.id, updated, jobs).then(() => {
      setJobs(prev => prev.map(j => j.id === job.id ? updated : j));
    });
  };

  // ----------------------------------------
  // CANDIDATE APPLICATIONS ACTIONS
  // ----------------------------------------
  const handleOpenReviewApp = (app) => {
    setSelectedApp(app);
    setAppReviewStatus(app.status || 'New');
    setAppReviewNotes(app.hrNotes || '');
  };

  const handleSaveAppReview = (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    const updated = {
      ...selectedApp,
      status: appReviewStatus,
      hrNotes: appReviewNotes
    };

    updateCareerApplication(selectedApp.id, updated, applications).then(res => {
      setApplications(prev => prev.map(a => a.id === selectedApp.id ? (res || updated) : a));
      setSelectedApp(null);
      Swal.fire({
        icon: 'success',
        title: 'Evaluation Saved!',
        text: `Candidate status updated to "${appReviewStatus}".`,
        confirmButtonColor: '#1e3a8a',
        timer: 2000,
        showConfirmButton: false
      });
    });
  };

  const handleDeleteApp = async (id) => {
    const confirmResult = await Swal.fire({
      title: 'Remove Applicant Record?',
      text: 'Are you sure you want to remove this applicant profile? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel'
    });

    if (confirmResult.isConfirmed) {
      deleteCareerApplication(id, applications).then(() => {
        setApplications(prev => prev.filter(a => a.id !== id));
        Swal.fire({
          icon: 'success',
          title: 'Record Removed',
          timer: 1800,
          showConfirmButton: false
        });
      });
    }
  };

  // ----------------------------------------
  // FILTERING LOGIC
  // ----------------------------------------
  const filteredJobs = jobs.filter(j => {
    const titleMatch = (j.title || '').toLowerCase().includes(jobSearch.toLowerCase()) ||
                       (j.department || '').toLowerCase().includes(jobSearch.toLowerCase()) ||
                       (j.qualification || '').toLowerCase().includes(jobSearch.toLowerCase());
    const catMatch = categoryFilter === 'All' || j.category === categoryFilter;
    const statusMatch = jobStatusFilter === 'All' || j.status === jobStatusFilter;
    return titleMatch && catMatch && statusMatch;
  });

  const filteredApps = applications.filter(a => {
    const query = appSearch.toLowerCase();
    const nameMatch = (a.fullName || '').toLowerCase().includes(query) ||
                      (a.email || '').toLowerCase().includes(query) ||
                      (a.phone || '').toLowerCase().includes(query) ||
                      (a.position || '').toLowerCase().includes(query);
    const statusMatch = appStatusFilter === 'All' || a.status === appStatusFilter;
    const jobMatch = appJobFilter === 'All' || a.jobId === appJobFilter || a.position === appJobFilter;
    return nameMatch && statusMatch && jobMatch;
  });

  // Top Metrics
  const activeJobsCount = jobs.filter(j => j.status === 'Active').length;
  const totalAppsCount = applications.length;
  const newAppsCount = applications.filter(a => a.status === 'New' || a.status === 'Under Review').length;
  const shortlistedAppsCount = applications.filter(a => a.status === 'Shortlisted' || a.status === 'Interview Scheduled').length;

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-slate-400 text-xs mb-1 font-medium">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-600 font-bold">Careers &amp; Recruitment</span>
          </nav>
          <h2 className="text-2xl font-bold text-slate-800">Careers &amp; Job Openings</h2>
          <p className="text-sm text-slate-500">Manage hospital job postings, doctor recruitment, and applicant submissions</p>
        </div>

        <div className="flex items-center gap-3">
          <a 
            href="/careers" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold transition-all border border-slate-200"
          >
            <span className="material-symbols-outlined text-sm">open_in_new</span>
            <span>View Public Careers Page</span>
          </a>

          {activeTab === 'jobs' && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setShowCategoryModal(true);
                  setCategoryModalInput('');
                  setCategoryModalError('');
                }}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-lg text-xs font-bold transition-all border border-slate-200 shadow-sm"
                title="Manage and create job vacancy categories"
              >
                <span className="material-symbols-outlined text-base text-slate-600">category</span>
                <span>Add Category</span>
              </button>

              <button 
                onClick={handleOpenAddJob}
                className="flex items-center gap-2 bg-[#1e3a8a] hover:bg-blue-900 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <span className="material-symbols-outlined text-base">add_box</span>
                <span>Post New Job Vacancy</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm border-l-4 border-l-blue-600">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Active Openings</span>
          <p className="text-2xl font-bold text-slate-800 mt-1">{activeJobsCount}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm border-l-4 border-l-amber-500">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Applicants</span>
          <p className="text-2xl font-bold text-slate-800 mt-1">{totalAppsCount}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm border-l-4 border-l-indigo-500">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Pending Review</span>
          <p className="text-2xl font-bold text-slate-800 mt-1">{newAppsCount}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm border-l-4 border-l-green-500">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Shortlisted Candidates</span>
          <p className="text-2xl font-bold text-slate-800 mt-1">{shortlistedAppsCount}</p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 gap-8 text-sm font-bold">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'jobs' 
              ? 'border-[#1e3a8a] text-[#1e3a8a]' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <span className="material-symbols-outlined text-lg">work</span>
          <span>Job Vacancies ({jobs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors relative ${
            activeTab === 'applications' 
              ? 'border-[#1e3a8a] text-[#1e3a8a]' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <span className="material-symbols-outlined text-lg">person_search</span>
          <span>Candidate Applications ({applications.length})</span>
          {newAppsCount > 0 && (
            <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {newAppsCount} New
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: JOB VACANCIES */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[220px] space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Search Vacancies</label>
              <input 
                type="text" 
                placeholder="Search by title, department, qualification..."
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none"
              />
            </div>

            <div className="w-[190px] space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Category</label>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-white border border-slate-200 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
              >
                <option value="All">All Categories ({allCategories.length})</option>
                {allCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="w-[140px] space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Status</label>
              <select 
                value={jobStatusFilter}
                onChange={(e) => setJobStatusFilter(e.target.value)}
                className="w-full bg-white border border-slate-200 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="px-4 py-3">Job Role Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Vacancies</th>
                  <th className="px-4 py-3">Experience</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-slate-400 font-medium">
                      No job vacancies found matching search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map(job => (
                    <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-800">{job.title}</div>
                        <div className="text-[11px] text-slate-400">{job.qualification}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-600">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px]">
                          {job.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-medium">{job.department}</td>
                      <td className="px-4 py-3 font-bold text-amber-600">{job.positions}</td>
                      <td className="px-4 py-3 text-slate-500">{job.experience}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleJobStatus(job)}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                            job.status === 'Active' 
                              ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                              : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                          }`}
                          title="Click to toggle status"
                        >
                          {job.status}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditJob(job)}
                            className="p-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100"
                            title="Edit Vacancy"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="p-1 rounded bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
                            title="Delete Vacancy"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CANDIDATE APPLICATIONS (ATS) */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[220px] space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Search Candidates</label>
              <input 
                type="text" 
                placeholder="Search candidate name, email, phone, position..."
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none"
              />
            </div>

            <div className="w-[180px] space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Position Applied</label>
              <select 
                value={appJobFilter}
                onChange={(e) => setAppJobFilter(e.target.value)}
                className="w-full bg-white border border-slate-200 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
              >
                <option value="All">All Positions</option>
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>{j.title}</option>
                ))}
              </select>
            </div>

            <div className="w-[160px] space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Application Status</label>
              <select 
                value={appStatusFilter}
                onChange={(e) => setAppStatusFilter(e.target.value)}
                className="w-full bg-white border border-slate-200 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Hired">Hired</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="px-4 py-3">Applicant Name</th>
                  <th className="px-4 py-3">Position Applied</th>
                  <th className="px-4 py-3">Qualification / Exp</th>
                  <th className="px-4 py-3">Current / Expected CTC</th>
                  <th className="px-4 py-3">Applied Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-slate-400 font-medium">
                      No candidate applications found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredApps.map(app => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-800">{app.fullName}</div>
                        <div className="text-[11px] text-slate-400">{app.email} &bull; {app.phone}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#1e3a8a]">
                        {app.position}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-700">{app.qualification}</div>
                        <div className="text-[11px] text-slate-500">{app.experience} Exp</div>
                      </td>
                      <td className="px-4 py-3">
                        <div><span className="text-slate-400">Current:</span> {app.currentCtc || 'N/A'}</div>
                        <div><span className="text-slate-400">Exp:</span> <span className="font-bold text-amber-600">{app.expectedCtc || 'N/A'}</span></div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-medium">
                        {app.appliedDate || 'Recent'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          app.status === 'Shortlisted' ? 'bg-green-50 text-green-700 border-green-200' :
                          app.status === 'Interview Scheduled' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                          app.status === 'Under Review' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          app.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {app.status || 'New'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenReviewApp(app)}
                            className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 font-bold flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[14px]">visibility</span>
                            <span>Review</span>
                          </button>
                          <button
                            onClick={() => handleDeleteApp(app.id)}
                            className="p-1 rounded bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
                            title="Delete Applicant"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: POST / EDIT JOB */}
      {showJobModal && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overscroll-contain"
          onClick={() => {
            setShowJobModal(false);
            setIsAddingNewCategory(false);
            setNewCategoryInput('');
          }}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100 max-h-[90vh] overflow-y-auto overscroll-contain hide-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">
                {editingJob ? 'Edit Job Opening' : 'Post New Job Vacancy'}
              </h3>
              <button 
                onClick={() => {
                  setShowJobModal(false);
                  setIsAddingNewCategory(false);
                  setNewCategoryInput('');
                }} 
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Job Role / Position Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Consultant Pulmonologist, Staff Nurse (OT)"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-start">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-700">Category *</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingNewCategory(!isAddingNewCategory);
                        setNewCategoryInput('');
                      }}
                      className="text-[10px] font-bold text-[#1e3a8a] hover:text-blue-700 flex items-center gap-0.5"
                    >
                      <span className="material-symbols-outlined text-[12px]">
                        {isAddingNewCategory ? 'list' : 'add_circle'}
                      </span>
                      <span>{isAddingNewCategory ? 'Choose Existing' : '+ Add New Category'}</span>
                    </button>
                  </div>

                  {isAddingNewCategory ? (
                    <div className="flex gap-1.5">
                      <input 
                        type="text" 
                        placeholder="e.g. Dental Vacancy"
                        value={newCategoryInput}
                        onChange={(e) => setNewCategoryInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newCategoryInput.trim()) {
                              const saved = saveCustomCategory(newCategoryInput);
                              setJobForm({ ...jobForm, category: saved });
                              setIsAddingNewCategory(false);
                              setNewCategoryInput('');
                            }
                          }
                        }}
                        className="flex-1 border border-blue-400 bg-blue-50/40 rounded-lg px-2.5 py-1.5 outline-none text-xs font-medium focus:border-blue-600"
                        autoFocus
                      />
                      <button 
                        type="button" 
                        onClick={() => {
                          if (newCategoryInput.trim()) {
                            const saved = saveCustomCategory(newCategoryInput);
                            setJobForm({ ...jobForm, category: saved });
                            setIsAddingNewCategory(false);
                            setNewCategoryInput('');
                          }
                        }}
                        disabled={!newCategoryInput.trim()}
                        className="px-2.5 py-1.5 bg-[#1e3a8a] hover:bg-blue-900 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-sm"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <select 
                      value={jobForm.category}
                      onChange={(e) => {
                        if (e.target.value === '__ADD_NEW__') {
                          setIsAddingNewCategory(true);
                          setNewCategoryInput('');
                        } else {
                          setJobForm({ ...jobForm, category: e.target.value });
                        }
                      }}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none cursor-pointer text-xs focus:border-blue-600"
                    >
                      {allCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="__ADD_NEW__" className="text-blue-600 font-bold bg-blue-50">
                        + Add New Category...
                      </option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Pulmonology, Nursing, ICU"
                    value={jobForm.department}
                    onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">No of Positions</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 02 Posts"
                    value={jobForm.positions}
                    onChange={(e) => setJobForm({ ...jobForm, positions: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select 
                    value={jobForm.status}
                    onChange={(e) => setJobForm({ ...jobForm, status: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none cursor-pointer"
                  >
                    <option value="Active">Active (Visible on public site)</option>
                    <option value="Closed">Closed / Hidden</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Required Qualification *</label>
                <input 
                  type="text" 
                  placeholder="e.g. MD / DNB in Respiratory Medicine"
                  value={jobForm.qualification}
                  onChange={(e) => setJobForm({ ...jobForm, qualification: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Required Experience *</label>
                <input 
                  type="text" 
                  placeholder="e.g. 2-3 years of relevant experience"
                  value={jobForm.experience}
                  onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Job Description &amp; Scope</label>
                <textarea 
                  rows="3"
                  placeholder="Outline key roles, patient management duties, or clinical responsibilities..."
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowJobModal(false)} 
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 rounded-lg bg-[#1e3a8a] text-white font-bold hover:bg-blue-900 shadow-md"
                >
                  {editingJob ? 'Save Changes' : 'Publish Vacancy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REVIEW CANDIDATE APPLICATION */}
      {selectedApp && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overscroll-contain"
          onClick={() => setSelectedApp(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 border border-slate-100 max-h-[90vh] overflow-y-auto overscroll-contain hide-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Candidate Profile: {selectedApp.fullName}</h3>
                <p className="text-xs text-slate-400">Application ID: {selectedApp.id} &bull; Applied: {selectedApp.appliedDate}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Profile Details Grid */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Position Applied</span>
                  <p className="font-bold text-[#1e3a8a] text-sm mt-0.5">{selectedApp.position}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Location / City</span>
                  <p className="font-bold text-slate-700 text-sm mt-0.5">{selectedApp.city || 'Mumbai'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Email Address</span>
                  <p className="font-semibold text-slate-700 mt-0.5">{selectedApp.email}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Phone Number</span>
                  <p className="font-semibold text-slate-700 mt-0.5">{selectedApp.phone}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Highest Qualification</span>
                  <p className="font-semibold text-slate-700 mt-0.5">{selectedApp.qualification}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Experience</span>
                  <p className="font-semibold text-slate-700 mt-0.5">{selectedApp.experience}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Current CTC</span>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedApp.currentCtc || 'Not Disclosed'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Expected CTC</span>
                  <p className="font-bold text-[#1e3a8a] mt-0.5">{selectedApp.expectedCtc || 'Not Disclosed'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Notice Period</span>
                  <p className="font-semibold text-slate-700 mt-0.5">{selectedApp.noticePeriod || '30 Days'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">CV / Document</span>
                  <p className="mt-0.5">
                    {selectedApp.resumeName ? (
                      <span className="inline-flex items-center gap-1 text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        <span className="material-symbols-outlined text-xs">attach_file</span>
                        <span>{selectedApp.resumeName}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">No document attached</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Cover Note */}
              {selectedApp.coverNote && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Candidate Cover Note / Intro</span>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700 leading-relaxed italic">
                    "{selectedApp.coverNote}"
                  </div>
                </div>
              )}

              {/* Status Update Form */}
              <form onSubmit={handleUpdateAppStatus} className="space-y-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Application Pipeline Stage</label>
                  <select 
                    value={appReviewStatus}
                    onChange={(e) => setAppReviewStatus(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none cursor-pointer focus:border-blue-600 bg-slate-50"
                  >
                    <option value="New">New Application</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted for Interview</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Hired">Offer Extended / Hired</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Internal HR / Interview Notes</label>
                  <textarea 
                    rows="3"
                    value={appReviewNotes}
                    onChange={(e) => setAppReviewNotes(e.target.value)}
                    placeholder="Enter notes on candidate background, interview schedule, or remarks..."
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-blue-600"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setSelectedApp(null)} 
                    className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    Close
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2 rounded-lg bg-[#1e3a8a] text-white font-bold hover:bg-blue-900 shadow-md"
                  >
                    Save Evaluation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: MANAGE & ADD CATEGORIES */}
      {showCategoryModal && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overscroll-contain"
          onClick={() => {
            setShowCategoryModal(false);
            setCategoryModalError('');
          }}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100 overscroll-contain hide-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#1e3a8a]">category</span>
                  <span>Manage Job Categories</span>
                </h3>
                <p className="text-xs text-slate-400">Add or manage job categories used across public and admin pages</p>
              </div>
              <button 
                onClick={() => {
                  setShowCategoryModal(false);
                  setCategoryModalError('');
                }} 
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Quick Add Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              const trimmed = categoryModalInput.trim();
              if (!trimmed) {
                setCategoryModalError('Please enter a category name.');
                return;
              }
              if (allCategories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
                setCategoryModalError('This category already exists.');
                return;
              }
              saveCustomCategory(trimmed);
              setCategoryModalInput('');
              setCategoryModalError('');
            }} className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Create New Category</label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="e.g. Surgical Vacancy, Dental Vacancy..."
                  value={categoryModalInput}
                  onChange={(e) => {
                    setCategoryModalInput(e.target.value);
                    if (categoryModalError) setCategoryModalError('');
                  }}
                  className="flex-1 border border-slate-300 focus:border-[#1e3a8a] rounded-lg px-3 py-2 outline-none text-xs"
                  autoFocus
                />
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#1e3a8a] hover:bg-blue-900 text-white rounded-lg text-xs font-bold shadow-sm transition-all whitespace-nowrap"
                >
                  + Add
                </button>
              </div>
              {categoryModalError && (
                <p className="text-xs text-red-500 font-medium">{categoryModalError}</p>
              )}
            </form>

            {/* Existing Categories List */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Active Categories ({allCategories.length})
              </label>
              <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl hide-scrollbar">
                {allCategories.map(cat => {
                  const jobCount = jobs.filter(j => j.category === cat).length;
                  const isCustom = customCategories.includes(cat);
                  return (
                    <div key={cat} className="flex justify-between items-center px-3.5 py-2.5 hover:bg-slate-50 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                        <span className="font-semibold text-slate-700">{cat}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {jobCount} {jobCount === 1 ? 'Job' : 'Jobs'}
                        </span>
                        {isCustom && jobCount === 0 && (
                          <button
                            type="button"
                            onClick={() => removeCustomCategory(cat)}
                            className="text-slate-400 hover:text-red-600 p-0.5 rounded"
                            title="Remove unused custom category"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => {
                  setShowCategoryModal(false);
                  setCategoryModalError('');
                }}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;
