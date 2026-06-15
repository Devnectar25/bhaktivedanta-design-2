# requirements.md — Functional & UI Requirements

This document outlines the detailed system requirements, layout specs, and form schemas for the Bhaktivedanta Hospital application.

---

## 1. Public Portal & Interface Specifications

### Navbar Order & Styling
- The main header navigation items must be structured in this order:
  1. **Home**: Directs to the landing sections (scroll trigger).
  2. **Specialities**: Toggles the mega-menu dropdown list of available categories and medical disciplines.
  3. **Services**: Directs to hospital clinical services overview.
  4. **Doctors**: Navigates to the interactive doctors list.
  5. **Infrastructure**: Shows hospital diagnostic technology and facilities.
  6. **Testimonials**: Reviews from patients.
  7. **Contact Us**: Address details and manual feedback form.
- The **Book Appointment** button in the Navbar must have a compact, optimized width (reducing padding/width compared to general layout links).

### Specialities Detail Modal
- Triggered by clicking any speciality item in the Navbar dropdown menu.
- Must display a clean modal dialog containing a **5-Tab Component Layout**:
  1. **Overview Tab**: Descriptive summary of the speciality.
  2. **Why Choose Us Tab**: Patient care differentiators and quality points.
  3. **Technology & Infrastructure Tab**: Advanced machines, software, and surgery units used in the department.
  4. **Services Tab**: Clinical operations and diagnosis lists.
  5. **Our Experts Tab**: Specialist physicians and specialists profiles.
- If no custom tab data is set for a speciality, the modal must fallback to standard auto-generated templates.

---

## 2. Admin Portal Requirements

### Route Protection & Redirection
- Dynamic URL paths (e.g. `/admin/dashboard`, `/admin/doctors`) must be wrapped within the [AdminLayout.jsx](file:///c:/Workplace/Bhaktiveda/bhaktivedanta-design-2/src/components/admin/AdminLayout.jsx) component.
- The login panel `/admin/login` must validate username and password. If authorization checks are bypassed, redirect the browser session back to `/admin/login`.

### Admin Forms & Data Inputs Schema

#### A. Add/Edit Doctor Form (`/admin/add-doctor`)
- **Name**: Text input (Required).
- **Qualifications**: Text input (e.g., MBBS, MD).
- **Department/Speciality**: Dropdown matching active specialities lists (Required).
- **Sub-Speciality**: Optional text description.
- **Experience**: Number of years input.
- **Availability Status**: Dropdown select (`Available`, `Busy`, `On Leave`).
- **Featured Toggle**: Checkbox input (`Yes` / `No`).
- **Active Status**: Toggle switch (`Active` / `Inactive`).
- **Image URL**: Text input for template asset path.

#### B. Add/Edit Speciality Form (`/admin/add-speciality`)
- **Name**: Text input (Required).
- **Category Group**: Dropdown mapping to categories (`c1`, `c2`, `c3`, `c4`).
- **Banner Image**: Text URL path.
- **Thumbnail Image**: Text URL path.
- **Short Description**: Brief overview text.
- **Tab Configurations**: Extensible text editors to override standard HTML tabs details (Overview, Why Choose Us, etc.).

#### C. Add/Edit Appointment Form (`/admin/add-appointment`)
- **Patient Name**: Text input (Required).
- **Phone Number**: Patient contact digits.
- **Doctor Assigned**: Dropdown listing active doctors.
- **Date & Time**: Calendar/Time schedule picker.
- **Payment Status**: Select option (`Paid`, `Partial`, `Unpaid`).
- **Consultation Status**: Select option (`Pending`, `Confirmed`, `Completed`, `Cancelled`).

#### D. Add/Edit Category Form (`/admin/add-category`)
- **Category Name**: Text input.
- **Description**: Textarea.
- **Display Order**: Integer mapping sorting order.
- **Status Toggle**: Set active display status.

---

## 3. Deployment & Build Specifications
- Built files must be generated using Vite via `npm.cmd run build` command, outputting optimized client bundles inside the `dist/` workspace folder.
- Dynamic modules must be code-split if chunk sizes exceed 500kB to optimize page load speeds.
