# Kamanashis Biswas — 3D Interactive Science Lab Portfolio

> An immersive, cinematic 3D Science Laboratory portfolio built with **Next.js 15 (App Router)**, **React 19**, **Three.js**, and **TypeScript**.

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=flat&logo=three.js)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

---

## 🌟 Highlights & Features

- **Cinematic 3D Laboratory**: Procedural WebGL environment featuring realistic PBR materials, ACESFilmic tone-mapping, dynamic soft shadows, and holographic particle cores.
- **First-Person & Drone Navigation**: Explore via desktop keyboard/mouse controls (WASD + Pointer Lock), one-click fast teleportation, or dedicated mobile virtual joystick & touch rotation.
- **Cinematic Flythrough Intro**: Director-style multi-angle camera sequence welcoming visitors, with instant skip and interactive explore options.
- **Procedural Sound Engine**: Synthesizes futuristic sci-fi sound effects (terminal open, proximity pings, button clicks) directly using the browser's native **Web Audio API** — 0 external audio files, 0 load latency.
- **9 Interactive Laboratory Stations**:
  1. `Station 01 // Profile` — Biography, core pillars, and professional background.
  2. `Station 02 // Tech Array` — Interactive radar/progress visualization of frontend, backend, database, and devops proficiencies.
  3. `Station 03 // Antigravity Pod` — Flagship interactive application showcase.
  4. `Station 04 // University ERP Pod` — Enterprise academic platform showcase.
  5. `Station 05 // Dashboard Pod` — High-density telemetry & analytics operational platform.
  6. `Station 06 // Commerce Pod` — MERN full-stack digital marketplace.
  7. `Station 07 // Education Archive` — Academic degrees (M.Sc. IICT at KUET & B.Sc. in Software Engineering).
  8. `Station 08 // Certificate Archive` — Verified software development credentials.
  9. `Station 09 // Comms Relay` — Direct contact portal and social networks.
- **Dual Mode (3D & 2D)**: Instant toggle between the immersive 3D laboratory and an accessible, fast-loading 2D conventional portfolio view.
- **100% Procedural Geometry & Textures**: Zero heavy 3D mesh files (.gltf / .obj) to download, guaranteeing ultra-fast initial page loads and 60 FPS performance across devices.

---

## 📁 Project Structure

```text
├── app/
│   ├── globals.css              # Tailwind CSS v4 styling & cyber glow utilities
│   ├── layout.tsx               # Root Next.js layout & SEO metadata
│   └── page.tsx                 # Dynamic client entry point with WebGL detection
├── components/
│   ├── 3d/
│   │   ├── LaboratoryScene.tsx          # Main WebGL canvas lifecycle & render loop
│   │   ├── LaboratoryEnvironment.ts     # PBR architectural lab geometry & stations
│   │   ├── PlayerController.ts          # WASD, collision boxes & pointer-lock logic
│   │   ├── CinematicIntroController.ts  # Multi-scene camera animation controller
│   │   └── ProceduralTextures.ts        # Canvas-generated sci-fi textures
│   └── ui/
│       ├── PortfolioHUD.tsx             # Minimalist cyberpunk HUD & quick teleport dock
│       ├── StationModal.tsx             # Detailed inspection terminal for stations
│       ├── ConventionalPortfolioView.tsx# Full-featured 2D accessible view
│       ├── CinematicIntroOverlay.tsx    # Intro sequence subtitles & controls
│       └── MobileControls.tsx           # Virtual touch joystick & mobile navigation
├── data/
│   └── portfolioData.ts         # Strongly typed single source of truth for portfolio data
├── hooks/
│   └── use-mobile.ts            # Viewport & device detection hook
└── lib/
    ├── soundEffects.ts          # Procedural Web Audio API sound synthesizer
    └── utils.ts                 # Class merger utility (clsx + tailwind-merge)
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.18.0 or newer recommended)
- `npm` or `bun`

### Installation

```bash
# Clone the repository
git clone https://github.com/kamanashisbiswas007/3D-Portfolio.git

# Navigate into the project folder
cd 3D-Portfolio

# Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to experience the 3D lab.

### Production Build

```bash
npm run build
npm run start
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **3D Graphics**: Three.js (WebGL, PBR, ACESFilmicToneMapping)
- **Animation**: Motion & Three.js Clock
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Audio**: Web Audio API (Procedural Oscillator Synthesis)
- **Language**: TypeScript (Strict Mode)

---

## 👤 Author

**Kamanashis Biswas**
- Website: [kamanashisbiswas.com](https://www.kamanashisbiswas.com/)
- LinkedIn: [linkedin.com/in/kamanashisbiswas](https://www.linkedin.com/in/kamanashisbiswas)
- GitHub: [@kamanashisbiswas007](https://github.com/kamanashisbiswas007)
- Email: [kamanashisbiswas007@gmail.com](mailto:kamanashisbiswas007@gmail.com)

---

## 📄 License

MIT © [Kamanashis Biswas](https://github.com/kamanashisbiswas007)
