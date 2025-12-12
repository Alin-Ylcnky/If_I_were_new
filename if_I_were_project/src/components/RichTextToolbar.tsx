import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link as LinkIcon,
  Type,
} from 'lucide-react';

type RichTextToolbarProps = {
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onStrikethrough: () => void;
  onAlignLeft: () => void;
  onAlignCenter: () => void;
  onAlignRight: () => void;
  onBulletList: () => void;
  onNumberedList: () => void;
  onInsertLink: () => void;
  onFontSize: (size: 'heading' | 'paragraph') => void;
  onFontFamily: (family: string) => void;
  currentFontFamily: string;
};

export function RichTextToolbar({
  onBold,
  onItalic,
  onUnderline,
  onStrikethrough,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  onBulletList,
  onNumberedList,
  onInsertLink,
  onFontSize,
  onFontFamily,
  currentFontFamily,
}: RichTextToolbarProps) {
  const fontOptions = [
    { value: 'sans-serif', label: 'Inter (Sans)', class: 'font-sans' },
    { value: 'dm-sans', label: 'DM Sans', class: 'font-dm-sans' },
    { value: 'open-sans', label: 'Open Sans', class: 'font-open-sans' },
    { value: 'raleway', label: 'Raleway', class: 'font-raleway' },
    { value: 'montserrat', label: 'Montserrat', class: 'font-montserrat' },
    { value: 'roboto', label: 'Roboto', class: 'font-roboto' },
    { value: 'poppins', label: 'Poppins', class: 'font-poppins' },
    { value: 'condensed', label: 'Roboto Condensed', class: 'font-condensed' },
    { value: 'serif', label: 'Playfair Display', class: 'font-serif' },
    { value: 'crimson', label: 'Crimson Text', class: 'font-crimson' },
    { value: 'lora', label: 'Lora', class: 'font-lora' },
    { value: 'merriweather', label: 'Merriweather', class: 'font-merriweather' },
    { value: 'baskerville', label: 'Libre Baskerville', class: 'font-baskerville' },
    { value: 'handwriting', label: 'Dancing Script', class: 'font-handwriting' },
    { value: 'allura', label: 'Allura', class: 'font-allura' },
    { value: 'bebas', label: 'Bebas Neue', class: 'font-bebas' },
    { value: 'monospace', label: 'Fira Code', class: 'font-mono' },
  ];
  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border border-b-0 border-gray-200 shadow-sm">
      <select
        value={currentFontFamily}
        onChange={(e) => onFontFamily(e.target.value)}
        className="px-3 py-1.5 bg-white border border-gray-200 rounded hover:shadow-sm transition-all text-sm text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2A584B] focus:border-transparent"
        title="Font Family"
      >
        {fontOptions.map((option) => (
          <option key={option.value} value={option.value} className={option.class}>
            {option.label}
          </option>
        ))}
      </select>

      <div className="h-6 w-px bg-gray-300 mx-1" />

      <button
        type="button"
        onClick={() => onFontSize('heading')}
        className="px-3 py-1.5 hover:bg-white hover:shadow-sm rounded transition-all text-sm font-medium text-gray-700"
        title="Heading"
      >
        <Type size={18} className="inline mr-1" />
        H
      </button>

      <button
        type="button"
        onClick={() => onFontSize('paragraph')}
        className="px-3 py-1.5 hover:bg-white hover:shadow-sm rounded transition-all text-sm text-gray-700"
        title="Paragraph"
      >
        <Type size={16} className="inline mr-1" />
        P
      </button>

      <div className="h-6 w-px bg-gray-300 mx-1" />

      <button
        type="button"
        onClick={onBold}
        className="p-2 hover:bg-white hover:shadow-sm rounded transition-all group"
        title="Bold (Ctrl+B)"
      >
        <Bold size={18} className="text-gray-700 group-hover:text-gray-900" />
      </button>

      <button
        type="button"
        onClick={onItalic}
        className="p-2 hover:bg-white hover:shadow-sm rounded transition-all group"
        title="Italic (Ctrl+I)"
      >
        <Italic size={18} className="text-gray-700 group-hover:text-gray-900" />
      </button>

      <button
        type="button"
        onClick={onUnderline}
        className="p-2 hover:bg-white hover:shadow-sm rounded transition-all group"
        title="Underline (Ctrl+U)"
      >
        <Underline size={18} className="text-gray-700 group-hover:text-gray-900" />
      </button>

      <button
        type="button"
        onClick={onStrikethrough}
        className="p-2 hover:bg-white hover:shadow-sm rounded transition-all group"
        title="Strikethrough"
      >
        <Strikethrough size={18} className="text-gray-700 group-hover:text-gray-900" />
      </button>

      <div className="h-6 w-px bg-gray-300 mx-1" />

      <button
        type="button"
        onClick={onAlignLeft}
        className="p-2 hover:bg-white hover:shadow-sm rounded transition-all group"
        title="Align Left"
      >
        <AlignLeft size={18} className="text-gray-700 group-hover:text-gray-900" />
      </button>

      <button
        type="button"
        onClick={onAlignCenter}
        className="p-2 hover:bg-white hover:shadow-sm rounded transition-all group"
        title="Align Center"
      >
        <AlignCenter size={18} className="text-gray-700 group-hover:text-gray-900" />
      </button>

      <button
        type="button"
        onClick={onAlignRight}
        className="p-2 hover:bg-white hover:shadow-sm rounded transition-all group"
        title="Align Right"
      >
        <AlignRight size={18} className="text-gray-700 group-hover:text-gray-900" />
      </button>

      <div className="h-6 w-px bg-gray-300 mx-1" />

      <button
        type="button"
        onClick={onBulletList}
        className="p-2 hover:bg-white hover:shadow-sm rounded transition-all group"
        title="Bullet List"
      >
        <List size={18} className="text-gray-700 group-hover:text-gray-900" />
      </button>

      <button
        type="button"
        onClick={onNumberedList}
        className="p-2 hover:bg-white hover:shadow-sm rounded transition-all group"
        title="Numbered List"
      >
        <ListOrdered size={18} className="text-gray-700 group-hover:text-gray-900" />
      </button>

      <div className="h-6 w-px bg-gray-300 mx-1" />

      <button
        type="button"
        onClick={onInsertLink}
        className="p-2 hover:bg-white hover:shadow-sm rounded transition-all group"
        title="Insert Link"
      >
        <LinkIcon size={18} className="text-gray-700 group-hover:text-gray-900" />
      </button>
    </div>
  );
}
