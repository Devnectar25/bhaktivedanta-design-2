# DECISIONS.md — Architecture & Technical Decisions

This document records the architectural tradeoffs and technical decisions made for the Bhaktivedanta Hospital Web Application.

---

## 1. Dynamic Styling Scope Isolation

*   **Problem**: The public website layout is custom-designed using Vanilla CSS and lacks standard resets (like Tailwind preflight). Appending Tailwind styles globally would override typography, margins, padding, and border styles on the public landing page.
*   **Alternatives Considered**:
    1.  *Tailwind prefixing*: Prefix all admin classes with `tw-`. Rejected because it would require rewriting hundreds of Tailwind class attributes in the migrated pages.
    2.  *Vite CSS Modules*: Restructure all components to import style files locally. Rejected due to the overhead of converting legacy unified layouts.
    3.  *Shadow DOM Encapsulation*: Wrap the admin subroutes in a Shadow DOM wrapper. Rejected due to react-router integration difficulties and script parsing limits.
*   **Chosen Solution**: Dynamically append the Tailwind CSS CDN script and custom styles during mounting of [AdminLayout.jsx](file:///c:/Workplace/Bhaktiveda/bhaktivedanta-design-2/src/components/admin/AdminLayout.jsx), and clean up all injected style tags on route unmount.
*   **Impact**: Keeps the public homepage visually stable while enabling standard Tailwind layouts for the Admin area.

---

## 2. Mock Client-Side Database Model

*   **Problem**: The project requires CRUD operations (adding/editing doctors, specialities, categories) without a server-side API or database.
*   **Alternatives Considered**:
    1.  *Static JS files*: Edit variables in local memory. Rejected because changes would reset on every browser page refresh.
    2.  *Mock API server (JSON Server)*: Run a mock backend process. Rejected as it introduces external environment dependencies for the client.
*   **Chosen Solution**: Use `localStorage` keys mapped to categories, doctors, and appointments, initialized with default structures from [adminState.js](file:///c:/Workplace/Bhaktiveda/bhaktivedanta-design-2/src/data/adminState.js) and [defaultSpecialities.js](file:///c:/Workplace/Bhaktiveda/bhaktivedanta-design-2/src/data/defaultSpecialities.js).
*   **Impact**: Persists administration configurations across refreshes and acts as a dynamic source of truth.

---

## 3. Static Module Importing of Admin CSS

*   **Problem**: Injecting the legacy stylesheet `unified-admin.css` dynamically via a `<link>` tag caused a Flash of Unstyled Content (FOUC) when navigating between admin routes.
*   **Alternatives Considered**:
    1.  *Injecting CSS contents as an inline style string*. Rejected because it creates excessive markup blocks.
    2.  *Keeping DOM links append process*. Rejected due to visual layout jumps.
*   **Chosen Solution**: Move `unified-admin.css` to [unified-admin.css](file:///c:/Workplace/Bhaktiveda/bhaktivedanta-design-2/src/components/admin/unified-admin.css) and import it statically via ES modules at the top of [AdminLayout.jsx](file:///c:/Workplace/Bhaktiveda/bhaktivedanta-design-2/src/components/admin/AdminLayout.jsx).
*   **Impact**: Vite bundles the admin styles and loads them instantly alongside other assets, resolving layout delay shifts.

---

## 4. State Sync Across Navigation Layouts

*   **Problem**: When an administrator adds a speciality category, the public website dropdown menu needs to reflect the new category immediately.
*   **Alternatives Considered**:
    1.  *React Context*: Wrap the entire app in a single Context. Rejected because route navigation unmounts layout contexts.
    2.  *Page reload*: Force `window.location.reload()` on redirect. Rejected as it disrupts the SPA experience.
*   **Chosen Solution**: Listen to window `storage` events inside the public [Navbar.jsx](file:///c:/Workplace/Bhaktiveda/bhaktivedanta-design-2/src/components/Navbar.jsx) and check the state on mount.
*   **Impact**: Changes in admin layouts are instantly visible to public layouts without page reloads.
