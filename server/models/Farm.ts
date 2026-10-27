import mongoose, { Schema, Document } from 'mongoose';

export interface IFarm extends Document {
  owner: mongoose.Types.ObjectId;
  name: string;
  location: {
    district: string;
    state: string;
    village: string;
    latitude?: number;
    longitude?: number;
  };
  area: number; // in acres
  soilType: 'Alluvial' | 'Black' | 'Red' | 'Sandy' | 'Clay' | 'Loamy';
  irrigationType: 'Drip' | 'Sprinkler' | 'Canal' | 'Rainfed' | 'Borewell';
  surveyNumber?: string;
  notes?: string;
  createdAt: Date;
}

const FarmSchema = new Schema<IFarm>({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  location: {
    district: { type: String, required: true },
    state: { type: String, required: true },
    village: { type: String, default: '' },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  area: { type: Number, required: true },
  soilType: { 
    type: String, 
    enum: ['Alluvial', 'Black', 'Red', 'Sandy', 'Clay', 'Loamy'], 
    default: 'Black' 
  },
  irrigationType: { 
    type: String, 
    enum: ['Drip', 'Sprinkler', 'Canal', 'Rainfed', 'Borewell'], 
    default: 'Drip' 
  },
  surveyNumber: { type: String, default: '' },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export const Farm = mongoose.models.Farm || mongoose.model<IFarm>('Farm', FarmSchema);
