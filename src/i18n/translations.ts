export type SupportedLanguage = 'en' | 'hi' | 'te' | 'ta';

export interface Translations {
  appName: string;
  tagline: string;
  nav: {
    dashboard: string;
    crops: string;
    soil: string;
    weather: string;
    marketplace: string;
    orders: string;
    consult: string;
    forum: string;
    mandi: string;
    schemes: string;
    admin: string;
    reports: string;
  };
  auth: {
    login: string;
    register: string;
    logout: string;
    farmerLogin: string;
    adminLogin: string;
    switchUser: string;
    currentRole: string;
    phone: string;
    email: string;
    name: string;
    password: string;
    welcomeBack: string;
    demoNotice: string;
  };
  weather: {
    title: string;
    subtitle: string;
    temperature: string;
    humidity: string;
    rainfall: string;
    wind: string;
    pestRisk: string;
    forecast5Day: string;
    low: string;
    medium: string;
    high: string;
    activeAlerts: string;
    actionRequired: string;
  };
  soil: {
    title: string;
    subtitle: string;
    testNow: string;
    phLevel: string;
    nitrogen: string;
    phosphorus: string;
    potassium: string;
    moisture: string;
    organicCarbon: string;
    healthStatus: string;
    recommendations: string;
    deficiencies: string;
    suitableCrops: string;
    calculateAdvice: string;
    downloadCard: string;
  };
  crops: {
    title: string;
    myFarms: string;
    addFarm: string;
    activeCrops: string;
    addCrop: string;
    variety: string;
    sowingDate: string;
    expectedHarvest: string;
    status: string;
    stage: string;
    yieldEstimate: string;
    healthScore: string;
    acres: string;
  };
  market: {
    title: string;
    subtitle: string;
    allCategories: string;
    seeds: string;
    fertilizers: string;
    pesticides: string;
    tools: string;
    organic: string;
    inStock: string;
    certifiedOrganic: string;
    addToCart: string;
    cart: string;
    checkout: string;
    total: string;
    paymentMethod: string;
    orderPlaced: string;
  };
  consult: {
    title: string;
    subtitle: string;
    bookSession: string;
    agronomist: string;
    cropIssue: string;
    symptoms: string;
    urgency: string;
    normal: string;
    urgent: string;
    upcoming: string;
    prescription: string;
  };
  forum: {
    title: string;
    subtitle: string;
    askQuestion: string;
    replies: string;
    likes: string;
    reply: string;
    expertVerified: string;
    shareQuestion: string;
  };
  mandi: {
    title: string;
    subtitle: string;
    crop: string;
    market: string;
    modalPrice: string;
    minMax: string;
    trend: string;
    perQuintal: string;
  };
  schemes: {
    title: string;
    subtitle: string;
    benefits: string;
    eligibility: string;
    documents: string;
    applyNow: string;
  };
  admin: {
    title: string;
    overview: string;
    totalFarmers: string;
    totalFarms: string;
    monitoredAcres: string;
    pendingOrders: string;
    broadcastAlert: string;
    manageUsers: string;
    orderApproval: string;
  };
  common: {
    readAloud: string;
    stopReading: string;
    exportCSV: string;
    printReport: string;
    search: string;
    loading: string;
    save: string;
    cancel: string;
    confirm: string;
  };
}

