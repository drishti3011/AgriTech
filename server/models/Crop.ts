import mongoose, { Schema, Document } from 'mongoose';

export interface ICrop extends Document {
  farm: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  name: string;
  variety: string;
  sowingDate: Date;
  expectedHarvest: Date;
  status: 'Planned' | 'Sown' | 'Growing' | 'Flowering' | 'Harvesting' | 'Harvested';
  stage: string;
  yieldEstimated: number; // in quintals/acre
  yieldActual?: number;
  areaAllocated: number; // in acres
  notes?: string;
  healthScore: number; // 0 to 100
  createdAt: Date;
}

const CropSchema = new Schema<ICrop>({
  farm: { type: Schema.Types.ObjectId, ref: 'Farm', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  variety: { type: String, required: true },
  sowingDate: { type: Date, required: true },
  expectedHarvest: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Planned', 'Sown', 'Growing', 'Flowering', 'Harvesting', 'Harvested'], 
    default: 'Growing' 
  },
  stage: { type: String, default: 'Vegetative Growth' },
  yieldEstimated: { type: Number, default: 25 },
  yieldActual: { type: Number },
  areaAllocated: { type: Number, required: true, default: 2 },
  notes: { type: String, default: '' },
  healthScore: { type: Number, default: 85, min: 0, max: 100 },
  createdAt: { type: Date, default: Date.now },
});

export const Crop = mongoose.models.Crop || mongoose.model<ICrop>('Crop', CropSchema);
