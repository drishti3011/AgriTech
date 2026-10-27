import mongoose, { Schema, Document } from 'mongoose';

export interface ISoilReport extends Document {
  farm: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  testDate: Date;
  pH: number;
  nitrogen: number; // kg/ha (N)
  phosphorus: number; // kg/ha (P)
  potassium: number; // kg/ha (K)
  organicCarbon: number; // %
  moisture: number; // %
  electricalConductivity: number; // dS/m
  healthStatus: 'Excellent' | 'Good' | 'Deficient' | 'Critical';
  recommendations: string[];
  deficiencies: string[];
  suitableCrops: string[];
  createdAt: Date;
}

const SoilReportSchema = new Schema<ISoilReport>({
  farm: { type: Schema.Types.ObjectId, ref: 'Farm', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  testDate: { type: Date, default: Date.now },
  pH: { type: Number, required: true },
  nitrogen: { type: Number, required: true },
  phosphorus: { type: Number, required: true },
  potassium: { type: Number, required: true },
  organicCarbon: { type: Number, default: 0.65 },
  moisture: { type: Number, default: 22 },
  electricalConductivity: { type: Number, default: 0.45 },
  healthStatus: { 
    type: String, 
    enum: ['Excellent', 'Good', 'Deficient', 'Critical'], 
    default: 'Good' 
  },
  recommendations: [{ type: String }],
  deficiencies: [{ type: String }],
  suitableCrops: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export const SoilReport = mongoose.models.SoilReport || mongoose.model<ISoilReport>('SoilReport', SoilReportSchema);
