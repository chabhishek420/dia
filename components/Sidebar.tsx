
import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Archive, Settings, Sidebar as SidebarIcon } from 'lucide-react';
import { Tab, Space } from '../types';
import TabItem from './TabItem';
import SpaceContextMenu from './SpaceContextMenu';

interface SidebarProps {
  spaces: Space[];
  activeSpaceId: string;
  pinnedTabs: Tab[];
  todayTabs: Tab[];
  activeTabId: string;
  isVisible: boolean;
  isPeeking?: boolean;
  width: number;
  onResize: (width: number) => void;
  onResizeReset: () => void;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onSwitchSpace: (direction: 'prev' | 'next' | 'id', spaceId?: string) => void;
  onEditSpace: (id: string, newName: string) => void;
  onCreateSpace: () => void;
  onDeleteSpace: (id: string) => void;
  onContextMenu: (e: React.MouseEvent, tabId: string) => void;
  onOpenCommandBar: () => void;
  onCreateTab: () => void;
  onTabDrop: (tabId: string, targetType: 'pinned' | 'today') => void;
  onTabReorder: (draggedId: string, targetId: string) => void;
  onSpaceColorChange: (id: string, color: string) => void;
  onToggleSidebar: () => void;
  onMouseLeave?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  spaces, activeSpaceId, pinnedTabs, todayTabs, activeTabId, isVisible, isPeeking = false, width,
  onResize, onResizeReset, onSelectTab, onCloseTab, onSwitchSpace, onEditSpace, onCreateSpace, onDeleteSpace,
  onContextMenu, onOpenCommandBar, onCreateTab, onTabDrop, onTabReorder, onSpaceColorChange, onToggleSidebar, onMouseLeave
}) => {
  const [isEditingSpace, setIsEditingSpace] = useState(false);
  const [spaceNameInput, setSpaceNameInput] = useState('');
  const [dragOverTarget, setDragOverTarget] = useState<'pinned' | 'today' | null>(null);
  const [spaceContextMenu, setSpaceContextMenu] = useState<{ x: number; y: number; spaceId: string } | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  
  const sidebarRef = useRef<HTMLDivElement>(null);
  const activeSpace = spaces.find(s => s.id === activeSpaceId) || spaces[0];

  const startEditingSpace = () => {
    if (activeSpace) {
      setSpaceNameInput(activeSpace.name);
      setIsEditingSpace(true);
    }
  };

  const saveSpaceName = () => {
    if (spaceNameInput.trim()) onEditSpace(activeSpace.id, spaceNameInput.trim());
    setIsEditingSpace(false);
  };

  const handleResizeStart = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = width;
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    const onPointerMove = (moveEvent: PointerEvent) => onResize(Math.min(Math.max(startWidth + (moveEvent.clientX - startX), 200), 480));
    const onPointerUp = (upEvent: PointerEvent) => {
        setIsResizing(false);
        target.releasePointerCapture(upEvent.pointerId);
        target.removeEventListener('pointermove', onPointerMove);
        target.removeEventListener('pointerup', onPointerUp);
    };
    target.addEventListener('pointermove', onPointerMove);
    target.addEventListener('pointerup', onPointerUp);
  };

  // Define sidebar-specific variables for the "Arc" look (White text on colored background)
  const sidebarStyle = {
    width: width,
    // Transparent because parent (App) has the space color
    backgroundColor: 'transparent',
    
    // Text colors (White theme)
    '--text-primary': '#ffffff',
    '--text-secondary': 'rgba(255, 255, 255, 0.7)',
    '--text-tertiary': 'rgba(255, 255, 255, 0.5)',
    
    // UI Elements (Glassmorphism)
    '--bg-surface': 'rgba(255, 255, 255, 0.2)', // Used for active pinned tabs
    '--bg-surface-hover': 'rgba(255, 255, 255, 0.15)',
    '--tab-hover-bg': 'rgba(255, 255, 255, 0.1)',
    '--tab-active-bg': 'rgba(255, 255, 255, 0.25)',
    '--tab-active-text': '#ffffff',
    '--nav-text-default': 'rgba(255, 255, 255, 0.7)',
    '--nav-text-active': '#ffffff',
    '--border-subtle': 'rgba(255, 255, 255, 0.15)',
  } as React.CSSProperties;

  if (!isVisible && !isPeeking) return <div className="w-0 overflow-hidden transition-all duration-300" />;

  return (
    <div 
      ref={sidebarRef}
      onMouseLeave={onMouseLeave}
      style={sidebarStyle}
      className={`
        flex flex-col h-full shrink-0 select-none outline-none overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] relative
        text-[var(--text-secondary)]
        ${isPeeking ? 'absolute left-0 top-0 bottom-0 z-50 shadow-[var(--shadow-lg)] rounded-r-2xl bg-[var(--accent-color)]' : ''}
        ${isResizing ? 'transition-none' : ''} 
      `}
    >
      {/* Resizer */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize z-50 hover:bg-white/10 opacity-0 hover:opacity-100 transition-opacity group touch-none"
        onPointerDown={handleResizeStart}
        onDoubleClick={onResizeReset}
      />

      <div className="flex-1 flex flex-col min-h-0 p-3 pb-0">
        
        {/* Header / Space Title */}
        <div className="mb-6 px-2 mt-2">
            <div 
              className="flex items-center justify-between h-8 mb-4 group transition-colors relative"
              onContextMenu={(e) => { e.preventDefault(); setSpaceContextMenu({ x: e.clientX, y: e.clientY, spaceId: activeSpace.id }); }}
            >
                <button 
                    onClick={onToggleSidebar}
                    className="absolute -left-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 hover:text-[var(--text-primary)] transition-all z-20"
                >
                    <SidebarIcon size={16} />
                </button>

                <div className="flex items-center gap-2 flex-1 min-w-0 pl-6">
                {isEditingSpace ? (
                    <input 
                        autoFocus
                        className="w-full bg-transparent text-[var(--text-primary)] text-sm font-semibold rounded outline-none border-b border-white/30"
                        value={spaceNameInput}
                        onChange={e => setSpaceNameInput(e.target.value)}
                        onBlur={saveSpaceName}
                        onKeyDown={e => e.key === 'Enter' && saveSpaceName()}
                    />
                ) : (
                    <span 
                        className="text-[var(--text-primary)] font-bold text-sm tracking-tight truncate cursor-default drop-shadow-sm"
                        onDoubleClick={startEditingSpace}
                    >
                        {activeSpace.name}
                    </span>
                )}
                </div>
                
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={onCreateSpace} className="p-1.5 rounded-full hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                        <Plus size={16} />
                    </button>
                </div>
            </div>

            {/* Search Pill */}
            <div className="flex gap-2 group">
                <button 
                    onClick={onOpenCommandBar}
                    className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-card)] bg-[var(--tab-hover-bg)] hover:bg-[var(--bg-surface-hover)] shadow-sm text-[var(--text-secondary)] transition-all duration-300 text-left border border-[var(--border-subtle)] backdrop-blur-sm"
                >
                    <Search size={14} strokeWidth={2.5} className="opacity-70" />
                    <span className="text-[13px] font-medium opacity-80">URL or Search</span>
                </button>
            </div>
        </div>

        {/* Pinned Tabs Grid */}
        <div 
            className={`grid grid-cols-4 gap-3 mb-6 px-1 py-2 rounded-[var(--radius-card)] transition-all duration-300 ${dragOverTarget === 'pinned' ? 'bg-white/10' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOverTarget('pinned'); }}
            onDrop={(e) => { e.preventDefault(); setDragOverTarget(null); onTabDrop(e.dataTransfer.getData('text/plain'), 'pinned'); }}
            onDragLeave={() => setDragOverTarget(null)}
        >
            {pinnedTabs.map(tab => (
                <div key={tab.id} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                  <TabItem tab={tab} isActive={activeTabId === tab.id} onSelect={onSelectTab} onClose={onCloseTab} onContextMenu={onContextMenu} onDropOnTab={onTabReorder} isPinned />
                </div>
            ))}
             <div 
                onClick={onCreateTab}
                className="flex items-center justify-center h-12 w-12 rounded-[14px] bg-[var(--tab-hover-bg)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] cursor-pointer transition-all duration-300 opacity-60 hover:opacity-100 backdrop-blur-sm"
            >
                <Plus size={18} />
            </div>
        </div>

        <div className="mx-4 h-px bg-[var(--border-subtle)] mb-6" />

        {/* Scrollable Tabs */}
        <div 
            className={`flex-1 overflow-y-auto min-h-0 space-y-0.5 scrollbar-hide rounded-[var(--radius-card)] transition-all duration-300 ${dragOverTarget === 'today' ? 'bg-white/10' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOverTarget('today'); }}
            onDrop={(e) => { e.preventDefault(); setDragOverTarget(null); onTabDrop(e.dataTransfer.getData('text/plain'), 'today'); }}
            onDragLeave={() => setDragOverTarget(null)}
        >
            <div className="pb-4">
                <h3 className="px-5 mb-3 text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest opacity-80">Today</h3>
                {todayTabs.length === 0 && (
                    <div className="px-5 py-6 text-[var(--text-tertiary)] text-sm leading-relaxed opacity-60 font-light">
                        It's quiet here. <br/>Press <span className="font-medium text-[var(--text-primary)] opacity-80">Cmd+T</span> to start.
                    </div>
                )}
                {todayTabs.map(tab => (
                    <div key={tab.id}>
                         <TabItem tab={tab} isActive={activeTabId === tab.id} onSelect={onSelectTab} onClose={onCloseTab} onContextMenu={onContextMenu} onDropOnTab={onTabReorder} />
                    </div>
                ))}
                <div className="h-24" /> 
            </div>
        </div>
      </div>

      {/* Space Switcher */}
      <div className="flex justify-center gap-4 py-6 mt-auto shrink-0 z-10">
          {spaces.map((s, idx) => (
              <div 
                key={s.id}
                onClick={() => onSwitchSpace('id', s.id)}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-500 ease-out shadow-sm ${
                    s.id === activeSpaceId 
                    ? 'scale-125 bg-white ring-2 ring-white/30 ring-offset-0' 
                    : 'bg-white/30 hover:bg-white/80 hover:scale-110'
                }`}
              />
          ))}
      </div>

      {/* Footer */}
      <div className="pb-6 pt-2 px-6 flex items-center justify-between text-[var(--text-tertiary)]">
         <button className="flex items-center gap-2 hover:text-[var(--text-primary)] transition-colors p-2 -ml-2 rounded-lg hover:bg-[var(--bg-surface-hover)]">
            <Archive size={18} strokeWidth={1.5} />
            <span className="text-[13px] font-medium">Library</span>
         </button>
          <button className="hover:text-[var(--text-primary)] transition-colors p-2 -mr-2 rounded-lg hover:bg-[var(--bg-surface-hover)]">
            <Settings size={18} strokeWidth={1.5} />
         </button>
      </div>

      {spaceContextMenu && (
        <SpaceContextMenu 
          x={spaceContextMenu.x} y={spaceContextMenu.y} space={spaces.find(s => s.id === spaceContextMenu.spaceId)!}
          onClose={() => setSpaceContextMenu(null)}
          onRename={startEditingSpace}
          onDelete={() => onDeleteSpace(spaceContextMenu.spaceId)}
          onChangeColor={(color) => onSpaceColorChange(spaceContextMenu.spaceId, color)}
        />
      )}
    </div>
  );
};

export default Sidebar;
