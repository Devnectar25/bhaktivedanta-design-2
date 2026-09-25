import defaultDoctors from './defaultDoctors.json';


// Default data for appointments
const defaultAppointments = [
  {
    id: 'APT-4902',
    patientName: 'Amit Sharma',
    patientPhone: '+91 98765 43210',
    doctorName: 'Dr. Anand Sharma',
    department: 'Cardiology',
    dateTime: '24 Oct, 2023 10:30 AM',
    payment: 'Paid',
    status: 'Confirmed'
  },
  {
    id: 'APT-4903',
    patientName: 'Priya Kapoor',
    patientPhone: '+91 88776 55443',
    doctorName: 'Dr. Sunita Mehta',
    department: 'Pediatrics',
    dateTime: '24 Oct, 2023 11:15 AM',
    payment: 'Partial',
    status: 'Pending'
  },
  {
    id: 'APT-4899',
    patientName: 'Rohan Joshi',
    patientPhone: '+91 77665 44332',
    doctorName: 'Dr. Rajesh Kulkarni',
    department: 'Orthopedics',
    dateTime: '23 Oct, 2023 04:45 PM',
    payment: 'Paid',
    status: 'Completed'
  },
  {
    id: 'APT-4905',
    patientName: 'Sunita Bansal',
    patientPhone: '+91 99008 87766',
    doctorName: 'Dr. Priya Verma',
    department: 'Oncology',
    dateTime: '25 Oct, 2023 09:00 AM',
    payment: 'Unpaid',
    status: 'Cancelled'
  }
];

// Default data for events
const defaultEvents = [
  {
    id: 'EVT-101',
    title: 'Free Heart Health Check-up Camp',
    date: '28 Oct, 2023',
    time: '09:00 AM - 04:00 PM',
    venue: 'Hospital Ground Floor, OPD Block',
    status: 'Upcoming',
    description: 'Providing free ECG, blood pressure monitoring, and consultations with leading cardiologists.'
  },
  {
    id: 'EVT-102',
    title: 'CME on Advanced Laparoscopic Surgery',
    date: '15 Nov, 2023',
    time: '11:00 AM - 02:00 PM',
    venue: 'Seminar Hall, 4th Floor',
    status: 'Scheduled',
    description: 'A professional continuing medical education program for consulting surgeons and residents.'
  }
];


// Default data for news
const defaultNews = [
  {
    id: 'NWS-301',
    title: 'Bhaktivedanta Hospital Awarded NABH Accreditation',
    date: '10 Oct, 2023',
    category: 'Achievements',
    status: 'Published',
    content: 'We are proud to announce that our hospital has successfully received NABH accreditation, validating our standard clinical quality.'
  },
  {
    id: 'NWS-302',
    title: 'New Pediatric ICU Wing Inaugurated',
    date: '05 Oct, 2023',
    category: 'Announcements',
    status: 'Published',
    content: 'A state-of-the-art Pediatric Intensive Care Unit with 12 beds has been inaugurated on the 3rd floor by our Director.'
  }
];

// Default data for gallery media
const defaultGallery = [
  {
    id: 'GAL-401',
    title: 'Main Hospital Building',
    category: 'Infrastructure',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop',
    status: 'Active'
  },
  {
    id: 'GAL-402',
    title: 'Advanced Diagnostic Lab',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=800&auto=format&fit=crop',
    status: 'Active'
  }
];

// Default data for contact queries
const defaultQueries = [
  {
    id: 'QRY-501',
    name: 'Suresh Patil',
    email: 'suresh.patil@gmail.com',
    subject: 'Inquiry regarding Health Check-up Packages',
    message: 'Could you please provide details on pre-employment health screening packages?',
    date: '15 Jun, 2026',
    status: 'Pending'
  },
  {
    id: 'QRY-502',
    name: 'Meena Rao',
    email: 'meena.rao@yahoo.com',
    subject: 'Doctor Appointment availability',
    message: 'I would like to know if Dr. Rajesh Kulkarni is available on coming Thursday for orthopedics consultation.',
    date: '15 Jun, 2026',
    status: 'Resolved'
  }
];

// Default data for sub admins
const defaultSubAdmins = [
  {
    username: 'admin.aksh',
    email: 'aksh@bhaktivedantahospital.com',
    role: 'Operations Manager',
    status: 'Active',
    created: '9/21/2026'
  },
  {
    username: 'admin.kuldeep',
    email: 'kuldeep@bhaktivedantahospital.com',
    role: 'Administrator',
    status: 'Active',
    created: '9/21/2026'
  },
  {
    username: 'admin.Neha',
    email: 'Neha@bhaktivedantahospital.com',
    role: 'Content Manager',
    status: 'Active',
    created: '9/21/2026'
  },
  {
    username: 'admin.rajesh',
    email: 'rajesh@bhaktivedantahospital.com',
    role: 'Administration',
    status: 'Active',
    created: '15 Oct 2023'
  }
];

