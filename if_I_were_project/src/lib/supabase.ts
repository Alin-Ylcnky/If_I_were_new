import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file or deployment environment.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'creative-canvas-auth',
  },
});

export type Week = {
  id: string;
  week_number: number;
  title: string;
  created_at: string;
};

export type Contribution = {
  id: string;
  week_id: string;
  contributor_type: 'A' | 'B';
  image_url: string;
  text_content_html: string;
  font_family: string;
  image_size: string;
  updated_at: string;
};

export type AuthorizedUser = {
  id: string;
  email: string;
  created_at: string;
};

export type OurStoryImage = {
  id: string;
  image_url: string | null;
  caption: string;
  text_content: string;
  display_order: number;
  image_size: string;
  created_at: string;
  updated_at: string;
};

export type SiteSettings = {
  id: string;
  setting_key: string;
  setting_value: string;
  created_at: string;
  updated_at: string;
};
