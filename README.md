# SHUBH DEEP — शुभ दीपावली 🪔

> **An interactive, mindful Diwali greeting website crafted with Earthy Indian Minimalism.**

Experience a serene celebration of light, warmth, and heartfelt connections. Designed with traditional clay diya illumination, falling marigold petals, delicate rangoli art, curated shayaris, and an interactive 3D gift reveal.

---

## 🎨 Design Philosophy — Earthy Indian Minimalism

The visual language is grounded in organic, natural Indian heritage:
- **Warm Ivory (`#F3EBDD`)**: Soothing handloom khadi paper foundation.
- **Terracotta (`#B96543`)**: Handcrafted earthen clay diya tone.
- **Muted Olive (`#78805B`)**: Fresh mango leaf toran and foliage.
- **Deep Brown (`#49382E`)**: High-contrast, warm editorial typography.
- **Muted Mustard (`#D5A75B`)**: Gentle festive marigold accents.

---

## ✨ Features

- **Full-Screen Welcome Hero**: Atmospheric introduction with traditional Devanagari typography (*Rozha One* & *Noto Serif Devanagari*), swaying mango leaf toran, and subtle bell chimes.
- **Interactive Terracotta Diya**: Unlit earthen diya that sparks to life upon interaction, igniting a realistic flickering flame, ambient radial glow, and celebratory sparklers.
- **Magical Ambience**: Dual-layer falling marigold petal canvas and blooming sacred geometric Rangoli reveal with toggleable ambient controls.
- **Festive Shayari & Wishes Experience**: 27 curated messages across 3 categories:
  - 🎭 *Funny Shayari* (playful, clean Diwali humor)
  - 💛 *Heartwarming Wishes* (deep emotional blessings)
  - ✨ *A Little Flirt* (charming, tasteful, and respectful compliments)
  - Features dynamic random selection and 1-click clipboard copy.
- **Final Surprise & Gift Reveal**: Interactive illustrated gift box with 3D lid lifting animation, blooming inner golden aura, personalized verse reveal, and magic replay.
- **Zero-Dependency Sound Engine**: Synthesized sacred temple chimes and acoustic tanpura harmonic drone using the native Web Audio API (strictly muted by default).
- **Privacy First**: Zero social tracking, zero WhatsApp/social share SDKs, and full accessibility support (`prefers-reduced-motion`).

---

## 🚀 How to Run Locally

### 1. Prerequisites
Ensure you have **Node.js** (version 18 or newer) and **npm** installed on your system:
```bash
node -v
npm -v
```

### 2. Clone or Open the Project
Open your terminal and navigate to the project directory:
```bash
cd "Diwali wishes"
```

### 3. Install Dependencies
Run npm install to set up all required packages:
```bash
npm install
```

### 4. Start Development Server
Launch the local Vite development server:
```bash
npm run dev
```

Your terminal will display:
```text
  VITE v6.x.x  ready in ~150 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open **`http://localhost:5173`** in your web browser to experience the site with instant Hot Module Replacement (HMR).

---

## 📦 Building for Production

To create an optimized, minified production build:
```bash
npm run build
```
This compiles TypeScript and bundles assets into the `dist/` directory.

To preview the production build locally:
```bash
npm run preview
```
Open the generated preview URL (typically `http://localhost:4173/`).

---

## 🛠️ Tech Stack

- **Framework:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler:** [Vite 6](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 3](https://tailwindcss.com/)
- **Audio:** Web Audio API (native synthesized oscillators)
- **Canvas:** HTML5 Canvas 2D (optimized 60 FPS physics loops)
- **Icons:** [Lucide React](https://lucide.dev/)
# Diwali-wishes
