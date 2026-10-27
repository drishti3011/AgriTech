import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.js';
import { api } from '../services/api.js';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Search, 
  MapPin, 
  Calendar,
  Building2,
  RefreshCw
} from 'lucide-react';

export const MandiPricesSection: React.FC = () => {
  const { t } = useApp();
  const [prices, setPrices] = useState<any[]>([]);
  const [searchCrop, setSearchCrop] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const res = await api.getMandiPrices({
        crop: searchCrop.trim() || undefined,
        state: selectedState !== 'all' ? selectedState : undefined,
      });
      if (res.data.success) {
        setPrices(res.data.data);
      }
    } catch (e) {
      console.warn('Failed to fetch mandi prices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [selectedState, searchCrop]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            {t.mandi.title}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {t.mandi.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-56">
            <input
              type="text"
              value={searchCrop}
              onChange={(e) => setSearchCrop(e.target.value)}
              placeholder="Search crop or variety..."
              className="w-full text-xs py-2 pl-8 pr-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
          </div>

          {/* State Filter */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold"
          >
            <option value="all">All States</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Telangana">Telangana</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Haryana">Haryana</option>
          </select>
        </div>
      </div>

      {/* APMC Mandi Rates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prices.map((item) => {
          const isUp = item.trend === 'up';
          const isDown = item.trend === 'down';
          return (
            <div
              key={item._id}
              className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex flex-col justify-between hover:border-emerald-500/40 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                      {item.cropName}
                    </h3>
                    <span className="text-[11px] text-neutral-500">
                      Variety: {item.variety}
                    </span>
                  </div>

                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold font-mono ${
                    isUp ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                    isDown ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' :
                    'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
                  }`}>
                    {isUp && <TrendingUp className="w-3 h-3 text-emerald-600" />}
                    {isDown && <TrendingDown className="w-3 h-3 text-red-600" />}
                    {!isUp && !isDown && <Minus className="w-3 h-3 text-neutral-500" />}
                    <span>{item.changeAmount > 0 ? `+₹${item.changeAmount}` : item.changeAmount < 0 ? `-₹${Math.abs(item.changeAmount)}` : 'Stable'}</span>
                  </div>
                </div>

                <div className="my-3 space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="font-medium text-neutral-900 dark:text-white">{item.market}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <MapPin className="w-3 h-3 text-neutral-400" />
                    <span>{item.district}, {item.state}</span>
                  </div>
                </div>
              </div>

              {/* Price Details */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-[11px] text-neutral-400 font-medium">Modal Market Price</span>
                  <span className="text-lg font-extrabold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                    ₹{item.modalPrice}
                    <span className="text-[10px] text-neutral-400 font-normal"> / Qtl</span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
                  <span>Range: ₹{item.minPrice} - ₹{item.maxPrice}</span>
                  <span>{item.priceDate}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
