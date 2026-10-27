import bcrypt from 'bcryptjs';

// Seed data interfaces
export interface StoreUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'farmer' | 'admin' | 'expert';
  language: 'en' | 'hi' | 'te' | 'ta';
  region: string;
  village: string;
  state: string;
  avatar?: string;
  createdAt: string;
}

export interface StoreFarm {
  _id: string;
  owner: string;
  name: string;
  location: {
    district: string;
    state: string;
    village: string;
    latitude?: number;
    longitude?: number;
  };
  area: number;
  soilType: 'Alluvial' | 'Black' | 'Red' | 'Sandy' | 'Clay' | 'Loamy';
  irrigationType: 'Drip' | 'Sprinkler' | 'Canal' | 'Rainfed' | 'Borewell';
  surveyNumber: string;
  notes: string;
  createdAt: string;
}

export interface StoreCrop {
  _id: string;
  farm: string;
  user: string;
  name: string;
  variety: string;
  sowingDate: string;
  expectedHarvest: string;
  status: 'Planned' | 'Sown' | 'Growing' | 'Flowering' | 'Harvesting' | 'Harvested';
  stage: string;
  yieldEstimated: number;
  yieldActual?: number;
  areaAllocated: number;
  notes: string;
  healthScore: number;
  createdAt: string;
}

export interface StoreSoilReport {
  _id: string;
  farm: string;
  user: string;
  testDate: string;
  pH: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicCarbon: number;
  moisture: number;
  electricalConductivity: number;
  healthStatus: 'Excellent' | 'Good' | 'Deficient' | 'Critical';
  recommendations: string[];
  deficiencies: string[];
  suitableCrops: string[];
  createdAt: string;
}

export interface StoreResource {
  _id: string;
  name: string;
  category: 'seeds' | 'fertilizers' | 'pesticides' | 'tools' | 'organic';
  brand: string;
  price: number;
  unit: string;
  stock: number;
  rating: number;
  description: string;
  image?: string;
  certifiedOrganic: boolean;
  usageInstructions: string;
  createdAt: string;
}

export interface StoreOrder {
  _id: string;
  user: string;
  orderNumber: string;
  items: Array<{
    resource: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    unit: string;
  }>;
  totalAmount: number;
  status: 'pending' | 'approved' | 'shipped' | 'delivered' | 'rejected';
  shippingAddress: {
    fullName: string;
    phone: string;
    village: string;
    district: string;
    state: string;
    pincode: string;
  };
  paymentMethod: 'Cash on Delivery (Kisan Pay)' | 'UPI' | 'Direct Bank Transfer';
  timeline: Array<{
    status: string;
    timestamp: string;
    note: string;
  }>;
  createdAt: string;
}

export interface StoreWeatherData {
  _id: string;
  location: string;
  state: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  condition: string;
  icon: string;
  pestRiskLevel: 'Low' | 'Medium' | 'High';
  forecast: Array<{
    day: string;
    date: string;
    tempMax: number;
    tempMin: number;
    rainfallChance: number;
    condition: string;
    icon: string;
    advisory: string;
  }>;
  date: string;
}

export interface StoreAlert {
  _id: string;
  title: string;
  description: string;
  category: 'weather' | 'pest' | 'disease' | 'scheme' | 'market';
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedCrops: string[];
  region: string;
  actionRequired: string;
  createdAt: string;
}

export interface StoreConsultation {
  _id: string;
  user: string;
  farmerName: string;
  farmerPhone: string;
  expertName: string;
  expertSpecialty: string;
  topic: string;
  cropAffected: string;
  symptomsDescription: string;
  urgency: 'normal' | 'urgent';
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  scheduledTime: string;
  meetingType: 'video' | 'phone' | 'field_visit';
  expertNotes?: string;
  prescription?: {
    diagnosis: string;
    treatmentSteps: string[];
    recommendedProducts: string[];
  };
  createdAt: string;
}

export interface StoreForumPost {
  _id: string;
  author: string;
  authorName: string;
  authorRole: string;
  authorRegion?: string;
  title: string;
  content: string;
  cropCategory: string;
  tags: string[];
  likes: number;
  likedBy: string[];
  comments: Array<{
    id: string;
    authorName: string;
    authorRole: string;
    content: string;
    isExpert: boolean;
    createdAt: string;
  }>;
  createdAt: string;
}

export interface StoreMandiPrice {
  _id: string;
  cropName: string;
  variety: string;
  market: string;
  district: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  priceDate: string;
  trend: 'up' | 'down' | 'stable';
  changeAmount: number;
}

export interface StoreGovernmentScheme {
  _id: string;
  title: string;
  code: string;
  ministry: string;
  description: string;
  benefits: string;
  eligibility: string;
  requiredDocuments: string[];
  applicationUrl: string;
  deadline?: string;
  subsidyPercent?: number;
  category: 'direct_benefit' | 'insurance' | 'infrastructure' | 'credit';
}

export interface StoreActivityLog {
  _id: string;
  user?: string;
  userName: string;
  action: string;
  module: string;
  details: string;
  timestamp: string;
}

// Initial Data Population
const defaultHashedPassword = bcrypt.hashSync('farmer123', 8);
const adminHashedPassword = bcrypt.hashSync('admin123', 8);

