import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const CATEGORIES = [
  'NYC Queer Nightlife',
  'Live Music & Jazz',
  'Dance & DJ Events',
  'Community & Social',
  'Black & Brown',
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { events, scrapedContent } = await req.json();

    // If we have scraped content, extract events from it first
    let eventsToProcess = events;
    
    if (scrapedContent && !events) {
      // Use AI to extract events from scraped content
      const extractResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-3-flash-preview',
          messages: [
            {
              role: 'system',
              content: `You are an event data extractor. Extract event information from the provided content and return a JSON array of events. Each event should have: name, date, time, price (number), description, platform (DICE/Eventbrite/Partiful/Posh), venue (if available). Return ONLY valid JSON array, no other text.`
            },
            {
              role: 'user',
              content: `Extract all events from this content:\n\n${scrapedContent}`
            }
          ],
        }),
      });

      if (extractResponse.ok) {
        const extractData = await extractResponse.json();
        const content = extractData.choices?.[0]?.message?.content || '[]';
        try {
          // Try to parse JSON from response, handling markdown code blocks
          let jsonStr = content;
          if (content.includes('```')) {
            jsonStr = content.replace(/```json\n?|\n?```/g, '').trim();
          }
          eventsToProcess = JSON.parse(jsonStr);
        } catch (e) {
          console.error('Failed to parse extracted events:', e);
          eventsToProcess = [];
        }
      }
    }

    if (!eventsToProcess || eventsToProcess.length === 0) {
      return new Response(
        JSON.stringify({ success: true, categorizedEvents: {} }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Categorize events using AI
    const categorizeResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: `You are an event categorizer for NYC nightlife. Categorize each event into one or more of these categories: ${CATEGORIES.join(', ')}.

Rules:
- "NYC Queer Nightlife": LGBTQ+ events, drag shows, pride events, queer-friendly venues
- "Live Music & Jazz": Concerts, jazz nights, live bands, musical performances
- "Dance & DJ Events": Dance parties, DJ sets, club nights, electronic music
- "Community & Social": Trivia, networking, open mics, comedy, workshops
- "Black & Brown": Events celebrating Black, African, Caribbean, Latin cultures, Afrobeats, reggae, hip-hop

An event can belong to multiple categories. Return a JSON object where keys are category names and values are arrays of event objects with their full data. Return ONLY valid JSON.`
          },
          {
            role: 'user',
            content: `Categorize these events:\n\n${JSON.stringify(eventsToProcess, null, 2)}`
          }
        ],
      }),
    });

    if (!categorizeResponse.ok) {
      if (categorizeResponse.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: 'Rate limit exceeded, please try again later' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (categorizeResponse.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: 'Payment required for AI features' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error('AI categorization failed');
    }

    const categorizeData = await categorizeResponse.json();
    const content = categorizeData.choices?.[0]?.message?.content || '{}';
    
    let categorizedEvents;
    try {
      let jsonStr = content;
      if (content.includes('```')) {
        jsonStr = content.replace(/```json\n?|\n?```/g, '').trim();
      }
      categorizedEvents = JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse categorized events:', e);
      categorizedEvents = {};
    }

    // Also calculate top popular by crowd size
    const allEvents = eventsToProcess.map((e: any, i: number) => ({
      ...e,
      id: e.id || i + 1,
      crowd: e.crowd || Math.floor(Math.random() * 200) + 50,
      capacity: e.capacity || Math.floor(Math.random() * 100) + 100,
      enjoyment: e.enjoyment || (Math.random() * 2 + 3).toFixed(1),
    }));
    
    const topPopular = [...allEvents]
      .sort((a, b) => (b.crowd || 0) - (a.crowd || 0))
      .slice(0, 25);

    return new Response(
      JSON.stringify({ 
        success: true, 
        categorizedEvents,
        topPopular,
        allEvents 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error categorizing events:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
