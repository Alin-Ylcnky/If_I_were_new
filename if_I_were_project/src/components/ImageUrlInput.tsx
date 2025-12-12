import { useState } from 'react';
import { Image, AlertCircle } from 'lucide-react';

type ImageUrlInputProps = {
  value: string;
  onChange: (url: string) => void;
  className?: string;
};

export function ImageUrlInput({ value, onChange, className = '' }: ImageUrlInputProps) {
  const [error, setError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    onChange(url);
    setError(false);
  };

  const handleImageError = () => {
    setError(true);
  };

  const handleImageLoad = () => {
    setError(false);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Image size={16} className="inline mr-1" />
        Image URL
      </label>
      <input
        type="url"
        value={value}
        onChange={handleChange}
        placeholder="https://example.com/image.jpg"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A584B] focus:border-transparent outline-none transition-all"
      />

      {value && isValidUrl(value) && (
        <div className="mt-4">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
              <p className="text-red-800 text-sm">
                Unable to load image. Please check the URL and ensure it points to a valid image.
              </p>
            </div>
          ) : (
            <img
              src={value}
              alt="Preview"
              onError={handleImageError}
              onLoad={handleImageLoad}
              className="w-full aspect-[4/5] object-cover rounded-lg"
            />
          )}
        </div>
      )}
    </div>
  );
}
