# SafeJourney NI 🛡️

> A React Native (Expo) mobile app helping tourists in Northern Ireland stay safe from scams, pickpockets, and other tourist-targeted threats.

---

## Architecture Overview

```
hack/
├── App.js                        # Root entry — GestureHandler + SafeArea + Navigation
├── app.config.js                 # Expo dynamic config — injects .env at build time (NEVER commit secrets)
├── .env                          # Local secrets template (gitignored)
├── .gitignore
├── package.json
│
└── src/
    ├── constants/
    │   ├── theme.js              # Design tokens: colors, typography, spacing, shadows
    │   └── scamData.js           # Static seed data: scam alerts + safety tips (used as API fallback)
    │
    ├── services/
    │   ├── api.js                # Axios base client — reads API_BASE_URL from Expo config extras
    │   ├── scamService.js        # GET /scams — fetchScamAlerts(), fetchScamAlertsNear()
    │   ├── reportService.js      # POST /reports — submitReport()
    │   └── mapService.js        # Reverse geocoding via Google Maps Geocoding API, getBelfastRegion()
    │
    ├── hooks/
    │   └── useScamAlerts.js      # Custom React hook wrapping scamService with loading/error state
    │
    ├── components/
    │   ├── AlertCard.js          # Scam alert list card — severity colour-coded, with icon and meta
    │   ├── SafetyTipCard.js      # Safety tip card — used in 2-column grid
    │   └── ScamMapMarker.js      # Custom Google Maps marker — emoji icon, severity border, callout tooltip
    │
    ├── screens/
    │   ├── HomeScreen.js         # ★ Primary screen: full-screen Google Map + Places Autocomplete search bar
    │   ├── ScamAlertsScreen.js   # Searchable, filterable FlatList of all scam reports
    │   ├── ReportScreen.js       # 4-step incident report wizard (map pin → category → desc → review)
    │   ├── SafetyTipsScreen.js   # 2-column grid of curated safety tips
    │   └── EmergencyScreen.js    # Emergency contacts — one-tap call (999, PSNI 101, Victim Support NI)
    │
    └── navigation/
        ├── TabNavigator.js       # Bottom tab bar: Map | Alerts | Tips | Emergency
        └── AppNavigator.js       # Root stack navigator — wraps tabs, Report as a modal
```

---

## Screens

| Screen | Description |
|--------|-------------|
| **Map (Home)** | Full-screen Google Maps centred on Belfast (54.5973°N, 5.9301°W). Emoji-icon markers for each scam hotspot. Google Places Autocomplete search bar restricted to `country:gb`. Severity filter pills (All / Critical / High / Medium / Low). Animated alert count banner. Tap marker → inline detail card. |
| **Alerts** | Scrollable, searchable FlatList of all scam reports. Filter by category chip. Pull-to-refresh. |
| **Report** | 4-step wizard: ① tap map to pin location ② pick category ③ describe incident ④ review & submit. |
| **Tips** | 2-column responsive grid of curated safety tips from PSNI / NI Tourist Board. |
| **Emergency** | Prominent SOS banner + contact cards for PSNI 999/101, Victim Support NI, Tourist Helpline, Ambulance, UK Border Force. One-tap to call via `Linking.openURL('tel:...')`. |

---

## API Security Model

```
.env (local, gitignored)
  └── GOOGLE_MAPS_API_KEY=...
  └── GOOGLE_PLACES_API_KEY=...
  └── API_BASE_URL=...
        │
        ▼  (read at build time by app.config.js)
app.config.js (expo dynamic config)
  └── expo.ios.config.googleMapsApiKey     ← injected into native iOS plist
  └── expo.android.config.googleMaps.apiKey← injected into native Android manifest
  └── expo.extra.googleMapsApiKey          ← accessible via Constants.expoConfig.extra
        │
        ▼  (consumed at runtime)
src/services/api.js      → Constants.expoConfig.extra.apiBaseUrl
src/services/mapService.js→ Constants.expoConfig.extra.googleMapsApiKey
src/screens/HomeScreen.js → Constants.expoConfig.extra.googleMapsApiKey (Places Autocomplete)
```

**Keys are never hard-coded** in source files. They flow exclusively through Expo's `extra` config.

---

## Setup

### 1. Prerequisites
- Node.js ≥ 18
- Expo CLI: `npm install -g expo-cli`
- Expo Go on your device (iOS/Android)

### 2. Clone & Install
```bash
git clone <your-repo>
cd hack
npm install
```

### 3. Configure Environment Variables
```bash
cp .env .env.local   # Keep .env as the template; edit .env.local with real keys
```

Edit `.env` and fill in your keys:
```
GOOGLE_MAPS_API_KEY=AIza...
GOOGLE_PLACES_API_KEY=AIza...   # Can be the same key with Places API enabled
API_BASE_URL=https://api.safejourney-ni.com/v1
```

**Required Google Cloud APIs to enable:**
- Maps SDK for Android
- Maps SDK for iOS
- Maps JavaScript API
- Places API (New)
- Geocoding API

### 4. Run
```bash
npx expo start
```
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go on a physical device

---

## Navigation Flow

```
NavigationContainer
└── AppNavigator (Stack)
    ├── Tabs (TabNavigator — Bottom Tabs)
    │   ├── Home (HomeScreen)       ← map + search
    │   ├── Alerts (ScamAlertsScreen)
    │   ├── Tips (SafetyTipsScreen)
    │   └── Emergency (EmergencyScreen)
    └── Report (ReportScreen)      ← modal, accessible from Home header
```

---

## Data Flow

```
useScamAlerts() hook
  └── scamService.fetchScamAlerts()
        ├── [online]  GET /scams from API backend
        └── [offline] returns static SCAM_ALERTS seed from scamData.js

HomeScreen → GooglePlacesAutocomplete → animates MapView camera
HomeScreen → ScamMapMarker (per alert) → onPress → inline detail card
ReportScreen → submitReport() → POST /reports (or logs gracefully on failure)
```

---

## Design System

| Token | Value |
|-------|-------|
| Primary (navy) | `#0B1F3A` |
| Accent (amber) | `#F5A623` |
| Danger | `#D0021B` |
| Safe green | `#27AE60` |
| Background | `#F5F7FA` |
| Font scale | 11 / 13 / 15 / 17 / 20 / 24 / 30 px |

---

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_MAPS_API_KEY` | Google Maps SDK key (iOS + Android) | ✅ |
| `GOOGLE_PLACES_API_KEY` | Google Places API key | ✅ |
| `API_BASE_URL` | Backend API base URL | ⚠️ (falls back to seed data) |
| `EAS_PROJECT_ID` | Expo EAS project ID for OTA + builds | Optional |

---

## Contributing

1. Branch naming: `feature/your-feature` or `fix/your-fix`
2. Run `npx expo start` before submitting a PR
3. Never commit `.env` — add to `.gitignore`

---

*Built for the Northern Ireland tourist safety initiative. Scam data is community-reported and reviewed by PSNI liaison officers.*
