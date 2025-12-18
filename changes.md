# Changelog

## [Current Session]

### 🚀 Features & Refactors

**1. Right Sidebar (ChatPanel) Animation & Resizing**
*   **Goal**: Synchronize the motion and behavior of the `ChatPanel` with the `Sidebar` to ensure a consistent "Arc-like" feel.
*   **Changes**:
    *   **File**: `components/ChatPanel.tsx`
        *   Implemented `handleResizeStart` logic. Note: The logic is inverted compared to the left sidebar (dragging *left* increases width).
        *   Added `useLocalStorage` hook to persist the user's preferred panel width (`arc-chat-width`).
        *   Updated CSS classes to use specific cubic-bezier timing: `transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]`.
        *   Added a resize handle overlay on the left edge of the panel.
    *   **File**: `App.tsx`
        *   Removed the wrapper `div` around `ChatPanel` in "ZONE C".
        *   The `ChatPanel` now lives directly in the flex container and manages its own width transition (0px to Npx) based on the `isOpen` prop.
    *   **File**: `components/Sidebar.tsx`
        *   (Reference Only) Analyzed existing motion curves to ensure exact match.

### 🎨 Theme & Styling
*   **File**: `constants.ts`
    *   Updated `ARC_THEME_CSS` to match the "Quiet Competence" style guide (High-key neutral, cool gray foundation, feathered shadows).
    *   Set Primary Color to user request: `#6b6b9c`.

### 🐛 Bug Fixes
*   Fixed layout shifting where the right sidebar would "jump" instead of sliding.
*   Ensured text color in the Right Sidebar matches the high-contrast aesthetic of the Left Sidebar.
