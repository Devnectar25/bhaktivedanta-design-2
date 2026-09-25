import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  initialTestimonials, saveTestimonials, 
  initialReviews, saveReviews 
} from '../../../data/adminState';
import { 
  addTestimonial, updateTestimonial, 
  addReview, updateReview 
} from '../../../utils/api';
import { showErrorAlert, showSuccessAlert } from '../../../utils/swal';
import { Star, Quote } from 'lucide-react';

const avatarPresets = [
  { label: 'Executive Male', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  { label: 'Statesman', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  { label: 'Executive Female', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  { label: 'Doctor/Specialist', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&q=80' }
];

const MAX_REVIEW_CHARS = 180;
const MAX_TESTIMONIAL_CHARS = 220;

const AddTestimonial = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const typeParam = searchParams.get('type');
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Active form section: 'testimonial' (VIP Dignitary) | 'review' (Patient Review)
  const [entryType, setEntryType] = useState(typeParam === 'review' ? 'review' : 'testimonial');

  // VIP Testimonial Form State
  const [vipName, setVipName] = useState('');
  const [vipDesignation, setVipDesignation] = useState('');
  const [vipImage, setVipImage] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80');
  const [vipContent, setVipContent] = useState('');
  const [vipStatus, setVipStatus] = useState('Approved');

  // Patient Review Form State
  const [patientName, setPatientName] = useState('');
  const [disease, setDisease] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewStatus, setReviewStatus] = useState('Approved');

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showErrorAlert("File Too Large", "Image file size should be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 400;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        setVipImage(canvas.toDataURL('image/jpeg', 0.88));
      };
    };
    reader.readAsDataURL(file);
  };

  const [testimonialsList, setTestimonialsList] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([initialTestimonials(), initialReviews()]).then(([tList, rList]) => {
      setTestimonialsList(Array.isArray(tList) ? tList : []);
      setReviewsList(Array.isArray(rList) ? rList : []);

      if (editId) {
        // Detect whether editId belongs to VIP Testimonials or Patient Reviews
        const vipMatch = tList?.find(t => t.id === editId);
        const reviewMatch = rList?.find(r => r.id === editId);

        if (vipMatch || editId.startsWith('VIP-')) {
          setEntryType('testimonial');
          if (vipMatch) {
            setVipName(vipMatch.name || vipMatch.patientName || '');
            setVipDesignation(vipMatch.designation || '');
            setVipImage(vipMatch.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80');
            setVipContent(vipMatch.content || '');
            setVipStatus(vipMatch.status || 'Approved');
          }
        } else if (reviewMatch || typeParam === 'review' || editId.startsWith('TST-') || editId.startsWith('REV-')) {
          setEntryType('review');
          if (reviewMatch) {
            setPatientName(reviewMatch.patientName || '');
            setDisease(reviewMatch.disease || '');
            setRating(Number(reviewMatch.rating) || 5);
            setReviewContent(reviewMatch.content || '');
            setReviewStatus(reviewMatch.status || 'Approved');
          }
        }
      } else if (typeParam === 'review') {
        setEntryType('review');
      } else {
        setEntryType('testimonial');
      }
      setLoading(false);
    });
  }, [editId, typeParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (entryType === 'testimonial') {
      if (!vipName.trim() || !vipDesignation.trim() || !vipContent.trim()) {
        showErrorAlert("Required Fields Missing", "Please enter Dignitary Name, Designation/Organization, and Testimonial Quote.");
        return;
      }

      const payload = {
        name: vipName.trim().slice(0, 45),
        designation: vipDesignation.trim().slice(0, 55),
        image: vipImage.trim() || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        content: vipContent.trim().slice(0, MAX_TESTIMONIAL_CHARS),
        status: vipStatus
      };

      if (editId) {
        payload.id = editId;
        const updated = testimonialsList.map(t => t.id === editId ? { ...t, ...payload } : t);
        setTestimonialsList(updated);
        saveTestimonials(updated);
        await updateTestimonial(editId, payload);
        showSuccessAlert("Updated", "VIP Testimonial updated successfully.");
      } else {
        const newId = `VIP-${Date.now().toString().slice(-6)}`;
        payload.id = newId;
        const updated = [payload, ...testimonialsList];
        setTestimonialsList(updated);
        saveTestimonials(updated);
        await addTestimonial(payload);
        showSuccessAlert("Created", "VIP Testimonial published successfully.");
      }

      navigate('/admin/testimonials?tab=testimonials');
    } else {
      // Patient Review
      if (!patientName.trim() || !disease.trim() || !reviewContent.trim()) {
        showErrorAlert("Required Fields Missing", "Please enter Patient Name, Disease/Treatment, and Review Content.");
        return;
      }

      const payload = {
        patientName: patientName.trim().slice(0, 40),
        disease: disease.trim().slice(0, 35),
        rating: Number(rating) || 5,
        content: reviewContent.trim().slice(0, MAX_REVIEW_CHARS),
        status: reviewStatus
      };

      if (editId) {
        payload.id = editId;
        const updated = reviewsList.map(r => r.id === editId ? { ...r, ...payload } : r);
        setReviewsList(updated);
        saveReviews(updated);
        await updateReview(editId, payload);
        showSuccessAlert("Updated", "Patient Review updated successfully.");
      } else {
        const newId = `TST-${Date.now().toString().slice(-6)}`;
        payload.id = newId;
        const updated = [payload, ...reviewsList];
        setReviewsList(updated);
        saveReviews(updated);
        await addReview(payload);
        showSuccessAlert("Created", "Patient Review published successfully.");
      }

      navigate('/admin/testimonials?tab=reviews');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-slate-400 text-xs mb-2 font-medium font-sans">
        <Link to="/admin/dashboard" className="hover:text-slate-600 transition-colors">Dashboard</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link to="/admin/testimonials" className="hover:text-slate-600 transition-colors">Testimonials & Reviews</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-slate-600 font-bold">
          {editId 
            ? (entryType === 'testimonial' ? 'Edit Dignitary Testimonial' : 'Edit Patient Review')
            : (entryType === 'testimonial' ? 'Add Dignitary Testimonial' : 'Add Patient Review')
          }
        </span>
      </nav>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          {editId 
            ? (entryType === 'testimonial' ? 'Edit VIP Dignitary Testimonial' : 'Edit Patient Review')
            : (entryType === 'testimonial' ? 'Add VIP Dignitary Testimonial' : 'Add Patient Review')
          }
        </h2>
        <p className="text-sm text-slate-500 font-medium font-sans">
          {entryType === 'testimonial' 
            ? 'Publish prominent endorsements on the "Why Choose Us" hospital home section.' 
            : 'Publish verified patient stories on the "Stories of Hope & Healing" reviews section with uniform box sizing.'}
        </p>
      </div>

      {/* Section Type Selector (Disabled in edit mode to avoid ID conflict) */}
      {!editId && (
        <div className="bg-slate-100 p-1.5 rounded-xl flex gap-2 max-w-md border border-slate-200">
          <button
            type="button"
            onClick={() => setEntryType('testimonial')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              entryType === 'testimonial'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-base text-amber-500">hotel_class</span>
            <span>Dignitary Testimonial</span>
          </button>

          <button
            type="button"
            onClick={() => setEntryType('review')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              entryType === 'review'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-base text-blue-600">rate_review</span>
            <span>Patient Review</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white rounded-xl border border-slate-200/80 p-6 space-y-5 text-xs text-slate-700 font-sans shadow-sm">
          {entryType === 'testimonial' ? (
            /* ========================================================================= */
            /* DIGNITARY / VIP TESTIMONIAL FORM                                          */
            /* ========================================================================= */
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
                <span className="material-symbols-outlined text-amber-600 text-sm">info</span>
                <span>Why Choose Us Panel • Strictly fits uniform layout</span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-600 uppercase tracking-wider text-[11px]">Dignitary / VIP Name *</label>
                  <span className="text-[10px] text-slate-400">{vipName.length}/45</span>
                </div>
                <input 
                  type="text" 
                  maxLength={45}
                  className="w-full bg-white border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 px-3 py-2 rounded-lg outline-none font-medium text-slate-800" 
                  placeholder="e.g. Mr. Alfred B. Ford"
                  value={vipName}
                  onChange={(e) => setVipName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-600 uppercase tracking-wider text-[11px]">Designation & Organization *</label>
                  <span className="text-[10px] text-slate-400">{vipDesignation.length}/55</span>
                </div>
                <input 
                  type="text" 
                  maxLength={55}
                  className="w-full bg-white border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 px-3 py-2 rounded-lg outline-none font-medium text-slate-800" 
                  placeholder="e.g. Director - Ford Motor Foundation, Detroit USA"
                  value={vipDesignation}
                  onChange={(e) => setVipDesignation(e.target.value)}
                  required
                />
              </div>

              {/* Photo Avatar Picker with Upload, URL, and Presets */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-600 uppercase tracking-wider text-[11px]">Photo Avatar</label>
                  <span className="text-[10px] text-slate-400">Upload image or enter web URL</span>
                </div>

                <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50/70 space-y-3">
                  <div className="flex items-center gap-3.5">
                    {/* Clickable Avatar Preview with camera overlay */}
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="relative group cursor-pointer w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400 shadow-sm flex-shrink-0 bg-white"
                      title="Click to choose image file from device"
                    >
                      <img 
                        src={vipImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                        <span className="material-symbols-outlined text-lg">photo_camera</span>
                      </div>
                    </div>

                    {/* Image Picker Button */}
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <input 
                          ref={fileInputRef}
                          type="file" 
                          accept="image/*"
                          className="hidden" 
                          onChange={handleImageUpload}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-300 hover:border-amber-400 text-slate-800 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px] text-amber-600">upload_file</span>
                          <span>Choose Image File</span>
                        </button>

                        {vipImage && (
                          <button
                            type="button"
                            onClick={() => setVipImage('')}
                            className="text-[11px] text-slate-400 hover:text-red-500 font-semibold px-2 py-1 transition-colors"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">JPG, PNG, or WEBP (Max 5MB). Auto-scaled for performance.</p>
                    </div>
                  </div>

                  {/* Secondary Web URL input and quick presets */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-200/70">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-400 text-sm">link</span>
                      <input 
                        type="url" 
                        className="flex-1 bg-white border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 px-2.5 py-1.5 rounded-lg outline-none font-medium text-slate-800 text-[11px]" 
                        placeholder="Or enter image URL (https://...)"
                        value={vipImage}
                        onChange={(e) => setVipImage(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="text-[10px] text-slate-400 font-semibold mr-0.5">Quick Presets:</span>
                      {avatarPresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setVipImage(preset.url)}
                          className={`text-[9px] px-2 py-0.5 rounded-full border transition-all ${
                            vipImage === preset.url 
                              ? 'bg-amber-100 text-amber-800 border-amber-300 font-bold' 
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-600 uppercase tracking-wider text-[11px]">Endorsement / Testimonial Quote *</label>
                  <span className={`text-[10px] font-bold ${vipContent.length >= 200 ? 'text-amber-600' : 'text-slate-400'}`}>
                    {vipContent.length} / {MAX_TESTIMONIAL_CHARS} max
                  </span>
                </div>
                <textarea 
                  maxLength={MAX_TESTIMONIAL_CHARS}
                  className="w-full bg-white border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 px-3 py-2 rounded-lg outline-none font-medium text-slate-800 leading-relaxed" 
                  placeholder="Enter dignitary's endorsement message (concise, up to 220 chars)..."
                  rows="3"
                  value={vipContent}
                  onChange={(e) => setVipContent(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1 max-w-[200px]">
                <label className="font-bold text-slate-600 uppercase tracking-wider text-[11px]">Display Status</label>
                <select 
                  className="w-full bg-white border border-slate-200 focus:border-amber-500 px-3 py-2 rounded-lg outline-none font-medium cursor-pointer"
                  value={vipStatus}
                  onChange={(e) => setVipStatus(e.target.value)}
                >
                  <option value="Approved">Approved (Visible)</option>
                  <option value="Pending">Pending (Draft / Hidden)</option>
                </select>
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* PATIENT REVIEW FORM                                                       */
            /* ========================================================================= */
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg">
                <span className="material-symbols-outlined text-blue-600 text-sm">check_circle</span>
                <span>Stories of Hope & Healing • Character limits guarantee equal box sizes</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-slate-600 uppercase tracking-wider text-[11px]">Patient Name *</label>
                    <span className="text-[10px] text-slate-400">{patientName.length}/40</span>
                  </div>
                  <input 
                    type="text" 
                    maxLength={40}
                    className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2 rounded-lg outline-none font-medium text-slate-800" 
                    placeholder="e.g. Nalini Iyer"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-slate-600 uppercase tracking-wider text-[11px]">Disease / Treatment *</label>
                    <span className="text-[10px] text-slate-400">{disease.length}/35</span>
                  </div>
                  <input 
                    type="text" 
                    maxLength={35}
                    className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2 rounded-lg outline-none font-medium text-slate-800" 
                    placeholder="e.g. Maternity Care"
                    value={disease}
                    onChange={(e) => setDisease(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600 uppercase tracking-wider text-[11px]">Rating Stars (1 - 5)</label>
                  <select 
                    className="w-full bg-white border border-slate-200 focus:border-blue-500 px-3 py-2 rounded-lg outline-none font-medium cursor-pointer"
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                  >
                    <option value="5">★★★★★ (5 Stars - Excellent)</option>
                    <option value="4">★★★★☆ (4 Stars - Very Good)</option>
                    <option value="3">★★★☆☆ (3 Stars - Good)</option>
                    <option value="2">★★☆☆☆ (2 Stars - Fair)</option>
                    <option value="1">★☆☆☆☆ (1 Star - Poor)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600 uppercase tracking-wider text-[11px]">Display Status</label>
                  <select 
                    className="w-full bg-white border border-slate-200 focus:border-blue-500 px-3 py-2 rounded-lg outline-none font-medium cursor-pointer"
                    value={reviewStatus}
                    onChange={(e) => setReviewStatus(e.target.value)}
                  >
                    <option value="Approved">Approved (Visible)</option>
                    <option value="Pending">Pending (Draft / Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-600 uppercase tracking-wider text-[11px]">Patient Review Message *</label>
                  <span className={`text-[10px] font-bold ${reviewContent.length >= 160 ? 'text-amber-600' : 'text-slate-400'}`}>
                    {reviewContent.length} / {MAX_REVIEW_CHARS} max characters
                  </span>
                </div>
                <textarea 
                  maxLength={MAX_REVIEW_CHARS}
                  className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2 rounded-lg outline-none font-medium text-slate-800 leading-relaxed" 
                  placeholder="Enter patient review story (concise, up to 180 chars)..."
                  rows="3"
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  required
                />
                <p className="text-[10px] text-slate-400">
                  Keeping reviews under 180 characters ensures consistent 3-column card heights without overflow.
                </p>
              </div>
            </div>
          )}

          {/* Form Submit Actions */}
          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => navigate(`/admin/testimonials?tab=${entryType === 'review' ? 'reviews' : 'testimonials'}`)} 
              className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition-all text-xs"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`px-6 py-2.5 rounded-lg font-bold transition-all shadow-sm active:scale-95 text-xs ${
                entryType === 'testimonial'
                  ? 'bg-[#fea619] hover:bg-amber-500 text-slate-900'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {editId 
                ? (entryType === 'testimonial' ? 'Save VIP Testimonial' : 'Save Patient Review') 
                : (entryType === 'testimonial' ? 'Publish VIP Testimonial' : 'Publish Patient Review')
              }
            </button>
          </div>
        </form>

        {/* Live Box Size Preview */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">visibility</span>
            <span>Live Box Preview</span>
          </div>

          {entryType === 'review' ? (
            /* Patient Review Card Preview (matches Testimonials.jsx exactly) */
            <div 
              className="bg-white rounded-[20px] p-6 border border-slate-200 shadow-md flex flex-col justify-between"
              style={{ height: '350px', width: '100%', boxSizing: 'border-box' }}
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Quote size={28} className="text-blue-100" />
                  <div className="flex gap-1 text-amber-500">
                    {[...Array(rating || 5)].map((_, i) => (
                      <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                </div>

                <p 
                  className="text-slate-600 text-sm italic leading-relaxed"
                  style={{
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: 'vertical',
                    textOverflow: 'ellipsis',
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere'
                  }}
                >
                  "{reviewContent || 'Your patient review will preview here in real-time as you type...'}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100 mt-auto">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1e3a8a] to-blue-500 text-white font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                  {(patientName || 'P').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className="font-bold text-[#1e3a8a] text-sm truncate">
                    {patientName || 'Patient Name'}
                  </div>
                  <div className="text-[10px] text-amber-600 font-bold uppercase tracking-wider truncate">
                    {disease || 'Treatment / Care'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Dignitary Testimonial Card Preview (matches WhyChooseUs.jsx exactly) */
            <div 
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-md flex items-center gap-4"
              style={{ width: '100%', boxSizing: 'border-box' }}
            >
              <img 
                src={vipImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'} 
                alt="VIP Avatar" 
                className="w-16 h-16 rounded-full object-cover border border-slate-200 flex-shrink-0"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
                }}
              />
              <div className="min-w-0 flex-1 overflow-hidden">
                <p 
                  className="text-slate-600 text-xs leading-relaxed italic mb-1.5"
                  style={{
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    textOverflow: 'ellipsis',
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere'
                  }}
                >
                  "{vipContent || 'Dignitary endorsement quote preview...'}"
                </p>
                <div className="font-bold text-amber-700 text-xs truncate">
                  {vipName || 'Dignitary Full Name'}
                </div>
                <div className="text-[10px] text-amber-600 font-semibold truncate">
                  {vipDesignation || 'Designation & Organization'}
                </div>
              </div>
            </div>
          )}

          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 text-[11px] text-slate-500 space-y-1">
            <div className="font-bold text-slate-700 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-green-600">lock</span>
              <span>Fixed Dimensions Enforced</span>
            </div>
            <p>
              Cards automatically wrap and clamp text so no amount of typing or long characters will stretch or resize neighboring boxes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTestimonial;
