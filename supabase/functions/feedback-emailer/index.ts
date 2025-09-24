import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// Get the Resend API Key from the secrets we set earlier
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

serve(async (_req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}` } } }
    );

    // 1. Calculate yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedDate = yesterday.toISOString().split('T')[0];

    // 2. Find events that ended yesterday
    const { data: events, error: eventsError } = await supabase
      .from('Event')
      .select('event_id, name')
      .eq('event_date', formattedDate);

    if (eventsError) throw eventsError;

    for (const event of events) {
      // 3. Get all signups for that event, including the volunteer's email
      const { data: signups, error: signupsError } = await supabase
        .from('Signup')
        .select(`
          signup_id,
          Volunteer ( email, name )
        `)
        .eq('event_id', event.event_id);

      if (signupsError) throw signupsError;
      
      // 4. Loop through each signup and send an email
      for (const signup of signups) {
        const volunteer = signup.Volunteer;
        const feedbackUrl = `https://<your-vercel-app-url>/feedback/${event.event_id}/${signup.signup_id}`;
        
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: 'feedback@yourdomain.com', // You'll need to verify a domain in Resend for this to work
            to: volunteer.email,
            subject: `Feedback for ${event.name}`,
            html: `
              <p>Hi ${volunteer.name || 'Volunteer'},</p>
              <p>Thank you for participating in ${event.name}.</p>
              <p>Please provide your feedback by clicking this link: <a href="${feedbackUrl}">Leave Feedback</a></p>
            `,
          }),
        });

        if (!res.ok) {
          console.error(`Failed to send email to ${volunteer.email}`);
        }
      }
    }

    return new Response(JSON.stringify({ message: "Feedback emails processed." }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});