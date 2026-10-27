import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.js';
import { api } from '../services/api.js';
import { 
  FlaskConical, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Calendar, 
  Leaf, 
  RefreshCw,
  HelpCircle
} from 'lucide-react';

interface SoilAnalysisSectionProps {
  onOpenReport: () => void;
}

export const SoilAnalysisSection: React.FC<SoilAnalysisSectionProps> = ({ onOpenReport }) => {
  const { t, showToast } = useApp();
  const [farms, setFarms] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');

  // Interactive Test Form Values
  const [pH, setPH] = useState<number>(7.2);
  const [nitrogen, setNitrogen] = useState<number>(240);
  const [phosphorus, setPhosphorus] = useState<number>(28);
  const [potassium, setPotassium] = useState<number>(260);
  const [moisture, setMoisture] = useState<number>(24);
  const [organicCarbon, setOrganicCarbon] = useState<number>(0.70);

  // Live Calculated Result
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      try {
        const [farmRes, reportRes] = await Promise.all([
          api.getFarms(),
          api.getSoilReports(),
        ]);
        if (farmRes.data.success && farmRes.data.data.length > 0) {
          setFarms(farmRes.data.data);
          setSelectedFarmId(farmRes.data.data[0]._id);
        }
        if (reportRes.data.success) {
          setReports(reportRes.data.data);
        }
      } catch (e) {
        console.warn('Failed loading soil reports');
      }
    };
    init();
  }, []);

  // Compute live recommendations dynamically whenever sliders change
  useEffect(() => {
    const deficiencies: string[] = [];
    const recommendations: string[] = [];
    const suitableCrops: string[] = [];

    // pH Assessment
    if (pH < 6.0) {
      deficiencies.push('Acidic soil pH (below 6.0) limiting nutrient uptake');
      recommendations.push('Apply Agricultural Lime (Calcium Carbonate) @ 250 kg/acre to neutralize acidity.');
    } else if (pH > 8.0) {
      deficiencies.push('Alkaline soil pH (above 8.0) causing phosphorus and micronutrient tie-up');
      recommendations.push('Apply Agricultural Gypsum (Calcium Sulphate) @ 200 kg/acre and incorporate green manure.');
    } else {
      recommendations.push('Soil pH is in the optimal balanced range (6.5 - 7.5) for highest nutrient uptake.');
    }

    // Nitrogen Assessment (optimal 280-560 kg/ha)
    if (nitrogen < 240) {
      deficiencies.push(`Low Nitrogen (${nitrogen} kg/ha). Stunted vegetative growth risk.`);
      recommendations.push('Top-dress with 35-40 kg/acre Neem-Coated Urea in split doses or 3 tons/acre well-rotted vermicompost.');
    } else if (nitrogen > 560) {
      recommendations.push('High Nitrogen detected. Reduce synthetic nitrogen application to prevent plant lodging.');
    } else {
      recommendations.push(`Nitrogen level (${nitrogen} kg/ha) is balanced for standard agronomic yields.`);
    }

    // Phosphorus Assessment (optimal 25-55 kg/ha)
    if (phosphorus < 22) {
      deficiencies.push(`Low Phosphorus (${phosphorus} kg/ha). Poor root elongation.`);
      recommendations.push('Apply Single Super Phosphate (SSP) @ 50 kg/acre or DAP @ 25 kg/acre as basal dose at root zone.');
    } else {
      recommendations.push(`Phosphorus level (${phosphorus} kg/ha) is adequate for root and seed setting.`);
    }

    // Potassium Assessment (optimal 150-300 kg/ha)
    if (potassium < 140) {
      deficiencies.push(`Low Potassium (${potassium} kg/ha). Reduced pest resistance.`);
      recommendations.push('Apply Muriate of Potash (MOP 60% K2O) @ 20 kg/acre during early vegetative stage.');
    } else {
      recommendations.push(`Potassium reserves (${potassium} kg/ha) are strong, boosting drought resistance.`);
    }

    // Organic Carbon Assessment
    if (organicCarbon < 0.5) {
      deficiencies.push(`Low Organic Carbon (${organicCarbon}%). Depleted beneficial soil microbiology.`);
      recommendations.push('Incorporate bio-decomposer capsules with crop residue or sow green manure (Dhaincha).');
    }

    // Suitable crops
    if (pH >= 6.5 && pH <= 7.8) {
      suitableCrops.push('Wheat', 'Paddy Rice', 'Mustard', 'Chickpea', 'Soybean', 'Cotton', 'Maize');
    } else if (pH < 6.5) {
      suitableCrops.push('Potato', 'Tea', 'Groundnut', 'Millets', 'Sweet Potato');
    } else {
      suitableCrops.push('Barley', 'Sugarbeet', 'Cotton', 'Guar', 'Sorghum');
    }

    let status: 'Excellent' | 'Good' | 'Deficient' | 'Critical' = 'Good';
    if (deficiencies.length === 0) status = 'Excellent';
    else if (deficiencies.length <= 2) status = 'Good';
    else if (deficiencies.length <= 3) status = 'Deficient';
    else status = 'Critical';

    setAnalysisResult({
      status,
      deficiencies,
      recommendations,
      suitableCrops,
    });
  }, [pH, nitrogen, phosphorus, potassium, moisture, organicCarbon]);

  const handleSaveReport = async () => {
    if (!selectedFarmId) {
      showToast('Please select a farm first', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.submitSoilAnalysis({
        farmId: selectedFarmId,
        pH,
        nitrogen,
        phosphorus,
        potassium,
        organicCarbon,
        moisture,
        electricalConductivity: 0.42,
      });
      if (res.data.success) {
        showToast('Soil Health Card generated and saved to your farm record!', 'success');
        setReports(prev => [res.data.data, ...prev]);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Error saving soil report', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            {t.soil.title}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {t.soil.subtitle}
          </p>
        </div>
        <button
          onClick={onOpenReport}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>{t.soil.downloadCard}</span>
        </button>
      </div>

      {/* Interactive Soil Testing Simulator & Prescription Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Inputs / Laboratory Sliders (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Laboratory Soil Sample Inputs
              </h3>
            </div>
            {farms.length > 0 && (
              <select
                value={selectedFarmId}
                onChange={(e) => setSelectedFarmId(e.target.value)}
                className="text-xs py-1 px-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-semibold"
              >
                {farms.map((f) => (
                  <option key={f._id} value={f._id}>{f.name}</option>
                ))}
              </select>
            )}
          </div>

          {/* 1. pH Slider */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                {t.soil.phLevel}
              </span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                {pH.toFixed(1)} {pH < 6.0 ? '(Acidic)' : pH > 8.0 ? '(Alkaline)' : '(Neutral/Ideal)'}
              </span>
            </div>
            <input
              type="range"
              min="4.5"
              max="9.5"
              step="0.1"
              value={pH}
              onChange={(e) => setPH(parseFloat(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-mono">
              <span>Acidic (4.5)</span>
              <span>Balanced (6.5 - 7.5)</span>
              <span>Alkaline (9.5)</span>
            </div>
          </div>

          {/* 2. Nitrogen Slider */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                {t.soil.nitrogen}
              </span>
              <span className="font-mono font-bold text-neutral-900 dark:text-white text-sm">
                {nitrogen} kg/ha
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="650"
              step="10"
              value={nitrogen}
              onChange={(e) => setNitrogen(parseInt(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-mono">
              <span>Low (&lt;240)</span>
              <span>Medium (280 - 450)</span>
              <span>High (&gt;560)</span>
            </div>
          </div>

          {/* 3. Phosphorus Slider */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                {t.soil.phosphorus}
              </span>
              <span className="font-mono font-bold text-neutral-900 dark:text-white text-sm">
                {phosphorus} kg/ha
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="80"
              step="2"
              value={phosphorus}
              onChange={(e) => setPhosphorus(parseInt(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-mono">
              <span>Low (&lt;20)</span>
              <span>Optimal (25 - 55)</span>
              <span>High (&gt;60)</span>
            </div>
          </div>

          {/* 4. Potassium Slider */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                {t.soil.potassium}
              </span>
              <span className="font-mono font-bold text-neutral-900 dark:text-white text-sm">
                {potassium} kg/ha
              </span>
            </div>
            <input
              type="range"
              min="80"
              max="450"
              step="10"
              value={potassium}
              onChange={(e) => setPotassium(parseInt(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-mono">
              <span>Low (&lt;140)</span>
              <span>Optimal (150 - 300)</span>
              <span>High (&gt;350)</span>
            </div>
          </div>

          {/* 5. Moisture & Organic Carbon */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                Moisture %
              </label>
              <input
                type="number"
                value={moisture}
                onChange={(e) => setMoisture(parseFloat(e.target.value))}
                className="w-full p-2 text-xs font-mono rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                Organic Carbon %
              </label>
              <input
                type="number"
                step="0.05"
                value={organicCarbon}
                onChange={(e) => setOrganicCarbon(parseFloat(e.target.value))}
                className="w-full p-2 text-xs font-mono rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
              />
            </div>
          </div>

          <button
            onClick={handleSaveReport}
            disabled={submitting}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{submitting ? 'Recording Analysis...' : 'Save & Certify Soil Health Test'}</span>
          </button>
        </div>

        {/* Right Column: Dynamic Diagnosis & Tailored Fertilizer Prescription (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-4">
              <div>
                <span className="text-[11px] text-neutral-400 block font-medium">Diagnostic Health Status</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-base font-extrabold px-2.5 py-0.5 rounded-full ${
                    analysisResult?.status === 'Excellent' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                    analysisResult?.status === 'Good' ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300' :
                    analysisResult?.status === 'Deficient' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                  }`}>
                    {analysisResult?.status} Condition
                  </span>
                  <span className="text-xs text-neutral-500 font-mono">
                    pH {pH.toFixed(1)} · N:{nitrogen} · P:{phosphorus} · K:{potassium}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-neutral-400 block font-medium">EC Conductivity</span>
                <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white">0.42 dS/m (Normal)</span>
              </div>
            </div>

            {/* Deficiencies Alert */}
            {analysisResult?.deficiencies?.length > 0 ? (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/50 mb-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-200 mb-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>{t.soil.deficiencies}:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs text-amber-950 dark:text-amber-300">
                  {analysisResult.deficiencies.map((def: string, i: number) => (
                    <li key={i}>{def}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50 mb-4 flex items-center gap-2 text-xs text-emerald-900 dark:text-emerald-200 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>All key macronutrients (N, P, K) and soil reaction (pH) are within optimal agricultural threshold.</span>
              </div>
            )}

            {/* Scientific Fertilizer Prescription */}
            <div className="mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                {t.soil.recommendations}
              </h4>
              <div className="space-y-2">
                {analysisResult?.recommendations?.map((rec: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 text-xs text-neutral-700 dark:text-neutral-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suitable Crops */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                {t.soil.suitableCrops}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult?.suitableCrops?.map((crop: string, i: number) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/50 dark:border-emerald-800/50"
                  >
                    {crop}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 mt-4 flex items-center justify-between text-[11px] text-neutral-400">
            <span>Prescription grounded in ICAR Fertilizer Standards</span>
            <span className="font-mono">Ref ID: SHC-2026-N{nitrogen}</span>
          </div>
        </div>
      </div>

      {/* Historical Test Reports Table */}
      {reports.length > 0 && (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Certified Soil Test Archive ({reports.length})
            </h3>
            <span className="text-xs text-neutral-500">Government Certified Lab Standards</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 font-semibold border-b border-neutral-200 dark:border-neutral-700">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Farm Name</th>
                  <th className="py-2.5 px-3">pH</th>
                  <th className="py-2.5 px-3">N (kg/ha)</th>
                  <th className="py-2.5 px-3">P (kg/ha)</th>
                  <th className="py-2.5 px-3">K (kg/ha)</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono tabular-nums">
                {reports.map((r) => (
                  <tr key={r._id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                    <td className="py-3 px-3 text-neutral-800 dark:text-neutral-200">{r.testDate}</td>
                    <td className="py-3 px-3 font-sans font-medium text-neutral-900 dark:text-white">{r.farmName}</td>
                    <td className="py-3 px-3 text-emerald-600 font-bold">{r.pH}</td>
                    <td className="py-3 px-3">{r.nitrogen}</td>
                    <td className="py-3 px-3">{r.phosphorus}</td>
                    <td className="py-3 px-3">{r.potassium}</td>
                    <td className="py-3 px-3 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        r.healthStatus === 'Excellent' || r.healthStatus === 'Good'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {r.healthStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <button
                        onClick={onOpenReport}
                        className="text-emerald-600 hover:underline font-semibold"
                      >
                        View Card
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
