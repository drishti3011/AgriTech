import mongoose, { Schema, Document } from 'mongoose';

export interface IConsultation extends Document {
  user: mongoose.Types.ObjectId;
  farmerName: string;
  farmerPhone: string;
  expertName: string;
  expertSpecialty: string;
  topic: string;
  cropAffected: string;
  symptomsDescription: string;
  urgency: 'normal' | 'urgent';
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  scheduledTime: string;
  meetingType: 'video' | 'phone' | 'field_visit';
  expertNotes?: string;
  prescription?: {
    diagnosis: string;
    treatmentSteps: string[];
    recommendedProducts: string[];
  };
  createdAt: Date;
}

const ConsultationSchema = new Schema<IConsultation>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  farmerName: { type: String, required: true },
  farmerPhone: { type: String, required: true },
  expertName: { type: String, required: true },
  expertSpecialty: { type: String, required: true },
  topic: { type: String, required: true },
  cropAffected: { type: String, required: true },
  symptomsDescription: { type: String, required: true },
  urgency: { type: String, enum: ['normal', 'urgent'], default: 'normal' },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  scheduledDate: { type: String, required: true },
  scheduledTime: { type: String, required: true },
  meetingType: { type: String, enum: ['video', 'phone', 'field_visit'], default: 'phone' },
  expertNotes: { type: String, default: '' },
  prescription: {
    diagnosis: { type: String, default: '' },
    treatmentSteps: [{ type: String }],
    recommendedProducts: [{ type: String }],
  },
  createdAt: { type: Date, default: Date.now },
});

export const Consultation = mongoose.models.Consultation || mongoose.model<IConsultation>('Consultation', ConsultationSchema);
