GRANT DELETE ON public.sessions TO anon;
CREATE POLICY "Anon can delete any session" ON public.sessions FOR DELETE TO anon USING (true);