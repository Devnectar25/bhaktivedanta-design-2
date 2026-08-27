import React, { useState, useEffect } from 'react';
import { getHelpDesk, addHelpDeskTicket, updateHelpDeskTicket, deleteHelpDeskTicket } from '../../../utils/api';

const defaultTickets = [
  {
    id: 'HD-801',
    ticketNo: 'TCK-1001',
    requesterName: 'Ramesh Gupta',
    requesterEmail: 'ramesh.gupta@gmail.com',
    category: 'Appointment Issue',
    priority: 'High',
    status: 'In Progress',
    subject: 'Unable to reschedule appointment for Cardiology',
    description: 'I tried to modify my booking for Thursday 3 PM but the portal threw a payment verification timeout.',
    created: '2026-08-25 14:30',
    response: 'Assigned to Support Specialist. Contacted patient for booking reference.'
  },
  {
    id: 'HD-802',
    ticketNo: 'TCK-1002',
    requesterName: 'Pooja Verma',
    requesterEmail: 'pooja.verma@yahoo.com',
    category: 'Portal Access',
    priority: 'Medium',
    status: 'Pending',
    subject: 'OTP not received during login',
    description: 'SMS verification codes are arriving with a 15-minute delay on Airtel numbers.',
    created: '2026-08-26 09:15',
    response: ''
  },
  {
    id: 'HD-803',
    ticketNo: 'TCK-1003',
    requesterName: 'Dr. S. K. Joshi',
    requesterEmail: 'dr.joshi@bhaktivedanta.com',
    category: 'IT Infrastructure',
    priority: 'Urgent',
    status: 'Resolved',
    subject: 'OPD Printer offline in Room 204',
    description: 'Thermal receipt printer disconnected from LAN network.',
    created: '2026-08-24 11:00',
    response: 'Network cable replaced and printer driver reinstalled. Verified working.'
  }
];

