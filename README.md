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




# Dashboard ~ 

<img width="1912" height="1031" alt="image" src="https://github.com/user-attachments/assets/66b4924e-2a8c-4be9-9da0-5c87365ff2cd" />







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

## 🏛 System Architecture

```mermaid
flowchart TB
  subgraph CLIENT["🖥️ CLIENT LAYER - Vite + React 18"]
    C1["🎬 4K Video UI<br/>Glassmorphism"]
    C2["🎵 Audio Engine<br/>Beat Looper"]
    C3["🤖 AI Voice<br/>Speech TTS"]
    C4["📊 Charts<br/>Recharts Studio"]
  end

  subgraph GATEWAY["🌐 API GATEWAY - Express + TypeScript"]
    EX["⚙️ Express Engine<br/>CORS, Rate Limiter, Parsers, Error Handler"]
    MG["🛠️ MANAGEMENT PATH /api/*<br/><br/>🔐 Auth and JWT bcrypt<br/>🔗 Links and Vanity Studio<br/>🎯 Campaign Aggregator<br/>📥 Bulk CSV Validator<br/>🛡️ Admin Shield and Audit"]
    H1["⚡ HOT-PATH /r/:code<br/>🕵️ Domain Reputation Check"]
    H2["🔑 Password Challenge"]
    H3["⏳ Expiry and Click-Cap Filter"]
    H4["📡 Telemetry Worker"]
    H5["🚀 HTTP 302 Redirect"]
    EX --> MG
    EX --> H1
    H1 --> H2 --> H3 --> H4 --> H5
  end

  subgraph DATA["🗄️ DATA PERSISTENCE LAYER"]
    PR["💎 Prisma ORM"]
    D1["👤 Users<br/>RBAC and Hash"]
    D2["🔗 Links<br/>Caps and Vanity"]
    D3["📈 ClickEvents<br/>Hashed IP and UA"]
    D4["🎯 Campaigns<br/>Attribution"]
    D5["🚫 Blocklist<br/>Domain Shield"]
    PR --> D1
    PR --> D2
    PR --> D3
    PR --> D4
    PR --> D5
  end

  C1 --> EX
  C2 --> EX
  C3 --> EX
  C4 --> EX
  MG --> PR
  H5 --> PR

  classDef client fill:#CECBF6,stroke:#534AB7,color:#26215C,stroke-width:1.5px
  classDef engine fill:#9FE1CB,stroke:#0F6E56,color:#04342C,stroke-width:1.5px
  classDef mgmt fill:#F5C4B3,stroke:#993C1D,color:#4A1B0C,stroke-width:1.5px
  classDef hot fill:#FAC775,stroke:#854F0B,color:#412402,stroke-width:1.5px
  classDef data fill:#B5D4F4,stroke:#185FA5,color:#042C53,stroke-width:1.5px

  class C1,C2,C3,C4 client
  class EX engine
  class MG mgmt
  class H1,H2,H3,H4,H5 hot
  class PR,D1,D2,D3,D4,D5 data

  style CLIENT fill:#EEEDFE,stroke:#534AB7,stroke-width:2px,color:#26215C
  style GATEWAY fill:#E1F5EE,stroke:#0F6E56,stroke-width:2px,color:#04342C
  style DATA fill:#E6F1FB,stroke:#185FA5,stroke-width:2px,color:#042C53
```
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

<div align="center">

