/**
 * Database Seed Script for MongoDB
 * Usage: node server/seed.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from './models/User.js';
import { Farm } from './models/Farm.js';
import { Crop } from './models/Crop.js';
import { Resource } from './models/Resource.js';
import { Order } from './models/Order.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/agritech';

async function seedDatabase() {
  try {
    console.log(`Connecting to MongoDB at ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB. Clearing existing collections...');

    await User.deleteMany({});
    await Farm.deleteMany({});
    await Crop.deleteMany({});
    await Resource.deleteMany({});
    await Order.deleteMany({});

    console.log('Creating users...');
    const adminPass = await bcrypt.hash('admin123', 8);
    const farmerPass = await bcrypt.hash('farmer123', 8);

    const admin = await User.create({
      name: 'Dr. Anita Roy',
      email: 'admin@agritech.org',
      password: adminPass,
      phone: '+91 98765 43210',
      role: 'admin',
      language: 'en',
      region: 'Central Agricultural Command',
    });

    const farmer1 = await User.create({
      name: 'Ramesh Patel',
      email: 'ramesh@farmer.in',
      password: farmerPass,
      phone: '+91 94231 88921',
      role: 'farmer',
      language: 'hi',
      region: 'Narmada Valley Region',
    });

    const farmer2 = await User.create({
      name: 'Venkatesh Rao',
      email: 'venkat@farmer.in',
      password: farmerPass,
      phone: '+91 98480 22319',
      role: 'farmer',
      language: 'te',
      region: 'Godavari Delta Region',
    });

    console.log('Seeding farms...');
    const farm1 = await Farm.create({
      owner: farmer1._id,
      name: 'Narmada Green Fertile Farm',
      location: { district: 'Hoshangabad', state: 'Madhya Pradesh', village: 'Pipariya' },
      area: 6.5,
      soilType: 'Black',
      irrigationType: 'Drip',
    });

    console.log('Seeding crops...');
    await Crop.create({
      farm: farm1._id,
      user: farmer1._id,
      name: 'Wheat (गेहूं)',
      variety: 'Sharbati Gold MP-306',
      sowingDate: new Date('2025-11-15'),
      expectedHarvest: new Date('2026-03-25'),
      status: 'Growing',
      stage: 'Grain Filling Stage',
      yieldEstimated: 24,
      areaAllocated: 4.5,
    });

    console.log('Database seeded successfully with 1 Admin, 2 Farmers, Farms, and Crops!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error during database seed:', error);
    process.exit(1);
  }
}

seedDatabase();
