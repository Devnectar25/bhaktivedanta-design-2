import { logException } from './errorLogger';

let base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
if (base && !base.endsWith('/api') && !base.endsWith('/api/')) {
  base = base.replace(/\/$/, '') + '/api';
}
export const API_BASE_URL = base;

/**
 * Helper to check if backend is online.
 */
let isServerOnline = null;

export async function checkServerHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(1000) });
    isServerOnline = res.ok;
  } catch (err) {
    isServerOnline = false;
  }
  return isServerOnline;
}

/**
 * General wrapper to handle fetching with LocalStorage fallback and no-cache guarantees.
 */
export async function apiGet(path, localStorageKey, fallbackData) {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      signal: AbortSignal.timeout(4000),
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
    if (res.ok) {
      const data = await res.json();
      if (data) {
        localStorage.setItem(localStorageKey, JSON.stringify(data));
      }
      return data;
    } else if (path !== '/app-errors') {
      logException(`HTTP ${res.status} on GET ${path}`, 'API Gateway', 'Error', path);
    }
  } catch (err) {
    console.warn(`[API] Failed to fetch ${path}. Falling back to localStorage.`, err);
    if (path !== '/app-errors') {
      logException(err, 'API Gateway', 'Warning', path);
    }
  }

  const local = localStorage.getItem(localStorageKey);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      return parsed;
    } catch (e) { }
  }
  return fallbackData;
}

/**
 * General wrapper to handle mutation operations (POST/PUT/DELETE) with LocalStorage fallback.
 */
export async function apiMutation(path, method, body, localStorageKey, updateLocalFn) {
  let isNetworkError = false;
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(10000)
    };
    if (body) {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(`${API_BASE_URL}${path}`, options);
    if (res.ok) {
      const serverResult = await res.json();

      if (updateLocalFn && localStorageKey) {
        try {
          const local = localStorage.getItem(localStorageKey);
          let localData = (local && local !== 'undefined' && local !== 'null') ? JSON.parse(local) : [];
          if (!Array.isArray(localData)) localData = [];
          const newLocalData = updateLocalFn(localData, serverResult);
          localStorage.setItem(localStorageKey, JSON.stringify(newLocalData));
        } catch (lErr) {
          console.warn("[API] LocalStorage sync error:", lErr);
        }
      }
      return serverResult;
    } else {
      const errorJson = await res.json().catch(() => null);
      const errorMessage = errorJson?.error || errorJson?.message || `Request failed with status ${res.status}`;
      const err = new Error(errorMessage);
      err.status = res.status;
      err.data = errorJson;
      throw err;
    }
  } catch (err) {
    if (path !== '/app-errors' && !path.startsWith('/app-errors')) {
      logException(err, 'API Mutation', 'Error', path);
    }

    if (err.status) {
      // Re-throw explicit server error so UI can display backend validation message
      throw err;
    }

    console.warn(`[API] Mutation ${method} ${path} network failure. Applying changes to localStorage fallback.`, err);
    isNetworkError = true;
  }

  if (updateLocalFn && localStorageKey) {
    try {
      const local = localStorage.getItem(localStorageKey);
      let localData = (local && local !== 'undefined' && local !== 'null') ? JSON.parse(local) : undefined;
      const newLocalData = updateLocalFn(localData, body);
      localStorage.setItem(localStorageKey, JSON.stringify(newLocalData));
      window.dispatchEvent(new Event('storage'));
      return newLocalData || body;
    } catch (lErr) {
      console.warn("[API] LocalStorage fallback sync error:", lErr);
    }
    return body;
  }
  return null;
}

// ----------------------------------------------------
// ENTITY-SPECIFIC API CALLS
// ----------------------------------------------------

