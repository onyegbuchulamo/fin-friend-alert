import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type RiskLevel = "SAFE" | "WARNING" | "DANGER";

export interface Farm {
  id: string;
  slug: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  phone: string | null;
}

export interface Reading {
  id: string;
  farm_id: string;
  recorded_at: string;
  rainfall_mm: number;
  ph: number;
  turbidity_ntu: number;
  temperature_c: number;
  dissolved_oxygen: number;
  water_quality_index: number | null;
  risk_level: RiskLevel;
  source: string;
}

export interface ForecastDay {
  day: string;
  date: string;
  rain: number;
  temp: number;
  humidity: number;
  floodProbability: number;
  risk: RiskLevel;
}

const num = (v: unknown) => Number(v ?? 0);

const toReading = (r: Record<string, unknown>): Reading => ({
  id: String(r.id),
  farm_id: String(r.farm_id),
  recorded_at: String(r.recorded_at),
  rainfall_mm: num(r.rainfall_mm),
  ph: num(r.ph),
  turbidity_ntu: num(r.turbidity_ntu),
  temperature_c: num(r.temperature_c),
  dissolved_oxygen: num(r.dissolved_oxygen),
  water_quality_index: r.water_quality_index === null ? null : num(r.water_quality_index),
  risk_level: (r.risk_level as RiskLevel) ?? "SAFE",
  source: String(r.source ?? "open-meteo"),
});

const floodRisk = (rain: number): RiskLevel => (rain > 50 ? "DANGER" : rain > 25 ? "WARNING" : "SAFE");

export function useFarmData() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [farmId, setFarmId] = useState<string | null>(null);
  const [history, setHistory] = useState<Reading[]>([]);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const farm = useMemo(() => farms.find((f) => f.id === farmId) ?? null, [farms, farmId]);
  const latest = history[0] ?? null;

  const loadFarms = useCallback(async () => {
    const { data, error } = await supabase
      .from("farms")
      .select("id, slug, name, location, latitude, longitude, phone")
      .eq("is_active", true)
      .order("name");
    if (error) {
      setError(error.message);
      return;
    }
    const list = (data ?? []) as unknown as Farm[];
    setFarms(list);
    setFarmId((prev) => prev ?? list[0]?.id ?? null);
  }, []);

  const loadHistory = useCallback(async (id: string) => {
    const { data, error } = await supabase
      .from("readings")
      .select("*")
      .eq("farm_id", id)
      .order("recorded_at", { ascending: false })
      .limit(48);
    if (error) {
      setError(error.message);
      return;
    }
    setHistory(((data ?? []) as Record<string, unknown>[]).map(toReading));
  }, []);

  const loadForecast = useCallback(async (f: Farm) => {
    try {
      const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${f.latitude}&longitude=${f.longitude}` +
        `&daily=precipitation_sum,precipitation_probability_max,temperature_2m_max,relative_humidity_2m_max` +
        `&timezone=Africa%2FLagos&forecast_days=7`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Weather service ${res.status}`);
      const json = await res.json();
      const days: ForecastDay[] = (json.daily?.time ?? []).map((date: string, i: number) => {
        const rain = Math.round(num(json.daily.precipitation_sum?.[i]));
        return {
          date,
          day: i === 0 ? "Today" : new Date(date).toLocaleDateString(undefined, { weekday: "short" }),
          rain,
          temp: Math.round(num(json.daily.temperature_2m_max?.[i])),
          humidity: Math.round(num(json.daily.relative_humidity_2m_max?.[i])),
          floodProbability: Math.min(99, Math.round(num(json.daily.precipitation_probability_max?.[i]) * 0.5 + rain * 1.4)),
          risk: floodRisk(rain),
        };
      });
      setForecast(days);
    } catch (e) {
      setError(String(e));
    }
  }, []);

  const refresh = useCallback(async () => {
    if (!farmId) return;
    setRefreshing(true);
    setError(null);
    try {
      await supabase.functions.invoke("ingest-readings");
      await loadHistory(farmId);
      const f = farms.find((x) => x.id === farmId);
      if (f) await loadForecast(f);
    } catch (e) {
      setError(String(e));
    } finally {
      setRefreshing(false);
    }
  }, [farmId, farms, loadHistory, loadForecast]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadFarms();
      setLoading(false);
    })();
  }, [loadFarms]);

  useEffect(() => {
    if (!farmId) return;
    loadHistory(farmId);
    const f = farms.find((x) => x.id === farmId);
    if (f) loadForecast(f);
  }, [farmId, farms, loadHistory, loadForecast]);

  return {
    farms,
    farm,
    farmId,
    setFarmId,
    latest,
    history,
    forecast,
    loading,
    refreshing,
    error,
    refresh,
  };
}
