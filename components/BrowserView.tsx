
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Lock, Star, MoreHorizontal, PanelLeft, PanelRightOpen, Loader2 } from 'lucide-react';
import { Tab } from '../types';

interface BrowserViewProps {
  activeTab?: Tab;
  onUpdateTabUrl: (tabId: string, url: string) => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
  onToggleSidebar: () => void;
}

const BrowserView: React.FC<BrowserViewProps> = ({ activeTab, onUpdateTabUrl, onToggleChat, isChatOpen, onToggleSidebar }) => {
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [iframeKey, setIframeKey] = useState(0); 
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (activeTab) {
      setUrlInput(activeTab.url);
      setIsLoading(true);
    }
  }, [activeTab]);

  const handleReload = () => {
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && activeTab) {
      let finalUrl = urlInput;
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = 'https://' + finalUrl;
      }
      onUpdateTabUrl(activeTab.id, finalUrl);
      setIsLoading(true);
      (e.target as HTMLInputElement).blur();
    }
  };

  if (!activeTab) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-[var(--bg-surface)] text-[var(--text-tertiary)] select-none rounded-xl shadow-[var(--shadow-lg)]">
        <p className="font-medium text-lg text-[var(--text-secondary)]">No content open</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-[var(--bg-surface)] relative transition-colors duration-500 rounded-xl overflow-hidden shadow-[var(--shadow-lg)] ring-1 ring-black/5">
      
      {/* Top Bar - Minimalist */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] z-20 h-12">
        
        {/* Left Nav */}
        <div className="flex items-center gap-1 text-[var(--text-secondary)]">
          <button 
            onClick={onToggleSidebar}
            className="p-2 hover:bg-[var(--bg-surface-hover)] rounded-md transition-colors"
            title="Toggle Sidebar"
          >
            <PanelLeft size={16} />
          </button>
          <button className="p-2 hover:bg-[var(--bg-surface-hover)] rounded-md transition-colors">
            <ArrowLeft size={16} />
          </button>
          <button className="p-2 hover:bg-[var(--bg-surface-hover)] rounded-md transition-colors">
            <ArrowRight size={16} />
          </button>
          <button onClick={handleReload} className={`p-2 hover:bg-[var(--bg-surface-hover)] rounded-md transition-colors ${isLoading ? 'animate-spin' : ''}`}>
             {isLoading ? <Loader2 size={16} /> : <RotateCcw size={16} />}
          </button>
        </div>

        {/* URL Bar */}
        <div className="flex-1 max-w-2xl px-4">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface-hover)] transition-colors group border border-transparent hover:border-[var(--border-subtle)] shadow-sm">
                {activeTab.url.startsWith('https') && <Lock size={12} className="text-[var(--text-tertiary)]" />}
                <input 
                    className="flex-1 bg-transparent outline-none text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)]"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={(e) => e.target.select()}
                />
                <Star size={12} className="text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 cursor-pointer hover:text-yellow-400 transition-all" />
             </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 text-[var(--text-secondary)]">
           {!isChatOpen && (
              <button 
                onClick={onToggleChat} 
                className="p-2 hover:bg-[var(--bg-surface-hover)] rounded-md transition-colors text-[var(--text-secondary)]"
                title="Open AI Assistant"
              >
                  <PanelRightOpen size={18} />
              </button>
           )}
          <button className="p-2 hover:bg-[var(--bg-surface-hover)] rounded-md transition-colors">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative bg-white">
        <iframe 
            key={iframeKey}
            ref={iframeRef}
            src={activeTab.url} 
            title={activeTab.title}
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
        />
        
        {/* Loading Bar */}
        {isLoading && (
            <div className="absolute top-0 left-0 w-full h-0.5 z-30">
                <div className="h-full bg-[var(--accent-color)] animate-[progress_1.5s_ease-in-out_infinite]" style={{ width: '30%' }} />
            </div>
        )}
      </div>
    </div>
  );
};

export default BrowserView;