// Doctors
export const getDoctors = (fallback) => apiGet('/doctors', 'bhaktivedanta_admin_doctors', fallback);
export const saveDoctorsList = (list) => apiMutation('/doctors', 'PUT', list, 'bhaktivedanta_admin_doctors', (old, updated) => updated);
export const addDoctor = (doc, fallbackList) => apiMutation('/doctors', 'POST', doc, 'bhaktivedanta_admin_doctors', (list, newDoc) => {
  const arr = Array.isArray(list) ? list : [];
  return [newDoc, ...arr];
});
export const updateDoctor = (id, doc, fallbackList) => apiMutation(`/doctors/${id}`, 'PUT', doc, 'bhaktivedanta_admin_doctors', (list, updatedDoc) => {
  const arr = Array.isArray(list) ? list : [];
  return arr.map(item => item.id === id ? { ...item, ...updatedDoc } : item);
});
export const deleteDoctor = (id, fallbackList) => apiMutation(`/doctors/${id}`, 'DELETE', null, 'bhaktivedanta_admin_doctors', (list) => {
  const arr = Array.isArray(list) ? list : [];
  return arr.filter(item => item.id !== id);
});

// Appointments
export const getAppointments = (fallback) => apiGet('/appointments', 'bhaktivedanta_admin_appointments', fallback);
export const saveAppointmentsList = (list) => apiMutation('/appointments', 'PUT', list, 'bhaktivedanta_admin_appointments', (old, updated) => updated);
export const addAppointment = (apt, fallbackList) => apiMutation('/appointments', 'POST', apt, 'bhaktivedanta_admin_appointments', (list = [], newApt) => {
  return [...list, newApt];
});
export const updateAppointment = (id, apt, fallbackList) => apiMutation(`/appointments/${id}`, 'PUT', apt, 'bhaktivedanta_admin_appointments', (list = [], updatedApt) => {
  return list.map(item => item.id === id ? { ...item, ...updatedApt } : item);
});
export const deleteAppointment = (id, fallbackList) => apiMutation(`/appointments/${id}`, 'DELETE', null, 'bhaktivedanta_admin_appointments', (list = []) => {
  return list.filter(item => item.id !== id);
});

// Specialities State (Unified object)
export const getSpecialitiesState = (fallback) => apiGet('/specialities-state', 'bhaktivedanta_specialities_state', fallback);
export const saveSpecialitiesState = (state) => apiMutation('/specialities-state', 'PUT', state, 'bhaktivedanta_specialities_state', (oldState, newState) => {
  return newState;
});
export const deleteSpecialityById = (id) => apiMutation(`/specialities/${id}`, 'DELETE', null, 'bhaktivedanta_specialities_state', (oldState) => {
  if (!oldState) return oldState;
  return {
    ...oldState,
    specialities: (oldState.specialities || []).filter(s => s.id !== id)
  };
});

// Services State (Unified object)
export const getServicesState = (fallback) => apiGet('/services-state', 'bhaktivedanta_services_state', fallback);
export const saveServicesState = (state) => apiMutation('/services-state', 'PUT', state, 'bhaktivedanta_services_state', (oldState, newState) => {
  return newState;
});
export const deleteServiceById = (id) => apiMutation(`/services/${id}`, 'DELETE', null, 'bhaktivedanta_services_state', (oldState) => {
  if (!oldState) return oldState;
  return {
    ...oldState,
    services: (oldState.services || []).filter(s => s.id !== id)
  };
});
export const getServiceById = async (id, fallback) => {
  try {
    const directRes = await apiGet(`/services/${id}`, `bhaktivedanta_service_${id}`, null);
    if (directRes && directRes.id) {
      return directRes;
    }
  } catch (err) { }

  const state = await getServicesState(fallback);
  if (state && state.services) {
    const found = state.services.find(s => s.id === id || s.slug === `/${id}` || s.slug === id);
    if (found) return found;
  }
  return null;
};

