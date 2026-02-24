<div align="center">

# 🛡️ SafeJourney NI

### *Stay safe. Explore freely.*

**A community-powered mobile app helping tourists in Northern Ireland stay protected from scams, pickpockets, and tourist-targeted threats.**

[![Built with Expo](https://img.shields.io/badge/Built%20with-Expo-000020?style=flat-square&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-20232A?style=flat-square&logo=react)](https://reactnative.dev)
[![Node.js ≥ 18](https://img.shields.io/badge/Node.js-%E2%89%A518-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![PSNI Partnership](https://img.shields.io/badge/PSNI-Liaison%20Reviewed-003366?style=flat-square)](https://www.psni.police.uk)

</div>

---

## 📖 Overview

SafeJourney NI gives tourists real-time, community-reported scam alerts on a live map of Northern Ireland. Whether you're visiting Belfast's Cathedral Quarter or heading out to the Giant's Causeway, the app keeps you informed and ready — with one-tap emergency calling built right in.

> 🗺️ Centred on Belfast (54.5973°N, 5.9301°W) · 🇬🇧 GB-restricted Places search · 📡 Offline-capable via seed data fallback

---

## ✨ Features at a Glance

| Screen | What it does |
|---|---|
| 🗺️ **Map** | Full-screen Google Maps with emoji-icon scam markers, severity filter pills, animated alert banners, and a Places Autocomplete search bar |
| 🚨 **Alerts** | Searchable, filterable FlatList of all community reports — pull to refresh |
| 📝 **Report** | 4-step incident wizard: pin location → pick category → describe → review & submit |
| 💡 **Tips** | 2-column grid of curated safety tips from PSNI & NI Tourist Board |
| 🆘 **Emergency** | One-tap call buttons for PSNI 999/101, Victim Support NI, Tourist Helpline, Ambulance, and UK Border Force |

---

## 🏗️ Architecture

```
hack/
├── App.js                        # Root entry — GestureHandler + SafeArea + Navigation
├── app.config.js                 # Expo dynamic config — injects .env at build time
├── .env                          # Local secrets template (gitignored)
│
└── src/
    ├── constants/
    │   ├── theme.js              # Design tokens: colors, typography, spacing, shadows
    │   └── scamData.js           # Static seed data: scam alerts + safety tips (API fallback)
    │
    ├── services/
    │   ├── api.js                # Axios base client — reads API_BASE_URL from Expo extras
    │   ├── scamService.js        # GET /scams — fetchScamAlerts(), fetchScamAlertsNear()
    │   ├── reportService.js      # POST /reports — submitReport()
    │   └── mapService.js         # Reverse geocoding via Google Maps, getBelfastRegion()
    │
    ├── hooks/
    │   └── useScamAlerts.js      # Custom hook wrapping scamService with loading/error state
    │
    ├── components/
    │   ├── AlertCard.js          # Severity colour-coded list card with icon and meta
    │   ├── SafetyTipCard.js      # Tip card — rendered in 2-column grid
    │   └── ScamMapMarker.js      # Custom Maps marker — emoji icon, severity border, callout tooltip
    │
    ├── screens/
    │   ├── HomeScreen.js         # ★ Full-screen map + Places Autocomplete search
    │   ├── ScamAlertsScreen.js   # Searchable, filterable scam report list
    │   ├── ReportScreen.js       # 4-step incident report wizard
    │   ├── SafetyTipsScreen.js   # 2-column safety tips grid
    │   └── EmergencyScreen.js    # Emergency contacts with one-tap calling
    │
    └── navigation/
        ├── TabNavigator.js       # Bottom tab bar: Map | Alerts | Tips | Emergency
        └── AppNavigator.js       # Root stack — tabs + Report as a modal
```

---

## 🔄 Data Flow

```
useScamAlerts() hook
  └── scamService.fetchScamAlerts()
        ├── [online]  GET /scams from API backend
        └── [offline] returns static SCAM_ALERTS seed from scamData.js

HomeScreen → GooglePlacesAutocomplete → animates MapView camera
HomeScreen → ScamMapMarker (per alert) → onPress → inline detail card
ReportScreen → submitReport() → POST /reports (graceful fail with logging)
```

---

## 🧭 Navigation Structure

```
NavigationContainer
└── AppNavigator (Stack)
    ├── Tabs (TabNavigator — Bottom Tabs)
    │   ├── 🗺️  Home     — Map + search
    │   ├── 🚨  Alerts   — Scam report list
    │   ├── 💡  Tips     — Safety tips grid
    │   └── 🆘  Emergency — One-tap contacts
    └── 📝  Report       — Modal wizard
```

---

## 🔐 API Security Model

Keys are **never hard-coded** in source files. They flow exclusively through Expo's `extra` config:

```
.env  (local · gitignored)
  ├── GOOGLE_MAPS_API_KEY
  ├── GOOGLE_PLACES_API_KEY
  └── API_BASE_URL
          │
          ▼  injected at build time by app.config.js
  ├── expo.ios.config.googleMapsApiKey       → native iOS plist
  ├── expo.android.config.googleMaps.apiKey  → Android manifest
  └── expo.extra.*                           → Constants.expoConfig.extra
          │
          ▼  consumed at runtime
  ├── api.js        → apiBaseUrl
  ├── mapService.js → googleMapsApiKey
  └── HomeScreen.js → googleMapsApiKey (Places Autocomplete)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Expo CLI** — `npm install -g expo-cli`
- **Expo Go** app on your iOS or Android device

### 1 · Clone & Install

```bash
git clone <your-repo>
cd hack
npm install
```

### 2 · Configure Environment Variables

```bash
cp .env .env.local   # Keep .env as the template; edit .env.local with real keys
```

Then fill in `.env`:

```env
GOOGLE_MAPS_API_KEY=AIza...
GOOGLE_PLACES_API_KEY=AIza...   # Can be the same key with Places API enabled
API_BASE_URL=https://api.safejourney-ni.com/v1
```

**Required Google Cloud APIs:**

| API | Purpose |
|-----|---------|
| Maps SDK for Android | Map rendering on Android |
| Maps SDK for iOS | Map rendering on iOS |
| Maps JavaScript API | Web preview support |
| Places API (New) | Autocomplete search bar |
| Geocoding API | Reverse geocoding in mapService |

### 3 · Run

```bash
npx expo start
```

| Key | Action |
|-----|--------|
| `i` | Open in iOS Simulator |
| `a` | Open in Android Emulator |
| 📱 | Scan QR code with Expo Go |

---

## 🎨 Design System

| Token | Color | Value |
|-------|-------|-------|
| Primary (Navy) | 🟦 | `#0B1F3A` |
| Accent (Amber) | 🟧 | `#F5A623` |
| Danger | 🔴 | `#D0021B` |
| Safe Green | 🟢 | `#27AE60` |
| Background | ⬜ | `#F5F7FA` |

**Type scale:** 11 / 13 / 15 / 17 / 20 / 24 / 30 px

---

## ⚙️ Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|:--------:|
| `GOOGLE_MAPS_API_KEY` | Maps SDK key (iOS + Android) | ✅ |
| `GOOGLE_PLACES_API_KEY` | Places API key | ✅ |
| `API_BASE_URL` | Backend API base URL | ⚠️ falls back to seed data |
| `EAS_PROJECT_ID` | Expo EAS project ID for OTA builds | optional |

---

## 🤝 Contributing

1. Branch naming: `feature/your-feature` or `fix/your-fix`
2. Run `npx expo start` and verify your changes before opening a PR
3. **Never commit `.env`** — it is gitignored for a reason

---

<div align="center">

*Built for the Northern Ireland tourist safety initiative.*
*Scam data is community-reported and reviewed by PSNI liaison officers.*

🇬🇧 &nbsp; Stay safe out there.

</div>
