/**
 * Smart Waste Management - Resilient Client-Side Demo Mock Engine
 * Automatically engages when running on static hosts (like Vercel or GitHub Pages)
 * where a dedicated Node.js backend server is not connected.
 */
import { ApiResponse } from '../types/api.types';

const INITIAL_USERS = [
  {
    id: 'usr_admin_001',
    name: 'Director Arthur Vance',
    email: 'admin@smartwaste.gov',
    role: 'admin',
    phone: '+1 (555) 019-2834',
    address: 'City Hall, 100 Civic Center Plaza',
    city: 'EcoCity',
    isActive: true,
    createdAt: '2026-01-10T08:00:00.000Z',
  },
  {
    id: 'usr_staff_001',
    name: 'Marcus Chen',
    email: 'staff@smartwaste.gov',
    role: 'staff',
    phone: '+1 (555) 014-9821',
    address: 'Municipal Depot 4, Bay Area',
    city: 'EcoCity',
    isActive: true,
    createdAt: '2026-01-15T09:00:00.000Z',
  },
  {
    id: 'usr_citizen_001',
    name: 'Sophia Martinez',
    email: 'citizen@smartwaste.gov',
    role: 'citizen',
    phone: '+1 (555) 018-4491',
    address: '428 Elm Street, Apt 3B',
    city: 'EcoCity',
    isActive: true,
    createdAt: '2026-02-01T10:00:00.000Z',
  },
];

const INITIAL_COMPLAINTS = [
  {
    id: 'cmp_001',
    complaintId: 'CMP-2026-1001',
    citizenId: 'usr_citizen_001',
    citizenName: 'Sophia Martinez',
    category: 'Overflowing Bin',
    title: 'Overflowing Commercial Bin at Metro Station',
    description: 'The large public waste bin outside Metro Gate 2 has been overflowing since yesterday evening. Odor is spreading.',
    location: 'Metro Station Gate 2, Downtown Central',
    latitude: 40.7128,
    longitude: -74.006,
    priority: 'High',
    status: 'In Progress',
    assignedStaffId: 'usr_staff_001',
    assignedStaffName: 'Marcus Chen',
    createdAt: '2026-09-02T08:30:00.000Z',
    updatedAt: '2026-09-03T10:15:00.000Z',
  },
  {
    id: 'cmp_002',
    complaintId: 'CMP-2026-1002',
    citizenId: 'usr_citizen_001',
    citizenName: 'Sophia Martinez',
    category: 'Missed Collection',
    title: 'Residential Recycling Missed on Maplewood Avenue',
    description: 'Tuesday curbside recycling pickup was missed for households on the 400 block of Maplewood Avenue.',
    location: '400 Block Maplewood Ave, Metro North',
    latitude: 40.7282,
    longitude: -73.9942,
    priority: 'Medium',
    status: 'Assigned',
    assignedStaffId: 'usr_staff_001',
    assignedStaffName: 'Marcus Chen',
    createdAt: '2026-09-03T14:20:00.000Z',
    updatedAt: '2026-09-04T07:45:00.000Z',
  },
  {
    id: 'cmp_003',
    complaintId: 'CMP-2026-1003',
    citizenId: 'usr_citizen_001',
    citizenName: 'Sophia Martinez',
    category: 'Illegal Dumping',
    title: 'Construction Debris Dumped at Alley 9',
    description: 'Drywall, cinderblocks and broken timber dumped in the service alley behind the supermarket.',
    location: 'Alley 9, Green Valley Eco-District',
    latitude: 40.719,
    longitude: -74.012,
    priority: 'High',
    status: 'Resolved',
    assignedStaffId: 'usr_staff_001',
    assignedStaffName: 'Marcus Chen',
    createdAt: '2026-09-01T11:00:00.000Z',
    updatedAt: '2026-09-02T16:00:00.000Z',
  },
];

