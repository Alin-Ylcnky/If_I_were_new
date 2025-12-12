/*
  # Add font preference settings to site_settings table

  1. New Settings
    - Adds font preference settings for various UI elements:
      - `font_body` - Font for main body text (paragraphs, general content)
      - `font_heading` - Font for headings (h1-h6)
      - `font_ui` - Font for UI elements (buttons, labels, forms)
      - `font_accent` - Font for special/accent text (quotes, callouts)
    
  2. Initial Values
    - Sets default font preferences based on current design:
      - Body: DM Sans
      - Heading: Playfair Display
      - UI: Inter
      - Accent: Dancing Script

  3. Notes
    - All font settings are active by default
    - Values match the font family keys in Tailwind config
    - Settings can be updated through the Settings page UI
*/

INSERT INTO site_settings (setting_key, setting_value, is_active)
VALUES 
  ('font_body', 'dm-sans', true),
  ('font_heading', 'serif', true),
  ('font_ui', 'sans', true),
  ('font_accent', 'handwriting', true)
ON CONFLICT (setting_key) DO NOTHING;