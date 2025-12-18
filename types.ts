import React from 'react';

export interface Tab {
  id: string;
  spaceId: string;
  title: string;
  url: string;
  favicon?: string;
  pinned?: boolean;
  active?: boolean;
}

export interface Space {
  id: string;
  name: string;
  color: string;
  icon?: React.ReactNode;
}

export type Theme = 'light' | 'dark';

export interface ContextMenuPosition {
  x: number;
  y: number;
  tabId: string;
}
