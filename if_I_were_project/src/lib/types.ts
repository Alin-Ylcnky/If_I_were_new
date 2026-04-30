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

export type SettingItem = {
  id: string;
  setting_key: string;
  setting_value: string;
  is_active: boolean;
};
