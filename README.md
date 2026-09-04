# Smart Waste Collection Management System

[![Node.js](https://img.shields.io/badge/Node.js-18.x%20%7C%2020.x-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18.x%20(Vite)-61DAFB.svg)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Amazon%20RDS-336791.svg)](https://aws.amazon.com/rds/postgresql/)
[![AWS](https://img.shields.io/badge/AWS-S3%20%7C%20SNS%20%7C%20CloudWatch-FF9900.svg)](https://aws.amazon.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%203.4-38B2AC.svg)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

An enterprise-grade, cloud-native municipal sanitation platform engineered for cities and waste management authorities. It integrates citizen issue reporting, on-demand special pickups, automated collection route scheduling, fleet telematics, and real-time operational analytics with Amazon Web Services (AWS) cloud infrastructure.

---

## 📑 Table of Contents
1. [System Architecture](#1-system-architecture)
2. [Technology Stack](#2-technology-stack)
3. [AWS Cloud Services Integration](#3-aws-cloud-services-integration)
4. [Installation Instructions](#4-installation-instructions)
5. [Environment Setup Guide](#5-environment-setup-guide)
6. [Database Setup Guide](#6-database-setup-guide)
7. [API Documentation](#7-api-documentation)
8. [Production Security Hardening](#8-production-security-hardening)
9. [Automated Testing Suite](#9-automated-testing-suite)
10. [Production Deployment Instructions](#10-production-deployment-instructions)
11. [User Roles & Default Credentials](#11-user-roles--default-credentials)

---

## 1. System Architecture

```
                                  [ Citizens & Municipal Staff ]
                                                │
                                                ▼ (HTTPS / CDN)
                             ┌──────────────────────────────────────┐
                             │       AWS Amplify Edge Hosting       │
                             │        (React 18 + Vite SPA)         │
                             └──────────────────┬───────────────────┘
                                                │
                                                ▼ REST API (JWT + TLS)
                             ┌──────────────────────────────────────┐
                             │     Application Load Balancer (ALB)  │
                             └──────────────────┬───────────────────┘
                                                │
                                                ▼
                             ┌──────────────────────────────────────┐
                             │      AWS EC2 / Elastic Beanstalk     │
                             │     Node.js + Express REST API       │
                             │  (Helmet • CORS • Rate Limiter)      │
                             └───┬──────────────┬────────────────┬──┘
                                 │              │                │
            ┌────────────────────┘              │                └────────────────────┐
            ▼                                   ▼                                     ▼
┌────────────────────────┐          ┌────────────────────────┐          ┌────────────────────────┐
│       Amazon S3        │          │ Amazon RDS PostgreSQL  │          │       Amazon SNS       │
│  - Complaint Photos    │          │  - Multi-AZ Relational │          │  - Status Push Alerts  │
│  - Waste Evidence Docs │          │  - ACID Transactions   │          │  - SMS / Email Alerts  │
└────────────────────────┘          └────────────────────────┘          └────────────────────────┘
                                                │
                                                ▼ Telemetry & Observability
                                    ┌────────────────────────┐
                                    │    Amazon CloudWatch   │
                                    │  - Structured Logging  │
                                    │  - Error Monitoring    │
                                    │  - Latency Metrics     │
                                    └────────────────────────┘
```

---

## 2. Technology Stack

- **Frontend**:
  - **Framework**: React 18 with TypeScript
  - **Build Tool**: Vite 6 (ultra-fast HMR and optimized production bundling)
  - **Styling**: Tailwind CSS with custom municipal dark-mode color palette (`eco`, `city`)
  - **Icons**: Lucide React
  - **Routing**: React Router DOM v6
- **Backend**:
  - **Runtime**: Node.js 18.x LTS / 20.x
  - **Framework**: Express.js with modular domain-driven architecture
  - **Authentication**: JWT (JSON Web Tokens) with salted bcrypt password hashing
  - **Security**: Helmet HTTP headers, CORS origin whitelist, sliding-window IP rate limiting
- **Database**:
  - **Primary Production**: Amazon RDS PostgreSQL (14 / 15 / 16)
  - **Local Development**: Resilient zero-config persistent relational JSON store
- **Cloud (AWS)**:
  - Amazon RDS (PostgreSQL)
  - Amazon S3 (Object storage)
  - Amazon SNS (Push notifications)
  - Amazon CloudWatch (Logging & monitoring)
  - AWS EC2 / Elastic Beanstalk (Backend hosting)
  - AWS Amplify (Frontend global CDN)

---

## 3. AWS Cloud Services Integration

### 1. Amazon RDS PostgreSQL
- Managed relational PostgreSQL database running across multiple Availability Zones.
- Configured via connection string `DATABASE_URL`.
- DDL schema script provided in `aws/configuration/rds-postgres-schema.sql`.

### 2. Amazon S3 Modular Storage Service (`services/storage/s3.service.js`)
- Modular service supporting:
  - `uploadImage(fileData, filename, mimeType, folder)`
  - `getImageUrl(key, expiresInSeconds)`
  - `deleteImage(key)`
- Automatically uploads complaint evidence and waste documentation to S3 bucket.
- Incorporates automatic fallback to local disk storage (`/uploads/`) when cloud credentials are not supplied.

### 3. Amazon SNS Notification Engine (`backend/src/services/notifications/sns.service.js`)
- Event-driven notifications for:
  - Complaint status transitions (Submitted → Under Review → Assigned → In Progress → Resolved)
  - Waste pickup request approvals
  - Vehicle and staff dispatch alerts
  - Service completion notices
  - Municipal emergency advisories (e.g. hazardous spills, severe weather delays)

### 4. Amazon CloudWatch Observability (`backend/src/services/monitoring/cloudwatch.service.js`)
- Centralized structured JSON logging to `/aws/smartwaste/backend`.
- Real-time API latency tracking and slow-query alerts.
- Error monitoring and uncaught exception capture.
- System diagnostic telemetry accessible via `GET /api/health` and `GET /api/cloud-status`.

---

## 4. Installation Instructions

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Step 1: Clone Repository and Install Dependencies
```bash
git clone https://github.com/your-org/smart-waste-management.git
cd smart-waste-management

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 2: Seed Initial Municipal Data
Populates users, sample complaints, vehicles, routes, and collection staff:
```bash
npm run seed
```

### Step 3: Run the Application
In development, both backend and frontend can run concurrently:
```bash
# Terminal 1: Backend Server (Port 5000)
npm run start

# Terminal 2: Frontend SPA (Port 3000)
cd frontend
npm run dev
```

---

## 5. Environment Setup Guide

Copy sample environment templates:
```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Backend `.env` Configuration
```env
PORT=5000
NODE_ENV=production
DATABASE_URL=postgres://postgres:YourSecurePassword!@smartwaste-prod.c123456.us-east-1.rds.amazonaws.com:5432/smartwaste_db
JWT_SECRET=ultra_secure_production_jwt_signing_key_9837492837492837498
JWT_EXPIRES_IN=7d

# AWS Cloud Credentials
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_S3_BUCKET=smartwaste-bucket-production
AWS_SNS_TOPIC_ARN=arn:aws:sns:us-east-1:123456789012:smartwaste-notifications-topic
CLOUDWATCH_LOG_GROUP=/aws/smartwaste/backend

# CORS Configuration
CORS_ALLOWED_ORIGINS=https://main.d123456789.amplifyapp.com,http://localhost:3000
```

### Frontend `.env` Configuration
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 6. Database Setup Guide

### Amazon RDS PostgreSQL Migration
1. Provision a PostgreSQL 15+ instance in Amazon RDS.
2. Ensure your EC2 / Beanstalk security group is allowed inbound access to port 5432.
3. Apply the production DDL schema:
   ```bash
   psql "$DATABASE_URL" -f aws/configuration/rds-postgres-schema.sql
   ```
4. Tables created:
   - `users` (Authentication, roles, passwords)
   - `complaints` (Issue reports, priority, status, S3 photo URLs)
   - `pickup_requests` (On-demand bulk waste pickups)
   - `collection_schedules` (Municipal sector collection routes)
   - `vehicles` (Fleet inventory, capacity, driver assignments)
   - `collection_staff` (Field crews, employee IDs, duty status)
   - `system_event_logs` (Audit and telemetry logs)

---

## 7. API Documentation

All protected endpoints require HTTP header: `Authorization: Bearer <JWT_TOKEN>`.

### Authentication & Users
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new Citizen account |
| `POST` | `/api/auth/login` | Public | Login with email & password; returns JWT token |
| `GET` | `/api/auth/profile` | Auth | Get current authenticated user profile |
| `GET` | `/api/users` | Admin | List all registered users |
| `PATCH` | `/api/users/:id/status` | Admin | Activate or deactivate a user account |

### Complaint Management
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/complaints` | Citizen / Admin | File complaint with category, location, photo |
| `GET` | `/api/complaints/my-complaints` | Citizen | View authenticated citizen's complaints |
| `GET` | `/api/complaints` | Staff / Admin | List all complaints with filtering |
| `GET` | `/api/complaints/:id` | Auth | Get complaint details and timeline audit trail |
| `PUT/PATCH`| `/api/complaints/:id/status` | Staff / Admin | Update status (triggers Amazon SNS alert) |

### Waste Pickup & Scheduling
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/pickups` | Citizen | Submit on-demand waste pickup request |
| `GET` | `/api/pickups` | Auth | View pickups (Citizen views own, Admin views all) |
| `PUT` | `/api/pickups/:id` | Admin | Assign truck and crew member to pickup |
| `PATCH` | `/api/pickups/:id/status` | Admin / Staff | Approve, complete, or cancel pickup request |
| `POST` | `/api/schedules` | Admin | Create route schedule for zone/sector |
| `GET` | `/api/schedules` | Auth | List collection route schedules |

### Fleet & Staff Management
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/vehicles` | Admin | Add new collection truck to fleet |
| `GET` | `/api/vehicles` | Admin / Staff | List vehicle fleet inventory and fuel levels |
| `PUT` | `/api/vehicles/:id` | Admin | Assign designated driver and update status |
| `GET` | `/api/staff` | Admin | List collection staff profiles |
| `PUT` | `/api/staff/:id` | Admin | Update staff area assignment and duty status |

### Analytics & Cloud Status
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/analytics/dashboard` | Admin / Staff | 10 Municipal KPIs, sector breakdown |
| `GET` | `/api/analytics/complaints` | Admin / Staff | Visual analytics by category, status, priority |
| `GET` | `/api/reports/daily?format=csv` | Admin / Staff | Download RFC-4180 certified daily CSV report |
| `GET` | `/api/cloud-status` | Public | Inspect AWS RDS, S3, SNS, CloudWatch health |
| `GET` | `/api/health` | Public | System uptime and performance diagnostics |

---

## 8. Production Security Hardening

- **Helmet HTTP Headers**: Enforces `X-DNS-Prefetch-Control`, `X-Frame-Options: DENY`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`.
- **CORS Origin Whitelist**: Restricts API calls to approved Amplify frontend domains and prevents unauthorized cross-origin requests.
- **Sliding-Window IP Rate Limiting**:
  - General API: 300 requests / minute per IP.
  - Authentication: 30 requests / minute per IP (prevents brute-force credential stuffing).
- **Anti-XSS & Prototype Pollution Sanitization**: Strips dangerous HTML tags and blocks `__proto__` and `constructor` injections.
- **Salted Password Hashing**: Utilizes `bcryptjs` with high work factor.
- **Environment Redaction**: Diagnostic endpoints redact secrets (`***REDACTED***`).

---

## 9. Automated Testing Suite

The project includes an automated test suite verifying all 6 functional domains against the active REST API:
```bash
# Run all automated integration tests
npm test
```

### Test Coverage Summary:
- `tests/auth/auth.test.js`: Authentication, token verification, role-based 403 authorization.
- `tests/complaints/complaints.test.js`: Creation, payload validation, status lifecycle, S3 image store.
- `tests/pickups/pickups.test.js`: On-demand requests, approval, dispatch assignment, cancellation constraints.
- `tests/schedules/schedules.test.js`: Route schedule creation, window validation, status updates.
- `tests/vehicles/vehicles.test.js`: Fleet inventory, driver assignment, crew dispatch.
- `tests/analytics/analytics.test.js`: 10 KPIs calculation, visual analytics, CSV streaming export, AWS Cloud status.

---

## 10. Production Deployment Instructions

### Backend (AWS Elastic Beanstalk / EC2)
1. Initialize Elastic Beanstalk:
   ```bash
   eb init -p node.js-18 smartwaste-backend
   ```
2. Deploy to AWS:
   ```bash
   eb create smartwaste-backend-prod --instance-types t3.medium
   ```
3. Set environment variables in the AWS console using values from `backend/.env.example`.
4. Deploy updates:
   ```bash
   eb deploy
   ```

### Frontend (AWS Amplify)
1. In the AWS Amplify Console, connect your Git repository.
2. The build pipeline uses `aws/deployment/amplify.yml`.
3. Set `VITE_API_BASE_URL` to your production API URL.
4. Trigger the build. Amplify provides global edge caching and automated HTTPS termination.

---

## 11. User Roles & Default Credentials

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@smartwaste.gov` | `password123` | Full access: user management, fleet dispatch, schedule routes, analytics, CSV exports |
| **Collection Staff**| `staff@smartwaste.gov` | `password123` | In-cab route execution, status updates, assigned pickups view |
| **Citizen** | `citizen@smartwaste.gov` | `password123` | File complaints, request bulk pickups, track progress |

---

## 📄 License
Released under the [MIT License](LICENSE). Designed and built for sustainable, data-driven municipal smart cities.
