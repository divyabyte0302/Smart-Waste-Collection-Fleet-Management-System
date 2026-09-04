/**
 * Smart Waste Collection Management System - Modular Database Persistence Layer
 * Implements PostgreSQL connection pool with automated zero-setup fallback.
 */
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const env = require('./env');
const { ROLES, USER_STATUS } = require('./constants');

let pgPool = null;
let isPgConnected = false;

// Initialize PostgreSQL Pool if configured
try {
  pgPool = new Pool({
    connectionString: env.DATABASE_URL,
    ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 2000
  });

  pgPool.connect()
    .then(client => {
      console.log('[Database] Successfully connected to PostgreSQL Database.');
      isPgConnected = true;
      client.release();
    })
    .catch(err => {
      console.log('[Database] PostgreSQL service not detected locally (' + err.message + '). Operating in resilient zero-setup relational fallback mode.');
      isPgConnected = false;
    });
} catch (e) {
  isPgConnected = false;
}

// Resilient Relational Store Path
const dataDir = path.resolve(__dirname, '../database/.data');
const dataFilePath = path.join(dataDir, 'smartwaste.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let store = {
  users: [],
  schedules: [],
  complaints: []
};

// Seed default users if empty
function initializeSeedData() {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync('password123', salt);

  const initialUsers = [
    {
      id: 'usr_admin_001',
      name: 'Director Arthur Vance',
      email: 'admin@smartwaste.gov',
      phone: '+1 (555) 019-2831',
      password: hashedPassword,
      role: ROLES.ADMINISTRATOR,
      address: 'City Hall, Suite 400',
      city: 'Metro City',
      status: USER_STATUS.ACTIVE,
      createdAt: '2026-08-01T08:00:00.000Z',
      updatedAt: '2026-09-01T08:00:00.000Z'
    },
    {
      id: 'usr_staff_001',
      name: 'Marcus Chen',
      email: 'staff@smartwaste.gov',
      phone: '+1 (555) 018-9921',
      password: hashedPassword,
      role: ROLES.COLLECTION_STAFF,
      address: '14 Oakridge Way, Westside',
      city: 'Metro City',
      status: USER_STATUS.ACTIVE,
      createdAt: '2026-08-10T08:00:00.000Z',
      updatedAt: '2026-09-01T08:00:00.000Z'
    },
    {
      id: 'usr_citizen_001',
      name: 'Sophia Martinez',
      email: 'citizen@smartwaste.gov',
      phone: '+1 (555) 234-5678',
      password: hashedPassword,
      role: ROLES.CITIZEN,
      address: '742 Evergreen Terrace',
      city: 'Metro City',
      status: USER_STATUS.ACTIVE,
      createdAt: '2026-08-15T08:00:00.000Z',
      updatedAt: '2026-09-01T08:00:00.000Z'
    }
  ];

  const initialSchedules = [
    {
      id: 'sch_001',
      zone: 'Downtown Central',
      collectionType: 'Organic Waste',
      dayOfWeek: 'Monday',
      timeSlot: '07:00 AM - 11:30 AM',
      assignedStaffId: 'usr_staff_001',
      assignedStaffName: 'Marcus Chen',
      vehicleNumber: 'TRK-101 (Compactor)',
      status: 'Collected',
      checkpoints: ['Broadway Market', 'Civic Center Plaza', 'Financial Towers'],
      createdAt: '2026-09-01T06:00:00.000Z',
      updatedAt: '2026-09-01T11:45:00.000Z'
    },
    {
      id: 'sch_002',
      zone: 'Metro North Residential',
      collectionType: 'Recyclable Materials',
      dayOfWeek: 'Wednesday',
      timeSlot: '08:00 AM - 01:00 PM',
      assignedStaffId: 'usr_staff_001',
      assignedStaffName: 'Marcus Chen',
      vehicleNumber: 'TRK-102 (Recycler)',
      status: 'In Progress',
      checkpoints: ['Maplewood Avenue', 'North Park School', 'Highland Ridge'],
      createdAt: '2026-09-02T06:00:00.000Z',
      updatedAt: '2026-09-04T08:30:00.000Z'
    },
    {
      id: 'sch_003',
      zone: 'Green Valley Eco-District',
      collectionType: 'Electronic & Bulky Waste',
      dayOfWeek: 'Friday',
      timeSlot: '09:00 AM - 02:00 PM',
      assignedStaffId: 'usr_staff_001',
      assignedStaffName: 'Marcus Chen',
      vehicleNumber: 'TRK-103 (Electric Mini)',
      status: 'Pending',
      checkpoints: ['Pine Grove Village', 'Eco Hub Community Center'],
      createdAt: '2026-09-03T06:00:00.000Z',
      updatedAt: '2026-09-03T06:00:00.000Z'
    }
  ];

  store = {
    users: initialUsers,
    schedules: initialSchedules,
    complaints: []
  };

  fs.writeFileSync(dataFilePath, JSON.stringify(store, null, 2), 'utf8');
}

// Load or Seed
try {
  if (fs.existsSync(dataFilePath)) {
    const raw = fs.readFileSync(dataFilePath, 'utf8');
    if (raw.trim()) {
      store = JSON.parse(raw);
    } else {
      initializeSeedData();
    }
  } else {
    initializeSeedData();
  }
} catch (e) {
  initializeSeedData();
}

function persistStore() {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.error('Database write error:', err);
  }
}

const db = {
  isPostgres: () => isPgConnected,

  async query(text, params) {
    if (isPgConnected && pgPool) {
      return pgPool.query(text, params);
    }
    throw new Error('Direct SQL queries fallback handled by ORM methods.');
  },

  // Generic ORM Helpers
  async find(table, predicate) {
    const items = store[table] || [];
    if (!predicate) return [...items];
    if (typeof predicate === 'function') {
      return items.filter(predicate);
    }
    return items.filter(item => {
      return Object.entries(predicate).every(([k, v]) => item[k] === v);
    });
  },

  async findOne(table, predicate) {
    const results = await db.find(table, predicate);
    return results.length > 0 ? { ...results[0] } : null;
  },

  async findById(table, id) {
    const items = store[table] || [];
    const item = items.find(i => String(i.id) === String(id));
    return item ? { ...item } : null;
  },

  async insert(table, record) {
    if (!store[table]) store[table] = [];
    const now = new Date().toISOString();
    const newRecord = {
      id: record.id || `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: record.createdAt || now,
      updatedAt: now,
      ...record
    };
    store[table].push(newRecord);
    persistStore();
    return { ...newRecord };
  },

  async update(table, id, updates) {
    if (!store[table]) return null;
    const index = store[table].findIndex(i => String(i.id) === String(id));
    if (index === -1) return null;

    store[table][index] = {
      ...store[table][index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    persistStore();
    return { ...store[table][index] };
  },

  async delete(table, id) {
    if (!store[table]) return false;
    const len = store[table].length;
    store[table] = store[table].filter(i => String(i.id) !== String(id));
    const deleted = store[table].length < len;
    if (deleted) persistStore();
    return deleted;
  }
};

module.exports = db;
