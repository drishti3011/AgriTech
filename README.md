# 🌾 AgriTech - Empowering Farmers Through Digital Technology

> A modern, smart, and scalable agricultural management system designed to equip rural farmers with real-time weather forecasting, scientific soil health diagnostics, pest alerts, resource ordering, mandi commodity prices, and direct expert agronomist consultation.

---

## 🌟 Key Capabilities

1. **Multilingual & Rural-Accessible**:
   - Seamless instant translation in **English**, **Hindi (हिंदी)**, **Telugu (తెలుగు)**, and **Tamil (தமிழ்)**.
   - Built-in **Text-to-Speech Web Audio Voice Assist** to read out weather reports, soil prescriptions, and scheme details for farmers with low literacy levels.
   - High-contrast touch buttons, icons, and large tabular typography designed for field usage on budget mobile devices.

2. **Crop Monitoring & Farmland Management**:
   - Register multiple farmlands with acreage, cadastral survey numbers, soil types (Black cotton, Alluvial, Red, Loamy), and irrigation systems (Drip, Sprinkler, Canal, Borewell).
   - Track crop phenological growth stages (Sown → Vegetative → Flowering → Grain Filling → Harvested), health index scores, and harvest timelines.

3. **Digital Soil Health Card & Fertilizer Calculator**:
   - Interactive testing simulator with real-time sliders for **pH, Nitrogen (N), Phosphorus (P), Potassium (K), Moisture %, and Organic Carbon %**.
   - Instant computation of deficiencies and scientific fertilizer dosage recommendations (Neem-coated urea, SSP, MOP, Gypsum/Lime, bio-decomposer) grounded in ICAR agronomy guidelines.
   - Certified Soil Health Card view with printable PDF export and CSV data export.

4. **Weather Forecasting & Pest Radar**:
   - Microclimate 5-day meteorological forecast with temperature highs/lows, relative humidity, wind speed, and rain probability.
   - Live Pest Hazard Interception Radar (Yellow Stem Borer, Alternaria Blight, Fall Armyworm) with actionable prevention steps.
   - OpenWeatherMap API integration with resilient intelligent offline fallback.

5. **Agri-Input Marketplace & Order Tracking**:
   - Certified seeds, bio-fertilizers, organic pesticides, and modern farm tools.
   - Subsidized checkout with **Kisan Pay (Cash on Delivery)**, UPI, and Direct Bank Transfer.
   - Real-time shipment milestone timeline (Placed → Approved by Agri Officer → In Transit → Delivered).

6. **Expert Agronomist Consultation**:
   - Book one-on-one sessions with senior ICAR-accredited agronomists and plant pathologists.
   - Field symptoms submission with priority tags (Normal vs. Emergency Outbreak).
   - Digital prescription with diagnosis, treatment protocol, and recommended bio-inputs.

7. **Kisan Chopal (Community Forum)**:
   - Farmer-to-farmer discussion threads, category filtering, likes, and verified expert agronomist replies.

8. **APMC Mandi Daily Commodity Price Tracker**:
   - Real-time modal rates, price ranges, and daily trends for Wheat, Basmati Rice, Sona Masoori, Mustard, Cotton, and Chickpea across Indian agricultural mandis.

9. **Government Agricultural Schemes Portal**:
   - Curated access to PM-KISAN, PMFBY (Crop Insurance), Soil Health Card Scheme, Per Drop More Crop (Micro-irrigation), and Kisan Credit Card (KCC) with eligibility criteria, document checklists, and application links.

10. **Admin Console & Content Management**:
    - Platform KPIs (Monitored Acres, Orders Awaiting Dispatch, GMV).
    - Resource order approval workflow (Approve → Dispatch → Deliver).
    - Emergency field advisory broadcast tool.
    - User role elevation and database reset/reseed capabilities.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons, Motion, Canvas-Confetti, Web Speech API.
- **Backend**: Node.js, Express.js, TypeScript (`tsx`).
- **Database**: MongoDB (Mongoose) with dual-mode architecture: connects to MongoDB Atlas or local MongoDB daemon when available, and includes a high-performance in-memory repository store so the application runs seamlessly out-of-the-box in preview environments!
- **Auth & Security**: JWT (JSON Web Tokens), bcryptjs password hashing, role-based access control (`farmer`, `admin`, `expert`), CORS, input validation.

