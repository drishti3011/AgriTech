import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.js';
import { api } from '../services/api.js';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  CloudRain, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Volume2,
  Thermometer,
  Calendar
} from 'lucide-react';

export const WeatherPestWidget: React.FC = () => {
  const { t, speakText } = useApp();
  const [weather, setWeather] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');

  const fetchWeather = async (city?: string) => {
    setLoading(true);
    try {
      const res = await api.getWeather(city ? { city } : undefined);
      if (res.data.success) {
        setWeather(res.data.data);
      }
      const alertRes = await api.getAlerts();
      if (alertRes.data.success) {
        setAlerts(alertRes.data.data);
      }
    } catch (err) {
      console.warn('Weather fetch fallback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchWeather(searchCity.trim());
    }
  };

  const handleReadAdvisory = () => {
    if (!weather) return;
    const alertText = alerts.length > 0 
      ? `Active advisory: ${alerts[0].title}. Action required: ${alerts[0].actionRequired}` 
      : 'No critical pest outbreaks detected in your agricultural zone.';
    speakText(
      `Weather report for ${weather.location}. Temperature is ${weather.temperature} degrees Celsius. Humidity is ${weather.humidity} percent. Wind speed is ${weather.windSpeed} kilometers per hour. ${alertText}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Audio Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              {t.weather.title}
            </h2>
            <button
              onClick={handleReadAdvisory}
              className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
              title="Listen to Weather Advisory"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {t.weather.subtitle}
          </p>
        </div>

        {/* City Search Form */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-sm w-full">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Search district / mandi..."
              className="w-full text-xs py-2 pl-8 pr-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl whitespace-nowrap transition-colors"
          >
            Update
          </button>
        </form>
      </div>

      {weather && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Today Weather Card */}
          <div className="lg:col-span-1 bg-gradient-to-br from-emerald-700 to-teal-800 text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs text-emerald-200 font-medium uppercase tracking-wider block">
                    Current Location
                  </span>
                  <h3 className="text-lg font-bold text-white">{weather.location}</h3>
                </div>
                <div className="p-2.5 bg-white/15 backdrop-blur-md rounded-xl">
                  <CloudSun className="w-7 h-7 text-amber-300" />
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-extrabold font-mono tabular-nums tracking-tight">
                  {weather.temperature}°C
                </span>
                <span className="text-xs text-emerald-200">
                  Feels like {weather.feelsLike}°C
                </span>
              </div>
              <p className="text-sm font-semibold text-emerald-100 mb-6">{weather.condition}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-emerald-600/60 pt-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-[11px] text-emerald-200 mb-0.5">
                  <Droplets className="w-3 h-3 text-cyan-300" />
                  <span>Humidity</span>
                </div>
                <span className="text-sm font-bold font-mono tabular-nums">{weather.humidity}%</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-[11px] text-emerald-200 mb-0.5">
                  <Wind className="w-3 h-3 text-emerald-200" />
                  <span>Wind</span>
                </div>
                <span className="text-sm font-bold font-mono tabular-nums">{weather.windSpeed} km/h</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-[11px] text-emerald-200 mb-0.5">
                  <CloudRain className="w-3 h-3 text-blue-300" />
                  <span>Rain</span>
                </div>
                <span className="text-sm font-bold font-mono tabular-nums">{weather.rainfall} mm</span>
              </div>
            </div>
          </div>

          {/* 5-Day Outlook */}
          <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  {t.weather.forecast5Day}
                </h3>
              </div>
              <span className="text-xs text-neutral-500">Updated hourly</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {weather.forecast?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60 flex flex-col items-center text-center group hover:border-emerald-500/50 transition-colors"
                >
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                    {item.day.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-neutral-400 mb-2">{item.date}</span>
                  <CloudSun className="w-6 h-6 text-amber-500 mb-2" />
                  <div className="text-xs font-mono tabular-nums font-bold text-neutral-900 dark:text-white">
                    {item.tempMax}° / <span className="text-neutral-400 font-normal">{item.tempMin}°</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400">
                    <Droplets className="w-2.5 h-2.5" />
                    <span>{item.rainfallChance}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Agronomic Daily Advice */}
            <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                <strong className="font-semibold">Agronomist Recommendation for Today: </strong>
                {weather.forecast?.[0]?.advisory || 'Safe for fertilizer top-dressing. High photosynthesis conditions.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Field Advisories & Pest Radar Section */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              {t.weather.activeAlerts} ({alerts.length})
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-neutral-500">Risk Radar:</span>
            <span className="font-semibold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
              {weather?.pestRiskLevel || 'Moderate'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert) => {
            const isHigh = alert.severity === 'high' || alert.severity === 'critical';
            return (
              <div
                key={alert._id}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 flex flex-col justify-between hover:border-emerald-500/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 uppercase tracking-wider text-[10px]">
                      {alert.category}
                    </span>
                    <span className={`text-xs font-bold ${isHigh ? 'text-red-600' : 'text-amber-600'}`}>
                      {alert.severity.toUpperCase()} PRIORITY
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-1.5">
                    {alert.title}
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 mb-3 leading-relaxed">
                    {alert.description}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/50 text-xs text-amber-900 dark:text-amber-200">
                  <div className="font-bold flex items-center gap-1 text-[11px] text-amber-800 dark:text-amber-300 mb-0.5">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{t.weather.actionRequired}:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">{alert.actionRequired}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
