// app.config.js — Expo dynamic configuration
// All secrets are loaded from .env at build time and injected into
// Constants.expoConfig.extra — they are NEVER bundled as plain strings.
import 'dotenv/config';

export default {
    expo: {
        name: 'SafeJourney NI',
        slug: 'safejourney-ni',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/icon.png',
        userInterfaceStyle: 'automatic',
        splash: {
            image: './assets/splash.png',
            resizeMode: 'contain',
            backgroundColor: '#0B1F3A',
        },
        ios: {
            supportsTablet: true,
            bundleIdentifier: 'com.safejourney.ni',
            // This is what enables Google Maps on iOS
            config: {
                googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
            },
            infoPlist: {
                NSLocationWhenInUseUsageDescription:
                    'SafeJourney NI uses your location to show nearby scam alerts.',
                NSLocationAlwaysAndWhenInUseUsageDescription:
                    'SafeJourney NI uses your location to show nearby scam alerts.',
            },
        },
        android: {
            adaptiveIcon: {
                foregroundImage: './assets/adaptive-icon.png',
                backgroundColor: '#0B1F3A',
            },
            package: 'com.safejourney.ni',
            // This enables Google Maps on Android
            config: {
                googleMaps: {
                    apiKey: process.env.GOOGLE_MAPS_API_KEY,
                },
            },
            permissions: [
                'ACCESS_FINE_LOCATION',
                'ACCESS_COARSE_LOCATION',
                'CALL_PHONE',
            ],
        },
        web: {
            favicon: './assets/favicon.png',
        },
        plugins: [
            [
                'expo-location',
                {
                    locationAlwaysAndWhenInUsePermission:
                        'SafeJourney NI needs your location to show nearby scam alerts.',
                },
            ],
        ],
        extra: {
            // Injected at build time from .env — accessible via Constants.expoConfig.extra
            googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
            googlePlacesApiKey: process.env.GOOGLE_PLACES_API_KEY,
            apiBaseUrl: process.env.API_BASE_URL,
            eas: {
                projectId: process.env.EAS_PROJECT_ID,
            },
        },
    },
};
