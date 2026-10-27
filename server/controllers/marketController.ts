import { Request, Response } from 'express';
import { dataStore } from '../data/store.js';

export const getMandiPrices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { crop, state } = req.query;
    let prices = [...dataStore.mandiPrices];

    if (crop) {
      const q = String(crop).toLowerCase();
      prices = prices.filter(p => p.cropName.toLowerCase().includes(q) || p.variety.toLowerCase().includes(q));
    }
    if (state) {
      prices = prices.filter(p => p.state.toLowerCase() === String(state).toLowerCase());
    }

    res.json({ success: true, count: prices.length, data: prices });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getGovernmentSchemes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    let schemes = [...dataStore.schemes];

    if (category) {
      schemes = schemes.filter(s => s.category === category);
    }

    res.json({ success: true, count: schemes.length, data: schemes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
