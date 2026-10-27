import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, translations, Translations } from '../i18n/translations.js';

export interface CartItem {
  resourceId: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  image?: string;
}

export type TabType = 
  | 'dashboard' 
  | 'crops' 
  | 'soil' 
  | 'weather' 
  | 'marketplace' 
  | 'orders' 
  | 'consult' 
  | 'forum' 
  | 'mandi' 
  | 'schemes' 
  | 'admin' 
  | 'reports';

interface AppContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: Translations;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  removeFromCart: (resourceId: string) => void;
  updateCartQuantity: (resourceId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isSpeaking: boolean;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Initialize language & theme from storage
  useEffect(() => {
    const savedLang = localStorage.getItem('agritech_lang') as SupportedLanguage;
    if (savedLang && ['en', 'hi', 'te', 'ta'].includes(savedLang)) {
      setLanguageState(savedLang);
    }
    const savedTheme = localStorage.getItem('agritech_theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') document.documentElement.classList.add('dark');
    }
    const savedCart = localStorage.getItem('agritech_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        setCart([]);
      }
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('agritech_lang', lang);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('agritech_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Cart operations
  const addToCart = (item: Omit<CartItem, 'quantity'>, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.resourceId === item.resourceId);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((i) =>
          i.resourceId === item.resourceId ? { ...i, quantity: i.quantity + qty } : i
        );
      } else {
        updated = [...prev, { ...item, quantity: qty }];
      }
      localStorage.setItem('agritech_cart', JSON.stringify(updated));
      return updated;
    });
    showToast(`Added ${item.name} to cart`, 'success');
  };

  const removeFromCart = (resourceId: string) => {
    setCart((prev) => {
      const updated = prev.filter((i) => i.resourceId !== resourceId);
      localStorage.setItem('agritech_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const updateCartQuantity = (resourceId: string, delta: number) => {
    setCart((prev) => {
      const updated = prev
        .map((i) => {
          if (i.resourceId === resourceId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[];
      localStorage.setItem('agritech_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('agritech_cart');
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Web Speech synthesis for rural accessibility
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      showToast('Speech audio is not supported in this browser.', 'info');
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_~`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Language mapping
    if (language === 'hi') utterance.lang = 'hi-IN';
    else if (language === 'te') utterance.lang = 'te-IN';
    else if (language === 'ta') utterance.lang = 'ta-IN';
    else utterance.lang = 'en-IN';

    utterance.rate = 0.95; // Slightly slower for clear rural understanding
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const t = translations[language] || translations.en;

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isSpeaking,
        speakText,
        stopSpeaking,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
