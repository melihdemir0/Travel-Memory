# Travel Memory Map

Travel Memory Map is a travel diary application built with React and Leaflet. Users can create location-based memories, attach notes and photos, explore saved places on an interactive map, and keep everything persisted in `localStorage`.

## Features

- Landing, login, and sign-up flow
- Protected dashboard experience
- Add, edit, and delete travel memories
- Address search with OpenStreetMap Nominatim suggestions
- Interactive map view with memory markers and popups
- Memory gallery with multiple image support
- Client-side image compression before saving
- English and Turkish language support
- Persistent user and memory data with `localStorage`

## Tech Stack

- React 19
- Vite
- JavaScript
- Tailwind CSS
- Leaflet
- React Leaflet
- React Router
- UUID
- Jest
- Biome

## Getting Started

### Requirements

- Node.js 18+ recommended
- npm

### Installation

```bash
npm install
```

### Run in Development

```bash
npm run dev
```

After starting the dev server, open the local Vite URL shown in the terminal.

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run format
npm run test
npm run test:coverage
npm run check
```

`npm run check` runs lint, format check, and tests together.

## Project Highlights

- Memories are stored locally in the browser, so no backend setup is required.
- Authentication is client-side and intended for demo or portfolio use.
- Photos are compressed before storage to reduce `localStorage` usage.
- Memory locations are resolved from address input and saved with coordinates.

## Screenshots

You can place screenshots under a `docs/` folder and reference them here:

- `docs/screenshot-desktop.png`
- `docs/screenshot-mobile.png`

Example:

```md
![Desktop view](docs/screenshot-desktop.png)
![Mobile view](docs/screenshot-mobile.png)
```

## Production Build

```bash
npm run build
```

The production output is generated in `dist/`.

## Netlify Deployment

- Build command: `npm run build`
- Publish directory: `dist`

## Notes

- This project depends on the OpenStreetMap Nominatim service for address lookup.
- Because data is stored in `localStorage`, memories and auth state are device/browser specific.
