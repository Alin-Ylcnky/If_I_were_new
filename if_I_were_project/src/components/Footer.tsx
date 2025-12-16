import { useState, useEffect } from 'react';
import { Instagram, Mail, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SiteSettings {
  instagram_url?: string;
  contact_email?: string;
  author_name_a?: string;
  author_name_b?: string;
}

export function Footer() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value, is_active')
        .eq('is_active', true);

      if (error) {
        console.error('Error loading settings:', error);
        return;
      }

      if (data) {
        const settingsObj: SiteSettings = {};
        data.forEach((item) => {
          if (item.setting_value && item.setting_value.trim() !== '') {
            settingsObj[item.setting_key as keyof SiteSettings] = item.setting_value.trim();
          }
        });
        setSettings(settingsObj);
      }
    } catch (err) {
      console.error('Unexpected error loading settings:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/send-contact-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => {
          setShowContactForm(false);
          setSubmitStatus('idle');
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="relative mt-auto backdrop-blur-md bg-black/20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="flex flex-col items-center sm:items-start gap-1">
              <h3 className="text-base sm:text-lg" style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontWeight: 400,
                color: '#E5E5E5'
              }}>
                If I were...
              </h3>
              <p className="text-xs sm:text-sm" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 300, color: '#A3A3A3' }}>
                A mirror for the imagined self
              </p>
            </div>

            <div className="flex flex-col items-center gap-1" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 300 }}>
              <span className="text-xs sm:text-sm" style={{ fontWeight: 300, color: '#A3A3A3' }}>Designed by</span>
              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                <span className="text-xs sm:text-sm" style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 400,
                  color: '#E5E5E5'
                }}>
                  {settings.author_name_a || 'Dr. Alin Yalcinkaya'}
                </span>
                <span className="text-xs sm:text-sm" style={{ fontWeight: 300, color: '#A3A3A3' }}>&</span>
                <span className="text-xs sm:text-sm" style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 400,
                  color: '#E5E5E5'
                }}>
                  {settings.author_name_b || 'Dr. Kelsey Virginia Dufresne'}
                </span>
                <span className="text-xs sm:text-sm" style={{ fontWeight: 300, color: '#A3A3A3' }}>with</span>
                <span className="text-sm" style={{ color: '#A11248' }}>♥</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowContactForm(true)}
                className="text-glow inline-flex items-center gap-2 transition-colors text-xs sm:text-sm"
                style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 300, color: '#A3A3A3' }}
              >
                <Mail size={18} className="sm:w-5 sm:h-5" />
                <span>Contact</span>
              </button>

              {settings.instagram_url ? (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-glow transition-colors"
                  style={{ color: '#A3A3A3' }}
                  aria-label="Instagram"
                >
                  <Instagram size={18} className="sm:w-5 sm:h-5" />
                </a>
              ) : (
                <div
                  className="opacity-50 cursor-not-allowed"
                  style={{ color: '#666666' }}
                  aria-label="Instagram (not configured)"
                >
                  <Instagram size={18} className="sm:w-5 sm:h-5" />
                </div>
              )}
            </div>

            <div className="flex flex-col items-center sm:items-end gap-0.5" style={{ fontFamily: "'Manrope', sans-serif" }}>
              <p className="text-sm" style={{ fontWeight: 300, color: '#A3A3A3' }}>
                © {currentYear}
              </p>
              <p className="text-xs" style={{ fontWeight: 300, color: '#666666' }}>
                All rights reserved
              </p>
            </div>
          </div>
        </div>
      </footer>

      {showContactForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 p-6">
            <button
              onClick={() => setShowContactForm(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl text-white mb-6" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
              Get in Touch
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-slate-300 text-sm mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/30"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-slate-300 text-sm mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/30"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-slate-300 text-sm mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
              >
                {isSubmitting ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Send Message</span>
                  </>
                )}
              </button>

              {submitStatus === 'success' && (
                <p className="text-green-400 text-sm text-center" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
                  Message sent successfully!
                </p>
              )}

              {submitStatus === 'error' && (
                <p className="text-red-400 text-sm text-center" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
                  Failed to send message. Please try again.
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
