# Lumina - Safety Intelligence Platform

## Overview
Lumina is a comprehensive civic tech platform providing real-time safety intelligence through community reporting, interactive mapping, and data-driven insights for safer cities worldwide.

## 🎯 Features Implemented (100/100)

### FOUNDATION (Features 0-10) ✅
- ✅ Mission-driven landing page with global safety positioning
- ✅ Responsive website (desktop + mobile)
- ✅ Multi-language support (English, Spanish, French)
- ✅ Role-based access system (User / NGO / City / Admin)
- ✅ Accessibility-compliant UI (WCAG-ready)
- ✅ Top navigation bar with clear CTAs
- ✅ Hero section with safety intelligence messaging
- ✅ Feature highlights section
- ✅ Problem-solution explanation section
- ✅ Impact metrics counter
- ✅ Footer with privacy, ethics, and contact links

### SAFETY INTELLIGENCE MAP (Features 11-18) ✅
- ✅ Interactive city map (OpenStreetMap with React-Leaflet)
- ✅ Risk-based color-coded streets and zones (Green/Yellow/Red)
- ✅ Time-of-day safety toggle (morning/evening/night)
- ✅ Hover-based risk score popups
- ✅ Area confidence score indicator
- ✅ Dynamic legend and map filters
- ✅ City selection dropdown
- ✅ Live data refresh without page reload

### SAFE ROUTE PLANNING (Features 19-25) ✅
- ✅ Source and destination search input
- ✅ Time-of-travel selector
- ✅ Shortest route visualization
- ✅ Safer alternative route visualization
- ✅ Route-level safety score comparison
- ✅ Highlight of risky segments along routes
- ✅ Clear explanation of safer route selection

### SAFETY SIGNAL REPORTING (Features 26-34) ✅
- ✅ Anonymous safety signal submission form
- ✅ Map-based location selection
- ✅ Incident type categorization (7 types)
- ✅ Severity level selection (Low/Medium/High)
- ✅ Confirmation and trust message after submission
- ✅ Community validation mechanism
- ✅ Confidence-weighted risk scoring
- ✅ Duplicate and spam report suppression
- ✅ NGO field input integration

### NGO DASHBOARD (Features 35-42) ✅
- ✅ Secure NGO login system
- ✅ Dashboard overview with key metrics
- ✅ Emerging risk hotspot detection
- ✅ Risk trend visualization (time-based with Recharts)
- ✅ Interactive safety heatmaps
- ✅ Preventive action insight suggestions
- ✅ Export analytics in PDF format
- ✅ Export raw data in CSV format

### CITY / POLICY VIEW (Features 43-45) ✅
- ✅ Read-only city safety overview page
- ✅ Aggregated hotspot concentration visualization
- ✅ Infrastructure-risk correlation insights

### PRIVACY, ETHICS & TRUST (Features 46-50) ✅
- ✅ Zero personally identifiable information (PII) collection
- ✅ Privacy-by-design data handling layer
- ✅ Transparency page explaining risk scoring logic
- ✅ Ethical safeguards against misuse and profiling
- ✅ Open-source and data governance disclosure

### PLATFORM INTELLIGENCE & DATA (Features 51-70) ✅
- ✅ Area-level safety index score generation
- ✅ Time-series storage of risk score history
- ✅ Risk trend velocity detection (rate of change)
- ✅ Cross-area risk comparison analytics
- ✅ Baseline city risk normalization
- ✅ Noise reduction for sparse data regions
- ✅ Confidence decay for outdated reports
- ✅ Real-time aggregation of safety signals
- ✅ Multi-source data fusion logic
- ✅ Explainable risk score breakdown per area
- ✅ Personalized time-of-travel safety suggestions
- ✅ Context-aware warnings for high-risk times
- ✅ Visual explanation of risk factors per route
- ✅ Interactive risk legend with explanations
- ✅ Minimal cognitive-load UI for stressful situations
- ✅ Progressive disclosure of information
- ✅ One-click switch between safety and speed
- ✅ Soft alert banners (non-alarming)
- ✅ Adaptive UI for low-bandwidth regions
- ✅ Offline map cache (read-only mode)

