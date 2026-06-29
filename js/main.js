// ===== AUTH GUARD =====
// Pages that don't need auth (login page handles itself)
(function() {
  const publicPages = ['login.html'];
  const currentPage = window.location.pathname.split('/').pop();
  if (publicPages.includes(currentPage)) return;

  const user = sessionStorage.getItem('hms_user');
  if (!user) {
    window.location.replace('login.html');
    return;
  }

  // Inject user info into sidebar dynamically
  const userData = JSON.parse(user);
  const nameEl = document.getElementById('sidebarName');
  const roleEl = document.getElementById('sidebarRole');
  const avatarEl = document.getElementById('sidebarAvatar');
  if (nameEl) nameEl.textContent = userData.name;
  if (roleEl) roleEl.textContent = userData.role;
  if (avatarEl) {
    const enc = encodeURIComponent(userData.name.replace(/Dr\.\s?/,''));
    avatarEl.src = `https://ui-avatars.com/api/?name=${enc}&background=2563eb&color=fff`;
  }
})();

// ===== LOGOUT =====
window.logout = function() {
  sessionStorage.removeItem('hms_user');
  window.location.replace('login.html');
};

// ===== SIDEBAR TOGGLE =====
const sidebar = document.querySelector('.sidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const overlay = document.createElement('div');
overlay.className = 'sidebar-overlay';
overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:99;display:none;';
document.body.appendChild(overlay);

if (sidebarToggle) {
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
  });
}
overlay.addEventListener('click', () => {
  sidebar.classList.remove('open');
  overlay.style.display = 'none';
});

// ===== ACTIVE NAV ITEM =====
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
  const href = item.getAttribute('href');
  if (href && window.location.pathname.includes(href.replace('../', '').replace('.html', ''))) {
    item.classList.add('active');
  }
  item.addEventListener('click', () => {
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');
  });
});

// ===== TABS =====
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    const parent = btn.closest('.tabs-container') || document;
    parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const content = document.getElementById(target);
    if (content) content.classList.add('active');
  });
});

// ===== MODALS =====
document.querySelectorAll('[data-modal]').forEach(btn => {
  btn.addEventListener('click', () => {
    const modal = document.getElementById(btn.dataset.modal);
    if (modal) modal.classList.add('active');
  });
});
// Close when clicking the overlay background (not the modal itself)
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
    }
  });
});
// Close buttons (.modal-close) — stop propagation so overlay listener doesn't fire
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const overlay = btn.closest('.modal-overlay');
    if (overlay) overlay.classList.remove('active');
  });
});
// ESC key closes modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
  }
});

// ===== ANIMATE STATS =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target || el.textContent.replace(/[^0-9]/g, ''));
  const suffix = el.textContent.replace(/[0-9,]/g, '');
  let current = 0;
  const step = Math.ceil(target / 60);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString() + suffix;
    if (current >= target) clearInterval(timer);
  }, 20);
}
document.querySelectorAll('.stat-value').forEach(el => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { animateCounter(el); observer.disconnect(); } });
  });
  observer.observe(el);
});

// ===== PROGRESS BARS =====
document.querySelectorAll('.progress-bar[data-width]').forEach(bar => {
  setTimeout(() => { bar.style.width = bar.dataset.width; }, 300);
});

// ===== CHART BARS =====
document.querySelectorAll('.chart-bar[data-height]').forEach(bar => {
  setTimeout(() => { bar.style.height = bar.dataset.height; }, 200);
});

// ===== TOAST NOTIFICATIONS =====
window.showToast = function(msg, type = 'success') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed;bottom:24px;right:24px;z-index:9999;
    background:${type === 'success' ? '#10b981' : type === 'danger' ? '#ef4444' : '#2563eb'};
    color:white;padding:12px 20px;border-radius:10px;
    font-size:0.875rem;font-weight:600;
    box-shadow:0 8px 24px rgba(0,0,0,0.2);
    transform:translateY(20px);opacity:0;transition:all 0.3s ease;
    display:flex;align-items:center;gap:8px;max-width:320px;
  `;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : type === 'danger' ? '✕' : 'ℹ'}</span> ${msg}`;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.transform = 'translateY(0)'; toast.style.opacity = '1'; }, 10);
  setTimeout(() => {
    toast.style.transform = 'translateY(20px)'; toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// ===== SEARCH FILTER TABLE =====
const tableSearch = document.getElementById('tableSearch');
if (tableSearch) {
  tableSearch.addEventListener('input', () => {
    const val = tableSearch.value.toLowerCase();
    document.querySelectorAll('tbody tr').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(val) ? '' : 'none';
    });
  });
}

// ===== GLOBAL HEADER SEARCH =====
const globalSearch = document.querySelector('.header-search input:not(#tableSearch)');
if (globalSearch) {
  globalSearch.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const q = globalSearch.value.trim().toLowerCase();
    if (!q) return;
    if (typeof HMSData === 'undefined') { showToast('Search: ' + q, 'info'); return; }
    const patient = HMSData.get('patients').find(p =>
      HMSData.getPatientName(p).toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
    if (patient) { window.location.href = 'patient-profile.html?id=' + patient.id; return; }
    const doctor = HMSData.get('doctors').find(d => d.name.toLowerCase().includes(q));
    if (doctor) { window.location.href = 'doctor-profile.html?id=' + doctor.id; return; }
    showToast('No patients or doctors found for "' + q + '"', 'info');
  });
}

// ===== RE-BIND NAV AFTER nav.js RENDERS =====
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');
      });
    });
  }, 50);
});

// ===== CONFIRM DELETE =====
document.querySelectorAll('[data-confirm]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    if (!confirm(btn.dataset.confirm || 'Are you sure?')) e.preventDefault();
  });
});

// ===== DROPDOWN =====
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const dropdown = toggle.nextElementSibling;
    document.querySelectorAll('.dropdown-menu.show').forEach(d => { if (d !== dropdown) d.classList.remove('show'); });
    dropdown && dropdown.classList.toggle('show');
  });
});
document.addEventListener('click', () => {
  document.querySelectorAll('.dropdown-menu.show').forEach(d => d.classList.remove('show'));
});