const initialUsers: StoreUser[] = [
  {
    _id: 'usr-admin-01',
    name: 'Dr. Anita Roy',
    email: 'admin@agritech.org',
    password: adminHashedPassword,
    phone: '+91 98765 43210',
    role: 'admin',
    language: 'en',
    region: 'Central Agricultural Command',
    village: 'Hyderabad HQ',
    state: 'Telangana',
    avatar: '/src/assets/images/agritech_expert_agronomist_1793120954897.jpg',
    createdAt: '2026-01-10T08:00:00.000Z',
  },
  {
    _id: 'usr-farmer-01',
    name: 'Ramesh Patel',
    email: 'ramesh@farmer.in',
    password: defaultHashedPassword,
    phone: '+91 94231 88921',
    role: 'farmer',
    language: 'hi',
    region: 'Narmada Valley Region',
    village: 'Pipariya',
    state: 'Madhya Pradesh',
    avatar: '/src/assets/images/agritech_farmer_avatar_1793120954590.jpg',
    createdAt: '2026-02-01T10:30:00.000Z',
  },
  {
    _id: 'usr-farmer-02',
    name: 'Venkatesh Rao',
    email: 'venkat@farmer.in',
    password: defaultHashedPassword,
    phone: '+91 98480 22319',
    role: 'farmer',
    language: 'te',
    region: 'Godavari Delta Region',
    village: 'Kovvur',
    state: 'Andhra Pradesh',
    avatar: '/src/assets/images/agritech_farmer_avatar_1793120954590.jpg',
    createdAt: '2026-02-15T11:45:00.000Z',
  },
];

const initialFarms: StoreFarm[] = [
  {
    _id: 'frm-01',
    owner: 'usr-farmer-01',
    name: 'Narmada Green Fertile Farm',
    location: {
      district: 'Hoshangabad',
      state: 'Madhya Pradesh',
      village: 'Pipariya',
      latitude: 22.7533,
      longitude: 78.3582,
    },
    area: 6.5,
    soilType: 'Black',
    irrigationType: 'Drip',
    surveyNumber: 'Khasra-412/A',
    notes: 'Clay-rich black cotton soil, high moisture holding capacity. Drip network installed in 2024.',
    createdAt: '2026-02-02T09:00:00.000Z',
  },
  {
    _id: 'frm-02',
    owner: 'usr-farmer-01',
    name: 'Sunrise Orchard & Wheat Field',
    location: {
      district: 'Hoshangabad',
      state: 'Madhya Pradesh',
      village: 'Bankhedi',
      latitude: 22.7812,
      longitude: 78.4121,
    },
    area: 4.0,
    soilType: 'Loamy',
    irrigationType: 'Sprinkler',
    surveyNumber: 'Khasra-209/B',
    notes: 'Well-drained loamy soil ideal for Rabi season wheat and chickpea rotation.',
    createdAt: '2026-02-05T14:15:00.000Z',
  },
  {
    _id: 'frm-03',
    owner: 'usr-farmer-02',
    name: 'Godavari Sri Rama Paddy Fields',
    location: {
      district: 'East Godavari',
      state: 'Andhra Pradesh',
      village: 'Kovvur',
      latitude: 17.0123,
      longitude: 81.7245,
    },
    area: 8.0,
    soilType: 'Alluvial',
    irrigationType: 'Canal',
    surveyNumber: 'Sy-88/1A',
    notes: 'Fertile river silt alluvial soil with perennial canal feed from Godavari Barrage.',
    createdAt: '2026-02-16T08:30:00.000Z',
  },
];

const initialCrops: StoreCrop[] = [
  {
    _id: 'crp-01',
    farm: 'frm-01',
    user: 'usr-farmer-01',
    name: 'Wheat (गेहूं)',
    variety: 'Sharbati Gold MP-306',
    sowingDate: '2025-11-15',
    expectedHarvest: '2026-03-25',
    status: 'Growing',
    stage: 'Grain Filling Stage',
    yieldEstimated: 24,
    areaAllocated: 4.5,
    notes: 'Excellent canopy development. Last irrigation scheduled in 6 days.',
    healthScore: 92,
    createdAt: '2025-11-16T08:00:00.000Z',
  },
  {
    _id: 'crp-02',
    farm: 'frm-01',
    user: 'usr-farmer-01',
    name: 'Mustard (सरसों)',
    variety: 'Pusa Bold Yellow',
    sowingDate: '2025-10-20',
    expectedHarvest: '2026-02-28',
    status: 'Harvesting',
    stage: 'Siliqua Maturity / Pod Ripening',
    yieldEstimated: 14,
    areaAllocated: 2.0,
    notes: 'Low aphid infestation treated organically using neem kernel extract 5%.',
    healthScore: 88,
    createdAt: '2025-10-21T09:00:00.000Z',
  },
  {
    _id: 'crp-03',
    farm: 'frm-02',
    user: 'usr-farmer-01',
    name: 'Chickpea / Bengal Gram (चना)',
    variety: 'JG-11 Desi',
    sowingDate: '2025-11-05',
    expectedHarvest: '2026-03-15',
    status: 'Flowering',
    stage: 'Pod Formation',
    yieldEstimated: 16,
    areaAllocated: 4.0,
    notes: 'Nodule formation healthy. Phosphorus level supplemented with rock phosphate.',
    healthScore: 90,
    createdAt: '2025-11-06T10:00:00.000Z',
  },
  {
    _id: 'crp-04',
    farm: 'frm-03',
    user: 'usr-farmer-02',
    name: 'Paddy / Rice (వరి)',
    variety: 'BPT-5204 (Samba Mahsuri)',
    sowingDate: '2025-12-01',
    expectedHarvest: '2026-04-10',
    status: 'Growing',
    stage: 'Tillering Stage',
    yieldEstimated: 32,
    areaAllocated: 5.0,
    notes: 'Water depth maintained at 4-5cm. Nilaparvata lugens monitor installed.',
    healthScore: 94,
    createdAt: '2025-12-02T11:00:00.000Z',
  },
  {
    _id: 'crp-05',
    farm: 'frm-03',
    user: 'usr-farmer-02',
    name: 'Cotton (పత్తి)',
    variety: 'RCH-659 BG-II',
    sowingDate: '2025-07-15',
    expectedHarvest: '2026-02-15',
    status: 'Harvested',
    stage: 'Third Picking Completed',
    yieldEstimated: 22,
    yieldActual: 23.4,
    areaAllocated: 3.0,
    notes: 'High lint quality recorded. Delivered to local CCI collection centre.',
    healthScore: 96,
    createdAt: '2025-07-16T12:00:00.000Z',
  },
];

