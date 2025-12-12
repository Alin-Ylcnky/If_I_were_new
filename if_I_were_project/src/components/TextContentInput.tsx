type TextContentInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function TextContentInput({
  value,
  onChange,
  placeholder = "Enter your text content here..."
}: TextContentInputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        Text Content
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={6}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A584B] focus:ring-2 focus:ring-[#2A584B]/20 transition-all duration-200 resize-y min-h-[120px] text-gray-900 placeholder-gray-400"
      />
    </div>
  );
}