// Events
export const getEvents = (fallback) => apiGet('/events', 'bhaktivedanta_admin_events', fallback);
export const saveEventsList = (list) => apiMutation('/events', 'PUT', list, 'bhaktivedanta_admin_events', (old, updated) => updated);
export const addEvent = (evt, fallbackList) => apiMutation('/events', 'POST', evt, 'bhaktivedanta_admin_events', (list = [], newEvt) => {
  return [...list, newEvt];
});
export const updateEvent = (id, evt, fallbackList) => apiMutation(`/events/${id}`, 'PUT', evt, 'bhaktivedanta_admin_events', (list = [], updatedEvt) => {
  return list.map(item => item.id === id ? { ...item, ...updatedEvt } : item);
});
export const deleteEvent = (id, fallbackList) => apiMutation(`/events/${id}`, 'DELETE', null, 'bhaktivedanta_admin_events', (list = []) => {
  return list.filter(item => item.id !== id);
});

// Testimonials
export const getTestimonials = (fallback) => apiGet('/testimonials', 'bhaktivedanta_admin_testimonials', fallback);
export const saveTestimonialsList = (list) => apiMutation('/testimonials', 'PUT', list, 'bhaktivedanta_admin_testimonials', (old, updated) => updated);
export const addTestimonial = (test, fallbackList) => apiMutation('/testimonials', 'POST', test, 'bhaktivedanta_admin_testimonials', (list = [], newTest) => {
  return [...list, newTest];
});
export const updateTestimonial = (id, test, fallbackList) => apiMutation(`/testimonials/${id}`, 'PUT', test, 'bhaktivedanta_admin_testimonials', (list = [], updatedTest) => {
  return list.map(item => item.id === id ? { ...item, ...updatedTest } : item);
});
export const deleteTestimonial = (id, fallbackList) => apiMutation(`/testimonials/${id}`, 'DELETE', null, 'bhaktivedanta_admin_testimonials', (list = []) => {
  return list.filter(item => item.id !== id);
});

// News
export const getNews = (fallback) => apiGet('/news', 'bhaktivedanta_admin_news', fallback);
export const saveNewsList = (list) => apiMutation('/news', 'PUT', list, 'bhaktivedanta_admin_news', (old, updated) => updated);
export const addNews = (newsItem, fallbackList) => apiMutation('/news', 'POST', newsItem, 'bhaktivedanta_admin_news', (list = [], newNews) => {
  return [...list, newNews];
});
export const updateNews = (id, newsItem, fallbackList) => apiMutation(`/news/${id}`, 'PUT', newsItem, 'bhaktivedanta_admin_news', (list = [], updatedNews) => {
  return list.map(item => item.id === id ? { ...item, ...updatedNews } : item);
});
export const deleteNews = (id, fallbackList) => apiMutation(`/news/${id}`, 'DELETE', null, 'bhaktivedanta_admin_news', (list = []) => {
  return list.filter(item => item.id !== id);
});

// Blogs
export const getBlogs = (fallback) => apiGet('/blogs', 'bhaktivedanta_admin_blogs', fallback);
export const getBlogById = (id, fallback) => apiGet(`/blogs/${id}`, `bhaktivedanta_admin_blog_${id}`, fallback);
export const addBlog = (blogItem) => apiMutation('/blogs', 'POST', blogItem, 'bhaktivedanta_admin_blogs', (list = [], newBlog) => {
  return [newBlog, ...list];
});
export const updateBlog = (id, blogItem) => apiMutation(`/blogs/${id}`, 'PUT', blogItem, 'bhaktivedanta_admin_blogs', (list = [], updatedBlog) => {
  return list.map(item => item.id === id ? { ...item, ...updatedBlog } : item);
});
export const deleteBlog = (id) => apiMutation(`/blogs/${id}`, 'DELETE', null, 'bhaktivedanta_admin_blogs', (list = []) => {
  return list.filter(item => item.id !== id);
});


