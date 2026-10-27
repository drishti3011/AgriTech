import { Response } from 'express';
import { dataStore, StoreSoilReport } from '../data/store.js';
import { AuthRequest } from '../middleware/auth.js';

// Scientific soil recommendation engine
export const analyzeSoilMetrics = (pH: number, nitrogen: number, phosphorus: number, potassium: number, organicCarbon: number) => {
  const deficiencies: string[] = [];
  const recommendations: string[] = [];
  const suitableCrops: string[] = [];

  // 1. pH Evaluation
  if (pH < 6.0) {
    deficiencies.push('Acidic soil pH (below 6.0) limiting nutrient uptake');
    recommendations.push('Apply Agricultural Lime (Calcium Carbonate) @ 200-300 kg/acre to neutralize acidity.');
  } else if (pH > 8.0) {
    deficiencies.push('Alkaline soil pH (above 8.0) causing phosphorus and micronutrient tie-up');
    recommendations.push('Apply Agricultural Gypsum (Calcium Sulphate) @ 250 kg/acre and incorporate green manure.');
  } else {
    recommendations.push('Soil pH (6.5-7.5) is in the optimal balanced range for high nutrient bioavailability.');
  }

  // 2. Nitrogen Evaluation (optimal 280 - 560 kg/ha)
  if (nitrogen < 240) {
    deficiencies.push(`Low available Nitrogen (${nitrogen} kg/ha). Stunted vegetative growth risk.`);
    recommendations.push('Top-dress with 40 kg/acre Neem-Coated Urea in two split doses or apply 3 tons/acre well-rotted Farmyard Manure (FYM).');
  } else if (nitrogen > 560) {
    recommendations.push('High Nitrogen level detected. Reduce synthetic nitrogen application to prevent lodging and aphid attraction.');
  } else {
    recommendations.push(`Nitrogen level (${nitrogen} kg/ha) is balanced for standard agronomic yields.`);
  }

  // 3. Phosphorus Evaluation (optimal 25 - 55 kg/ha)
  if (phosphorus < 20) {
    deficiencies.push(`Low Phosphorus (${phosphorus} kg/ha). Poor root elongation and delayed flowering risk.`);
    recommendations.push('Apply Single Super Phosphate (SSP) @ 50 kg/acre or Di-Ammonium Phosphate (DAP) @ 25 kg/acre as basal dose at root zone.');
  } else {
    recommendations.push(`Phosphorus level (${phosphorus} kg/ha) is adequate for root and seed setting.`);
  }

  // 4. Potassium Evaluation (optimal 150 - 300 kg/ha)
  if (potassium < 140) {
    deficiencies.push(`Low Potassium (${potassium} kg/ha). Reduced pest resistance and grain filling.`);
    recommendations.push('Apply Muriate of Potash (MOP 60% K2O) @ 20 kg/acre during early tillering / vegetative stage.');
  } else {
    recommendations.push(`Potassium reserves (${potassium} kg/ha) are strong, boosting drought and disease tolerance.`);
  }

  // 5. Organic Carbon
  if (organicCarbon < 0.5) {
    deficiencies.push(`Low Organic Carbon (${organicCarbon}%). Depleted beneficial microbial flora.`);
    recommendations.push('Incorporate bio-decomposer with crop residue or sow green manure (Sesbania/Sunhemp) before next season.');
  }

  // Suitable crops based on pH and soil properties
  if (pH >= 6.5 && pH <= 7.8) {
    suitableCrops.push('Wheat', 'Paddy Rice', 'Mustard', 'Chickpea', 'Soybean', 'Cotton', 'Maize');
  } else if (pH < 6.5) {
    suitableCrops.push('Tea', 'Potato', 'Groundnut', 'Millets', 'Sweet Potato');
  } else {
    suitableCrops.push('Barley', 'Sugarbeet', 'Cotton', 'Guar', 'Sorghum');
  }

  let healthStatus: 'Excellent' | 'Good' | 'Deficient' | 'Critical' = 'Good';
  if (deficiencies.length === 0) healthStatus = 'Excellent';
  else if (deficiencies.length <= 2) healthStatus = 'Good';
  else if (deficiencies.length <= 3) healthStatus = 'Deficient';
  else healthStatus = 'Critical';

  return { deficiencies, recommendations, suitableCrops, healthStatus };
};

export const getSoilReports = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { farmId } = req.query;
    let reports = [...dataStore.soilReports];

    if (farmId) {
      reports = reports.filter(r => r.farm === farmId);
    }

    const enriched = reports.map(r => {
      const farm = dataStore.farms.find(f => f._id === r.farm);
      return {
        ...r,
        farmName: farm ? farm.name : 'Sample Field',
      };
    });

    res.json({ success: true, count: enriched.length, data: enriched });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitSoilAnalysis = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { farmId, pH, nitrogen, phosphorus, potassium, organicCarbon, moisture, electricalConductivity } = req.body;
    const userId = req.user?.id || 'usr-farmer-01';

    if (!farmId || pH === undefined || nitrogen === undefined || phosphorus === undefined || potassium === undefined) {
      res.status(400).json({ 
        success: false, 
        message: 'Farm ID, pH, Nitrogen (N), Phosphorus (P), and Potassium (K) are required.' 
      });
      return;
    }

    const numPH = Number(pH);
    const numN = Number(nitrogen);
    const numP = Number(phosphorus);
    const numK = Number(potassium);
    const numOC = Number(organicCarbon) || 0.65;
    const numMoist = Number(moisture) || 20;
    const numEC = Number(electricalConductivity) || 0.4;

    const analysis = analyzeSoilMetrics(numPH, numN, numP, numK, numOC);

    const newReport: StoreSoilReport = {
      _id: `soil-${Date.now()}`,
      farm: farmId,
      user: userId,
      testDate: new Date().toISOString().split('T')[0],
      pH: numPH,
      nitrogen: numN,
      phosphorus: numP,
      potassium: numK,
      organicCarbon: numOC,
      moisture: numMoist,
      electricalConductivity: numEC,
      healthStatus: analysis.healthStatus,
      deficiencies: analysis.deficiencies,
      recommendations: analysis.recommendations,
      suitableCrops: analysis.suitableCrops,
      createdAt: new Date().toISOString(),
    };

    dataStore.soilReports.push(newReport);
    dataStore.logActivity(req.user?.name || 'Farmer', 'SOIL_TEST_COMPLETED', 'Soil Analysis', `Soil test logged with health status: ${analysis.healthStatus}`, userId);

    res.status(201).json({
      success: true,
      message: 'Soil analysis calculated and report generated successfully.',
      data: newReport,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
