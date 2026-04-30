import { useState } from 'react';
import { Save, Check, Loader2 } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { RichTextDisplay } from './RichTextDisplay';
import { ImageUrlInput } from './ImageUrlInput';
import { ImageDisplay } from './ImageDisplay';
import type { Contribution } from '../lib/types';

type WeekContributionProps = {
  contribution: Contribution;
  contributorLabel: string;
  isEditMode: boolean;
  onSave: (contributionId: string, updates: Partial<Contribution>) => Promise<void>;
};

export function WeekContribution({
  contribution,
  contributorLabel,
  isEditMode,
  onSave,
}: WeekContributionProps) {
  const [imageUrl, setImageUrl] = useState(contribution.image_url);
  const [textContentHtml, setTextContentHtml] = useState(contribution.text_content_html || '');
  const [fontFamily, setFontFamily] = useState(contribution.font_family || 'sans-serif');
  const [imageSize, setImageSize] = useState(contribution.image_size || '600px');
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const handleChange = (field: 'image_url' | 'text_content_html' | 'font_family' | 'image_size', value: string) => {
    setIsDirty(true);
    setJustSaved(false);

    if (field === 'image_url') setImageUrl(value);
    if (field === 'text_content_html') setTextContentHtml(value);
    if (field === 'font_family') setFontFamily(value);
    if (field === 'image_size') setImageSize(value);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(contribution.id, {
        image_url: imageUrl,
        text_content_html: textContentHtml,
        font_family: fontFamily,
        image_size: imageSize,
      });
      setIsDirty(false);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    } catch {
      setIsDirty(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 p-6 rounded-xl shadow-md hover:shadow-xl hover:shadow-[#A8E6A1]/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-gray-600">
        <h4 className="text-xl font-semibold text-white tracking-tight" style={{ fontFamily: 'DM Sans, sans-serif', textShadow: '0 0 10px rgba(168, 230, 161, 0.4), 0 0 20px rgba(168, 230, 161, 0.2)' }}>{contributorLabel}</h4>
        {isEditMode && (
          <button
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#2A584B] to-[#1f4136] text-white rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium"
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : justSaved ? (
              <>
                <Check size={18} className="animate-bounce" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save</span>
              </>
            )}
          </button>
        )}
      </div>

      {isEditMode ? (
        <div className="space-y-6">
          <div className="p-4 rounded-lg">
            <label className="flex items-center gap-2 text-sm font-bold text-[#08402a] mb-3 uppercase tracking-wide">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">1</span>
              Image
            </label>
            <ImageUrlInput
              value={imageUrl}
              onChange={(value) => handleChange('image_url', value)}
            />
            <div className="mt-3">
              <label className="block text-xs font-semibold text-gray-700 mb-2">Image Size</label>
              <select
                value={imageSize}
                onChange={(e) => handleChange('image_size', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              >
                <option value="300px">Small (300px)</option>
                <option value="400px">Medium (400px)</option>
                <option value="600px">Large (600px)</option>
                <option value="800px">Extra Large (800px)</option>
                <option value="100%">Full Width</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-lg">
            <label className="flex items-center gap-2 text-sm font-bold text-[#08402a] mb-3 uppercase tracking-wide">
              <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">2</span>
              Text Content
            </label>
            <RichTextEditor
              value={textContentHtml}
              onChange={(value) => handleChange('text_content_html', value)}
              placeholder="Write your text content here with formatting and links..."
              fontFamily={fontFamily}
              onFontFamilyChange={(value) => handleChange('font_family', value)}
            />
          </div>

          {isDirty && (
            <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="font-medium">You have unsaved changes</span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {imageUrl && (
            <div className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <ImageDisplay url={imageUrl} maxWidth={imageSize} />
            </div>
          )}

          {textContentHtml && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100">
              <h5 className="text-sm font-bold text-[#08402a] mb-3 uppercase tracking-wide flex items-center gap-2">
                <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">T</span>
                Text Content
              </h5>
              <RichTextDisplay html={textContentHtml} fontFamily={fontFamily} />
            </div>
          )}

          {!imageUrl && !textContentHtml && (
            <div className="text-center py-12">
              <p className="text-gray-400 italic text-lg">No content yet...</p>
              <p className="text-gray-300 text-sm mt-2">Start creating to see your work here</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