// Gallery
export const getGallery = (fallback) => apiGet('/gallery', 'bhaktivedanta_admin_gallery', fallback);
export const saveGalleryList = (list) => apiMutation('/gallery', 'PUT', list, 'bhaktivedanta_admin_gallery', (old, updated) => updated);
export const addGallery = (media, fallbackList) => apiMutation('/gallery', 'POST', media, 'bhaktivedanta_admin_gallery', (list = [], newMedia) => {
  return [...list, newMedia];
});
export const updateGallery = (id, media, fallbackList) => apiMutation(`/gallery/${id}`, 'PUT', media, 'bhaktivedanta_admin_gallery', (list = [], updatedMedia) => {
  return list.map(item => item.id === id ? { ...item, ...updatedMedia } : item);
});
export const deleteGallery = (id, fallbackList) => apiMutation(`/gallery/${id}`, 'DELETE', null, 'bhaktivedanta_admin_gallery', (list = []) => {
  return list.filter(item => item.id !== id);
});

// Queries
export const getQueries = (fallback) => apiGet('/queries', 'bhaktivedanta_admin_queries', fallback);
export const saveQueriesList = (list) => apiMutation('/queries', 'PUT', list, 'bhaktivedanta_admin_queries', (old, updated) => updated);
export const addQuery = (query, fallbackList) => apiMutation('/queries', 'POST', query, 'bhaktivedanta_admin_queries', (list = [], newQuery) => {
  return [...list, newQuery];
});
export const updateQuery = (id, query, fallbackList) => apiMutation(`/queries/${id}`, 'PUT', query, 'bhaktivedanta_admin_queries', (list = [], updatedQuery) => {
  return list.map(item => item.id === id ? { ...item, ...updatedQuery } : item);
});
export const deleteQuery = (id, fallbackList) => apiMutation(`/queries/${id}`, 'DELETE', null, 'bhaktivedanta_admin_queries', (list = []) => {
  return list.filter(item => item.id !== id);
});

// Subadmins
export const getSubadmins = (fallback) => apiGet('/subadmins', 'bhaktivedanta_admin_subadmins', fallback);
export const saveSubadminsList = (list) => apiMutation('/subadmins', 'PUT', list, 'bhaktivedanta_admin_subadmins', (old, updated) => updated);
export const addSubadmin = (sub, fallbackList) => apiMutation('/subadmins', 'POST', sub, 'bhaktivedanta_admin_subadmins', (list = [], newSub) => {
  return [...list, newSub];
});
export const updateSubadmin = (username, sub, fallbackList) => apiMutation(`/subadmins/${username}`, 'PUT', sub, 'bhaktivedanta_admin_subadmins', (list = [], updatedSub) => {
  return list.map(item => item.username === username ? { ...item, ...updatedSub } : item);
});
export const deleteSubadmin = (username, fallbackList) => apiMutation(`/subadmins/${username}`, 'DELETE', null, 'bhaktivedanta_admin_subadmins', (list = []) => {
  return list.filter(item => item.username !== username);
});

// HelpDesk
export const getHelpDesk = (fallback) => apiGet('/helpdesk', 'bhaktivedanta_admin_helpdesk', fallback);
export const saveHelpDeskList = (list) => apiMutation('/helpdesk', 'PUT', list, 'bhaktivedanta_admin_helpdesk', (old, updated) => updated);
export const addHelpDeskTicket = (ticket, fallbackList) => apiMutation('/helpdesk', 'POST', ticket, 'bhaktivedanta_admin_helpdesk', (list = [], newTicket) => {
  return [newTicket, ...list];
});
export const updateHelpDeskTicket = (id, ticket, fallbackList) => apiMutation(`/helpdesk/${id}`, 'PUT', ticket, 'bhaktivedanta_admin_helpdesk', (list = [], updatedTicket) => {
  return list.map(item => item.id === id ? { ...item, ...updatedTicket } : item);
});
export const deleteHelpDeskTicket = (id, fallbackList) => apiMutation(`/helpdesk/${id}`, 'DELETE', null, 'bhaktivedanta_admin_helpdesk', (list = []) => {
  return list.filter(item => item.id !== id);
});

