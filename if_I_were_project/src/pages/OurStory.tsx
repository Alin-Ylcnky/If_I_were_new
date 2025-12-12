import { useEffect, useState } from 'react';
import { Loader2, Plus, Save, Trash2, GripVertical } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { OurStoryImage } from '../lib/supabase';
import { ImageDisplay } from '../components/ImageDisplay';
import { RichTextEditor } from '../components/RichTextEditor';
import { RichTextDisplay } from '../components/RichTextDisplay';

export function OurStory() {
  const { isAuthorized } = useAuth();
  const [images, setImages] = useState<OurStoryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newTextContent, setNewTextContent] = useState('');
  const [newImageSize, setNewImageSize] = useState('600px');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [editTextContent, setEditTextContent] = useState('');
  const [editImageSize, setEditImageSize] = useState('600px');

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('our_story_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;


      setImages(data || []);
    } catch {
      setError('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = async () => {
    if (!newImageUrl.trim() && !newTextContent.trim()) {
      setError('Please provide either an image URL or text content');
      return;
    }

    try {
      const maxOrder = images.length > 0 ? Math.max(...images.map(img => img.display_order)) : -1;

      const { data, error: insertError } = await supabase
        .from('our_story_images')
        .insert({
          image_url: newImageUrl.trim() || null,
          caption: newCaption,
          text_content: newTextContent,
          image_size: newImageSize,
          display_order: maxOrder + 1,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      if (data) {
        setImages([...images, data]);
        setNewImageUrl('');
        setNewCaption('');
        setNewTextContent('');
        setNewImageSize('600px');
        setIsAdding(false);
      }
    } catch {
      setError('Failed to add image');
    }
  };

  const handleUpdateCaption = async (id: string, caption: string, textContent: string, imageSize: string) => {
    try {
      const { error: updateError } = await supabase
        .from('our_story_images')
        .update({ caption, text_content: textContent, image_size: imageSize, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (updateError) throw updateError;

      setImages(images.map(img =>
        img.id === id ? { ...img, caption, text_content: textContent, image_size: imageSize, updated_at: new Date().toISOString() } : img
      ));
      setEditingId(null);
    } catch {
      setError('Failed to update image');
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('our_story_images')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setImages(images.filter(img => img.id !== id));
    } catch {
      setError('Failed to delete image');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={48} className="text-gray-800 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-red-600 drop-shadow-md">{error}</p>
      </div>
    );
  }

  if (images.length === 0 && isAuthorized) {
    return (
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6 tracking-wide animate-fadeIn text-cyan-200 drop-shadow-2xl" style={{
            fontFamily: 'Allura, cursive',
            textShadow: '0 0 20px rgba(125, 211, 192, 0.8), 0 0 30px rgba(125, 211, 192, 0.5), 0 0 40px rgba(125, 211, 192, 0.3)'
          }}>
            Our Story
          </h1>
          <p className="text-slate-200/90 mb-8 text-lg">No content yet. Add your first entry to get started!</p>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2A584B] to-[#1f4136] text-white rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Plus size={20} />
            <span>Add Content</span>
          </button>

          {isAdding && (
            <div className="mt-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 max-w-xl mx-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A584B] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
                  <textarea
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    placeholder="Add a caption..."
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A584B] focus:border-transparent outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text Content</label>
                  <RichTextEditor
                    value={newTextContent}
                    onChange={setNewTextContent}
                    placeholder="Add your story text..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image Size</label>
                  <select
                    value={newImageSize}
                    onChange={(e) => setNewImageSize(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A584B] focus:border-transparent outline-none"
                  >
                    <option value="300px">Small (300px)</option>
                    <option value="400px">Medium (400px)</option>
                    <option value="600px">Large (600px)</option>
                    <option value="800px">Extra Large (800px)</option>
                    <option value="100%">Full Width</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleAddImage}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-[#2A584B] to-[#1f4136] text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    Add Content
                  </button>
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setNewImageUrl('');
                      setNewCaption('');
                      setNewTextContent('');
                      setNewImageSize('600px');
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6 tracking-wide animate-fadeIn text-cyan-200 drop-shadow-2xl" style={{
            fontFamily: 'Allura, cursive',
            textShadow: '0 0 20px rgba(125, 211, 192, 0.8), 0 0 30px rgba(125, 211, 192, 0.5), 0 0 40px rgba(125, 211, 192, 0.3)'
          }}>
            Our Story
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed text-slate-200/90 drop-shadow-lg italic" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 200 }}>
            Captured moments, shared memories
          </p>
        </div>

        {isAuthorized && (
          <div className="mb-12 text-center">
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2A584B] to-[#1f4136] text-white rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Plus size={20} />
              <span>{isAdding ? 'Cancel' : 'Add Content'}</span>
            </button>
          </div>
        )}

        {isAdding && isAuthorized && (
          <div className="mb-16 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 max-w-2xl mx-auto">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A584B] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
                <textarea
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="Add a caption..."
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A584B] focus:border-transparent outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Text Content</label>
                <RichTextEditor
                  value={newTextContent}
                  onChange={setNewTextContent}
                  placeholder="Add your story text..."
                />
              </div>
              <button
                onClick={handleAddImage}
                disabled={!newImageUrl.trim() && !newTextContent.trim()}
                className="w-full px-4 py-2 bg-gradient-to-r from-[#2A584B] to-[#1f4136] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Content
              </button>
            </div>
          </div>
        )}

        <div className="space-y-16">
          {images.map((image, index) => (
            <article key={image.id} className="animate-fadeIn">
              {isAuthorized && (
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <GripVertical size={16} />
                    <span>Order: {image.display_order}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="text-white/70 hover:text-red-300 transition-colors p-2 hover:bg-white/10 rounded-lg"
                    title="Delete content"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}

              {image.image_url && (
                <div className="mb-8">
                  <ImageDisplay
                    url={image.image_url}
                    alt={image.caption || 'Our story image'}
                    maxWidth={image.image_size || '600px'}
                  />
                </div>
              )}

              <div className="max-w-2xl mx-auto">
                {editingId === image.id ? (
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
                      <textarea
                        value={editCaption}
                        onChange={(e) => setEditCaption(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A584B] focus:border-transparent outline-none resize-none"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Text Content</label>
                      <RichTextEditor
                        value={editTextContent}
                        onChange={setEditTextContent}
                        placeholder="Add text content..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Image Size</label>
                      <select
                        value={editImageSize}
                        onChange={(e) => setEditImageSize(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A584B] focus:border-transparent outline-none"
                      >
                        <option value="300px">Small (300px)</option>
                        <option value="400px">Medium (400px)</option>
                        <option value="600px">Large (600px)</option>
                        <option value="800px">Extra Large (800px)</option>
                        <option value="100%">Full Width</option>
                      </select>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleUpdateCaption(image.id, editCaption, editTextContent, editImageSize)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#2A584B] text-white rounded-lg hover:bg-[#1f4136] transition-colors"
                      >
                        <Save size={16} />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      if (isAuthorized) {
                        setEditingId(image.id);
                        setEditCaption(image.caption);
                        setEditTextContent(image.text_content);
                        setEditImageSize(image.image_size || '600px');
                      }
                    }}
                    className={isAuthorized ? 'cursor-pointer' : ''}
                  >
                    {image.caption && (
                      <h2 className={`text-xl sm:text-2xl font-semibold mb-4 text-white/95 text-center drop-shadow-lg ${isAuthorized ? 'hover:text-cyan-200' : ''} transition-colors`}>
                        {image.caption}
                      </h2>
                    )}
                    {image.text_content ? (
                      <div className={`text-base sm:text-lg leading-relaxed text-white/90 drop-shadow-md ${isAuthorized ? 'hover:text-white' : ''} transition-colors prose prose-lg prose-invert max-w-none`}>
                        <RichTextDisplay html={image.text_content} />
                      </div>
                    ) : (
                      isAuthorized && (
                        <p className="text-white/50 italic text-center hover:text-white/70 transition-colors">
                          Click to add content...
                        </p>
                      )
                    )}
                  </div>
                )}
              </div>

              {index < images.length - 1 && (
                <div className="mt-16 flex justify-center">
                  <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
