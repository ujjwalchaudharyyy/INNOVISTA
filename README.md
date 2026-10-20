<div align="center">

# ⚡ LinkPulse (INNOVISTA)
### Enterprise Edge Link Infrastructure, Atomic Redirects & Real-Time Telemetry

[![React 18](https://img.shields.io/badge/Frontend-React%2018%20%7C%20TypeScript-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Prisma ORM](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel Ready](https://img.shields.io/badge/Deploy-Vercel%20Ready-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<p align="center">
  <b>A production-grade, high-throughput URL infrastructure designed for ultra-low latency edge redirects, GDPR-compliant privacy analytics, cryptographic security barriers, dynamic vector QR generation, and autonomous AI voice telemetry.</b>
</p>

[Key Features](#-core-capabilities) • [System Architecture](#-system-architecture) • [Audio & AI Engine](#-multimedia--ai-audio-engine) • [API Reference](#-api-specification) • [Deployment](#-quickstart--deployment) • [Credentials](#-demo-credentials)

---

</div>


# Deployed Link ~ 

https://innovista-black.vercel.app/


# Prototype ~ 

<img width="1911" height="1002" alt="image" src="https://github.com/user-attachments/assets/07b7e325-ce5a-4ace-b2be-9adc31a5a901" />




## 📌 Executive Summary

Modern link routing is more than a simple HTTP `302` redirect. Enterprise platforms require **atomic click enforcement**, **zero-latency destination lookup**, **fraud/malware domain screening**, **campaign attribution funnels**, and **deep privacy-preserving analytics** without relying on invasive client-side cookies.

**LinkPulse** is engineered as a resilient full-stack platform that delivers:
- **Sub-15ms Hot-Path Redirection (`/r/:code`)** with atomic click increments.
- **Privacy-First Telemetry Engine** using daily salted SHA-256 IP hashing and User-Agent heuristic parsing.
- **Dynamic Vector QR Studio** rendering scalable vector QR matrices with scan-attribution tags.
- **Automated Security Shield** with domain reputation screening and password-protected enclaves.
- **Immersive 4K Sci-Fi Interface** powered by Web Audio synth loops and Web Speech API narration.

---

## 🏛 System Architecture

The LinkPulse platform utilizes a decoupled client-server architecture with an isolated database layer and asynchronous telemetry capture.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CLIENT LAYER (Vite / React 18)                  │
│                                                                             │
│   ┌────────────────┐   ┌────────────────┐   ┌──────────────┐   ┌────────┐   │
│   │ 4K Video Canvas│   │ Audio Synthesizer│ │ AI Voice TTS │   │Recharts│   │
│   │ + Glassmorphism│   │ + Beat Looper  │   │ Speech Engine│   │Studio  │   │
│   └────────────────┘   └────────────────┘   └──────────────┘   └────────┘   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTPS / JSON REST API
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          API GATEWAY & ROUTING LAYER                        │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ Express HTTP Engine (CORS, Rate Limiter, Body Parsers, Error Interceptor)│
│   └───────────────┬─────────────────────────────────────┬───────────────┘   │
│                   │                                     │                   │
│         ┌─────────▼────────┐                  ┌─────────▼────────┐          │
│         │ Management Path  │                  │  Hot-Path Engine │          │
│         │ (/api/*)         │                  │  (/r/:code)      │          │
│         └─────────┬────────┘                  └─────────┬────────┘          │
│                   │ JWT Auth / RBAC                     │ Atomic Redirection│
│                   ▼                                     ▼                   │
│   ┌─────────────────────────────────┐   ┌───────────────────────────────┐   │
│   │ Business Logic Modules:         │   │ Redirection Pipeline:         │   │
│   │ • Auth & Token Factory (bcrypt) │   │ • Domain Reputation Validator │   │
│   │ • Link & Custom Vanity Studio   │   │ • Password Challenge Shield   │   │
│   │ • Campaign Funnel Aggregator    │   │ • Expiry & Click-Cap Filter   │   │
│   │ • Bulk CSV Import Validator     │   │ • Telemetry Telemetry Worker  │   │
│   │ • Admin Domain Shield & Audit   │   │ • HTTP 302 Fast-Forward      │   │
│   └────────────────┬────────────────┘   └───────────────┬───────────────┘   │
└────────────────────┼────────────────────────────────────┼───────────────────┘
                     │                                    │
                     └─────────────────┬──────────────────┘
                                       │ Prisma ORM / SQL Abstraction
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATA PERSISTENCE LAYER                              │
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌─────────────────────────┐   │
│   │    Users     │◄────►│    Links     │◄────►│      ClickEvents        │   │
│   │  (RBAC/Hash) │      │(Caps/Vanity) │      │  (Salted Hash IP/UA)    │   │
│   └──────────────┘      └──────┬───────┘      └─────────────────────────┘   │
│                                │                                            │
│                         ┌──────▼───────┐      ┌─────────────────────────┐   │
│                         │  Campaigns   │      │    DomainBlocklist      │   │
│                         │ (Attribution)│      │    (Security Shield)    │   │
│                         └──────────────┘      └─────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Redirection Sequence & Telemetry Lifecycle

```
User (Browser)               LinkPulse Gateway                Prisma DB             Destination
      │                              │                            │                      │
      │── 1. GET /r/ph-launch ───────►│                            │                      │
      │                              │── 2. Query Link & Rules ──►│                      │
      │                              │◄── Return Link Record ─────│                      │
      │                              │                            │                      │
      │                              │── 3. Validate Constraints: │                      │
      │                              │   • Is Link Active?        │                      │
      │                              │   • Has Link Expired?      │                      │
      │                              │   • Has Click Cap Hit?     │                      │
      │                              │   • Is Destination Safe?   │                      │
      │                              │                            │                      │
      │                              │── 4. Atomic Increment ────►│                      │
      │                              │   & Asynchronous Telemetry:│                      │
      │                              │   • Hash IP: SHA256(IP+Day)│                      │
      │                              │   • Parse UA: Device/OS    │                      │
      │                              │   • Track Country/Referrer │                      │
      │                              │                            │                      │
      │◄── 5. HTTP 302 Found ────────│                            │                      │
      │       Location: destination  │                            │                      │
      │                              │                            │                      │
      │──────────────────────────────┼────────────────────────────┼─────────────────────►│
      │                              │                            │    Follow 302        │
```

---

## 🚀 Core Capabilities

### 1. Sub-15ms Atomic Hot-Path (`/r/:code`)
- Highly optimized database transactions ensure atomic click counting with zero race conditions under concurrent spikes.
- Automated hard-cap enforcement immediately blocks traffic once a link reaches its configured threshold.
- Temporary or permanent expiry timestamps prevent stale URL forwarding.

### 2. Cryptographic Security Barrier (Protected Links)
- Allows creators to gate sensitive destinations behind a cryptographic password challenge.
- Displays a branded frosted-glass authentication interstitial before forwarding.

### 3. GDPR-Compliant Privacy Telemetry
- **Zero Raw PII Storage**: Client IP addresses are never saved in plain text. LinkPulse computes a one-way daily-salted `SHA-256(IP + SALT + Date)` hash to calculate distinct unique visitors without tracking users across sessions.
- User-Agent parser identifies Device Categories (Desktop, Mobile, Tablet, Bot), Operating Systems, and Browser engines for real-time traffic analysis.

### 4. Dynamic Vector & Raster QR Studio (`/qr`)
- Live vector rendering produces high-precision SVG and high-resolution PNG matrices.
- Embedded campaign scan attribution (`?src=qr`) segments physical scans from direct digital clicks.

### 5. Multi-Channel Campaign Attribution Funnels
- Organize links into color-coded marketing campaigns (e.g., `Q4 Launch`, `Black Friday`, `Influencer Outreach`).
- Compare aggregated traffic and conversion performance across distinct distribution channels.

### 6. High-Speed Bulk CSV Ingestion Matrix
- Upload multi-column CSV manifests containing thousands of target URLs.
- Real-time client-side parsing matrix validates syntax, detects duplicate custom aliases, and reports formatting errors before submission.

### 7. Automated Domain Shield
- Platform-wide threat mitigation blocklist prevents malicious domains (phishing, malware, scam URLs) from entering the redirection pipeline.

---

## 🎙 Multimedia & AI Audio Engine

LinkPulse features an audio and visual presentation layer on the Login and Onboarding views:

| Feature | Technical Implementation | Behavior |
| :--- | :--- | :--- |
| **4K Cosmic Background** | Native HTML5 Video Canvas with hardware-accelerated CSS filters (`contrast`, `saturate`, `brightness`). | Continuous seamless loop with trailing 3-second auto-trim. |
| **Trap Beat Looper** | Custom HTML5 Audio Engine (`/bg-music.mp3`). | Auto-loops continuously; precision 40ms interval crops last 3 seconds to maintain tight rhythm. |
| **Autonomous AI Voice** | Browser Web Speech API (`SpeechSynthesisUtterance`). | Synthesizes calm AI narration (rate `0.95`, pitch `0.92`) introducing LinkPulse capabilities 3 seconds after music starts. |
| **Smart Audio Ducking** | Dynamic gain & volume scaling (`0.38` ➔ `0.16`). | Reduces music volume during AI narration so voice output remains crystal clear. |
| **Sound State Protection** | Memory-backed `isMutedRef` + gesture event lifecycle. | Guarantees clicking "Sound Off" cleanly stops playback and prevents accidental auto-resumption. |

---

## 🛠 Tech Stack Specification

### Frontend
- **Framework**: React 18.3 with TypeScript
- **Tooling & Bundler**: Vite 8.3
- **Styling**: Tailwind CSS, PostCSS, Custom Glassmorphism Theme
- **Data Visualization**: Recharts (Area, Bar, Pie, Responsive Containers)
- **Icons**: Lucide React
- **HTTP Client**: Axios with automated JWT auth interceptors

### Backend
- **Runtime**: Node.js (v18+)
- **Application Framework**: Express.js with TypeScript
- **ORM**: Prisma ORM (v5+)
- **Database**: SQLite (Development) / PostgreSQL (Production ready)
- **Security**: JSON Web Tokens (JWT), bcryptjs (Salt factor 10), Express Rate Limiter
- **Telemetry Parsers**: UAParser.js, Node.js Crypto (SHA-256)

---
# Road Map ~

<img width="425" height="376" alt="image" src="https://github.com/user-attachments/assets/190b055e-3d27-4487-86ef-2b5ed1096b85" />






## 📂 Project Directory Structure

```
INNOVISTA/
├── client/                      # Frontend Application (Vite + React)
│   ├── public/
│   │   ├── bg-music.mp3         # High-energy looping background audio
│   │   ├── login-bg.mp4         # 4K Cinematic space video background
│   │   └── favicon.svg          # Vector branding asset
│   ├── src/
│   │   ├── components/          # Reusable UI (Sidebar, Header, CreateLinkModal)
│   │   ├── context/             # Authentication State & Session Context
│   │   ├── pages/               # Views (Overview, Links, Campaigns, Analytics, QR, Bulk, Admin)
│   │   ├── services/            # API client (Axios) & Sound Engine (TTS/Beat)
│   │   ├── App.tsx              # Application Root Router
│   │   ├── main.tsx             # React Mount Entry Point
│   │   └── index.css            # Tailwind Directives & Custom Scrollbars
│   ├── vercel.json              # Client SPA Routing Config for Vercel
│   ├── vite.config.ts           # Vite Build & Proxy Configuration
│   └── tailwind.config.js       # Design System Tokens
│
├── server/                      # Backend API Gateway (Express + TypeScript)
│   ├── prisma/
│   │   ├── schema.prisma        # Prisma Database Schema (User, Link, ClickEvent, etc.)
│   │   └── seed.ts              # Database Seeder (Users, Links, 120+ Telemetry events)
│   ├── src/
│   │   ├── middleware/          # JWT Verification, RBAC Permission Guards
│   │   ├── routes/              # Modular Endpoints (auth, links, redirect, analytics, etc.)
│   │   ├── utils/               # Analytics Processing, IP Hasher, UA Classifier
│   │   ├── prisma.ts            # Singleton Prisma Client Instance
│   │   └── index.ts             # Express Server Initialization & Route Mounts
│   ├── tsconfig.json            # Node TypeScript Compiler Options
│   └── package.json             # Backend Dependencies & Scripts
│
├── vercel.json                  # Root Monorepo Deployment Descriptor for Vercel
├── .gitignore                   # Ignore rules (node_modules, dev.db, logs)
└── README.md                    # Platform Documentation
```

---

## 📡 API Specification

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Create new user account with hashed password |
| `POST` | `/api/auth/login` | Public | Authenticate user & return signed JWT token |
| `GET` | `/api/auth/me` | Authenticated | Fetch current user session profile |
| `GET` | `/r/:code` | Public | **Hot-path**: Process redirect, record telemetry, return `302` |
| `POST` | `/r/:code/verify` | Public | Verify password for password-protected links |
| `GET` | `/api/links` | Authenticated | List all active links owned by current user |
| `POST` | `/api/links` | Authenticated | Create a new short link with optional rules & campaign |
| `PUT` | `/api/links/:id` | Authenticated | Update destination, cap, or expiration |
| `DELETE` | `/api/links/:id` | Authenticated | Deactivate / remove link |
| `GET` | `/api/analytics/overview`| Authenticated | Aggregated metrics (total clicks, top link, device breakdown) |
| `GET` | `/api/analytics/:id` | Authenticated | Granular timeseries telemetry for a single link |
| `GET` | `/api/campaigns` | Authenticated | List campaigns with aggregated link metrics |
| `POST` | `/api/campaigns` | Authenticated | Create marketing campaign grouping |
| `POST` | `/api/bulk/import` | Authenticated | Ingest and validate batch CSV link entries |
| `GET` | `/api/admin/metrics` | Admin Only | Platform-wide traffic telemetry & infrastructure stats |
| `POST` | `/api/admin/blocklist`| Admin Only | Add domain to malicious reputation blocklist |

---

## 🚀 Quickstart & Deployment

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Local Development Setup

#### 1. Backend Server Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Push Prisma schema to local database
npx prisma db push

# Seed realistic demo data (users, campaigns, links, analytics events)
npx tsx prisma/seed.ts

# Start backend server in development mode
npm run dev
```
Server will be available at: **`http://localhost:5000`**

#### 2. Frontend Client Setup
```bash
# Open a new terminal and navigate to client directory
cd client

# Install dependencies
npm install

# Launch Vite development server
npm run dev
```
Frontend will be available at: **`http://localhost:5173`**

---

## ☁️ 1-Click Vercel Deployment

LinkPulse is pre-configured with root and client `vercel.json` descriptors for zero-configuration deployment on Vercel:

1. Import this repository into your **[Vercel Dashboard](https://vercel.com/new)**.
2. Configure Environment Variables in Vercel:
   - `VITE_API_URL`: Your hosted backend URL (e.g., `https://your-api.onrender.com` or `https://api.yourdomain.com`).
3. Click **Deploy**. Vercel will automatically build the client and handle single-page application (SPA) routing seamlessly.

---

## 🔑 Demo Credentials

Pre-seeded authentication credentials for platform evaluation:

| Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Standard User (Sarah Chen)** | `demo@linkpulse.io` | `Demo@123456` | Full link creation, campaigns, QR studio, bulk CSV, analytics |
| **Administrator (Alex Vance)** | `admin@linkpulse.io` | `Admin@123456` | All user capabilities + Admin Shield, domain blocklists, platform metrics |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<div align="center">
  <sub>Built with precision for high-scale link infrastructure. LinkPulse © 2026.</sub>
</div>
