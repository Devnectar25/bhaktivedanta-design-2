import React, { useState, useEffect, useRef } from 'react';

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

  const handleLogout = () => {
    localStorage.removeItem('bhaktivedanta_admin_auth');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin_username');
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

  const handleClearAll = (e) => {
    e.stopPropagation();
    if (window.confirm("Clear all notifications?")) {
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
      <div className="flex items-center gap-6 flex-1 mr-8">
        <h2 className="text-xl font-extrabold text-slate-800 font-sans whitespace-nowrap">{title || 'Admin Dashboard'}</h2>
        <div className="relative flex-1 max-w-2xl group hidden md:block">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] group-focus-within:text-slate-600 transition-colors">
            search
          </span>
          <input 
            className="w-full bg-slate-100/80 border border-slate-200 focus:border-slate-300 focus:bg-white rounded-full py-2 pl-11 pr-4 focus:ring-2 focus:ring-slate-200 outline-none transition-all text-sm text-slate-700 font-sans" 
            placeholder="Type here to search list contents..." 
            type="text"
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="flex items-center gap-8">
        {/* Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 relative transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[24px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-slate-200/60 z-50 flex flex-col max-h-[480px] overflow-hidden animate-dropdown">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <span className="font-bold text-slate-700 text-sm">Notifications</span>
                <button onClick={handleMarkAllRead} className="text-xs font-bold text-[#f59e0b] hover:text-amber-600 transition-colors">
                  Mark all as read
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar-light divide-y divide-slate-100 max-h-[350px]">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                    <span className="material-symbols-outlined text-[36px] text-slate-300 mb-2">notifications_off</span>
                    <p className="text-xs text-slate-400 font-bold">No notifications</p>
                  </div>
                ) : (
                  notifications.map(notif => {
                    let iconName = 'info';
                    let iconBgClass = 'bg-blue-50 text-blue-500 border border-blue-100';

                    if (notif.type === 'success') {
                      iconName = 'check_circle';
                      iconBgClass = 'bg-green-50 text-green-500 border border-green-100';
                    } else if (notif.type === 'warning') {
                      iconName = 'warning';
                      iconBgClass = 'bg-amber-50 text-amber-500 border border-amber-100';
                    } else if (notif.type === 'error') {
                      iconName = 'emergency';
                      iconBgClass = 'bg-red-50 text-red-500 border border-red-100 animate-pulse';
                    }

                    return (
                      <div 
                        key={notif.id} 
                        onClick={() => handleMarkSingleRead(notif.id)}
                        className={`flex gap-3 p-4 hover:bg-slate-50 transition-colors relative group/item cursor-pointer ${notif.read ? 'opacity-70' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBgClass}`}>
                          <span className="material-symbols-outlined text-[18px]">{iconName}</span>
                        </div>
                        <div className="flex-1 min-w-0 pr-6">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <p className={`text-xs ${notif.read ? 'font-medium text-slate-600' : 'font-bold text-slate-800'} truncate`}>
                              {notif.title}
                            </p>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">{notif.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{notif.message}</p>
                        </div>
                        {!notif.read && <span className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full"></span>}
                        <button 
                          onClick={(e) => handleDeleteSingle(e, notif.id)}
                          className="absolute bottom-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity p-0.5 rounded hover:bg-slate-100"
                        >
                          <span className="material-symbols-outlined text-[14px]">delete</span>
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50 text-center">
                <button onClick={handleClearAll} className="text-xs font-bold text-slate-500 hover:text-red-500 transition-colors">
                  Clear all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-[1px] bg-slate-200"></div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3.5 p-1 rounded-xl hover:bg-slate-100 transition-all text-left outline-none"
          >
            <div className="flex flex-col text-right hidden sm:block">
              <span className="text-sm font-bold text-slate-800 leading-tight">{username}</span>
              <span className="text-xs font-semibold text-slate-400 leading-tight">Super Administrator</span>
            </div>
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
                <p className="text-[11px] text-slate-400">admin@bhaktivedantahospital.com</p>
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