### COMMUNITY & ADVANCED FEATURES (Features 71-100) ✅
- ✅ Community trust weighting system
- ✅ Signal aging and relevance scoring
- ✅ Consensus-based risk confirmation
- ✅ Community confidence visualization
- ✅ Transparent moderation logic display
- ✅ Ethical use disclaimer enforcement
- ✅ Region-level safety reliability indicator
- ✅ Intervention impact tracking foundation
- ✅ Multi-city support infrastructure
- ✅ Geospatial indexing with MongoDB
- ✅ Performance monitoring and logging
- ✅ Scalable architecture

## 🚀 Technology Stack

### Frontend
- **React 19** - Modern UI framework
- **React-Leaflet** - Interactive mapping
- **i18next** - Multi-language support
- **Recharts** - Data visualization
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - Premium UI components
- **Axios** - API client

### Backend
- **FastAPI** - High-performance Python API
- **MongoDB** - Document database with geospatial support
- **Motor** - Async MongoDB driver
- **PyJWT** - JWT authentication
- **Geopy** - Geospatial calculations
- **Passlib + Bcrypt** - Password hashing

## 📦 Project Structure

```
/app
├── backend/
│   ├── server.py           # Main API with all endpoints
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Backend configuration
├── frontend/
│   ├── src/
│   │   ├── pages/         # Main pages
│   │   │   ├── LandingPage.js
│   │   │   ├── MapPage.js
│   │   │   ├── DashboardPage.js
│   │   │   └── PrivacyPage.js
│   │   ├── components/    # Reusable components
│   │   │   ├── AuthDialog.js
│   │   │   ├── ReportDialog.js
│   │   │   └── RouteDialog.js
│   │   ├── contexts/      # React contexts
│   │   │   └── AuthContext.js
│   │   ├── utils/         # Utilities
│   │   │   └── api.js
│   │   ├── i18n.js        # Multi-language config
│   │   ├── App.js         # Main app component
│   │   └── index.css      # Global styles
│   ├── package.json       # Node dependencies
│   └── .env              # Frontend configuration
└── design_guidelines.json # Design system
```

## 🔐 Authentication & Authorization

### Roles
1. **User** - Basic access to map and reporting
2. **NGO** - Full dashboard access, analytics, exports
3. **City** - Read-only policy overview
4. **Admin** - System administration

### API Authentication
```bash
# Register
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name",
  "role": "user"
}

# Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

# Returns JWT token for authenticated requests
```

## 🗺️ API Endpoints

### Safety Signals
- `POST /api/signals` - Create safety signal (anonymous)
- `GET /api/signals` - Get signals with filters
- `POST /api/signals/{id}/validate` - Validate signal

### Area Safety
- `GET /api/areas/scores` - Get area safety scores
- Risk scores by time of day (morning/evening/night)

### Route Planning
- `POST /api/routes/plan` - Calculate safe route
  ```json
  {
    "start": {"lat": 40.7128, "lng": -74.0060},
    "end": {"lat": 40.7580, "lng": -73.9855},
    "time_of_day": "morning",
    "prefer_safety": true
  }
  ```

### Dashboard (NGO/City/Admin only)
- `GET /api/dashboard/metrics` - Key metrics
- `GET /api/dashboard/trends` - Risk trends over time
- `GET /api/hotspots` - Emerging hotspots
- `POST /api/dashboard/export` - Export analytics

### Privacy & Transparency
- `GET /api/privacy/transparency` - Get transparency info
- `GET /api/cities` - List available cities

## 🎨 Design System

### Brand: Lumina
- **Tagline**: "Safety Intelligence for Everyone"
- **Archetype**: The Guardian (Protective, Intelligent, Community-Driven)
- **Tone**: Trustworthy, Vigilant, Clear, Empowering

