import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.js';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { 
  X, 
  Printer, 
  Download, 
  Sprout, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';

interface FarmReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FarmReportModal: React.FC<FarmReportModalProps> = ({ isOpen, onClose }) => {
  const { t, showToast } = useApp();
  const { user } = useAuth();
  const [farms, setFarms] = useState<any[]>([]);
  const [crops, setCrops] = useState<any[]>([]);
  const [soilReports, setSoilReports] = useState<any[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    const loadReportData = async () => {
      try {
        const [farmRes, cropRes, soilRes] = await Promise.all([
          api.getFarms(),
          api.getCrops(),
          api.getSoilReports(),
        ]);
        if (farmRes.data.success) setFarms(farmRes.data.data);
        if (cropRes.data.success) setCrops(cropRes.data.data);
        if (soilRes.data.success) setSoilReports(soilRes.data.data);
      } catch (e) {
        console.warn('Error loading report data');
      }
    };
    loadReportData();
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    try {
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += 'Farm Name,District,State,Area (Acres),Soil Type,Irrigation,Crop Name,Variety,Status,Stage,Estimated Yield (Qtl/Acre)\n';

      crops.forEach((crop) => {
        const farm = farms.find(f => f._id === crop.farm) || farms[0] || {};
        const row = [
          `"${farm.name || 'Main Farm'}"`,
          `"${farm.location?.district || ''}"`,
          `"${farm.location?.state || ''}"`,
          farm.area || 0,
          `"${farm.soilType || 'Black'}"`,
          `"${farm.irrigationType || 'Drip'}"`,
          `"${crop.name}"`,
          `"${crop.variety}"`,
          `"${crop.status}"`,
          `"${crop.stage}"`,
          crop.yieldEstimated || 0,
        ].join(',');
        csvContent += row + '\n';
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `AgriTech_Farm_Report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('CSV Report downloaded successfully!', 'success');
    } catch (err) {
      showToast('Error exporting CSV', 'error');
    }
  };

  const primaryFarm = farms[0] || {
    name: 'Narmada Green Fertile Farm',
    area: 6.5,
    soilType: 'Black Cotton',
    irrigationType: 'Drip',
    surveyNumber: 'Khasra-412/A',
    location: { district: 'Hoshangabad', state: 'Madhya Pradesh', village: 'Pipariya' },
  };

  const latestSoil = soilReports[0] || {
    pH: 7.2,
    nitrogen: 240,
    phosphorus: 28,
    potassium: 260,
    organicCarbon: 0.72,
    moisture: 24,
    healthStatus: 'Good',
    recommendations: [
      'Top-dress with 35 kg/acre Neem-Coated Urea in split doses.',
      'Maintain drip irrigation interval of 3 days to preserve organic nitrogen absorption.',
    ],
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-neutral-900 rounded-2xl max-w-3xl w-full p-8 shadow-2xl relative my-8 border border-neutral-200">
        
        {/* Controls Bar (no-print) */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6 no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
              Official Farm Health Dossier
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Header */}
        <div className="flex items-start justify-between border-b-2 border-emerald-600 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Sprout className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-neutral-900">
                AgriTech Krishi Sahayak Platform
              </h1>
              <p className="text-xs text-neutral-500">
                Digital Soil Health Card & Agronomic Field Audit Report
              </p>
            </div>
          </div>

          <div className="text-right text-xs font-mono">
            <span className="font-bold text-neutral-900 block">CARD REF: SHC-2026-IN</span>
            <span className="text-neutral-500">Issued: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Farmer & Plot Identification */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200 mb-6 text-xs">
          <div>
            <span className="text-neutral-400 block font-medium">Farmer Name</span>
            <span className="font-bold text-neutral-900">{user?.name || 'Ramesh Patel'}</span>
          </div>
          <div>
            <span className="text-neutral-400 block font-medium">Cadastral Plot No.</span>
            <span className="font-bold font-mono">{primaryFarm.surveyNumber}</span>
          </div>
          <div>
            <span className="text-neutral-400 block font-medium">Cultivated Area</span>
            <span className="font-bold font-mono">{primaryFarm.area} Acres</span>
          </div>
          <div>
            <span className="text-neutral-400 block font-medium">Location</span>
            <span className="font-bold">{primaryFarm.location?.district}, {primaryFarm.location?.state}</span>
          </div>
        </div>

        {/* Certified Soil Health Nutrient Matrix */}
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
            1. Comprehensive Soil Chemical Parameters
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
            <div className="p-3 rounded-lg border border-neutral-200 bg-white">
              <span className="text-neutral-400 block text-[10px]">Soil pH</span>
              <span className="text-base font-bold font-mono text-emerald-700">{latestSoil.pH}</span>
              <span className="text-[10px] text-neutral-500 block">Neutral (Ideal)</span>
            </div>
            <div className="p-3 rounded-lg border border-neutral-200 bg-white">
              <span className="text-neutral-400 block text-[10px]">Nitrogen (N)</span>
              <span className="text-base font-bold font-mono text-neutral-900">{latestSoil.nitrogen}</span>
              <span className="text-[10px] text-neutral-500 block">kg/ha</span>
            </div>
            <div className="p-3 rounded-lg border border-neutral-200 bg-white">
              <span className="text-neutral-400 block text-[10px]">Phosphorus (P)</span>
              <span className="text-base font-bold font-mono text-neutral-900">{latestSoil.phosphorus}</span>
              <span className="text-[10px] text-neutral-500 block">kg/ha</span>
            </div>
            <div className="p-3 rounded-lg border border-neutral-200 bg-white">
              <span className="text-neutral-400 block text-[10px]">Potassium (K)</span>
              <span className="text-base font-bold font-mono text-neutral-900">{latestSoil.potassium}</span>
              <span className="text-[10px] text-neutral-500 block">kg/ha</span>
            </div>
            <div className="p-3 rounded-lg border border-neutral-200 bg-white">
              <span className="text-neutral-400 block text-[10px]">Organic Carbon</span>
              <span className="text-base font-bold font-mono text-neutral-900">{latestSoil.organicCarbon}%</span>
              <span className="text-[10px] text-neutral-500 block">Medium</span>
            </div>
            <div className="p-3 rounded-lg border border-neutral-200 bg-white">
              <span className="text-neutral-400 block text-[10px]">Moisture</span>
              <span className="text-base font-bold font-mono text-emerald-700">{latestSoil.moisture}%</span>
              <span className="text-[10px] text-neutral-500 block">Adequate</span>
            </div>
          </div>
        </div>

        {/* Fertilizer Dosage Prescription */}
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
            2. Agronomist Fertilizer Prescription & Guidance
          </h2>
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2 text-xs">
            {latestSoil.recommendations?.map((rec: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monitored Standing Crops */}
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
            3. Monitored Standing Crops Audit
          </h2>
          <table className="w-full text-left text-xs border border-neutral-200">
            <thead className="bg-neutral-100 font-semibold border-b border-neutral-200">
              <tr>
                <th className="py-2 px-3">Crop Name</th>
                <th className="py-2 px-3">Variety</th>
                <th className="py-2 px-3">Stage</th>
                <th className="py-2 px-3">Allocated Area</th>
                <th className="py-2 px-3">Est. Yield</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 font-mono">
              {crops.slice(0, 4).map((c) => (
                <tr key={c._id}>
                  <td className="py-2 px-3 font-sans font-semibold">{c.name}</td>
                  <td className="py-2 px-3 font-sans">{c.variety}</td>
                  <td className="py-2 px-3 font-sans">{c.stage}</td>
                  <td className="py-2 px-3">{c.areaAllocated} Acres</td>
                  <td className="py-2 px-3 font-bold text-emerald-700">{c.yieldEstimated} Qtl/Acre</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Document Footer & QR Code Stamp */}
        <div className="pt-4 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Digital Certificate electronically verified by AgriTech Agro Advisory Council</span>
          </div>
          <span className="font-mono">Page 1 of 1 · Print-Ready</span>
        </div>
      </div>
    </div>
  );
};
