const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Helper to check if backend is online.
 */
let isServerOnline = null;

async function checkServerHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(1000) });
    isServerOnline = res.ok;
  } catch (err) {
    isServerOnline = false;
  }
  return isServerOnline;
}

/**
 * General wrapper to handle fetching with LocalStorage fallback.
 */
export async function apiGet(path, localStorageKey, fallbackData) {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, { signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      const data = await res.json();
      // Keep localStorage synchronized in background
      localStorage.setItem(localStorageKey, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn(`[API] Failed to fetch ${path}. Falling back to localStorage.`, err);
  }
  
  // Fallback to localStorage
  const local = localStorage.getItem(localStorageKey);
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {}
  }
  return fallbackData;
}

/**
 * General wrapper to handle mutation operations (POST/PUT/DELETE) with LocalStorage fallback.
 */
export async function apiMutation(path, method, body, localStorageKey, updateLocalFn) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(2000)
    };
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const res = await fetch(`${API_BASE_URL}${path}`, options);
    if (res.ok) {
      const serverResult = await res.json();
      
      // Keep local storage synced too
      if (updateLocalFn && localStorageKey) {
        const local = localStorage.getItem(localStorageKey);
        let localData = local ? JSON.parse(local) : null;
        const newLocalData = updateLocalFn(localData, serverResult);
        localStorage.setItem(localStorageKey, JSON.stringify(newLocalData));
      }
      return serverResult;
    }
  } catch (err) {
    console.warn(`[API] Mutation ${method} ${path} failed. Applying changes to localStorage fallback.`, err);
  }

  // Fallback storage update
  if (updateLocalFn && localStorageKey) {
    const local = localStorage.getItem(localStorageKey);
    let localData = local ? JSON.parse(local) : null;
    const newLocalData = updateLocalFn(localData, body);
    localStorage.setItem(localStorageKey, JSON.stringify(newLocalData));
    // Dispatch storage event to alert other components
    window.dispatchEvent(new Event('storage'));
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
export const addDoctor = (doc, fallbackList) => apiMutation('/doctors', 'POST', doc, 'bhaktivedanta_admin_doctors', (list = [], newDoc) => {
  return [...list, newDoc];
});
export const updateDoctor = (id, doc, fallbackList) => apiMutation(`/doctors/${id}`, 'PUT', doc, 'bhaktivedanta_admin_doctors', (list = [], updatedDoc) => {
  return list.map(item => item.id === id ? { ...item, ...updatedDoc } : item);
});
export const deleteDoctor = (id, fallbackList) => apiMutation(`/doctors/${id}`, 'DELETE', null, 'bhaktivedanta_admin_doctors', (list = []) => {
  return list.filter(item => item.id !== id);
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