// Application Errors
export const getAppErrors = (fallback) => apiGet('/app-errors', 'bhaktivedanta_admin_app_errors', fallback);
export const addAppError = (errorItem) => apiMutation('/app-errors', 'POST', errorItem, 'bhaktivedanta_admin_app_errors', (list = [], newError) => {
  return [newError, ...list];
});
export const updateAppError = (id, errorItem) => apiMutation(`/app-errors/${id}`, 'PUT', errorItem, 'bhaktivedanta_admin_app_errors', (list = [], updatedError) => {
  return list.map(item => item.id === id ? { ...item, ...updatedError } : item);
});
export const clearAppErrors = () => apiMutation('/app-errors', 'DELETE', null, 'bhaktivedanta_admin_app_errors', () => []);

// Feedback Collection
export const getFeedback = (fallback) => apiGet('/feedback', 'bhaktivedanta_admin_feedback', fallback);
export const addFeedback = (feedbackItem) => apiMutation('/feedback', 'POST', feedbackItem, 'bhaktivedanta_admin_feedback', (list = [], newItem) => {
  return [newItem, ...list];
});
export const updateFeedback = (id, feedbackItem) => apiMutation(`/feedback/${id}`, 'PUT', feedbackItem, 'bhaktivedanta_admin_feedback', (list = [], updatedItem) => {
  return list.map(item => item.id === id ? { ...item, ...updatedItem } : item);
});
export const deleteFeedback = (id) => apiMutation(`/feedback/${id}`, 'DELETE', null, 'bhaktivedanta_admin_feedback', (list = []) => {
  return list.filter(item => item.id !== id);
});

// Patients Corner State (Unified object)
export const getPatientCornerState = (fallback) => apiGet('/patient-corner', 'bhaktivedanta_patient_corner_state', fallback);
export const savePatientCornerState = (state) => apiMutation('/patient-corner', 'PUT', state, 'bhaktivedanta_patient_corner_state', (oldState, newState) => {
  return newState;
});
export const getPatientCornerGuideById = async (id, fallback) => {
  try {
    const directRes = await apiGet(`/patient-corner/guides/${id}`, `bhaktivedanta_patient_guide_${id}`, null);
    if (directRes && directRes.id) {
      return directRes;
    }
  } catch (err) { }

  const state = await getPatientCornerState(fallback);
  if (state && state.guides) {
    const found = state.guides.find(g => g.id === id || g.slug === id || g.slug === `/${id}`);
    if (found) return found;
  }
  return null;
};

// Guide helpers for Patients Corner
export const createPatientCornerGuide = (guideData) =>
  apiMutation('/patient-corner/guides', 'POST', guideData, 'bhaktivedanta_patient_corner_state');

export const updatePatientCornerGuide = (id, guideData) =>
  apiMutation(`/patient-corner/guides/${id}`, 'PUT', guideData, 'bhaktivedanta_patient_corner_state');

export const deletePatientCornerGuide = (id) =>
  apiMutation(`/patient-corner/guides/${id}`, 'DELETE', null, 'bhaktivedanta_patient_corner_state');

// Tab helpers for Patients Corner
export const addPatientCornerTab = (guideId, tabData) =>
  apiMutation(`/patient-corner/guides/${guideId}/tabs`, 'POST', tabData, 'bhaktivedanta_patient_corner_state');

export const updatePatientCornerTab = (guideId, tabId, tabData) =>
  apiMutation(`/patient-corner/guides/${guideId}/tabs/${tabId}`, 'PUT', tabData, 'bhaktivedanta_patient_corner_state');

export const deletePatientCornerTab = (guideId, tabId) =>
  apiMutation(`/patient-corner/guides/${guideId}/tabs/${tabId}`, 'DELETE', null, 'bhaktivedanta_patient_corner_state');

