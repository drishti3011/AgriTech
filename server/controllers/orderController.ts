import { Response } from 'express';
import { dataStore, StoreOrder } from '../data/store.js';
import { AuthRequest } from '../middleware/auth.js';

export const getResources = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, search, organicOnly } = req.query;
    let items = [...dataStore.resources];

    if (category && category !== 'all') {
      items = items.filter(i => i.category === category);
    }
    if (organicOnly === 'true') {
      items = items.filter(i => i.certifiedOrganic);
    }
    if (search) {
      const q = String(search).toLowerCase();
      items = items.filter(i => i.name.toLowerCase().includes(q) || i.brand.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
    }

    res.json({ success: true, count: items.length, data: items });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    let orders: StoreOrder[];
    if (role === 'admin') {
      orders = [...dataStore.orders];
    } else if (userId) {
      orders = dataStore.orders.filter(o => o.user === userId);
    } else {
      orders = [...dataStore.orders];
    }

    // Sort newest first
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const userId = req.user?.id || 'usr-farmer-01';

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: 'Cart items cannot be empty.' });
      return;
    }
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.village) {
      res.status(400).json({ success: false, message: 'Complete shipping address (Full Name, Phone, Village) is required.' });
      return;
    }

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderNum = `AGR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: StoreOrder = {
      _id: `ord-${Date.now()}`,
      user: userId,
      orderNumber: orderNum,
      items,
      totalAmount,
      status: 'pending',
      shippingAddress: {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        village: shippingAddress.village,
        district: shippingAddress.district || 'Hoshangabad',
        state: shippingAddress.state || 'Madhya Pradesh',
        pincode: shippingAddress.pincode || '461775',
      },
      paymentMethod: paymentMethod || 'Cash on Delivery (Kisan Pay)',
      timeline: [
        {
          status: 'Order Placed',
          timestamp: new Date().toISOString(),
          note: `Order registered for ₹${totalAmount} via ${paymentMethod || 'Kisan Pay COD'}`,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    dataStore.orders.unshift(newOrder);
    dataStore.logActivity(shippingAddress.fullName, 'ORDER_PLACED', 'Marketplace', `Placed order ${orderNum} for ₹${totalAmount}`, userId);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Delivery tracking code generated.',
      data: newOrder,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const order = dataStore.orders.find(o => o._id === id || o.orderNumber === id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    const validStatuses = ['pending', 'approved', 'shipped', 'delivered', 'rejected'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(', ')}` });
      return;
    }

    order.status = status;
    order.timeline.push({
      status: `Status changed to ${status.toUpperCase()}`,
      timestamp: new Date().toISOString(),
      note: note || `Status updated by ${req.user?.name || 'AgriTech Admin'}`,
    });

    dataStore.logActivity(req.user?.name || 'Admin', 'ORDER_STATUS_UPDATED', 'Marketplace', `Updated order ${order.orderNumber} to ${status}`, req.user?.id);

    res.json({ success: true, message: `Order marked as ${status}.`, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
