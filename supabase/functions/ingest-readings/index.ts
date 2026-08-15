import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'

type Farm = {
  id: string
  slug: string
  name: string
  latitude: number
  longitude: number
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
const round = (v: number, d = 1) => Number(v.toFixed(d))

// Derive pond water parameters from real observed weather.
function deriveWater(rain24h: number, airTemp: number, humidity: number) {
  // Water temperature lags air temperature and stays cooler at depth.
  const temperature_c = round(clamp(airTemp * 0.82 + 4.5, 18, 38))
  // Runoff drives suspended solids.
  const turbidity_ntu = round(clamp(12 + rain24h * 1.9, 5, 200), 0)
  // Rainfall in the Niger Delta belt is acidic; heavy rain pushes pH down.
  const ph = round(clamp(7.6 - rain24h * 0.022 - (humidity - 70) * 0.004, 4.5, 9.5))
  // Dissolved oxygen falls as water warms.
  const dissolved_oxygen = round(clamp(14.6 - 0.32 * temperature_c + (rain24h > 20 ? 0.4 : 0), 1.5, 12))
  return { temperature_c, turbidity_ntu, ph, dissolved_oxygen }
}

function waterQualityIndex(ph: number, turbidity: number, temp: number, dox: number) {
  const phScore = clamp(100 - Math.abs(ph - 7.2) * 28, 0, 100)
  const turbScore = clamp(100 - turbidity * 1.1, 0, 100)
  const tempScore = clamp(100 - Math.abs(temp - 27) * 8, 0, 100)
  const doScore = clamp((dox / 8) * 100, 0, 100)
  return Math.round(phScore * 0.25 + turbScore * 0.25 + tempScore * 0.2 + doScore * 0.3)
}

function riskLevel(rain: number, ph: number, turbidity: number, temp: number) {
  if (rain > 75 && turbidity > 60) return 'DANGER'
  if (rain > 50 || ph < 6 || ph > 9 || temp > 32) return 'WARNING'
  return 'SAFE'
}

async function fetchWeather(farm: Farm) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${farm.latitude}&longitude=${farm.longitude}` +
    `&current=temperature_2m,relative_humidity_2m,precipitation&past_days=1` +
    `&daily=precipitation_sum,precipitation_probability_max,temperature_2m_max&timezone=Africa%2FLagos&forecast_days=7`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Open-Meteo ${res.status} for ${farm.slug}`)
  return await res.json()
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: farms, error } = await supabase
      .from('farms')
      .select('id, slug, name, latitude, longitude')
      .eq('is_active', true)
    if (error) throw error

    const results = []
    for (const farm of (farms ?? []) as Farm[]) {
      try {
        const wx = await fetchWeather(farm)
        const todayIdx = Math.max(0, (wx.daily?.time ?? []).length - 7)
        const rain24h = Number(wx.daily?.precipitation_sum?.[todayIdx] ?? wx.current?.precipitation ?? 0)
        const airTemp = Number(wx.current?.temperature_2m ?? 28)
        const humidity = Number(wx.current?.relative_humidity_2m ?? 80)

        const water = deriveWater(rain24h, airTemp, humidity)
        const rainfall_mm = round(rain24h)
        const wqi = waterQualityIndex(water.ph, water.turbidity_ntu, water.temperature_c, water.dissolved_oxygen)
        const risk = riskLevel(rainfall_mm, water.ph, water.turbidity_ntu, water.temperature_c)

        const { data: inserted, error: insertError } = await supabase
          .from('readings')
          .insert({
            farm_id: farm.id,
            rainfall_mm,
            ph: water.ph,
            turbidity_ntu: water.turbidity_ntu,
            temperature_c: water.temperature_c,
            dissolved_oxygen: water.dissolved_oxygen,
            water_quality_index: wqi,
            risk_level: risk,
            source: 'open-meteo',
          })
          .select()
          .single()
        if (insertError) throw insertError

        results.push({
          farm_slug: farm.slug,
          reading: inserted,
          forecast: (wx.daily?.time ?? []).slice(-7).map((day: string, i: number) => ({
            date: day,
            rain_mm: Number((wx.daily.precipitation_sum ?? [])[wx.daily.time.length - 7 + i] ?? 0),
            rain_probability: Number((wx.daily.precipitation_probability_max ?? [])[wx.daily.time.length - 7 + i] ?? 0),
            temp_max: Number((wx.daily.temperature_2m_max ?? [])[wx.daily.time.length - 7 + i] ?? 0),
          })),
        })
      } catch (e) {
        results.push({ farm_slug: farm.slug, error: String(e) })
      }
    }

    return new Response(JSON.stringify({ ingested_at: new Date().toISOString(), results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
