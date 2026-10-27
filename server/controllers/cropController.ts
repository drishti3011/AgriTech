import { Response } from 'express';
import { dataStore, StoreCrop } from '../data/store.js';
import { AuthRequest } from '../middleware/auth.js';

export const getCrops = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { farmId, status } = req.query;
    let crops = [...dataStore.crops];

    if (farmId) {
      crops = crops.filter(c => c.farm === farmId);
    }
    if (status) {
      crops = crops.filter(c => c.status.toLowerCase() === String(status).toLowerCase());
    }

    // Attach farm name to crops for convenience
    const enriched = crops.map(c => {
      const farm = dataStore.farms.find(f => f._id === c.farm);
      return {
        ...c,
        farmName: farm ? farm.name : 'Primary Farm',
      };
    });

    res.json({ success: true, count: enriched.length, data: enriched });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCrop = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { farmId, name, variety, sowingDate, expectedHarvest, status, stage, yieldEstimated, areaAllocated, notes } = req.body;
    const userId = req.user?.id || 'usr-farmer-01';

    if (!farmId || !name || !variety || !sowingDate || !expectedHarvest) {
      res.status(400).json({ 
        success: false, 
        message: 'Farm selection, crop name, variety, sowing date, and expected harvest are required.' 
      });
      return;
    }

    const newCrop: StoreCrop = {
      _id: `crp-${Date.now()}`,
      farm: farmId,
      user: userId,
      name,
      variety,
      sowingDate,
      expectedHarvest,
      status: status || 'Sown',
      stage: stage || 'Vegetative Growth',
      yieldEstimated: Number(yieldEstimated) || 20,
      areaAllocated: Number(areaAllocated) || 2.0,
      notes: notes || '',
      healthScore: 88,
      createdAt: new Date().toISOString(),
    };

    dataStore.crops.push(newCrop);
    dataStore.logActivity(req.user?.name || 'Farmer', 'CROP_ADDED', 'Crop Monitoring', `Recorded crop: ${newCrop.name} (${newCrop.variety})`, userId);

    res.status(201).json({ success: true, message: 'Crop recorded successfully.', data: newCrop });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCrop = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const index = dataStore.crops.findIndex(c => c._id === id);
    if (index === -1) {
      res.status(404).json({ success: false, message: 'Crop record not found.' });
      return;
    }

    const crop = dataStore.crops[index];
    const { name, variety, expectedHarvest, status, stage, yieldEstimated, yieldActual, areaAllocated, notes, healthScore } = req.body;

    if (name) crop.name = name;
    if (variety) crop.variety = variety;
    if (expectedHarvest) crop.expectedHarvest = expectedHarvest;
    if (status) crop.status = status;
    if (stage) crop.stage = stage;
    if (yieldEstimated !== undefined) crop.yieldEstimated = Number(yieldEstimated);
    if (yieldActual !== undefined) crop.yieldActual = Number(yieldActual);
    if (areaAllocated !== undefined) crop.areaAllocated = Number(areaAllocated);
    if (notes !== undefined) crop.notes = notes;
    if (healthScore !== undefined) crop.healthScore = Number(healthScore);

    dataStore.logActivity(req.user?.name || 'Farmer', 'CROP_UPDATED', 'Crop Monitoring', `Updated crop: ${crop.name} - Status: ${crop.status}`, req.user?.id);

    res.json({ success: true, message: 'Crop updated successfully.', data: crop });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCrop = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const index = dataStore.crops.findIndex(c => c._id === id);
    if (index === -1) {
      res.status(404).json({ success: false, message: 'Crop record not found.' });
      return;
    }

    const [deleted] = dataStore.crops.splice(index, 1);
    dataStore.logActivity(req.user?.name || 'Farmer', 'CROP_DELETED', 'Crop Monitoring', `Deleted crop: ${deleted.name}`, req.user?.id);

    res.json({ success: true, message: 'Crop record deleted.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