export const reorderPatientCornerTabs = (guideId, tabIds) =>
  apiMutation(`/patient-corner/guides/${guideId}/tabs/reorder`, 'PUT', { tabIds }, 'bhaktivedanta_patient_corner_state');

// Section helpers for Patients Corner
export const addPatientCornerSection = (guideId, tabId, sectionData) => 
  apiMutation(`/patient-corner/guides/${guideId}/tabs/${tabId}/sections`, 'POST', sectionData, 'bhaktivedanta_patient_corner_state');

export const updatePatientCornerSection = (guideId, tabId, sectionId, sectionData) => 
  apiMutation(`/patient-corner/guides/${guideId}/tabs/${tabId}/sections/${sectionId}`, 'PUT', sectionData, 'bhaktivedanta_patient_corner_state');

export const deletePatientCornerSection = (guideId, tabId, sectionId) => 
  apiMutation(`/patient-corner/guides/${guideId}/tabs/${tabId}/sections/${sectionId}`, 'DELETE', null, 'bhaktivedanta_patient_corner_state');

export const reorderPatientCornerSections = (guideId, tabId, sectionIds) => 
  apiMutation(`/patient-corner/guides/${guideId}/tabs/${tabId}/sections/reorder`, 'PUT', { sectionIds }, 'bhaktivedanta_patient_corner_state');

export const togglePatientCornerSection = (guideId, tabId, sectionId, enabled) => 
  apiMutation(`/patient-corner/guides/${guideId}/tabs/${tabId}/sections/${sectionId}/status`, 'PATCH', { enabled }, 'bhaktivedanta_patient_corner_state');

// ==========================================
// Careers & Recruitment API
// ==========================================

// Job Openings
export const getCareerJobs = (fallback) => 
  apiGet('/careers/jobs', 'bhaktivedanta_career_jobs', fallback);

export const addCareerJob = (job, fallbackList) => 
  apiMutation('/careers/jobs', 'POST', job, 'bhaktivedanta_career_jobs', (list = [], newJob) => {
    return [newJob, ...list];
  });

export const updateCareerJob = (id, job, fallbackList) => 
  apiMutation(`/careers/jobs/${id}`, 'PUT', job, 'bhaktivedanta_career_jobs', (list = [], updated) => {
    return list.map(item => item.id === id ? { ...item, ...updated } : item);
  });

export const deleteCareerJob = (id, fallbackList) => 
  apiMutation(`/careers/jobs/${id}`, 'DELETE', null, 'bhaktivedanta_career_jobs', (list = []) => {
    return list.filter(item => item.id !== id);
  });

// Candidate Applications
export const getCareerApplications = (fallback) => 
  apiGet('/careers/applications', 'bhaktivedanta_career_applications', fallback);

export const submitCareerApplication = (appData, fallbackList) => 
  apiMutation('/careers/applications', 'POST', appData, 'bhaktivedanta_career_applications', (list = [], newApp) => {
    return [newApp, ...list];
  });

export const updateCareerApplication = (id, appData, fallbackList) => 
  apiMutation(`/careers/applications/${id}`, 'PUT', appData, 'bhaktivedanta_career_applications', (list = [], updated) => {
    return list.map(item => item.id === id ? { ...item, ...updated } : item);
  });

export const deleteCareerApplication = (id, fallbackList) => 
  apiMutation(`/careers/applications/${id}`, 'DELETE', null, 'bhaktivedanta_career_applications', (list = []) => {
    return list.filter(item => item.id !== id);
  });

// ==========================================
// Education & Medical Research (DNB) API
// ==========================================

export const getEducationResearchState = (fallback) => 
  apiGet('/education-research', 'bhaktivedanta_education_research_state', fallback);

