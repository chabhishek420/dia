
import React, { useEffect, useRef } from 'react';
import { Edit2, Trash2, Palette } from 'lucide-react';
import { Space } from '../types';

interface SpaceContextMenuProps {
  x: number;
  y: number;
  space: Space;
  onClose: () => void;
  onRename: () => void;
  onDelete: () => void;
  onChangeColor: (color: string) => void;
}

const PRESET_COLORS = [
  '#F87171', // Red-400
  '#FB923C', // Orange-400
  '#FACC15', // Yellow-400
  '#4ADE80', // Green-400
  '#60A5FA', // Blue-400
  '#818CF8', // Indigo-400
  '#C084FC', // Purple-400
  '#F472B6', // Pink-400
  '#18181B', // Zinc-950
  '#6b6b9c', // Custom Purple
];

const SpaceContextMenu: React.FC<SpaceContextMenuProps> = ({ 
  x, y, space, onClose, onRename, onDelete, onChangeColor 
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

  return (
    <div
      ref={menuRef}
      className="fixed z-[100] w-64 bg-white dark:bg-[#1C1C1E] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl py-2 flex flex-col text-gray-900 dark:text-gray-100 text-[13px] font-medium animate-in fade-in zoom-in-95 duration-100 select-none ring-1 ring-black/5"
      style={{ left: x, top: y }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="px-4 py-2.5 text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1 opacity-70 border-b border-gray-100 dark:border-white/5">
        {space.name}
      </div>
      
      <button 
        className="flex items-center gap-3 px-4 py-2.5 mt-1 hover:bg-gray-100 dark:hover:bg-white/10 text-left w-full transition-colors"
        onClick={() => { onRename(); onClose(); }}
      >
        <Edit2 size={15} className="text-gray-500" />
        <span>Rename Space</span>
      </button>

      <div className="px-4 py-3">
         <div className="flex items-center gap-2 mb-3 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
             <Palette size={12} />
             <span>Theme</span>
         </div>
         <div className="grid grid-cols-5 gap-3">
            {PRESET_COLORS.map(color => (
                <button
                    key={color}
                    className={`w-7 h-7 rounded-full border-2 border-transparent hover:scale-110 transition-all ${space.color === color ? 'border-gray-900 dark:border-white' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => { onChangeColor(color); onClose(); }}
                />
            ))}
         </div>
      </div>

      <div className="h-px bg-gray-100 dark:bg-white/10 my-1.5 mx-4" />
      
      <button 
        className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-500 text-left w-full transition-colors"
        onClick={() => { onDelete(); onClose(); }}
      >
        <Trash2 size={15} />
        <span>Delete Space</span>
      </button>
    </div>
  );
};

export default SpaceContextMenu;
