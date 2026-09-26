// Associate Centre data – content extracted from the live Bhaktivedanta Hospital website
// Each centre has its own slug, title, contact info, overview, services, community services, and map embed.

const associateCentresData = {
  'swami-shraddhanand-hospital': {
    slug: 'swami-shraddhanand-hospital',
    title: 'Swami Shraddhanand Hospital',
    bannerImg: 'https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/banner/16690445752450.png',
    address: 'Nirmal Village, Nirmal Road, Vasai (W), Dist. Palghar - 401 304, Maharashtra, India.',
    phone: '+91 70456 94147 / +91 82918 18030',
    highlights: [
      { text: 'A charitable Multi-Disciplinary Hospital.', icon: '/images/oac-1.png' },
      { text: 'Supported by qualified and experienced doctors and staff.', icon: '/images/oac-2.png' },
      { text: 'Equipped with modern technologies.', icon: '/images/oac-3.png' }
    ],
    overview: [
      'Swami Shraddhanand Hospital is a charitable multi-disciplinary hospital located at Vasai known for providing healthcare to the society at affordable rates. The hospital organises massive camps and awareness programs for the community to serve humanity.',
      'The hospital is supported by qualified and experienced doctors and staff. It is equipped with modern OT, ICU, Pathology Lab, X-Ray, Sonography, Dialysis unit to assist the patients at highly affordable rates.',
      'Swami Shraddhanand Hospital is also known for its Department of Palliative Care which, with a dedicated team of doctors, nurses and volunteers provides medical, social, emotional and practical support to bed ridden and terminally ill patients.'
    ],
    services: [
      'Outpatient',
      'Inpatient',
      'ICU',
      'Eye Care',
      'Dialysis',
      'Ayurveda & Panchkarma',
      'Physiotherapy',
      'Laboratory Services, X-Ray and Sonography',
      'Palliative Care Services',
      'Garbha Samskara'
    ],
    communityServices: [
      { name: 'Cataract Surgeries', icon: '/images/oacs-1.png' },
      { name: 'Camps', icon: '/images/oacs-2.png' },
      { name: 'MJPJAY Scheme', icon: '/images/oacs-3.png' }
    ],
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3763.3261790347483!2d72.77958221470226!3d19.3983078468034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7abf55c22f837%3A0xf73d175f5b0b9f65!2sSwami%20Shraddhanand%20Hospital!5e0!3m2!1sen!2sin!4'
  },
  'sheth-pb-doshi-hospital': {
    slug: 'sheth-pb-doshi-hospital',
    title: 'Sheth P. V. Doshi Hospital',
    bannerImg: 'https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/banner/16690719504180.png',
    address: 'Poonam Nagar, Shanti Park, Mira Road (E), Thane - 401 107, Maharashtra, India.',
    phone: '+91 22 6230 3300/3301, 28102964',
    highlights: [
      { text: 'A charitable Multi-Disciplinary Hospital.', icon: '/images/oac-1.png' },
      { text: 'Supported by qualified and experienced doctors and staff.', icon: '/images/oac-2.png' },
      { text: 'Equipped with modern technologies.', icon: '/images/oac-3.png' }
    ],
    overview: [
      'Sheth P V Doshi Hospital is the closest associate centre conducted by the Bhaktivedanta Hospital & Research Institute from 2012. The charitable multi-disciplinary hospital is well-known for offering medical services to patients from Andheri to Dahanu at affordable rates.',
      'The hospital has been at the forefront fulfilling the needs of community and providing healthcare to the society. The hospital plans to be a 50-bedded Secondary level hospital providing quality healthcare services at discounted rates.',
      'The hospital comprises of experienced doctors supported by modern OT, critical care facilities, dialysis unit, diagnostics, and imaging services to assist patients. Sheth P V Doshi offers OPD facilities for general medicine and super specialties like ophthalmology, dental, ayurveda, oncology, pediatrics, etc.',
      'The hospital offers spiritual care and emotional support to the patients, their families and friends, our doctors, staff members and others with compassion and respect, responding to each person’s unique values and beliefs.'
    ],
    services: [
      'General OPD', 'Ayurveda', 'Oncology', 'Cardiology', 'Dermatology',
      'Dietician', 'Dental OPD', 'ENT OPD', 'Homeopathy', 'Nephrology',
      'Orthopedics', 'Plastic Surgery', 'Pediatrics', 'Physician',
      'Physiotherapy', 'Sonography', 'Pathology', 'Pharmacy', 'Dialysis',
      'Optical Shop', 'Radiologist', 'Urology', 'Gynecology'
    ],
    communityServices: [
      { name: 'Cataract Surgeries', icon: '/images/oacs-1.png' },
      { name: 'Camps', icon: '/images/oacs-2.png' },
      { name: 'MJPJAY Scheme', icon: '/images/oacs-3.png' }
    ],
    mapSrc: 'https://maps.google.com/maps?q=Sheth+P+V+Doshi+Hospital+Mira+Road+Thane&t=&z=15&ie=UTF8&iwloc=&output=embed'
  },
  'primary-health-care-centre-pophran': {
    slug: 'primary-health-care-centre-pophran',
    title: 'Primary Health Care Centre – Pophran',
    bannerImg: 'https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/banner/1669072859413.png',
    address: 'Pophran, Tarapur, District Palghar, Maharashtra 401504, India',
    phone: '+91 70456 94147 / +91 82918 18030',
    highlights: [
      { text: 'A charitable Multi-Disciplinary Health Centre.', icon: '/images/oac-1.png' },
      { text: 'Supported by qualified and experienced doctors and staff.', icon: '/images/oac-2.png' },
      { text: 'Serving rural and tribal communities of Palghar.', icon: '/images/oac-3.png' }
    ],
    overview: [
      'The Primary Health Care Centre is located at Pophran in Tarapur district Palghar. The centre serves people affected by Tarapur Atomic Power Station (TAPS) project.',
      'The community health centre was initiated by Nuclear Power Corporation of India Limited (NPCIL). Our committed community services in rural and tribal areas encouraged them to invite us to run the project. We have been providing healthcare facilities to the locals free of cost sponsored by NPCIL.',
      'General OPD and Day Care facilities are provided at the centre. The Primary Health Care Centre conducts lots of outreach activities to reach the rural and tribal areas adjacent to Pophran.',
      'Spiritual sessions are conducted regularly at the centre for well-being of the community, patients and staff of the hospital.'
    ],
    services: [
      'General OPD', 'Day Care Facilities', 'Community Outreach Programs',
      'Emergency First Aid', 'Maternal & Child Health Care', 'Preventive Health Checks'
    ],
    communityServices: [
      { name: 'Cataract Surgeries', icon: '/images/oacs-1.png' },
      { name: 'Camps', icon: '/images/oacs-2.png' },
      { name: 'MJPJAY Scheme', icon: '/images/oacs-3.png' }
    ],
    mapSrc: 'https://maps.google.com/maps?q=Primary+Health+Care+Centre+Pophran+Tarapur+Palghar&t=&z=14&ie=UTF8&iwloc=&output=embed'
  },
  'hamrapur-healthcare-centre': {
    slug: 'hamrapur-healthcare-centre',
    title: 'Hamrapur Healthcare Centre',
    bannerImg: 'https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/banner/16690729886567.png',
    address: 'Hamrapur, Near Zilla Parishad School, Village - Hamrapur, Tal. Wada, Dist. Palghar, Maharashtra 421303, India',
    phone: '+91 88796 61759',
    highlights: [
      { text: 'A charitable Multi-Disciplinary Healthcare Centre.', icon: '/images/oac-1.png' },
      { text: 'Supported by qualified and experienced doctors and staff.', icon: '/images/oac-2.png' },
      { text: 'Equipped with modern dental and diagnostic facilities.', icon: '/images/oac-3.png' }
    ],
    overview: [
      'Bhaktivedanta Hospital\'s Lions Juhu Nirmala Om Agarwal\'s Community Health Centre at Hamrapur serves the tribal and rural community of Wada taluka in Palghar district.',
      'The centre provides essential healthcare facilities to the underserved communities in the remote areas of Palghar, helping thousands of patients annually.',
      'Regular health camps and dental camps are organized to provide comprehensive healthcare to the local population, along with ophthalmic consultations and medicine distribution.'
    ],
    services: [
      'General OPD', 'Day Care', 'Dental OPD',
      'Ophthal OPD (alternate days)',
      'Optical (alternate days)',
      'Outreach Health Activities'
    ],
    communityServices: [
      { name: 'Cataract Surgeries', icon: '/images/oacs-1.png' },
      { name: 'Camps', icon: '/images/oacs-2.png' },
      { name: 'MJPJAY Scheme', icon: '/images/oacs-3.png' }
    ],
    mapSrc: 'https://maps.google.com/maps?q=Hamrapur+Wada+Palghar+Maharashtra&t=&z=14&ie=UTF8&iwloc=&output=embed'
  },
  'ambiste-healthcare-centre': {
    slug: 'ambiste-healthcare-centre',
    title: 'Ambiste Healthcare Centre',
    bannerImg: 'https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/banner/16690731216664.png',
    address: 'Ambiste, District Palghar, Maharashtra 401602.',
    phone: '+91 70453 09993',
    highlights: [
      { text: 'Community Healthcare Centre for Tribal Regions.', icon: '/images/oac-1.png' },
      { text: 'Supported by qualified and experienced doctors and staff.', icon: '/images/oac-2.png' },
      { text: 'Free & affordable healthcare outreach services.', icon: '/images/oac-3.png' }
    ],
    overview: [
      'The Ambiste Healthcare Centre is an associate healthcare initiative of Bhaktivedanta Hospital dedicated to reaching tribal and economically challenged populations in Palghar district.',
      'It conducts regular medical camps, provides essential outpatient care, delivers preventive medicine, and organizes specialized eye screening and maternal care camps.',
      'The dedicated medical team works in close partnership with village leaders to ensure continuous healthcare access for every family in the surrounding villages.'
    ],
    services: [
      'General Outpatient Care', 'Basic Diagnostics',
      'Preventive Healthcare & Education', 'Child & Maternal Health',
      'Health Screening Camps', 'Free Medicine Distribution'
    ],
    communityServices: [
      { name: 'Cataract Surgeries', icon: '/images/oacs-1.png' },
      { name: 'Camps', icon: '/images/oacs-2.png' },
      { name: 'MJPJAY Scheme', icon: '/images/oacs-3.png' }
    ],
    mapSrc: 'https://maps.google.com/maps?q=Ambiste+Palghar+Maharashtra&t=&z=14&ie=UTF8&iwloc=&output=embed'
  },
  'bhaktivedanta-polyclinic': {
    slug: 'bhaktivedanta-polyclinic',
    title: 'Bhaktivedanta Polyclinic',
    bannerImg: 'https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/banner/1669073289656.png',
    address: 'A/5, Sector 5, Shanti Nagar, Opp. Water Tank, Mira Road (E), Thane 401 107, Maharashtra, India.',
    phone: '+91 70459 61366',
    highlights: [
      { text: 'Comprehensive Multi-Speciality Polyclinic.', icon: '/images/oac-1.png' },
      { text: 'Expert Consultants and Modern Diagnostics.', icon: '/images/oac-2.png' },
      { text: 'Conveniently located at Mira Road Shanti Nagar.', icon: '/images/oac-3.png' }
    ],
    overview: [
      'Bhaktivedanta Polyclinic in Shanti Nagar, Mira Road provides high quality multi-speciality consultations and diagnostic services closer to residents.',
      'Staffed by senior consultants from Bhaktivedanta Hospital, the polyclinic offers outpatient consultations across various medical disciplines along with on-site pharmacy and diagnostic sampling.',
      'Patients enjoy seamless referral coordination with the main hospital for advanced procedures, inpatient admissions, and surgical interventions.'
    ],
    services: [
      'General Medicine OPD', 'Cardiology Consultations', 'Gynecology & Obstetrics',
      'Pediatric Care', 'Orthopedics', 'Dermatology', 'Pathology Sample Collection',
      'Pharmacy Services', 'Diet & Nutrition Counseling'
    ],
    communityServices: [
      { name: 'Cataract Surgeries', icon: '/images/oacs-1.png' },
      { name: 'Camps', icon: '/images/oacs-2.png' },
      { name: 'MJPJAY Scheme', icon: '/images/oacs-3.png' }
    ],
    mapSrc: 'https://maps.google.com/maps?q=Shanti+Nagar+Mira+Road+Thane&t=&z=15&ie=UTF8&iwloc=&output=embed'
  },
  'bhaktivedanta-hospital-vrindavan': {
    slug: 'bhaktivedanta-hospital-vrindavan',
    title: 'Bhaktivedanta Hospital – Vrindavan',
    bannerImg: 'https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/banner/16690733802319.png',
    address: 'Parikrama Marg, Near Baraha Ghat, Vrindavan, Mathura 281 121, Uttar Pradesh, India.',
    phone: '+91 56564 58881',
    highlights: [
      { text: 'A premier charitable healthcare facility in Braj.', icon: '/images/oac-1.png' },
      { text: 'Supported by qualified and experienced doctors and staff.', icon: '/images/oac-2.png' },
      { text: 'Equipped with modern emergency and surgical care.', icon: '/images/oac-3.png' }
    ],
    overview: [
      'Bhaktivedanta Hospital, Vrindavan provides compassionate, top-quality medical care to pilgrims, sadhus, residents, and visitors of the holy town of Vrindavan and surrounding Braj region.',
      'With state-of-the-art emergency services, critical care, surgical suites, and specialized outpatient departments, it is a trusted healthcare sanctuary in Uttar Pradesh.',
      'The hospital also runs extensive charitable initiatives, providing free treatments, medications, and health check-ups to elderly ascetics, sadhus, and indigent local residents.'
    ],
    services: [
      '24/7 Emergency Care', 'Inpatient & Critical Care ICU', 'Surgical Specialties',
      'General Medicine', 'Cardiology & Echo', 'Dialysis Centre', 'Ayurveda & Holistic Health',
      'Pathology & Digital Radiology', 'Pharmacy Services'
    ],
    communityServices: [
      { name: 'Cataract Surgeries', icon: '/images/oacs-1.png' },
      { name: 'Camps', icon: '/images/oacs-2.png' },
      { name: 'MJPJAY Scheme', icon: '/images/oacs-3.png' }
    ],
    mapSrc: 'https://maps.google.com/maps?q=Bhaktivedanta+Hospital+Vrindavan+Mathura&t=&z=15&ie=UTF8&iwloc=&output=embed'
  },
  'bhaktivedanta-eye-hospital-barsana': {
    slug: 'bhaktivedanta-eye-hospital-barsana',
    title: 'Bhaktivedanta Eye Hospital – Barsana',
    bannerImg: 'https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/banner/16690734795799.png',
    address: 'Barsana, District Mathura, Uttar Pradesh 281405.',
    phone: '+91 89583 43333',
    highlights: [
      { text: 'Specialized Ophthalmology & Eye Surgery Hospital.', icon: '/images/oac-1.png' },
      { text: 'World-class microsurgical OT & cataract facilities.', icon: '/images/oac-2.png' },
      { text: 'Thousands of free cataract surgeries delivered each year.', icon: '/images/oac-3.png' }
    ],
    overview: [
      'Bhaktivedanta Eye Hospital in Barsana is renowned for restoring sight to thousands of underprivileged rural people across the Braj region and adjacent districts.',
      'Equipped with advanced diagnostic imaging, modern phacoemulsification technology, and sterile operating theaters, the hospital conducts regular free eye screening camps followed by free cataract surgeries with intraocular lens implants.',
      'The centre also provides comprehensive refractive error corrections, spectacles dispensing, and treatment for glaucoma, retinal conditions, and ocular infections.'
    ],
    services: [
      'Comprehensive Eye Examinations', 'Micro-incision Cataract Surgery (Phaco)',
      'Glaucoma Clinic', 'Pediatric Ophthalmology', 'Retinal Evaluation',
      'Spectacle & Optical Dispensing', 'Community Outreach Eye Camps'
    ],
    communityServices: [
      { name: 'Cataract Surgeries', icon: '/images/oacs-1.png' },
      { name: 'Camps', icon: '/images/oacs-2.png' },
      { name: 'MJPJAY Scheme', icon: '/images/oacs-3.png' }
    ],
    mapSrc: 'https://maps.google.com/maps?q=Barsana+Mathura+Uttar+Pradesh&t=&z=14&ie=UTF8&iwloc=&output=embed'
  },
  'saksham-community-health-centre-dhuktan': {
    slug: 'saksham-community-health-centre-dhuktan',
    title: 'Saksham Community Health Centre – Dhuktan',
    bannerImg: 'https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/banner/16690736177579.png',
    address: 'Dhuktan, Palghar, Maharashtra, India.',
    phone: '+91 93592 71935',
    highlights: [
      { text: 'Dedicated Community Health Center in Rural Palghar.', icon: '/images/oac-1.png' },
      { text: 'Supported by experienced primary care doctors & nursing staff.', icon: '/images/oac-2.png' },
      { text: 'Focused on tribal welfare, malnutrition & preventive care.', icon: '/images/oac-3.png' }
    ],
    overview: [
      'Saksham Community Health Centre at Dhuktan was established to uplift healthcare delivery in the tribal belt of Palghar district.',
      'The centre delivers reliable outpatient services, malnutrition intervention programs for children, maternal wellness check-ups, and emergency stabilization before hospital transfer.',
      'Through active grassroots engagement, the center has significantly improved immunization coverage, hygiene awareness, and disease prevention in Dhuktan and neighboring hamlets.'
    ],
    services: [
      'General OPD Services', 'Child Nutrition & Growth Monitoring',
      'Maternal & Antenatal Checkups', 'First Aid & Emergency Care',
      'Immunization & Preventive Health', 'Health Education Workshops'
    ],
    communityServices: [
      { name: 'Cataract Surgeries', icon: '/images/oacs-1.png' },
      { name: 'Camps', icon: '/images/oacs-2.png' },
      { name: 'MJPJAY Scheme', icon: '/images/oacs-3.png' }
    ],
    mapSrc: 'https://maps.google.com/maps?q=Dhuktan+Palghar+Maharashtra&t=&z=14&ie=UTF8&iwloc=&output=embed'
  }
};

export const associateCentresList = Object.values(associateCentresData).map(c => ({
  slug: c.slug,
  name: c.title,
  address: c.address,
  phone: c.phone
}));

export default associateCentresData;
