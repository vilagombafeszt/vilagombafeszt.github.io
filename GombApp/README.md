# GombApp

**Version: v1.1.0**

GombApp is a Progressive Web App (PWA) for the Vilagomba Festival, providing order management, program schedules, and ticket sales functionality.

## Features

- **Admin Panel** - View statistics for bartender and food server sales
- **Bartender Module** - Order drinks and track sales
- **Programs** - View festival programs in real-time or agenda format
- **Ticket Clerk** - Sell festival passes and day tickets

## PWA Features

GombApp is now a Progressive Web App with the following capabilities:

### 📱 Installation

You can install GombApp on your device for a native app-like experience:

#### Android (Chrome)
1. Open GombApp in Chrome browser
2. Tap the browser menu (three dots)
3. Select "Add to Home Screen" or "Install App"
4. The app will appear on your home screen with its icon
5. Launch from home screen for fullscreen experience

#### iOS (Safari)
1. Open GombApp in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. The app will be added to your home screen

#### Desktop (Chrome/Edge)
1. Open GombApp in Chrome or Edge
2. Click the install icon in the address bar, or
3. Click the browser menu and select "Install GombApp"

### 🔌 Offline Support

After your first visit, GombApp caches essential files and can work offline:

- All pages and navigation work offline
- Static content (images, styles) available offline
- Note: Real-time features (Google Calendar, Firebase) require internet connection

### 🎨 Standalone Mode

When installed, GombApp runs in standalone mode:

- No browser address bar or navigation
- Full-screen experience
- Theme color matches Android status bar
- Native app-like behavior

## Technical Details

### PWA Components

- **manifest.json** - Web app manifest with app metadata and icons
- **sw.js** - Service worker for offline caching
- PWA meta tags in all HTML pages

### Caching Strategy

- **Cache-first** for static assets (HTML, CSS, JS, images)
- **Network-first** for external resources (fonts, APIs)
- Automatic cache cleanup on service worker updates

### Icon Placeholders

The PWA currently uses placeholder references for icons. See [ICONS.md](ICONS.md) for instructions on generating and adding actual icon files.

## Development

### Project Structure

```
GombApp/
├── index.html          # Main menu
├── admin.html          # Admin statistics
├── bartender.html      # Bartender order interface
├── programs.html       # Program schedule
├── ticketclerk.html    # Ticket sales
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
├── ICONS.md           # Icon documentation
├── sass/
│   └── style.css      # Styles
├── scripts/
│   ├── login.js       # Authentication
│   ├── indexscripts.js
│   ├── adminscripts.js
│   ├── bartenderscripts.js
│   ├── programsscripts.js
│   └── ticketclerk.js
└── images/            # Image assets
```

### Updating the PWA

When making changes:

1. Update the `CACHE_NAME` version in `sw.js` (e.g., 'gombapp-v2')
2. The service worker will automatically clear old caches
3. Users will receive updated content on next visit

## License

Private project for Vilagomba Festival.

