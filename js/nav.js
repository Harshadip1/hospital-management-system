/**
 * MediCore HMS — Unified sidebar navigation with RBAC
 */
(function () {
  const NAV = [
    {
      section: 'Main',
      items: [
        { href: 'dashboard.html', icon: 'fa-grip', label: 'Dashboard' },
        { href: 'opd-queue.html', icon: 'fa-list-ol', label: 'OPD Queue', roles: ['Administrator', 'Nurse', 'Staff'] },
        { href: 'appointments.html', icon: 'fa-calendar-check', label: 'Appointments', badge: () => HMSData.get('appointments').filter(a => a.date === new Date().toISOString().slice(0, 10)).length || HMSData.get('appointments').length },
        { href: 'patients.html', icon: 'fa-users', label: 'Patients' },
        { href: 'doctors.html', icon: 'fa-user-doctor', label: 'Doctors' },
        { href: 'departments.html', icon: 'fa-building-columns', label: 'Departments' }
      ]
    },
    {
      section: 'Clinical',
      items: [
        { href: 'admissions.html', icon: 'fa-door-open', label: 'Admissions' },
        { href: 'discharge.html', icon: 'fa-door-closed', label: 'Discharge' },
        { href: 'medical-records.html', icon: 'fa-file-medical', label: 'Medical Records' },
        { href: 'nursing.html', icon: 'fa-user-nurse', label: 'Nursing', roles: ['Administrator', 'Doctor', 'Nurse'] },
        { href: 'laboratory.html', icon: 'fa-flask-vial', label: 'Laboratory' },
        { href: 'radiology.html', icon: 'fa-x-ray', label: 'Radiology' },
        { href: 'pharmacy.html', icon: 'fa-pills', label: 'Pharmacy' },
        { href: 'rooms.html', icon: 'fa-bed', label: 'Rooms & Wards' },
        { href: 'emergency.html', icon: 'fa-truck-medical', label: 'Emergency', badge: () => HMSData.get('admissions').filter(a => a.status === 'Critical').length || 2 }
      ]
    },
    {
      section: 'Administration',
      items: [
        { href: 'staff.html', icon: 'fa-id-badge', label: 'Staff' },
        { href: 'inventory.html', icon: 'fa-boxes-stacked', label: 'Inventory', roles: ['Administrator', 'Staff'] },
        { href: 'billing.html', icon: 'fa-file-invoice-dollar', label: 'Billing' },
        { href: 'reports.html', icon: 'fa-chart-bar', label: 'Reports', roles: ['Administrator', 'Doctor', 'Staff'] },
        { href: 'users.html', icon: 'fa-users-gear', label: 'User Management', roles: ['Administrator'] },
        { href: 'messages.html', icon: 'fa-message', label: 'Messages', badge: 3 },
        { href: 'notifications.html', icon: 'fa-bell', label: 'Notifications' },
        { href: 'settings.html', icon: 'fa-gear', label: 'Settings' }
      ]
    }
  ];

  function getUserRole() {
    try {
      const u = JSON.parse(sessionStorage.getItem('hms_user') || '{}');
      return u.role || 'Administrator';
    } catch { return 'Administrator'; }
  }

  function canAccess(item, role) {
    if (!item.roles) return true;
    return item.roles.includes(role);
  }

  function renderNav() {
    const navEl = document.querySelector('.sidebar-nav');
    if (!navEl) return;

    const role = getUserRole();
    const current = window.location.pathname.split('/').pop() || 'dashboard.html';

    navEl.innerHTML = NAV.map(section => {
      const items = section.items.filter(i => canAccess(i, role));
      if (!items.length) return '';
      return `<div class="nav-section">
        <div class="nav-section-title">${section.section}</div>
        ${items.map(item => {
          const active = current === item.href ? ' active' : '';
          const badgeVal = typeof item.badge === 'function' ? item.badge() : item.badge;
          const badge = badgeVal ? `<span class="nav-badge">${badgeVal}</span>` : '';
          return `<a href="${item.href}" class="nav-item${active}"><span class="nav-icon"><i class="fa-solid ${item.icon}"></i></span> ${item.label}${badge}</a>`;
        }).join('')}
      </div>`;
    }).join('');
  }

  function guardPage() {
    const role = getUserRole();
    const current = window.location.pathname.split('/').pop();
    for (const section of NAV) {
      for (const item of section.items) {
        if (item.href === current && item.roles && !item.roles.includes(role)) {
          window.showToast && showToast('Access denied for your role', 'danger');
          window.location.replace('dashboard.html');
          return;
        }
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (typeof HMSData === 'undefined') return;
    renderNav();
    guardPage();
  });
})();