const initialSoilReports: StoreSoilReport[] = [
  {
    _id: 'soil-01',
    farm: 'frm-01',
    user: 'usr-farmer-01',
    testDate: '2026-01-18',
    pH: 7.2,
    nitrogen: 210, // Medium-low
    phosphorus: 24, // Medium
    potassium: 310, // High
    organicCarbon: 0.72,
    moisture: 24,
    electricalConductivity: 0.38,
    healthStatus: 'Good',
    deficiencies: ['Nitrogen slightly below optimal range (280-560 kg/ha)'],
    recommendations: [
      'Apply 35 kg/acre of Neem-Coated Urea or vermicompost top-dressing during tillering.',
      'Maintain drip irrigation interval of 3 days to preserve organic nitrogen absorption.',
      'Sow green manure crop (Dhaincha/Sesbania) in upcoming summer fallow season.',
    ],
    suitableCrops: ['Wheat', 'Chickpea', 'Mustard', 'Soybean', 'Cotton'],
    createdAt: '2026-01-18T14:00:00.000Z',
  },
  {
    _id: 'soil-02',
    farm: 'frm-03',
    user: 'usr-farmer-02',
    testDate: '2026-01-25',
    pH: 6.8,
    nitrogen: 285,
    phosphorus: 18,
    potassium: 260,
    organicCarbon: 0.85,
    moisture: 32,
    electricalConductivity: 0.42,
    healthStatus: 'Excellent',
    deficiencies: ['Mild zinc deficiency common in intensive paddy systems'],
    recommendations: [
      'Apply 10 kg/acre Zinc Sulphate (ZnSO4 21%) prior to final puddling.',
      'Continue incorporating paddy straw stubble with bio-decomposer.',
      'Soil pH is ideal for nutrient bioavailability.',
    ],
    suitableCrops: ['Paddy Rice', 'Sugarcane', 'Black Gram', 'Banana'],
    createdAt: '2026-01-25T11:00:00.000Z',
  },
];