const INITIAL_PICKUPS = [
  {
    id: 'pck_001',
    requestId: 'PCK-2026-1001',
    citizenId: 'usr_citizen_001',
    citizenName: 'Sophia Martinez',
    wasteType: 'Electronic Waste',
    estimatedWasteQuantity: '2 CRT Monitors, 1 Desktop Tower',
    pickupAddress: '428 Elm Street, Apt 3B',
    preferredDate: '2026-09-15',
    preferredTime: 'Morning (08:00 - 11:00)',
    description: 'Decommissioned home office computer electronics for e-waste recycling.',
    status: 'Approved',
    assignedVehicle: 'TRK-103',
    assignedStaff: 'Marcus Chen',
    createdAt: '2026-09-03T09:15:00.000Z',
  },
  {
    id: 'pck_002',
    requestId: 'PCK-2026-1002',
    citizenId: 'usr_citizen_001',
    citizenName: 'Sophia Martinez',
    wasteType: 'Bulk Waste',
    estimatedWasteQuantity: '1 Old Three-Seater Sofa',
    pickupAddress: '428 Elm Street, Curbside',
    preferredDate: '2026-09-18',
    preferredTime: 'Afternoon (12:00 - 15:00)',
    description: 'Replaced living room furniture.',
    status: 'Completed',
    assignedVehicle: 'TRK-101',
    assignedStaff: 'Marcus Chen',
    createdAt: '2026-09-01T10:00:00.000Z',
  },
];

const INITIAL_SCHEDULES = [
  {
    id: 'sch_001',
    scheduleId: 'SCH-2026-1001',
    area: 'Downtown Central',
    zone: 'Downtown Central',
    collectionDate: '2026-09-08',
    startTime: '07:00 AM',
    endTime: '11:30 AM',
    wasteType: 'Organic Waste',
    vehicleId: 'TRK-101',
    vehicleNumber: 'TRK-101',
    staffId: 'usr_staff_001',
    staffName: 'Marcus Chen',
    status: 'Active',
  },
  {
    id: 'sch_002',
    scheduleId: 'SCH-2026-1002',
    area: 'Metro North Residential',
    zone: 'Metro North Residential',
    collectionDate: '2026-09-10',
    startTime: '08:00 AM',
    endTime: '01:00 PM',
    wasteType: 'Recyclable Waste',
    vehicleId: 'TRK-102',
    vehicleNumber: 'TRK-102',
    staffId: 'usr_staff_001',
    staffName: 'Marcus Chen',
    status: 'Scheduled',
  },
];

const INITIAL_VEHICLES = [
  {
    id: 'veh_001',
    vehicleNumber: 'TRK-101',
    vehicleType: 'Garbage Truck',
    capacity: '12 Tons',
    status: 'On Route',
    currentArea: 'Downtown Central',
    assignedDriver: 'Marcus Chen',
  },
  {
    id: 'veh_002',
    vehicleNumber: 'TRK-102',
    vehicleType: 'Recycling Vehicle',
    capacity: '8 Tons',
    status: 'Available',
    currentArea: 'Metro North',
    assignedDriver: 'David Kim',
  },
  {
    id: 'veh_003',
    vehicleNumber: 'TRK-103',
    vehicleType: 'Mini Truck',
    capacity: '3.5 Tons',
    status: 'Available',
    currentArea: 'Green Valley',
    assignedDriver: 'Elena Rostova',
  },
];

const INITIAL_STAFF = [
  {
    id: 'usr_staff_001',
    staffId: 'stf_001',
    name: 'Marcus Chen',
    email: 'staff@smartwaste.gov',
    phone: '+1 (555) 014-9821',
    employeeId: 'EMP-8941',
    role: 'Driver',
    assignedVehicle: 'TRK-101',
    assignedArea: 'Downtown Central',
    status: 'On Duty',
  },
  {
    id: 'usr_staff_002',
    staffId: 'stf_002',
    name: 'David Kim',
    email: 'david.kim@smartwaste.gov',
    phone: '+1 (555) 017-3829',
    employeeId: 'EMP-8942',
    role: 'Waste Collector',
    assignedVehicle: 'TRK-102',
    assignedArea: 'Metro North',
    status: 'Available',
  },
];

// Helper to load or initialize local storage collection
function getStore<T>(key: string, initial: T[]): T[] {
  try {
    const data = localStorage.getItem(`sw_demo_${key}`);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.warn(`[DemoEngine] Could not read ${key} from storage:`, e);
  }
  localStorage.setItem(`sw_demo_${key}`, JSON.stringify(initial));
  return initial;
}

function setStore<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(`sw_demo_${key}`, JSON.stringify(data));
  } catch (e) {
    console.warn(`[DemoEngine] Could not write ${key} to storage:`, e);
  }
}

