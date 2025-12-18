
import React, { useEffect, useRef } from 'react';
import { Pin, Trash2, Minus, ArrowRightLeft } from 'lucide-react';
import { Space } from '../types';

interface ContextMenuProps {
  x: number;
  y: number;
  tabId: string;
  isPinned?: boolean;
  spaces: Space[];
  currentSpaceId: string;
  onClose: () => void;
  onPin: (id: string) => void;
  onUnpin: (id: string) => void;
  onDelete: (id: string) => void;
  onMoveToSpace: (tabId: string, spaceId: string) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ 
  x, y, tabId, isPinned, spaces, currentSpaceId, 
  onClose, onPin, onUnpin, onDelete, onMoveToSpace 
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const otherSpaces = spaces.filter(s => s.id !== currentSpaceId);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 w-64 bg-[var(--menu-bg)] border border-[var(--menu-border)] rounded-xl shadow-[var(--menu-shadow)] py-2 flex flex-col text-[var(--text-primary)] text-[13px] font-medium animate-in fade-in zoom-in-95 duration-100 ring-1 ring-black/5"
      style={{ left: x, top: y }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <button 
        className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--bg-surface-hover)] text-left w-full transition-colors"
        onClick={() => { isPinned ? onUnpin(tabId) : onPin(tabId); onClose(); }}
      >
        {isPinned ? <Minus size={15} className="text-[var(--text-secondary)]" /> : <Pin size={15} className="text-[var(--text-secondary)]" />}
        <span>{isPinned ? 'Unpin Tab' : 'Pin Tab'}</span>
      </button>

      {/* Move to Space Submenu Section */}
      {otherSpaces.length > 0 && (
        <>
          <div className="h-px bg-[var(--menu-border)] my-1.5 mx-4" />
          <div className="px-4 py-1.5 text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Move to Space</div>
          {otherSpaces.map(space => (
            <button
              key={space.id}
              className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--bg-surface-hover)] text-left w-full transition-colors"
              onClick={() => { onMoveToSpace(tabId, space.id); onClose(); }}
            >
              <div className="w-2.5 h-2.5 rounded-full ring-1 ring-black/5" style={{ backgroundColor: space.color }} />
              <span className="truncate">{space.name}</span>
            </button>
          ))}
        </>
      )}

      <div className="h-px bg-[var(--menu-border)] my-1.5 mx-4" />
      
      <button 
        className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--bg-surface-hover)] text-[#EF4444] text-left w-full transition-colors"
        onClick={() => { onDelete(tabId); onClose(); }}
      >
        <Trash2 size={15} />
        <span>Close Tab</span>
      </button>
    </div>
  );
};

export default ContextMenu;
