import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'farmer' | 'admin' | 'expert';
  language: 'en' | 'hi' | 'te' | 'ta';
  region: string;
  village?: string;
  state?: string;
  avatar?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['farmer', 'admin', 'expert'], default: 'farmer' },
  language: { type: String, enum: ['en', 'hi', 'te', 'ta'], default: 'en' },
  region: { type: String, default: 'Telangana & Andhra Region' },
  village: { type: String, default: 'Green Valley' },
  state: { type: String, default: 'Telangana' },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
