import React from 'react';
import { useApp } from '../context/AppContext.js';
import { useAuth } from '../context/AuthContext.js';
import { 
  FlaskConical, 
  CloudSun, 
  ShoppingBag, 
  GraduationCap, 
  FileText,
  TrendingUp,
  Droplets,
  ShieldAlert
} from 'lucide-react';

interface HeroBannerProps {
  onOpenReport: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onOpenReport }) => {
  const { t, setActiveTab, speakText } = useApp();
  const { user } = useAuth();

  const handleReadSummary = () => {
    speakText(`${t.appName}. ${t.tagline}. Today weather is clear, soil moisture is at 24%, and mandi wheat prices are up.`);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-neutral-900 to-neutral-950 text-white shadow-xl mb-8">
      {/* Background Image with Measured Contrast Scrim */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
        <img
          src="/src/assets/images/agritech_hero_farm_1793120953217.jpg"
          alt="Lush green smart farming fields"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30 pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-12 lg:py-14 max-w-5xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-4">
          <Droplets className="w-3.5 h-3.5 text-emerald-400" />
          <span>Kisan Digital Platform 2026</span>
          <span aria-hidden="true">·</span>
          <span>{user?.region || 'Central Agricultural Command'}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight [text-wrap:balance]">
          {t.appName}: {t.tagline}
        </h1>

        <p className="text-sm sm:text-base text-neutral-200 max-w-2xl leading-relaxed mb-6">
          Smart agronomic intelligence engineered for rural growers. Real-time microclimate forecasting, 
          soil NPK analysis, pest outbreak interception, APMC mandi rates, and direct expert agronomist access.
        </p>

        {/* Quick Touch Action Cards (Ideal for rural touchscreen devices) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <button
            onClick={() => setActiveTab('soil')}
            className="flex flex-col items-start p-3 sm:p-4 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/30 flex items-center justify-center text-emerald-300 mb-2 group-hover:scale-105 transition-transform">
              <FlaskConical className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white group-hover:text-emerald-300">{t.nav.soil}</span>
            <span className="text-[11px] text-neutral-300">NPK & Fertilizer test</span>
          </button>

          <button
            onClick={() => setActiveTab('weather')}
            className="flex flex-col items-start p-3 sm:p-4 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/30 flex items-center justify-center text-blue-300 mb-2 group-hover:scale-105 transition-transform">
              <CloudSun className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white group-hover:text-blue-300">{t.nav.weather}</span>
            <span className="text-[11px] text-neutral-300">Radar & Pest warning</span>
          </button>

          <button
            onClick={() => setActiveTab('marketplace')}
            className="flex flex-col items-start p-3 sm:p-4 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/30 flex items-center justify-center text-amber-300 mb-2 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white group-hover:text-amber-300">{t.nav.marketplace}</span>
            <span className="text-[11px] text-neutral-300">Seeds, bio-fertilizer</span>
          </button>

          <button
            onClick={() => setActiveTab('consult')}
            className="flex flex-col items-start p-3 sm:p-4 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/30 flex items-center justify-center text-purple-300 mb-2 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white group-hover:text-purple-300">{t.nav.consult}</span>
            <span className="text-[11px] text-neutral-300">Agronomist doctor</span>
          </button>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenReport}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Farm Health Report (PDF)</span>
          </button>
          
          <button
            onClick={handleReadSummary}
            className="px-3.5 py-2 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-colors"
          >
            <span>🔊 Read Audio Summary</span>
          </button>
        </div>
      </div>

      {/* KPI Bottom Strip (Tabular Figures & Zero Clutter) */}
      <div className="border-t border-white/15 bg-black/40 backdrop-blur-md px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <span className="text-[11px] text-neutral-400 block font-medium">Cultivated Farmland</span>
          <span className="text-base font-bold font-mono tabular-nums text-white">18.5 Acres</span>
        </div>
        <div>
          <span className="text-[11px] text-neutral-400 block font-medium">Avg Soil Moisture</span>
          <span className="text-base font-bold font-mono tabular-nums text-emerald-400">24% (Optimal)</span>
        </div>
        <div>
          <span className="text-[11px] text-neutral-400 block font-medium">Pest Radar Status</span>
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-base font-bold font-mono text-amber-300">Moderate Watch</span>
          </div>
        </div>
        <div>
          <span className="text-[11px] text-neutral-400 block font-medium">Mandi Wheat Trend</span>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-base font-bold font-mono tabular-nums text-emerald-300">₹3,120 / Qtl (+₹65)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
