import mongoose, { Schema, Document } from 'mongoose';

export interface IAlert extends Document {
  title: string;
  description: string;
  category: 'weather' | 'pest' | 'disease' | 'scheme' | 'market';
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedCrops: string[];
  region: string;
  actionRequired: string;
  broadcastBy?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const AlertSchema = new Schema<IAlert>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['weather', 'pest', 'disease', 'scheme', 'market'], 
    default: 'pest' 
  },
  severity: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'], 
    default: 'medium' 
  },
  affectedCrops: [{ type: String }],
  region: { type: String, default: 'All Regions' },
  actionRequired: { type: String, required: true },
  broadcastBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

export const Alert = mongoose.models.Alert || mongoose.model<IAlert>('Alert', AlertSchema);
