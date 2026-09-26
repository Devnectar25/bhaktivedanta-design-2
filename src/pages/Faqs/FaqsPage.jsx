import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Search,
  ChevronDown,
  Phone,
  MessageCircle,
  Calendar,
  Building,
  ShieldCheck,
  Stethoscope,
  Heart,
  ArrowRight
} from 'lucide-react';
import { getFaqs } from '../../utils/api';
import './FaqsPage.css';

const FAQ_CATEGORIES = [
  { id: 'all', label: 'All Questions', icon: HelpCircle },
  { id: 'appointment', label: 'Appointments & OPD', icon: Calendar },
  { id: 'admission', label: 'Admission & Inpatient', icon: Building },
  { id: 'insurance', label: 'Insurance & TPA', icon: ShieldCheck },
  { id: 'emergency', label: 'Emergency & Diagnostics', icon: Stethoscope },
  { id: 'spiritual', label: 'Spiritual Care & Visitors', icon: Heart }
];

const DEFAULT_FAQS = [
  {
    id: 1,
    category: 'appointment',
    categoryLabel: 'Appointments & OPD',
    question: 'How can I book an appointment with a doctor at Bhaktivedanta Hospital?',
    answer: 'You can book an appointment online through our website using the "Book Appointment" button, by calling our centralized appointment desk at 079-69002222, or via WhatsApp at 8400146262. Walk-in appointments are also accepted at the OPD registration counters.'
  },
  {
    id: 2,
    category: 'appointment',
    categoryLabel: 'Appointments & OPD',
    question: 'What are the OPD consultation timings?',
    answer: 'General and specialist OPD consultations run Monday through Saturday from 9:00 AM to 8:00 PM. Certain super-specialty clinics have dedicated days and time slots. Please check doctor availability online or confirm with the reception before your visit.'
  },
  {
    id: 3,
    category: 'appointment',
    categoryLabel: 'Appointments & OPD',
    question: 'Can I reschedule or cancel my booked appointment?',
    answer: 'Yes, you can reschedule or cancel your appointment up to 2 hours prior to your scheduled time slot by calling our helpline at 079-69002222 or messaging us on WhatsApp with your appointment reference number.'
  },
  {
    id: 4,
    category: 'admission',
    categoryLabel: 'Admission & Inpatient',
    question: 'What documents are required during inpatient admission?',
    answer: 'For planned or emergency admission, please carry: 1) Doctor’s admission advice note, 2) Government-issued photo ID (Aadhaar Card / PAN Card / Passport) of patient and attendant, 3) Past medical records, prescription history, and diagnostic reports, 4) Insurance/TPA card & policy documents (if cashless).'
  },
  {
    id: 5,
    category: 'admission',
    categoryLabel: 'Admission & Inpatient',
    question: 'What types of room accommodations are available?',
    answer: 'We offer a wide range of patient-centric accommodations including General Wards, Semi-Private Twin Sharing rooms, Single Private Rooms, Deluxe Suites, as well as state-of-the-art Intensive Care Units (ICU, ICCU, NICU, PICU) equipped with high-dependency monitoring.'
  },
  {
    id: 6,
    category: 'admission',
    categoryLabel: 'Admission & Inpatient',
    question: 'What are the hospital visiting hours for relatives?',
    answer: 'Visiting hours are strictly designed to balance patient rest and infection prevention: General & Private Wards: 4:30 PM to 7:00 PM (Daily). ICU / Critical Care Units: 11:00 AM to 12:00 PM and 5:00 PM to 6:00 PM (1 attendant only with visitor pass).'
  },
  {
    id: 7,
    category: 'insurance',
    categoryLabel: 'Insurance & TPA',
    question: 'Does Bhaktivedanta Hospital offer cashless mediclaim facilities?',
    answer: 'Yes, our dedicated TPA & Insurance Desk supports cashless mediclaim services with leading government and private insurance companies, TPAs, and corporate organizations. Pre-authorization is processed directly with your insurer.'
  },
  {
    id: 8,
    category: 'insurance',
    categoryLabel: 'Insurance & TPA',
    question: 'How long does the cashless insurance pre-authorization approval take?',
    answer: 'For planned admissions, pre-authorization should be initiated 48–72 hours prior to admission. For emergency admissions, the initial pre-authorization request is submitted to the TPA within 3 hours of admission.'
  },
  {
    id: 9,
    category: 'insurance',
    categoryLabel: 'Insurance & TPA',
    question: 'What happens if my insurance cashless claim is partially approved or denied?',
    answer: 'In the rare event of a cashless denial or partial settlement, you may pay the balance amount directly to the hospital at discharge and subsequently submit the original bills, discharge summary, and payment receipts to your insurer for reimbursement.'
  },
  {
    id: 10,
    category: 'emergency',
    categoryLabel: 'Emergency & Diagnostics',
    question: 'Are Emergency and Trauma services operational 24x7?',
    answer: 'Yes, our 24x7 Emergency and Trauma Centre is fully operational round-the-clock with dedicated emergency physicians, advanced life support (ALS) ambulances, trauma OT, and rapid triaging. For emergency assistance, immediately call 079-69002222.'
  },
  {
    id: 11,
    category: 'emergency',
    categoryLabel: 'Emergency & Diagnostics',
    question: 'Are the Pharmacy and Diagnostic Labs open round-the-clock?',
    answer: 'Yes, our in-house Pathology Laboratory, Digital Radiology/Imaging Services (CT Scan, Ultrasound, Digital X-ray), and 24-hour Inpatient Pharmacy are open 24 hours a day, 365 days a year.'
  },
  {
    id: 12,
    category: 'emergency',
    categoryLabel: 'Emergency & Diagnostics',
    question: 'How can I collect my pathology or radiology test reports?',
    answer: 'Diagnostic reports can be collected in person from the Central Reports Dispatch counter, or accessed electronically via our Patient Portal / WhatsApp notification as soon as tests are verified by our pathologists.'
  },
  {
    id: 13,
    category: 'spiritual',
    categoryLabel: 'Spiritual Care & Visitors',
    question: 'What is the Spiritual Care Department at Bhaktivedanta Hospital?',
    answer: 'Unique to Bhaktivedanta Hospital, our Spiritual Care Department offers holistic healing addressing emotional, psychological, and spiritual well-being alongside advanced clinical treatment. Qualified counselors provide empathetic guidance, prayer sessions, and meditation support for patients and families.'
  },
  {
    id: 14,
    category: 'spiritual',
    categoryLabel: 'Spiritual Care & Visitors',
    question: 'Are pure vegetarian meals provided to patients?',
    answer: 'Yes, our Dietary Department provides 100% wholesome, pure vegetarian, satvik meals hygienically prepared under the supervision of qualified clinical nutritionists, tailored specifically to each patient’s medical and dietary requirements.'
  }
];