const initialResources: StoreResource[] = [
  {
    _id: 'res-01',
    name: 'Certified Sharbati Wheat Seeds (HD-2967)',
    category: 'seeds',
    brand: 'National Seeds Corporation (NSC)',
    price: 950,
    unit: '20 kg bag',
    stock: 140,
    rating: 4.9,
    description: 'High-yielding, rust-resistant dwarf wheat seed variety with 98% germination guarantee and high gluten bread quality.',
    certifiedOrganic: false,
    usageInstructions: 'Sow 40 kg per acre using seed drill at 5 cm soil depth with row spacing of 20-22.5 cm.',
    image: '/src/assets/images/agritech_seed_fertilizer_1793120954928.jpg',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    _id: 'res-02',
    name: 'Neem-Coated Urea 46% N Slow-Release',
    category: 'fertilizers',
    brand: 'KRIBHCO Agri Care',
    price: 266,
    unit: '45 kg bag',
    stock: 250,
    rating: 4.8,
    description: 'Government subsidized Neem-coated nitrogenous fertilizer designed to minimize leaching loss and provide sustained crop vigor.',
    certifiedOrganic: false,
    usageInstructions: 'Apply in split doses: 50% basal at sowing, 25% at first irrigation, and 25% at boot leaf stage.',
    image: '/src/assets/images/agritech_seed_fertilizer_1793120954928.jpg',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    _id: 'res-03',
    name: 'Bio-NPK Consortium Microbial Inoculant',
    category: 'organic',
    brand: 'Kisan BioTech Organic',
    price: 420,
    unit: '1 Litre bottle',
    stock: 85,
    rating: 4.9,
    description: 'Liquid biofertilizer combining Azotobacter, PSB (Phosphate Solubilizing Bacteria), and KMB (Potash Mobilizer) to enrich microbial life.',
    certifiedOrganic: true,
    usageInstructions: 'Mix 500 ml per acre with irrigation water or mix with 100 kg farmyard manure before application.',
    image: '/src/assets/images/agritech_seed_fertilizer_1793120954928.jpg',
    createdAt: '2026-01-02T00:00:00.000Z',
  },
  {
    _id: 'res-04',
    name: 'Neem Oil 10,000 PPM Botanical Insecticide',
    category: 'pesticides',
    brand: 'EcoProtect Agro',
    price: 580,
    unit: '1 Litre bottle',
    stock: 60,
    rating: 4.7,
    description: 'Pure Azadirachtin organic bio-pesticide that repels sucking pests, aphids, whiteflies, thrips, and leaf miners without harming pollinators.',
    certifiedOrganic: true,
    usageInstructions: 'Dilute 3-5 ml per litre of water. Spray during early morning or evening for best absorption.',
    image: '/src/assets/images/agritech_seed_fertilizer_1793120954928.jpg',
    createdAt: '2026-01-02T00:00:00.000Z',
  },
  {
    _id: 'res-05',
    name: 'Rechargeable 16L Knapsack Battery Sprayer',
    category: 'tools',
    brand: 'Kisan Shakti Power',
    price: 2450,
    unit: '1 Unit (Complete Kit)',
    stock: 35,
    rating: 4.8,
    description: 'Dual-switch 12V 12Ah lithium battery-powered sprayer with brass telescopic lance, 4 interchangeable nozzles, and 8 hours runtime per charge.',
    certifiedOrganic: false,
    usageInstructions: 'Fully charge battery before field spray. Clean tank and strainer with fresh water after each spray cycle.',
    image: '/src/assets/images/agritech_seed_fertilizer_1793120954928.jpg',
    createdAt: '2026-01-03T00:00:00.000Z',
  },
  {
    _id: 'res-06',
    name: 'Soil Testing Digital pH & EC Multi-Meter',
    category: 'tools',
    brand: 'AgriSens Instruments',
    price: 1850,
    unit: '1 Device with Probe',
    stock: 45,
    rating: 4.9,
    description: 'Portable instant handheld tester with high-accuracy dual probes for real-time soil pH, electrical conductivity, and moisture reading.',
    certifiedOrganic: false,
    usageInstructions: 'Insert probes 4-6 inches into moist field soil and read stabilized digital measurement in 10 seconds.',
    image: '/src/assets/images/agritech_seed_fertilizer_1793120954928.jpg',
    createdAt: '2026-01-03T00:00:00.000Z',
  },
  {
    _id: 'res-07',
    name: 'Pusa Decomposer Bio-Capsules for Stubble',
    category: 'organic',
    brand: 'ICAR-IARI Technology',
    price: 150,
    unit: 'Packet of 4 Capsules',
    stock: 300,
    rating: 4.9,
    description: 'Fungal formulation that accelerates in-situ degradation of paddy/wheat crop residues into rich organic humus in 25 days, preventing stubble burning.',
    certifiedOrganic: true,
    usageInstructions: 'Dissolve 4 capsules in 25L warm water with 150g jaggery and 50g chickpea flour for 4 days before spraying 200L solution per acre.',
    image: '/src/assets/images/agritech_seed_fertilizer_1793120954928.jpg',
    createdAt: '2026-01-04T00:00:00.000Z',
  },
  {
    _id: 'res-08',
    name: 'Precision Drip Lateral Pipe 16mm (400m Roll)',
    category: 'tools',
    brand: 'Jain Irrigation Systems',
    price: 3200,
    unit: '400 Meter Bundle',
    stock: 22,
    rating: 4.8,
    description: 'Virgin polymer drip tubing with built-in pressure compensating inline emitters spaced at 40cm, yielding 60% water savings.',
    certifiedOrganic: false,
    usageInstructions: 'Lay along crop rows connected to main sub-line operating at 1.0 - 1.5 kg/cm2 pressure.',
    image: '/src/assets/images/agritech_seed_fertilizer_1793120954928.jpg',
    createdAt: '2026-01-05T00:00:00.000Z',
  },
];

