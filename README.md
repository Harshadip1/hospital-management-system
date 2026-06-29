# MediCore Hospital Management System

A full-featured **Hospital Management System** UI with client-side data persistence, role-based access control, and complete clinical workflows.

## Quick Start

1. Open `index.html` in a browser, or serve the folder:
   ```bash
   npx serve hospital-management
   ```
2. Go to **Login** and use demo credentials:

| Email | Password | Role |
|-------|----------|------|
| admin@medicore.com | admin123 | Administrator |
| doctor@medicore.com | doctor123 | Doctor |
| nurse@medicore.com | nurse123 | Nurse |
| staff@medicore.com | staff123 | Staff |

## Features

### Core Modules (28 pages)
- **Dashboard** — Overview stats, appointments, charts
- **OPD Queue** — Token-based walk-in management
- **Appointments** — Scheduling & tracking
- **Patients** — Registry with add/delete (persisted)
- **Doctors** — Profiles with dynamic routing (`?id=D-001`)
- **Departments** — Ward overview
- **Admissions** — Patient intake & bed assignment
- **Discharge** — Discharge summary workflow
- **Medical Records** — Patient history
- **Nursing** — Vitals logging & nursing notes
- **Laboratory** — Test orders
- **Radiology** — Imaging orders (X-Ray, CT, MRI)
- **Pharmacy** — Prescriptions & inventory
- **Rooms & Wards** — Bed occupancy
- **Emergency** — Triage cases
- **Staff** — Directory
- **Inventory** — Medical supplies tracking
- **Billing** — Invoices
- **Reports** — Analytics
- **User Management** — RBAC (Admin only)
- **Messages** — Internal chat
- **Notifications** — Alert feed
- **Settings** — Dark mode, data reset

### Technical Highlights
- **localStorage data layer** (`js/data.js`) — CRUD persists across sessions
- **Unified navigation** (`js/nav.js`) — Consistent sidebar on all pages
- **Role-based access** — Menu items hidden by role; protected pages redirect
- **Dynamic profiles** — `patient-profile.html?id=P-00421`
- **Dark mode** — Persists in Settings
- **Global search** — Press Enter in header to find patients/doctors

## Project Structure

```
hospital-management/
├── index.html          # Landing page
├── css/style.css       # Design system + dark mode
├── js/
│   ├── data.js         # Data store & CRUD API
│   ├── nav.js          # Sidebar + RBAC
│   ├── app.js          # Page renderers
│   └── main.js         # UI interactions
└── pages/              # 28 app pages
```

## Reset Data

In **Settings → Reset Data**, or run in browser console:
```js
HMSData.reset()
```

## Note

This is a **frontend prototype** with localStorage persistence. For production, connect a backend API (Node.js, Django, etc.) and replace `HMSData` calls with fetch/axios.
