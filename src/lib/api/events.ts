import { supabase } from '@/integrations/supabase/client';
import { VENUES } from '@/data/venues';

export type Event = {
  id: number;
  name: string;
  date: string;
  time: string;
  price: number;
  description: string;
  platform: string;
  crowd: number;
  capacity: number;
  enjoyment: number;
  venue?: string;
  category?: string[];
};

export type CategorizedEvents = {
  [category: string]: Event[];
};

// Categories available in the app
export const EVENT_CATEGORIES = [
  { id: 'queer', name: 'NYC Queer Nightlife', icon: '🏳️‍🌈', description: 'LGBTQ+ friendly events, drag shows, pride parties' },
  { id: 'music', name: 'Live Music & Jazz', icon: '🎵', description: 'Concerts, jazz nights, live performances' },
  { id: 'dance', name: 'Dance & DJ Events', icon: '💃', description: 'Dance parties, DJ sets, club nights' },
  { id: 'social', name: 'Community & Social', icon: '🤝', description: 'Trivia, comedy, networking, open mics' },
  { id: 'culture', name: 'Black & Brown', icon: '✊🏾', description: 'Afrobeats, reggae, Caribbean, Latin culture' },
  { id: 'popular', name: 'Top 25 Most Popular', icon: '🔥', description: 'Highest attendance events this month' },
];

// Get all events from static data
export function getAllStaticEvents(): Event[] {
  return VENUES.flatMap(venue => 
    venue.events.map(event => ({
      ...event,
      venue: venue.name,
    }))
  );
}

// Categorize events locally based on keywords
export function categorizeEventsLocally(events: Event[]): CategorizedEvents {
  const categories: CategorizedEvents = {
    'NYC Queer Nightlife': [],
    'Live Music & Jazz': [],
    'Dance & DJ Events': [],
    'Community & Social': [],
    'Black & Brown': [],
    'Top 25 Most Popular': [],
  };

  const queerKeywords = ['queer', 'lgbtq', 'drag', 'pride', 'gay', 'lesbian', 'trans', 'dyke', 'vixen'];
  const musicKeywords = ['jazz', 'live', 'band', 'concert', 'music', 'drums', 'blues', 'acoustic'];
  const danceKeywords = ['dance', 'dj', 'party', 'club', 'house', 'throwback', '90s', 'disco'];
  const socialKeywords = ['trivia', 'comedy', 'open mic', 'karaoke', 'bingo', 'networking', 'wine', 'tasting'];
  const cultureKeywords = ['afro', 'caribbean', 'haitian', 'reggae', 'hip hop', 'r&b', 'soul', 'funk', 'voodoo', 'chunes'];

  events.forEach(event => {
    const searchText = `${event.name} ${event.description} ${event.venue || ''}`.toLowerCase();

    if (queerKeywords.some(k => searchText.includes(k))) {
      categories['NYC Queer Nightlife'].push(event);
    }
    if (musicKeywords.some(k => searchText.includes(k))) {
      categories['Live Music & Jazz'].push(event);
    }
    if (danceKeywords.some(k => searchText.includes(k))) {
      categories['Dance & DJ Events'].push(event);
    }
    if (socialKeywords.some(k => searchText.includes(k))) {
      categories['Community & Social'].push(event);
    }
    if (cultureKeywords.some(k => searchText.includes(k))) {
      categories['Black & Brown'].push(event);
    }
  });

  // Top 25 by crowd size
  categories['Top 25 Most Popular'] = [...events]
    .sort((a, b) => b.crowd - a.crowd)
    .slice(0, 25);

  return categories;
}

// Scrape and categorize events using backend
export async function fetchAndCategorizeEvents(url?: string): Promise<{
  categorizedEvents: CategorizedEvents;
  allEvents: Event[];
  error?: string;
}> {
  try {
    // First scrape events
    const { data: scrapeData, error: scrapeError } = await supabase.functions.invoke('scrape-events', {
      body: { url, platform: 'dice' },
    });

    if (scrapeError) {
      console.error('Scrape error:', scrapeError);
      // Fall back to static data
      const staticEvents = getAllStaticEvents();
      return {
        categorizedEvents: categorizeEventsLocally(staticEvents),
        allEvents: staticEvents,
      };
    }

    const scrapedContent = scrapeData?.data?.data?.markdown || scrapeData?.data?.markdown || '';

    // Then categorize with AI
    const { data: categorizeData, error: categorizeError } = await supabase.functions.invoke('categorize-events', {
      body: { scrapedContent },
    });

    if (categorizeError) {
      console.error('Categorize error:', categorizeError);
      const staticEvents = getAllStaticEvents();
      return {
        categorizedEvents: categorizeEventsLocally(staticEvents),
        allEvents: staticEvents,
      };
    }

    return {
      categorizedEvents: categorizeData.categorizedEvents || {},
      allEvents: categorizeData.allEvents || [],
    };
  } catch (error) {
    console.error('Error fetching events:', error);
    const staticEvents = getAllStaticEvents();
    return {
      categorizedEvents: categorizeEventsLocally(staticEvents),
      allEvents: staticEvents,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