export const translations: Record<SupportedLanguage, Translations> = {
  en: {
    appName: 'AgriTech',
    tagline: 'Empowering Farmers Through Digital Technology',
    nav: {
      dashboard: 'Overview',
      crops: 'My Crops & Farm',
      soil: 'Soil Health',
      weather: 'Weather & Pests',
      marketplace: 'Agri Store',
      orders: 'Track Orders',
      consult: 'Consult Experts',
      forum: 'Kisan Chopal',
      mandi: 'Mandi Rates',
      schemes: 'Govt Schemes',
      admin: 'Admin Console',
      reports: 'Farm Report',
    },
    auth: {
      login: 'Sign In',
      register: 'Register Farmer',
      logout: 'Sign Out',
      farmerLogin: 'Demo: Ramesh (Farmer)',
      adminLogin: 'Demo: Dr. Anita (Admin)',
      switchUser: 'Switch Role',
      currentRole: 'Active Profile',
      phone: 'Phone Number',
      email: 'Email Address',
      name: 'Full Name',
      password: 'Password',
      welcomeBack: 'Welcome to your smart farm',
      demoNotice: 'Demo mode active. Use quick switcher to test different roles.',
    },
    weather: {
      title: 'Real-Time Meteorological & Pest Radar',
      subtitle: 'Localized farm microclimate forecasting and pest outbreak warnings',
      temperature: 'Temperature',
      humidity: 'Relative Humidity',
      rainfall: 'Rainfall',
      wind: 'Wind Velocity',
      pestRisk: 'Pest Outbreak Hazard',
      forecast5Day: '5-Day Agricultural Weather Outlook',
      low: 'Low Risk',
      medium: 'Moderate Risk',
      high: 'High Pest Risk',
      activeAlerts: 'Active Field Advisories',
      actionRequired: 'Recommended Action',
    },
    soil: {
      title: 'Digital Soil Health & Nutrient Analysis',
      subtitle: 'Instant N-P-K evaluation, pH status, and scientifically balanced fertilizer prescriptions',
      testNow: 'Run Soil Health Test',
      phLevel: 'Soil pH (Acidity / Alkalinity)',
      nitrogen: 'Available Nitrogen (N)',
      phosphorus: 'Available Phosphorus (P)',
      potassium: 'Available Potassium (K)',
      moisture: 'Soil Moisture',
      organicCarbon: 'Organic Carbon',
      healthStatus: 'Overall Soil Status',
      recommendations: 'Scientific Dosage Recommendations',
      deficiencies: 'Detected Deficiencies',
      suitableCrops: 'Optimal Crops for this Soil',
      calculateAdvice: 'Calculate Fertilizer Prescription',
      downloadCard: 'Download Soil Health Card',
    },
    crops: {
      title: 'Farm Land & Crop Growth Tracking',
      myFarms: 'My Registered Farmlands',
      addFarm: 'Register New Farm',
      activeCrops: 'Monitored Crops & Yield Forecast',
      addCrop: 'Record New Crop',
      variety: 'Seed Variety',
      sowingDate: 'Sowing Date',
      expectedHarvest: 'Expected Harvest',
      status: 'Current Status',
      stage: 'Phenological Stage',
      yieldEstimate: 'Estimated Yield (Quintals/Acre)',
      healthScore: 'Crop Health Index',
      acres: 'Acres',
    },
    market: {
      title: 'Agri-Input Marketplace & Direct Sourcing',
      subtitle: 'Certified quality seeds, bio-fertilizers, organic inputs, and modern farm tools',
      allCategories: 'All Products',
      seeds: 'Certified Seeds',
      fertilizers: 'Fertilizers & Nutrients',
      pesticides: 'Crop Protection & Bio-Pesticides',
      tools: 'Farm Machinery & Tools',
      organic: '100% Organic Inputs',
      inStock: 'Units Available',
      certifiedOrganic: 'Certified Organic',
      addToCart: 'Add to Cart',
      cart: 'Farm Cart',
      checkout: 'Complete Order',
      total: 'Total Payable Amount',
      paymentMethod: 'Payment Preference',
      orderPlaced: 'Order Confirmed',
    },
    consult: {
      title: 'Expert Agricultural Consultation',
      subtitle: 'Book one-on-one sessions with accredited agronomists, soil scientists, and pest specialists',
      bookSession: 'Book Expert Advisory',
      agronomist: 'Agricultural Scientist',
      cropIssue: 'Problem Crop',
      symptoms: 'Observed Field Symptoms',
      urgency: 'Severity Priority',
      normal: 'Standard Advisory',
      urgent: 'Emergency Outbreak',
      upcoming: 'Scheduled Advisory Sessions',
      prescription: 'Doctor Prescription & Treatment',
    },
    forum: {
      title: 'Kisan Chopal: Farmer Community Forum',
      subtitle: 'Collaborate with progressive growers, exchange practical field knowledge, and ask agronomists',
      askQuestion: 'Ask a Farming Question',
      replies: 'Farmer Responses',
      likes: 'Helpful Votes',
      reply: 'Write Response',
      expertVerified: 'Verified Agronomist',
      shareQuestion: 'Post to Community',
    },
    mandi: {
      title: 'APMC Mandi Daily Commodity Rates',
      subtitle: 'Real-time daily modal market prices across major agricultural produce centers',
      crop: 'Commodity',
      market: 'APMC Market / Mandi',
      modalPrice: 'Modal Price',
      minMax: 'Min - Max Range',
      trend: 'Price Trend',
      perQuintal: '₹ / Quintal',
    },
    schemes: {
      title: 'Government Agricultural Schemes & Subsidies',
      subtitle: 'Official central and state financial benefits, risk insurance, and subsidy programs',
      benefits: 'Financial Benefits',
      eligibility: 'Eligibility Criteria',
      documents: 'Mandatory Documents',
      applyNow: 'Apply on Official Portal',
    },
    admin: {
      title: 'AgriTech Central Administration Console',
      overview: 'Platform Key Performance Metrics',
      totalFarmers: 'Registered Farmers',
      totalFarms: 'Farmlands Managed',
      monitoredAcres: 'Total Cultivated Acres',
      pendingOrders: 'Orders Awaiting Dispatch',
      broadcastAlert: 'Broadcast Field Advisory Alert',
      manageUsers: 'Farmer User Management',
      orderApproval: 'Resource Order Management',
    },
    common: {
      readAloud: 'Read Aloud (Audio)',
      stopReading: 'Stop Audio',
      exportCSV: 'Export CSV Data',
      printReport: 'Print / Save PDF',
      search: 'Search...',
      loading: 'Updating data...',
      save: 'Save Changes',
      cancel: 'Cancel',
      confirm: 'Confirm Action',
    },
  },
  hi: {
    appName: 'एग्रीटेक',
    tagline: 'डिजिटल तकनीक से किसान सशक्तिकरण',
    nav: {
      dashboard: 'डैशबोर्ड',
      crops: 'मेरी फसलें व खेत',
      soil: 'मृदा स्वास्थ्य',
      weather: 'मौसम व कीट अलर्ट',
      marketplace: 'कृषि स्टोर',
      orders: 'ऑर्डर ट्रैकिंग',
      consult: 'कृषि विशेषज्ञ सलाह',
      forum: 'किसान चौपाल',
      mandi: 'मंडी भाव',
      schemes: 'सरकारी योजनाएं',
      admin: 'प्रबंधक कंसोल',
      reports: 'खेत रिपोर्ट',
    },
    auth: {
      login: 'लॉग इन करें',
      register: 'नया किसान पंजीकरण',
      logout: 'लॉग आउट',
      farmerLogin: 'डेमो: रमेश पटेल (किसान)',
      adminLogin: 'डेमो: डॉ. अनीता (प्रबंधक)',
      switchUser: 'भूमिका बदलें',
      currentRole: 'वर्तमान प्रोफ़ाइल',
      phone: 'मोबाइल नंबर',
      email: 'ईमेल',
      name: 'पूरा नाम',
      password: 'पासवर्ड',
      welcomeBack: 'आपके स्मार्ट खेत में स्वागत है',
      demoNotice: 'डेमो मोड चालू है। किसान और एडमिन प्रोफाइल के बीच तुरंत स्विच करें।',
    },
    weather: {
      title: 'मौसम पूर्वानुमान एवं कीट पूर्वचेतावनी',
      subtitle: 'सटीक सूक्ष्म जलवायु रिपोर्ट और फसल कीट प्रकोप से बचाव की सलाह',
      temperature: 'तापमान',
      humidity: 'हवा में नमी (आर्द्रता)',
      rainfall: 'वर्षा की संभावना',
      wind: 'हवा की गति',
      pestRisk: 'कीट प्रकोप का जोखिम',
      forecast5Day: '5 दिवसीय कृषि मौसम पूर्वानुमान',
      low: 'कम जोखिम',
      medium: 'मध्यम जोखिम',
      high: 'गंभीर कीट चेतावनी',
      activeAlerts: 'सक्रिय कृषि परामर्श',
      actionRequired: 'आवश्यक सुरक्षात्मक कदम',
    },
    soil: {
      title: 'डिजिटल मृदा परीक्षण एवं पोषक तत्व विश्लेषण',
      subtitle: 'नाइट्रोजन, फास्फोरस, पोटाश (NPK), पीएच जांच और सटीक खाद सिफारिशें',
      testNow: 'नया मिट्टी परीक्षण दर्ज करें',
      phLevel: 'मिट्टी का पीएच (अम्लीय / क्षारीय)',
      nitrogen: 'उपलब्ध नाइट्रोजन (N)',
      phosphorus: 'उपलब्ध फास्फोरस (P)',
      potassium: 'उपलब्ध पोटाश (K)',
      moisture: 'मिट्टी की नमी',
      organicCarbon: 'जैविक कार्बन प्रतिशत',
      healthStatus: 'समग्र मृदा स्वास्थ्य',
      recommendations: 'वैज्ञानिक खाद एवं पोषण सलाह',
      deficiencies: 'पहचानी गई कमियां',
      suitableCrops: 'इस मिट्टी के लिए सर्वोत्तम फसलें',
      calculateAdvice: 'खाद की सही खुराक जानें',
      downloadCard: 'मृदा स्वास्थ्य कार्ड डाउनलोड करें',
    },
    crops: {
      title: 'खेत एवं फसल विकास ट्रैकर',
      myFarms: 'मेरे पंजीकृत खेत',
      addFarm: 'नया खेत जोड़ें',
      activeCrops: 'खेत में लगी फसलें व अनुमानित पैदावार',
      addCrop: 'नई फसल दर्ज करें',
      variety: 'बीज किस्म',
      sowingDate: 'बुआई की तारीख',
      expectedHarvest: 'संभावित कटाई',
      status: 'वर्तमान स्थिति',
      stage: 'फसल की अवस्था',
      yieldEstimate: 'अनुमानित पैदावार (क्विंटल/एकड़)',
      healthScore: 'फसल स्वास्थ्य स्कोर',
      acres: 'एकड़',
    },
    market: {
      title: 'कृषि संसाधन स्टोर एवं सीधी खरीद',
      subtitle: 'प्रमाणित बीज, जैव उर्वरक, जैविक कीटनाशक व आधुनिक कृषि उपकरण',
      allCategories: 'सभी सामग्री',
      seeds: 'प्रमाणित बीज',
      fertilizers: 'खाद व पोषक तत्व',
      pesticides: 'फसल सुरक्षा व कीटनाशक',
      tools: 'कृषि यंत्र व उपकरण',
      organic: '100% जैविक उत्पाद',
      inStock: 'उपलब्ध स्टॉक',
      certifiedOrganic: 'प्रमाणित जैविक',
      addToCart: 'कार्ट में जोड़ें',
      cart: 'किसान कार्ट',
      checkout: 'ऑर्डर पूरा करें',
      total: 'कुल देय राशि',
      paymentMethod: 'भुगतान का तरीका',
      orderPlaced: 'ऑर्डर सफलतापूर्वक दर्ज हुआ',
    },
    consult: {
      title: 'कृषि वैज्ञानिक से सीधी सलाह',
      subtitle: 'पौधा रोग, कीट नियंत्रण और पोषक तत्वों के लिए कृषि विशेषज्ञों से संपर्क करें',
      bookSession: 'परामर्श सत्र बुक करें',
      agronomist: 'कृषि वैज्ञानिक',
      cropIssue: 'प्रभावित फसल',
      symptoms: 'खेत में दिखने वाले लक्षण',
      urgency: 'प्राथमिकता',
      normal: 'सामान्य सलाह',
      urgent: 'आपातकालीन प्रकोप',
      upcoming: 'आगामी परामर्श सत्र',
      prescription: 'वैज्ञानिक का उपचार पर्चा',
    },
    forum: {
      title: 'किसान चौपाल: सामुदायिक मंच',
      subtitle: 'प्रगतिशील किसानों से चर्चा करें, अनुभव साझा करें और सवाल पूछें',
      askQuestion: 'कृषि संबंधी सवाल पूछें',
      replies: 'किसानों के उत्तर',
      likes: 'उपयोगी वोट',
      reply: 'उत्तर लिखें',
      expertVerified: 'सत्यापित कृषि वैज्ञानिक',
      shareQuestion: 'चौपाल में पोस्ट करें',
    },
    mandi: {
      title: 'कृषि उपज मंडी दैनिक भाव',
      subtitle: 'प्रमुख कृषि मंडियों के आज के न्यूनतम, अधिकतम और मॉडल भाव',
      crop: 'फसल / जिंस',
      market: 'मंडी का नाम',
      modalPrice: 'मॉडल भाव',
      minMax: 'न्यूनतम - अधिकतम',
      trend: 'भाव की दिशा',
      perQuintal: '₹ प्रति क्विंटल',
    },
    schemes: {
      title: 'सरकारी कृषि योजनाएं एवं सब्सिडी',
      subtitle: 'पीएम-किसान, फसल बीमा, सोलर पंप और सूक्ष्म सिंचाई अनुदान विवरण',
      benefits: 'योजना के मुख्य लाभ',
      eligibility: 'पात्रता की शर्तें',
      documents: 'जरूरी दस्तावेज',
      applyNow: 'आधिकारिक पोर्टल पर आवेदन करें',
    },
    admin: {
      title: 'एग्रीटेक केंद्रीय नियंत्रण कक्ष',
      overview: 'सिस्टम की प्रमुख सांख्यिकी',
      totalFarmers: 'पंजीकृत किसान',
      totalFarms: 'कुल प्रबंधित खेत',
      monitoredAcres: 'निगरानी में कुल रकबा',
      pendingOrders: 'लंबित खाद-बीज ऑर्डर',
      broadcastAlert: 'किसानों को आपात चेतावनी भेजें',
      manageUsers: 'उपयोगकर्ता सूची',
      orderApproval: 'ऑर्डर स्वीकृति व प्रबंधन',
    },
    common: {
      readAloud: 'आवाज में सुनें (बोलकर बताएं)',
      stopReading: 'आवाज रोकें',
      exportCSV: 'CSV डाउनलोड करें',
      printReport: 'प्रिंट / PDF रिपोर्ट निकालें',
      search: 'खोजें...',
      loading: 'डेटा लोड हो रहा है...',
      save: 'सुरक्षित करें',
      cancel: 'रद्द करें',
      confirm: 'पुष्टि करें',
    },
  },
  te: {
    appName: 'అగ్రిటెక్',
    tagline: 'డిజిటల్ టెక్నాలజీతో రైతు సాధికారత',
    nav: {
      dashboard: 'సమీక్ష',
      crops: 'నా పంటలు & పొలం',
      soil: 'నేల ఆరోగ్యం',
      weather: 'వాతావరణం & చీడపీడలు',
      marketplace: 'రైతు బజార్',
      orders: 'ఆర్డర్ల ట్రాకింగ్',
      consult: 'శాస్త్రవేత్తల సలహా',
      forum: 'రైతు వేదిక',
      mandi: 'మార్కెట్ ధరలు',
      schemes: 'ప్రభుత్వ పథకాలు',
      admin: 'అడ్మిన్ ప్యానెల్',
      reports: 'పొలం నివేదిక',
    },
    auth: {
      login: 'లాగిన్ అవ్వండి',
      register: 'రైతు నమోదు',
      logout: 'లాగౌట్',
      farmerLogin: 'డెమో: వెంకటేశ్ (రైతు)',
      adminLogin: 'డెమో: డాక్టర్ అనిత (అడ్మిన్)',
      switchUser: 'ప్రొఫైల్ మార్చండి',
      currentRole: 'ప్రస్తుత ప్రొఫైల్',
      phone: 'ఫోన్ నంబర్',
      email: 'ఈమెయిల్',
      name: 'పూర్తి పేరు',
      password: 'పాస్‌వర్డ్',
      welcomeBack: 'మీ స్మార్ట్ వ్యవసాయ క్షేత్రానికి స్వాగతం',
      demoNotice: 'డెమో మోడ్ యాక్టివ్‌గా ఉంది.',
    },
    weather: {
      title: 'రియల్-టైమ్ వాతావరణం & చీడపీడల హెచ్చరికలు',
      subtitle: 'స్థానిక వాతావరణ అంచనాలు మరియు ముందస్తు సలహాలు',
      temperature: 'ఉష్ణోగ్రత',
      humidity: 'తేమ శాతం',
      rainfall: 'వర్షపాతం అవకాశం',
      wind: 'గాలి వేగం',
      pestRisk: 'పురుగుల ముప్పు స్థాయి',
      forecast5Day: '5 రోజుల వాతావరణ నివేదిక',
      low: 'తక్కువ ముప్పు',
      medium: 'మధ్యస్థ ముప్పు',
      high: 'తీవ్రమైన పురుగుల హెచ్చరిక',
      activeAlerts: 'అత్యవసర సూచనలు',
      actionRequired: 'చేయవలసిన నివారణ చర్యలు',
    },
    soil: {
      title: 'నేల పరీక్ష & పోషకాల విశ్లేషణ',
      subtitle: 'నత్రజని (N), భాస్వరం (P), పొటాష్ (K), pH విశ్లేషణ మరియు సమతుల్య ఎరువుల మోతాదు',
      testNow: 'కొత్త నేల పరీక్ష చేయండి',
      phLevel: 'నేల pH స్థాయి',
      nitrogen: 'లభ్యమయ్యే నత్రజని (N)',
      phosphorus: 'భాస్వరం (P)',
      potassium: 'పొటాష్ (K)',
      moisture: 'నేలలో తేమ',
      organicCarbon: 'సేంద్రీయ కర్బనం',
      healthStatus: 'నేల నాణ్యత స్థితి',
      recommendations: 'సిఫార్సు చేసిన ఎరువుల మోతాదు',
      deficiencies: 'లోపించిన పోషకాలు',
      suitableCrops: 'అనువైన పంటలు',
      calculateAdvice: 'ఎరువుల లెక్కలు చూడండి',
      downloadCard: 'సాయిల్ హెల్త్ కార్డు పొందండి',
    },
    crops: {
      title: 'వ్యవసాయ క్షేత్రం & పంట పర్యవేక్షణ',
      myFarms: 'నా వ్యవసాయ భూములు',
      addFarm: 'కొత్త పొలం జోడించండి',
      activeCrops: 'సాగులో ఉన్న పంటలు & దిగుబడి అంచనా',
      addCrop: 'కొత్త పంట నమోదు చేయండి',
      variety: 'విత్తన రకం',
      sowingDate: 'విత్తిన తేదీ',
      expectedHarvest: 'కోత సమయం',
      status: 'ప్రస్తుత పరిస్థితి',
      stage: 'పంట ఎదుగుదల దశ',
      yieldEstimate: 'దిగుబడి అంచనా (క్వింటాళ్ళు/ఎకరం)',
      healthScore: 'పంట ఆరోగ్య స్కోరు',
      acres: 'ఎకరాలు',
    },
    market: {
      title: 'వ్యవసాయ సామాగ్రి కొనుగోలు',
      subtitle: 'ధృవీకరించబడిన విత్తనాలు, సేంద్రీయ ఎరువులు, సూక్ష్మ పోషకాలు మరియు పరికరాలు',
      allCategories: 'అన్ని ఉత్పత్తులు',
      seeds: 'నాణ్యమైన విత్తనాలు',
      fertilizers: 'ఎరువులు & పోషకాలు',
      pesticides: 'సస్యరక్షణ మందులు',
      tools: 'వ్యవసాయ పరికరాలు',
      organic: '100% సేంద్రీయ ఎరువులు',
      inStock: 'లభ్యత',
      certifiedOrganic: 'ధృవీకరించబడిన సేంద్రీయ ఉత్పత్తి',
      addToCart: 'బుట్టలో వేయండి',
      cart: 'రైతు బుట్ట',
      checkout: 'ఆర్డర్ చేయండి',
      total: 'మొత్తం చెల్లించవలసిన మొత్తం',
      paymentMethod: 'చెల్లింపు పద్ధతి',
      orderPlaced: 'ఆర్డర్ విజయవంతంగా నమోదు చేయబడింది',
    },
    consult: {
      title: 'వ్యవసాయ శాస్త్రవేత్తల సలహా వేదిక',
      subtitle: 'పంట తెగుళ్ళు, ఎరువుల యాజమాన్యంపై శాస్త్రవేత్తలతో మాట్లాడండి',
      bookSession: 'సలహా సమయాన్ని బుక్ చేయండి',
      agronomist: 'వ్యవసాయ శాస్త్రవేత్త',
      cropIssue: 'సమస్య ఉన్న పంట',
      symptoms: 'పొలంలో గమనించిన లక్షణాలు',
      urgency: 'తీవ్రత',
      normal: 'సాధారణ సలహా',
      urgent: 'అత్యవసర తెగులు',
      upcoming: 'రాబోయే అపాయింట్‌మెంట్‌లు',
      prescription: 'శాస్త్రవేత్త సూచించిన మందుల చీటి',
    },
    forum: {
      title: 'రైతు వేదిక: చర్చా వేదిక',
      subtitle: 'రైతు సోదరులతో అనుభవాలను పంచుకోండి మరియు సందేహాలను అడగండి',
      askQuestion: 'ప్రశ్న అడగండి',
      replies: 'సమాధానాలు',
      likes: 'ఉపయోగకరమైన ఓట్లు',
      reply: 'సమాధానం రాయండి',
      expertVerified: 'నిపుణులచే ధృవీకరించబడింది',
      shareQuestion: 'వేదికలో పోస్ట్ చేయండి',
    },
    mandi: {
      title: 'వ్యవసాయ మార్కెట్ ధరలు (మండీ భావాలు)',
      subtitle: 'వివిధ వ్యవసాయ మార్కెట్ల రోజువారీ తాజా ధరలు',
      crop: 'పంట / సరుకు',
      market: 'మార్కెట్ పేరు',
      modalPrice: 'సగటు ధర',
      minMax: 'కనిష్ట - గరిష్ట ధర',
      trend: 'ధరల సరళి',
      perQuintal: '₹ / క్వింటాల్',
    },
    schemes: {
      title: 'ప్రభుత్వ వ్యవసాయ పథకాలు & సబ్సిడీలు',
      subtitle: 'రైతు భరోసా, పీఎం-కిసాన్, పంటల బీమా పథకాల వివరాలు',
      benefits: 'పథకం ప్రయోజనాలు',
      eligibility: 'అర్హత నిబంధనలు',
      documents: 'కావలసిన పత్రాలు',
      applyNow: 'అధికారిక వెబ్‌సైట్‌లో దరఖాస్తు చేయండి',
    },
    admin: {
      title: 'అగ్రిటెక్ కంట్రోల్ రూమ్',
      overview: 'కీలక గణాంకాలు',
      totalFarmers: 'నమోదైన రైతులు',
      totalFarms: 'మొత్తం పొలాలు',
      monitoredAcres: 'పర్యవేక్షణలో ఉన్న భూమి (ఎకరాలు)',
      pendingOrders: 'పరిశీలనలో ఉన్న ఆర్డర్లు',
      broadcastAlert: 'రైతులకు హెచ్చరిక పంపండి',
      manageUsers: 'రైతుల జాబితా',
      orderApproval: 'ఆర్డర్ల నిర్వహణ',
    },
    common: {
      readAloud: 'వాయిస్ వినండి (చదివి వినిపించు)',
      stopReading: 'వాయిస్ ఆపండి',
      exportCSV: 'CSV ఫైల్ డౌన్‌లోడ్',
      printReport: 'రిపోర్ట్ ప్రింట్ / PDF',
      search: 'వెతకండి...',
      loading: 'డేటా లోడ్ అవుతోంది...',
      save: 'సేవ్ చేయండి',
      cancel: 'రద్దు',
      confirm: 'నిర్ధారించండి',
    },
  },
  ta: {
    appName: 'அக்ரிடெக்',
    tagline: 'டிஜிட்டல் தொழில்நுட்பத்தால் விவசாயிகள் மேம்பாடு',
    nav: {
      dashboard: 'முகப்பு',
      crops: 'என் பயிர்கள் & நிலம்',
      soil: 'மண் வளம்',
      weather: 'வானிலை & பூச்சி எச்சரிக்கை',
      marketplace: 'விவசாய அங்காடி',
      orders: 'ஆர்டர் நிலை',
      consult: 'விவசாய நிபுணர் ஆலோசனை',
      forum: 'விவசாயிகள் களம்',
      mandi: 'மண்டி விலை நிலவரம்',
      schemes: 'அரசு திட்டங்கள்',
      admin: 'நிர்வாக பலகை',
      reports: 'பண்ணை அறிக்கை',
    },
    auth: {
      login: 'உள்நுழைக',
      register: 'விவசாயி பதிவு',
      logout: 'வெளியேறு',
      farmerLogin: 'டெமோ: ரமேஷ் (விவசாயி)',
      adminLogin: 'டெமோ: டாக்டர் அனிதா (நிர்வாகி)',
      switchUser: 'பயனர் மாற்றம்',
      currentRole: 'தற்போதைய சுயவிவரம்',
      phone: 'தொலைபேசி எண்',
      email: 'மின்னஞ்சல்',
      name: 'முழு பெயர்',
      password: 'கடவுச்சொல்',
      welcomeBack: 'உங்கள் ஸ்மார்ட் பண்ணைக்கு நல்வரவு',
      demoNotice: 'டெமோ பயன்முறை செயலில் உள்ளது.',
    },
    weather: {
      title: 'நிகழ்நேர வானிலை & பூச்சித் தாக்குதல் எச்சரிக்கை',
      subtitle: 'துல்லியமான பண்ணை நுண்ணிய வானிலை மற்றும் தடுப்பு ஆலோசனைகள்',
      temperature: 'வெப்பநிலை',
      humidity: 'காற்றின் ஈரப்பதம்',
      rainfall: 'மழை வாய்ப்பு',
      wind: 'காற்றின் வேகம்',
      pestRisk: 'பூச்சித் தாக்குதல் ஆபத்து',
      forecast5Day: '5 நாள் வானிலை முன்னறிவிப்பு',
      low: 'குறைந்த ஆபத்து',
      medium: 'மிதமான ஆபத்து',
      high: 'அதி தீவிர பூச்சி எச்சரிக்கை',
      activeAlerts: 'கள ஆலோசனைகள்',
      actionRequired: 'தேவையான பாதுகாப்பு நடவடிக்கை',
    },
    soil: {
      title: 'மண் பரிசோதனை & ஊட்டச்சத்து பகுப்பாய்வு',
      subtitle: 'தழைச்சத்து (N), மணிச்சத்து (P), சாம்பல்சத்து (K), pH அளவு மற்றும் சமச்சீர் உர பரிந்துரைகள்',
      testNow: 'மண் பரிசோதனை செய்',
      phLevel: 'மண் pH கார அமிலத்தன்மை',
      nitrogen: 'கிடைக்கும் தழைச்சத்து (N)',
      phosphorus: 'மணிச்சத்து (P)',
      potassium: 'சாம்பல்சத்து (K)',
      moisture: 'மண்ணின் ஈரப்பதம்',
      organicCarbon: 'கரிம கார்பன் அளவு',
      healthStatus: 'ஒட்டுமொத்த மண் ஆரோக்கியம்',
      recommendations: 'விஞ்ஞான உர பரிந்துரை',
      deficiencies: 'கண்டறியப்பட்ட சத்துக்குறைபாடுகள்',
      suitableCrops: 'ஏற்ற சிறந்த பயிர்கள்',
      calculateAdvice: 'உர அளவை கணக்கிடு',
      downloadCard: 'மண் வள அட்டை பதிவிறக்கம்',
    },
    crops: {
      title: 'விவசாய நிலம் & பயிர் வளர்ச்சி கண்காணிப்பு',
      myFarms: 'என் பதிவு செய்யப்பட்ட நிலங்கள்',
      addFarm: 'புதிய பண்ணை சேர்',
      activeCrops: 'பயிர்கள் & விளைச்சல் எதிர்பார்ப்பு',
      addCrop: 'புதிய பயிர் பதிவு செய்',
      variety: 'விதை ரகம்',
      sowingDate: 'விதைத்த தேதி',
      expectedHarvest: 'அறுவடை காலம்',
      status: 'தற்போதைய நிலை',
      stage: 'வளர்ச்சி நிலை',
      yieldEstimate: 'மதிப்பிடப்பட்ட விளைச்சல் (குவிண்டால்/ஏக்கர்)',
      healthScore: 'பயிர் ஆரோக்கிய மதிப்பீடு',
      acres: 'ஏக்கர்',
    },
    market: {
      title: 'விவசாய இடுபொருட்கள் & நேரடி கொள்முதல்',
      subtitle: 'சான்றளிக்கப்பட்ட விதைகள், உயிர் உரங்கள், இயற்கை பூச்சிக்கொல்லிகள் மற்றும் கருவிகள்',
      allCategories: 'அனைத்து பொருட்கள்',
      seeds: 'தரமான விதைகள்',
      fertilizers: 'உரங்கள் & நுண்ணூட்டச்சத்துக்கள்',
      pesticides: 'பயிர் பாதுகாப்பு மருந்துகள்',
      tools: 'வேளாண் கருவிகள்',
      organic: '100% இயற்கை இடுபொருட்கள்',
      inStock: 'கையிருப்பு',
      certifiedOrganic: 'சான்றளிக்கப்பட்ட இயற்கை தயாரிப்பு',
      addToCart: 'கூடையில் சேர்',
      cart: 'விவசாய கூடை',
      checkout: 'ஆர்டர் செய்',
      total: 'மொத்த தொகை',
      paymentMethod: 'பணம் செலுத்தும் முறை',
      orderPlaced: 'ஆர்டர் வெற்றிகரமாக பதிவு செய்யப்பட்டது',
    },
    consult: {
      title: 'வேளாண் விஞ்ஞானி நேரடி ஆலோசனை',
      subtitle: 'பயிர் நோய், பூச்சி மேலாண்மைக்கு தகுதிவாய்ந்த வேளாண் நிபுணர்களுடன் பேசுங்கள்',
      bookSession: 'ஆலோசனை நேரம் முன்பதிவு செய்',
      agronomist: 'வேளாண் விஞ்ஞானி',
      cropIssue: 'பாதிக்கப்பட்ட பயிர்',
      symptoms: 'பயிரில் காணப்படும் அறிகுறிகள்',
      urgency: 'அவசரம்',
      normal: 'சாதாரண ஆலோசனை',
      urgent: 'தீவிர பூச்சி நோய் தாக்குதல்',
      upcoming: 'பதிவு செய்யப்பட்ட ஆலோசனைகள்',
      prescription: 'மருந்து பரிந்துரை சீட்டு',
    },
    forum: {
      title: 'விவசாயிகள் களம்: கலந்துரையாடல் மேடை',
      subtitle: 'முன்னோடி விவசாயிகளுடன் அனுபவங்களை பகிர்ந்து கொள்ளுங்கள்',
      askQuestion: 'விவசாய கேள்வி கேள்',
      replies: 'பதில்கள்',
      likes: 'விருப்பங்கள்',
      reply: 'பதில் எழுது',
      expertVerified: 'நிபுணரால் சரிபார்க்கப்பட்டது',
      shareQuestion: 'களத்தில் வெளியிடு',
    },
    mandi: {
      title: 'வேளாண் விற்பனை சந்தை தினசரி விலை',
      subtitle: 'முக்கிய உழவர் சந்தை மற்றும் ஒழுங்குமுறை விற்பனைக்கூடங்களின் தினசரி விலை',
      crop: 'பயிர் / விளைபொருள்',
      market: 'சந்தை பெயர்',
      modalPrice: 'சராசரி விலை',
      minMax: 'குறைந்தபட்ச - அதிகபட்ச விலை',
      trend: 'விலை போக்கு',
      perQuintal: '₹ / குவிண்டால்',
    },
    schemes: {
      title: 'அரசு விவசாய நலத்திட்டங்கள் & மானியங்கள்',
      subtitle: 'பிஎம்-கிசான், பயிர் காப்பீடு, சொட்டு நீர் பாசன மானிய விவரங்கள்',
      benefits: 'திட்டத்தின் நன்மைகள்',
      eligibility: 'தகுதி வரம்புகள்',
      documents: 'தேவையான ஆவணங்கள்',
      applyNow: 'அதிகாரப்பூர்வ இணையதளத்தில் விண்ணப்பிக்கவும்',
    },
    admin: {
      title: 'அக்ரிடெக் தலைமை கட்டுப்பாட்டு அறை',
      overview: 'தளத்தின் முக்கிய புள்ளிவிவரங்கள்',
      totalFarmers: 'பதிவுசெய்த விவசாயிகள்',
      totalFarms: 'நிர்வகிக்கப்படும் பண்ணைகள்',
      monitoredAcres: 'கண்காணிக்கப்படும் நிலப்பரப்பு (ஏக்கர்)',
      pendingOrders: 'நிலுவையில் உள்ள ஆர்டர்கள்',
      broadcastAlert: 'விவசாயிகளுக்கு எச்சரிக்கை அனுப்பு',
      manageUsers: 'விவசாயிகள் பட்டியல்',
      orderApproval: 'ஆர்டர் மேலாண்மை',
    },
    common: {
      readAloud: 'குரல் வழியே கேள் (ஒலி)',
      stopReading: 'ஒலியை நிறுத்து',
      exportCSV: 'CSV பதிவிறக்கம்',
      printReport: 'அறிக்கை அச்சிடு / PDF',
      search: 'தேடு...',
      loading: 'தரவு ஏற்றப்படுகிறது...',
      save: 'சேமி',
      cancel: 'ரத்து',
      confirm: 'உறுதி செய்',
    },
  },
};
