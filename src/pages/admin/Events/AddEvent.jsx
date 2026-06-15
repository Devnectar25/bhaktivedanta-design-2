import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { initialEvents, saveEvents } from '../../../data/adminState';

const AddEvent = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Upcoming');

  const [eventsList, setEventsList] = useState([]);

  useEffect(() => {
    initialEvents().then(list => {
      setEventsList(list);

      if (editId) {
        const match = list.find(e => e.id === editId);
        if (match) {
          setTitle(match.title || '');
          setDate(match.date || '');
          setTime(match.time || '');
          setVenue(match.venue || '');
          setDescription(match.description || '');
          setStatus(match.status || 'Upcoming');
        }
      }
    });
  }, [editId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !date || !venue) {
      alert("Please fill in the required fields (Title, Date, Venue).");
      return;
    }

    let updatedList;
    if (editId) {
      updatedList = eventsList.map(evt => {
        if (evt.id === editId) {
          return {
            ...evt,
            title,
            date,
            time: time || '09:00 AM - 05:00 PM',
            venue,
            description,
            status
          };
        }
        return evt;
      });
    } else {
      const newEvt = {
        id: `EVT-${Date.now().toString().substring(8)}`,
        title,
        date,
        time: time || '09:00 AM - 05:00 PM',
        venue,
        description,
        status
      };
      updatedList = [newEvt, ...eventsList];
    }

    saveEvents(updatedList);
    navigate('/admin/events');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-slate-400 text-xs mb-2 font-medium font-sans">
        <span>Dashboard</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span>Events</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-slate-600 font-bold">{editId ? 'Edit Event' : 'Add Event'}</span>
      </nav>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{editId ? 'Edit Hospital Event' : 'Setup New Event'}</h2>
        <p className="text-sm text-slate-500">Configure public wellness checkup camps, seminars, or community health drives.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 text-xs text-slate-700">
        <div className="space-y-1">
          <label className="font-bold text-slate-500 uppercase">Event Title *</label>
          <input 
            type="text" 
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
            placeholder="Free Heart Health Camp"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase">Event Date *</label>
            <input 
              type="text" 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
              placeholder="e.g. 28 Oct, 2023"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase">Event Timings</label>
            <input 
              type="text" 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
              placeholder="e.g. 09:00 AM - 04:00 PM"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase">Venue / Location *</label>
            <input 
              type="text" 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
              placeholder="OPD Block, Ground Floor"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase">Event Status</label>
            <select 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium cursor-pointer"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-500 uppercase">Event Description</label>
          <textarea 
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
            placeholder="Detail the services, targets, or consultants participating..."
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button 
            type="button" 
            onClick={() => navigate('/admin/events')} 
            className="px-5 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 font-semibold"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="bg-[#fea619] hover:bg-amber-500 text-slate-900 px-6 py-2 rounded-lg font-bold transition-all shadow-sm"
          >
            {editId ? 'Save Event' : 'Publish Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEvent;
