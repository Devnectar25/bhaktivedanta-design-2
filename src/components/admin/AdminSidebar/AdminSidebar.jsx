import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const navLinks = [
  { name: 'Dashboard', icon: 'dashboard', to: 'dashboard' },
  { name: 'Specialities', icon: 'star', to: 'specialities' },
  { name: 'Services', icon: 'medical_services', to: 'services' },
  { name: 'Help Desk & Support', icon: 'support_agent', to: 'help-desk' },
  { name: 'Application Errors', icon: 'bug_report', to: 'application-errors' },
  { divider: true },

  { name: 'Patients Corner', icon: 'face', to: 'patients-corner' },
  { name: 'Spiritual care', icon: 'spa', to: 'spiritual-care' },
  { name: 'Education & Medical Research', icon: 'school', to: 'education-research' },
  { name: 'Our Associate Centre', icon: 'domain', to: 'associate-centres' },
  { name: 'Careers', icon: 'work', to: 'careers' },
  { divider: true },

  { name: 'Doctors', icon: 'group', to: 'doctors' },
  { name: 'Doctor Availability', icon: 'event_available', to: 'doctor-availability' },
  { name: 'Health Packages', icon: 'health_and_safety', to: 'health-packages' },
  { divider: true },

  { name: 'Testimonials', icon: 'reviews', to: 'testimonials' },
  { name: 'News', icon: 'newspaper', to: 'news' },
  { name: 'Events', icon: 'event', to: 'events' },
  { name: 'Gallery', icon: 'image', to: 'gallery' },
  { divider: true },

  { name: 'Appointments', icon: 'calendar_month', to: 'appointments' },
  { name: 'Contact Queries', icon: 'contact_support', to: 'contact-queries' },
  { name: 'Admin Users', icon: 'manage_accounts', to: 'admin-users' },
  { name: 'Sub-Admins', icon: 'admin_panel_settings', to: 'sub-admins' }
];

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('bhaktivedanta_admin_auth');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin_username');
    sessionStorage.clear();
    window.location.href = '/admin/login';
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] premium-sidebar flex flex-col py-6 z-50 overflow-hidden text-white bg-slate-900">
      <div className="px-6 mb-8 border-b border-white/10 pb-4 pt-2">
        <NavLink to="dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src="/icon.png" alt="Icon" className="h-[62px] w-auto object-contain" />
          <img 
            src="/logo.png" 
            alt="Bhaktivedanta Hospital" 
            className="h-[50px] w-auto object-contain" 
            style={{ filter: 'brightness(0) invert(1)' }} 
          />
        </NavLink>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 custom-scrollbar space-y-1">
        {navLinks.map((item, idx) => {
          if (item.divider) {
            return <div key={`div-${idx}`} className="h-px bg-white/10 my-3 mx-3"></div>;
          }

          if (item.to === '#') {
            return (
              <a
                key={`static-${idx}`}
                href="#"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all smooth-transition text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span>{item.name}</span>
              </a>
            );
          }
          
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all smooth-transition text-sm font-medium ${
                  isActive 
                    ? 'active-nav-link bg-white/20 text-white shadow-sm font-semibold' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="px-4 pt-4 border-t border-white/10">
        <div className="mt-4 space-y-1">
          <NavLink 
            to="settings" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm ${
                isActive ? 'bg-white/20 text-white shadow-sm' : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span>Settings</span>
          </NavLink>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-white/80 hover:bg-red-500/20 hover:text-red-300 transition-all text-sm text-left"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
