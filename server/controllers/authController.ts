import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { dataStore } from '../data/store.js';
import { generateToken } from '../utils/jwt.js';
import { AuthRequest } from '../middleware/auth.js';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, role, language, region, village, state } = req.body;

    if (!name || !email || !password || !phone) {
      res.status(400).json({ success: false, message: 'Name, email, password, and phone number are required.' });
      return;
    }

    const existingUser = dataStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      res.status(400).json({ success: false, message: 'A user with this email already exists.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = {
      _id: `usr-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      role: (role === 'admin' || role === 'expert' ? role : 'farmer') as 'farmer' | 'admin' | 'expert',
      language: (language || 'en') as 'en' | 'hi' | 'te' | 'ta',
      region: region || 'Central Farming District',
      village: village || 'Greenfield',
      state: state || 'Telangana',
      avatar: '/src/assets/images/agritech_farmer_avatar_1793120954590.jpg',
      createdAt: new Date().toISOString(),
    };

    dataStore.users.push(newUser);
    dataStore.logActivity(newUser.name, 'USER_REGISTERED', 'Authentication', `New farmer account created for ${newUser.name}`, newUser._id);

    const token = generateToken({
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    const { password: _, ...userWithoutPass } = newUser;
    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: userWithoutPass,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide both email and password.' });
      return;
    }

    const user = dataStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    dataStore.logActivity(user.name, 'USER_LOGIN', 'Authentication', `${user.name} logged in successfully`, user._id);

    const { password: _, ...userWithoutPass } = user;
    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: userWithoutPass,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const user = dataStore.users.find(u => u._id === req.user!.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User record not found.' });
      return;
    }

    const { password: _, ...userWithoutPass } = user;
    res.json({ success: true, user: userWithoutPass });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const userIndex = dataStore.users.findIndex(u => u._id === req.user!.id);
    if (userIndex === -1) {
      res.status(404).json({ success: false, message: 'User record not found.' });
      return;
    }

    const { name, phone, language, region, village, state } = req.body;
    const user = dataStore.users[userIndex];

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (language) user.language = language;
    if (region) user.region = region;
    if (village) user.village = village;
    if (state) user.state = state;

    const { password: _, ...userWithoutPass } = user;
    res.json({ success: true, message: 'Profile updated successfully.', user: userWithoutPass });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