const initialOrders: StoreOrder[] = [
  {
    _id: 'ord-101',
    user: 'usr-farmer-01',
    orderNumber: 'AGR-2026-8812',
    items: [
      {
        resource: 'res-02',
        name: 'Neem-Coated Urea 46% N Slow-Release',
        category: 'fertilizers',
        price: 266,
        quantity: 2,
        unit: '45 kg bag',
      },
      {
        resource: 'res-04',
        name: 'Neem Oil 10,000 PPM Botanical Insecticide',
        category: 'pesticides',
        price: 580,
        quantity: 1,
        unit: '1 Litre bottle',
      },
    ],
    totalAmount: 1112,
    status: 'delivered',
    shippingAddress: {
      fullName: 'Ramesh Patel',
      phone: '+91 94231 88921',
      village: 'Village Pipariya, Tehsil Pipariya',
      district: 'Hoshangabad',
      state: 'Madhya Pradesh',
      pincode: '461775',
    },
    paymentMethod: 'Cash on Delivery (Kisan Pay)',
    timeline: [
      { status: 'Order Placed', timestamp: '2026-02-18T10:15:00.000Z', note: 'Farmer verified via SMS' },
      { status: 'Approved by Agri Officer', timestamp: '2026-02-18T14:30:00.000Z', note: 'Inventory allocated from Central Mandi Warehouse' },
      { status: 'Dispatched via AgriExpress', timestamp: '2026-02-19T08:00:00.000Z', note: 'Truck MP-04-E-9921' },
      { status: 'Delivered', timestamp: '2026-02-20T16:45:00.000Z', note: 'Handed over to Ramesh Patel with receipt' },
    ],
    createdAt: '2026-02-18T10:15:00.000Z',
  },
  {
    _id: 'ord-102',
    user: 'usr-farmer-01',
    orderNumber: 'AGR-2026-9045',
    items: [
      {
        resource: 'res-03',
        name: 'Bio-NPK Consortium Microbial Inoculant',
        category: 'organic',
        price: 420,
        quantity: 2,
        unit: '1 Litre bottle',
      },
    ],
    totalAmount: 840,
    status: 'approved',
    shippingAddress: {
      fullName: 'Ramesh Patel',
      phone: '+91 94231 88921',
      village: 'Village Pipariya',
      district: 'Hoshangabad',
      state: 'Madhya Pradesh',
      pincode: '461775',
    },
    paymentMethod: 'UPI',
    timeline: [
      { status: 'Order Placed', timestamp: '2026-02-25T09:20:00.000Z', note: 'Payment confirmed via UPI' },
      { status: 'Approved by Agri Officer', timestamp: '2026-02-25T11:00:00.000Z', note: 'Packing in thermal container' },
    ],
    createdAt: '2026-02-25T09:20:00.000Z',
  },
  {
    _id: 'ord-103',
    user: 'usr-farmer-02',
    orderNumber: 'AGR-2026-9120',
    items: [
      {
        resource: 'res-05',
        name: 'Rechargeable 16L Knapsack Battery Sprayer',
        category: 'tools',
        price: 2450,
        quantity: 1,
        unit: '1 Unit (Complete Kit)',
      },
    ],
    totalAmount: 2450,
    status: 'shipped',
    shippingAddress: {
      fullName: 'Venkatesh Rao',
      phone: '+91 98480 22319',
      village: 'Kovvur Rural',
      district: 'East Godavari',
      state: 'Andhra Pradesh',
      pincode: '534350',
    },
    paymentMethod: 'Cash on Delivery (Kisan Pay)',
    timeline: [
      { status: 'Order Placed', timestamp: '2026-02-24T12:00:00.000Z', note: 'Subsidized tool request registered' },
      { status: 'Approved by Agri Officer', timestamp: '2026-02-24T15:20:00.000Z', note: 'Checked QC and warranty card' },
      { status: 'In Transit', timestamp: '2026-02-25T07:30:00.000Z', note: 'Expected arrival in 24 hours' },
    ],
    createdAt: '2026-02-24T12:00:00.000Z',
  },
];

const initialWeather: StoreWeatherData = {
  _id: 'wth-01',
  location: 'Hoshangabad / Narmadapuram',
  state: 'Madhya Pradesh',
  temperature: 28.5,
  feelsLike: 29.2,
  humidity: 54,
  rainfall: 0.0,
  windSpeed: 12.4, // km/h
  condition: 'Clear Sunny Sky',
  icon: 'sun',
  pestRiskLevel: 'Low',
  forecast: [
    {
      day: 'Today (Tue)',
      date: '27 Oct',
      tempMax: 31,
      tempMin: 18,
      rainfallChance: 5,
      condition: 'Sunny & Clear',
      icon: 'sun',
      advisory: 'Optimal weather for harvesting and grain threshing. Keep moisture below 12%.',
    },
    {
      day: 'Wednesday',
      date: '28 Oct',
      tempMax: 32,
      tempMin: 19,
      rainfallChance: 10,
      condition: 'Partly Cloudy',
      icon: 'cloud-sun',
      advisory: 'Favorable condition for foliar spray of micronutrients in early morning.',
    },
    {
      day: 'Thursday',
      date: '29 Oct',
      tempMax: 30,
      tempMin: 18,
      rainfallChance: 35,
      condition: 'Light Breezy Showers Possible',
      icon: 'cloud-rain',
      advisory: 'Postpone pesticide spraying if overcast clouds thicken. Clear drainage channels.',
    },
    {
      day: 'Friday',
      date: '30 Oct',
      tempMax: 29,
      tempMin: 17,
      rainfallChance: 15,
      condition: 'Pleasant & Mild Breeze',
      icon: 'wind',
      advisory: 'Good weather for inter-cultivation and mechanical weeding in chickpea fields.',
    },
    {
      day: 'Saturday',
      date: '31 Oct',
      tempMax: 30,
      tempMin: 18,
      rainfallChance: 5,
      condition: 'Bright Sunshine',
      icon: 'sun',
      advisory: 'Resume scheduled drip fertigation in orchard plots.',
    },
  ],
  date: new Date().toISOString(),
};

