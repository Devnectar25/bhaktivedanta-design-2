import React, { useState, useEffect, useRef } from 'react';
import { showConfirmDialog } from '../../utils/swal';

const defaultNotifications = [
  {
    id: "notif-1",
    title: "New Appointment Request",
    message: "Patient Amit Sharma requested an appointment with Dr. Avinash (Neurology).",
    time: "10 mins ago",
    type: "info",
    read: false
  },
  {
    id: "notif-2",
    title: "Emergency Alert Broadcasted",
    message: "Code Red active in Wing B. Personnel please respond.",
    time: "1 hour ago",
    type: "error",
    read: false
  },
  {
    id: "notif-3",
    title: "Inventory Stock Alert",
    message: "Critical Warning: Oxygen cylinder reserve is below 15%. Reorder immediately.",
    time: "2 hours ago",
    type: "warning",
    read: false
  },
  {
    id: "notif-4",
    title: "System Sync Complete",
    message: "Database sync finished successfully. 142 records updated.",
    time: "5 hours ago",
    type: "success",
    read: true
  }
];

const AdminHeader = ({ title }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const username = localStorage.getItem('admin_username') || 'Admin User';
  const role = localStorage.getItem('subadmin_role') || 'Super Admin';

  const handleLogout = () => {
    localStorage.removeItem('bhaktivedanta_admin_auth');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin_username');
    localStorage.removeItem('subadmin_role');
    sessionStorage.clear();
    window.location.href = '/admin/login';
  };

  useEffect(() => {
    const data = localStorage.getItem('bhaktivedanta_notifications');
    if (!data) {
      localStorage.setItem('bhaktivedanta_notifications', JSON.stringify(defaultNotifications));
      setNotifications(defaultNotifications);
    } else {
      try {
        setNotifications(JSON.parse(data));
      } catch (e) {
        setNotifications(defaultNotifications);
      }
    }
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const saveNotifications = (newNotifs) => {
    localStorage.setItem('bhaktivedanta_notifications', JSON.stringify(newNotifs));
    setNotifications(newNotifs);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase().trim();
    const rows = document.querySelectorAll('table tbody tr');
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(query) ? '' : 'none';
    });
  };

  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const handleClearAll = async (e) => {
    e.stopPropagation();
    const res = await showConfirmDialog("Clear Notifications", "Clear all notifications?", "Yes, Clear");
    if (res.isConfirmed) {
      saveNotifications([]);
    }
  };

  const handleMarkSingleRead = (id) => {
    const updated = notifications.map(n => {
      if (n.id === id) return { ...n, read: true };
      return n;
    });
    saveNotifications(updated);
  };

  const handleDeleteSingle = (e, id) => {
    e.stopPropagation();
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="fixed top-0 right-0 z-40 bg-white/80 backdrop-blur-md flex justify-between items-center h-20 px-8 border-b border-slate-200/50 shadow-sm w-[calc(100%-280px)] ml-[280px]">
      <div className="flex items-center gap-6 flex-1 mr-8 min-w-0">
        <h2 className="text-xl font-extrabold text-slate-800 font-sans whitespace-nowrap shrink-0 m-0 leading-none flex items-center">
          Admin Panel
        </h2>
        <div className="relative flex-1 max-w-2xl group flex items-center min-w-0">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] group-focus-within:text-slate-600 transition-colors pointer-events-none">
            search
          </span>
          <input
            className="w-full bg-slate-100/80 border border-slate-200 focus:border-slate-300 focus:bg-white rounded-full h-10 pl-11 pr-4 focus:ring-2 focus:ring-slate-200 outline-none transition-all text-sm text-slate-700 font-sans flex items-center"
            placeholder="Type here to search list contents..."
            type="text"
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center p-1 rounded-full hover:bg-slate-100 transition-all text-left outline-none active:scale-95"
            title={username}
          >
            <img
              alt="Admin Profile"
              className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGqK0tUfbuqSxbfBIUdGMeFLtChbPcohJwmAhWmeKsnzBL50kdu9WUBzGrHm-_mjxXCOvs6vGG_KAEUZ0Aq4JK5XBMZnc0T2VNlIUGjxep88pAjeDh1qOjk-EQbBKMFilmsY84OYXkeUX5vrgN9FYHK-54D_SoK75i0Ef3GfVYJfcmKlz5nP_7RxFWc5dcg0fmLTej9icKl3NdyPKslBkJiav17I9drerB0CgS_Fi_YVuX8y12TNGXtXGTP3Ye8z1rJHjQThSl7pQ"
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200/60 z-50 py-1 font-sans animate-dropdown">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">{username}</p>
                <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 rounded">
                  {role}
                </span>
              </div>
              <a href="/admin/settings" className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-[18px]">settings</span>
                Settings
              </a>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left border-t border-slate-100"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
