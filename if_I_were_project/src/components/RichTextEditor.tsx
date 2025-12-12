import { useRef, useEffect, KeyboardEvent } from 'react';
import { RichTextToolbar } from './RichTextToolbar';

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  fontFamily?: string;
  onFontFamilyChange?: (family: string) => void;
};

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  className = '',
  fontFamily = 'sans-serif',
  onFontFamilyChange
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const getFontClass = (family: string) => {
    const fontMap: Record<string, string> = {
      'sans-serif': 'font-sans',
      'sans': 'font-sans',
      'dm-sans': 'font-dm-sans',
      'open-sans': 'font-open-sans',
      'raleway': 'font-raleway',
      'montserrat': 'font-montserrat',
      'roboto': 'font-roboto',
      'poppins': 'font-poppins',
      'condensed': 'font-condensed',
      'serif': 'font-serif',
      'crimson': 'font-crimson',
      'lora': 'font-lora',
      'merriweather': 'font-merriweather',
      'baskerville': 'font-baskerville',
      'handwriting': 'font-handwriting',
      'allura': 'font-allura',
      'bebas': 'font-bebas',
      'monospace': 'font-mono',
      'mono': 'font-mono',
    };
    return fontMap[family] || 'font-sans';
  };

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const handleBold = () => execCommand('bold');
  const handleItalic = () => execCommand('italic');
  const handleUnderline = () => execCommand('underline');
  const handleStrikethrough = () => execCommand('strikeThrough');

  const handleAlignLeft = () => execCommand('justifyLeft');
  const handleAlignCenter = () => execCommand('justifyCenter');
  const handleAlignRight = () => execCommand('justifyRight');

  const handleBulletList = () => execCommand('insertUnorderedList');
  const handleNumberedList = () => execCommand('insertOrderedList');

  const handleInsertLink = () => {
    const url = prompt('Enter the URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const handleFontSize = (size: 'heading' | 'paragraph') => {
    if (size === 'heading') {
      execCommand('fontSize', '5');
    } else {
      execCommand('fontSize', '3');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b') {
        e.preventDefault();
        handleBold();
      } else if (e.key === 'i') {
        e.preventDefault();
        handleItalic();
      } else if (e.key === 'u') {
        e.preventDefault();
        handleUnderline();
      }
    }
  };

  const handleClick = () => {
    editorRef.current?.focus();
  };

  const handleFontFamilyChange = (family: string) => {
    if (onFontFamilyChange) {
      onFontFamilyChange(family);
    }
  };

  return (
    <div className={className}>
      <RichTextToolbar
        onBold={handleBold}
        onItalic={handleItalic}
        onUnderline={handleUnderline}
        onStrikethrough={handleStrikethrough}
        onAlignLeft={handleAlignLeft}
        onAlignCenter={handleAlignCenter}
        onAlignRight={handleAlignRight}
        onBulletList={handleBulletList}
        onNumberedList={handleNumberedList}
        onInsertLink={handleInsertLink}
        onFontSize={handleFontSize}
        onFontFamily={handleFontFamilyChange}
        currentFontFamily={fontFamily}
      />
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        className={`min-h-[150px] p-4 border border-gray-200 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-[#2A584B] focus:border-transparent bg-white shadow-inner transition-all cursor-text ${getFontClass(fontFamily)}`}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
      <style>
        {`
          [contentEditable][data-placeholder]:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
            pointer-events: none;
          }
          [contentEditable] a {
            color: #2A584B;
            text-decoration: underline;
            cursor: pointer;
          }
          [contentEditable]:focus {
            outline: none;
          }
        `}
      </style>
    </div>
  );
}
