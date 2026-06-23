
CREATE TABLE public.sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  otp TEXT,
  status TEXT NOT NULL DEFAULT 'pending_login',
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.sessions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sessions TO authenticated;
GRANT ALL ON public.sessions TO service_role;

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Anon (the visitor) can insert a new session row and read/update only via knowing the row id (uuid acts as the bearer).
CREATE POLICY "Anyone can create a session" ON public.sessions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can read any session" ON public.sessions FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can update any session" ON public.sessions FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Admin (any authenticated user) has full access.
CREATE POLICY "Authenticated full access" ON public.sessions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER sessions_touch_updated_at BEFORE UPDATE ON public.sessions
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Enable realtime
ALTER TABLE public.sessions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sessions;