import {
  getDoctors, saveDoctorsList,
  getAppointments, saveAppointmentsList,
  getEvents, saveEventsList,
  getTestimonials, saveTestimonialsList,
  getReviews, saveReviewsList,
  getNews, saveNewsList,
  getGallery, saveGalleryList,
  getQueries, saveQueriesList,
  getSubadmins, saveSubadminsList
} from '../utils/api.js';

// Named exporters for initial states using API connection
export const initialDoctors = () => getDoctors(defaultDoctors);
export const saveDoctors = (data) => saveDoctorsList(data);

export const initialAppointments = () => getAppointments(defaultAppointments);
export const saveAppointments = (data) => saveAppointmentsList(data);

export const initialEvents = () => getEvents(defaultEvents);
export const saveEvents = (data) => saveEventsList(data);

export const defaultVipTestimonials = [
  {
    id: 'VIP-01',
    name: 'Hon. Late Dr. A. P. J. Abdul Kalam',
    designation: 'Former President Of India And Senior Scientist',
    content: "Bhaktivedanta Hospital's commitment to provide quality healthcare services to everyone, without any discrimination, is really commendable. When I visit the hospital facilities, I see the righteousness prevailing. Please keep it up!",
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/A._P._J._Abdul_Kalam_in_2008.jpg/440px-A._P._J._Abdul_Kalam_in_2008.jpg',
    status: 'Approved'
  },
  {
    id: 'VIP-02',
    name: 'Gaur Gopal Das',
    designation: 'Indian Monk, International Life Coach, Wellness Advisor, Author & Motivational Strategist',
    content: 'I have known Bhaktivedanta Hospital for the last 25 years as one of the most ethical & trusted hospitals in Mumbai providing world class medical services while staying true to their mission of providing affordable healthcare services, especially to the poor & needy.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    status: 'Approved'
  },
  {
    id: 'VIP-03',
    name: 'Mr. Alfred B. Ford',
    designation: 'Director – Ford Motor Foundation, Detroit USA',
    content: 'It has been a privilege for so many years to have known the doctors and staff of the Bhaktivedanta Hospital & Research Institute, Mumbai...I urge you from the bottom of my heart to please support this worthy project.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'Approved'
  },
  {
    id: 'VIP-04',
    name: 'Dr. Subramanian Swamy',
    designation: 'Ex-Rajya Sabha MP And Former Union Cabinet Minister',
    content: 'Very impressed by the organised way this hospital is run. Congrats.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'Approved'
  },
  {
    id: 'VIP-05',
    name: 'Ms. Niddhi Choudhari',
    designation: 'IAS, Ex-VMS Officer, Ex-RBI Officer',
    content: 'Thank you, Bhaktivedanta Hospital & Research Institute, for always co-operating with Palghar District Health Administration in improving health service delivery.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'Approved'
  },
  {
    id: 'VIP-06',
    name: 'Mr. Madhur Vishnu Talwalkar',
    designation: 'Director – Talwalkars Better Value Fitness Ltd.',
    content: 'Hats off to Bhaktivedanta Hospital & Research Institute for their great social work in India. Great!',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'Approved'
  }
];

export const defaultReviews = [
  {
    id: 'TST-201',
    patientName: 'Harish Mehta',
    disease: 'Angioplasty Patient',
    content: 'The care and attention I received at Bhaktivedanta Hospital was exceptional. Dr. Anand Sharma is highly professional and compassionate.',
    rating: 5,
    status: 'Approved'
  },
  {
    id: 'TST-202',
    patientName: 'Nalini Iyer',
    disease: 'Maternity Care',
    content: 'Very clean facilities and caring nursing staff. Standard protocols were strictly followed during my delivery. Highly recommended.',
    rating: 5,
    status: 'Approved'
  }
];

export const defaultTestimonials = defaultVipTestimonials;

export const initialTestimonials = () => getTestimonials(defaultVipTestimonials);
export const saveTestimonials = (data) => saveTestimonialsList(data);

export const initialReviews = () => getReviews(defaultReviews);
export const saveReviews = (data) => saveReviewsList(data);

export const initialNews = () => getNews(defaultNews);
export const saveNews = (data) => saveNewsList(data);

export const initialGallery = () => getGallery(defaultGallery);
export const saveGallery = (data) => saveGalleryList(data);

export const initialQueries = () => getQueries(defaultQueries);
export const saveQueries = (data) => saveQueriesList(data);

export const initialSubAdmins = () => getSubadmins(defaultSubAdmins);
export const saveSubAdmins = (data) => saveSubAdminsList(data);

// LocalStorage loaders and savers for local-only states
export function loadAdminData(key, fallback) {
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(`Error parsing data for ${key}:`, e);
    }
  }
  localStorage.setItem(key, JSON.stringify(fallback));
  return fallback;
}

export function saveAdminData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
