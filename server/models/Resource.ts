import mongoose, { Schema, Document } from 'mongoose';

export interface IResource extends Document {
  name: string;
  category: 'seeds' | 'fertilizers' | 'pesticides' | 'tools' | 'organic';
  brand: string;
  price: number;
  unit: string;
  stock: number;
  rating: number;
  description: string;
  image?: string;
  certifiedOrganic: boolean;
  usageInstructions: string;
  createdAt: Date;
}

const ResourceSchema = new Schema<IResource>({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['seeds', 'fertilizers', 'pesticides', 'tools', 'organic'], 
    required: true 
  },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, required: true, default: 'kg' },
  stock: { type: Number, required: true, default: 50 },
  rating: { type: Number, default: 4.8 },
  description: { type: String, required: true },
  image: { type: String },
  certifiedOrganic: { type: Boolean, default: false },
  usageInstructions: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export const Resource = mongoose.models.Resource || mongoose.model<IResource>('Resource', ResourceSchema);
