# GombApp PWA Icons

This document explains the icon requirements for the GombApp Progressive Web App (PWA).

## Required Icon Sizes

The following icon sizes are required for full PWA compatibility across different devices and platforms:

| Size | Purpose | Status |
|------|---------|--------|
| 72x72 | Android low-resolution | Placeholder |
| 96x96 | Android medium-resolution | Placeholder |
| 128x128 | Chrome Web Store | Placeholder |
| 144x144 | Android medium-high resolution | Placeholder |
| 152x152 | iOS (iPad) | Placeholder |
| 192x192 | Android high-resolution, Apple Touch Icon | Placeholder |
| 384x384 | Android splash screen | Placeholder |
| 512x512 | Android splash screen, PWA install prompt | Placeholder |

### Maskable Icons

For better Android adaptive icon support, the following maskable icons are also needed:

| Size | Purpose | Status |
|------|---------|--------|
| 192x192 | Maskable icon for adaptive icon support | Placeholder |
| 512x512 | Maskable icon for adaptive icon support | Placeholder |

## Icon File Location

All icon files should be placed in the `GombApp/images/` directory with the following naming convention:

- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`
- `icon-maskable-192x192.png`
- `icon-maskable-512x512.png`

## Recommended Tools for Generating PWA Icons

You can use any of these tools to generate icons from a source image:

1. **PWA Builder** - https://www.pwabuilder.com/imageGenerator
   - Online tool, generates all required sizes
   - Supports maskable icon generation

2. **Real Favicon Generator** - https://realfavicongenerator.net/
   - Comprehensive favicon and PWA icon generator
   - Generates icons for all platforms

3. **PWA Asset Generator** - https://github.com/nickytonline/pwa-asset-generator
   - NPM package for generating PWA assets
   - Command line tool

4. **Maskable.app** - https://maskable.app/
   - Specifically for creating and testing maskable icons
   - Preview how icons will look on different Android devices

## Creating Icons from Source

### Requirements for Source Image

- Minimum size: 512x512 pixels (1024x1024 recommended)
- Format: PNG with transparency recommended
- Square aspect ratio
- Design should work well at small sizes

### Maskable Icon Guidelines

When creating maskable icons:

- Keep important content within the "safe zone" (the center 80% of the image)
- The outer 10% on each side may be cropped by the device
- Use a solid background color (#102135 recommended to match theme)

## Current Status

**⚠️ PLACEHOLDER STATUS**

Currently, the manifest.json references icon files that do not exist yet. The PWA will function but may not display proper icons until the actual icon files are created and placed in the `GombApp/images/` directory.

## Instructions for Adding Icons

1. Create or obtain a source image (512x512 or larger, square PNG)
2. Use one of the recommended tools to generate all required sizes
3. Download the generated icons
4. Rename files to match the naming convention above
5. Place all icon files in `GombApp/images/`
6. Test the PWA installation on Android to verify icons display correctly

## Testing

After adding icons, test the PWA by:

1. Opening the app in Chrome on Android
2. Tapping the browser menu and selecting "Add to Home Screen"
3. Verifying the icon appears correctly on the home screen
4. Opening the app from the home screen to verify it launches in standalone mode
