import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const {
  PORT = 8080,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  FRONTEND_ORIGIN,
} = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend environment.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const app = express();

app.use(
  cors({
    origin: FRONTEND_ORIGIN ? FRONTEND_ORIGIN.split(',').map((origin) => origin.trim()) : '*',
  })
);
app.use(express.json());

app.get('/healthz', (_req, res) => {
  res.status(200).json({ ok: true });
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'name, email, and message are required.',
      });
    }

    const { data: settings, error: settingsError } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', 'contact_email')
      .eq('is_active', true)
      .maybeSingle();

    if (settingsError) {
      throw new Error('Failed to fetch email settings.');
    }

    const recipientEmail = settings?.setting_value || '';

    const { error: insertError } = await supabase.from('contact_messages').insert({
      name,
      email,
      message,
      status: 'new',
    });

    if (insertError) {
      throw new Error('Failed to save contact message.');
    }

    console.log(`Contact message from ${name} (${email}) saved.`);
    if (recipientEmail) {
      console.log(`Notification recipient configured: ${recipientEmail}`);
    }

    return res.status(200).json({
      success: true,
      message: 'Contact message received.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
