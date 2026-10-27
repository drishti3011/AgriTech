/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext.js';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { Navbar } from './components/Navbar.js';
import { HeroBanner } from './components/HeroBanner.js';
import { WeatherPestWidget } from './components/WeatherPestWidget.js';
import { FarmCropSection } from './components/FarmCropSection.js';
import { SoilAnalysisSection } from './components/SoilAnalysisSection.js';
import { MarketplaceSection } from './components/MarketplaceSection.js';
import { OrdersTrackerSection } from './components/OrdersTrackerSection.js';
import { ConsultationSection } from './components/ConsultationSection.js';
import { CommunityForumSection } from './components/CommunityForumSection.js';
import { MandiPricesSection } from './components/MandiPricesSection.js';
import { GovernmentSchemesSection } from './components/GovernmentSchemesSection.js';
import { AdminDashboard } from './components/AdminDashboard.js';
import { CartDrawer } from './components/CartDrawer.js';
import { FarmReportModal } from './components/FarmReportModal.js';
import { AuthModal } from './components/AuthModal.js';
import { 
  Sprout, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Heart,
  Volume2
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, toast, t } = useApp();
  const { user, isAdmin } = useAuth();

  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-100/60 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors">
      
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-xs font-semibold text-white ${
            toast.type === 'error' ? 'bg-red-600' : toast.type === 'info' ? 'bg-blue-600' : 'bg-emerald-600'
          }`}>
            {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        onOpenAuth={() => setAuthOpen(true)}
        onOpenCart={() => setCartOpen(true)}
      />

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Render Tab Contents */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            <HeroBanner onOpenReport={() => setReportOpen(true)} />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-8">
                <FarmCropSection />
                <SoilAnalysisSection onOpenReport={() => setReportOpen(true)} />
              </div>
              <div className="lg:col-span-4 space-y-8">
                <WeatherPestWidget />
                <MandiPricesSection />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'crops' && (
          <div className="animate-in fade-in duration-150">
            <FarmCropSection />
          </div>
        )}

        {activeTab === 'soil' && (
          <div className="animate-in fade-in duration-150">
            <SoilAnalysisSection onOpenReport={() => setReportOpen(true)} />
          </div>
        )}

        {activeTab === 'weather' && (
          <div className="animate-in fade-in duration-150">
            <WeatherPestWidget />
          </div>
        )}

        {activeTab === 'marketplace' && (
          <div className="animate-in fade-in duration-150">
            <MarketplaceSection onOpenCart={() => setCartOpen(true)} />
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="animate-in fade-in duration-150">
            <OrdersTrackerSection />
          </div>
        )}

        {activeTab === 'consult' && (
          <div className="animate-in fade-in duration-150">
            <ConsultationSection />
          </div>
        )}

        {activeTab === 'forum' && (
          <div className="animate-in fade-in duration-150">
            <CommunityForumSection />
          </div>
        )}

        {activeTab === 'mandi' && (
          <div className="animate-in fade-in duration-150">
            <MandiPricesSection />
          </div>
        )}

        {activeTab === 'schemes' && (
          <div className="animate-in fade-in duration-150">
            <GovernmentSchemesSection />
          </div>
        )}

        {activeTab === 'admin' && isAdmin && (
          <div className="animate-in fade-in duration-150">
            <AdminDashboard />
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="animate-in fade-in duration-150">
            <FarmReportModal isOpen={true} onClose={() => setActiveTab('dashboard')} />
          </div>
        )}
      </main>

      {/* Cart & Modals */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onOrderSuccess={() => setActiveTab('orders')}
      />

      <FarmReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
      />

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
      />

      {/* Footer (No slop, quiet and informative) */}
      <footer className="mt-12 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              {t.appName}
            </span>
            <span>·</span>
            <span>Empowering Indian Agriculture Through Digital Agronomy</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            <span>Languages: English · हिंदी · తెలుగు · தமிழ்</span>
            <span>·</span>
            <span>ICAR & APMC Grounded</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </AuthProvider>
  );
}
