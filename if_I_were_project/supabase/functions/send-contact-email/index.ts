import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { name, email, message }: ContactMessage = await req.json();

    const { data: settings, error: settingsError } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', 'contact_email')
      .eq('is_active', true)
      .maybeSingle();

    if (settingsError) {
      throw new Error('Failed to fetch email settings');
    }

    const recipientEmail = settings?.setting_value || '';

    const { error: insertError } = await supabase
      .from('contact_messages')
      .insert({
        name,
        email,
        message,
        status: 'new',
      });

    if (insertError) {
      throw new Error('Failed to save contact message');
    }

    console.log(`Contact message from ${name} (${email}) saved successfully`);
    console.log(`Would send email to: ${recipientEmail}`);
    console.log(`Message: ${message}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Contact message received and saved. Email notification will be sent when email service is configured.',
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error processing contact message:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      }
    );
  }
});