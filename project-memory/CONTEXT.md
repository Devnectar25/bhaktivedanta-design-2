# CONTEXT.md — Project Context & State Specifications

This document serves as the project context repository for the **Bhaktivedanta Hospital Web Application** frontend.

---

## 1. Project Overview & Architectural Boundaries
The application is a client-side Single Page Application (SPA). It hosts two primary workspaces:
1. **Public Patients Portal (`/`)**: Scoped with Vanilla CSS, displays landing section components, doctors list, and diagnostic modal overlays.
2. **Admin Operations Center (`/admin/*`)**: Wrapped inside a secure layout containing a dynamic script manager that injects Tailwind compiler utilities for admin forms and listing directories.

---

## 2. Component Layout & Mapping

### Public Workspace Components (`src/components/`)
*   **[Navbar.jsx](file:///c:/Workplace/Bhaktiveda/bhaktivedanta-design-2/src/components/Navbar.jsx)**: Header navigation, scroll controls, mobile responsive drawer, and categories & specialities menu links.
*   **[Hero.jsx](file:///c:/Workplace/Bhaktiveda/bhaktivedanta-design-2/src/components/Hero.jsx)**: Slider cards and direct booking shortcuts.
*   **[About.jsx](file:///c:/Workplace/Bhaktiveda/bhaktivedanta-design-2/src/components/About.jsx)**: Hospital introductory panels.
*   **[Services.jsx](file:///c:/Workplace/Bhaktiveda/bhaktivedanta-design-2/src/components/Services.jsx)**: Slide track lists of departments.
*   **[Doctors.jsx](file:///c:/Workplace/Bhaktiveda/bhaktivedanta-design-2/src/components/Doctors.jsx)**: Searchable public doctor cards directory.
*   **[Testimonials.jsx](file:///c:/Workplace/Bhaktiveda/bhaktivedanta-design-2/src/components/Testimonials.jsx)**: Patient reviews slider.
*   **[SpecialityModal.jsx](file:///c:/Workplace/Bhaktiveda/bhaktivedanta-design-2/src/components/SpecialityModal.jsx)**: 5-tab detail overlay popup modal triggered on menu clicks.

### Admin Workspace Pages (`src/pages/admin/`)
*   **Dashboard.jsx**: Analytics metrics, KPIs, and logs.
*   **Doctors.jsx**: Active doctor profiles directory listings with CRUD action icons.
*   **Appointments.jsx**: Patient bookings list.
*   **Specialities.jsx**: Categories and Specialities structure configurations.
*   **Forms (`src/pages/admin/forms/`)**:
    *   `AddDoctor.jsx`, `AddService.jsx`, `AddSpeciality.jsx`, `AddCategory.jsx`, `AddAppointment.jsx`, `AddEvent.jsx`, `AddTestimonial.jsx`, `AddGalleryMedia.jsx`, `AddNews.jsx`, `AddHealthPackage.jsx`, `AddQuery.jsx`, `AddSubAdmin.jsx`, `AddAdminUser.jsx`

---

## 3. LocalStorage Data Schemas (Mock DB)

### 1. Categories & Specialities State
**Key**: `bhaktivedanta_specialities_state`
```json
{
  "view": "listing",
  "activeCategoryId": null,
  "activeSpecialityId": null,
  "activeTabId": "t1",
  "categories": [
    {
      "id": "c1",
      "name": "General Specialities",
      "description": "Comprehensive general healthcare services...",
      "status": true,
      "order": 1
    }
  ],
  "specialities": [
    {
      "id": "s1",
      "categoryId": "c1",
      "name": "Anesthesiology",
      "bannerImage": "https://images.unsplash.com/photo...",
      "thumbnailImage": "https://images.unsplash.com/photo...",
      "status": true,
      "shortDescription": "Safe and effective anesthesia services.",
      "tabs": [
        { "id": "t1", "title": "Overview", "content": "<p>Content HTML</p>", "images": [] },
        { "id": "t2", "title": "Why Choose Us", "content": "<ul>List HTML</ul>", "images": [] },
        { "id": "t3", "title": "Technology & Infrastructure", "content": "<p>Content</p>", "images": ["image_url"] },
        { "id": "t4", "title": "Services", "content": "<ul>List</ul>", "images": [] },
        { "id": "t5", "title": "Our Experts", "content": "<div>Content</div>", "images": [] }
      ]
    }
  ]
}
```

### 2. Doctors Directory State
**Key**: `bhaktivedanta_admin_doctors`
```json
[
  {
    "id": "d1",
    "name": "Dr. Anand Sharma",
    "qualifications": "MBBS, MD (Cardiology)",
    "department": "Cardiology",
    "subSpeciality": "Interventional Cardiology",
    "experience": "15 Years",
    "availability": "Available",
    "featured": "Yes",
    "status": "Active",
    "image": "https://images.unsplash.com/..."
  }
]
```

### 3. Appointments Register State
**Key**: `bhaktivedanta_admin_appointments`
```json
[
  {
    "id": "APT-4902",
    "patientName": "Amit Sharma",
    "patientPhone": "+91 98765 43210",
    "doctorName": "Dr. Anand Sharma",
    "department": "Cardiology",
    "dateTime": "2026-06-24 10:30 AM",
    "payment": "Paid",
    "status": "Confirmed"
  }
]
```

### 4. Events Campaign State
**Key**: `bhaktivedanta_admin_events`
```json
[
  {
    "id": "EVT-101",
    "title": "Free Heart Health Check-up Camp",
    "date": "2026-10-28",
    "time": "09:00 AM - 04:00 PM",
    "venue": "Hospital Ground Floor",
    "status": "Upcoming",
    "description": "ECG checking and cardiology consultations."
  }
]
```

### 5. Testimonials Moderation State
**Key**: `bhaktivedanta_admin_testimonials`
```json
[
  {
    "id": "TST-201",
    "patientName": "Harish Mehta",
    "disease": "Angioplasty Patient",
    "content": "The care and attention I received was exceptional...",
    "rating": 5,
    "status": "Approved"
  }
]
```

### 6. Hospital News State
**Key**: `bhaktivedanta_admin_news`
```json
[
  {
    "id": "NWS-301",
    "title": "Bhaktivedanta Hospital Awarded NABH Accreditation",
    "date": "2026-10-10",
    "category": "Achievements",
    "status": "Published",
    "content": "NABH accreditation announcement details..."
  }
]
```

### 7. Diagnostic Gallery State
**Key**: `bhaktivedanta_admin_gallery`
```json
[
  {
    "id": "GAL-401",
    "title": "Main Hospital Building",
    "category": "Infrastructure",
    "imageUrl": "https://images.unsplash.com/...",
    "status": "Active"
  }
]
```

### 8. User Contact Queries State
**Key**: `bhaktivedanta_admin_queries`
```json
[
  {
    "id": "QRY-501",
    "name": "Suresh Patil",
    "email": "suresh.patil@gmail.com",
    "subject": "Pre-employment screening",
    "message": "Detail message...",
    "date": "15 Jun, 2026",
    "status": "Pending"
  }
]
```

### 9. Sub Administrators State
**Key**: `bhaktivedanta_admin_subadmins`
```json
[
  {
    "username": "admin.sneha",
    "email": "sneha@bhaktivedantahospital.com",
    "role: "Administration",
    "status": "Active",
    "created": "2026-06-15"
  }
]
```
