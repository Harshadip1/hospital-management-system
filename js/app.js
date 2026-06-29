/**
 * MediCore HMS — Page helpers & dynamic rendering
 */
(function (global) {
  function getUser() {
    try { return JSON.parse(sessionStorage.getItem('hms_user') || '{}'); }
    catch { return {}; }
  }

  function initHeader() {
    const user = getUser();
    if (!user.name) return;

    const enc = encodeURIComponent(user.name.replace(/Dr\.\s?/, ''));
    const avatar = `https://ui-avatars.com/api/?name=${enc}&background=2563eb&color=fff`;

    ['sidebarName', 'headerUserName'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = user.name;
    });
    ['sidebarRole', 'headerUserRole'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = user.role;
    });
    document.querySelectorAll('#sidebarAvatar, #headerAvatar, .header-avatar').forEach(img => {
      if (img) img.src = avatar;
    });

    const dateEl = document.getElementById('headerDate');
    if (dateEl) {
      dateEl.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    const greetEl = document.getElementById('greeting');
    if (greetEl) {
      const h = new Date().getHours();
      greetEl.textContent = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    }

    const welcomeEl = document.getElementById('welcomeName');
    if (welcomeEl) welcomeEl.textContent = 'Welcome back, ' + user.name;

    initDarkMode();
  }

  function isDarkMode() {
    return !!(HMSData.get('settings') || {}).darkMode;
  }

  function applyDarkMode(enabled) {
    const settings = HMSData.get('settings') || {};
    settings.darkMode = enabled;
    HMSData.set('settings', settings);
    document.body.classList.toggle('dark-mode', enabled);
    document.querySelectorAll('[data-dark-toggle]').forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) icon.className = enabled ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      btn.title = enabled ? 'Switch to light mode' : 'Switch to dark mode';
      btn.setAttribute('aria-pressed', String(enabled));
    });
    const settingsToggle = document.getElementById('darkToggle');
    if (settingsToggle) settingsToggle.checked = enabled;
  }

  function toggleDarkMode() {
    applyDarkMode(!isDarkMode());
    if (typeof showToast === 'function') {
      showToast(isDarkMode() ? 'Dark mode enabled' : 'Light mode restored');
    }
  }

  function initDarkMode() {
    if (typeof HMSData === 'undefined') return;
    applyDarkMode(isDarkMode());
  }

  function setupStatusFilter(selectEl, tableEl) {
    if (!selectEl || !tableEl) return;
    selectEl.addEventListener('change', () => {
      const val = selectEl.value.toLowerCase();
      tableEl.querySelectorAll('tbody tr').forEach(row => {
        if (val === 'all status' || val === 'all') { row.style.display = ''; return; }
        row.style.display = row.textContent.toLowerCase().includes(val) ? '' : 'none';
      });
    });
  }

  function setupDeleteRows(tableEl, collection, idField, onDelete) {
    if (!tableEl) return;
    tableEl.addEventListener('click', e => {
      const btn = e.target.closest('[data-delete-id]');
      if (!btn) return;
      const id = btn.dataset.deleteId;
      if (!confirm(btn.dataset.confirm || 'Delete this record?')) return;
      HMSData.remove(collection, id, idField);
      btn.closest('tr')?.remove();
      showToast('Record deleted successfully');
      if (onDelete) onDelete(id);
    });
  }

  function renderPatientProfile() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || 'P-00421';
    const p = HMSData.find('patients', id);
    if (!p) { showToast('Patient not found', 'danger'); return; }

    const name = HMSData.getPatientName(p);
    document.title = `MediCore HMS — ${name}`;
    document.querySelectorAll('[data-patient-name]').forEach(el => el.textContent = name);
    document.querySelectorAll('[data-patient-id]').forEach(el => el.textContent = p.id);
    document.querySelectorAll('[data-patient-field]').forEach(el => {
      const field = el.dataset.patientField;
      if (field === 'dob') el.textContent = HMSData.formatDate(p.dob) + ` (${HMSData.getAge(p.dob)} yrs)`;
      else if (field === 'billed') el.textContent = '$' + (p.billed / 1000).toFixed(1) + 'K';
      else el.textContent = p[field] || '—';
    });

    const img = document.querySelector('.profile-avatar-wrap img, [data-patient-avatar]');
    if (img) img.src = HMSData.avatarUrl(name);

    const statusBadge = document.querySelector('[data-patient-status]');
    if (statusBadge) {
      statusBadge.textContent = p.status;
      statusBadge.className = 'profile-tag ' + HMSData.badgeForStatus(p.status);
    }

    const deptTag = document.querySelector('[data-patient-dept]');
    if (deptTag) deptTag.innerHTML = `<i class="fa-solid fa-heart"></i> ${p.department}`;

    if (p.vitals) {
      const v = p.vitals;
      const map = { bp: v.bp, hr: v.hr, temp: v.temp, spo2: v.spo2 };
      Object.keys(map).forEach(k => {
        const el = document.querySelector(`[data-vital="${k}"]`);
        if (el) el.textContent = map[k];
      });
    }

    const conditionsEl = document.querySelector('[data-patient-conditions]');
    if (conditionsEl && p.conditions) {
      conditionsEl.innerHTML = p.conditions.map(c => `<span class="badge badge-warning">${c}</span>`).join('');
    }
    const allergiesEl = document.querySelector('[data-patient-allergies]');
    if (allergiesEl && p.allergies) {
      allergiesEl.innerHTML = (p.allergies.length ? p.allergies : ['None known'])
        .map(a => `<span class="badge ${a === 'None known' ? 'badge-gray' : 'badge-danger'}">${a}</span>`).join('');
    }

    const breadcrumb = document.querySelector('[data-breadcrumb-name]');
    if (breadcrumb) breadcrumb.textContent = name;

    const bookLink = document.querySelector('[data-book-appt]');
    if (bookLink) bookLink.href = `add-appointment.html?patient=${p.id}`;
  }

  function renderDoctorProfile() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || 'D-001';
    const d = HMSData.find('doctors', id);
    if (!d) { showToast('Doctor not found', 'danger'); return; }

    document.title = `MediCore HMS — ${d.name}`;
    document.querySelectorAll('[data-doctor-name]').forEach(el => el.textContent = d.name);
    document.querySelectorAll('[data-doctor-field]').forEach(el => {
      el.textContent = d[el.dataset.doctorField] || '—';
    });

    const img = document.querySelector('.profile-avatar-wrap img, [data-doctor-avatar]');
    if (img) img.src = HMSData.avatarUrl(d.name);

    const breadcrumb = document.querySelector('[data-breadcrumb-name]');
    if (breadcrumb) breadcrumb.textContent = d.name;
  }

  function renderDoctorsGrid() {
    const grid = document.getElementById('doctorsGrid');
    if (!grid) return;
    grid.innerHTML = HMSData.get('doctors').map(d => `<div class="doctor-card">
      <a href="doctor-profile.html?id=${d.id}"><img src="${HMSData.avatarUrl(d.name)}&size=200" alt=""/></a>
      <div class="name"><a href="doctor-profile.html?id=${d.id}" style="color:inherit;">${d.name}</a></div>
      <div class="specialty">${d.specialty}</div>
      <div class="rating">★★★★★ <span style="color:var(--gray-400);">${d.rating}</span></div>
      <div style="margin-top:8px;"><span class="badge ${HMSData.badgeForStatus(d.status)}" style="font-size:0.7rem;">${d.status}</span></div>
      <div class="stats">
        <div class="stat-item"><div class="val">${d.patients}</div><div class="lbl">Patients</div></div>
        <div class="stat-item"><div class="val">${d.experience}y</div><div class="lbl">Experience</div></div>
        <div class="stat-item"><div class="val">${d.rating}</div><div class="lbl">Rating</div></div>
      </div>
      <a href="doctor-profile.html?id=${d.id}" class="btn btn-outline w-full" style="justify-content:center;margin-top:14px;">View Profile</a>
    </div>`).join('');
  }

  function renderPatientsTable() {
    const tbody = document.getElementById('patientsTableBody');
    if (!tbody) return;

    const patients = HMSData.get('patients');
    tbody.innerHTML = patients.map(p => {
      const name = HMSData.getPatientName(p);
      return `<tr>
        <td><div class="table-avatar"><img src="${HMSData.avatarUrl(name)}" alt=""/><div><div class="name">${name}</div><div class="sub">${p.email}</div></div></div></td>
        <td><span class="badge badge-primary">${p.id}</span></td>
        <td>${HMSData.getAge(p.dob)} / ${p.gender}</td>
        <td>${p.doctor}</td>
        <td>${p.department}</td>
        <td><span class="badge ${HMSData.badgeForStatus(p.status)}">${p.status}</span></td>
        <td>${HMSData.formatDate(p.lastVisit)}</td>
        <td><div style="display:flex;gap:6px;">
          <a href="patient-profile.html?id=${p.id}" class="btn btn-ghost btn-sm btn-icon" title="View"><i class="fa-solid fa-eye"></i></a>
          <button class="btn btn-danger btn-sm btn-icon" data-delete-id="${p.id}" data-confirm="Delete this patient?" title="Delete"><i class="fa-solid fa-trash"></i></button>
        </div></td>
      </tr>`;
    }).join('');

    const total = document.getElementById('patientCount');
    if (total) total.textContent = patients.length + ' records';

    setupDeleteRows(tbody.closest('table'), 'patients');
  }

  function handleAddPatientForm(form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(form);
      const id = HMSData.nextId('P-', 'patients');
      const patient = {
        id,
        firstName: fd.get('firstName'),
        lastName: fd.get('lastName'),
        email: fd.get('email'),
        phone: fd.get('phone'),
        dob: fd.get('dob'),
        gender: fd.get('gender'),
        address: fd.get('address') || '',
        bloodGroup: 'O+',
        doctor: fd.get('doctor'),
        department: fd.get('department'),
        status: 'Active',
        lastVisit: new Date().toISOString().slice(0, 10),
        visits: 0, admissions: 0, billed: 0,
        conditions: [], allergies: [],
        vitals: { bp: '—', hr: '—', temp: '—', spo2: '—' }
      };
      HMSData.add('patients', patient);
      form.closest('.modal-overlay')?.classList.remove('active');
      form.reset();
      showToast('Patient added successfully!');
      renderPatientsTable();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (typeof HMSData === 'undefined') return;
    initHeader();

    if (document.body.dataset.page === 'patient-profile') renderPatientProfile();
    if (document.body.dataset.page === 'doctor-profile') renderDoctorProfile();
    if (document.body.dataset.page === 'doctors') renderDoctorsGrid();
    if (document.body.dataset.page === 'patients') {
      renderPatientsTable();
      const form = document.getElementById('addPatientForm');
      if (form) handleAddPatientForm(form);
      setupStatusFilter(document.getElementById('statusFilter'), document.querySelector('table'));
    }
  });

  global.HMSApp = { initHeader, initDarkMode, applyDarkMode, toggleDarkMode, isDarkMode, renderPatientProfile, renderDoctorProfile, renderPatientsTable, setupStatusFilter, setupDeleteRows };
  global.toggleDarkMode = toggleDarkMode;
})(window);
