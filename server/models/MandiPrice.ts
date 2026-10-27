import mongoose, { Schema, Document } from 'mongoose';

export interface IMandiPrice extends Document {
  cropName: string;
  variety: string;
  market: string;
  district: string;
  state: string;
  minPrice: number; // in INR per Quintal
  maxPrice: number;
  modalPrice: number;
  priceDate: string;
  trend: 'up' | 'down' | 'stable';
  changeAmount: number;
}

const MandiPriceSchema = new Schema<IMandiPrice>({
  cropName: { type: String, required: true },
  variety: { type: String, required: true },
  market: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  minPrice: { type: Number, required: true },
  maxPrice: { type: Number, required: true },
  modalPrice: { type: Number, required: true },
  priceDate: { type: String, required: true },
  trend: { type: String, enum: ['up', 'down', 'stable'], default: 'stable' },
  changeAmount: { type: Number, default: 0 },
});

export const MandiPrice = mongoose.models.MandiPrice || mongoose.model<IMandiPrice>('MandiPrice', MandiPriceSchema);

export interface IGovernmentScheme extends Document {
  title: string;
  code: string;
  ministry: string;
  description: string;
  benefits: string;
  eligibility: string;
  requiredDocuments: string[];
  applicationUrl: string;
  deadline?: string;
  subsidyPercent?: number;
  category: 'direct_benefit' | 'insurance' | 'infrastructure' | 'credit';
}

const GovernmentSchemeSchema = new Schema<IGovernmentScheme>({
  title: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  ministry: { type: String, required: true },
  description: { type: String, required: true },
  benefits: { type: String, required: true },
  eligibility: { type: String, required: true },
  requiredDocuments: [{ type: String }],
  applicationUrl: { type: String, default: '#' },
  deadline: { type: String },
  subsidyPercent: { type: Number },
  category: { 
    type: String, 
    enum: ['direct_benefit', 'insurance', 'infrastructure', 'credit'], 
    default: 'direct_benefit' 
  },
});

export const GovernmentScheme = mongoose.models.GovernmentScheme || mongoose.model<IGovernmentScheme>('GovernmentScheme', GovernmentSchemeSchema);