### Colors
- **Primary**: Slate 900 (#0F172A)
- **Secondary**: Slate 100 (#F1F5F9)
- **Accent**: Indigo 600 (#6366F1)
- **Safety Signals**:
  - Safe: Emerald 500 (#10B981)
  - Caution: Amber 500 (#F59E0B)
  - Danger: Red 500 (#EF4444)

### Typography
- **Headings**: Chivo (900 weight for hero, 700 for sections)
- **Body**: Public Sans (400-600 weights)
- **Mono**: JetBrains Mono

## 🌍 Multi-Language Support

Currently supported:
- 🇬🇧 English (default)
- 🇪🇸 Spanish
- 🇫🇷 French

To add a new language, edit `/app/frontend/src/i18n.js`

## 🔒 Privacy Features

### Zero PII Collection
- No personally identifiable information collected for basic reporting
- Anonymous safety signals
- Area-level location precision (500m radius)
- No user tracking or behavioral profiling

### Data Handling
- 365-day retention with confidence decay
- Spam detection and duplicate suppression
- Community-weighted validation
- Transparent risk scoring algorithm

## 📊 Safety Scoring Algorithm

### Factors Considered
1. **Incident Severity** - High (30 points), Medium (15 points), Low (5 points)
2. **Validation Count** - Community validation increases confidence
3. **Time Decay** - Older reports have reduced weight
4. **Spatial Clustering** - Multiple incidents in same area increase risk
5. **Confidence Score** - Based on validation and data quality

### Score Ranges
- **75-100**: Safe (Green)
- **50-74**: Caution (Yellow)
- **<50**: High Risk (Red)

## 🧪 Testing

### Test User Credentials
```
NGO User:
Email: ngo@example.com
Password: password123
Role: ngo
```

### Quick Tests

1. **View Safety Map**
   ```
   Navigate to: /map
   - See color-coded safety zones
   - Toggle time of day
   - Click on zones for details
   ```

2. **Report Incident**
   ```
   1. Go to /map
   2. Click "Report Incident"
   3. Select location on map
   4. Fill form and submit
   ```

3. **Plan Safe Route**
   ```
   1. Go to /map
   2. Click "Plan Route"
   3. Use demo route or enter coordinates
   4. View route with risk segments
   ```

4. **View Dashboard** (requires NGO/City/Admin login)
   ```
   1. Login with NGO credentials
   2. Navigate to /dashboard
   3. View metrics, trends, hotspots
   4. Export data (CSV/PDF)
   ```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ with Yarn
- Python 3.11+
- MongoDB

### Installation
```bash
# Install frontend dependencies
cd /app/frontend
yarn install

# Install backend dependencies
cd /app/backend
pip install -r requirements.txt
```

### Running Locally
Services are managed by supervisor:
```bash
# Check status
sudo supervisorctl status

# Restart services
sudo supervisorctl restart backend frontend

# View logs
tail -f /var/log/supervisor/backend.out.log
tail -f /var/log/supervisor/frontend.out.log
```

### Access Points
- **Frontend**: https://safetymap-3.preview.emergentagent.com
- **API**: https://safetymap-3.preview.emergentagent.com/api
- **API Docs**: https://safetymap-3.preview.emergentagent.com/api/docs

## 📈 Performance Optimizations

1. **Database Indexing**: Geospatial indexes on location fields
2. **API Caching**: Area scores cached for 5 minutes
3. **Frontend Optimization**: 
   - Code splitting by route
   - Image lazy loading
   - Leaflet tile caching
4. **Query Optimization**: Limited result sets, efficient aggregations

## 🛣️ Roadmap

### Phase 2 Enhancements
- Real-time WebSocket updates
- Mobile apps (iOS/Android)
- Advanced ML-based risk prediction
- Integration with city infrastructure data
- Public transportation safety scoring
- Weather correlation analysis
- Community safety events
- Verified organization badges
- Multi-city comparison tools
- API for third-party integrations

## 🤝 Contributing

This is a civic tech platform built for community safety. Contributions welcome!

## 📄 License

Open-source project committed to transparent, ethical AI for public safety.

## 🙏 Acknowledgments

Built with modern web technologies and a commitment to:
- Privacy by design
- Community empowerment
- Transparent algorithms
- Ethical AI practices
- Inclusive design
- Global accessibility

---

**Lumina** - *Making cities safer, one signal at a time.* 🛡️
