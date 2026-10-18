# INNOVISTA — LinkPulse Premium URL Shortener & Analytics Platform

LinkPulse is a production-grade, full-stack link management and analytics SaaS platform built for high-scale redirection, atomic click tracking, link security, dynamic QR codes, campaign attribution, and domain governance.

---

## ⚡ Tech Stack & Architecture

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts
- **Backend**: Node.js & Express with TypeScript, REST APIs
- **Database**: PostgreSQL / SQLite with Prisma ORM
- **Security & Auth**: JWT authentication, bcryptjs hashing, atomic transactions, rate-limiting, domain blocklists
- **Analytics & QR Engine**: Privacy-preserving IP hashing (GDPR compliant), UAParser device & bot classification, Dynamic vector & raster QR generator

---

## 🚀 Running the Application

### 1. Backend Server
```bash
cd server
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```
Runs at: `http://localhost:5000`

### 2. Frontend Client
```bash
cd client
npm install
npm run dev
```
Runs at: `http://localhost:5173`

---

## 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **User (Sarah Chen)** | `demo@linkpulse.io` | `Demo@123456` |
| **Admin (Alex Vance)** | `admin@linkpulse.io` | `Admin@123456` |

---

## 🌟 Key Features

1. **Sub-15ms Atomic Redirect Engine (`/r/:code`)**:
   - Atomic click counter increments via database transactions.
   - Enforces expiration timestamps, click limit caps, and domain safety blocklists.
2. **Password Protected Links**:
   - Beautiful branded security challenge barrier before forwarding to protected destinations.
3. **Real-Time Live Telemetry**:
   - Dynamic charts: Clicks over time, unique visitors (privacy-preserving daily salted IP hashes), device breakdown, and referrer sources.
4. **Campaigns & Attribution**:
   - Multi-channel funnel grouping with custom colors and aggregate click counts.
5. **QR Code Studio**:
   - Live custom SVG & PNG QR code generator with camera scan telemetry (`?src=qr`).
6. **Bulk CSV Import & Validation**:
   - Row-by-row live validation preview matrix detecting malformed URLs and duplicate vanity slugs.
7. **Admin Trust & Security Center**:
   - Domain blacklists, platform-wide metrics, and administrative audit trails.
