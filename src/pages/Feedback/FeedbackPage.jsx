import React, { useState, useEffect } from 'react';
import { addFeedback } from '../../utils/api';
import { showSuccessAlert, showErrorAlert } from '../../utils/swal';

// Translation Dictionary
const translations = {
  mr: {
    hospitalName: 'भक्तीवेदांत रुग्णालय व संशोधन संस्था',
    formBadge: 'रुग्ण अभिप्राय फॉर्म',
    langSelectTitle: 'कृपया भाषा निवडा',
    langSelectSubtitle: 'अभिप्राय फॉर्म भरण्यासाठी तुमची प्राधान्य भाषा निवडा',
    continueBtn: 'पुढे जा',
    changeLang: 'भाषा बदला',
    steps: [
      { number: 1, title: 'वैयक्तिक माहिती', subtitle: 'माहिती' },
      { number: 2, title: 'सेवा मूल्यमापन', subtitle: 'मूल्यमापन' },
      { number: 3, title: 'शिफारस', subtitle: 'सूचना व शिफारस' },
      { number: 4, title: 'पूर्ण झाले', subtitle: 'सबमिशन पूर्ण' }
    ],
    step1: {
      greeting: 'प्रिय संरक्षक,',
      desc: 'भक्तीवेदांत रुग्णालय व संशोधन संस्थेला भेट दिल्याबद्दल धन्यवाद. कृपया आपले तपशील प्रविष्ट करा आणि पुढे जाण्यासाठी "पुढील" दाबा.',
      nameLabel: 'नाव (संपूर्ण नाव)',
      namePlaceholder: 'आपले संपूर्ण नाव प्रविष्ट करा',
      phoneLabel: 'फोन नंबर *',
      phonePlaceholder: 'मोबाईल नंबर (उदा. 98200XXXXX)',
      bhidLabel: 'बीएचआयडी (रुग्णालय आयडी)',
      bhidPlaceholder: 'उदा. BH-1049 (ऐच्छिक)',
      doctorLabel: 'डॉक्टरांचे नाव *',
      doctorPlaceholder: 'उपचार करणाऱ्या डॉक्टरांचे नाव'
    },
    step2: {
      title: 'रुग्णालय सेवांचे मूल्यमापन करा',
      subtitle: 'कृपया खालील सेवांबद्दल आपला अनुभव निवडा.',
      services: {
        doctorCare: 'वैद्यकीय सेवा व डॉक्टर',
        nursing: 'परिचारिका सेवा (नर्सिंग)',
        cleanliness: 'स्वच्छता व परिसर',
        food: 'अन्न व आहार सेवा',
        overall: 'एकंदरीत रुग्णालय अनुभव'
      },
      ratings: {
        Excellent: 'उत्तम',
        Good: 'चांगले',
        Average: 'साधारण',
        Poor: 'वाईट'
      }
    },
    step3: {
      title: 'शिफारस व अभिप्राय',
      subtitle: 'तुमची मते आम्हाला अधिक चांगली सेवा देण्यास मदत करतात.',
      recommendQuestion: 'तुमच्या मित्र आणि नातेवाईकांना भक्तीवेदांत रुग्णालयाची शिफारस कराल का?',
      recommendOptions: {
        Yes: 'होय',
        Maybe: 'कदाचित',
        No: 'नाही'
      },
      commentsLabel: 'काही अतिरिक्त सूचना किंवा अभिप्राय',
      commentsPlaceholder: 'येथे आपला सविस्तर अभिप्राय किंवा सूचना लिहा...'
    },
    step4: {
      thankYou: 'धन्यवाद!',
      successMsg: 'तुमचा बहुमूल्य अभिप्राय यशस्वीरीत्या सबमिट झाला आहे.',
      refIdLabel: 'अभिप्राय संदर्भ क्रमांक',
      resetBtn: 'नवीन अभिप्राय प्रविष्ट करा'
    },
    buttons: {
      back: 'मागे',
      next: 'पुढील',
      submit: 'सबमिट करा',
      submitting: 'सबमिट होत आहे...'
    },
    validation: {
      reqTitle: 'आवश्यक क्षेत्र',
      nameErr: 'कृपया आपले संपूर्ण नाव प्रविष्ट करा.',
      phoneReq: 'कृपया आपला मोबाईल नंबर प्रविष्ट करा.',
      phoneInvalid: 'कृपया १० अंकी वैध मोबाईल नंबर प्रविष्ट करा (उदा. 98200XXXXX).',
      doctorErr: 'कृपया डॉक्टरांचे नाव प्रविष्ट करा.'
    }
  },
  en: {
    hospitalName: 'Bhaktivedanta Hospital & Research Institute',
    formBadge: 'Patient Feedback Form',
    langSelectTitle: 'Select Your Preferred Language',
    langSelectSubtitle: 'Choose your language to proceed with the feedback form',
    continueBtn: 'Continue',
    changeLang: 'Change Language',
    steps: [
      { number: 1, title: 'Personal Details', subtitle: 'Step 1' },
      { number: 2, title: 'Service Ratings', subtitle: 'Step 2' },
      { number: 3, title: 'Recommendation', subtitle: 'Step 3' },
      { number: 4, title: 'Completed', subtitle: 'Step 4' }
    ],
    step1: {
      greeting: 'Dear Patron,',
      desc: 'Thank you for visiting Bhaktivedanta Hospital & Research Institute. Please enter your details below and click "Next" to continue.',
      nameLabel: 'Full Name *',
      namePlaceholder: 'Enter your full name',
      phoneLabel: 'Phone Number *',
      phonePlaceholder: '10-digit Mobile Number (e.g. 98200XXXXX)',
      bhidLabel: 'BHID (Hospital ID)',
      bhidPlaceholder: 'e.g. BH-1049 (Optional)',
      doctorLabel: "Doctor's Name *",
      doctorPlaceholder: 'Name of treating doctor'
    },
    step2: {
      title: 'Evaluate Hospital Services',
      subtitle: 'Please rate your experience with the following services.',
      services: {
        doctorCare: 'Doctor & Clinical Care',
        nursing: 'Nursing & Ward Care',
        cleanliness: 'Cleanliness & Hygiene',
        food: 'Food & Dietary Services',
        overall: 'Overall Hospital Experience'
      },
      ratings: {
        Excellent: 'Excellent',
        Good: 'Good',
        Average: 'Average',
        Poor: 'Poor'
      }
    },
    step3: {
      title: 'Recommendation & Remarks',
      subtitle: 'Your suggestions help us continuously improve our service quality.',
      recommendQuestion: 'Would you recommend Bhaktivedanta Hospital to your friends and relatives?',
      recommendOptions: {
        Yes: 'Yes',
        Maybe: 'Maybe',
        No: 'No'
      },
      commentsLabel: 'Additional Suggestions or Remarks',
      commentsPlaceholder: 'Write your detailed feedback or suggestions here...'
    },
    step4: {
      thankYou: 'Thank You!',
      successMsg: 'Your valuable feedback has been successfully submitted.',
      refIdLabel: 'Feedback Reference ID',
      resetBtn: 'Submit Another Feedback'
    },
    buttons: {
      back: 'Back',
      next: 'Next',
      submit: 'Submit Feedback',
      submitting: 'Submitting...'
    },
    validation: {
      reqTitle: 'Required Field',
      nameErr: 'Please enter your full name.',
      phoneReq: 'Please enter your mobile number.',
      phoneInvalid: 'Please enter a valid 10-digit mobile number (e.g. 98200XXXXX).',
      doctorErr: "Please enter the doctor's name."
    }
  },
  hi: {
    hospitalName: 'भक्तिवेदांत अस्पताल और अनुसंधान संस्थान',
    formBadge: 'मरीज फीडबैक फॉर्म',
    langSelectTitle: 'कृपया भाषा चुनें',
    langSelectSubtitle: 'फीडबैक फॉर्म भरने के लिए अपनी पसंदीदा भाषा चुनें',
    continueBtn: 'आगे बढ़ें',
    changeLang: 'भाषा बदलें',
    steps: [
      { number: 1, title: 'व्यक्तिगत जानकारी', subtitle: 'विवरण' },
      { number: 2, title: 'सेवा मूल्यांकन', subtitle: 'मूल्यांकन' },
      { number: 3, title: 'सिफारिश', subtitle: 'सुझाव और सिफारिश' },
      { number: 4, title: 'पूर्ण हुआ', subtitle: 'सबमिशन पूर्ण' }
    ],
    step1: {
      greeting: 'प्रिय संरक्षक,',
      desc: 'भक्तिवेदांत अस्पताल और अनुसंधान संस्थान में आने के लिए धन्यवाद। कृपया अपना विवरण दर्ज करें और आगे बढ़ने के लिए "आगे" पर क्लिक करें।',
      nameLabel: 'नाम (पूरा नाम) *',
      namePlaceholder: 'अपना पूरा नाम दर्ज करें',
      phoneLabel: 'फोन नंबर *',
      phonePlaceholder: '10-अंकीय मोबाइल नंबर (जैसे 98200XXXXX)',
      bhidLabel: 'बीएचआईडी (अस्पताल आईडी)',
      bhidPlaceholder: 'जैसे BH-1049 (वैकल्पिक)',
      doctorLabel: 'डॉक्टर का नाम *',
      doctorPlaceholder: 'इलाज करने वाले डॉक्टर का नाम'
    },
    step2: {
      title: 'अस्पताल की सेवाओं का मूल्यांकन करें',
      subtitle: 'कृपया निम्नलिखित सेवाओं के बारे में अपना अनुभव चुनें।',
      services: {
        doctorCare: 'डॉक्टर और चिकित्सा सेवा',
        nursing: 'नर्सिंग और वार्ड सेवा',
        cleanliness: 'स्वच्छता और परिवेश',
        food: 'भोजन और आहार सेवा',
        overall: 'समग्र अस्पताल अनुभव'
      },
      ratings: {
        Excellent: 'उत्कृष्ट',
        Good: 'अच्छा',
        Average: 'औसत',
        Poor: 'खराब'
      }
    },
    step3: {
      title: 'सिफारिश और टिप्पणी',
      subtitle: 'आपके सुझाव हमें बेहतर सेवा प्रदान करने में मदद करते हैं।',
      recommendQuestion: 'क्या आप अपने दोस्तों और रिश्तेदारों को भक्तिवेदांत अस्पताल की सिफारिश करेंगे?',
      recommendOptions: {
        Yes: 'हाँ',
        Maybe: 'शायद',
        No: 'नहीं'
      },
      commentsLabel: 'अतिरिक्त सुझाव या प्रतिक्रिया',
      commentsPlaceholder: 'अपनी विस्तृत प्रतिक्रिया या सुझाव यहाँ लिखें...'
    },
    step4: {
      thankYou: 'धन्यवाद!',
      successMsg: 'आपकी बहुमूल्य प्रतिक्रिया सफलतापूर्वक जमा कर दी गई है।',
      refIdLabel: 'फीडबैक संदर्भ संख्या',
      resetBtn: 'दूसरा फीडबैक जमा करें'
    },
    buttons: {
      back: 'पीछे',
      next: 'आगे',
      submit: 'सबमिट करें',
      submitting: 'सबमिट हो रहा है...'
    },
    validation: {
      reqTitle: 'आवश्यक क्षेत्र',
      nameErr: 'कृपया अपना पूरा नाम दर्ज करें।',
      phoneReq: 'कृपया अपना मोबाइल नंबर दर्ज करें।',
      phoneInvalid: 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें (जैसे 98200XXXXX)।',
      doctorErr: 'कृपया डॉक्टर का नाम दर्ज करें।'
    }
  }
};

