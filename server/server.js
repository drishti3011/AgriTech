/**
 * Standalone Express server entry point for /server module.
 * Can be run via: node server/server.js
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { apiRouter } from './routes/api.js';
import { connectDB } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api', apiRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'agritech-backend' });
});

app.listen(PORT, () => {
  console.log(`AgriTech standalone backend listening on port ${PORT}`);
});
