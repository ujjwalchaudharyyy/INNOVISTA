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

<div align="center">

![Atomic](https://img.shields.io/badge/⚡_Atomic-Click_Enforcement-22C55E?style=for-the-badge)
![Latency](https://img.shields.io/badge/🚀_Zero-Latency_Lookup-3B82F6?style=for-the-badge)
![Screening](https://img.shields.io/badge/🛡️_Fraud-Domain_Screening-EF4444?style=for-the-badge)
![Privacy](https://img.shields.io/badge/🕵️_No-Invasive_Cookies-F59E0B?style=for-the-badge)

</div>

> ### 💭 Modern link routing is more than a simple HTTP `302` redirect.
> Enterprise platforms require **atomic click enforcement**, **zero-latency destination lookup**, **fraud/malware domain screening**, **campaign attribution funnels**, and **deep privacy-preserving analytics**, all **without relying on invasive client-side cookies**.

<br/>

<div align="center">

### ⚡ LinkPulse is engineered as a resilient full-stack platform that delivers:

</div>

<table>
<tr>
<td width="20%" align="center" valign="top">

### ⚡
**Sub-15ms Hot-Path**

![Route](https://img.shields.io/badge/-/r/:code-22C55E?style=flat-square)

Redirection with **atomic click increments**

</td>
<td width="20%" align="center" valign="top">

### 🕵️
**Privacy-First Telemetry**

![SHA](https://img.shields.io/badge/-SHA--256-3B82F6?style=flat-square)

Daily salted **IP hashing** and User-Agent heuristic parsing

</td>
<td width="20%" align="center" valign="top">

### 🔳
**Vector QR Studio**

![QR](https://img.shields.io/badge/-SVG_QR-F59E0B?style=flat-square)

Scalable QR matrices with **scan-attribution tags**

</td>
<td width="20%" align="center" valign="top">

### 🛡️
**Automated Security Shield**

![Shield](https://img.shields.io/badge/-Reputation-EF4444?style=flat-square)

Domain reputation screening and **password-protected enclaves**

</td>
<td width="20%" align="center" valign="top">

### 🎙
**Immersive 4K Sci-Fi UI**

![Audio](https://img.shields.io/badge/-Web_Audio-8B5CF6?style=flat-square)

Web Audio synth loops and **Web Speech API** narration

</td>
</tr>
</table>

---
---

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

```mermaid
sequenceDiagram
  autonumber
  participant U as 👤 User Browser
  participant G as ⚡ LinkPulse Gateway
  participant D as 🗄️ Prisma DB
  participant T as 🌍 Destination

  U->>G: GET /r/ph-launch
  G->>D: Query link and rules
  D-->>G: Return link record

  rect rgb(250, 238, 218)
    Note over G: 🛡️ Validate constraints
    Note over G: ✅ Is link active?
    Note over G: ⏳ Has link expired?
    Note over G: 🚧 Has click cap hit?
    Note over G: 🔍 Is destination safe?
  end

  rect rgb(225, 245, 238)
    G->>D: Atomic increment
    Note over G,D: 📡 Asynchronous telemetry
    Note over G,D: 🔒 Hash IP: SHA256 of IP plus Day
    Note over G,D: 📱 Parse UA: Device and OS
    Note over G,D: 🌎 Track Country and Referrer
  end

  G-->>U: HTTP 302 Found, Location: destination

  rect rgb(230, 241, 251)
    U->>T: Follow 302 🚀
  end
```
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

<div align="center">

![Video](https://img.shields.io/badge/🌌_4K_Video-Cosmic_Loop-6366F1?style=for-the-badge)
![Audio](https://img.shields.io/badge/🎵_Audio-Trap_Beat-EC4899?style=for-the-badge)
![Voice](https://img.shields.io/badge/🤖_AI_Voice-Web_Speech_API-22C55E?style=for-the-badge)
![Ducking](https://img.shields.io/badge/🔉_Smart-Ducking-F59E0B?style=for-the-badge)

*LinkPulse ke **Login** aur **Onboarding** views mein ek immersive audio-visual layer hai.*

</div>

### 🔄 How it works

```mermaid
flowchart LR
  A["🌌 Login opens<br/>4K video loops"] --> B["🎵 Beat starts<br/>Music loop"]
  B -->|"after 3 sec"| C["🤖 AI voice intro<br/>LinkPulse capabilities"]
  C --> D["🔉 Smart ducking<br/>0.38 to 0.16"]

  classDef video fill:#CECBF6,stroke:#534AB7,color:#26215C,stroke-width:1.5px
  classDef music fill:#F4C0D1,stroke:#993556,color:#4B1528,stroke-width:1.5px
  classDef voice fill:#9FE1CB,stroke:#0F6E56,color:#04342C,stroke-width:1.5px
  classDef duck fill:#FAC775,stroke:#854F0B,color:#412402,stroke-width:1.5px

  class A video
  class B music
  class C voice
  class D duck
```

### 🧩 Feature breakdown

<table>
<tr>
<td width="50%" valign="top">

#### 🌌 4K Cosmic Background
![HTML5](https://img.shields.io/badge/HTML5-Video_Canvas-E34F26?style=flat-square&logo=html5&logoColor=white) ![CSS](https://img.shields.io/badge/CSS-Filters-1572B6?style=flat-square&logo=css3&logoColor=white)

- 🛠️ **Tech:** Native HTML5 Video Canvas with hardware-accelerated CSS filters (`contrast`, `saturate`, `brightness`)
- ✨ **Behavior:** Continuous seamless loop with trailing **3-second auto-trim**

</td>
<td width="50%" valign="top">

#### 🎵 Trap Beat Looper
![Audio](https://img.shields.io/badge/HTML5-Audio_Engine-EC4899?style=flat-square) ![File](https://img.shields.io/badge/File-bg--music.mp3-DB2777?style=flat-square)

- 🛠️ **Tech:** Custom HTML5 Audio Engine (`/bg-music.mp3`)
- ✨ **Behavior:** Auto-loops continuously, with a precision **40ms interval** that crops the last 3 seconds to keep the rhythm tight

</td>
</tr>
<tr>
<td width="50%" valign="top">

#### 🤖 Autonomous AI Voice
![API](https://img.shields.io/badge/Web_Speech-API-22C55E?style=flat-square) ![Rate](https://img.shields.io/badge/rate-0.95-16A34A?style=flat-square) ![Pitch](https://img.shields.io/badge/pitch-0.92-15803D?style=flat-square)

- 🛠️ **Tech:** Browser Web Speech API (`SpeechSynthesisUtterance`)
- ✨ **Behavior:** Calm AI narration introducing LinkPulse capabilities **3 seconds after the music starts**

</td>
<td width="50%" valign="top">

#### 🔉 Smart Audio Ducking
![Gain](https://img.shields.io/badge/Volume-0.38_→_0.16-F59E0B?style=flat-square) ![Mode](https://img.shields.io/badge/Dynamic-Gain_Scaling-D97706?style=flat-square)

- 🛠️ **Tech:** Dynamic gain and volume scaling (`0.38` ➔ `0.16`)
- ✨ **Behavior:** Music volume drops during AI narration so the voice stays **crystal clear**

</td>
</tr>
<tr>
<td colspan="2" valign="top">

#### 🔇 Sound State Protection
![Ref](https://img.shields.io/badge/Memory--backed-isMutedRef-3B82F6?style=flat-square) ![Events](https://img.shields.io/badge/Gesture-Event_Lifecycle-1D4ED8?style=flat-square)

- 🛠️ **Tech:** Memory-backed `isMutedRef` plus gesture event lifecycle
- ✨ **Behavior:** Clicking **"Sound Off"** cleanly stops playback and prevents accidental auto-resumption

</td>
</tr>
</table>

---
## 🛠 Tech Stack Specification

<div align="center">

![React](https://img.shields.io/badge/React_18.3-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js_18+-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_5+-3982CE?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

</div>

<br/>

<table>
<tr>
<td width="50%" valign="top">

### 🎨 Frontend

| | Technology | Details |
|:---:|:---|:---|
| ⚛️ | ![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) | **Framework:** React 18.3 with TypeScript |
| ⚡ | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | **Bundler:** Vite 8.3 |
| 🎨 | ![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) | **Styling:** Tailwind CSS, PostCSS, custom glassmorphism theme |
| 📊 | ![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=flat-square) | **Charts:** Area, Bar, Pie, Responsive Containers |
| 🔷 | ![Lucide](https://img.shields.io/badge/Lucide-F56565?style=flat-square&logo=lucide&logoColor=white) | **Icons:** Lucide React |
| 🌐 | ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white) | **HTTP:** Axios with automated JWT auth interceptors |

</td>
<td width="50%" valign="top">

### ⚙️ Backend

| | Technology | Details |
|:---:|:---|:---|
| 🟢 | ![Node](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white) | **Runtime:** Node.js v18+ |
| 🚂 | ![Express](https://img.shields.io/badge/Express-404D59?style=flat-square&logo=express&logoColor=white) | **Framework:** Express.js with TypeScript |
| 💎 | ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat-square&logo=prisma&logoColor=white) | **ORM:** Prisma v5+ |
| 🗄️ | ![DB](https://img.shields.io/badge/SQLite_/_PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white) | **Database:** SQLite (dev) / PostgreSQL (prod-ready) |
| 🔐 | ![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white) | **Security:** JWT, bcryptjs (salt factor 10), Express Rate Limiter |
| 📡 | ![Crypto](https://img.shields.io/badge/UAParser_+_Crypto-F59E0B?style=flat-square) | **Telemetry:** UAParser.js, Node.js Crypto (SHA-256) |

</td>
</tr>
</table>

---
### 🗺 Roadmap

<div align="center">

![Progress](https://img.shields.io/badge/Progress-50%25-22C55E?style=for-the-badge)
![Done](https://img.shields.io/badge/✅_Completed-5-22C55E?style=for-the-badge)
![Planned](https://img.shields.io/badge/🚧_Upcoming-5-F59E0B?style=for-the-badge)

</div>

```mermaid
flowchart LR
  A["✅ Phase 1<br/>Core Platform"] --> B["🚧 Phase 2<br/>Growth Features"] --> C["🔮 Phase 3<br/>Scale and Ecosystem"]

  classDef done fill:#C0DD97,stroke:#3B6D11,color:#173404,stroke-width:1.5px
  classDef next fill:#FAC775,stroke:#854F0B,color:#412402,stroke-width:1.5px
  classDef future fill:#CECBF6,stroke:#534AB7,color:#26215C,stroke-width:1.5px

  class A done
  class B next
  class C future
```

### ✅ Phase 1: Core Platform (Completed)

| Status | Feature | Description |
|:---:|:---|:---|
| ![Done](https://img.shields.io/badge/-DONE-22C55E?style=flat-square) | ⚡ **Atomic Redirects & Click Telemetry** | Sub-15ms hot-path with privacy-first analytics |
| ![Done](https://img.shields.io/badge/-DONE-22C55E?style=flat-square) | 🔳 **QR Studio** | SVG and PNG QR codes with scan attribution |
| ![Done](https://img.shields.io/badge/-DONE-22C55E?style=flat-square) | 🎯 **Campaigns & Bulk CSV Import** | Campaign funnels and validated batch uploads |
| ![Done](https://img.shields.io/badge/-DONE-22C55E?style=flat-square) | 🛡️ **Admin Domain Shield** | Platform-wide malicious domain blocklist |
| ![Done](https://img.shields.io/badge/-DONE-22C55E?style=flat-square) | 🎙 **AI Voice & Cinematic UI** | 4K video, beat looper and AI narration |

### 🚧 Phase 2: Growth Features (Upcoming)

| Status | Feature | Description |
|:---:|:---|:---|
| ![Planned](https://img.shields.io/badge/-PLANNED-F59E0B?style=flat-square) | 🌐 **Custom Domains** | Use your own domain for short links |
| ![Planned](https://img.shields.io/badge/-PLANNED-F59E0B?style=flat-square) | 👥 **Team Workspaces & Invites** | Collaborate with roles and permissions |
| ![Planned](https://img.shields.io/badge/-PLANNED-F59E0B?style=flat-square) | 🗺️ **Geo-Location Map Analytics** | Visual world map of clicks |

### 🔮 Phase 3: Scale & Ecosystem (Future)

| Status | Feature | Description |
|:---:|:---|:---|
| ![Future](https://img.shields.io/badge/-FUTURE-8B5CF6?style=flat-square) | 🔑 **Public API Keys & Webhooks** | Let developers integrate LinkPulse |
| ![Future](https://img.shields.io/badge/-FUTURE-8B5CF6?style=flat-square) | 🔗 **Link-in-Bio Pages** | Personal landing pages with multiple links |

---

<div align="center">

💡 **Koi idea ya feature request hai?** [Open an issue](https://github.com/ujjwalchaudharyyy/INNOVISTA/issues) ya Pull Request bhejo!

</div>








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

<div align="center">

![Node](https://img.shields.io/badge/Node.js-18.x+-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![npm](https://img.shields.io/badge/npm-9.x+-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-localhost:5000-22C55E?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-localhost:5173-3B82F6?style=for-the-badge)

</div>

### 📋 Prerequisites

<table>
<tr>
<td width="50%" align="center">

### 🟢 Node.js
![Node](https://img.shields.io/badge/Version-18.x_or_higher-43853D?style=flat-square&logo=node.js&logoColor=white)

Check karo: `node -v`

</td>
<td width="50%" align="center">

### 📦 npm
![npm](https://img.shields.io/badge/Version-9.x_or_higher-CB3837?style=flat-square&logo=npm&logoColor=white)

Check karo: `npm -v`

</td>
</tr>
</table>

### 💻 Local Development Setup

```mermaid
flowchart LR
  A["📥 Clone<br/>repo"] --> B["⚙️ Backend<br/>install, db push, seed"] --> C["▶️ Backend runs<br/>port 5000"] --> D["🎨 Frontend<br/>install"] --> E["🚀 Frontend runs<br/>port 5173"]

  classDef s0 fill:#D3D1C7,stroke:#5F5E5A,color:#2C2C2A,stroke-width:1.5px
  classDef be fill:#9FE1CB,stroke:#0F6E56,color:#04342C,stroke-width:1.5px
  classDef fe fill:#CECBF6,stroke:#534AB7,color:#26215C,stroke-width:1.5px

  class A s0
  class B,C be
  class D,E fe
```

#### 📥 Step 0: Clone the repository

```bash
git clone https://github.com/ujjwalchaudharyyy/INNOVISTA.git
cd INNOVISTA
```

---

#### ⚙️ Step 1: Backend Server Setup
![Backend](https://img.shields.io/badge/Express-TypeScript-404D59?style=flat-square&logo=express&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-ORM-3982CE?style=flat-square&logo=prisma&logoColor=white)

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

> ✅ **Server will be available at:** [`http://localhost:5000`](http://localhost:5000)

---

#### 🎨 Step 2: Frontend Client Setup
![React](https://img.shields.io/badge/React-18-20232A?style=flat-square&logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite-Dev_Server-646CFF?style=flat-square&logo=vite&logoColor=white)

```bash
# Open a new terminal and navigate to client directory
cd client

# Install dependencies
npm install

# Launch Vite development server
npm run dev
```

> ✅ **Frontend will be available at:** [`http://localhost:5173`](http://localhost:5173)

---

### 🎉 You're all set!

<div align="center">

| Service | URL | Status |
|:---:|:---:|:---:|
| ⚙️ **Backend API** | `http://localhost:5000` | ![Running](https://img.shields.io/badge/-RUNNING-22C55E?style=flat-square) |
| 🎨 **Frontend App** | `http://localhost:5173` | ![Running](https://img.shields.io/badge/-RUNNING-22C55E?style=flat-square) |

🔑 Login ke liye [Demo Credentials](#-demo-credentials) use karo.

</div>

---
## ☁️ 1-Click Vercel Deployment

<div align="center">

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ujjwalchaudharyyy/INNOVISTA)

![Zero Config](https://img.shields.io/badge/⚙️_Zero-Configuration-000000?style=for-the-badge&logo=vercel&logoColor=white)
![SPA](https://img.shields.io/badge/🔀_SPA-Routing_Ready-22C55E?style=for-the-badge)
![Auto Build](https://img.shields.io/badge/🏗️_Auto-Build-3B82F6?style=for-the-badge)

*LinkPulse mein root aur client dono jagah `vercel.json` pehle se configured hai, isliye **zero-configuration deployment** hota hai.*

</div>

```mermaid
flowchart LR
  A["📥 Step 1<br/>Import repo<br/>in Vercel"] --> B["🔧 Step 2<br/>Add env variable<br/>VITE_API_URL"] --> C["🚀 Step 3<br/>Click Deploy"] --> D["✅ Live<br/>Client built and<br/>SPA routing handled"]

  classDef s1 fill:#CECBF6,stroke:#534AB7,color:#26215C,stroke-width:1.5px
  classDef s2 fill:#FAC775,stroke:#854F0B,color:#412402,stroke-width:1.5px
  classDef s3 fill:#B5D4F4,stroke:#185FA5,color:#042C53,stroke-width:1.5px
  classDef s4 fill:#C0DD97,stroke:#3B6D11,color:#173404,stroke-width:1.5px

  class A s1
  class B s2
  class C s3
  class D s4
```

<table>
<tr>
<td width="33%" valign="top" align="center">

### 📥 Step 1
**Import Repository**

Apni **[Vercel Dashboard](https://vercel.com/new)** mein ye repository import karo.

</td>
<td width="33%" valign="top" align="center">

### 🔧 Step 2
**Environment Variables**

Vercel mein variable configure karo (neeche table dekho).

</td>
<td width="33%" valign="top" align="center">

### 🚀 Step 3
**Click Deploy**

Vercel khud **client build** karega aur **SPA routing** seamlessly handle karega.

</td>
</tr>
</table>

### 🔧 Environment Variables

| Variable | Required | Description | Example |
|:---:|:---:|:---|:---|
| `VITE_API_URL` | ![Required](https://img.shields.io/badge/-REQUIRED-EF4444?style=flat-square) | Tumhara hosted **backend URL** | `https://your-api.onrender.com` <br/> `https://api.yourdomain.com` |

> 💡 **Tip:** Backend alag deploy karna hota hai (jaise Render par). Pehle backend ka URL lo, phir use `VITE_API_URL` mein daalo.

**🌐 Live deployment:** 👉 [**innovista-black.vercel.app**](https://innovista-black.vercel.app/)

---

## 🔑 Demo Credentials

<div align="center">

![Pre-seeded](https://img.shields.io/badge/🌱_Pre--Seeded-Accounts-22C55E?style=for-the-badge)
![Evaluation](https://img.shields.io/badge/🧪_For-Platform_Evaluation-3B82F6?style=for-the-badge)

*Platform evaluate karne ke liye pehle se banaye gaye login credentials.*

</div>

<table>
<tr>
<td width="50%" valign="top">

### 👤 Standard User
![Role](https://img.shields.io/badge/Role-User-3B82F6?style=flat-square) ![Name](https://img.shields.io/badge/Name-Sarah_Chen-6366F1?style=flat-square)

| | |
|:---|:---|
| 📧 **Email** | `demo@linkpulse.io` |
| 🔒 **Password** | `Demo@123456` |

**✅ Permissions**
- 🔗 Full link creation
- 🎯 Campaigns
- 🔳 QR Studio
- 📥 Bulk CSV
- 📊 Analytics

</td>
<td width="50%" valign="top">

### 👑 Administrator
![Role](https://img.shields.io/badge/Role-Admin-EF4444?style=flat-square) ![Name](https://img.shields.io/badge/Name-Alex_Vance-DC2626?style=flat-square)

| | |
|:---|:---|
| 📧 **Email** | `admin@linkpulse.io` |
| 🔒 **Password** | `Admin@123456` |

**✅ Permissions**
- ✨ All user capabilities
- 🛡️ Admin Shield
- 🚫 Domain blocklists
- 🛰️ Platform metrics

</td>
</tr>
</table>

<div align="center">

[![Try Live Demo](https://img.shields.io/badge/🚀_Login_on_Live_Demo-innovista--black.vercel.app-00C853?style=for-the-badge)](https://innovista-black.vercel.app/)

</div>

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

