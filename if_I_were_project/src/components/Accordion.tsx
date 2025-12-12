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
    <div className="border-b border-gray-700 last:border-b-0 group/accordion">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between hover:bg-[#0a2750]/60 transition-all duration-300 text-left group relative hover:border-l-4 hover:border-l-[#32CD32] hover:shadow-lg hover:shadow-[#A8E6A1]/20"
      >
        <div className="flex-1 flex items-center gap-3">
          <span
            className="text-sm uppercase tracking-wider"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 200,
              color: '#7dd3c0',
              textShadow: '0 0 12px rgba(125, 211, 192, 0.6), 0 0 20px rgba(125, 211, 192, 0.3)'
            }}
          >
            Week {weekNumber}
          </span>
          <span className="text-gray-600">•</span>
          {isEditMode && isEditingTitle ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 text-xl font-medium bg-[#081e40] text-slate-200 border border-[#2A584B] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#2A584B]"
              autoFocus
            />
          ) : (
            <h3
              className={`text-xl text-slate-200 ${isEditMode ? 'cursor-text hover:text-cyan-200 transition-colors' : ''}`}
              onClick={handleTitleClick}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 200
              }}
            >
              {title || `Week ${weekNumber}`}
              {isEditMode && (
                <span className="text-sm text-gray-500 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  (click to edit)
                </span>
              )}
            </h3>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="text-gray-500 flex-shrink-0 transform group-hover:scale-110 transition-transform" size={24} />
        ) : (
          <ChevronDown className="text-gray-500 flex-shrink-0 transform group-hover:scale-110 transition-transform" size={24} />
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