const initialAlerts: StoreAlert[] = [
  {
    _id: 'alt-01',
    title: 'Yellow Stem Borer Warning in Late Paddy',
    description: 'High light-trap catches of adult moths reported in Godavari and Krishna delta basins due to warm humid nights.',
    category: 'pest',
    severity: 'high',
    affectedCrops: ['Paddy Rice'],
    region: 'Andhra Pradesh & Telangana',
    actionRequired: 'Install pheromone traps @ 5/acre. If dead hearts exceed 5%, apply Chlorantraniliprole 18.5% SC @ 60ml/acre.',
    createdAt: '2026-02-26T06:30:00.000Z',
  },
  {
    _id: 'alt-02',
    title: 'Sudden Dew Fog & Alternaria Blight Advisory',
    description: 'Heavy early morning morning dew and 85%+ relative humidity recorded across Central MP and Rajasthan border.',
    category: 'disease',
    severity: 'medium',
    affectedCrops: ['Mustard', 'Wheat', 'Tomato'],
    region: 'Madhya Pradesh & Rajasthan',
    actionRequired: 'Inspect lower leaves for concentric brown rings. Spray Mancozeb 75% WP @ 2g per litre as preventive cover.',
    createdAt: '2026-02-25T08:15:00.000Z',
  },
  {
    _id: 'alt-03',
    title: 'PM-Kisan 19th Installment Credited Notification',
    description: 'Direct cash transfer of ₹2,000 released to e-KYC linked bank accounts for eligible landholding farmer families.',
    category: 'scheme',
    severity: 'low',
    affectedCrops: ['All Crops'],
    region: 'All India',
    actionRequired: 'Verify Aadhaar-seeded account SMS or check beneficiary status under government schemes tab.',
    createdAt: '2026-02-24T12:00:00.000Z',
  },
  {
    _id: 'alt-04',
    title: 'APMC Market Spike: Cotton Prices Surpass MSP by 18%',
    description: 'Medium and long staple Shankar-6 cotton trading at ₹7,650/quintal against Minimum Support Price of ₹6,620.',
    category: 'market',
    severity: 'low',
    affectedCrops: ['Cotton'],
    region: 'Gujarat & Maharashtra & Telangana',
    actionRequired: 'Farmers holding dried bolls advised to take advantage of favorable modal prices at primary mandis.',
    createdAt: '2026-02-23T15:00:00.000Z',
  },
];

const initialConsultations: StoreConsultation[] = [
  {
    _id: 'cns-01',
    user: 'usr-farmer-01',
    farmerName: 'Ramesh Patel',
    farmerPhone: '+91 94231 88921',
    expertName: 'Dr. Anita Roy',
    expertSpecialty: 'Soil Pathologist & Micronutrient Specialist',
    topic: 'Leaf yellowing on Sharbati wheat border rows',
    cropAffected: 'Wheat (गेहूं)',
    symptomsDescription: 'Noticed uniform pale chlorosis on younger leaves during flag leaf emergence. Irrigation was done 4 days ago.',
    urgency: 'normal',
    status: 'completed',
    scheduledDate: '2026-02-20',
    scheduledTime: '11:00 AM',
    meetingType: 'phone',
    expertNotes: 'Typical Sulphur deficiency exacerbated by cold morning temperatures and sandy sub-stratum.',
    prescription: {
      diagnosis: 'Sulphur-induced chlorosis on light soil patches',
      treatmentSteps: [
        'Foliar spray with Water Soluble Sulphur (80% WDG) @ 3g/L of water',
        'Top dress with 20 kg/acre Ammonium Sulphate before the next irrigation cycle',
      ],
      recommendedProducts: ['Sulphur 80% WDG', 'Zinc-Sulphate Micronutrient Mix'],
    },
    createdAt: '2026-02-19T09:00:00.000Z',
  },
  {
    _id: 'cns-02',
    user: 'usr-farmer-02',
    farmerName: 'Venkatesh Rao',
    farmerPhone: '+91 98480 22319',
    expertName: 'Dr. S. K. Narayanan',
    expertSpecialty: 'Integrated Pest Management (IPM) Agronomist',
    topic: 'Brown Planthopper (BPH) hopper burn containment in Samba Mahsuri',
    cropAffected: 'Paddy / Rice (వరి)',
    symptomsDescription: 'Spotted localized circular drying patches with high insect density at base of rice tillers near water level.',
    urgency: 'urgent',
    status: 'confirmed',
    scheduledDate: '2026-02-28',
    scheduledTime: '02:30 PM',
    meetingType: 'video',
    createdAt: '2026-02-26T14:00:00.000Z',
  },
];

const initialForumPosts: StoreForumPost[] = [
  {
    _id: 'frm-post-01',
    author: 'usr-farmer-01',
    authorName: 'Ramesh Patel',
    authorRole: 'farmer',
    authorRegion: 'Hoshangabad, MP',
    title: 'How to manage terminal heat stress in wheat during late March?',
    content: 'Brothers and sisters, last season we lost 3 quintals/acre because sudden heat during March shriveled our grain. What are the best practices to protect the crop this year? Has anyone tried potassium nitrate spray?',
    cropCategory: 'Wheat',
    tags: ['Wheat', 'ClimateResilience', 'HeatStress', 'Fertilizer'],
    likes: 18,
    likedBy: ['usr-farmer-02', 'usr-admin-01'],
    comments: [
      {
        id: 'c-01',
        authorName: 'Dr. Anita Roy',
        authorRole: 'expert',
        content: 'Namaste Ramesh ji. Two sprays of 0.5% Potassium Nitrate (KNO3) (1 kg in 200L water/acre) at boot leaf and grain filling stage substantially increases cellular osmotic tolerance and minimizes shriveling. Also give light, frequent night irrigation during temperature spikes.',
        isExpert: true,
        createdAt: '2026-02-21T14:30:00.000Z',
      },
      {
        id: 'c-02',
        authorName: 'Venkatesh Rao',
        authorRole: 'farmer',
        content: 'I used KNO3 last year on our farm and had 15% better grain weight! Highly recommended brother.',
        isExpert: false,
        createdAt: '2026-02-22T08:15:00.000Z',
      },
    ],
    createdAt: '2026-02-21T10:00:00.000Z',
  },
  {
    _id: 'frm-post-02',
    author: 'usr-farmer-02',
    authorName: 'Venkatesh Rao',
    authorRole: 'farmer',
    authorRegion: 'East Godavari, AP',
    title: 'Success with Drip Fertigation: 40% water saved and higher tiller count in Paddy',
    content: 'We transitioned 3 acres of paddy from flood irrigation to Alternate Wetting and Drying (AWD) with drip lateral lines. Our electricity bill cut in half and weed emergence is noticeably lower. Happy to share setup costs with anyone interested!',
    cropCategory: 'Paddy Rice',
    tags: ['WaterConservation', 'DripIrrigation', 'Paddy', 'AWD'],
    likes: 27,
    likedBy: ['usr-farmer-01'],
    comments: [
      {
        id: 'c-03',
        authorName: 'Ramesh Patel',
        authorRole: 'farmer',
        content: 'That is truly inspiring Venkatesh garu. What was the subsidy received from the horticulture department for your pipes?',
        isExpert: false,
        createdAt: '2026-02-23T11:20:00.000Z',
      },
    ],
    createdAt: '2026-02-22T16:00:00.000Z',
  },
];