const HelpDesk = () => {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [newStatus, setNewStatus] = useState('In Progress');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    requesterName: '',
    requesterEmail: '',
    category: 'Appointment Issue',
    priority: 'Medium',
    subject: '',
    description: ''
  });

  useEffect(() => {
    getHelpDesk(defaultTickets).then(data => setTickets(data || defaultTickets));
  }, []);

  const handleUpdateTicket = (e) => {
    e.preventDefault();
    if (!selectedTicket) return;

    const updated = {
      ...selectedTicket,
      status: newStatus,
      response: responseText
    };

    updateHelpDeskTicket(selectedTicket.id, updated, tickets).then(res => {
      setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, ...updated } : t));
      setSelectedTicket(null);
      alert('Ticket status updated successfully!');
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this help desk ticket?")) {
      deleteHelpDeskTicket(id, tickets).then(() => {
        setTickets(prev => prev.filter(t => t.id !== id));
      });
    }
  };

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!newTicket.requesterName || !newTicket.subject) {
      alert("Please fill in required fields (Name and Subject).");
      return;
    }

    const ticketObj = {
      id: `HD-${Date.now()}`,
      ticketNo: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      requesterName: newTicket.requesterName,
      requesterEmail: newTicket.requesterEmail || 'support@bhaktivedanta.com',
      category: newTicket.category,
      priority: newTicket.priority,
      status: 'Pending',
      subject: newTicket.subject,
      description: newTicket.description,
      created: new Date().toLocaleString(),
      response: ''
    };

    addHelpDeskTicket(ticketObj, tickets).then(res => {
      setTickets(prev => [ticketObj, ...prev]);
      setShowAddModal(false);
      setNewTicket({
        requesterName: '',
        requesterEmail: '',
        category: 'Appointment Issue',
        priority: 'Medium',
        subject: '',
        description: ''
      });
      alert('New Help Desk ticket logged successfully!');
    });
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.ticketNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalCount = tickets.length;
  const pendingCount = tickets.filter(t => t.status === 'Pending').length;
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'Resolved').length;

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <nav className="flex items-center gap-2 text-slate-400 text-xs mb-1 font-medium">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-600 font-bold">Help Desk &amp; IT Support</span>
          </nav>
          <h2 className="text-2xl font-bold text-slate-800">Help Desk Management</h2>
          <p className="text-sm text-slate-500">Track and resolve user support inquiries, technical tickets, and hospital system requests</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-[#1e3a8a] hover:bg-blue-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">add_task</span>
          <span>Log New Support Ticket</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm border-l-4 border-l-blue-600">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Tickets</span>
          <p className="text-2xl font-bold text-slate-800 mt-2">{totalCount}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm border-l-4 border-l-amber-500">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Pending Action</span>
          <p className="text-2xl font-bold text-slate-800 mt-2">{pendingCount}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm border-l-4 border-l-indigo-500">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">In Progress</span>
          <p className="text-2xl font-bold text-slate-800 mt-2">{inProgressCount}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm border-l-4 border-l-green-500">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Resolved</span>
          <p className="text-2xl font-bold text-slate-800 mt-2">{resolvedCount}</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[220px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Search Tickets</label>
          <input 
            type="text" 
            placeholder="Search by ticket no, subject, requester..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none"
          />
        </div>
        <div className="w-[150px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Status</label>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white border border-slate-200 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
        <div className="w-[150px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Priority</label>
          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full bg-white border border-slate-200 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
            <tr>
              <th className="px-4 py-3">Ticket ID</th>
              <th className="px-4 py-3">Requester</th>
              <th className="px-4 py-3">Subject &amp; Category</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Logged Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredTickets.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-slate-400 font-medium">
                  No support tickets found matching criteria.
                </td>
              </tr>
            ) : (
              filteredTickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-bold text-[#1e3a8a]">{t.ticketNo || t.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-800">{t.requesterName}</div>
                    <div className="text-[11px] text-slate-400">{t.requesterEmail}</div>
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <div className="font-bold text-slate-800 truncate">{t.subject}</div>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {t.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.priority === 'Urgent' ? 'bg-red-100 text-red-700 border border-red-200' :
                      t.priority === 'High' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      'bg-blue-50 text-blue-700 border border-blue-100'
                    }`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'Resolved' ? 'bg-green-50 text-green-700 border border-green-200' :
                      t.status === 'In Progress' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 font-medium">{t.created}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button 
                        onClick={() => {
                          setSelectedTicket(t);
                          setResponseText(t.response || '');
                          setNewStatus(t.status || 'In Progress');
                        }}
                        className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-100 transition-all text-xs flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">support_agent</span>
                        Respond
                      </button>
                      <button 
                        onClick={() => handleDelete(t.id)}
                        className="w-7 h-7 rounded bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 flex items-center justify-center transition-all"
                        title="Delete Ticket"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Response Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">Support Response - {selectedTicket.ticketNo}</h3>
              <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p className="font-bold text-slate-800">{selectedTicket.subject}</p>
                <p className="text-slate-600 mt-1">{selectedTicket.description}</p>
                <div className="mt-2 text-[11px] text-slate-400">By: {selectedTicket.requesterName} ({selectedTicket.requesterEmail})</div>
              </div>

              <form onSubmit={handleUpdateTicket} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Update Status</label>
                  <select 
                    value={newStatus} 
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Support Resolution / Internal Notes</label>
                  <textarea 
                    rows="4"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Enter support investigation details or response..."
                    className="w-full border border-slate-300 rounded-lg p-3 text-xs outline-none focus:border-blue-600"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setSelectedTicket(null)} 
                    className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2 rounded-lg bg-[#1e3a8a] text-white font-bold hover:bg-blue-900 shadow-md"
                  >
                    Save Resolution
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Ticket Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">Log New Support Ticket</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Requester Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Patient or Staff Name"
                  value={newTicket.requesterName}
                  onChange={(e) => setNewTicket({ ...newTicket, requesterName: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="user@example.com"
                  value={newTicket.requesterEmail}
                  onChange={(e) => setNewTicket({ ...newTicket, requesterEmail: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select 
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none cursor-pointer"
                  >
                    <option>Appointment Issue</option>
                    <option>Portal Access</option>
                    <option>IT Infrastructure</option>
                    <option>Billing Inquiry</option>
                    <option>Medical Records</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select 
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none cursor-pointer"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Brief description of the issue"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Description</label>
                <textarea 
                  rows="3"
                  placeholder="Detailed notes regarding the support request..."
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-600"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)} 
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 rounded-lg bg-[#1e3a8a] text-white font-bold hover:bg-blue-900 shadow-md"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpDesk;
