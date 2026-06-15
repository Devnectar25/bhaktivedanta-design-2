import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { initialAppointments, saveAppointments } from '../../../data/adminState';

const AddAppointment = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const navigate = useNavigate();

  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [doctorName, setDoctorName] = useState('Dr. Anand Sharma');
  const [department, setDepartment] = useState('Cardiology');
  const [dateTime, setDateTime] = useState('');
  const [payment, setPayment] = useState('Paid');
  const [status, setStatus] = useState('Confirmed');

  const [appointmentsList, setAppointmentsList] = useState([]);

  useEffect(() => {
    initialAppointments().then(list => {
      setAppointmentsList(list);

      if (editId) {
        const match = list.find(a => a.id === editId);
        if (match) {
          setPatientName(match.patientName || '');
          setPatientPhone(match.patientPhone || '');
          setDoctorName(match.doctorName || 'Dr. Anand Sharma');
          setDepartment(match.department || 'Cardiology');
          setDateTime(match.dateTime || '');
          setPayment(match.payment || 'Paid');
          setStatus(match.status || 'Confirmed');
        }
      }
    });
  }, [editId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!patientName || !patientPhone || !dateTime) {
      alert("Please fill in the required fields (Patient Name, Phone, Date & Time).");
      return;
    }

    let updatedList;
    if (editId) {
      updatedList = appointmentsList.map(apt => {
        if (apt.id === editId) {
          return {
            ...apt,
            patientName,
            patientPhone,
            doctorName,
            department,
            dateTime,
            payment,
            status
          };
        }
        return apt;
      });
    } else {
      const newApt = {
        id: `APT-${Date.now().toString().substring(8)}`,
        patientName,
        patientPhone,
        doctorName,
        department,
        dateTime,
        payment,
        status
      };
      updatedList = [newApt, ...appointmentsList];
    }

    saveAppointments(updatedList);
    navigate('/admin/appointments');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-slate-400 text-xs mb-2 font-medium font-sans">
        <span>Dashboard</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span>Appointments</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-slate-600 font-bold">{editId ? 'Edit Appointment' : 'Add Appointment'}</span>
      </nav>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{editId ? 'Edit Appointment Details' : 'Add Manual Appointment'}</h2>
        <p className="text-sm text-slate-500 font-medium">Record patient appointment details directly in the system.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 text-xs text-slate-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase">Patient Full Name *</label>
            <input 
              type="text" 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
              placeholder="Amit Sharma"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase">Patient Contact Phone *</label>
            <input 
              type="text" 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
              placeholder="+91 98765 43210"
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase">Assigned Doctor</label>
            <select 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium cursor-pointer"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
            >
              <option value="Dr. Anand Sharma">Dr. Anand Sharma</option>
              <option value="Dr. Sunita Mehta">Dr. Sunita Mehta</option>
              <option value="Dr. Rajesh Kulkarni">Dr. Rajesh Kulkarni</option>
              <option value="Dr. Priya Verma">Dr. Priya Verma</option>
            </select>
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
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase">Date &amp; Time *</label>
            <input 
              type="text" 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
              placeholder="e.g. 24 Oct, 2023 10:30 AM"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase">Payment Status</label>
            <select 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium cursor-pointer"
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
            >
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase">Appointment Status</label>
            <select 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium cursor-pointer"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button 
            type="button" 
            onClick={() => navigate('/admin/appointments')} 
            className="px-5 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 font-semibold"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="bg-[#fea619] hover:bg-amber-500 text-slate-900 px-6 py-2 rounded-lg font-bold transition-all shadow-sm"
          >
            {editId ? 'Save Appointment' : 'Book Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAppointment;
