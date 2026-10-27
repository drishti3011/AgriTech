import { Response } from 'express';
import { dataStore, StoreFarm } from '../data/store.js';
import { AuthRequest } from '../middleware/auth.js';

export const getFarms = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    let farms: StoreFarm[];
    if (role === 'admin') {
      farms = dataStore.farms;
    } else if (userId) {
      farms = dataStore.farms.filter(f => f.owner === userId);
    } else {
      farms = dataStore.farms;
    }

    res.json({ success: true, count: farms.length, data: farms });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFarmById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const farm = dataStore.farms.find(f => f._id === id);
    if (!farm) {
      res.status(404).json({ success: false, message: 'Farm profile not found.' });
      return;
    }
    const crops = dataStore.crops.filter(c => c.farm === id);
    const soilReports = dataStore.soilReports.filter(s => s.farm === id);
    res.json({ success: true, data: { ...farm, crops, soilReports } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createFarm = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, location, area, soilType, irrigationType, surveyNumber, notes } = req.body;
    const userId = req.user?.id || 'usr-farmer-01';

    if (!name || !area || !soilType) {
      res.status(400).json({ success: false, message: 'Farm name, area (acres), and soil type are required.' });
      return;
    }

    const newFarm: StoreFarm = {
      _id: `frm-${Date.now()}`,
      owner: userId,
      name,
      location: {
        district: location?.district || 'Central District',
        state: location?.state || 'Telangana',
        village: location?.village || '',
        latitude: location?.latitude || 17.3850,
        longitude: location?.longitude || 78.4867,
      },
      area: Number(area),
      soilType: soilType || 'Black',
      irrigationType: irrigationType || 'Drip',
      surveyNumber: surveyNumber || `Sy-${Math.floor(100 + Math.random() * 900)}/A`,
      notes: notes || '',
      createdAt: new Date().toISOString(),
    };

    dataStore.farms.push(newFarm);
    dataStore.logActivity(req.user?.name || 'Farmer', 'FARM_CREATED', 'Farm Management', `Added farm: ${newFarm.name} (${newFarm.area} acres)`, userId);

    res.status(201).json({ success: true, message: 'Farm profile created successfully.', data: newFarm });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFarm = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const index = dataStore.farms.findIndex(f => f._id === id);
    if (index === -1) {
      res.status(404).json({ success: false, message: 'Farm profile not found.' });
      return;
    }

    const farm = dataStore.farms[index];
    const { name, location, area, soilType, irrigationType, surveyNumber, notes } = req.body;

    if (name) farm.name = name;
    if (area !== undefined) farm.area = Number(area);
    if (soilType) farm.soilType = soilType;
    if (irrigationType) farm.irrigationType = irrigationType;
    if (surveyNumber) farm.surveyNumber = surveyNumber;
    if (notes !== undefined) farm.notes = notes;
    if (location) {
      farm.location = { ...farm.location, ...location };
    }

    dataStore.logActivity(req.user?.name || 'Farmer', 'FARM_UPDATED', 'Farm Management', `Updated farm: ${farm.name}`, req.user?.id);

    res.json({ success: true, message: 'Farm profile updated successfully.', data: farm });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteFarm = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const index = dataStore.farms.findIndex(f => f._id === id);
    if (index === -1) {
      res.status(404).json({ success: false, message: 'Farm profile not found.' });
      return;
    }

    const [deleted] = dataStore.farms.splice(index, 1);
    // Also cleanup attached crops
    dataStore.crops = dataStore.crops.filter(c => c.farm !== id);
    dataStore.logActivity(req.user?.name || 'Farmer', 'FARM_DELETED', 'Farm Management', `Deleted farm: ${deleted.name}`, req.user?.id);

    res.json({ success: true, message: 'Farm profile deleted.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
