
import React, { useState, useEffect } from 'react';
import { ARC_THEME_CSS, INITIAL_SPACES, INITIAL_TABS } from './constants';
import Sidebar from './components/Sidebar';
import BrowserView from './components/BrowserView';
import ChatPanel from './components/ChatPanel';
import CommandBar from './components/CommandBar';
import ContextMenu from './components/ContextMenu';
import { Tab, Space, Theme, ContextMenuPosition } from './types';
import { Sun, Moon, Sidebar as SidebarIcon } from 'lucide-react';
import useLocalStorage from './hooks/useLocalStorage';

const App: React.FC = () => {
  const [theme, setTheme] = useLocalStorage<Theme>('arc-theme', 'light');
  const [spaces, setSpaces] = useLocalStorage<Space[]>('arc-spaces', INITIAL_SPACES);
  const [activeSpaceId, setActiveSpaceId] = useLocalStorage<string>('arc-active-space', INITIAL_SPACES[0].id);
  const [tabs, setTabs] = useLocalStorage<Tab[]>('arc-tabs', INITIAL_TABS);
  const [activeTabId, setActiveTabId] = useLocalStorage<string>('arc-active-tab', '8');
  
  // Left Sidebar State
  const [isSidebarVisible, setIsSidebarVisible] = useLocalStorage<boolean>('arc-sidebar-visible', true);
  const [sidebarWidth, setSidebarWidth] = useLocalStorage<number>('arc-sidebar-width', 240);
  
  // Right Sidebar State (AI Panel)
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ pos: ContextMenuPosition; isOpen: boolean } | null>(null);
  const [isPeeking, setIsPeeking] = useState(false);

  const activeSpace = spaces.find(s => s.id === activeSpaceId) || spaces[0];
  const pinnedTabs = tabs.filter(t => t.spaceId === activeSpaceId && t.pinned);
  const todayTabs = tabs.filter(t => t.spaceId === activeSpaceId && !t.pinned);
  const activeTab = tabs.find(t => t.id === activeTabId);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  }, [theme]);

  // Update primary color variable for accent usage
  useEffect(() => {
    if (activeSpace) {
      document.documentElement.style.setProperty('--accent-color', activeSpace.color);
      document.documentElement.style.setProperty('--accent-surface', `${activeSpace.color}15`);
    }
  }, [activeSpace]);

  // Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 's': e.preventDefault(); setIsSidebarVisible(prev => !prev); setIsPeeking(false); break;
          case 't': e.preventDefault(); handleCreateTab(); break;
          case 'w': e.preventDefault(); if (activeTabId) handleCloseTab(activeTabId); break;
          case 'l': case 'k': e.preventDefault(); setIsCommandBarOpen(true); break;
          case 'ArrowRight': e.preventDefault(); handleSwitchSpace('next'); break;
          case 'ArrowLeft': e.preventDefault(); handleSwitchSpace('prev'); break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTabId, activeSpaceId, spaces]); 

  // --- Handlers ---
  const handleCloseTab = (id: string) => {
    const tabToDelete = tabs.find(t => t.id === id);
    if (!tabToDelete) return;
    const remainingSpaceTabs = tabs.filter(t => t.spaceId === tabToDelete.spaceId && t.id !== id);
    setTabs(prev => prev.filter(t => t.id !== id));
    if (activeTabId === id) setActiveTabId(remainingSpaceTabs.length > 0 ? remainingSpaceTabs[remainingSpaceTabs.length - 1].id : '');
  };

  const handleSwitchSpace = (direction: 'prev' | 'next' | 'id', spaceId?: string) => {
      if (direction === 'id' && spaceId) { setActiveSpaceId(spaceId); return; }
      const idx = spaces.findIndex(s => s.id === activeSpaceId);
      const nextIdx = direction === 'next' ? (idx + 1) % spaces.length : (idx - 1 + spaces.length) % spaces.length;
      setActiveSpaceId(spaces[nextIdx].id);
  };

  const handleCreateSpace = () => {
      const newSpace: Space = { id: `space-${Date.now()}`, name: `New Space`, color: '#6366F1' };
      setSpaces(prev => [...prev, newSpace]);
      setActiveSpaceId(newSpace.id);
  };

  const handleDeleteSpace = (id: string) => {
      if (spaces.length <= 1) return;
      const newSpaces = spaces.filter(s => s.id !== id);
      setSpaces(newSpaces);
      setTabs(prev => prev.filter(t => t.spaceId !== id));
      if (activeSpaceId === id) setActiveSpaceId(newSpaces[0].id);
  };

  const handleEditSpace = (id: string, newName: string) => setSpaces(prev => prev.map(s => s.id === id ? { ...s, name: newName } : s));
  const handleSpaceColorChange = (id: string, color: string) => setSpaces(prev => prev.map(s => s.id === id ? { ...s, color } : s));
  const handleContextMenu = (e: React.MouseEvent, tabId: string) => setContextMenu({ pos: { x: e.clientX, y: e.clientY, tabId }, isOpen: true });
  const handlePinTab = (id: string) => setTabs(prev => prev.map(t => t.id === id ? { ...t, pinned: true } : t));
  const handleUnpinTab = (id: string) => setTabs(prev => prev.map(t => t.id === id ? { ...t, pinned: false } : t));
  
  const handleCreateTab = () => {
      const newTab: Tab = { id: String(Date.now()), spaceId: activeSpaceId, title: 'New Tab', url: 'https://google.com', pinned: false, active: true };
      setTabs(prev => [...prev, newTab]);
      setActiveTabId(newTab.id);
  };

  const handleUpdateTabUrl = (tabId: string, url: string) => {
      setTabs(prev => prev.map(t => {
          if (t.id === tabId) return { ...t, url, title: url.replace(/https?:\/\/(www\.)?/, '').split('/')[0] };
          return t;
      }));
  };

  const handleTabDrop = (tabId: string, targetType: 'pinned' | 'today') => {
      setTabs(prev => prev.map(t => (t.id === tabId && t.spaceId === activeSpaceId) ? { ...t, pinned: targetType === 'pinned' } : t));
  };

  const handleTabReorder = (draggedId: string, targetId: string) => {
    setTabs(prev => {
        const dIdx = prev.findIndex(t => t.id === draggedId);
        const tIdx = prev.findIndex(t => t.id === targetId);
        if (dIdx === -1 || tIdx === -1) return prev;
        const newTabs = [...prev];
        const [removed] = newTabs.splice(dIdx, 1);
        const newTargetIdx = newTabs.findIndex(t => t.id === targetId);
        newTabs.splice(newTargetIdx, 0, { ...removed, pinned: prev[tIdx].pinned });
        return newTabs;
    });
  };

  const handleMoveToSpace = (tabId: string, targetSpaceId: string) => {
      setTabs(prev => prev.map(t => t.id === tabId ? { ...t, spaceId: targetSpaceId, pinned: false } : t));
      if (activeTabId === tabId) setActiveTabId('');
  };

  return (
    <>
      <style>{ARC_THEME_CSS}</style>
      
      <div 
        className="flex h-screen w-screen overflow-hidden transition-colors duration-500 font-sans text-[var(--text-primary)] relative"
        style={{ backgroundColor: activeSpace.color }}
        onClick={() => setContextMenu(null)}
      >
        {/* Peek Zone */}
        {!isSidebarVisible && !isPeeking && (
            <div 
                className="absolute left-0 top-0 bottom-0 w-4 z-50 hover:bg-black/5 transition-colors cursor-e-resize"
                onMouseEnter={() => setIsPeeking(true)}
            />
        )}

        {/* ZONE A: Left Sidebar */}
        <Sidebar 
            spaces={spaces} activeSpaceId={activeSpaceId} pinnedTabs={pinnedTabs} todayTabs={todayTabs} activeTabId={activeTabId} 
            isVisible={isSidebarVisible} isPeeking={isPeeking} width={sidebarWidth} onResize={setSidebarWidth} onResizeReset={() => setSidebarWidth(240)}
            onSelectTab={setActiveTabId} onCloseTab={handleCloseTab} onSwitchSpace={handleSwitchSpace} onEditSpace={handleEditSpace}
            onCreateSpace={handleCreateSpace} onDeleteSpace={handleDeleteSpace} onContextMenu={handleContextMenu} onOpenCommandBar={() => setIsCommandBarOpen(true)}
            onCreateTab={handleCreateTab} onTabDrop={handleTabDrop} onTabReorder={handleTabReorder} onSpaceColorChange={handleSpaceColorChange}
            onToggleSidebar={() => { setIsSidebarVisible(prev => !prev); setIsPeeking(false); }} onMouseLeave={() => isPeeking && setIsPeeking(false)}
        />

        {/* ZONE B: Center Content */}
        <div className={`flex-1 h-full min-w-0 flex flex-col relative z-0 transition-all duration-300 ${isSidebarVisible ? 'p-2 pl-0' : 'p-2'}`}>
          <BrowserView 
            activeTab={activeTab} 
            onUpdateTabUrl={handleUpdateTabUrl} 
            onToggleChat={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
            isChatOpen={isRightSidebarOpen}
            onToggleSidebar={() => { setIsSidebarVisible(prev => !prev); setIsPeeking(false); }}
          />
        </div>

        {/* ZONE C: Right AI Assistant */}
        <ChatPanel 
            isOpen={isRightSidebarOpen} 
            onClose={() => setIsRightSidebarOpen(false)} 
        />

        {/* Theme Toggle */}
        <button 
            onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
            className="fixed bottom-6 left-6 z-[60] p-3 rounded-full bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-[var(--shadow-lg)] hover:scale-110 transition-transform ring-1 ring-black/5 opacity-0 hover:opacity-100"
            title="Toggle Theme"
        >
            {theme === 'light' ? <Moon size={18} strokeWidth={1.5} /> : <Sun size={18} strokeWidth={1.5} />}
        </button>

        <CommandBar isOpen={isCommandBarOpen} onClose={() => setIsCommandBarOpen(false)} tabs={tabs} onSelectTab={setActiveTabId} />
        
        {contextMenu && contextMenu.isOpen && (
            <ContextMenu 
                x={contextMenu.pos.x} y={contextMenu.pos.y} tabId={contextMenu.pos.tabId} isPinned={tabs.find(t => t.id === contextMenu.pos.tabId)?.pinned}
                spaces={spaces} currentSpaceId={activeSpaceId} onClose={() => setContextMenu(null)} onPin={handlePinTab} onUnpin={handleUnpinTab}
                onDelete={handleCloseTab} onMoveToSpace={handleMoveToSpace}
            />
        )}
      </div>
    </>
  );
};

export default App;
