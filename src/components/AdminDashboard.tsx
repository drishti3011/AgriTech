import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.js';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { 
  Users, 
  Layers, 
  Package, 
  Radio, 
  Check, 
  X, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { t, showToast } = useApp();
  const { user, isAdmin } = useAuth();

  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Broadcast Alert Form
  const [alertForm, setAlertForm] = useState({
    title: '',
    description: '',
    category: 'pest',
    severity: 'high',
    affectedCrops: 'Paddy Rice, Wheat',
    region: 'Central Agricultural Command',
    actionRequired: '',
  });

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, usersRes] = await Promise.all([
        api.getAdminStats(),
        api.getOrders(),
        api.getUsers(),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (ordersRes.data.success) setOrders(ordersRes.data.data);
      if (usersRes.data.success) setUsers(usersRes.data.data);
    } catch (e) {
      console.warn('Admin data load notice');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await api.updateOrderStatus(orderId, { status });
      if (res.data.success) {
        showToast(`Order marked as ${status}`, 'success');
        loadAdminData();
      }
    } catch (err: any) {
      showToast('Error updating order', 'error');
    }
  };

  const handleBroadcastAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertForm.title || !alertForm.actionRequired) {
      showToast('Title and action required are mandatory', 'error');
      return;
    }

    try {
      const cropsArr = alertForm.affectedCrops.split(',').map(s => s.trim());
      const res = await api.broadcastAlert({
        ...alertForm,
        affectedCrops: cropsArr,
      });

      if (res.data.success) {
        showToast('Advisory alert broadcasted across all farmer devices!', 'success');
        setAlertForm({
          title: '',
          description: '',
          category: 'pest',
          severity: 'high',
          affectedCrops: 'Paddy Rice, Wheat',
          region: 'Central Agricultural Command',
          actionRequired: '',
        });
        loadAdminData();
      }
    } catch (err) {
      showToast('Error broadcasting alert', 'error');
    }
  };

  const handleReseed = async () => {
    if (!confirm('Are you sure you want to reset and reseed the sample database?')) return;
    try {
      await api.reseedDatabase();
      showToast('Database reset and re-seeded with demo records', 'success');
      loadAdminData();
    } catch (e) {
      showToast('Failed to reseed database', 'error');
    }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      await api.updateUserRole(userId, newRole);
      showToast(`User role updated to ${newRole}`, 'success');
      loadAdminData();
    } catch (e) {
      showToast('Failed to update role', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              {t.admin.title}
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold text-[10px] uppercase">
              Admin Access Active
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            System control console, resource dispatch verification, and emergency advisory broadcast
          </p>
        </div>

        <button
          onClick={handleReseed}
          className="px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reseed Demo Data</span>
        </button>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <span className="text-[11px] font-medium text-neutral-500 block mb-1">
              {t.admin.totalFarmers}
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold font-mono tabular-nums text-neutral-900 dark:text-white">
                {stats.totalFarmers}
              </span>
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <span className="text-[11px] font-medium text-neutral-500 block mb-1">
              {t.admin.monitoredAcres}
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold font-mono tabular-nums text-neutral-900 dark:text-white">
                {stats.totalAcres} Acres
              </span>
              <Layers className="w-5 h-5 text-blue-600" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <span className="text-[11px] font-medium text-neutral-500 block mb-1">
              {t.admin.pendingOrders}
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold font-mono tabular-nums text-amber-600">
                {stats.pendingOrders}
              </span>
              <Package className="w-5 h-5 text-amber-500" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <span className="text-[11px] font-medium text-neutral-500 block mb-1">
              Gross Store GMV
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                ₹{stats.totalRevenue}
              </span>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>
      )}

      {/* Resource Order Approvals Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            {t.admin.orderApproval} ({orders.length})
          </h3>
          <span className="text-xs text-neutral-500">Live order state machine</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 font-semibold border-b border-neutral-200 dark:border-neutral-700">
              <tr>
                <th className="py-2.5 px-3">Order Code</th>
                <th className="py-2.5 px-3">Farmer</th>
                <th className="py-2.5 px-3">Items</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Current Status</th>
                <th className="py-2.5 px-3">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono tabular-nums">
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                  <td className="py-3 px-3 font-bold text-neutral-900 dark:text-white">{o.orderNumber}</td>
                  <td className="py-3 px-3 font-sans font-medium">{o.shippingAddress?.fullName} ({o.shippingAddress?.district})</td>
                  <td className="py-3 px-3 font-sans text-neutral-600 dark:text-neutral-400">
                    {o.items?.map((i: any) => `${i.name} (x${i.quantity})`).join(', ')}
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-600">₹{o.totalAmount}</td>
                  <td className="py-3 px-3 font-sans">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      o.status === 'delivered' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                      o.status === 'shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                      o.status === 'approved' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' :
                      'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans">
                    <div className="flex items-center gap-1.5">
                      {o.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(o._id, 'approved')}
                          className="px-2 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-semibold"
                        >
                          Approve
                        </button>
                      )}
                      {o.status === 'approved' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(o._id, 'shipped')}
                          className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold flex items-center gap-1"
                        >
                          <Truck className="w-3 h-3" />
                          <span>Dispatch</span>
                        </button>
                      )}
                      {o.status === 'shipped' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(o._id, 'delivered')}
                          className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Delivered</span>
                        </button>
                      )}
                      {o.status === 'delivered' && (
                        <span className="text-[11px] text-emerald-600 font-bold">Fulfilled</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Broadcast Field Advisory Tool */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Radio className="w-5 h-5 text-amber-600" />
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            {t.admin.broadcastAlert}
          </h3>
        </div>

        <form onSubmit={handleBroadcastAlert} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                Alert Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Locust Swarm Pre-Warning or Severe Hailstorm"
                value={alertForm.title}
                onChange={(e) => setAlertForm({ ...alertForm, title: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Category
                </label>
                <select
                  value={alertForm.category}
                  onChange={(e) => setAlertForm({ ...alertForm, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                >
                  <option value="pest">Pest Outbreak</option>
                  <option value="weather">Severe Weather</option>
                  <option value="disease">Fungal / Bacterial Disease</option>
                  <option value="market">Market Volatility</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Severity Level
                </label>
                <select
                  value={alertForm.severity}
                  onChange={(e) => setAlertForm({ ...alertForm, severity: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                >
                  <option value="critical">Critical Outbreak</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Warning</option>
                  <option value="low">Informational</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
              Description & Scientific Context *
            </label>
            <textarea
              required
              rows={2}
              placeholder="State affected areas, high humidity or rain causes, and observed field spread..."
              value={alertForm.description}
              onChange={(e) => setAlertForm({ ...alertForm, description: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
              Mandatory Action Required by Farmer *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Spray Neem Oil 10,000 PPM @ 3ml/L or apply systemic fungicide within 48h."
              value={alertForm.actionRequired}
              onChange={(e) => setAlertForm({ ...alertForm, actionRequired: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-sm transition-colors flex items-center gap-2"
            >
              <Radio className="w-4 h-4" />
              <span>Broadcast Emergency Advisory Now</span>
            </button>
          </div>
        </form>
      </div>

      {/* User Management */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4">
          {t.admin.manageUsers} ({users.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 font-semibold border-b border-neutral-200 dark:border-neutral-700">
              <tr>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3">Phone</th>
                <th className="py-2.5 px-3">State / Region</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Change Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                  <td className="py-3 px-3 font-semibold text-neutral-900 dark:text-white">{u.name}</td>
                  <td className="py-3 px-3 text-neutral-500 font-mono">{u.email}</td>
                  <td className="py-3 px-3 font-mono">{u.phone}</td>
                  <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400">{u.state || u.region}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleChangeRole(u._id, e.target.value)}
                      className="text-[11px] py-1 px-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                    >
                      <option value="farmer">Farmer</option>
                      <option value="admin">Admin</option>
                      <option value="expert">Expert</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
