import { Request, Response } from 'express';
import axios from 'axios';
import { dataStore } from '../data/store.js';

export const getWeather = async (req: Request, res: Response): Promise<void> => {
  try {
    const { city = 'Hoshangabad', lat, lon } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (apiKey && apiKey !== 'your_openweather_api_key_here') {
      try {
        const url = lat && lon
          ? `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
          : `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&units=metric&appid=${apiKey}`;
        
        const response = await axios.get(url, { timeout: 3000 });
        const data = response.data;

        const liveWeather = {
          _id: `wth-live`,
          location: data.name,
          state: 'India',
          temperature: Math.round(data.main.temp * 10) / 10,
          feelsLike: Math.round(data.main.feels_like * 10) / 10,
          humidity: data.main.humidity,
          rainfall: data.rain ? data.rain['1h'] || 0 : 0,
          windSpeed: Math.round(data.wind.speed * 3.6 * 10) / 10, // convert m/s to km/h
          condition: data.weather[0]?.main || 'Clear',
          icon: data.weather[0]?.main?.toLowerCase().includes('rain') ? 'cloud-rain' : 'sun',
          pestRiskLevel: data.main.humidity > 75 ? 'High' : (data.main.humidity > 60 ? 'Medium' : 'Low'),
          forecast: dataStore.weather.forecast,
          date: new Date().toISOString(),
        };

        res.json({ success: true, source: 'openweather_live', data: liveWeather });
        return;
      } catch (externalErr: any) {
        console.warn(`[Weather] OpenWeather API call notice: ${externalErr.message}. Falling back to smart meteorological simulation.`);
      }
    }

    // Smart fallback
    res.json({ success: true, source: 'cached_smart_meteorology', data: dataStore.weather });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAlerts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, severity } = req.query;
    let alerts = [...dataStore.alerts];

    if (category) {
      alerts = alerts.filter(a => a.category === category);
    }
    if (severity) {
      alerts = alerts.filter(a => a.severity === severity);
    }

    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
