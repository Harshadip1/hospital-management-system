/**
 * MediCore HMS — Client-side data layer (localStorage)
 */
(function (global) {
  const STORAGE_KEY = 'hms_data_v1';

  const SEED = {
    patients: [
      { id: 'P-00421', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.j@email.com', phone: '+1 (555) 234-5678', dob: '1992-03-15', gender: 'Female', address: '456 Oak Ave, Chicago, IL', bloodGroup: 'A+', doctor: 'Dr. Mike Chen', department: 'Cardiology', status: 'Stable', lastVisit: '2026-06-29', visits: 12, admissions: 3, billed: 4200, conditions: ['Hypertension', 'Hyperlipidemia'], allergies: ['Penicillin', 'Sulfa drugs'], vitals: { bp: '120/80', hr: '98 bpm', temp: '98.6°F', spo2: '99%' } },
      { id: 'P-00420', firstName: 'James', lastName: 'Brown', email: 'james.b@email.com', phone: '+1 (555) 345-6789', dob: '1979-08-22', gender: 'Male', address: '789 Pine St, Boston, MA', bloodGroup: 'O+', doctor: 'Dr. Lisa Park', department: 'Neurology', status: 'In Treatment', lastVisit: '2026-06-28', visits: 8, admissions: 2, billed: 3100, conditions: ['Migraine'], allergies: [], vitals: { bp: '130/85', hr: '72 bpm', temp: '98.4°F', spo2: '97%' } },
      { id: 'P-00419', firstName: 'Emily', lastName: 'Davis', email: 'emily.d@email.com', phone: '+1 (555) 456-7890', dob: '1998-01-10', gender: 'Female', address: '321 Elm Rd, Austin, TX', bloodGroup: 'B+', doctor: 'Dr. Tom Wilson', department: 'Orthopedics', status: 'Discharged', lastVisit: '2026-06-27', visits: 5, admissions: 1, billed: 1800, conditions: ['ACL Tear'], allergies: ['Latex'], vitals: { bp: '118/76', hr: '68 bpm', temp: '98.2°F', spo2: '99%' } },
      { id: 'P-00418', firstName: 'David', lastName: 'Kim', email: 'david.k@email.com', phone: '+1 (555) 567-8901', dob: '1971-11-05', gender: 'Male', address: '654 Maple Dr, Seattle, WA', bloodGroup: 'AB-', doctor: 'Dr. Anna White', department: 'Cardiology', status: 'Critical', lastVisit: '2026-06-29', visits: 15, admissions: 4, billed: 8900, conditions: ['Heart Failure', 'Diabetes'], allergies: ['Aspirin'], vitals: { bp: '145/95', hr: '110 bpm', temp: '99.1°F', spo2: '92%' } },
      { id: 'P-00417', firstName: 'Maria', lastName: 'Garcia', email: 'maria.g@email.com', phone: '+1 (555) 678-9012', dob: '1985-06-18', gender: 'Female', address: '987 Cedar Ln, Miami, FL', bloodGroup: 'A-', doctor: 'Dr. John Smith', department: 'Dermatology', status: 'Stable', lastVisit: '2026-06-26', visits: 6, admissions: 0, billed: 950, conditions: ['Eczema'], allergies: [], vitals: { bp: '115/75', hr: '70 bpm', temp: '98.5°F', spo2: '98%' } },
      { id: 'P-00416', firstName: 'Robert', lastName: 'Lee', email: 'robert.l@email.com', phone: '+1 (555) 789-0123', dob: '1964-02-28', gender: 'Male', address: '147 Birch Ct, Denver, CO', bloodGroup: 'O-', doctor: 'Dr. Mike Chen', department: 'Cardiology', status: 'Admitted', lastVisit: '2026-06-25', visits: 20, admissions: 5, billed: 12500, conditions: ['Coronary Artery Disease'], allergies: ['Shellfish'], vitals: { bp: '138/88', hr: '82 bpm', temp: '98.7°F', spo2: '96%' } }
    ],
    doctors: [
      { id: 'D-001', name: 'Dr. Mike Chen', specialty: 'Cardiology', department: 'Cardiology', email: 'mike.chen@medicore.com', phone: '+1 (555) 111-0001', experience: 15, patients: 342, rating: 4.9, status: 'Available', schedule: 'Mon–Fri 9AM–5PM' },
      { id: 'D-002', name: 'Dr. Lisa Park', specialty: 'Neurology', department: 'Neurology', email: 'lisa.park@medicore.com', phone: '+1 (555) 111-0002', experience: 12, patients: 278, rating: 4.8, status: 'In Surgery', schedule: 'Mon–Thu 8AM–4PM' },
      { id: 'D-003', name: 'Dr. Tom Wilson', specialty: 'Orthopedics', department: 'Orthopedics', email: 'tom.wilson@medicore.com', phone: '+1 (555) 111-0003', experience: 18, patients: 410, rating: 4.7, status: 'Available', schedule: 'Tue–Sat 10AM–6PM' },
      { id: 'D-004', name: 'Dr. Anna White', specialty: 'Pediatrics', department: 'Pediatrics', email: 'anna.white@medicore.com', phone: '+1 (555) 111-0004', experience: 10, patients: 520, rating: 4.9, status: 'Available', schedule: 'Mon–Fri 8AM–3PM' },
      { id: 'D-005', name: 'Dr. John Smith', specialty: 'Dermatology', department: 'Dermatology', email: 'john.smith@medicore.com', phone: '+1 (555) 111-0005', experience: 8, patients: 195, rating: 4.6, status: 'On Leave', schedule: 'Wed–Fri 9AM–2PM' },
      { id: 'D-006', name: 'Dr. Sarah Miller', specialty: 'Oncology', department: 'Oncology', email: 'sarah.miller@medicore.com', phone: '+1 (555) 111-0006', experience: 14, patients: 156, rating: 4.8, status: 'Available', schedule: 'Mon–Wed 9AM–5PM' }
    ],
    appointments: [
      { id: 'A-1001', patientId: 'P-00421', patient: 'Sarah Johnson', doctor: 'Dr. Mike Chen', department: 'Cardiology', date: '2026-06-29', time: '09:00', type: 'Checkup', status: 'Confirmed' },
      { id: 'A-1002', patientId: 'P-00420', patient: 'James Brown', doctor: 'Dr. Lisa Park', department: 'Neurology', date: '2026-06-29', time: '10:30', type: 'Consultation', status: 'Pending' },
      { id: 'A-1003', patientId: 'P-00419', patient: 'Emily Davis', doctor: 'Dr. Tom Wilson', department: 'Orthopedics', date: '2026-06-29', time: '11:15', type: 'Follow-up', status: 'Confirmed' },
      { id: 'A-1004', patientId: 'P-00417', patient: 'Maria Garcia', doctor: 'Dr. Anna White', department: 'Pediatrics', date: '2026-06-29', time: '14:00', type: 'Checkup', status: 'Checked In' },
      { id: 'A-1005', patientId: 'P-00418', patient: 'David Kim', doctor: 'Dr. John Smith', department: 'Dermatology', date: '2026-06-29', time: '15:45', type: 'Consultation', status: 'Cancelled' }
    ],
    admissions: [
      { id: 'ADM-001', patientId: 'P-00416', patient: 'Robert Lee', ward: 'Cardiology Ward', room: 'C-204', bed: 'B2', admittedOn: '2026-06-25', doctor: 'Dr. Mike Chen', diagnosis: 'Coronary Artery Disease', status: 'Admitted' },
      { id: 'ADM-002', patientId: 'P-00418', patient: 'David Kim', ward: 'ICU', room: 'ICU-12', bed: 'A1', admittedOn: '2026-06-29', doctor: 'Dr. Anna White', diagnosis: 'Acute Heart Failure', status: 'Critical' }
    ],
    opdQueue: [
      { id: 'Q-001', token: 101, patient: 'Sarah Johnson', patientId: 'P-00421', department: 'Cardiology', doctor: 'Dr. Mike Chen', status: 'In Consultation', waitTime: '5 min' },
      { id: 'Q-002', token: 102, patient: 'James Brown', patientId: 'P-00420', department: 'Neurology', doctor: 'Dr. Lisa Park', status: 'Waiting', waitTime: '18 min' },
      { id: 'Q-003', token: 103, patient: 'Emily Davis', patientId: 'P-00419', department: 'Orthopedics', doctor: 'Dr. Tom Wilson', status: 'Waiting', waitTime: '25 min' },
      { id: 'Q-004', token: 104, patient: 'Maria Garcia', patientId: 'P-00417', department: 'Dermatology', doctor: 'Dr. John Smith', status: 'Completed', waitTime: '—' }
    ],
    nursingNotes: [
      { id: 'N-001', patientId: 'P-00418', patient: 'David Kim', nurse: 'Nurse Emily', time: '2026-06-29 08:00', vitals: 'BP 145/95, HR 110', notes: 'Patient restless, oxygen administered.', type: 'Vitals' },
      { id: 'N-002', patientId: 'P-00416', patient: 'Robert Lee', nurse: 'Nurse James', time: '2026-06-29 07:30', vitals: 'BP 138/88, HR 82', notes: 'Medication administered as scheduled.', type: 'Medication' }
    ],
    radiologyOrders: [
      { id: 'RAD-001', patient: 'Sarah Johnson', patientId: 'P-00421', test: 'Chest X-Ray', orderedBy: 'Dr. Mike Chen', date: '2026-06-29', status: 'Completed', priority: 'Routine' },
      { id: 'RAD-002', patient: 'David Kim', patientId: 'P-00418', test: 'CT Angiography', orderedBy: 'Dr. Anna White', date: '2026-06-29', status: 'In Progress', priority: 'Urgent' },
      { id: 'RAD-003', patient: 'James Brown', patientId: 'P-00420', test: 'MRI Brain', orderedBy: 'Dr. Lisa Park', date: '2026-06-28', status: 'Scheduled', priority: 'Routine' }
    ],
    inventory: [
      { id: 'INV-001', name: 'Surgical Gloves (Box)', category: 'Consumables', quantity: 450, unit: 'boxes', reorderLevel: 100, status: 'In Stock' },
      { id: 'INV-002', name: 'IV Saline 500ml', category: 'Fluids', quantity: 85, unit: 'units', reorderLevel: 50, status: 'In Stock' },
      { id: 'INV-003', name: 'N95 Masks', category: 'PPE', quantity: 32, unit: 'boxes', reorderLevel: 40, status: 'Low Stock' },
      { id: 'INV-004', name: 'Defibrillator Pads', category: 'Equipment', quantity: 8, unit: 'sets', reorderLevel: 10, status: 'Low Stock' },
      { id: 'INV-005', name: 'Syringes 5ml', category: 'Consumables', quantity: 1200, unit: 'units', reorderLevel: 200, status: 'In Stock' }
    ],
    users: [
      { id: 'U-001', name: 'Dr. Admin', email: 'admin@medicore.com', role: 'Administrator', department: 'Administration', status: 'Active', lastLogin: '2026-06-29' },
      { id: 'U-002', name: 'Dr. Mike Chen', email: 'doctor@medicore.com', role: 'Doctor', department: 'Cardiology', status: 'Active', lastLogin: '2026-06-29' },
      { id: 'U-003', name: 'Nurse Emily', email: 'nurse@medicore.com', role: 'Nurse', department: 'ICU', status: 'Active', lastLogin: '2026-06-28' },
      { id: 'U-004', name: 'John Staff', email: 'staff@medicore.com', role: 'Staff', department: 'Reception', status: 'Active', lastLogin: '2026-06-27' }
    ],
    settings: { hospitalName: 'MediCore General Hospital', darkMode: false }
  };

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* reset on corrupt data */ }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
    return JSON.parse(JSON.stringify(SEED));
  }

  function save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    return load();
  }

  const HMSData = {
    getAll() { return load(); },
    get(key) { return load()[key]; },
    set(key, value) {
      const data = load();
      data[key] = value;
      save(data);
      return value;
    },
    add(key, item) {
      const data = load();
      if (!data[key]) data[key] = [];
      data[key].push(item);
      save(data);
      return item;
    },
    update(key, id, updates, idField = 'id') {
      const data = load();
      const idx = (data[key] || []).findIndex(i => i[idField] === id);
      if (idx === -1) return null;
      data[key][idx] = { ...data[key][idx], ...updates };
      save(data);
      return data[key][idx];
    },
    remove(key, id, idField = 'id') {
      const data = load();
      data[key] = (data[key] || []).filter(i => i[idField] !== id);
      save(data);
    },
    find(key, id, idField = 'id') {
      return (load()[key] || []).find(i => i[idField] === id) || null;
    },
    nextId(prefix, key) {
      const items = load()[key] || [];
      const nums = items.map(i => parseInt(String(i.id).replace(/\D/g, ''), 10)).filter(n => !isNaN(n));
      const next = (nums.length ? Math.max(...nums) : 0) + 1;
      return `${prefix}${String(next).padStart(3, '0')}`;
    },
    getPatientName(p) { return `${p.firstName} ${p.lastName}`; },
    getAge(dob) {
      const b = new Date(dob);
      const t = new Date();
      let age = t.getFullYear() - b.getFullYear();
      if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) age--;
      return age;
    },
    formatDate(d) {
      if (!d) return '—';
      return new Date(d + (d.includes('T') ? '' : 'T00:00:00')).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },
    badgeForStatus(status) {
      const map = {
        Stable: 'badge-success', Active: 'badge-success', Confirmed: 'badge-success', Completed: 'badge-success',
        'In Stock': 'badge-success', Available: 'badge-success', Discharged: 'badge-gray', Admitted: 'badge-warning',
        'In Treatment': 'badge-warning', Pending: 'badge-warning', 'Checked In': 'badge-gray', 'Low Stock': 'badge-warning',
        Critical: 'badge-danger', Cancelled: 'badge-danger', Urgent: 'badge-danger', 'On Leave': 'badge-gray',
        'In Surgery': 'badge-warning', 'In Progress': 'badge-info', Scheduled: 'badge-primary', Waiting: 'badge-warning', 'In Consultation': 'badge-info'
      };
      return map[status] || 'badge-primary';
    },
    avatarUrl(name) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name.replace(/Dr\.\s?/, ''))}&background=2563eb&color=fff`;
    },
    reset
  };

  global.HMSData = HMSData;
})(window);