---

## 📁 Project Architecture

```
├── /server                 # Express Backend & Mongoose Layer
│   ├── config/             # MongoDB connection (db.ts)
│   ├── models/             # Mongoose Schemas (User, Farm, Crop, SoilReport, Order, Resource, etc.)
│   ├── controllers/        # Modular business logic controllers
│   ├── routes/             # RESTful API route definitions (api.ts)
│   ├── middleware/         # Auth JWT verification and role enforcement
│   ├── data/               # In-memory store and rich initial Indian agricultural seed data
│   ├── seed.js             # Standalone database seed script
│   └── server.js           # Standalone backend server entry point
├── /src                    # React Frontend
│   ├── assets/             # Generated high-resolution agricultural image assets
│   ├── components/         # Reusable UI modules (Navbar, HeroBanner, SoilAnalysisSection, etc.)
│   ├── context/            # Global state (AuthContext, AppContext, Cart, Audio)
│   ├── i18n/               # Multilingual translations (English, Hindi, Telugu, Tamil)
│   ├── services/           # Axios HTTP client with JWT interceptor (api.ts)
│   ├── App.tsx             # Root application orchestrator
│   ├── index.css           # Tailwind CSS imports & print styles
│   └── main.tsx            # Client DOM entry
├── server.ts               # Root server mounting Express API & Vite dev middleware
├── postman_collection.json # Exported Postman collection for all REST APIs
├── .env.example            # Environment variables template
└── metadata.json           # Application metadata & capabilities
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` (or configure in AI Studio secrets):
```bash
cp .env.example .env
```
Default parameters in `.env`:
```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/agritech
JWT_SECRET=agritech_super_secret_jwt_key_2026_secure
OPENWEATHER_API_KEY=your_key_here  # Optional: falls back to intelligent meteorological simulation
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. The Express API (`/api/*`) and React frontend are both served together seamlessly on port 3000.

### 4. (Optional) Run Database Seed Script
```bash
npm run seed
```

---

## 🔑 Demo Credentials

You can use the 1-click quick profile switchers in the top navigation bar, or manually sign in with:

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Farmer (Primary)** | Ramesh Patel | `ramesh@farmer.in` | `farmer123` |
| **Farmer (Delta)** | Venkatesh Rao | `venkat@farmer.in` | `farmer123` |
| **Admin & Agronomist** | Dr. Anita Roy | `admin@agritech.org` | `admin123` |

---

## 📮 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT |
| `POST` | `/api/auth/register` | Register new farmer account |
| `GET` | `/api/auth/me` | Get authenticated user profile |
| `GET` | `/api/farms` | List user farmlands |
| `POST` | `/api/farms` | Create farm profile |
| `GET` | `/api/crops` | List monitored crops with growth stage |
| `POST` | `/api/crops` | Record new crop & estimated yield |
| `GET` | `/api/soil-reports` | List certified soil health records |
| `POST` | `/api/soil-reports` | Submit NPK soil test & receive prescription |
| `GET` | `/api/weather` | 5-day weather & microclimate forecast |
| `GET` | `/api/alerts` | Active pest and weather advisories |
| `GET` | `/api/resources` | Browse seeds, fertilizers & machinery |
| `POST` | `/api/orders` | Place order with Kisan Pay |
| `GET` | `/api/orders` | View order shipment milestone timelines |
| `PUT` | `/api/orders/:id/status` | [Admin] Approve, dispatch or deliver order |
| `GET` | `/api/consultations` | List expert agronomist appointments |
| `POST` | `/api/consultations` | Book consultation appointment |
| `GET` | `/api/forum` | Community forum discussions |
| `POST` | `/api/forum` | Post question to Kisan Chopal |
| `POST` | `/api/forum/:id/comments`| Reply to farmer question |
| `GET` | `/api/mandi-prices` | APMC mandi commodity market rates |
| `GET` | `/api/government-schemes`| Central & state agricultural schemes |
| `GET` | `/api/admin/stats` | [Admin] Key performance analytics |
| `POST` | `/api/admin/alerts` | [Admin] Broadcast emergency advisory |
| `POST` | `/api/admin/reseed` | [Admin] Reseed sample database |

---

## 📬 Postman Collection

Import `postman_collection.json` into Postman to test all API requests with pre-configured headers, sample payloads, and environment variables.
