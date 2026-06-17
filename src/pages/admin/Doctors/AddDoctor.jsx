import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { initialDoctors, saveDoctors } from '../../../data/adminState';

const AddDoctor = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [department, setDepartment] = useState('');
  const [subSpeciality, setSubSpeciality] = useState('');
  const [experience, setExperience] = useState('');
  const [availability, setAvailability] = useState('Available');
  const [featured, setFeatured] = useState('No');
  const [status, setStatus] = useState('Active');
  const [image, setImage] = useState('');

  // Loaded doctors state list
  const [doctorsList, setDoctorsList] = useState([]);

  useEffect(() => {
    initialDoctors().then(list => {
      setDoctorsList(list);

      if (editId) {
        const match = list.find(d => d.id === editId);
        if (match) {
          setName(match.name || '');
          setQualifications(match.qualifications || '');
          setDepartment(match.department || '');
          setSubSpeciality(match.subSpeciality || '');
          setExperience(match.experience || '');
          setAvailability(match.availability || 'Available');
          setFeatured(match.featured || 'No');
          setStatus(match.status || 'Active');
          setImage(match.image || '');
        }
      }
    });
  }, [editId]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image file size should be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !qualifications || !experience) {
      alert("Please fill in the required fields (Name, Qualifications, Experience).");
      return;
    }

    let updatedList;
    if (editId) {
      // Edit mode
      updatedList = doctorsList.map(doc => {
        if (doc.id === editId) {
          return {
            ...doc,
            name,
            qualifications,
            department,
            subSpeciality,
            experience: experience.toLowerCase().includes('year') ? experience : `${experience} Years`,
            availability,
            featured,
            status,
            image: image || doc.image
          };
        }
        return doc;
      });
    } else {
      // Add mode
      const newDoc = {
        id: `d${Date.now()}`,
        name,
        qualifications,
        department,
        subSpeciality,
        experience: `${experience} Years`,
        availability,
        featured,
        status,
        image: image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuANPEj_KoNMPpIwdzuCD7lYGdAKEkyCWh6bTaQK8MJs_R4JVyJRsEBiMWrTQzDsV176cPtU3yccFuudW15cKMl437nzqw5tE9A3l9ZZfasQ9SJx96vYIX962IHbmK_xdfUiAohF8eavUhpXeVEW2mV78f5ATYHcgBnBWY8_UJEKzHq4bco6SZZlKcz-S4YZpKBmO1txtux3VF6wZXMQIop-vEphp1s5HxLkKU8I_EDCo-tkZYHkrT4Ut51mTZnyQ3xI9td7l-2oX0w'
      };
      updatedList = [newDoc, ...doctorsList];
    }

    saveDoctors(updatedList);
    navigate('/admin/doctors');
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-slate-400 text-xs mb-2 font-medium">
        <span>Dashboard</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span>Doctors</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-slate-600 font-bold">{editId ? 'Edit Doctor' : 'Add Doctor'}</span>
      </nav>

      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{editId ? 'Edit Doctor Profile' : 'Add New Doctor'}</h2>
          <p className="text-sm text-slate-500">Create or update doctor profiles for the hospital directory.</p>
        </div>
      </div>

      {/* Form Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs text-slate-700">
        
        {/* Left Columns */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4">
            <h3 className="font-bold text-sm text-[#1e3a8a] border-b border-slate-100 pb-2">Personal &amp; Professional Info</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-slate-500 uppercase">Full Name *</label>
                <input 
                  type="text" 
                  className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
                  placeholder="Dr. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase">Qualifications *</label>
                <input 
                  type="text" 
                  className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
                  placeholder="MBBS, MD (Cardiology)"
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase">Experience (Years) *</label>
                <input 
                  type="number" 
                  className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
                  placeholder="12"
                  value={experience.replace(/[^0-9]/g, '')}
                  onChange={(e) => setExperience(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase">Department *</label>
                <input 
                  type="text" 
                  className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
                  placeholder="e.g. Cardiology"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                />
              </div>

              <div className="sm:col-span-2 space-y-2">
                <label className="font-bold text-slate-500 uppercase">Profile Photo</label>
                <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                  {image ? (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 bg-white flex items-center justify-center group shadow-sm flex-shrink-0">
                      <img src={image} alt="Profile Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImage('')}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200 rounded-lg"
                        title="Remove Photo"
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-lg border border-dashed border-slate-300 bg-white flex items-center justify-center text-slate-400 shadow-inner flex-shrink-0">
                      <span className="material-symbols-outlined text-3xl">image</span>
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <label className="inline-block bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold cursor-pointer transition-all text-center text-xs shadow-sm hover:shadow active:scale-[0.98]">
                      <span>Upload Image</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        onChange={handleImageUpload}
                      />
                    </label>
                    <p className="text-[10px] text-slate-400">PNG, JPG or WEBP. Max 2MB.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <section className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4">
            <h3 className="font-bold text-sm text-[#1e3a8a] border-b border-slate-100 pb-2">Status &amp; Availability</h3>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase">Availability</label>
                <select 
                  className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium cursor-pointer"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                >
                  <option value="Available">Available</option>
                  <option value="Busy">Busy</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase">Profile Visibility Status</label>
                <select 
                  className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium cursor-pointer"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="font-bold text-slate-500 uppercase">Featured Doctor</span>
                <button 
                  type="button"
                  onClick={() => setFeatured(featured === 'Yes' ? 'No' : 'Yes')}
                  className={`px-4 py-1 rounded-lg font-bold border transition-all ${
                    featured === 'Yes' 
                      ? 'bg-amber-50 text-amber-600 border-amber-200' 
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  {featured}
                </button>
              </div>
            </div>
          </section>

          {/* Form Actions */}
          <div className="flex gap-2">
            <button 
              type="button" 
              onClick={() => navigate('/admin/doctors')} 
              className="flex-1 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-lg font-bold hover:bg-slate-50 transition-all text-center"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 bg-[#fea619] hover:bg-amber-500 text-slate-900 py-2.5 rounded-lg font-bold transition-all shadow-sm"
            >
              {editId ? 'Save Profile' : 'Publish Profile'}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default AddDoctor;
