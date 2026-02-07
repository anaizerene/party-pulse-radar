
-- Create venues table
CREATE TABLE public.venues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  description TEXT,
  platform TEXT NOT NULL DEFAULT 'Other',
  crowd INTEGER NOT NULL DEFAULT 0,
  capacity INTEGER NOT NULL DEFAULT 0,
  enjoyment NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Venues policies
CREATE POLICY "Anyone can read venues" ON public.venues FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create venues" ON public.venues FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Creators can update their venues" ON public.venues FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Creators can delete their venues" ON public.venues FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Events policies
CREATE POLICY "Anyone can read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create events" ON public.events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Creators can update their events" ON public.events FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Creators can delete their events" ON public.events FOR DELETE TO authenticated USING (auth.uid() = user_id);
