import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const navLinks = [
  // Section 1
  { name: 'Dashboard', icon: 'dashboard', to: 'dashboard' },
  /*
  { 
    name: 'Appointments', 
    icon: 'calendar_month', 
    externalUrl: 'https://his.bhaktivedantahospital.com/EHR/', 
    isExternal: true 
  },
  */
  { name: 'Doctors', icon: 'group', to: 'doctors' },
  /*
  { 
    name: 'Patient Report', 
    icon: 'analytics', 
    externalUrl: 'https://his.bhaktivedantahospital.com/EHR/', 
    isExternal: true 
  },
  */
  { divider: true },

  // Section 2
  { name: 'Specialities', icon: 'star', to: 'specialities' },
  { name: 'Services', icon: 'medical_services', to: 'services' },
  { name: 'Patient Corner', icon: 'face', to: 'patients-corner' },
  { name: 'Spiritual care', icon: 'spa', to: 'spiritual-care' },
  { name: 'Education & Medical Research', icon: 'school', to: 'education-research' },
  { name: 'Our Associate Centre', icon: 'domain', to: 'associate-centres' },
  { name: 'Careers', icon: 'work', to: 'careers' },
  { name: 'About us', icon: 'info', to: 'about-us' },
  { name: 'Blogs', icon: 'article', to: 'blogs' },
  { name: 'Testimonials & Reviews', icon: 'reviews', to: 'testimonials' },
  { name: 'Statutory Compliances & Site Map', icon: 'gavel', to: 'statutory-compliances' },
  { divider: true },

  // Section 3
  { name: 'FAQs', icon: 'quiz', to: 'faqs' },
  { name: 'Patient Feedback', icon: 'rate_review', to: 'patient-feedback' },
  { name: 'Contact Queries', icon: 'contact_support', to: 'contact-queries' },
  { divider: true },

  // Section 4
  { name: 'Application Errors', icon: 'bug_report', to: 'application-errors' },
  { name: 'Sub-Admins', icon: 'admin_panel_settings', to: 'sub-admins' },
  { name: 'Settings', icon: 'settings', to: 'settings' }
];

const rolePermissions = {
  'Super Admin': null,
  'Administrator': null,
  'Content Manager': ['dashboard', 'specialities', 'services', 'blogs', 'patients-corner', 'spiritual-care', 'education-research', 'associate-centres', 'careers', 'testimonials', 'events', 'statutory-compliances', 'about-us', 'faqs'],
  'Developer': ['dashboard', 'application-errors', 'settings', 'sub-admins', 'contact-queries', 'services', 'specialities', 'blogs', 'faqs'],
  'Operations Manager': ['dashboard', 'doctors', 'contact-queries', 'patients-corner', 'testimonials', 'careers', 'blogs', 'faqs']
};

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = localStorage.getItem('subadmin_role') || 'Super Admin';
  const allowedRoutes = rolePermissions[userRole] || null;

  const filteredNavLinks = allowedRoutes 
    ? navLinks.filter(item => {
        if (item.divider || !item.to) return true;
        const routeBase = item.to.split('?')[0];
        return allowedRoutes.includes(item.to) || allowedRoutes.includes(routeBase);
      })
    : navLinks;

  const handleLogout = () => {
    localStorage.removeItem('bhaktivedanta_admin_auth');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin_username');
    localStorage.removeItem('subadmin_role');
    sessionStorage.clear();
    window.location.href = '/admin/login';
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] premium-sidebar flex flex-col pb-6 z-50 overflow-hidden text-white">
      <div className="h-24 px-5 flex items-center border-b border-white/10 mb-2">
        <NavLink to="dashboard" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity w-full">
          <img src="/icon.png" alt="Icon" className="h-[58px] w-auto object-contain flex-shrink-0" />
          <img 
            src="/logo.png" 
            alt="Bhaktivedanta Hospital" 
            className="h-[48px] w-auto object-contain flex-1 min-w-0" 
            style={{ filter: 'brightness(0) invert(1)' }} 
          />
        </NavLink>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 custom-scrollbar space-y-1">
        {filteredNavLinks.map((item, idx) => {
          if (item.divider) {
            return <div key={`div-${idx}`} className="h-px bg-white/10 my-3 mx-3"></div>;
          }

          if (item.isExternal) {
            return (
              <a
                key={`ext-${idx}`}
                href={item.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-2.5 rounded-lg transition-all smooth-transition text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
                title={`Redirect to external portal: ${item.name}`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-white/50">open_in_new</span>
              </a>
            );
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
              className={({ isActive }) => {
                const isCurrent = isActive || location.pathname.includes(item.to);

                return `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all smooth-transition text-sm font-medium ${
                  isCurrent
                    ? 'active-nav-link bg-white/20 text-white shadow-sm font-semibold' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`;
              }}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="px-4 pt-4 border-t border-white/10">
        <div className="mt-4 space-y-1">
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