export function handleDemoRequest<T>(endpoint: string, options: RequestInit = {}): ApiResponse<T> {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? (typeof options.body === 'string' ? JSON.parse(options.body) : options.body) : {};
  const token = localStorage.getItem('smartwaste_jwt_token');

  console.info(`[Vercel Demo Mode] Handling ${method} ${endpoint}`);

  // 1. Authentication
  if (endpoint.startsWith('/auth/login')) {
    const users = getStore('users', INITIAL_USERS);
    const user = users.find(u => u.email.toLowerCase() === (body.email || '').toLowerCase()) || {
      id: `usr_${Date.now()}`,
      name: body.email.split('@')[0],
      email: body.email,
      role: body.email.includes('admin') ? 'admin' : body.email.includes('staff') ? 'staff' : 'citizen',
      phone: '+1 (555) 019-0000',
      address: 'Demo Address, EcoCity',
      city: 'EcoCity',
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    const token = `demo_jwt_${user.role}_${Date.now()}`;
    return {
      success: true,
      message: 'Demo login successful.',
      data: {
        token,
        user,
      } as any,
    };
  }

  if (endpoint.startsWith('/auth/register')) {
    const users = getStore('users', INITIAL_USERS);
    const newUser = {
      id: `usr_${Date.now()}`,
      name: body.name || 'New Citizen',
      email: body.email,
      role: 'citizen',
      phone: body.phone || '+1 (555) 000-0000',
      address: body.address || 'Curbside Ave',
      city: body.city || 'EcoCity',
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    setStore('users', users);

    const token = `demo_jwt_citizen_${Date.now()}`;
    return {
      success: true,
      message: 'Demo registration successful.',
      data: { token, user: newUser } as any,
    };
  }

  if (endpoint.startsWith('/auth/profile')) {
    const saved = localStorage.getItem('smartwaste_user_data');
    const user = saved ? JSON.parse(saved) : INITIAL_USERS[0];
    return {
      success: true,
      message: 'Profile retrieved.',
      data: user as any,
    };
  }

  // 2. Complaints
  if (endpoint.startsWith('/complaints')) {
    const complaints = getStore('complaints', INITIAL_COMPLAINTS);

    if (method === 'POST') {
      const newCmp = {
        id: `cmp_${Date.now()}`,
        complaintId: `CMP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        citizenId: 'usr_citizen_001',
        citizenName: 'Sophia Martinez',
        category: body.category || 'Overflowing Bin',
        title: body.title || 'Untitled Complaint',
        description: body.description || '',
        location: body.location || 'Metro District',
        latitude: body.latitude || 40.7128,
        longitude: body.longitude || -74.006,
        priority: body.priority || 'Medium',
        status: 'Submitted',
        assignedStaffId: undefined as any,
        assignedStaffName: undefined as any,
        image: body.image || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      complaints.unshift(newCmp);
      setStore('complaints', complaints);
      return { success: true, message: 'Complaint filed successfully.', data: newCmp as any };
    }

    return {
      success: true,
      message: 'Complaints retrieved.',
      data: complaints as any,
    };
  }

  // 3. Pickups
  if (endpoint.startsWith('/pickups')) {
    const pickups = getStore('pickups', INITIAL_PICKUPS);

    if (method === 'POST') {
      const newPck = {
        id: `pck_${Date.now()}`,
        requestId: `PCK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        citizenId: 'usr_citizen_001',
        citizenName: 'Sophia Martinez',
        wasteType: body.wasteType || 'General Waste',
        estimatedWasteQuantity: body.estimatedWasteQuantity || 'Standard',
        pickupAddress: body.pickupAddress || 'Curbside',
        preferredDate: body.preferredDate || new Date().toISOString().split('T')[0],
        preferredTime: body.preferredTime || 'Morning',
        description: body.description || '',
        status: 'Pending',
        assignedVehicle: undefined as any,
        assignedStaff: undefined as any,
        createdAt: new Date().toISOString(),
      };
      pickups.unshift(newPck);
      setStore('pickups', pickups);
      return { success: true, message: 'Pickup request scheduled.', data: newPck as any };
    }

    return {
      success: true,
      message: 'Pickups retrieved.',
      data: pickups as any,
    };
  }

  // 4. Schedules
  if (endpoint.startsWith('/schedules')) {
    const schedules = getStore('schedules', INITIAL_SCHEDULES);
    if (method === 'POST') {
      const newSch = {
        id: `sch_${Date.now()}`,
        scheduleId: `SCH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        area: body.area || 'Downtown',
        zone: body.area || 'Downtown',
        collectionDate: body.collectionDate || new Date().toISOString().split('T')[0],
        startTime: body.startTime || '08:00 AM',
        endTime: body.endTime || '12:00 PM',
        wasteType: body.wasteType || 'Household Waste',
        vehicleId: body.assignedVehicle || 'TRK-101',
        vehicleNumber: body.assignedVehicle || 'TRK-101',
        staffId: 'usr_staff_001',
        staffName: body.assignedDriver || 'Marcus Chen',
        status: 'Scheduled',
      };
      schedules.unshift(newSch);
      setStore('schedules', schedules);
      return { success: true, message: 'Schedule created.', data: newSch as any };
    }
    return { success: true, message: 'Schedules retrieved.', data: schedules as any };
  }

  // 5. Vehicles
  if (endpoint.startsWith('/vehicles')) {
    const vehicles = getStore('vehicles', INITIAL_VEHICLES);
    return { success: true, message: 'Vehicles retrieved.', data: vehicles as any };
  }

  // 6. Staff
  if (endpoint.startsWith('/staff')) {
    const staff = getStore('staff', INITIAL_STAFF);
    return { success: true, message: 'Staff retrieved.', data: staff as any };
  }

  // 7. Users
  if (endpoint.startsWith('/users')) {
    const users = getStore('users', INITIAL_USERS);
    return { success: true, message: 'Users retrieved.', data: users as any };
  }

  // 8. Analytics & Dashboard Metrics
  if (endpoint.startsWith('/analytics')) {
    const complaints = getStore('complaints', INITIAL_COMPLAINTS);
    const pickups = getStore('pickups', INITIAL_PICKUPS);
    const vehicles = getStore('vehicles', INITIAL_VEHICLES);
    const staff = getStore('staff', INITIAL_STAFF);

    return {
      success: true,
      message: 'Analytics retrieved.',
      data: {
        metrics: {
          totalCitizens: 1248,
          totalComplaints: complaints.length,
          pendingComplaints: complaints.filter(c => c.status !== 'Resolved').length,
          resolvedComplaints: complaints.filter(c => c.status === 'Resolved').length,
          totalPickups: pickups.length,
          completedPickups: pickups.filter(p => p.status === 'Completed').length,
          activeVehicles: vehicles.filter(v => v.status === 'On Route').length,
          availableVehicles: vehicles.filter(v => v.status === 'Available').length,
          staffOnDuty: staff.filter(s => s.status === 'On Duty').length,
          serviceCompletionRate: 94.2,
        },
        complaintsByCategory: [
          { category: 'Missed Collection', count: 42 },
          { category: 'Overflowing Bin', count: 68 },
          { category: 'Illegal Dumping', count: 24 },
          { category: 'Damaged Bin', count: 18 },
          { category: 'Other', count: 11 },
        ],
        complaintsByStatus: [
          { status: 'Submitted', count: 23 },
          { status: 'Under Review', count: 19 },
          { status: 'Assigned', count: 35 },
          { status: 'In Progress', count: 29 },
          { status: 'Resolved', count: 57 },
        ],
        pickupsByWasteType: [
          { wasteType: 'Household Waste', count: 85 },
          { wasteType: 'Recyclable Waste', count: 142 },
          { wasteType: 'Electronic Waste', count: 38 },
          { wasteType: 'Bulk Waste', count: 49 },
          { wasteType: 'Garden Waste', count: 27 },
        ],
        weeklyPerformance: [
          { day: 'Mon', completed: 34, scheduled: 38 },
          { day: 'Tue', completed: 41, scheduled: 42 },
          { day: 'Wed', completed: 38, scheduled: 40 },
          { day: 'Thu', completed: 45, scheduled: 46 },
          { day: 'Fri', completed: 50, scheduled: 52 },
          { day: 'Sat', completed: 28, scheduled: 30 },
          { day: 'Sun', completed: 15, scheduled: 16 },
        ],
      } as any,
    };
  }

  // Generic fallback
  return {
    success: true,
    message: 'Operation completed in demo mode.',
    data: {} as any,
  };
}