const initialMandiPrices: StoreMandiPrice[] = [
  {
    _id: 'mnd-01',
    cropName: 'Wheat (गेहूं)',
    variety: 'Sharbati MP High Quality',
    market: 'Pipariya APMC',
    district: 'Hoshangabad',
    state: 'Madhya Pradesh',
    minPrice: 2850,
    maxPrice: 3400,
    modalPrice: 3120,
    priceDate: '27 Oct 2026',
    trend: 'up',
    changeAmount: 65,
  },
  {
    _id: 'mnd-02',
    cropName: 'Paddy / Basmati Rice (धान)',
    variety: '1121 Steam Basmati',
    market: 'Karnal Grain Market',
    district: 'Karnal',
    state: 'Haryana',
    minPrice: 4200,
    maxPrice: 4850,
    modalPrice: 4620,
    priceDate: '27 Oct 2026',
    trend: 'up',
    changeAmount: 110,
  },
  {
    _id: 'mnd-03',
    cropName: 'Sona Masoori Rice (బియ్యం)',
    variety: 'Grade A Polished',
    market: 'Miryalaguda APMC',
    district: 'Nalgonda',
    state: 'Telangana',
    minPrice: 2600,
    maxPrice: 3150,
    modalPrice: 2980,
    priceDate: '27 Oct 2026',
    trend: 'stable',
    changeAmount: 0,
  },
  {
    _id: 'mnd-04',
    cropName: 'Yellow Mustard (सरसों)',
    variety: 'Oil-rich 42%',
    market: 'Bharatpur Mandi',
    district: 'Bharatpur',
    state: 'Rajasthan',
    minPrice: 5400,
    maxPrice: 6050,
    modalPrice: 5850,
    priceDate: '27 Oct 2026',
    trend: 'up',
    changeAmount: 140,
  },
  {
    _id: 'mnd-05',
    cropName: 'Cotton / Kapas (పత్తి)',
    variety: 'Medium Staple Shankar-6',
    market: 'Warangal Enamamula Market',
    district: 'Warangal',
    state: 'Telangana',
    minPrice: 7100,
    maxPrice: 7850,
    modalPrice: 7600,
    priceDate: '27 Oct 2026',
    trend: 'down',
    changeAmount: -45,
  },
  {
    _id: 'mnd-06',
    cropName: 'Desi Chickpea / Chana (चना)',
    variety: 'JG-11 Dry Cleaned',
    market: 'Indore Mandi',
    district: 'Indore',
    state: 'Madhya Pradesh',
    minPrice: 5800,
    maxPrice: 6350,
    modalPrice: 6150,
    priceDate: '27 Oct 2026',
    trend: 'stable',
    changeAmount: 15,
  },
];

