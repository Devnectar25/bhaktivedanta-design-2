import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { initialTestimonials, saveTestimonials } from '../../../data/adminState';

const AddTestimonial = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const navigate = useNavigate();

  const [patientName, setPatientName] = useState('');
  const [disease, setDisease] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState('Approved');

  const [testimonialsList, setTestimonialsList] = useState([]);

  useEffect(() => {
    initialTestimonials().then(list => {
      setTestimonialsList(list);

      if (editId) {
        const match = list.find(t => t.id === editId);
        if (match) {
          setPatientName(match.patientName || '');
          setDisease(match.disease || '');
          setContent(match.content || '');
          setRating(match.rating || 5);
          setStatus(match.status || 'Approved');
        }
      }
    });
  }, [editId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!patientName || !disease || !content) {
      alert("Please fill in the required fields (Patient Name, Treatment, and Review Content).");
      return;
    }

    let updatedList;
    if (editId) {
      updatedList = testimonialsList.map(t => {
        if (t.id === editId) {
          return {
            ...t,
            patientName,
            disease,
            content,
            rating,
            status
          };
        }
        return t;
      });
    } else {
      const newTest = {
        id: `TST-${Date.now().toString().substring(8)}`,
        patientName,
        disease,
        content,
        rating,
        status
      };
      updatedList = [newTest, ...testimonialsList];
    }

    saveTestimonials(updatedList);
    navigate('/admin/testimonials');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-slate-400 text-xs mb-2 font-medium font-sans">
        <span>Dashboard</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span>Testimonials</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-slate-600 font-bold">{editId ? 'Edit Testimonial' : 'Add Testimonial'}</span>
      </nav>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{editId ? 'Edit Patient Feedback' : 'Add Patient Testimonial'}</h2>
        <p className="text-sm text-slate-500 font-medium font-sans">Publish verified patient reviews on the hospital portal.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 text-xs text-slate-700 font-sans">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase">Patient Name *</label>
            <input 
              type="text" 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
              placeholder="Harish Mehta"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase">Disease / Treatment *</label>
            <input 
              type="text" 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
              placeholder="e.g. Angioplasty Patient"
              value={disease}
              onChange={(e) => setDisease(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase">Rating Star Count (1-5)</label>
            <select 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium cursor-pointer"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
            >
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase">Status</label>
            <select 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium cursor-pointer"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-500 uppercase">Review Feedback Content *</label>
          <textarea 
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
            placeholder="Enter review text here..."
            rows="4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button 
            type="button" 
            onClick={() => navigate('/admin/testimonials')} 
            className="px-5 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 font-semibold"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="bg-[#fea619] hover:bg-amber-500 text-slate-900 px-6 py-2 rounded-lg font-bold transition-all shadow-sm"
          >
            {editId ? 'Save Testimonial' : 'Publish Testimonial'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTestimonial;
