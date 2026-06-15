import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '', visible: false });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Inject Tailwind CDN script for login page if not already present
    let tailwindScript = document.getElementById('admin-tailwind-script') || document.getElementById('tailwind-cdn-script');
    if (!tailwindScript) {
      tailwindScript = document.createElement('script');
      tailwindScript.src = "https://cdn.tailwindcss.com?plugins=forms,container-queries,typography";
      tailwindScript.id = "admin-tailwind-script";
      document.head.appendChild(tailwindScript);
    }

    // 2. Inject Google Fonts if not already present
    let fontsLink = document.getElementById('admin-fonts-link') || document.getElementById('login-fonts-link');
    if (!fontsLink) {
      fontsLink = document.createElement('link');
      fontsLink.rel = 'stylesheet';
      fontsLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap';
      fontsLink.id = 'admin-fonts-link';
      document.head.appendChild(fontsLink);
    }

    // 3. Inject custom inline style overrides for admin font scaling if not already present
    let inlineStyle = document.getElementById('admin-inline-style-override');
    if (!inlineStyle) {
      inlineStyle = document.createElement('style');
      inlineStyle.id = 'admin-inline-style-override';
      inlineStyle.innerHTML = `
        html {
          font-size: 17px !important;
        }
        body {
          font-family: 'Inter', sans-serif !important;
        }
      `;
      document.head.appendChild(inlineStyle);
    }

    return () => {
      // Only clean up if the user is leaving the admin area completely
      if (!window.location.pathname.startsWith('/admin')) {
        document.getElementById('admin-tailwind-script')?.remove();
        document.getElementById('tailwind-cdn-script')?.remove();
        document.getElementById('admin-fonts-link')?.remove();
        document.getElementById('login-fonts-link')?.remove();
        document.getElementById('admin-inline-style-override')?.remove();
        document.querySelectorAll('style').forEach(el => {
          if (el.textContent.includes('tailwind') || el.id?.includes('tailwind') || el.textContent.includes('--tw-')) {
            el.remove();
          }
        });
      }
    };
  }, []);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3500);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const cleanUser = username.trim();

    if (!cleanUser) {
      triggerToast("Please enter your username.", "error");
      return;
    }
    if (!password) {
      triggerToast("Please enter your password.", "error");
      return;
    }

    if ((cleanUser !== 'Admin' && cleanUser !== 'Admin@bhaktivedantahospital.com') || password !== 'Admin') {
      triggerToast("Invalid credentials! Please use 'Admin' for both.", "error");
      return;
    }

    triggerToast("Authenticating details...", "info");
    setIsLoading(true);

    setTimeout(() => {
      triggerToast("Welcome Back! Redirecting to Dashboard...", "success");
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1000);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-0 md:p-6 font-sans" style={{ zoom: 0.94 }}>
      {/* Toast */}
      {toast.visible && (
        <div className={`fixed bottom-5 right-5 z-[9999] flex items-center gap-3 p-4 rounded-xl shadow-lg border text-sm font-sans animate-bounce bg-white max-w-sm w-full ${
          toast.type === 'error' ? 'border-red-100' : toast.type === 'info' ? 'border-blue-100' : 'border-green-100'
        }`}>
          <span className={`material-symbols-outlined text-[22px] flex-shrink-0 ${
            toast.type === 'error' ? 'text-red-500' : toast.type === 'info' ? 'text-blue-500' : 'text-green-500'
          }`}>
            {toast.type === 'error' ? 'cancel' : toast.type === 'info' ? 'info' : 'check_circle'}
          </span>
          <span className="text-slate-700 flex-1 font-medium">{toast.message}</span>
        </div>
      )}

      <main className="w-full max-w-[1100px] min-h-screen md:min-h-0 md:h-[85vh] md:max-h-[700px] flex flex-col md:flex-row bg-white rounded-none md:rounded-2xl overflow-hidden shadow-2xl border border-slate-100">
        
        {/* Left Side: Branding */}
        <section className="relative w-full md:w-1/2 min-h-[350px] md:min-h-full overflow-hidden flex flex-col justify-center px-8 lg:px-16 py-10 md:py-16 text-white">
          <div className="absolute inset-0 z-0">
            <img 
              alt="Hospital Exterior" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBu3jUPb1Oe2tg3u9ExB3G3HYttSENX-8K4G7G_N4ivT52cCN36F6bUQL2PGQkfrF0Jqd6RUIplimHCijTNq4Dis-LglpIR_SBRU9_1jKJX4Jt1Z-8nDMycGSHbF0ynrw2PhAs62LZ0G6lM1mCNXbkByxc0Tlk3ppGzcV0efVt6NACxNHXyKCC1gHWAzvxjckYGeylSsZ9rpEwoDP7PTGDbmJbirh6ZN9dAhnsTCOJ0E0JkwEkKRv0yQQNWDfZwLDqhIjav5z99vQ0"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a]/95 via-[#1e3a8a]/80 to-transparent"></div>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold max-w-md leading-tight">
                Bhaktivedanta Hospital Admin Portal
              </h1>
              <p className="text-lg text-white/90 max-w-lg font-medium">
                Securely manage hospital website content, doctors, appointments, and patient communication.
              </p>
            </div>
            
            <ul className="space-y-4 font-semibold">
              <li className="flex items-center gap-4">
                <span className="material-symbols-outlined bg-white/20 p-2 rounded-lg text-[24px]">web_traffic</span>
                <span>Manage Website Content</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="material-symbols-outlined bg-white/20 p-2 rounded-lg text-[24px]">medical_services</span>
                <span>Manage Doctors &amp; Availability</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="material-symbols-outlined bg-white/20 p-2 rounded-lg text-[24px]">calendar_month</span>
                <span>Track Appointments</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="material-symbols-outlined bg-white/20 p-2 rounded-lg text-[24px]">contact_support</span>
                <span>Handle Contact Queries</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Right Side: Login Form */}
        <section className="w-full md:w-1/2 flex flex-col items-center justify-center bg-slate-50 px-6 py-8 md:py-12 lg:px-16">
          <div className="w-full max-w-[400px] space-y-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="flex items-center gap-3 hover:scale-105 transition-all">
                <img src="/icon.png" alt="Icon" className="h-14 w-auto object-contain" />
                <img src="/logo.png" alt="Bhaktivedanta Hospital" className="h-10 w-auto object-contain" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
                <p className="text-sm text-slate-500 font-medium">Sign in to continue</p>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleLoginSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700" htmlFor="email">Username or Email</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">person</span>
                    <input 
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-slate-800 text-sm font-medium" 
                      id="email" 
                      placeholder="Admin" 
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700" htmlFor="password">Password</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">lock</span>
                    <input 
                      className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-slate-300 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-slate-800 text-sm font-medium" 
                      id="password" 
                      placeholder="Admin" 
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors" 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all" type="checkbox" />
                  <span className="text-xs text-slate-500 group-hover:text-slate-800 font-medium">Remember me</span>
                </label>
                <a className="text-xs font-bold text-blue-700 hover:underline transition-all" href="#">Forgot Password?</a>
              </div>

              <div className="space-y-3 pt-1">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-3 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-[0.98] bg-[#F59E0B] hover:bg-[#D97706] disabled:opacity-50"
                >
                  {isLoading ? 'Connecting...' : 'Login'}
                </button>
              </div>
            </form>

            <footer className="pt-4 text-center">
              <p className="text-xs text-slate-400 font-medium">
                &copy; Bhaktivedanta Hospital Admin
              </p>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminLogin;
