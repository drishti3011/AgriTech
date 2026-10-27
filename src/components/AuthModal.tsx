import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useApp } from '../context/AppContext.js';
import { X, Lock, Mail, Phone, User, Sprout, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, switchRoleDemo, isLoading } = useAuth();
  const { t, showToast } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'farmer',
    region: 'Narmada Valley Region',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      const res = await login(form.email, form.password);
      if (res.success) {
        showToast('Welcome back to AgriTech!', 'success');
        onClose();
      } else {
        showToast(res.message || 'Login failed', 'error');
      }
    } else {
      if (!form.name || !form.email || !form.password || !form.phone) {
        showToast('Please fill all required registration fields', 'error');
        return;
      }
      const res = await register(form);
      if (res.success) {
        showToast('Farmer profile registered successfully!', 'success');
        onClose();
      } else {
        showToast(res.message || 'Registration failed', 'error');
      }
    }
  };

  const handleQuickDemo = (role: 'farmer' | 'admin') => {
    switchRoleDemo(role);
    showToast(`Switched active profile to ${role === 'admin' ? 'Dr. Anita Roy (Admin)' : 'Ramesh Patel (Farmer)'}`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                {mode === 'login' ? t.auth.login : t.auth.register}
              </h3>
              <p className="text-[11px] text-neutral-400">
                AgriTech Krishi Sahayak Platform
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Switcher Section */}
        <div className="mb-5 p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block mb-2">
            ⚡ Instant 1-Click Demo Profiles (No Typing Required)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('farmer')}
              className="px-3 py-2 rounded-lg bg-white dark:bg-neutral-800 border border-emerald-300 dark:border-emerald-700 text-left hover:bg-emerald-100/50 dark:hover:bg-neutral-700 transition-colors shadow-2xs"
            >
              <span className="text-xs font-bold block text-neutral-900 dark:text-white">🌾 Ramesh Patel</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Farmer Dashboard</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="px-3 py-2 rounded-lg bg-white dark:bg-neutral-800 border border-purple-300 dark:border-purple-700 text-left hover:bg-purple-100/50 dark:hover:bg-neutral-700 transition-colors shadow-2xs"
            >
              <span className="text-xs font-bold block text-neutral-900 dark:text-white">🛡️ Dr. Anita Roy</span>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">Admin & Agronomist</span>
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                {t.auth.name} *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full py-2 pl-8 pr-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
                <User className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
              {t.auth.email} *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="ramesh@farmer.in or admin@agritech.org"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full py-2 pl-8 pr-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
              <Mail className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                {t.auth.phone} *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="+91 94231 88921"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full py-2 pl-8 pr-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
                <Phone className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
              {t.auth.password} *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full py-2 pl-8 pr-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
              <Lock className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors mt-2"
          >
            {isLoading ? 'Processing...' : mode === 'login' ? t.auth.login : t.auth.register}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-center text-xs text-neutral-500">
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-emerald-600 font-bold hover:underline"
              >
                {t.auth.register}
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-emerald-600 font-bold hover:underline"
              >
                {t.auth.login}
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
