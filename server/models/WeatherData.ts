import mongoose, { Schema, Document } from 'mongoose';

export interface IWeatherData extends Document {
  location: string;
  state: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  condition: string;
  icon: string;
  forecast: Array<{
    day: string;
    date: string;
    tempMax: number;
    tempMin: number;
    rainfallChance: number;
    condition: string;
    icon: string;
    advisory: string;
  }>;
  pestRiskLevel: 'Low' | 'Medium' | 'High';
  date: Date;
}

const WeatherDataSchema = new Schema<IWeatherData>({
  location: { type: String, required: true },
  state: { type: String, required: true },
  temperature: { type: Number, required: true },
  feelsLike: { type: Number, required: true },
  humidity: { type: Number, required: true },
  rainfall: { type: Number, required: true },
  windSpeed: { type: Number, required: true },
  condition: { type: String, required: true },
  icon: { type: String, default: 'sun' },
  forecast: [
    {
      day: { type: String },
      date: { type: String },
      tempMax: { type: Number },
      tempMin: { type: Number },
      rainfallChance: { type: Number },
      condition: { type: String },
      icon: { type: String },
      advisory: { type: String },
    },
  ],
  pestRiskLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  date: { type: Date, default: Date.now },
});

export const WeatherData = mongoose.models.WeatherData || mongoose.model<IWeatherData>('WeatherData', WeatherDataSchema);