const FaqsPage = () => {
  const [faqs, setFaqs] = useState(DEFAULT_FAQS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Frequently Asked Questions (FAQs) | Bhaktivedanta Hospital';

    const loadLiveFaqs = async () => {
      try {
        const data = await getFaqs(DEFAULT_FAQS);
        if (Array.isArray(data) && data.length > 0) {
          setFaqs(data);
        }
      } catch (err) {
        console.warn('Could not fetch live FAQs:', err);
      }
    };

    loadLiveFaqs();

    const handleUpdate = () => loadLiveFaqs();
    window.addEventListener('faqs_updated', handleUpdate);
    window.addEventListener('admin_data_updated', handleUpdate);

    return () => {
      window.removeEventListener('faqs_updated', handleUpdate);
      window.removeEventListener('admin_data_updated', handleUpdate);
    };
  }, []);

  const toggleFaq = (id) => {
    setOpenFaqId(prev => (prev === id ? null : id));
  };

  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      // Hide inactive FAQs from public visitors
      if (faq.status === 'Inactive') return false;

      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        faq.question?.toLowerCase().includes(q) ||
        faq.answer?.toLowerCase().includes(q) ||
        faq.categoryLabel?.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [faqs, selectedCategory, searchQuery]);

  // Set default open FAQ when list loads or changes
  useEffect(() => {
    if (filteredFaqs.length > 0 && openFaqId === null) {
      setOpenFaqId(filteredFaqs[0].id);
    }
  }, [filteredFaqs, openFaqId]);

  return (
    <div className="faqs-page-container">
      {/* Hero Box Section */}
      <section className="faqs-hero-section">
        <div className="container">
          <div className="faqs-hero-box">
            <span className="faqs-badge">
              <HelpCircle size={15} /> Help &amp; Support
            </span>
            <h1>Frequently Asked <span>Questions</span></h1>
            <p className="faqs-hero-desc">
              Find quick answers to common queries regarding appointments, hospital admission, insurance cashless processes, diagnostic services, and patient care.
            </p>

            {/* Instant Search Bar */}
            <div className="faqs-search-box">
              <Search className="faqs-search-icon" size={20} />
              <input
                type="text"
                placeholder="Search by keywords (e.g. appointment, insurance, visiting hours, emergency)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search FAQs"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="faqs-search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  &times;
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="faqs-main-section">
        <div className="container">
          {/* Category Tabs */}
          <div className="faqs-categories-tabbar">
            {FAQ_CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`faqs-cat-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <Icon size={16} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Results Count & Active Search Notice */}
          <div className="faqs-result-info">
            <span>Showing {filteredFaqs.length} question{filteredFaqs.length !== 1 ? 's' : ''}</span>
            {searchQuery && (
              <span className="search-highlight-tag">
                for "{searchQuery}"
              </span>
            )}
          </div>

          {/* FAQ Accordion List */}
          {filteredFaqs.length > 0 ? (
            <div className="faqs-accordion-list">
              {filteredFaqs.map(faq => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`faq-card-item ${isOpen ? 'open' : ''}`}
                  >
                    <button
                      type="button"
                      className="faq-question-btn"
                      onClick={() => toggleFaq(faq.id)}
                      aria-expanded={isOpen}
                    >
                      <div className="faq-question-text">
                        <span className="faq-category-pill">{faq.categoryLabel}</span>
                        <h3>{faq.question}</h3>
                      </div>
                      <div className={`faq-chevron-circle ${isOpen ? 'rotated' : ''}`}>
                        <ChevronDown size={20} />
                      </div>
                    </button>

                    <div className={`faq-answer-collapse ${isOpen ? 'expanded' : ''}`}>
                      <div className="faq-answer-inner">
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="faqs-empty-state">
              <HelpCircle size={48} className="empty-icon" />
              <h3>No matching questions found</h3>
              <p>We couldn't find any FAQs matching "{searchQuery}". Try a different keyword or contact our support desk.</p>
              <button
                type="button"
                className="btn-reset-search"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Reset Search Filters
              </button>
            </div>
          )}

          {/* Support Helpline Card */}
          <div className="faqs-support-banner">
            <div className="support-banner-content">
              <h3>Still have questions?</h3>
              <p>Our patient care coordination team is available round-the-clock to guide and support you.</p>
            </div>
            <div className="support-actions">
              <a href="tel:07969002222" className="btn-support-call">
                <Phone size={18} />
                <span>Call 079-69002222</span>
              </a>
              <Link to="/contact" className="btn-support-contact">
                <span>Contact Helpdesk</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FaqsPage;
