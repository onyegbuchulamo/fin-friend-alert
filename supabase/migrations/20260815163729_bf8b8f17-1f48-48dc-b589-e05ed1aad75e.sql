CREATE TABLE public.farms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  location text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  phone text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.farms TO anon, authenticated;
GRANT ALL ON public.farms TO service_role;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Farms are publicly viewable" ON public.farms FOR SELECT USING (true);

CREATE TABLE public.readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id uuid NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  rainfall_mm numeric NOT NULL,
  ph numeric NOT NULL,
  turbidity_ntu numeric NOT NULL,
  temperature_c numeric NOT NULL,
  dissolved_oxygen numeric NOT NULL,
  water_quality_index numeric,
  risk_level text NOT NULL DEFAULT 'SAFE',
  source text NOT NULL DEFAULT 'open-meteo'
);

CREATE INDEX readings_farm_recorded_idx ON public.readings (farm_id, recorded_at DESC);

GRANT SELECT ON public.readings TO anon, authenticated;
GRANT ALL ON public.readings TO service_role;
ALTER TABLE public.readings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Readings are publicly viewable" ON public.readings FOR SELECT USING (true);

INSERT INTO public.farms (slug, name, location, latitude, longitude, phone) VALUES
  ('renaissance-umuahia', 'Renaissance Farms', 'Umuahia, Abia State', 5.5320, 7.4860, '+2347042176940'),
  ('aba-delta', 'Aba Delta Fisheries', 'Aba, Abia State', 5.1167, 7.3667, '+2348031122334'),
  ('ohafia-ponds', 'Ohafia Community Ponds', 'Ohafia, Abia State', 5.6167, 7.8333, '+2348055667788'),
  ('arochukwu-aqua', 'Arochukwu Aqua Cluster', 'Arochukwu, Abia State', 5.3833, 7.9167, '+2348023344556'),
  ('bende-catfish', 'Bende Catfish Collective', 'Bende, Abia State', 5.5667, 7.6333, '+2348099887766');