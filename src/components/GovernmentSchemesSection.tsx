import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.js';
import { api } from '../services/api.js';
import { 
  Landmark, 
  ExternalLink, 
  CheckCircle, 
  FileCheck, 
  HelpCircle, 
  ShieldCheck, 
  Volume2,
  Percent
} from 'lucide-react';

export const GovernmentSchemesSection: React.FC = () => {
  const { t, speakText } = useApp();
  const [schemes, setSchemes] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await api.getGovernmentSchemes({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
        });
        if (res.data.success) {
          setSchemes(res.data.data);
        }
      } catch (e) {
        console.warn('Failed to load schemes');
      }
    };
    fetchSchemes();
  }, [selectedCategory]);

  const handleReadScheme = (scheme: any) => {
    speakText(
      `${scheme.title}. ${scheme.description}. Benefits: ${scheme.benefits}. Eligibility: ${scheme.eligibility}`
    );
  };

  const categories = [
    { id: 'all', label: 'All Schemes' },
    { id: 'direct_benefit', label: 'Direct Cash Transfer' },
    { id: 'insurance', label: 'Crop Insurance' },
    { id: 'infrastructure', label: 'Irrigation & Machinery' },
    { id: 'credit', label: 'Concessional Credit' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            {t.schemes.title}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {t.schemes.subtitle}
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-white dark:bg-neutral-900 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schemes.map((scheme) => (
          <div
            key={scheme._id}
            className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex flex-col justify-between hover:border-emerald-500/40 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    {scheme.code}
                  </span>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-1.5 leading-snug">
                    {scheme.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleReadScheme(scheme)}
                    className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-emerald-600"
                    title="Listen to Scheme Details"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  {scheme.subsidyPercent && (
                    <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-0.5">
                      <span>{scheme.subsidyPercent}%</span>
                      <span className="text-[10px] font-normal">Subsidy</span>
                    </span>
                  )}
                </div>
              </div>

              <span className="text-xs text-neutral-500 font-medium block mb-3">
                {scheme.ministry}
              </span>

              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                {scheme.description}
              </p>

              {/* Financial Benefits Box */}
              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60 space-y-2 mb-4 text-xs">
                <div>
                  <span className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.schemes.benefits}:</span>
                  </span>
                  <p className="text-neutral-600 dark:text-neutral-400 mt-0.5 pl-5 leading-relaxed">
                    {scheme.benefits}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>{t.schemes.eligibility}:</span>
                  </span>
                  <p className="text-neutral-600 dark:text-neutral-400 mt-0.5 pl-5 leading-relaxed">
                    {scheme.eligibility}
                  </p>
                </div>
              </div>

              {/* Required Documents */}
              <div className="mb-4">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                  {t.schemes.documents}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {scheme.requiredDocuments?.map((doc: string, dIdx: number) => (
                    <span
                      key={dIdx}
                      className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[11px] font-medium border border-neutral-200 dark:border-neutral-700"
                    >
                      ✓ {doc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Portal Action */}
            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <a
                href={scheme.applicationUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <span>{t.schemes.applyNow}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
