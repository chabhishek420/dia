
import React from 'react';
import { X } from 'lucide-react';
import { Tab } from '../types';

interface TabItemProps {
  tab: Tab;
  isActive: boolean;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onContextMenu: (event: React.MouseEvent, tabId: string) => void;
  onDropOnTab?: (draggedId: string, targetId: string) => void;
  isPinned?: boolean;
}

const TabItem: React.FC<TabItemProps> = ({ tab, isActive, onSelect, onClose, onContextMenu, onDropOnTab, isPinned }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', tab.id);
    e.dataTransfer.effectAllowed = 'move';
    (e.target as HTMLElement).style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
     (e.target as HTMLElement).style.opacity = '1';
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (onDropOnTab) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (onDropOnTab) {
      e.preventDefault();
      e.stopPropagation();
      const draggedId = e.dataTransfer.getData('text/plain');
      if (draggedId && draggedId !== tab.id) {
        onDropOnTab(draggedId, tab.id);
      }
    }
  };

  return (
    <div
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => onSelect(tab.id)}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu(e, tab.id);
      }}
      className={`
        group relative flex items-center gap-3 cursor-pointer select-none transition-all duration-200 ease-out
        ${isPinned 
            ? 'justify-center aspect-square w-12 h-12 mx-auto rounded-[14px] hover:bg-[var(--bg-surface-hover)] hover:-translate-y-0.5' 
            : 'px-3 py-2 mx-2 rounded-lg hover:bg-[var(--tab-hover-bg)] hover:pl-3.5'
        }
        ${isActive && !isPinned 
            ? 'bg-[var(--tab-active-bg)] text-[var(--tab-active-text)] shadow-sm backdrop-blur-md' 
            : isActive && isPinned
                ? 'bg-[var(--bg-surface)] shadow-sm backdrop-blur-md ring-1 ring-black/5'
                : 'text-[var(--nav-text-default)]'
        }
      `}
    >
      {/* Favicon Container */}
      <div className={`
        relative flex items-center justify-center shrink-0 transition-transform duration-300
        ${isActive ? 'scale-100' : 'group-hover:scale-100'}
        ${isPinned ? 'w-6 h-6' : 'w-4 h-4'}
      `}>
        {tab.favicon ? (
           <img 
            src={tab.favicon} 
            alt={tab.title} 
            className={`object-cover select-none bg-white/90 ${isPinned ? 'rounded-md w-full h-full' : 'rounded w-full h-full'}`} 
          />
        ) : (
          <div className="bg-[var(--text-tertiary)] rounded-full w-full h-full opacity-30" />
        )}
      </div>

      {/* Title (Hidden if pinned) */}
      {!isPinned && (
        <span className={`
            flex-1 text-[13px] font-medium truncate leading-normal transition-colors duration-200
            ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}
        `}>
          {tab.title}
        </span>
      )}

      {/* Close Button - Only on Hover */}
      {!isPinned && (
        <div 
            onClick={(e) => { e.stopPropagation(); onClose(tab.id); }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-[var(--bg-surface-hover)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-all duration-200"
        >
          <X size={12} />
        </div>
      )}
      
      {/* Active Dot for Pinned Tabs (Optional, can be removed if background is sufficient) */}
      {isPinned && isActive && (
          <div className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-current opacity-60" />
      )}
    </div>
  );
};

export default TabItem;
