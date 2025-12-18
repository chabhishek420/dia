
import { Tab, Space } from './types';

// The re-styled CSS based on the "Quiet Competence" Style Guide
export const ARC_THEME_CSS = `
:root {
    /* --- ATMOSPHERE & CANVAS --- */
    --bg-canvas: #F2F2F7; /* High-key neutral, cool gray foundation */
    --bg-surface: #FFFFFF; /* Matte white paper */
    --bg-surface-hover: #F5F5F5; /* Subtle interaction state */
    --bg-subtle: #EBEBF0; /* Smoke-like structure neutral */
    --bg-overlay: rgba(255, 255, 255, 0.85); /* For blur effects */
    --border-subtle: rgba(0, 0, 0, 0.06);
    
    /* --- TYPOGRAPHY --- */
    --text-primary: #1D1D1F; /* Soft Black - Crisp but not harsh */
    --text-secondary: #86868B; /* Cool Gray - Lucid information */
    --text-tertiary: #AEAEB2; /* Muted - Subtle structure */
    --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

    /* --- ACCENT LANGUAGE --- */
    --accent-color: #6b6b9c; /* User defined primary */
    --accent-surface: rgba(107, 107, 156, 0.12); /* Gentle tint */
    --accent-hover: rgba(107, 107, 156, 0.2);
    --accent-text: #6b6b9c;

    /* --- ELEVATION & SHADOWS (Feathered & Diffuse) --- */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.04);
    --shadow-md: 0 4px 12px -2px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04);
    --shadow-lg: 0 12px 24px -6px rgba(0, 0, 0, 0.10), 0 4px 8px -4px rgba(0, 0, 0, 0.04);
    --shadow-float: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
    
    /* --- COMPONENT MAPPINGS --- */
    --nav-text-default: var(--text-secondary);
    --nav-text-active: var(--text-primary);
    
    --tab-hover-bg: rgba(0,0,0,0.04);
    --tab-active-bg: var(--bg-surface);
    --tab-active-text: var(--text-primary);
    
    --menu-bg: var(--bg-surface);
    --menu-border: var(--border-subtle);
    --menu-shadow: var(--shadow-lg);

    /* --- UTILITIES --- */
    --sidebar-width: 240px;
    --radius-pill: 9999px;
    --radius-card: 12px;
}

[data-theme='dark'] {
    /* --- CANVAS & FIELD (Dark Mode) --- */
    --bg-canvas: #000000; /* Deep matte black */
    --bg-surface: #1C1C1E; /* Zinc-900 */
    --bg-surface-hover: #2C2C2E;
    --bg-subtle: #151516; /* Sidebar */
    --bg-overlay: rgba(28, 28, 30, 0.85);
    --border-subtle: rgba(255, 255, 255, 0.1);

    /* --- TYPOGRAPHY (Dark Mode) --- */
    --text-primary: #F5F5F7;
    --text-secondary: #98989D;
    --text-tertiary: #636366;

    /* --- ACCENT --- */
    --accent-color: #8E8EBE;
    --accent-surface: rgba(142, 142, 190, 0.15);
    --accent-hover: rgba(142, 142, 190, 0.25);
    --accent-text: #DCDCF0;

    /* --- SHADOWS (Dark Mode) --- */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.4);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
    --shadow-float: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
    
    --tab-hover-bg: rgba(255,255,255,0.08);
}
`;

export const INITIAL_SPACES: Space[] = [
  { id: 'space-1', name: 'Work', color: '#6b6b9c' },
  { id: 'space-2', name: 'Personal', color: '#10B981' },
  { id: 'space-3', name: 'Inspiration', color: '#F59E0B' }
];

export const INITIAL_TABS: Tab[] = [
  // Space 1 - Work
  { id: '1', spaceId: 'space-1', title: 'Linear', url: 'https://linear.app', pinned: true, favicon: 'https://www.google.com/s2/favicons?domain=linear.app&sz=64' },
  { id: '2', spaceId: 'space-1', title: 'Notion', url: 'https://notion.so', pinned: true, favicon: 'https://www.google.com/s2/favicons?domain=notion.so&sz=64' },
  { id: '3', spaceId: 'space-1', title: 'Figma', url: 'https://figma.com', pinned: true, favicon: 'https://www.google.com/s2/favicons?domain=figma.com&sz=64' },
  { id: '4', spaceId: 'space-1', title: 'GitHub', url: 'https://github.com', pinned: true, favicon: 'https://www.google.com/s2/favicons?domain=github.com&sz=64' },
  { id: '5', spaceId: 'space-1', title: 'Slack', url: 'https://slack.com', pinned: false, favicon: 'https://www.google.com/s2/favicons?domain=slack.com&sz=64' },
  
  // Space 2 - Personal
  { id: '6', spaceId: 'space-2', title: 'Twitter / X', url: 'https://twitter.com', pinned: true, favicon: 'https://www.google.com/s2/favicons?domain=twitter.com&sz=64' },
  { id: '7', spaceId: 'space-2', title: 'YouTube', url: 'https://youtube.com', pinned: false, favicon: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=64' },
  { id: '8', spaceId: 'space-2', title: 'Arc Browser', url: 'https://arc.net', pinned: false, active: true, favicon: 'https://www.google.com/s2/favicons?domain=arc.net&sz=64' },

  // Space 3 - Development
  { id: '9', spaceId: 'space-3', title: 'Vercel', url: 'https://vercel.com', pinned: true, favicon: 'https://www.google.com/s2/favicons?domain=vercel.com&sz=64' },
  { id: '10', spaceId: 'space-3', title: 'React', url: 'https://react.dev', pinned: false, favicon: 'https://www.google.com/s2/favicons?domain=react.dev&sz=64' },
  { id: '11', spaceId: 'space-3', title: 'Dribbble', url: 'https://dribbble.com', pinned: false, favicon: 'https://www.google.com/s2/favicons?domain=dribbble.com&sz=64' }
];

export const PINNED_TABS = INITIAL_TABS.filter(t => t.pinned);
export const TODAY_TABS = INITIAL_TABS.filter(t => !t.pinned);
