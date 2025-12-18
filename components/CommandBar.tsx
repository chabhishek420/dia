
import React, { useState, useEffect, useRef } from 'react';
import { Search, Globe, Clock, Hash } from 'lucide-react';
import { Tab } from '../types';

interface CommandBarProps {
  isOpen: boolean;
  onClose: () => void;
  tabs: Tab[];
  onSelectTab: (id: string) => void;
}

const CommandBar: React.FC<CommandBarProps> = ({ isOpen, onClose, tabs, onSelectTab }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredTabs = tabs.filter(tab => 
    tab.title.toLowerCase().includes(query.toLowerCase()) || 
    tab.url.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[var(--bg-overlay)] backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
      
      {/* Modal - Floating Slab */}
      <div className="relative w-full max-w-2xl bg-[var(--menu-bg)] rounded-2xl shadow-[var(--shadow-float)] border border-[var(--menu-border)] overflow-hidden flex flex-col max-h-[60vh] animate-in slide-in-from-top-4 duration-300 ring-1 ring-black/5">
        
        {/* Input */}
        <div className="flex items-center gap-4 px-6 py-5 border-b border-[var(--menu-border)] bg-[var(--menu-bg)]">
          <Search className="text-[var(--text-tertiary)]" size={20} />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent text-[var(--text-primary)] text-lg font-medium outline-none placeholder-[var(--text-tertiary)]"
            placeholder="Where to?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
            }}
          />
          <div className="flex gap-2">
             <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--bg-surface-hover)] rounded-md text-[10px] text-[var(--text-tertiary)] font-bold tracking-widest">ESC</kbd>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredTabs.length > 0 ? (
            <>
               <div className="px-4 py-2 text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Open Tabs</div>
               {filteredTabs.map(tab => (
                <div
                  key={tab.id}
                  onClick={() => { onSelectTab(tab.id); onClose(); }}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer hover:bg-[var(--bg-surface-hover)] group transition-colors"
                >
                  <div className="p-2 rounded-lg bg-[var(--bg-subtle)] text-[var(--text-secondary)]">
                    {tab.pinned ? <Hash size={16} /> : <Globe size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[var(--text-primary)] font-medium truncate">{tab.title}</div>
                    <div className="text-[var(--text-secondary)] text-xs truncate opacity-70 mt-0.5">{tab.url}</div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-[var(--text-secondary)] px-2 py-1 rounded-md bg-[var(--bg-surface)] shadow-sm">
                    Switch
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="p-12 text-center text-[var(--text-tertiary)]">
              <p>Type to search...</p>
            </div>
          )}
          
          {/* Mock History Results if query exists */}
          {query.length > 2 && (
             <>
               <div className="px-4 py-2 mt-4 text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Search Web</div>
               <div className="flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer hover:bg-[var(--bg-surface-hover)]">
                  <div className="p-2 rounded-lg bg-[var(--bg-subtle)] text-[var(--text-secondary)]">
                    <Search size={16} />
                  </div>
                   <div className="flex-1 min-w-0">
                    <div className="text-[var(--text-primary)] font-medium truncate">Search Google for "{query}"</div>
                  </div>
               </div>
             </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandBar;