export const saveEducationResearchState = (stateData) => 
  apiMutation('/education-research', 'PUT', stateData, 'bhaktivedanta_education_research_state', () => {
    // Notify all open tabs/components
    window.dispatchEvent(new Event('admin_data_updated'));
    return stateData;
  });

export const getDnbInquiries = (fallback = []) => 
  apiGet('/education-research/inquiries', 'bhaktivedanta_dnb_inquiries', fallback);

export const submitDnbInquiry = (inquiry, fallbackList = []) => 
  apiMutation('/education-research/inquiries', 'POST', inquiry, 'bhaktivedanta_dnb_inquiries', (list = [], newInq) => {
    const updated = [newInq, ...(Array.isArray(list) ? list : [])];
    window.dispatchEvent(new Event('admin_data_updated'));
    return updated;
  });

export const updateDnbInquiry = (id, updates, fallbackList = []) => 
  apiMutation(`/education-research/inquiries/${id}`, 'PUT', updates, 'bhaktivedanta_dnb_inquiries', (list = [], updatedItem) => {
    const updated = (Array.isArray(list) ? list : []).map(i => i.id === id ? { ...i, ...updatedItem } : i);
    window.dispatchEvent(new Event('admin_data_updated'));
    return updated;
  });

export const deleteDnbInquiry = (id, fallbackList = []) => 
  apiMutation(`/education-research/inquiries/${id}`, 'DELETE', null, 'bhaktivedanta_dnb_inquiries', (list = []) => {
    const updated = (Array.isArray(list) ? list : []).filter(i => i.id !== id);
    window.dispatchEvent(new Event('admin_data_updated'));
    return updated;
  });

export const getEducationPrograms = (fallback = []) => 
  apiGet('/education-research/programs', 'bhaktivedanta_education_custom_programs', fallback);

export const createEducationProgram = (programData) => 
  apiMutation('/education-research/programs', 'POST', programData, 'bhaktivedanta_education_custom_programs', (list = [], newProg) => {
    const updated = [newProg, ...(Array.isArray(list) ? list : [])];
    window.dispatchEvent(new Event('admin_data_updated'));
    return updated;
  });

export const deleteEducationProgram = (id) => 
  apiMutation(`/education-research/programs/${id}`, 'DELETE', null, 'bhaktivedanta_education_custom_programs', (list = []) => {
    const updated = (Array.isArray(list) ? list : []).filter(p => p.id !== id && p.slug !== id);
    window.dispatchEvent(new Event('admin_data_updated'));
    return updated;
  });

// Spiritual Care State
export const getSpiritualCareState = (fallback) => 
  apiGet('/spiritual-care', 'bhaktivedanta_spiritual_care_state', fallback);

export const saveSpiritualCareState = (state) => 
  apiMutation('/spiritual-care', 'PUT', state, 'bhaktivedanta_spiritual_care_state', (old, updated) => updated);

// Statutory Compliances State & PDF Upload
export const getStatutoryCompliancesState = (fallback) =>
  apiGet('/statutory-compliances', 'bhaktivedanta_statutory_compliances_state', fallback);

export const saveStatutoryCompliancesState = (state) =>
  apiMutation('/statutory-compliances', 'PUT', state, 'bhaktivedanta_statutory_compliances_state', (old, updated) => {
    window.dispatchEvent(new Event('admin_data_updated'));
    return updated;
  });

export const resetStatutoryCompliancesState = () =>
  apiMutation('/statutory-compliances/reset', 'POST', {}, 'bhaktivedanta_statutory_compliances_state', (old, updated) => {
    window.dispatchEvent(new Event('admin_data_updated'));
    return updated;
  });

export const uploadStatutoryPdf = async (title, fileName, base64Data) => {
  try {
    const res = await fetch(`${API_BASE_URL}/statutory-compliances/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, fileName, base64Data })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[API] Upload statutory PDF failed:', err);
  }
  return { success: true, url: base64Data, fallback: true };
};


