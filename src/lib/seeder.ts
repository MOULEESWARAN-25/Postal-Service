import mongoose from 'mongoose';
import connectToDatabase from './mongoose';
import PostOffice from '../models/PostOffice';
import Demographics from '../models/Demographics';
import Citizen from '../models/Citizen';
import Scheme from '../models/Scheme';
import SchemePerformance from '../models/SchemePerformance';
import SchemeTimeline from '../models/SchemeTimeline';
import Enrollment from '../models/Enrollment';
import Event from '../models/Event';

const seedData = async () => {
  // Ensure the env is loaded (fallback if running directly via tsx)
  if (!process.env.MONGODB_URI) {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/postal_service';
  }

  console.log('Connecting to database...');
  await connectToDatabase();

  console.log('Cleaning existing collections...');
  await Promise.all([
    PostOffice.deleteMany({}),
    Demographics.deleteMany({}),
    Citizen.deleteMany({}),
    Scheme.deleteMany({}),
    SchemePerformance.deleteMany({}),
    SchemeTimeline.deleteMany({}),
    Enrollment.deleteMany({}),
    Event.deleteMany({}),
  ]);

  console.log('1. Seeding Post Office Hierarchy...');
  const postOfficesData = [
    {
      postOfficeCode: 'PO-SATHY-01',
      state: 'Tamil Nadu',
      district: 'Erode',
      headPostOffice: 'Erode HPO',
      postOffice: 'Sathyamangalam PO',
      pincode: '638401',
      villages: [
        { villageCode: 'VIL-SATHY-101', name: 'Arasur' },
        { villageCode: 'VIL-SATHY-102', name: 'Ayyampalayam' },
        { villageCode: 'VIL-SATHY-103', name: 'Bannari' },
        { villageCode: 'VIL-SATHY-104', name: 'Rajan Nagar' },
        { villageCode: 'VIL-SATHY-105', name: 'Pudupeerkadavu' },
        { villageCode: 'VIL-SATHY-106', name: 'Bhavanisagar' }
      ]
    },
    {
      postOfficeCode: 'PO-BHV-01',
      state: 'Tamil Nadu',
      district: 'Erode',
      headPostOffice: 'Bhavani HPO',
      postOffice: 'Bhavani PO',
      pincode: '638301',
      villages: [
        { villageCode: 'VIL-BHV-201', name: 'Bhavani Village A' },
        { villageCode: 'VIL-BHV-202', name: 'Bhavani Village B' },
        { villageCode: 'VIL-BHV-203', name: 'Komarapalayam' }
      ]
    },
    {
      postOfficeCode: 'PO-THNG-01',
      state: 'Tamil Nadu',
      district: 'Erode',
      headPostOffice: 'Erode HPO',
      postOffice: 'Thingalur PO',
      pincode: '638055',
      villages: [
        { villageCode: 'VIL-THNG-301', name: 'Thingalur Village' },
        { villageCode: 'VIL-THNG-302', name: 'Thoppampalayam' }
      ]
    }
  ];
  await PostOffice.insertMany(postOfficesData);

  console.log('2. Seeding Schemes...');
  const schemesData = [
    {
      schemeCode: 'POSA',
      name: 'Post Office Savings Account',
      description: 'A basic savings account offering safe returns and liquidity.',
      eligibilityCriteria: { minAge: 10, maxAge: 100, allowedGenders: ['Male', 'Female', 'Other'] },
      targetAudience: 'General public, rural and semi-urban populations',
      benefits: ['Low minimum balance of ₹500', 'Tax-free interest up to ₹10,000 per year', 'Safe government backing'],
      interestRate: 4.0
    },
    {
      schemeCode: 'RD',
      name: 'Recurring Deposit Scheme',
      description: 'Disciplined monthly savings scheme with guaranteed returns.',
      eligibilityCriteria: { minAge: 18, maxAge: 100, allowedGenders: ['Male', 'Female', 'Other'] },
      targetAudience: 'Salaried individuals, daily wage earners',
      benefits: ['Fixed monthly deposits starting from ₹100', '5-year maturity period', 'Loan facility up to 50% of balance'],
      interestRate: 6.7
    },
    {
      schemeCode: 'PPF',
      name: 'Public Provident Fund',
      description: 'Long-term tax saving and wealth accumulation scheme.',
      eligibilityCriteria: { minAge: 18, maxAge: 100, allowedGenders: ['Male', 'Female', 'Other'] },
      targetAudience: 'Taxpayers, self-employed professionals',
      benefits: ['Section 80C tax deduction', 'Completely tax-free interest and maturity', '15-year tenure lock-in'],
      interestRate: 7.1
    },
    {
      schemeCode: 'SSA',
      name: 'Sukanya Samriddhi Yojana',
      description: 'Savings scheme targeted exclusively for the welfare of the girl child.',
      eligibilityCriteria: { minAge: 0, maxAge: 10, allowedGenders: ['Female'] },
      targetAudience: 'Parents of girl children under 10',
      benefits: ['Highest interest rate among POSB schemes', 'Tax deduction under Section 80C', 'Matures on girl child reaching 21 years'],
      interestRate: 8.2
    },
    {
      schemeCode: 'SCSS',
      name: 'Senior Citizen Savings Scheme',
      description: 'Regular income scheme for seniors with sovereign security.',
      eligibilityCriteria: { minAge: 60, maxAge: 100, allowedGenders: ['Male', 'Female', 'Other'] },
      targetAudience: 'Retirees and senior citizens',
      benefits: ['Quarterly interest payout', 'Section 80C tax deduction', 'Maturity period of 5 years'],
      interestRate: 8.2
    },
    {
      schemeCode: 'KCC',
      name: 'Kisan Credit Card',
      description: 'Short-term credit for farmers to meet cultivation and maintenance needs.',
      eligibilityCriteria: { minAge: 18, maxAge: 75, allowedGenders: ['Male', 'Female', 'Other'], maxLandAcres: 50 },
      targetAudience: 'Farmers and agricultural landowners',
      benefits: ['Low-interest crop loans', 'Flexible repayment based on harvest cycle', 'Inbuilt crop insurance protection'],
      interestRate: 7.0
    }
  ];
  await Scheme.insertMany(schemesData);

  console.log('3. Seeding Scheme Timelines...');
  const timelinesData = [
    {
      schemeCode: 'PPF',
      type: 'financial',
      timeRange: 'March',
      description: 'End of financial year tax-saving investments under Sec 80C.'
    },
    {
      schemeCode: 'SCSS',
      type: 'financial',
      timeRange: 'April',
      description: 'New financial year start. Seniors reinvesting retirement benefits.'
    },
    {
      schemeCode: 'KCC',
      type: 'farming',
      timeRange: 'June-July',
      description: 'Kharif crop sowing season. Farmers require credit for seed and fertilizer purchases.'
    },
    {
      schemeCode: 'KCC',
      type: 'farming',
      timeRange: 'October-November',
      description: 'Rabi crop sowing season. High demand for agricultural credit.'
    },
    {
      schemeCode: 'SSA',
      type: 'seasonal',
      timeRange: 'June',
      description: 'School admission period. Parents planning girl children education expenses.'
    },
    {
      schemeCode: 'POSA',
      type: 'festive',
      timeRange: 'October-November',
      description: 'Diwali festival season. High public gatherings and household cash movement.'
    }
  ];
  await SchemeTimeline.insertMany(timelinesData);

  console.log('4. Seeding Demographics (Multi-Level Rollups & Trends)...');
  const demographicsData = [
    // Village-level demographics (Bhavani Village A)
    {
      regionCode: 'VIL-BHV-201',
      regionType: 'village',
      snapshotDate: new Date(),
      totalPopulation: 2500,
      totalSchemeEnrollments: 820,
      literacyRate: { literate: 1800, illiterate: 700 },
      genderDistribution: { male: 1220, female: 1280, other: 0 },
      occupationDistribution: { agriculture: 1100, salaried: 300, selfEmployed: 500, unemployed: 600 },
      incomeDistribution: { low: 1500, medium: 800, high: 200 },
      workTypeDistribution: { mainWorkers: 1500, marginalWorkers: 400, nonWorkers: 600 },
      ageGenderDistribution: [
        { ageRange: '0-10', maleCount: 150, femaleCount: 170 },
        { ageRange: '11-18', maleCount: 200, femaleCount: 190 },
        { ageRange: '19-60', maleCount: 700, femaleCount: 720 },
        { ageRange: '60+', maleCount: 170, femaleCount: 200 }
      ]
    },
    // Post Office level demographics (Bhavani PO)
    {
      regionCode: 'PO-BHV-01',
      regionType: 'postoffice',
      snapshotDate: new Date(),
      totalPopulation: 15000,
      totalSchemeEnrollments: 4500,
      literacyRate: { literate: 11500, illiterate: 3500 },
      genderDistribution: { male: 7400, female: 7600, other: 0 },
      occupationDistribution: { agriculture: 5200, salaried: 3100, selfEmployed: 3700, unemployed: 3000 },
      incomeDistribution: { low: 8000, medium: 5200, high: 1800 },
      workTypeDistribution: { mainWorkers: 9500, marginalWorkers: 2500, nonWorkers: 3000 },
      ageGenderDistribution: [
        { ageRange: '0-10', maleCount: 950, femaleCount: 970 },
        { ageRange: '11-18', maleCount: 1200, femaleCount: 1150 },
        { ageRange: '19-60', maleCount: 4250, femaleCount: 4300 },
        { ageRange: '60+', maleCount: 1000, femaleCount: 1180 }
      ]
    },
    // District level demographics (Erode)
    {
      regionCode: 'Erode',
      regionType: 'district',
      snapshotDate: new Date(),
      totalPopulation: 2250000,
      totalSchemeEnrollments: 680000,
      literacyRate: { literate: 1720000, illiterate: 530000 },
      genderDistribution: { male: 1115000, female: 1135000, other: 0 },
      occupationDistribution: { agriculture: 850000, salaried: 540000, selfEmployed: 420000, unemployed: 440000 },
      incomeDistribution: { low: 1150000, medium: 810000, high: 290000 },
      workTypeDistribution: { mainWorkers: 1390000, marginalWorkers: 380000, nonWorkers: 480000 },
      ageGenderDistribution: [
        { ageRange: '0-10', maleCount: 145000, femaleCount: 152000 },
        { ageRange: '11-18', maleCount: 195000, femaleCount: 188000 },
        { ageRange: '19-60', maleCount: 615000, femaleCount: 620000 },
        { ageRange: '60+', maleCount: 160000, femaleCount: 175000 }
      ]
    },
    // State level demographics (Tamil Nadu)
    {
      regionCode: 'Tamil Nadu',
      regionType: 'state',
      snapshotDate: new Date(),
      totalPopulation: 72147000,
      totalSchemeEnrollments: 22500000,
      literacyRate: { literate: 58000000, illiterate: 14147000 },
      genderDistribution: { male: 36137000, female: 36010000, other: 0 },
      occupationDistribution: { agriculture: 25000000, salaried: 18000000, selfEmployed: 16000000, unemployed: 13147000 },
      incomeDistribution: { low: 35000000, medium: 26000000, high: 11147000 },
      workTypeDistribution: { mainWorkers: 42000000, marginalWorkers: 11000000, nonWorkers: 19147000 },
      ageGenderDistribution: [
        { ageRange: '0-10', maleCount: 4500000, femaleCount: 4600000 },
        { ageRange: '11-18', maleCount: 5800000, femaleCount: 5700000 },
        { ageRange: '19-60', maleCount: 20200000, femaleCount: 20100000 },
        { ageRange: '60+', maleCount: 5637000, femaleCount: 5610000 }
      ]
    }
  ];
  await Demographics.insertMany(demographicsData);

  console.log('5. Seeding Citizens (Sample profiles with initial recommendations)...');
  const citizensData = [
    {
      aadhaarId: '123456789012',
      name: 'Muthusamy K',
      age: 64,
      gender: 'Male',
      numberOfChildren: 2,
      numberOfGirlChildrenUnder10: 0,
      education: 'Secondary',
      occupation: 'Agriculture',
      maritalStatus: 'Married',
      landOwnershipAcres: 4.5,
      digitalUsage: 'Low' as const,
      annualIncome: 95000,
      villageCode: 'VIL-BHV-201',
      postOfficeCode: 'PO-BHV-01',
      phoneNumber: '9876543210',
      recommendations: {
        topSchemes: [
          { schemeCode: 'SCSS', name: 'Senior Citizen Savings Scheme', confidence: 0.95, reason: 'Age is 60+ (retiree / senior)' },
          { schemeCode: 'KCC', name: 'Kisan Credit Card', confidence: 0.88, reason: 'Owns 4.5 acres of agricultural land' },
          { schemeCode: 'POSA', name: 'Post Office Savings Account', confidence: 0.80, reason: 'General safe savings account' }
        ],
        generatedAt: new Date()
      }
    },
    {
      aadhaarId: '987654321098',
      name: 'Anjali Devi',
      age: 32,
      gender: 'Female',
      numberOfChildren: 2,
      numberOfGirlChildrenUnder10: 2,
      education: 'Graduate',
      occupation: 'Salaried',
      maritalStatus: 'Married',
      landOwnershipAcres: 0,
      digitalUsage: 'High' as const,
      annualIncome: 350000,
      villageCode: 'VIL-SATHY-101',
      postOfficeCode: 'PO-SATHY-01',
      phoneNumber: '9944332211',
      recommendations: {
        topSchemes: [
          { schemeCode: 'SSA', name: 'Sukanya Samriddhi Yojana', confidence: 0.99, reason: 'Has 2 girl children under the age of 10' },
          { schemeCode: 'PPF', name: 'Public Provident Fund', confidence: 0.85, reason: 'Stable salaried income with tax saving needs' },
          { schemeCode: 'RD', name: 'Recurring Deposit Scheme', confidence: 0.78, reason: 'High digital usage, steady monthly savings candidate' }
        ],
        generatedAt: new Date()
      }
    }
  ];
  await Citizen.insertMany(citizensData);

  console.log('6. Seeding Scheme Performance Metrics...');
  const performanceData = [
    {
      regionCode: 'PO-BHV-01',
      regionType: 'postoffice' as const,
      schemeCode: 'SSA',
      activeEnrollments: 280,
      targetEnrollments: 300,
      successRate: 93.3,
      adoptionTrend: [
        { month: '2026-03', count: 250 },
        { month: '2026-04', count: 265 },
        { month: '2026-05', count: 280 }
      ]
    },
    {
      regionCode: 'PO-BHV-01',
      regionType: 'postoffice' as const,
      schemeCode: 'KCC',
      activeEnrollments: 180,
      targetEnrollments: 250,
      successRate: 72.0,
      adoptionTrend: [
        { month: '2026-03', count: 160 },
        { month: '2026-04', count: 170 },
        { month: '2026-05', count: 180 }
      ]
    }
  ];
  await SchemePerformance.insertMany(performanceData);

  console.log('7. Seeding Events...');
  const eventsData = [
    {
      eventName: 'Bhavani Kooduthurai Mela',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      location: 'Bhavani Kooduthurai Temple Grounds',
      eventType: 'Festival' as const,
      description: 'Major gathering of local residents for ritual bath. Perfect time to promote general savings and APY.',
      villageCode: 'VIL-BHV-201',
      postOfficeCode: 'PO-BHV-01',
      district: 'Erode',
      scrapedSource: 'District Admin Calendar'
    },
    {
      eventName: 'Sathyamangalam Farmers Co-op Meet',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      location: 'Sathy Agricultural Market Committee',
      eventType: 'Community Event' as const,
      description: 'Weekly meeting of cotton and sugarcane cultivators. Ideal for KCC campaign setup.',
      villageCode: 'VIL-SATHY-101',
      postOfficeCode: 'PO-SATHY-01',
      district: 'Erode',
      scrapedSource: 'Erode Agri Portal'
    }
  ];
  await Event.insertMany(eventsData);

  console.log('Database Seeding Completed Successfully! 🌱');
  mongoose.connection.close();
};

seedData().catch((err) => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
