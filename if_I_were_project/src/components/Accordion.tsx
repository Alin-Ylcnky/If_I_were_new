import { ReactNode, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type AccordionProps = {
  title: string;
  weekNumber: number;
  children: ReactNode;
  defaultOpen?: boolean;
  isEditMode?: boolean;
  onTitleChange?: (title: string) => void;
};

export function Accordion({
  title,
  weekNumber,
  children,
  defaultOpen = false,
  isEditMode = false,
  onTitleChange
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleTitleClick = (e: React.MouseEvent) => {
    if (isEditMode) {
      e.stopPropagation();
      setIsEditingTitle(true);
    }
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (onTitleChange && editedTitle !== title) {
      onTitleChange(editedTitle);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsEditingTitle(false);
      if (onTitleChange && editedTitle !== title) {
        onTitleChange(editedTitle);
      }
    } else if (e.key === 'Escape') {
      setEditedTitle(title);
      setIsEditingTitle(false);
    }
  };


  return (
    <div className="border-b border-white/10 last:border-b-0 group/accordion">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between transition-all duration-300 text-left group relative hover:bg-white/5"
      >
        <div className="flex-1 flex items-center gap-3">
          <span
            className="text-sm uppercase tracking-wider"
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 500,
              color: '#E5E5E5'
            }}
          >
            Week {weekNumber}
          </span>
          <span style={{ color: '#666666' }}>•</span>
          {isEditMode && isEditingTitle ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 text-xl rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white/30 border border-white/20"
              style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#E5E5E5', fontFamily: "'Manrope', sans-serif", fontWeight: 300 }}
              autoFocus
            />
          ) : (
            <h3
              className={`text-xl text-glow ${isEditMode ? 'cursor-text transition-colors' : ''}`}
              onClick={handleTitleClick}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontWeight: 400,
                color: '#E5E5E5'
              }}
            >
              {title || `Week ${weekNumber}`}
              {isEditMode && (
                <span className="text-sm ml-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#666666' }}>
                  (click to edit)
                </span>
              )}
            </h3>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="flex-shrink-0 transform group-hover:scale-110 transition-transform" size={24} style={{ color: '#A3A3A3' }} />
        ) : (
          <ChevronDown className="flex-shrink-0 transform group-hover:scale-110 transition-transform" size={24} style={{ color: '#A3A3A3' }} />
        )}
      </button>

      {isOpen && (
        <div className="px-6 pb-8 pt-2 animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
}
