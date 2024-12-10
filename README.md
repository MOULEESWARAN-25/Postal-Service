# 🚀 GlobalXport Management System

<div align="center">
  
![Next.js](https://img.shields.io/badge/Next.js-15.0.3-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.7-38B2AC?style=for-the-badge&logo=tailwind-css)
![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud)

[Live Demo](https://amazon-smbhav-git-main-dineshdinz12s-projects.vercel.app/) | [Documentation](#documentation) | [Features](#features)

</div>

## 📖 Overview

Our Export Management System is a comprehensive solution designed to streamline international export operations. Built with cutting-edge technologies, it addresses key challenges in the export process including carrier management, documentation compliance, and real-time shipment tracking.

### 🎯 Key Challenges Addressed
- Coordination with multiple shipping carriers
- Rate negotiation and optimization
- International compliance and documentation
- Real-time shipment tracking
- Query resolution and issue management

## 📸 Application Screenshots

<div align="center">

### Dashboard products page
<img src="./public/1.jpg" alt="Dashboard Overview" style="max-width: 800px; margin: 20px 0; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

### Logistics Suggestions
<img src="./public/2.jpg" alt="Shipment Tracking" style="max-width: 800px; margin: 20px 0; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

### Demand Suggetions
<img src="./public/3.jpg" alt="Analytics Dashboard" style="max-width: 800px; margin: 20px 0; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

### Document Management & Risk Analyzer
<img src="./public/4.jpg" alt="Document Management" style="max-width: 800px; margin: 20px 0; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

### Logistic partners list
<img src="./public/5.jpg" alt="Carrier Integration" style="max-width: 800px; margin: 20px 0; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">



</div>

## 🛠️ Tech Stack

### Core Technologies
- **Next.js (v15.0.3)**
  - Server-side rendering for real-time tracking updates
  - API routes for carrier integration
  - Dynamic routing for shipment management
  - Built-in performance optimization

- **React (v18.2.0)**
  - Interactive dashboards for shipment tracking
  - Real-time status updates
  - Custom hooks for data management
  - Context API for state management

### UI/UX
- **Tailwind CSS (v3.4.7)**
  - Responsive dashboards
  - Interactive tracking interfaces
  - Document management UI
  - Mobile-first design

### Data Visualization
- **Recharts (v2.13.3)**
  - Shipment analytics
  - Cost comparison charts
  - Performance metrics
  - Carrier analysis

### AI Integration
- **Google Generative AI**
  - Document validation
  - Compliance checking
  - Rate optimization
  
- **Gemini Flash 1.5**
  - Predictive analytics for delays
  - Route optimization
  - Cost forecasting

### Database
- **MySQL2 (v3.11.4)**
  - Shipment tracking
  - Document management
  - Carrier information
  - Compliance data

## ✨ Features

### 🚢 Carrier Management
```jsx
// components/CarrierDashboard.js
const CarrierDashboard = () => {
  const { carriers, rates } = useCarrierData();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <CarrierList carriers={carriers} />
      <RateComparison rates={rates} />
      <PerformanceMetrics carriers={carriers} />
    </div>
  );
};
```

### 📊 Analytics Dashboard
```jsx
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const ShipmentAnalytics = ({ data }) => (
  <LineChart width={600} height={300} data={data}>
    <Line type="monotone" dataKey="shipmentVolume" stroke="#8884d8" />
    <Line type="monotone" dataKey="onTimeDelivery" stroke="#82ca9d" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
  </LineChart>
);
```

### 📄 Document Management
```javascript
// lib/document-services.js
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function validateExportDocuments(documents) {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const validation = await model.validateCompliance(documents);
  return validation.results;
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16.x or above)
- npm/yarn/pnpm
- Google Cloud account
- MySQL database

### Installation
```bash
git clone https://github.com/dineshdinz12/AmazonSmbhav.git
cd AmazonSmbhav
npm install
```

### Environment Setup
```bash
# .env.local
NEXT_PUBLIC_GEMINI_API_KEY=google_ai_API
MYSQL_PASSWORD=Avien_cloude_sqlDB_PASSWORD
MYSQL_PORT=Avien_cloude_sqlDB_PORT
MYSQL_USER=Avien_cloude_sqlDB_USER
MYSQL_HOST=mysql-ID-USERNAME.b.aivencloud.com #example
MYSQL_DATABASE=globalxport

```

## 📚 Project Structure
```
export-management/
├── public/
│   └── images/
│
├── src/
│   ├── app/
│   │   ├── analytics/                 # Analytics dashboard
│   │   ├── api/                       # API routes with SQL integration
│   │   ├── compliance/                # Compliance management
│   │   ├── components/                # Shared UI components
│   │   ├── dashboard/                 # Main dashboard views
│   │   ├── demand-forecasting/        # Demand prediction system
│   │   ├── documents/                 # Document management
│   │   ├── fonts/                     # Custom font assets
│   │   ├── login/                     # Authentication system
│   │   ├── logistic-suggestions/      # Logistics optimization
│   │   ├── orders/                    # Order management
│   │   ├── products/                  # Product catalog
│   │   ├── query-resolver/            # Query handling system
│   │   ├── sales/                     # Sales management
│   │   ├── settings/                  # Application settings
│   │   ├── tracking/                  # Shipment tracking
│   │   ├── users/                     # User management
│   │   │
│   │   ├── favicon.ico               # Application favicon
│   │   ├── globals.css               # Global styles
│   │   ├── layout.js                 # Root layout component
│   │   └── page.js                   # Root page component
│   │
│   ├── components/                    # Reusable components
│   │   ├── carriers/                 # Carrier-related components
│   │   ├── tracking/                 # Tracking components
│   │   └── compliance/               # Compliance components
│   │
│   └── lib/                          # Utility functions
│       ├── carrier-services.js       # Carrier integration services
│       └── document-validation.js    # Document validation utilities
│
└── README.md                         # Project documentation
```

## 🌐 Deployment

Optimized for deployment on Vercel:
1. Push code to GitHub
2. Connect to Vercel
3. Configure environment variables
4. Deploy!

## 🤝 Contributing

We welcome contributions! See [Contributing Guide](CONTRIBUTING.md).

## 🔗 Useful Links
- [API Documentation](docs/api.md)
- [Carrier Integration Guide](docs/carriers.md)
- [Compliance Documentation](docs/compliance.md)

---

<div align="center">
  
Made with ❤️ by INNOVISION

Contributors: <a href="https://github.com/girish-gaikwad">Girish</a> , <a href="https://github.com/dineshdinz12">Dinesh R</a> and <a href="https://github.com/MOHITH2511">Mohit</a>

</div>

**Live**:https://amazon-smbhav-git-main-girish-gaikwad-projects.vercel.app/
