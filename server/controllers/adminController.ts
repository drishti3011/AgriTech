import { Response } from 'express';
import { dataStore, StoreAlert, StoreResource } from '../data/store.js';
import { AuthRequest } from '../middleware/auth.js';

export const getAdminStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalFarmers = dataStore.users.filter(u => u.role === 'farmer').length;
    const totalFarms = dataStore.farms.length;
    const totalAcres = dataStore.farms.reduce((sum, f) => sum + f.area, 0);
    const activeCrops = dataStore.crops.filter(c => c.status !== 'Harvested').length;
    const totalOrders = dataStore.orders.length;
    const pendingOrders = dataStore.orders.filter(o => o.status === 'pending').length;
    const totalRevenue = dataStore.orders
      .filter(o => o.status !== 'rejected')
      .reduce((sum, o) => sum + o.totalAmount, 0);
    const totalConsultations = dataStore.consultations.length;
    const pendingConsultations = dataStore.consultations.filter(c => c.status === 'pending').length;
    const soilTestsLogged = dataStore.soilReports.length;

    res.json({
      success: true,
      data: {
        totalFarmers,
        totalFarms,
        totalAcres,
        activeCrops,
        totalOrders,
        pendingOrders,
        totalRevenue,
        totalConsultations,
        pendingConsultations,
        soilTestsLogged,
        recentActivity: dataStore.activityLogs.slice(0, 10),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = dataStore.users.map(({ password: _, ...rest }) => rest);
    res.json({ success: true, count: users.length, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['farmer', 'admin', 'expert'].includes(role)) {
      res.status(400).json({ success: false, message: 'Invalid role. Must be farmer, admin, or expert.' });
      return;
    }

    const user = dataStore.users.find(u => u._id === id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    user.role = role;
    dataStore.logActivity(req.user?.name || 'Admin', 'USER_ROLE_CHANGED', 'Administration', `Changed role of ${user.name} to ${role}`, req.user?.id);

    const { password: _, ...userWithoutPass } = user;
    res.json({ success: true, message: `Role updated to ${role}.`, data: userWithoutPass });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const broadcastAlert = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, category, severity, affectedCrops, region, actionRequired } = req.body;

    if (!title || !description || !actionRequired) {
      res.status(400).json({ success: false, message: 'Title, description, and action required are mandatory for an advisory alert.' });
      return;
    }

    const newAlert: StoreAlert = {
      _id: `alt-${Date.now()}`,
      title,
      description,
      category: category || 'pest',
      severity: severity || 'medium',
      affectedCrops: Array.isArray(affectedCrops) ? affectedCrops : [affectedCrops || 'All Crops'],
      region: region || 'All Agricultural Zones',
      actionRequired,
      createdAt: new Date().toISOString(),
    };

    dataStore.alerts.unshift(newAlert);
    dataStore.logActivity(req.user?.name || 'Admin', 'ALERT_BROADCAST', 'Advisory', `Broadcasted ${severity} alert: "${title}"`, req.user?.id);

    res.status(201).json({ success: true, message: 'Advisory alert broadcasted across farmer dashboards.', data: newAlert });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addResource = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, category, brand, price, unit, stock, description, certifiedOrganic, usageInstructions } = req.body;

    if (!name || !category || !price) {
      res.status(400).json({ success: false, message: 'Name, category, and price are required.' });
      return;
    }

    const newResource: StoreResource = {
      _id: `res-${Date.now()}`,
      name,
      category,
      brand: brand || 'AgriTech Verified',
      price: Number(price),
      unit: unit || 'kg',
      stock: Number(stock) || 50,
      rating: 5.0,
      description: description || 'Certified farm input',
      certifiedOrganic: Boolean(certifiedOrganic),
      usageInstructions: usageInstructions || '',
      image: '/src/assets/images/agritech_seed_fertilizer_1793120954928.jpg',
      createdAt: new Date().toISOString(),
    };

    dataStore.resources.push(newResource);
    dataStore.logActivity(req.user?.name || 'Admin', 'RESOURCE_ADDED', 'Marketplace', `Added inventory item: ${name}`, req.user?.id);

    res.status(201).json({ success: true, message: 'Resource added to store.', data: newResource });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const reseedDatabase = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    dataStore.reset();
    dataStore.logActivity('System', 'DATABASE_RESEEDED', 'System', 'Sample agricultural data re-initialized');
    res.json({ success: true, message: 'Database reset and successfully re-seeded with sample records.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