![Speed](https://img.shields.io/badge/⚡_Speed-Sub--15ms-22C55E?style=for-the-badge)
![Privacy](https://img.shields.io/badge/🕵️_Privacy-GDPR_Ready-3B82F6?style=for-the-badge)
![Security](https://img.shields.io/badge/🛡️_Security-Domain_Shield-EF4444?style=for-the-badge)
![Analytics](https://img.shields.io/badge/📊_Analytics-Real--Time-F59E0B?style=for-the-badge)

</div>

<br/>

<table>
<tr>
<td width="50%" valign="top">

### ⚡ 1. Sub-15ms Atomic Hot-Path
![Route](https://img.shields.io/badge/Route-/r/:code-22C55E?style=flat-square) ![Type](https://img.shields.io/badge/Atomic-Transactions-0F6E56?style=flat-square)

- 🧮 Optimized DB transactions give **atomic click counting** with zero race conditions during traffic spikes
- 🚧 **Hard-cap enforcement** blocks traffic the moment a link hits its limit
- ⏳ Temporary or permanent **expiry timestamps** stop stale URL forwarding

</td>
<td width="50%" valign="top">

### 🔐 2. Cryptographic Security Barrier
![Feature](https://img.shields.io/badge/Protected-Links-8B5CF6?style=flat-square) ![UI](https://img.shields.io/badge/Frosted-Glass_UI-6366F1?style=flat-square)

- 🔑 Gate sensitive destinations behind a **password challenge**
- 🪟 Branded **frosted-glass interstitial** is shown before forwarding
- 🛂 Only verified visitors reach the destination

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🕵️ 3. GDPR-Compliant Privacy Telemetry
![GDPR](https://img.shields.io/badge/GDPR-Compliant-3B82F6?style=flat-square) ![Hash](https://img.shields.io/badge/SHA--256-Daily_Salt-1D4ED8?style=flat-square)

- 🚫 **Zero raw PII storage**: IPs are never saved in plain text
- 🔒 One-way hash `SHA-256(IP + SALT + Date)` counts **unique visitors** without cross-session tracking
- 📱 User-Agent parser detects **Desktop, Mobile, Tablet, Bot**, OS and browser engine

</td>
<td width="50%" valign="top">

### 🔳 4. Dynamic Vector & Raster QR Studio
![Route](https://img.shields.io/badge/Route-/qr-F59E0B?style=flat-square) ![Format](https://img.shields.io/badge/SVG-+_PNG-D97706?style=flat-square)

- 🎨 Live rendering of high-precision **SVG** and high-resolution **PNG** QR codes
- 🏷️ Embedded **scan attribution** (`?src=qr`) separates physical scans from digital clicks
- 📥 Download ready for print or web

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🎯 5. Multi-Channel Campaign Funnels
![Campaigns](https://img.shields.io/badge/Color--Coded-Campaigns-EC4899?style=flat-square) ![Compare](https://img.shields.io/badge/Channel-Comparison-DB2777?style=flat-square)

- 🗂️ Organize links into campaigns like `Q4 Launch`, `Black Friday`, `Influencer Outreach`
- 📊 Compare **traffic and conversion** performance across distribution channels

</td>
<td width="50%" valign="top">

### 📥 6. High-Speed Bulk CSV Ingestion
![Bulk](https://img.shields.io/badge/Bulk-1000s_of_URLs-14B8A6?style=flat-square) ![Validation](https://img.shields.io/badge/Live-Validation-0D9488?style=flat-square)

- 📄 Upload multi-column CSV files with **thousands of target URLs**
- ✅ Client-side matrix checks syntax and detects **duplicate aliases**
- 🧾 Formatting errors are reported **before submission**

</td>
</tr>
<tr>
<td colspan="2" valign="top">

### 🛡️ 7. Automated Domain Shield
![Shield](https://img.shields.io/badge/Threat-Mitigation-EF4444?style=flat-square) ![Blocklist](https://img.shields.io/badge/Platform--Wide-Blocklist-DC2626?style=flat-square)

- 🚫 Platform-wide blocklist keeps **phishing, malware and scam domains** out of the redirection pipeline
- 👑 Admins can add malicious domains instantly from the Admin panel

</td>
</tr>
</table>

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

```mermaid
flowchart LR
  ROOT["📦 INNOVISTA<br/>Monorepo"]

  ROOT --> CLIENT["🎨 client/<br/>Vite + React 18"]
  ROOT --> SERVER["⚙️ server/<br/>Express + TypeScript"]
  ROOT --> RF["☁️ vercel.json<br/>🙈 .gitignore<br/>📘 README.md"]

  CLIENT --> CP["📁 public/<br/>🎵 bg-music.mp3<br/>🎬 login-bg.mp4<br/>🖼️ favicon.svg"]
  CLIENT --> CS["📁 src/<br/>🧩 components<br/>🔐 context<br/>📄 pages<br/>🔌 services<br/>⚛️ App.tsx · main.tsx"]
  CLIENT --> CC["🔧 Config<br/>⚡ vite.config.ts<br/>🌈 tailwind.config.js<br/>☁️ vercel.json"]

  SERVER --> SP["🗄️ prisma/<br/>📐 schema.prisma<br/>🌱 seed.ts"]
  SERVER --> SS["📁 src/<br/>🛡️ middleware<br/>🛣️ routes<br/>🧰 utils<br/>💎 prisma.ts<br/>🚀 index.ts"]
  SERVER --> SC["🔧 Config<br/>tsconfig.json<br/>package.json"]

  classDef root fill:#F5C4B3,stroke:#993C1D,color:#4A1B0C,stroke-width:2px
  classDef client fill:#CECBF6,stroke:#534AB7,color:#26215C,stroke-width:1.5px
  classDef server fill:#9FE1CB,stroke:#0F6E56,color:#04342C,stroke-width:1.5px
  classDef misc fill:#FAC775,stroke:#854F0B,color:#412402,stroke-width:1.5px

  class ROOT root
  class CLIENT,CP,CS,CC client
  class SERVER,SP,SS,SC server
  class RF misc
```



## 📡 API Specification

## 📡 API Reference

<div align="center">

![GET](https://img.shields.io/badge/GET-22C55E?style=for-the-badge)
![POST](https://img.shields.io/badge/POST-3B82F6?style=for-the-badge)
![PUT](https://img.shields.io/badge/PUT-F59E0B?style=for-the-badge)
![DELETE](https://img.shields.io/badge/DELETE-EF4444?style=for-the-badge)
&nbsp;│&nbsp;
![Public](https://img.shields.io/badge/🌍_Public-22C55E?style=for-the-badge)
![Auth](https://img.shields.io/badge/🔐_Auth-F59E0B?style=for-the-badge)
![Admin](https://img.shields.io/badge/👑_Admin-EF4444?style=for-the-badge)

</div>

### 🔐 Authentication

| Method | Endpoint | Access | What it does |
|:---:|:---|:---:|:---|
| ![POST](https://img.shields.io/badge/POST-3B82F6?style=flat-square) | `/api/auth/register` | ![Public](https://img.shields.io/badge/Public-22C55E?style=flat-square) | 📝 Create new account with hashed password |
| ![POST](https://img.shields.io/badge/POST-3B82F6?style=flat-square) | `/api/auth/login` | ![Public](https://img.shields.io/badge/Public-22C55E?style=flat-square) | 🔑 Authenticate user & return signed JWT |
| ![GET](https://img.shields.io/badge/GET-22C55E?style=flat-square) | `/api/auth/me` | ![Auth](https://img.shields.io/badge/Auth-F59E0B?style=flat-square) | 👤 Fetch current user session profile |

### ⚡ Redirect Engine (Hot-Path)

| Method | Endpoint | Access | What it does |
|:---:|:---|:---:|:---|
| ![GET](https://img.shields.io/badge/GET-22C55E?style=flat-square) | `/r/:code` | ![Public](https://img.shields.io/badge/Public-22C55E?style=flat-square) | 🚀 **Hot-path**: process redirect, record telemetry, return `302` |
| ![POST](https://img.shields.io/badge/POST-3B82F6?style=flat-square) | `/r/:code/verify` | ![Public](https://img.shields.io/badge/Public-22C55E?style=flat-square) | 🔒 Verify password for protected links |

### 🔗 Links Management

| Method | Endpoint | Access | What it does |
|:---:|:---|:---:|:---|
| ![GET](https://img.shields.io/badge/GET-22C55E?style=flat-square) | `/api/links` | ![Auth](https://img.shields.io/badge/Auth-F59E0B?style=flat-square) | 📋 List all active links of current user |
| ![POST](https://img.shields.io/badge/POST-3B82F6?style=flat-square) | `/api/links` | ![Auth](https://img.shields.io/badge/Auth-F59E0B?style=flat-square) | ✨ Create short link with optional rules & campaign |
| ![PUT](https://img.shields.io/badge/PUT-F59E0B?style=flat-square) | `/api/links/:id` | ![Auth](https://img.shields.io/badge/Auth-F59E0B?style=flat-square) | ✏️ Update destination, click-cap or expiry |
| ![DELETE](https://img.shields.io/badge/DELETE-EF4444?style=flat-square) | `/api/links/:id` | ![Auth](https://img.shields.io/badge/Auth-F59E0B?style=flat-square) | 🗑️ Deactivate / remove link |

### 📊 Analytics & Campaigns

| Method | Endpoint | Access | What it does |
|:---:|:---|:---:|:---|
| ![GET](https://img.shields.io/badge/GET-22C55E?style=flat-square) | `/api/analytics/overview` | ![Auth](https://img.shields.io/badge/Auth-F59E0B?style=flat-square) | 📈 Total clicks, top link, device breakdown |
| ![GET](https://img.shields.io/badge/GET-22C55E?style=flat-square) | `/api/analytics/:id` | ![Auth](https://img.shields.io/badge/Auth-F59E0B?style=flat-square) | 🔍 Granular timeseries for a single link |
| ![GET](https://img.shields.io/badge/GET-22C55E?style=flat-square) | `/api/campaigns` | ![Auth](https://img.shields.io/badge/Auth-F59E0B?style=flat-square) | 🎯 List campaigns with aggregated metrics |
| ![POST](https://img.shields.io/badge/POST-3B82F6?style=flat-square) | `/api/campaigns` | ![Auth](https://img.shields.io/badge/Auth-F59E0B?style=flat-square) | 🏷️ Create marketing campaign grouping |

### 📥 Bulk Import

| Method | Endpoint | Access | What it does |
|:---:|:---|:---:|:---|
| ![POST](https://img.shields.io/badge/POST-3B82F6?style=flat-square) | `/api/bulk/import` | ![Auth](https://img.shields.io/badge/Auth-F59E0B?style=flat-square) | 📦 Ingest & validate batch CSV link entries |

### 👑 Admin Shield

| Method | Endpoint | Access | What it does |
|:---:|:---|:---:|:---|
| ![GET](https://img.shields.io/badge/GET-22C55E?style=flat-square) | `/api/admin/metrics` | ![Admin](https://img.shields.io/badge/Admin-EF4444?style=flat-square) | 🛰️ Platform-wide traffic & infrastructure stats |
| ![POST](https://img.shields.io/badge/POST-3B82F6?style=flat-square) | `/api/admin/blocklist` | ![Admin](https://img.shields.io/badge/Admin-EF4444?style=flat-square) | 🚫 Add domain to malicious blocklist |

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

## Local Setup !

<img width="942" height="592" alt="image" src="https://github.com/user-attachments/assets/34e2485b-d3d0-418d-82ec-ad8f321085aa" />


## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<div align="center">
  <sub>Built with precision for high-scale link infrastructure. LinkPulse © 2026.</sub>
</div>



## 👥 Meet Team Tech4All

<div align="center">

### 👑 Team Leader

<a href="https://github.com/ujjwalchaudharyyy">
  <img src="https://github.com/ujjwalchaudharyyy.png" width="120" alt="Ujjwal Chaudhary" /><br/>
  <b>Ujjwal Chaudhary</b>
</a><br/>
<sub>🚩 Team Leader</sub>

<br/><br/>

### 🤝 Team Members

<table>
  <tr>
    <td align="center" width="200">
      <a href="https://github.com/vaibhavi123-p">
        <img src="https://github.com/vaibhavi123-p.png" width="100" alt="Vaibhavi Pandey" /><br/>
        <b>Vaibhavi Pandey</b>
      </a><br/>
      <sub>Team Member</sub>
    </td>
    <td align="center" width="200">
      <a href="https://github.com/Tushar-Gahlout">
        <img src="https://github.com/Tushar-Gahlout.png" width="100" alt="Tushar Gahlout" /><br/>
        <b>Tushar Gahlout</b>
      </a><br/>
      <sub>Team Member</sub>
    </td>
    <td align="center" width="200">
      <a href="https://github.com/sumitsanwal07">
        <img src="https://github.com/sumitsanwal07.png" width="100" alt="Sumit Sanwal" /><br/>
        <b>Sumit Sanwal</b>
      </a><br/>
      <sub>Team Member</sub>
    </td>
    <td align="center" width="200">
      <a href="https://github.com/sapna-bisht0103">
        <img src="https://github.com/sapna-bisht0103.png" width="100" alt="Sapna Bisht" /><br/>
        <b>Sapna Bisht</b>
      </a><br/>
      <sub>Team Member</sub>
    </td>
  </tr>
</table>

</div>

