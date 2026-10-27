import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.js';
import { api } from '../services/api.js';
import { 
  Plus, 
  MapPin, 
  Wheat, 
  Calendar, 
  Droplet, 
  TrendingUp, 
  Sparkles, 
  Trash2, 
  Edit3,
  CheckCircle,
  X
} from 'lucide-react';

export const FarmCropSection: React.FC = () => {
  const { t, showToast } = useApp();
  const [farms, setFarms] = useState<any[]>([]);
  const [crops, setCrops] = useState<any[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<string>('all');
  const [showAddFarmModal, setShowAddFarmModal] = useState(false);
  const [showAddCropModal, setShowAddCropModal] = useState(false);

  // Form states
  const [farmForm, setFarmForm] = useState({
    name: '',
    area: '',
    soilType: 'Black',
    irrigationType: 'Drip',
    district: '',
    state: 'Madhya Pradesh',
    surveyNumber: '',
    notes: '',
  });

  const [cropForm, setCropForm] = useState({
    farmId: '',
    name: '',
    variety: '',
    sowingDate: new Date().toISOString().split('T')[0],
    expectedHarvest: new Date(Date.now() + 110 * 86400000).toISOString().split('T')[0],
    status: 'Growing',
    stage: 'Vegetative Growth',
    yieldEstimated: '22',
    areaAllocated: '2.5',
    notes: '',
  });

  const loadData = async () => {
    try {
      const [farmRes, cropRes] = await Promise.all([
        api.getFarms(),
        api.getCrops(),
      ]);
      if (farmRes.data.success) {
        setFarms(farmRes.data.data);
      }
      if (cropRes.data.success) {
        setCrops(cropRes.data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch farm data, using defaults');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmForm.name || !farmForm.area) {
      showToast('Farm name and area in acres are required', 'error');
      return;
    }
    try {
      const res = await api.createFarm({
        name: farmForm.name,
        area: Number(farmForm.area),
        soilType: farmForm.soilType,
        irrigationType: farmForm.irrigationType,
        location: {
          district: farmForm.district || 'Hoshangabad',
          state: farmForm.state,
        },
        surveyNumber: farmForm.surveyNumber,
        notes: farmForm.notes,
      });
      if (res.data.success) {
        showToast('Farm profile added successfully', 'success');
        setShowAddFarmModal(false);
        setFarmForm({
          name: '',
          area: '',
          soilType: 'Black',
          irrigationType: 'Drip',
          district: '',
          state: 'Madhya Pradesh',
          surveyNumber: '',
          notes: '',
        });
        loadData();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Error creating farm', 'error');
    }
  };

  const handleCreateCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropForm.farmId || !cropForm.name || !cropForm.variety) {
      showToast('Farm, crop name, and variety are required', 'error');
      return;
    }
    try {
      const res = await api.createCrop({
        farmId: cropForm.farmId,
        name: cropForm.name,
        variety: cropForm.variety,
        sowingDate: cropForm.sowingDate,
        expectedHarvest: cropForm.expectedHarvest,
        status: cropForm.status,
        stage: cropForm.stage,
        yieldEstimated: Number(cropForm.yieldEstimated),
        areaAllocated: Number(cropForm.areaAllocated),
        notes: cropForm.notes,
      });
      if (res.data.success) {
        showToast('Crop record created successfully', 'success');
        setShowAddCropModal(false);
        loadData();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Error recording crop', 'error');
    }
  };

  const handleDeleteCrop = async (id: string) => {
    try {
      await api.deleteCrop(id);
      showToast('Crop record removed', 'info');
      loadData();
    } catch (err) {
      showToast('Error removing crop', 'error');
    }
  };

  const filteredCrops = selectedFarm === 'all' 
    ? crops 
    : crops.filter(c => c.farm === selectedFarm);

  return (
    <div className="space-y-8">
      {/* Farms Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            {t.crops.myFarms} ({farms.length})
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Soil classification, micro-irrigation systems, and cadastral survey plots
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddFarmModal(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t.crops.addFarm}</span>
          </button>
          <button
            onClick={() => {
              if (farms.length > 0) {
                setCropForm(prev => ({ ...prev, farmId: farms[0]._id }));
              }
              setShowAddCropModal(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Wheat className="w-4 h-4 text-emerald-500" />
            <span>{t.crops.addCrop}</span>
          </button>
        </div>
      </div>

      {/* Farms Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {farms.map((farm) => {
          const farmCrops = crops.filter(c => c.farm === farm._id);
          const isSelected = selectedFarm === farm._id;
          return (
            <div
              key={farm._id}
              onClick={() => setSelectedFarm(isSelected ? 'all' : farm._id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                  : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-emerald-500/40 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-bold text-neutral-900 dark:text-white">
                  {farm.name}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {farm.area} {t.crops.acres}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400 mb-4">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{farm.location?.district}, {farm.location?.state}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5 text-blue-500" />
                  <span>{farm.irrigationType} Irrigation · {farm.soilType} Soil</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800 text-[11px]">
                <span className="text-neutral-500">
                  {farmCrops.length} active crop{farmCrops.length === 1 ? '' : 's'}
                </span>
                <span className="font-semibold text-emerald-600">
                  {isSelected ? 'Filtered' : 'Filter by this Farm'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Crops Section */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              {t.crops.activeCrops} ({filteredCrops.length})
            </h3>
            <p className="text-xs text-neutral-500">
              {selectedFarm === 'all' ? 'Displaying all registered farmlands' : 'Showing crops for selected farm'}
            </p>
          </div>
          {selectedFarm !== 'all' && (
            <button
              onClick={() => setSelectedFarm('all')}
              className="text-xs text-emerald-600 font-semibold hover:underline"
            >
              Show all farms
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredCrops.map((crop) => (
            <div
              key={crop._id}
              className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 flex flex-col justify-between hover:border-emerald-500/40 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                      {crop.name}
                    </h4>
                    <span className="text-xs text-neutral-500">
                      Variety: {crop.variety} · {crop.areaAllocated} Acres
                    </span>
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                    crop.status === 'Growing' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                    crop.status === 'Harvesting' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  }`}>
                    {crop.status}
                  </span>
                </div>

                {/* Growth Stage Progress */}
                <div className="my-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-neutral-500">Stage: <strong className="text-neutral-800 dark:text-neutral-200">{crop.stage}</strong></span>
                    <span className="text-emerald-600 font-bold font-mono">{crop.healthScore}% Health</span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all" 
                      style={{ width: `${Math.min(100, crop.healthScore)}%` }} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600 dark:text-neutral-400 my-3 pt-2 border-t border-neutral-200/60 dark:border-neutral-700/60">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Sown: {crop.sowingDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="font-mono tabular-nums">Yield: ~{crop.yieldEstimated} Qtl/Acre</span>
                  </div>
                </div>

                {crop.notes && (
                  <p className="text-[11px] text-neutral-500 italic bg-white dark:bg-neutral-800/80 p-2 rounded-lg border border-neutral-200/60 dark:border-neutral-700/40">
                    "{crop.notes}"
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-neutral-200/60 dark:border-neutral-700/60">
                <span className="text-[11px] text-neutral-400">
                  Expected Harvest: {crop.expectedHarvest}
                </span>
                <button
                  onClick={() => handleDeleteCrop(crop._id)}
                  className="p-1 text-neutral-400 hover:text-red-600 rounded transition-colors"
                  title="Remove crop record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Farm Modal */}
      {showAddFarmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 mb-4">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                {t.crops.addFarm}
              </h3>
              <button onClick={() => setShowAddFarmModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFarm} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Farm Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Narmada Valley Organic Plot"
                  value={farmForm.name}
                  onChange={(e) => setFarmForm({ ...farmForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Area (Acres) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="e.g. 5.5"
                    value={farmForm.area}
                    onChange={(e) => setFarmForm({ ...farmForm, area: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Survey / Khasra No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 312/A"
                    value={farmForm.surveyNumber}
                    onChange={(e) => setFarmForm({ ...farmForm, surveyNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Soil Type
                  </label>
                  <select
                    value={farmForm.soilType}
                    onChange={(e) => setFarmForm({ ...farmForm, soilType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  >
                    <option value="Black">Black Cotton Soil</option>
                    <option value="Alluvial">Alluvial Soil</option>
                    <option value="Red">Red & Yellow Soil</option>
                    <option value="Loamy">Fertile Loamy Soil</option>
                    <option value="Clay">Clay Soil</option>
                    <option value="Sandy">Sandy Loam</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Irrigation System
                  </label>
                  <select
                    value={farmForm.irrigationType}
                    onChange={(e) => setFarmForm({ ...farmForm, irrigationType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  >
                    <option value="Drip">Drip Irrigation</option>
                    <option value="Sprinkler">Sprinkler System</option>
                    <option value="Canal">Canal Irrigation</option>
                    <option value="Borewell">Borewell & Motor</option>
                    <option value="Rainfed">Rainfed (Monsoon)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddFarmModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  Save Farm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Crop Modal */}
      {showAddCropModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 mb-4">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                {t.crops.addCrop}
              </h3>
              <button onClick={() => setShowAddCropModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCrop} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Select Farm *
                </label>
                <select
                  required
                  value={cropForm.farmId}
                  onChange={(e) => setCropForm({ ...cropForm, farmId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                >
                  {farms.map(f => (
                    <option key={f._id} value={f._id}>{f.name} ({f.area} Acres)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Crop Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wheat, Paddy, Cotton"
                    value={cropForm.name}
                    onChange={(e) => setCropForm({ ...cropForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Seed Variety *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sharbati HD-2967"
                    value={cropForm.variety}
                    onChange={(e) => setCropForm({ ...cropForm, variety: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Sowing Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={cropForm.sowingDate}
                    onChange={(e) => setCropForm({ ...cropForm, sowingDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Expected Harvest *
                  </label>
                  <input
                    type="date"
                    required
                    value={cropForm.expectedHarvest}
                    onChange={(e) => setCropForm({ ...cropForm, expectedHarvest: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Allocated Area (Acres)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={cropForm.areaAllocated}
                    onChange={(e) => setCropForm({ ...cropForm, areaAllocated: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Est. Yield (Qtl/Acre)
                  </label>
                  <input
                    type="number"
                    value={cropForm.yieldEstimated}
                    onChange={(e) => setCropForm({ ...cropForm, yieldEstimated: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddCropModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  Record Crop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
