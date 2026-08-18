# Frontend Architecture & Guidelines

This document outlines the frontend technical approach for the Regency Salma platform.

## Architecture Recommendation
- **Framework:** Expo + React Native. Expo enables fast iteration, easy testing, and robust over-the-air (OTA) updates.
- **Language:** TypeScript for type safety, catching errors early, and documenting the shape of data.

## Navigation Approach
- **Routing:** Expo Router (file-based routing) for consistent deep-linking and intuitive screen management.
- **Structure:** 
  - `(auth)` group: Linear flows for Onboarding, Login, and Create Account. No tab bar.
  - `(app)` group: The authenticated resident/management experience. Uses bottom tab navigation.
  - Modals: For quick actions like "Raise Issue" or "Add Visitor" to maintain context.

## State Management
- **Local/UI State:** React `useState` and `useReducer`.
- **Global/Server State:** React Query (TanStack Query) for fetching, caching, synchronizing, and updating server data. It automatically handles loading, error, and offline states.
- **Auth/Session State:** React Context combined with SecureStore to hold the user's JWT tokens and active community context.

## API Client
- **Tool:** Axios or native `fetch` wrapped in a custom client.
- **Interceptors:** To automatically attach the bearer token, handle token refresh logic, and globally catch 401/403 errors to trigger a logout or permission-denied flow.

## Design Token & Component Strategy
- **Tokens:** Define colors, typography, spacing, and radii in a central `theme.ts` file. Do not use hardcoded values in components. All typography must strictly use Plus Jakarta Sans; no serif fonts or default system fonts are permitted.
- **Styling:** React Native `StyleSheet` or a lightweight styling solution like NativeWind or Restyle, strictly bound to our design tokens.
- **Shared Components:** A `components/ui` folder for reusable atomic elements (Buttons, Cards, Inputs, StatusBadges) ensuring absolute visual consistency.

## Screen & Module Boundaries
- Organize features by domain rather than file type (e.g., `features/visitors`, `features/maintenance`) containing their own components, hooks, and API calls.
- Keeps the `app` (router) folder clean, primarily containing routing files that import complex views from the `features` directory.

## State Handling Requirements
- **Loading:** Use skeleton loaders for initial fetches and subtle spinners for background updates.
- **Empty:** Domain-specific empty components (e.g., "No visitors scheduled").
- **Error:** Centralized error boundary for fatal crashes. Inline retry buttons for failed queries.
- **Permission Denied:** Clear UI when a user attempts to access a feature restricted by their role.

## Responsive & Accessibility Requirements
- Build mobile-first.
- Wrap lists in `FlatList` or `SectionList` for performance.
- Use `KeyboardAvoidingView` to ensure forms remain accessible.
- Support Dynamic Type (text scaling) and ensure adequate contrast for all text.
- Provide `accessibilityLabel` for icon-only buttons.
