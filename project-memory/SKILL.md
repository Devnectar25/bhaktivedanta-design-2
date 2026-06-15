# SKILL.md — Frontend Development Guidelines & Coding Standards

This document establishes the official coding standards, code patterns, and responsibilities for developers working on the **Bhaktivedanta Hospital** frontend codebase.

---

## 1. Developer Core Responsibilities

1. **Maintain Pixel-Perfect Visual Fidelity**:
   - The public website relies on custom hand-crafted styling. All UI updates must match this premium visual standard.
   - Use HSL-tailored harmonious gradients, subtle shadows, and clean modern typography (Inter/Outfit).
   - Test layouts thoroughly across screen resolutions (320px mobile up to 2560px ultra-wide screens).

2. **Strict CSS & Style Scope Separation**:
   - **Main Website**: Handled by Vanilla CSS (`index.css` and component CSS files). Do NOT use Tailwind classes in the main website components.
   - **Admin Portal**: Handled by Tailwind CSS (CDN-loaded) and specialized admin classes in [unified-admin.css](file:///c:/Workplace/Bhaktiveda/bhaktivedanta-design-2/src/components/admin/unified-admin.css).
   - Ensure Tailwind styles do not pollute or overlap the public-facing pages.

3. **Client-Side Routing Integration**:
   - Leverage React Router DOM v7 hooks (`useNavigate`, `useLocation`, `useParams`, `useSearchParams`) to navigate cleanly without causing browser window reloads.
   - Support nested route layouts to isolate header/sidebar wrappers.

4. **Synchronization of Storage State**:
   - Maintain client-side dynamic states synced with browser `localStorage`.
   - Update state changes in real-time, leveraging storage event listeners to broadcast updates to other mounted views.

---

## 2. Style Isolation Code Pattern

To avoid Tailwind's global normalization/reset styles breaking the vanilla CSS layout of the public landing page, load the Tailwind script and styles dynamically on admin route mount, and clean them up on unmount.

### Recommended Admin Layout Pattern

```jsx
// Inside src/components/admin/AdminLayout.jsx
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import './unified-admin.css'; // Static CSS import using Vite optimization

const AdminLayout = () => {
  useEffect(() => {
    // 1. Inject Tailwind CDN script
    const tailwindScript = document.createElement('script');
    tailwindScript.src = "https://cdn.tailwindcss.com?plugins=forms,container-queries,typography";
    tailwindScript.id = "tailwind-cdn-script";
    document.head.appendChild(tailwindScript);

    // 2. Inject Tailwind configuration overrides
    const tailwindConfig = document.createElement('script');
    tailwindConfig.id = "tailwind-config-script";
    tailwindConfig.innerHTML = `
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              primary: "#1e3a8a",
              surface: "#f8f9ff"
            }
          }
        }
      }
    `;
    document.head.appendChild(tailwindConfig);

    // 3. Inject Google Material Symbols CSS
    const iconsLink = document.createElement('link');
    iconsLink.rel = 'stylesheet';
    iconsLink.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap';
    iconsLink.id = 'admin-icons-link';
    document.head.appendChild(iconsLink);

    return () => {
      // CLEANUP ON ROUTE UNMOUNT
      document.getElementById('tailwind-cdn-script')?.remove();
      document.getElementById('tailwind-config-script')?.remove();
      document.getElementById('admin-icons-link')?.remove();

      // Clean up style tags injected dynamically by Tailwind compiler
      document.querySelectorAll('style').forEach(el => {
        if (el.textContent.includes('tailwind') || el.id?.includes('tailwind') || el.textContent.includes('--tw-')) {
          el.remove();
        }
      });
      
      // Clean up inline styles from document body
      document.body.removeAttribute('style');
    };
  }, []);

  return (
    <div className="admin-layout-wrapper min-h-screen bg-background">
      {/* Admin Sidebar and Header go here */}
      <main className="ml-[280px] p-6 pt-24">
        <Outlet />
      </main>
    </div>
  );
};
```

---

## 3. Storage State Sync Code Pattern

Ensure variables configured inside the Admin Panel propagate instantly to components on the public landing page (such as the Navbar specialities dropdown).

### Recommended State Loader & Listener Pattern

```jsx
// Inside src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { defaultSpecialitiesState } from '../data/defaultSpecialities';

const Navbar = () => {
  const [specialitiesData, setSpecialitiesData] = useState(() => {
    const stored = localStorage.getItem('bhaktivedanta_specialities_state');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed parsing specialities state:", e);
      }
    }
    return defaultSpecialitiesState;
  });

  useEffect(() => {
    // Synchronize across tabs or route change changes
    const handleStorageChange = (e) => {
      if (e.key === 'bhaktivedanta_specialities_state' && e.newValue) {
        try {
          setSpecialitiesData(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Check on component mount in case state was updated in admin panel without reload
    const stored = localStorage.getItem('bhaktivedanta_specialities_state');
    if (stored) {
      try {
        setSpecialitiesData(JSON.parse(stored));
      } catch (e) {}
    }
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    // Render dropdown list using specialitiesData
    <nav>...</nav>
  );
};
```

---

## 4. Admin Forms & Validation Pattern

Form screens (e.g., adding a doctor, event, or speciality) must support both **Add** and **Edit** modes seamlessly.

```jsx
// Inside src/pages/admin/forms/AddSpeciality.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AddSpeciality = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit'); // Check if edit mode is active

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    bannerImage: '',
    shortDescription: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (editId) {
      const stored = localStorage.getItem('bhaktivedanta_specialities_state');
      if (stored) {
        const parsed = JSON.parse(stored);
        const match = parsed.specialities.find(s => s.id === editId);
        if (match) {
          setFormData({
            name: match.name,
            categoryId: match.categoryId,
            bannerImage: match.bannerImage || '',
            shortDescription: match.shortDescription || ''
          });
        }
      }
    }
  }, [editId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.categoryId) {
      setError('Please fill in all required fields.');
      return;
    }

    const stored = localStorage.getItem('bhaktivedanta_specialities_state');
    const state = stored ? JSON.parse(stored) : { specialities: [], categories: [] };

    if (editId) {
      // Edit Mode
      state.specialities = state.specialities.map(s => 
        s.id === editId ? { ...s, ...formData } : s
      );
    } else {
      // Add Mode
      const newSpeciality = {
        id: `s-${Date.now()}`,
        ...formData
      };
      state.specialities.push(newSpeciality);
    }

    localStorage.setItem('bhaktivedanta_specialities_state', JSON.stringify(state));
    navigate('/admin/specialities');
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {/* Render input elements */}
    </form>
  );
};
```
