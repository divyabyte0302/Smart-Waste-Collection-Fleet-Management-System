-- Smart Waste Collection Management System - Production Database Schema
-- Compatible with PostgreSQL (AWS RDS / Aurora), SQLite, and MySQL

-- 1. Users Table (Citizens, Admins, Drivers, Supervisors)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'CITIZEN', -- 'CITIZEN', 'ADMIN', 'DRIVER'
    phone VARCHAR(32),
    address TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Municipal Zones / Sectors Table
CREATE TABLE IF NOT EXISTS zones (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(32) UNIQUE NOT NULL,
    description TEXT,
    population INT DEFAULT 0,
    area_sq_km DECIMAL(6,2) DEFAULT 0.00,
    color_hex VARCHAR(16) DEFAULT '#10b981',
    center_lat DECIMAL(10,6),
    center_lng DECIMAL(10,6),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Waste Collection Vehicles Fleet Table
CREATE TABLE IF NOT EXISTS vehicles (
    id VARCHAR(64) PRIMARY KEY,
    vehicle_number VARCHAR(64) UNIQUE NOT NULL,
    model VARCHAR(100) NOT NULL,
    type VARCHAR(64) NOT NULL,
    capacity_tons DECIMAL(5,2) NOT NULL,
    current_load_tons DECIMAL(5,2) DEFAULT 0.00,
    fuel_percentage INT DEFAULT 100,
    status VARCHAR(32) NOT NULL DEFAULT 'AVAILABLE', -- 'AVAILABLE', 'ON_ROUTE', 'MAINTENANCE', 'STANDBY'
    driver_id VARCHAR(64) REFERENCES users(id),
    driver_name VARCHAR(150),
    assigned_zone_id VARCHAR(64) REFERENCES zones(id),
    current_lat DECIMAL(10,6),
    current_lng DECIMAL(10,6),
    last_maintenance_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Collection Schedules & Routes Table
CREATE TABLE IF NOT EXISTS schedules (
    id VARCHAR(64) PRIMARY KEY,
    zone_id VARCHAR(64) NOT NULL REFERENCES zones(id),
    zone_name VARCHAR(150),
    vehicle_id VARCHAR(64) REFERENCES vehicles(id),
    vehicle_number VARCHAR(64),
    collection_type VARCHAR(64) NOT NULL, -- 'Organic', 'Recyclables', 'General'
    day_of_week VARCHAR(32) NOT NULL,
    start_time VARCHAR(16) NOT NULL,
    end_time VARCHAR(16) NOT NULL,
    frequency VARCHAR(32) DEFAULT 'Weekly',
    status VARCHAR(32) DEFAULT 'ACTIVE',
    route_checkpoints TEXT, -- JSON array of checkpoints/stops
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Citizen Waste Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
    id VARCHAR(64) PRIMARY KEY,
    ticket_number VARCHAR(64) UNIQUE NOT NULL,
    citizen_name VARCHAR(150) NOT NULL,
    citizen_email VARCHAR(150),
    citizen_phone VARCHAR(32) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(32) DEFAULT 'MEDIUM',
    zone_id VARCHAR(64) REFERENCES zones(id),
    zone_name VARCHAR(150),
    address TEXT NOT NULL,
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    photo_url TEXT,
    status VARCHAR(32) DEFAULT 'REPORTED', -- 'REPORTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'
    assigned_vehicle_id VARCHAR(64) REFERENCES vehicles(id),
    assigned_driver_name VARCHAR(150),
    resolution_notes TEXT,
    resolution_photo_url TEXT,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Special On-Demand Pickup Requests Table
CREATE TABLE IF NOT EXISTS pickup_requests (
    id VARCHAR(64) PRIMARY KEY,
    request_number VARCHAR(64) UNIQUE NOT NULL,
    citizen_name VARCHAR(150) NOT NULL,
    citizen_email VARCHAR(150),
    citizen_phone VARCHAR(32) NOT NULL,
    waste_type VARCHAR(100) NOT NULL,
    estimated_volume VARCHAR(64), -- e.g. '1-2 items', 'Small Truckload', '5 Bags'
    address TEXT NOT NULL,
    zone_id VARCHAR(64) REFERENCES zones(id),
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    preferred_date DATE NOT NULL,
    preferred_timeslot VARCHAR(64) NOT NULL,
    photo_url TEXT,
    status VARCHAR(32) DEFAULT 'REQUESTED', -- 'REQUESTED', 'CONFIRMED', 'SCHEDULED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED'
    assigned_vehicle_id VARCHAR(64) REFERENCES vehicles(id),
    assigned_vehicle_number VARCHAR(64),
    scheduled_date DATE,
    scheduled_time VARCHAR(64),
    staff_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Service Logs & Operational Tracking Table
CREATE TABLE IF NOT EXISTS service_logs (
    id VARCHAR(64) PRIMARY KEY,
    schedule_id VARCHAR(64) REFERENCES schedules(id),
    vehicle_id VARCHAR(64) REFERENCES vehicles(id),
    driver_name VARCHAR(150),
    zone_name VARCHAR(150),
    service_date DATE NOT NULL,
    waste_collected_tons DECIMAL(5,2) DEFAULT 0.00,
    checkpoints_total INT DEFAULT 0,
    checkpoints_completed INT DEFAULT 0,
    distance_traveled_km DECIMAL(6,2) DEFAULT 0.00,
    fuel_consumed_liters DECIMAL(6,2) DEFAULT 0.00,
    notes TEXT,
    status VARCHAR(32) DEFAULT 'COMPLETED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Notifications & Alerts Table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    recipient_role VARCHAR(32) DEFAULT 'ALL',
    recipient_email VARCHAR(150),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(32) DEFAULT 'INFO', -- 'INFO', 'ALERT', 'DISPATCH', 'RESOLUTION'
    related_id VARCHAR(64),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