const initialSchemes: StoreGovernmentScheme[] = [
  {
    _id: 'sch-01',
    title: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    code: 'PM-KISAN-2026',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    description: 'Direct income support of ₹6,000 per year in three equal 4-monthly installments of ₹2,000 directly transferred into bank accounts of landholding farmer families.',
    benefits: '₹6,000 annual direct cash benefit transferred via DBT into Aadhaar-seeded accounts.',
    eligibility: 'All landholding farmer families having cultivable landholding in their names across rural and urban territories.',
    requiredDocuments: ['Aadhaar Card', 'Land Revenue Records (Khata/Khasra/ROR)', 'Active Bank Passbook', 'Mobile linked with Aadhaar for e-KYC'],
    applicationUrl: 'https://pmkisan.gov.in',
    subsidyPercent: 100,
    category: 'direct_benefit',
  },
  {
    _id: 'sch-02',
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    code: 'PMFBY-INS-2026',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    description: 'Comprehensive risk insurance solution covering crop yield loss and post-harvest damages from non-preventable natural risks (drought, flood, unseasonal rain, pests).',
    benefits: 'Maximum farmer premium capped at 1.5% for Rabi crops, 2.0% for Kharif crops, and 5% for horticultural/commercial crops. Balance premium paid 100% by Govt.',
    eligibility: 'All farmers growing notified crops in notified areas, including sharecroppers and tenant farmers.',
    requiredDocuments: ['Land Possession Certificate or Sowing Certificate', 'Aadhaar Card', 'Crop Sowing Declaration', 'Bank Account details'],
    applicationUrl: 'https://pmfby.gov.in',
    subsidyPercent: 85,
    category: 'insurance',
  },
  {
    _id: 'sch-03',
    title: 'National Mission on Micro Irrigation (Per Drop More Crop - PMKSY)',
    code: 'PMKSY-PDMC-2026',
    ministry: 'Department of Agriculture & Farmers Welfare',
    description: 'Promoting precision water conservation via micro-irrigation systems (drip and sprinkler technology) with generous subsidies up to 55% for small/marginal farmers.',
    benefits: '55% subsidy for Small & Marginal farmers; 45% subsidy for other farmers on micro-irrigation hardware installations.',
    eligibility: 'Farmers possessing agricultural land with an assured water source (borewell, open well, canal connection).',
    requiredDocuments: ['Land Record 7/12 & 8A / ROR', 'Soil & Water Quality Test Report', 'Quotation from authorized irrigation supplier', 'Aadhaar Card'],
    applicationUrl: 'https://pmksy.gov.in',
    subsidyPercent: 55,
    category: 'infrastructure',
  },
  {
    _id: 'sch-04',
    title: 'Soil Health Card Scheme (SHC)',
    code: 'SHC-MISSION-2026',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    description: 'Periodic issuance of comprehensive soil nutrient status cards containing 12 critical chemical and physical parameters with tailored dosage advice.',
    benefits: 'Free soil sample collection, testing, and delivery of personalized fertilizer recommendations every 2 years.',
    eligibility: 'All operational farmers across all agricultural districts.',
    requiredDocuments: ['Survey / Plot Number', 'Farmer ID', 'Crop history of past 2 seasons'],
    applicationUrl: 'https://soilhealth.dac.gov.in',
    subsidyPercent: 100,
    category: 'direct_benefit',
  },
  {
    _id: 'sch-05',
    title: 'Kisan Credit Card (KCC) Low-Interest Concessional Loan',
    code: 'KCC-FIN-2026',
    ministry: 'Ministry of Finance & NABARD',
    description: 'Timely and adequate credit support to meet short-term crop cultivation expenses, post-harvest costs, and farm maintenance at an effective 4% interest rate with prompt repayment.',
    benefits: 'Credit limit up to ₹3,00,000 at 7% p.a. interest, reduced to 4% p.a. with 3% prompt repayment incentive from Govt of India.',
    eligibility: 'All individual farmers, joint borrowers, tenant farmers, self-help groups (SHGs).',
    requiredDocuments: ['Land records', 'Voter ID / Aadhaar', 'Affidavit of non-encumbrance', 'Passport photos'],
    applicationUrl: 'https://www.myscheme.gov.in',
    subsidyPercent: 43,
    category: 'credit',
  },
];

const initialActivityLogs: StoreActivityLog[] = [
  {
    _id: 'act-01',
    user: 'usr-farmer-01',
    userName: 'Ramesh Patel',
    action: 'SOIL_REPORT_DOWNLOAD',
    module: 'Soil Analysis',
    details: 'Generated and downloaded official PDF soil health card for Narmada Green Fertile Farm',
    timestamp: '2026-02-26T08:12:00.000Z',
  },
  {
    _id: 'act-02',
    user: 'usr-farmer-01',
    userName: 'Ramesh Patel',
    action: 'ORDER_PLACED',
    module: 'Marketplace',
    details: 'Placed order AGR-2026-9045 for Bio-NPK Consortium (₹840)',
    timestamp: '2026-02-25T09:20:00.000Z',
  },
  {
    _id: 'act-03',
    user: 'usr-admin-01',
    userName: 'Dr. Anita Roy',
    action: 'ALERT_BROADCAST',
    module: 'Pest Advisory',
    details: 'Broadcasted Yellow Stem Borer Alert to 1,420 rice farmers in AP/Telangana basin',
    timestamp: '2026-02-26T06:30:00.000Z',
  },
];

// Unified Data Store Class
class DataStore {
  users: StoreUser[] = [...initialUsers];
  farms: StoreFarm[] = [...initialFarms];
  crops: StoreCrop[] = [...initialCrops];
  soilReports: StoreSoilReport[] = [...initialSoilReports];
  resources: StoreResource[] = [...initialResources];
  orders: StoreOrder[] = [...initialOrders];
  weather: StoreWeatherData = { ...initialWeather };
  alerts: StoreAlert[] = [...initialAlerts];
  consultations: StoreConsultation[] = [...initialConsultations];
  forumPosts: StoreForumPost[] = [...initialForumPosts];
  mandiPrices: StoreMandiPrice[] = [...initialMandiPrices];
  schemes: StoreGovernmentScheme[] = [...initialSchemes];
  activityLogs: StoreActivityLog[] = [...initialActivityLogs];

  reset() {
    this.users = [...initialUsers];
    this.farms = [...initialFarms];
    this.crops = [...initialCrops];
    this.soilReports = [...initialSoilReports];
    this.resources = [...initialResources];
    this.orders = [...initialOrders];
    this.weather = { ...initialWeather };
    this.alerts = [...initialAlerts];
    this.consultations = [...initialConsultations];
    this.forumPosts = [...initialForumPosts];
    this.mandiPrices = [...initialMandiPrices];
    this.schemes = [...initialSchemes];
    this.activityLogs = [...initialActivityLogs];
  }

  logActivity(userName: string, action: string, module: string, details: string, user?: string) {
    const log: StoreActivityLog = {
      _id: `act-${Date.now()}`,
      user,
      userName,
      action,
      module,
      details,
      timestamp: new Date().toISOString(),
    };
    this.activityLogs.unshift(log);
    if (this.activityLogs.length > 100) this.activityLogs.pop();
    return log;
  }
}

export const dataStore = new DataStore();
