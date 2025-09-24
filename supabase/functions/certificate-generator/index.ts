import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { PDFDocument, rgb, StandardFonts } from 'https://esm.sh/pdf-lib@1.17.1';

const corsHeaders = { /* ... CORS headers ... */ };

serve(async (req) => {
  console.log("Function invoked!"); // DEBUG LOG 1
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("Inside try block."); // DEBUG LOG 2
    const { signup_id } = await req.json();
    console.log("Received signup_id:", signup_id); // DEBUG LOG 3

    if (!signup_id) throw new Error('Missing signup_id in request body');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    console.log("Supabase client created."); // DEBUG LOG 4

    // ... (rest of the function logic)
    const { data: signupData, error: fetchError } = await supabase
      .from('Signup')
      .select(`Volunteer ( name ), Event ( name )`)
      .eq('signup_id', signup_id)
      .single();
    console.log("Fetched data:", signupData); // DEBUG LOG 5

    if (fetchError) throw new Error(`Database query failed: ${fetchError.message}`);
    // ... (The rest of your robust code)
    if (!signupData) throw new Error(`No signup record found for ID: ${signup_id}`);
    // ...

    // ... PDF Generation, Upload, Insert ...

    return new Response(JSON.stringify({ url: publicUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("ERROR in catch block:", error.message); // This should now catch and log the error
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});