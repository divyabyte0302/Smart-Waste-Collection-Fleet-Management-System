-- ==============================================================================
-- SMART WASTE COLLECTION MANAGEMENT SYSTEM - RDS POSTGRESQL PRODUCTION DDL
-- Compatible with Amazon RDS PostgreSQL 14 / 15 / 16
-- ==============================================================================

-- Create extension for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users & Authentication Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'citizen', -- 'citizen', 'admin', 'staff'
    phone VARCHAR(30),
    address TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
    complaint_id VARCHAR(50) PRIMARY KEY,
    citizen_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    category VARCHAR(60) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(200) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    image_url TEXT,
    priority VARCHAR(20) NOT NULL DEFAULT 'Medium', -- 'Low', 'Medium', 'High', 'Critical'
    status VARCHAR(30) NOT NULL DEFAULT 'Submitted', -- 'Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'
    assigned_staff_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    admin_notes TEXT,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_complaints_citizen ON complaints(citizen_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_priority ON complaints(priority);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON complaints(created_at DESC);

-- 3. Complaint Comments & Timeline Events Table
CREATE TABLE IF NOT EXISTS complaint_comments (
    id VARCHAR(50) PRIMARY KEY,
    complaint_id VARCHAR(50) NOT NULL REFERENCES complaints(complaint_id) ON DELETE CASCADE,
    author_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    author_name VARCHAR(100) NOT NULL,
    comment_text TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_comments_complaint ON complaint_comments(complaint_id);

-- 4. Waste Pickup Requests Table
CREATE TABLE IF NOT EXISTS pickup_requests (
    request_id VARCHAR(50) PRIMARY KEY,
    citizen_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    waste_type VARCHAR(60) NOT NULL,
    estimated_waste_quantity VARCHAR(50) NOT NULL,
    pickup_address TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time VARCHAR(30) NOT NULL,
    description TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected', 'Scheduled', 'Assigned', 'Completed', 'Cancelled'
    assigned_vehicle VARCHAR(50),
    assigned_staff VARCHAR(50),
    rejection_reason TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pickups_citizen ON pickup_requests(citizen_id);
CREATE INDEX IF NOT EXISTS idx_pickups_status ON pickup_requests(status);
CREATE INDEX IF NOT EXISTS idx_pickups_pref_date ON pickup_requests(preferred_date);

-- 5. Collection Schedules Table
CREATE TABLE IF NOT EXISTS collection_schedules (
    schedule_id VARCHAR(50) PRIMARY KEY,
    area VARCHAR(100) NOT NULL,
    collection_date DATE NOT NULL,
    collection_time VARCHAR(50) NOT NULL,
    start_time VARCHAR(10),
    end_time VARCHAR(10),
    assigned_vehicle VARCHAR(50) NOT NULL,
    assigned_driver VARCHAR(50) NOT NULL,
    route_description TEXT,
    waste_types JSONB NOT NULL DEFAULT '["Household Waste"]'::jsonb,
    status VARCHAR(30) NOT NULL DEFAULT 'Scheduled', -- 'Scheduled', 'Active', 'Completed', 'Cancelled'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_schedules_area ON collection_schedules(area);
CREATE INDEX IF NOT EXISTS idx_schedules_date ON collection_schedules(collection_date);
CREATE INDEX IF NOT EXISTS idx_schedules_status ON collection_schedules(status);

-- 6. Vehicles Fleet Table
CREATE TABLE IF NOT EXISTS vehicles (
    vehicle_id VARCHAR(50) PRIMARY KEY,
    vehicle_number VARCHAR(50) NOT NULL UNIQUE,
    vehicle_type VARCHAR(60) NOT NULL, -- 'Garbage Truck', 'Mini Truck', 'Recycling Vehicle', 'Special Waste Vehicle'
    capacity VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Available', -- 'Available', 'Assigned', 'On Route', 'Maintenance', 'Inactive'
    current_area VARCHAR(100) NOT NULL,
    driver_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    fuel_level INTEGER DEFAULT 100,
    last_maintenance DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_current_area ON vehicles(current_area);

-- 7. Collection Staff Profiles Table
CREATE TABLE IF NOT EXISTS collection_staff (
    staff_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(30) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Waste Collector', -- 'Driver', 'Waste Collector', 'Supervisor'
    assigned_vehicle VARCHAR(50),
    assigned_area VARCHAR(100),
    status VARCHAR(30) NOT NULL DEFAULT 'Available', -- 'Available', 'Assigned', 'On Duty', 'Inactive'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_staff_status ON collection_staff(status);
CREATE INDEX IF NOT EXISTS idx_staff_assigned_area ON collection_staff(assigned_area);

-- 8. Vehicle Assignments Table
CREATE TABLE IF NOT EXISTS vehicle_assignments (
    id VARCHAR(50) PRIMARY KEY,
    vehicle_id VARCHAR(50) NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    staff_id VARCHAR(50) REFERENCES collection_staff(staff_id) ON DELETE SET NULL,
    assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
    shift VARCHAR(30) DEFAULT 'Morning',
    status VARCHAR(30) DEFAULT 'Active',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_v_assign_vehicle ON vehicle_assignments(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_v_assign_staff ON vehicle_assignments(staff_id);

-- 9. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY,
    recipient_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    priority VARCHAR(20) DEFAULT 'NORMAL',
    channel VARCHAR(30) DEFAULT 'LOCAL_NOTIFICATION_BUS',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- 10. Service History & Completed Collections Table
CREATE TABLE IF NOT EXISTS service_history (
    id VARCHAR(50) PRIMARY KEY,
    entity_type VARCHAR(30) NOT NULL, -- 'complaint', 'pickup', 'schedule'
    entity_id VARCHAR(50) NOT NULL,
    actor_id VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    notes TEXT,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_service_history_entity ON service_history(entity_type, entity_id);

-- 11. Audit & Event Logs Table
CREATE TABLE IF NOT EXISTS system_event_logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    event_type VARCHAR(50) NOT NULL,
    actor_id VARCHAR(50),
    actor_role VARCHAR(30),
    action VARCHAR(100) NOT NULL,
    entity_id VARCHAR(50),
    details JSONB
);

CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON system_event_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_logs_event_type ON system_event_logs(event_type);