const FeedbackPage = () => {
  const [lang, setLang] = useState('en'); // Default English
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState('');

  const t = translations[lang] || translations.en;

  useEffect(() => {
    let twScript = document.getElementById('tailwind-cdn-script');
    if (!twScript) {
      twScript = document.createElement('script');
      twScript.id = 'tailwind-cdn-script';
      twScript.src = 'https://cdn.tailwindcss.com?plugins=forms,container-queries,typography';
      document.head.appendChild(twScript);
    }
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bhid: '',
    doctorName: '',
    ratings: {
      doctorCare: 'Excellent',
      nursing: 'Excellent',
      cleanliness: 'Excellent',
      food: 'Good',
      overall: 'Excellent'
    },
    recommendation: 'Yes',
    comments: ''
  });

  const ratingOptionsConfig = [
    { value: 'Excellent', icon: 'sentiment_very_satisfied', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { value: 'Good', icon: 'sentiment_satisfied', color: 'text-[#0b5ed7] bg-blue-50 border-blue-200' },
    { value: 'Average', icon: 'sentiment_neutral', color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { value: 'Poor', icon: 'sentiment_dissatisfied', color: 'text-rose-600 bg-rose-50 border-rose-200' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRatingChange = (category, value) => {
    setFormData(prev => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [category]: value
      }
    }));
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.name.trim()) {
      showErrorAlert(t.validation.reqTitle, t.validation.nameErr);
      return false;
    }

    const rawPhone = (formData.phone || '').trim();
    if (!rawPhone) {
      showErrorAlert(t.validation.reqTitle, t.validation.phoneReq);
      return false;
    }

    const cleanPhone = rawPhone.replace(/\D/g, '');
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      showErrorAlert(t.validation.reqTitle, t.validation.phoneInvalid);
      return false;
    }

    if (!formData.doctorName || !formData.doctorName.trim()) {
      showErrorAlert(t.validation.reqTitle, t.validation.doctorErr);
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) {
      return;
    }
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSubmitting(true);

    try {
      const generatedId = `FBK-${Math.floor(1000 + Math.random() * 9000)}`;
      const payload = {
        id: generatedId,
        name: formData.name || 'Anonymous',
        phone: formData.phone,
        bhid: formData.bhid,
        doctorName: formData.doctorName,
        serviceRatings: formData.ratings,
        recommendation: formData.recommendation,
        comments: formData.comments,
        language: lang,
        status: 'New',
        timestamp: new Date().toLocaleString()
      };

      await addFeedback(payload);
      setSubmissionId(generatedId);
      setCurrentStep(4);
      showSuccessAlert(t.step4.thankYou, t.step4.successMsg);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      showErrorAlert('Error', 'Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      phone: '',
      bhid: '',
      doctorName: '',
      ratings: {
        doctorCare: 'Excellent',
        nursing: 'Excellent',
        cleanliness: 'Excellent',
        food: 'Good',
        overall: 'Excellent'
      },
      recommendation: 'Yes',
      comments: ''
    });
    setCurrentStep(1);
    setSubmissionId('');
  };

  return (
    <div className="min-h-screen bg-[#fffdf5] font-sans text-slate-800 flex flex-col justify-between relative overflow-hidden"
         style={{
           backgroundImage: `radial-gradient(#f7e8bc 1.5px, transparent 1.5px), radial-gradient(#f7e8bc 1.5px, #fffdf5 1.5px)`,
           backgroundSize: `60px 60px`,
           backgroundPosition: `0 0, 30px 30px`
         }}>

      {/* Main Page Container */}
      <div className="max-w-4xl w-full mx-auto px-4 py-6 md:py-10 flex-1 flex flex-col justify-center relative z-0">

        {/* Page Title Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white/95 backdrop-blur-md rounded-2xl p-4 md:px-6 shadow-sm border border-amber-100 mb-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0b5ed7] flex items-center justify-center font-bold shadow-inner">
              <span className="material-symbols-outlined text-xl">rate_review</span>
            </div>
            <div>
              <h1 className="text-sm md:text-base font-bold text-slate-800">{t.hospitalName}</h1>
              <span className="text-xs text-[#0b5ed7] font-semibold">{t.formBadge}</span>
            </div>
          </div>
        </div>

        {/* Small Inline Language Selection Alert Banner */}
        <div className="bg-blue-50/90 border border-blue-200/80 rounded-2xl p-3 md:px-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-slate-800">
            <span className="material-symbols-outlined text-[#0b5ed7] text-xl">translate</span>
            <span className="text-xs md:text-sm font-bold">
              {t.langSelectTitle} / Select Language:
            </span>
          </div>

          <div className="flex items-center bg-white p-1 rounded-xl border border-blue-200/80 text-xs font-bold shadow-xs">
            {[
              { id: 'mr', label: 'मराठी' },
              { id: 'en', label: 'English' },
              { id: 'hi', label: 'हिन्दी' }
            ].map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLang(l.id)}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  lang === l.id
                    ? 'bg-[#0b5ed7] text-white shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Step Progress Header */}
        <div className="mb-10 relative">
          <div className="flex items-center justify-between relative z-10">
            {t.steps.map((step) => {
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <div key={step.number} className="flex flex-col items-center group cursor-pointer" onClick={() => isCompleted && setCurrentStep(step.number)}>
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center font-bold text-lg md:text-2xl transition-all duration-300 shadow-sm border-2 ${
                    isActive
                      ? 'bg-[#0b5ed7] text-white border-[#0b5ed7] ring-4 ring-blue-100 scale-110'
                      : isCompleted
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-600 border-slate-300'
                  }`}>
                    {isCompleted ? <span className="material-symbols-outlined text-2xl">check</span> : step.number}
                  </div>
                  <span className={`mt-3 text-xs md:text-sm font-bold text-center transition-colors ${
                    isActive ? 'text-[#0b5ed7]' : isCompleted ? 'text-emerald-700' : 'text-slate-500'
                  }`}>
                    {step.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium hidden md:block">
                    {step.subtitle}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Connecting Progress Line */}
          <div className="absolute top-6 md:top-7 left-6 right-6 md:left-8 md:right-8 h-1 bg-slate-200 -z-0 rounded-full">
            <div 
              className="h-full bg-[#0b5ed7] transition-all duration-500 rounded-full"
              style={{ width: `${((currentStep - 1) / (t.steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Card Form Container */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-amber-100/60 p-6 md:p-10 space-y-6">

          {/* STEP 1: Personal Details */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-amber-100 pb-4">
                <p className="text-sm font-bold text-[#1e3a8a] mb-1">{t.step1.greeting}</p>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                  {t.step1.desc}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">{t.step1.nameLabel}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder={t.step1.namePlaceholder}
                    required
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#0b5ed7] focus:bg-white px-4 py-2.5 rounded-lg text-sm outline-none transition-all shadow-inner"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">{t.step1.phoneLabel}</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                      handleInputChange('phone', digits);
                    }}
                    maxLength={10}
                    placeholder={t.step1.phonePlaceholder}
                    required
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#0b5ed7] focus:bg-white px-4 py-2.5 rounded-lg text-sm outline-none transition-all shadow-inner font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">{t.step1.bhidLabel}</label>
                  <input
                    type="text"
                    value={formData.bhid}
                    onChange={(e) => handleInputChange('bhid', e.target.value)}
                    placeholder={t.step1.bhidPlaceholder}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#0b5ed7] focus:bg-white px-4 py-2.5 rounded-lg text-sm outline-none transition-all shadow-inner uppercase font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">{t.step1.doctorLabel}</label>
                  <input
                    type="text"
                    value={formData.doctorName}
                    onChange={(e) => handleInputChange('doctorName', e.target.value)}
                    placeholder={t.step1.doctorPlaceholder}
                    required
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#0b5ed7] focus:bg-white px-4 py-2.5 rounded-lg text-sm outline-none transition-all shadow-inner"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Service Ratings */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-amber-100 pb-3">
                <h3 className="text-base font-bold text-slate-800">{t.step2.title}</h3>
                <p className="text-xs text-slate-500">{t.step2.subtitle}</p>
              </div>

              <div className="space-y-5">
                {[
                  { key: 'doctorCare', label: t.step2.services.doctorCare },
                  { key: 'nursing', label: t.step2.services.nursing },
                  { key: 'cleanliness', label: t.step2.services.cleanliness },
                  { key: 'food', label: t.step2.services.food },
                  { key: 'overall', label: t.step2.services.overall }
                ].map((item) => (
                  <div key={item.key} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
                    <label className="block text-xs font-bold text-slate-800">{item.label}</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {ratingOptionsConfig.map((opt) => {
                        const isSelected = formData.ratings[item.key] === opt.value;
                        const translatedOptionLabel = t.step2.ratings[opt.value];
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleRatingChange(item.key, opt.value)}
                            className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-bold transition-all ${
                              isSelected
                                ? `${opt.color} shadow-sm ring-2 ring-blue-400 scale-[1.02]`
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <span className="material-symbols-outlined text-lg">{opt.icon}</span>
                            <span>{translatedOptionLabel}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Recommendation & Remarks */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-amber-100 pb-3">
                <h3 className="text-base font-bold text-slate-800">{t.step3.title}</h3>
                <p className="text-xs text-slate-500">{t.step3.subtitle}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    {t.step3.recommendQuestion}
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { label: t.step3.recommendOptions.Yes, value: 'Yes', color: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
                      { label: t.step3.recommendOptions.Maybe, value: 'Maybe', color: 'bg-amber-50 text-amber-700 border-amber-300' },
                      { label: t.step3.recommendOptions.No, value: 'No', color: 'bg-rose-50 text-rose-700 border-rose-300' }
                    ].map((opt) => (
                      <label key={opt.value} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer font-bold text-xs transition-all ${
                        formData.recommendation === opt.value ? `${opt.color} ring-2 ring-[#0b5ed7]` : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}>
                        <input
                          type="radio"
                          name="recommendation"
                          value={opt.value}
                          checked={formData.recommendation === opt.value}
                          onChange={(e) => handleInputChange('recommendation', e.target.value)}
                          className="accent-[#0b5ed7]"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="block text-xs font-bold text-slate-800">
                    {t.step3.commentsLabel}
                  </label>
                  <textarea
                    rows="4"
                    value={formData.comments}
                    onChange={(e) => handleInputChange('comments', e.target.value)}
                    placeholder={t.step3.commentsPlaceholder}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#0b5ed7] focus:bg-white p-3 rounded-lg text-xs outline-none transition-all leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Submission Complete */}
          {currentStep === 4 && (
            <div className="py-8 text-center space-y-5 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner border border-emerald-200 animate-bounce">
                <span className="material-symbols-outlined text-4xl">task_alt</span>
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-800">{t.step4.thankYou}</h2>
                <p className="text-sm font-semibold text-emerald-700 mt-1">
                  {t.step4.successMsg}
                </p>
              </div>

              {submissionId && (
                <div className="inline-block bg-slate-50 border border-slate-200 px-6 py-3 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t.step4.refIdLabel}</span>
                  <span className="text-lg font-mono font-bold text-[#0b5ed7]">{submissionId}</span>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="bg-[#0b5ed7] hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-2 mx-auto"
                >
                  <span className="material-symbols-outlined text-base">refresh</span>
                  <span>{t.step4.resetBtn}</span>
                </button>
              </div>
            </div>
          )}

          {/* Bottom Action Controls */}
          {currentStep < 4 && (
            <div className="flex justify-between items-center pt-6 border-t border-slate-100">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  <span>{t.buttons.back}</span>
                </button>
              ) : <div></div>}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-[#0b5ed7] hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <span>{t.buttons.next}</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-2.5 rounded-lg text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{t.buttons.submitting}</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">send</span>
                      <span>{t.buttons.submit}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;

