# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Pokemon Trading Card Game deck viewer application built with React, TypeScript, and Vite. The app allows users to input Pokemon deck codes and displays deck recipe images from the official Pokemon Card website. It supports both single deck input and bulk input (including Excel copy-paste functionality with player names).

## Key Commands

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production (TypeScript compile + Vite build)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

### Deployment
- Deployment is handled automatically by GitHub Actions when pushing to main branch

## Architecture & Core Concepts

### Single-File Application Structure
The entire application logic is contained in `src/App.tsx` as a single React component with multiple state management hooks. This monolithic approach was chosen for simplicity given the relatively small scope.

### State Management
The app uses React hooks for state management:
- Deck input modes (single vs bulk)
- Deck list management with DeckData interface
- Image enlargement modal with navigation
- Form validation and error handling
- Progress tracking for bulk operations

### Key Data Flow
1. **Deck Code Input**: Users input deck codes either individually or in bulk (supports Excel tab-separated format)
2. **Image URL Generation**: Deck codes are converted to Pokemon Card official URLs:
   - Display: `https://www.pokemon-card.com/deck/deckView.php/deckID/{deckCode}`
   - Details: `https://www.pokemon-card.com/deck/confirm.html/deckID/{deckCode}`
3. **Grid Display**: Responsive grid layout shows deck images with player names and codes
4. **Modal Navigation**: Click-to-enlarge with keyboard/button navigation between decks

### Responsive Grid Configuration
Uses Tailwind CSS breakpoints for responsive columns:
- Mobile (< 640px): 1 column
- Small tablet (≥ 640px): 1 column
- Tablet (≥ 768px): 2 columns
- Small PC (≥ 1024px): 3 columns
- Medium PC (≥ 1280px): 4 columns
- Large PC (≥ 1536px): 5 columns

### Input Processing
- **Single Mode**: Individual deck code + optional player name
- **Bulk Mode**: Supports Excel copy-paste (tab-separated), comma/semicolon/space-separated, or newline-separated deck codes
- **Duplicate Detection**: Prevents adding duplicate deck codes
- **Error Handling**: Validates input and provides user feedback

### Modal Image Viewer
- **Navigation**: Arrow keys (↑↓←→) and click buttons for prev/next
- **Keyboard Controls**: ESC to close, prevents default scroll behavior
- **Accessibility**: Proper focus management and ARIA labels
- **Position Tracking**: Shows current position (e.g., "2 / 5")

## Configuration Notes

### Vite Configuration
- Base path set to `/PokemonTCGJPDeckViewer/` for GitHub Pages deployment
- Standard React plugin configuration

### Tailwind CSS
- Uses Tailwind CSS v3 (downgraded from v4 due to compatibility issues with responsive classes)
- PostCSS configured with tailwindcss and autoprefixer

### GitHub Pages Setup
- Configured for deployment via GitHub Actions
- Build artifacts go to `dist/` directory
- Base path configured for proper asset loading
- Automatic deployment on push to main branch

## Development Considerations

When modifying this application:
- Maintain the single-component structure unless complexity significantly increases
- Ensure responsive grid classes are properly generated (use Tailwind v3)
- Test bulk input with various formats (Excel tab-separated, comma-separated, etc.)
- Verify keyboard navigation works properly in modal view
- Check duplicate detection logic when adding new deck management features