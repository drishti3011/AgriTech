import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.js';
import { api } from '../services/api.js';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  FileText,
  AlertCircle
} from 'lucide-react';

export const OrdersTrackerSection: React.FC = () => {
  const { t } = useApp();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.getOrders();
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (e) {
      console.warn('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs">Delivered</span>;
      case 'shipped':
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold text-xs">In Transit</span>;
      case 'approved':
        return <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold text-xs">Approved</span>;
      case 'rejected':
        return <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-bold text-xs">Rejected</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold text-xs">Pending Approval</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
          {t.nav.orders} ({orders.length})
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Track doorstep delivery of seeds, bio-fertilizers, and equipment dispatched from mandi warehouses
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm"
          >
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {order.orderNumber}
                  </span>
                  <span className="text-neutral-300 dark:text-neutral-700">·</span>
                  <span className="text-xs text-neutral-500 font-mono">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white mt-1">
                  Recipient: {order.shippingAddress?.fullName} ({order.shippingAddress?.village})
                </h3>
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(order.status)}
                <span className="text-base font-extrabold font-mono tabular-nums text-neutral-900 dark:text-white">
                  ₹{order.totalAmount}
                </span>
              </div>
            </div>

            {/* Items Ordered */}
            <div className="py-4">
              <span className="text-[11px] uppercase tracking-wider font-bold text-neutral-400 block mb-2">
                Dispatched Items
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {order.items?.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-neutral-900 dark:text-white block">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-neutral-500">
                        Qty: {item.quantity} × ₹{item.price} ({item.unit})
                      </span>
                    </div>
                    <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking Status Timeline */}
            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <span className="text-[11px] uppercase tracking-wider font-bold text-neutral-400 block mb-3">
                Live Shipment Milestones
              </span>
              <div className="space-y-3">
                {order.timeline?.map((step: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-800 dark:text-neutral-200">
                          {step.status}
                        </span>
                        <span className="text-[11px] font-mono text-neutral-400">
                          {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {step.note && (
                        <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">{step.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-neutral-400" />
                <span>Payment: {order.paymentMethod}</span>
              </div>
              <span className="font-mono">Pincode: {order.shippingAddress?.pincode}</span>
            </div>
          </div>
        ))}

        {orders.length === 0 && !loading && (
          <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <Package className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
              No orders placed yet
            </h4>
            <p className="text-xs text-neutral-500 mt-1">
              Visit the Agri Store to order subsidized fertilizers, seeds, and equipment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
