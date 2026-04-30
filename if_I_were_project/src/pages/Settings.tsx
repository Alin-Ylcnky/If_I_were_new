import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Mail, Instagram, Type, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import type { SettingItem } from '../lib/types';

export function Settings() {
  const { isAuthorized } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SettingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!isAuthorized) {
      navigate('/login');
      return;
    }
    loadSettings();
  }, [isAuthorized, navigate]);

  const loadSettings = async () => {
    try {
      const { settings: data } = await api.get<{ settings: SettingItem[] }>('/api/settings', { auth: true });
      setSettings(data || []);
    } catch {
      setSettings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSetting = (settingKey: string, field: 'setting_value' | 'is_active', value: string | boolean) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.setting_key === settingKey
          ? { ...setting, [field]: value }
          : setting
      )
    );
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setSaveStatus('idle');

    try {
      await api.put('/api/settings/bulk', { settings }, { auth: true });

      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch {
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const getSettingIcon = (key: string) => {
    if (key.includes('instagram')) return <Instagram size={20} />;
    if (key.includes('email')) return <Mail size={20} />;
    if (key.includes('font')) return <Type size={20} />;
    if (key.includes('author_name')) return <User size={20} />;
    return null;
  };

  const getSettingLabel = (key: string) => {
    return key
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const isFontSetting = (key: string) => key.startsWith('font_');
  const isAuthorSetting = (key: string) => key.startsWith('author_name_');

  const fontOptions = [
    { value: 'sans', label: 'Inter (Sans)' },
    { value: 'dm-sans', label: 'DM Sans' },
    { value: 'open-sans', label: 'Open Sans' },
    { value: 'raleway', label: 'Raleway' },
    { value: 'montserrat', label: 'Montserrat' },
    { value: 'roboto', label: 'Roboto' },
    { value: 'poppins', label: 'Poppins' },
    { value: 'condensed', label: 'Roboto Condensed' },
    { value: 'serif', label: 'Playfair Display' },
    { value: 'crimson', label: 'Crimson Text' },
    { value: 'lora', label: 'Lora' },
    { value: 'merriweather', label: 'Merriweather' },
    { value: 'baskerville', label: 'Libre Baskerville' },
    { value: 'handwriting', label: 'Dancing Script' },
    { value: 'allura', label: 'Allura' },
    { value: 'bebas', label: 'Bebas Neue' },
    { value: 'mono', label: 'Fira Code' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-slate-300">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl text-white mb-2" style={{ fontFamily: 'Allura, cursive' }}>
            Site Settings
          </h1>
          <p className="text-slate-400 text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 200 }}>
            Manage your site's social links and contact information
          </p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 p-8">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl text-white mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                Typography
              </h2>
              <div className="space-y-6">
                {settings.filter((s) => isFontSetting(s.setting_key)).map((setting) => (
                  <div key={setting.id} className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-300">
                      {getSettingIcon(setting.setting_key)}
                      <label className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
                        {getSettingLabel(setting.setting_key)}
                      </label>
                    </div>

                    <select
                      value={setting.setting_value}
                      onChange={(e) =>
                        handleUpdateSetting(setting.setting_key, 'setting_value', e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
                    >
                      {fontOptions.map((option) => (
                        <option key={option.value} value={option.value} className="bg-slate-800">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <h2 className="text-xl text-white mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                Author Information
              </h2>
              <div className="space-y-6">
                {settings.filter((s) => isAuthorSetting(s.setting_key)).map((setting) => (
                  <div key={setting.id} className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-300">
                      {getSettingIcon(setting.setting_key)}
                      <label className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
                        {getSettingLabel(setting.setting_key)}
                      </label>
                    </div>

                    <input
                      type="text"
                      value={setting.setting_value}
                      onChange={(e) =>
                        handleUpdateSetting(setting.setting_key, 'setting_value', e.target.value)
                      }
                      placeholder={`Enter ${getSettingLabel(setting.setting_key).toLowerCase()}`}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/30"
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <h2 className="text-xl text-white mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                Social & Contact
              </h2>
              <div className="space-y-6">
                {settings.filter((s) => !isFontSetting(s.setting_key) && !isAuthorSetting(s.setting_key)).map((setting) => (
                  <div key={setting.id} className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-300">
                      {getSettingIcon(setting.setting_key)}
                      <label className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
                        {getSettingLabel(setting.setting_key)}
                      </label>
                    </div>

                    <input
                      type="text"
                      value={setting.setting_value}
                      onChange={(e) =>
                        handleUpdateSetting(setting.setting_key, 'setting_value', e.target.value)
                      }
                      placeholder={`Enter ${getSettingLabel(setting.setting_key).toLowerCase()}`}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/30"
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
                    />

                    <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={setting.is_active}
                        onChange={(e) =>
                          handleUpdateSetting(setting.setting_key, 'is_active', e.target.checked)
                        }
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-white focus:ring-white/30"
                      />
                      <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
                        Display on site
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
            >
              <Save size={18} />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>

            {saveStatus === 'success' && (
              <span className="text-green-400 text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
                Settings saved successfully!
              </span>
            )}

            {saveStatus === 'error' && (
              <span className="text-red-400 text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
                Failed to save settings
              </span>
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
            <h3 className="text-slate-300 text-sm mb-3" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
              How it works
            </h3>
            <ul className="space-y-2 text-slate-400 text-xs" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 200 }}>
              <li>• Choose fonts for different text elements throughout your site</li>
              <li>• Font preferences apply to body text, headings, UI elements, and accents</li>
              <li>• Add social media URLs to display icons in the footer</li>
              <li>• Set contact email addresses to receive form submissions</li>
              <li>• Toggle "Display on site" to show or hide social/contact settings</li>
              <li>• Changes take effect immediately after saving</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
