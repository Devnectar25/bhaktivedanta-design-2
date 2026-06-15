import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { initialDoctors, saveDoctors } from '../../../data/adminState';

const AddDoctor = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [department, setDepartment] = useState('Cardiology');
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
          setDepartment(match.department || 'Cardiology');
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
                <label className="font-bold text-slate-500 uppercase">Department</label>
                <select 
                  className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium cursor-pointer"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Oncology">Oncology</option>
                  <option value="Neurology">Neurology</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase">Sub-Speciality / Focus</label>
                <input 
                  type="text" 
                  className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
                  placeholder="e.g. Spine Surgery"
                  value={subSpeciality}
                  onChange={(e) => setSubSpeciality(e.target.value)}
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-slate-500 uppercase">Profile Photo URL</label>
                <input 
                  type="text" 
                  className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
                  placeholder="https://example.com/image.png"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
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
