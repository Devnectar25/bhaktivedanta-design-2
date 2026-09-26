import React, { useEffect } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import AdminHeader from '../AdminHeader/AdminHeader';
import ErrorBoundary from '../../ErrorBoundary';
import '../unified-admin.css';

const rolePermissions = {
  'Super Admin': null,
  'Administrator': null,
  'Content Manager': ['dashboard', 'specialities', 'services', 'blogs', 'add-blog', 'edit-blog', 'patients-corner', 'spiritual-care', 'education-research', 'associate-centres', 'careers', 'testimonials', 'events', 'patient-feedback'],
  'Developer': ['dashboard', 'application-errors', 'settings', 'sub-admins', 'contact-queries', 'patient-feedback', 'services', 'specialities', 'blogs', 'add-blog', 'edit-blog'],
  'Operations Manager': ['dashboard', 'doctors', 'contact-queries', 'patient-feedback', 'patients-corner', 'testimonials', 'careers', 'blogs', 'add-blog', 'edit-blog']
};

const AdminLayout = () => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('bhaktivedanta_admin_auth') === 'true' || localStorage.getItem('adminToken') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const userRole = localStorage.getItem('subadmin_role') || 'Super Admin';
  const allowedRoutes = rolePermissions[userRole] || null;
  const currentPathSegment = location.pathname.replace('/admin/', '').replace('/admin', '') || 'dashboard';

  if (allowedRoutes && currentPathSegment && !allowedRoutes.some(r => currentPathSegment.startsWith(r))) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  useEffect(() => {
    // 1. Inject Tailwind CDN script if not already present
    let tailwindScript = document.getElementById('admin-tailwind-script') || document.getElementById('tailwind-cdn-script');
    if (!tailwindScript) {
      tailwindScript = document.createElement('script');
      tailwindScript.src = "https://cdn.tailwindcss.com?plugins=forms,container-queries,typography";
      tailwindScript.id = "admin-tailwind-script";
      document.head.appendChild(tailwindScript);
    }

    // 2. Inject Tailwind configuration if not already present
    let tailwindConfig = document.getElementById('tailwind-config-script');
    if (!tailwindConfig) {
      tailwindConfig = document.createElement('script');
      tailwindConfig.id = "tailwind-config-script";
      tailwindConfig.innerHTML = `
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                primary: "#1e3a8a",
                "on-primary": "#ffffff",
                "primary-container": "#1e3a8a",
                secondary: "#d97706",
                "secondary-container": "#fea619",
                "secondary-fixed": "#ffddb8",
                "secondary-fixed-dim": "#ffb95f",
                surface: "#f8f9ff",
                "surface-bright": "#f8f9ff",
                "surface-dim": "#d0dbed",
                "surface-container": "#e6eeff",
                "surface-container-low": "#eff4ff",
                "surface-container-lowest": "#ffffff",
                "surface-container-high": "#dee9fc",
                "surface-container-highest": "#d9e3f6",
                "on-surface": "#121c2a",
                "on-surface-variant": "#444651",
                outline: "#757682",
                "outline-variant": "#c5c5d3",
                error: "#ba1a1a",
                "error-container": "#ffdad6",
                background: "#f8f9ff",
                "on-background": "#121c2a",
                "on-tertiary-fixed": "#001a42",
                "on-error-container": "#93000a",
                "on-secondary-fixed-variant": "#653e00",
                "on-tertiary-fixed-variant": "#004395",
                "on-secondary-fixed": "#2a1700",
                "on-primary-fixed-variant": "#264191",
                "on-tertiary-container": "#82abff",
                "on-primary-fixed": "#00164e",
                "on-secondary": "#ffffff",
                "inverse-primary": "#b6c4ff",
                "inverse-surface": "#27313f",
                "inverse-on-surface": "#eaf1ff"
              },
              borderRadius: {
                DEFAULT: "0.25rem",
                lg: "0.5rem",
                xl: "0.75rem",
                full: "9999px"
              },
              spacing: {
                base: "8px",
                xs: "4px",
                xl: "64px",
                md: "24px",
                lg: "40px",
                "margin-desktop": "32px",
                sm: "12px",
                "margin-mobile": "16px",
                gutter: "24px"
              },
              fontFamily: {
                sans: ["Inter", "sans-serif"]
              }
            }
          }
        }
      `;
      document.head.appendChild(tailwindConfig);
    }



    // Inject custom inline style overrides for admin layout
    let inlineStyle = document.getElementById('admin-inline-style-override');
    if (!inlineStyle) {
      inlineStyle = document.createElement('style');
      inlineStyle.id = 'admin-inline-style-override';
      inlineStyle.innerHTML = `
        html {
          font-size: 17px !important;
        }
        body {
          background-color: #f8f9ff !important;
          font-family: 'Inter', sans-serif !important;
          color: #121c2a !important;
        }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `;
      document.head.appendChild(inlineStyle);
    }

    return () => {
      // Only clean up if the user is leaving the admin area completely
      if (!window.location.pathname.startsWith('/admin')) {
        document.getElementById('admin-tailwind-script')?.remove();
        document.getElementById('tailwind-cdn-script')?.remove();
        document.getElementById('tailwind-config-script')?.remove();
        document.getElementById('admin-icons-link')?.remove();
        document.getElementById('admin-inline-style-override')?.remove();

        // Clean up style tags injected by Tailwind CDN
        document.querySelectorAll('style').forEach(el => {
          if (el.textContent.includes('tailwind') || el.id?.includes('tailwind') || el.textContent.includes('--tw-')) {
            el.remove();
          }
        });
        // Restore main site body style resets
        document.body.removeAttribute('style');
      }
    };
  }, []);

  return (
    <div className="admin-layout-wrapper text-on-surface font-sans antialiased min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex flex-col min-h-screen ml-[280px]">
        <AdminHeader title="Admin Panel" />
        <main className="flex-1 px-8 pb-8 pt-24 bg-background overflow-x-hidden">
          <div className="w-full">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
