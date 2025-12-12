import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

type ImageDisplayProps = {
  url: string;
  alt?: string;
  className?: string;
  maxWidth?: string;
};

export function ImageDisplay({ url, alt = 'Image', className = '', maxWidth = '600px' }: ImageDisplayProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
    return false;
  };

  if (!url || url.trim() === '') {
    return null;
  }

  return (
    <div className={`flex justify-center ${className}`} onContextMenu={handleContextMenu}>
      {error ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-gray-400 mt-0.5 flex-shrink-0" size={20} />
          <p className="text-gray-600 text-sm">Image unavailable</p>
        </div>
      ) : (
        <>
          {loading && (
            <div className="h-64 bg-gray-100 rounded-lg animate-pulse" style={{ width: maxWidth, maxWidth: '100%' }} />
          )}
          <img
            src={url}
            alt={alt}
            onError={() => setError(true)}
            onLoad={() => setLoading(false)}
            onContextMenu={handleContextMenu}
            onDragStart={handleDragStart}
            className={`h-auto rounded-lg ${loading ? 'hidden' : ''}`}
            style={{ width: maxWidth, maxWidth: '100%' }}
          />
        </>
      )}
    </div>
  );
}
