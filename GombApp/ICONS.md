# GombApp PWA Icons

This document explains the icon requirements for the GombApp Progressive Web App (PWA).

## Current Icon Status

✅ **Icons are now installed and configured!**

Icons are located in the `GombApp/appImages/` directory with the following structure:

- `appImages/android/` - Android launcher icons (48x48, 72x72, 96x96, 144x144, 192x192, 512x512)
- `appImages/ios/` - iOS icons (16px through 1024px)
- `appImages/windows11/` - Windows 11 tiles and logos

## Icons Used in manifest.json

| Size | File Path | Purpose |
|------|-----------|---------|
| 48x48 | `appImages/android/android-launchericon-48-48.png` | Android small |
| 72x72 | `appImages/android/android-launchericon-72-72.png` | Android low-res |
| 96x96 | `appImages/android/android-launchericon-96-96.png` | Android medium-res |
| 128x128 | `appImages/ios/128.png` | Chrome/general |
| 144x144 | `appImages/android/android-launchericon-144-144.png` | Android medium-high |
| 152x152 | `appImages/ios/152.png` | iOS iPad |
| 192x192 | `appImages/android/android-launchericon-192-192.png` | Android high-res, maskable |
| 512x512 | `appImages/ios/512.png` & `appImages/android/android-launchericon-512-512.png` | PWA install, splash, maskable |

## Apple Touch Icon

The Apple Touch Icon for iOS home screen is:
- `appImages/ios/192.png`

## Favicon

The browser favicon is:
- `appImages/android/android-launchericon-192-192.png`

## Testing

To test the PWA installation:

1. Open the app in Chrome/Edge at `http://127.0.0.1:5500/GombApp/index.html`
2. Look for the install icon in the address bar or use menu → "Install GombApp"
3. The app icon should appear on your home screen/desktop
4. Launch from home screen to verify standalone mode

## Updating Icons

If you need to regenerate icons:

1. Use [PWA Builder](https://www.pwabuilder.com/imageGenerator) or similar tool
2. Replace files in `GombApp/appImages/` directories
3. Clear browser cache and service worker to see changes
