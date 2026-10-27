import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.js';
import { api } from '../services/api.js';
import { 
  ShoppingBag, 
  Search, 
  Check, 
  Plus, 
  Minus, 
  ShieldCheck, 
  Sparkles, 
  Star, 
  Truck,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MarketplaceSectionProps {
  onOpenCart: () => void;
}

export const MarketplaceSection: React.FC<MarketplaceSectionProps> = ({ onOpenCart }) => {
  const { t, addToCart, showToast } = useApp();
  const [resources, setResources] = useState<any[]>([]);
  const [category, setCategory] = useState<string>('all');
  const [organicOnly, setOrganicOnly] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const res = await api.getResources({
          category: category !== 'all' ? category : undefined,
          organicOnly: organicOnly ? 'true' : undefined,
          search: search.trim() || undefined,
        });
        if (res.data.success) {
          setResources(res.data.data);
        }
      } catch (e) {
        console.warn('Failed to fetch resources');
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, [category, organicOnly, search]);

  const handleAdd = (item: any) => {
    addToCart({
      resourceId: item._id,
      name: item.name,
      category: item.category,
      price: item.price,
      unit: item.unit,
      image: item.image,
    });
    try {
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.8 },
      });
    } catch (e) {
      // Ignore confetti failure
    }
  };

  const categories = [
    { id: 'all', label: t.market.allCategories },
    { id: 'seeds', label: t.market.seeds },
    { id: 'fertilizers', label: t.market.fertilizers },
    { id: 'organic', label: t.market.organic },
    { id: 'pesticides', label: t.market.pesticides },
    { id: 'tools', label: t.market.tools },
  ];

  return (
    <div className="space-y-6">
      {/* Top Marketplace Header */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              {t.market.title}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {t.market.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search seeds, urea, sprayers..."
                className="w-full text-xs py-2 pl-8 pr-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
            </div>

            {/* View Cart Button */}
            <button
              onClick={onOpenCart}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t.market.cart}</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs & Organic Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex flex-wrap gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  category === cat.id
                    ? 'bg-white dark:bg-neutral-900 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setOrganicOnly(!organicOnly)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              organicOnly
                ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Organic Certified Only</span>
            {organicOnly && <Check className="w-3.5 h-3.5 text-emerald-600" />}
          </button>
        </div>
      </div>

      {/* Product Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {resources.map((item) => (
          <div
            key={item._id}
            className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-md transition-all"
          >
            <div>
              {/* Product Visual */}
              <div className="relative aspect-4/3 bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <img
                  src={item.image || '/src/assets/images/agritech_seed_fertilizer_1793120954928.jpg'}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                {item.certifiedOrganic && (
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[10px] shadow-sm flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Certified Organic</span>
                  </span>
                )}
                <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white font-mono text-[10px]">
                  {item.stock} in stock
                </span>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                  <span>{item.brand}</span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="font-mono font-bold">{item.rating}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-neutral-900 dark:text-white leading-snug line-clamp-2 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {item.name}
                </h3>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-3">
                  {item.description}
                </p>

                {item.usageInstructions && (
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-200/50 dark:border-emerald-800/40 line-clamp-2">
                    💡 {item.usageInstructions}
                  </p>
                )}
              </div>
            </div>

            {/* Pricing & Add to Cart */}
            <div className="p-4 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 block font-medium">Farmer Price</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold font-mono tabular-nums text-neutral-900 dark:text-white">
                    ₹{item.price}
                  </span>
                  <span className="text-[10px] text-neutral-500">/ {item.unit}</span>
                </div>
              </div>

              <button
                onClick={() => handleAdd(item)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.market.addToCart}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {resources.length === 0 && !loading && (
        <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <ShoppingBag className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">No products found</h4>
          <p className="text-xs text-neutral-500">Try adjusting your category filter or search keywords</p>
        </div>
      )}
    </div>
  );
};
