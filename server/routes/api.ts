import { Router } from 'express';
import { register, login, getMe, updateProfile } from '../controllers/authController.js';
import { getFarms, getFarmById, createFarm, updateFarm, deleteFarm } from '../controllers/farmController.js';
import { getCrops, createCrop, updateCrop, deleteCrop } from '../controllers/cropController.js';
import { getSoilReports, submitSoilAnalysis } from '../controllers/soilController.js';
import { getWeather, getAlerts } from '../controllers/weatherController.js';
import { getResources, getOrders, createOrder, updateOrderStatus } from '../controllers/orderController.js';
import { getConsultations, bookConsultation, updateConsultation } from '../controllers/consultationController.js';
import { getPosts, createPost, addComment, toggleLike } from '../controllers/forumController.js';
import { getMandiPrices, getGovernmentSchemes } from '../controllers/marketController.js';
import { getAdminStats, getUsers, updateUserRole, broadcastAlert, addResource, reseedDatabase } from '../controllers/adminController.js';
import { authenticate, optionalAuth, requireRole } from '../middleware/auth.js';

export const apiRouter = Router();

// --- Auth Endpoints ---
apiRouter.post('/auth/register', register);
apiRouter.post('/auth/login', login);
apiRouter.get('/auth/me', authenticate, getMe);
apiRouter.put('/auth/profile', authenticate, updateProfile);

// --- Farm Endpoints ---
apiRouter.get('/farms', optionalAuth, getFarms);
apiRouter.get('/farms/:id', optionalAuth, getFarmById);
apiRouter.post('/farms', optionalAuth, createFarm);
apiRouter.put('/farms/:id', optionalAuth, updateFarm);
apiRouter.delete('/farms/:id', optionalAuth, deleteFarm);

// --- Crop Endpoints ---
apiRouter.get('/crops', optionalAuth, getCrops);
apiRouter.post('/crops', optionalAuth, createCrop);
apiRouter.put('/crops/:id', optionalAuth, updateCrop);
apiRouter.delete('/crops/:id', optionalAuth, deleteCrop);

// --- Soil Analysis & Health Endpoints ---
apiRouter.get('/soil-reports', optionalAuth, getSoilReports);
apiRouter.post('/soil-reports', optionalAuth, submitSoilAnalysis);

// --- Weather & Advisory Endpoints ---
apiRouter.get('/weather', getWeather);
apiRouter.get('/alerts', getAlerts);

// --- Resources & Marketplace Endpoints ---
apiRouter.get('/resources', getResources);
apiRouter.get('/orders', optionalAuth, getOrders);
apiRouter.post('/orders', optionalAuth, createOrder);
apiRouter.put('/orders/:id/status', optionalAuth, updateOrderStatus);

// --- Consultation Endpoints ---
apiRouter.get('/consultations', optionalAuth, getConsultations);
apiRouter.post('/consultations', optionalAuth, bookConsultation);
apiRouter.put('/consultations/:id', optionalAuth, updateConsultation);

// --- Community Forum Endpoints ---
apiRouter.get('/forum', optionalAuth, getPosts);
apiRouter.post('/forum', optionalAuth, createPost);
apiRouter.post('/forum/:id/comments', optionalAuth, addComment);
apiRouter.post('/forum/:id/like', optionalAuth, toggleLike);

// --- Market & Schemes Endpoints ---
apiRouter.get('/mandi-prices', getMandiPrices);
apiRouter.get('/government-schemes', getGovernmentSchemes);

// --- Admin Endpoints ---
apiRouter.get('/admin/stats', optionalAuth, getAdminStats);
apiRouter.get('/admin/users', optionalAuth, getUsers);
apiRouter.put('/admin/users/:id/role', optionalAuth, updateUserRole);
apiRouter.post('/admin/alerts', optionalAuth, broadcastAlert);
apiRouter.post('/admin/resources', optionalAuth, addResource);
apiRouter.post('/admin/reseed', reseedDatabase);
