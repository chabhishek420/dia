
import React, { useState, useRef } from 'react';
import { X, Send, Sparkles, Bot, PanelLeft, Edit, ChevronDown, Plus, Globe, Brain, Zap, Code, Image as ImageIcon, Search } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [width, setWidth] = useLocalStorage('arc-chat-width', 360);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleResizeStart = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = width;
    const target = e.currentTarget;
    
    target.setPointerCapture(e.pointerId);
    
    // Inverted logic for right sidebar: Dragging left increases width
    const onPointerMove = (moveEvent: PointerEvent) => {
        const newWidth = startWidth + (startX - moveEvent.clientX);
        setWidth(Math.min(Math.max(newWidth, 300), 600)); // Min 300px, Max 600px
    };
    
    const onPointerUp = (upEvent: PointerEvent) => {
        setIsResizing(false);
        target.releasePointerCapture(upEvent.pointerId);
        target.removeEventListener('pointermove', onPointerMove);
        target.removeEventListener('pointerup', onPointerUp);
    };
    
    target.addEventListener('pointermove', onPointerMove);
    target.addEventListener('pointerup', onPointerUp);
  };

  // Styles mirroring the Sidebar architecture
  const panelStyle = {
    width: width,
    backgroundColor: 'transparent',
  } as React.CSSProperties;

  if (!isOpen) return <div className="w-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]" />;

  return (
    <div 
        ref={sidebarRef}
        style={panelStyle}
        className={`
            flex flex-col h-full shrink-0 select-none outline-none overflow-hidden 
            transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] relative
            ${isResizing ? 'transition-none' : ''}
        `}
    >
      {/* Resizer Handle (Left Side) */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize z-50 hover:bg-white/10 opacity-0 hover:opacity-100 transition-opacity group touch-none"
        onPointerDown={handleResizeStart}
        onDoubleClick={() => setWidth(360)}
      />

      {/* Content Container with gap matching BrowserView */}
      <div className="flex-1 flex flex-col min-h-0 p-2 pl-0 h-full">
          <div className="w-full h-full flex flex-col bg-[var(--bg-surface)] text-[var(--text-primary)] rounded-xl overflow-hidden shadow-[var(--shadow-lg)] border border-[var(--border-subtle)] ring-1 ring-black/5">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] shrink-0">
                <div className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer">
                  <button onClick={onClose} className="hover:text-[var(--text-primary)] transition-colors">
                     <PanelLeft size={18} className="rotate-180" /> {/* Rotated for right side context */}
                  </button>
                  <Edit size={18} />
                  <div className="flex items-center gap-1 text-sm font-medium text-[var(--text-primary)]">
                    <span>Gemini Pro</span>
                    <ChevronDown size={14} className="opacity-50" />
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-[var(--accent-color)] flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  AI
                </div>
              </div>

              {/* Main Content Area - Empty State */}
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center opacity-0 animate-in fade-in duration-700">
                 {/* Placeholder for chat history */}
              </div>

              {/* Footer Area */}
              <div className="p-4 space-y-4 shrink-0">
                
                {/* Suggestion Chips */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mask-linear-fade">
                  {[
                    { icon: <Zap size={14} className="text-orange-400" />, label: "Summarize" },
                    { icon: <Code size={14} className="text-blue-400" />, label: "Analyze Code" },
                    { icon: <Sparkles size={14} className="text-yellow-400" />, label: "Ideate" },
                    { icon: <Search size={14} className="text-green-400" />, label: "Research" },
                  ].map((chip, idx) => (
                    <button key={idx} className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface-hover)] rounded-xl text-xs font-medium text-[var(--text-secondary)] whitespace-nowrap transition-colors border border-[var(--border-subtle)]">
                      {chip.icon}
                      {chip.label}
                    </button>
                  ))}
                </div>

                {/* Input Container */}
                <div className="bg-[var(--bg-subtle)] rounded-2xl p-3 border border-[var(--border-subtle)] shadow-[var(--shadow-sm)] relative group focus-within:ring-2 focus-within:ring-[var(--accent-surface)] transition-all">
                  <input 
                    className="w-full bg-transparent outline-none text-[var(--text-primary)] placeholder-[var(--text-tertiary)] text-sm mb-10 pl-1"
                    placeholder="How can I help you today?"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  
                  <div className="absolute bottom-3 left-3 right-3 flex items-end gap-2">
                    <button className="p-2 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] transition-colors shadow-sm border border-[var(--border-subtle)]">
                      <Plus size={16} />
                    </button>
                    <button className="p-2 rounded-lg bg-transparent hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] transition-colors">
                      <Globe size={16} />
                    </button>
                    
                     <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] text-xs font-medium transition-colors mr-auto shadow-sm border border-[var(--border-subtle)]">
                      <Brain size={14} />
                      Deep Think
                    </button>

                     <button 
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shadow-sm ${input ? 'bg-[var(--accent-color)] text-white' : 'bg-[var(--bg-surface-hover)] text-[var(--text-tertiary)]'}`}
                     >
                         <Send size={14} fill={input ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default ChatPanel;
