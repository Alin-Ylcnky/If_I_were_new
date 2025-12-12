import { Link as LinkIcon } from 'lucide-react';

type LinkUrlInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function LinkUrlInput({
  value,
  onChange,
  placeholder = "Enter URL (e.g., https://example.com)"
}: LinkUrlInputProps) {
  const isValidUrl = (url: string) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const valid = isValidUrl(value);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
        <LinkIcon size={16} />
        Link URL
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 transition-all duration-200 text-gray-900 placeholder-gray-400 ${
          valid
            ? 'border-gray-200 focus:border-[#2A584B] focus:ring-[#2A584B]/20'
            : 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
        }`}
      />
      {!valid && value && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          Please enter a valid URL
        </p>
      )}
    </div>
  );
}
