import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onOrderSuccess }) => {
  const { cart, removeFromCart, updateCartQuantity, clearCart, cartTotal, t, showToast } = useApp();
  const { user } = useAuth();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery (Kisan Pay)' | 'UPI' | 'Direct Bank Transfer'>('Cash on Delivery (Kisan Pay)');
  const [submitting, setSubmitting] = useState(false);

  const [shipping, setShipping] = useState({
    fullName: user?.name || 'Ramesh Patel',
    phone: user?.phone || '+91 94231 88921',
    village: user?.village || 'Pipariya',
    district: 'Hoshangabad',
    state: user?.state || 'Madhya Pradesh',
    pincode: '461775',
  });

  if (!isOpen) return null;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setSubmitting(true);

    try {
      const orderItems = cart.map(i => ({
        resource: i.resourceId,
        name: i.name,
        category: i.category,
        price: i.price,
        quantity: i.quantity,
        unit: i.unit,
      }));

      const res = await api.createOrder({
        items: orderItems,
        shippingAddress: shipping,
        paymentMethod,
      });

      if (res.data.success) {
        showToast('Order confirmed! Tracking details updated.', 'success');
        clearCart();
        setCheckoutStep('cart');
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {}
        onClose();
        onOrderSuccess();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to place order', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 h-full shadow-2xl flex flex-col justify-between border-l border-neutral-200 dark:border-neutral-800 animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              {checkoutStep === 'cart' ? t.market.cart : 'Kisan Direct Checkout'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {checkoutStep === 'cart' ? (
            cart.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  Your cart is empty
                </h4>
                <p className="text-xs text-neutral-500 mt-1">
                  Browse certified seeds, fertilizers, and farm machinery to add items.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.resourceId}
                    className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 flex items-center justify-between gap-3"
                  >
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white leading-snug">
                        {item.name}
                      </h4>
                      <span className="text-[11px] text-neutral-500 font-mono">
                        ₹{item.price} / {item.unit}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-lg overflow-hidden bg-white dark:bg-neutral-800">
                        <button
                          onClick={() => updateCartQuantity(item.resourceId, -1)}
                          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-neutral-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.resourceId, 1)}
                          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.resourceId)}
                        className="text-neutral-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Checkout Form */
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center gap-2 text-emerald-900 dark:text-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Subsidized Kisan Pay direct doorstep dispatch to farm village.</span>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Farmer Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={shipping.fullName}
                  onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={shipping.phone}
                    onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={shipping.pincode}
                    onChange={(e) => setShipping({ ...shipping, pincode: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Village / Tehsil Address *
                </label>
                <input
                  type="text"
                  required
                  value={shipping.village}
                  onChange={(e) => setShipping({ ...shipping, village: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    District
                  </label>
                  <input
                    type="text"
                    value={shipping.district}
                    onChange={(e) => setShipping({ ...shipping, district: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    State
                  </label>
                  <input
                    type="text"
                    value={shipping.state}
                    onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Payment Method
                </label>
                <div className="space-y-2">
                  {[
                    'Cash on Delivery (Kisan Pay)',
                    'UPI',
                    'Direct Bank Transfer',
                  ].map((method) => (
                    <label
                      key={method}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                        paymentMethod === method
                          ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30'
                          : 'border-neutral-200 dark:border-neutral-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method as any)}
                        className="accent-emerald-600"
                      />
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        {method}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer Summary & Action */}
        <div className="p-5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-400 font-medium">{t.market.total}</span>
            <span className="text-xl font-bold font-mono tabular-nums text-neutral-900 dark:text-white">
              ₹{cartTotal}
            </span>
          </div>

          {checkoutStep === 'cart' ? (
            <button
              onClick={() => setCheckoutStep('checkout')}
              disabled={cart.length === 0}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <span>Proceed to Kisan Checkout</span>
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCheckoutStep('cart')}
                className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300"
              >
                Back to Cart
              </button>
              <button
                form="checkout-form"
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>{submitting ? 'Confirming Order...' : 'Confirm Order (₹' + cartTotal + ')'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
