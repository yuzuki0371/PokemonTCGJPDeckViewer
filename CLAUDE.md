# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Pokemon Trading Card Game deck viewer application built with React 19, TypeScript, and Vite. The app allows users to input Pokemon deck codes and displays deck recipe images from the official Pokemon Card website. It supports both single deck input and bulk input (including Excel copy-paste functionality with player names).

## Key Commands

### Development
- `npm run dev` - Start development server at http://localhost:5173
- `npm run build` - Build for production (TypeScript compile + Vite build)
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally

### Deployment
- Deployment is handled automatically by GitHub Actions when pushing to main branch
- Manual deployment can be triggered from GitHub Actions workflow page

## Architecture & Core Concepts

### Layered Hook Architecture (Recently Refactored)
The application uses a sophisticated layered hook architecture with complete separation of concerns:

**View Layer:**
- `src/App.tsx` - Pure orchestration component focused on rendering and UI event handling
- `src/components/` - Reusable UI components with clear prop interfaces

**Business Logic Layer:**
- `src/hooks/useDeckManager.ts` - Centralized deck management operations (add, remove, bulk processing)
- `src/hooks/useAppState.ts` - Application state management (deck list, UI state, CRUD operations)
- `src/hooks/useFormState.ts` - Form input state management (single/bulk modes)
- `src/hooks/useModalState.ts` - Modal state and keyboard navigation logic

**Infrastructure Layer:**
- `src/hooks/useLocalStorage.ts` - Data persistence operations with proper serialization
- `src/utils/deckUtils.ts` - Pure utility functions for data processing and validation
- `src/constants/index.ts` - Centralized configuration and URL management

### Data Flow Architecture
The application follows a unidirectional data flow pattern:

1. **User Input** → FormState → DeckManager → AppState → localStorage → UI Update
2. **Data Loading** → localStorage → AppState → Component Re-render
3. **Business Operations** → DeckManager utilities → State updates → Persistence

Key architectural decisions:
- **Pure Functions**: All utility functions in `utils/deckUtils.ts` are side-effect free
- **Single Source of Truth**: AppState manages all deck data centrally
- **Immutable Updates**: State changes use immutable patterns throughout
- **Hook Composition**: Complex operations are composed from multiple focused hooks

### Key Business Operations

**Deck Input Processing** (`utils/deckUtils.ts`):
- **Single Mode**: Individual deck code + optional player name validation
- **Bulk Mode**: Multi-format parsing supporting Excel tab-separated, comma/semicolon/space-separated, or newline-separated deck codes
- **Duplicate Detection**: Cross-referencing against existing and newly processed entries
- **Error Aggregation**: Comprehensive error collection with user-friendly messaging

**URL Generation** (`constants/index.ts`):
- Deck codes are converted to Pokemon Card official URLs via `generateDeckUrls()` helper
- View URL: `deck/deckView.php/deckID/{deckCode}` (for image display)
- Details URL: `deck/confirm.html/deckID/{deckCode}` (for external links)

**Data Persistence** (`hooks/useLocalStorage.ts`):
- Automatic localStorage operations with proper Date object serialization/deserialization
- Storage key management through centralized constants
- Error handling for storage quota and parsing failures

### Responsive Grid Configuration
Uses Tailwind CSS breakpoints for responsive columns:
- Mobile (< 640px): 1 column
- Small tablet (≥ 640px): 1 column
- Tablet (≥ 768px): 2 columns
- Small PC (≥ 1024px): 3 columns
- Medium PC (≥ 1280px): 4 columns
- Large PC (≥ 1536px): 5 columns

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

### Data Persistence
- Deck data is stored in localStorage using centralized key management (`STORAGE_KEYS.DECK_LIST`)
- Date objects are properly serialized/deserialized for JSON storage
- All persistence operations are abstracted through `useLocalStorage` hook

## Development Guidelines

### Architectural Patterns to Follow
- **Layered Architecture**: Maintain clear separation between View, Business Logic, and Infrastructure layers
- **Pure Functions**: Keep utility functions in `utils/` free of side effects for testability
- **Centralized Constants**: Add new URLs, keys, or configuration to `src/constants/index.ts`
- **Hook Composition**: Compose complex operations from focused, single-responsibility hooks

### Code Organization Principles
- **View Components**: Should only handle rendering and UI event delegation
- **Business Logic**: All domain operations should go through `useDeckManager` or similar hooks
- **State Management**: Use appropriate state hooks (`useAppState`, `useFormState`, etc.) based on data scope
- **Utilities**: Extract reusable, pure functions to `utils/` for better testing and reuse

### Key Integration Points
- **Form Submission**: Always flows through `useDeckManager.handleSubmit`
- **Data Persistence**: All storage operations must use `useLocalStorage` hook methods
- **URL Generation**: Use `generateDeckUrls()` helper for consistent Pokemon Card URL construction
- **Input Parsing**: Leverage `deckUtils.parseBulkInputLine()` for consistent input processing

### Testing Considerations
- Utility functions in `utils/deckUtils.ts` are designed as pure functions for easy unit testing
- Hook separation allows for independent testing of business logic vs. UI behavior
- Constants centralization enables easy mocking in tests