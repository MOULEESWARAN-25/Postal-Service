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
    // 1. Traditional POSB Schemes
    {
      schemeCode: 'SB',
      name: 'Post Office Savings Account (SB)',
      description: 'A basic savings account offering safe returns, liquidity, and a gateway to government benefits.',
      eligibilityCriteria: { minAge: 10, maxAge: 100, allowedGenders: ['Male', 'Female', 'Other'] },
      targetAudience: 'General public, rural and semi-urban populations',
      benefits: ['Low minimum balance of ₹500', 'Tax-free interest up to ₹10,000 per year', 'Safe government backing', 'Mandatory nomination support'],
      interestRate: 4.0
    },
    {
      schemeCode: 'RD',
      name: 'National Savings Recurring Deposit (RD)',
      description: 'Disciplined monthly savings scheme with guaranteed compound returns over 5 years.',
      eligibilityCriteria: { minAge: 10, maxAge: 100, allowedGenders: ['Male', 'Female', 'Other'] },
      targetAudience: 'Salaried individuals, daily wage earners',
      benefits: ['Fixed monthly deposits starting from ₹100', '5-year maturity period', 'Loan facility up to 50% of balance after 1 year'],
      interestRate: 6.7
    },
    {
      schemeCode: 'TD',
      name: 'National Savings Time Deposit (TD)',
      description: 'Fixed term deposit scheme offering secure high-yield returns for 1 to 5 year tenures.',
      eligibilityCriteria: { minAge: 10, maxAge: 100, allowedGenders: ['Male', 'Female', 'Other'] },
      targetAudience: 'Savers, salaried individuals',
      benefits: ['Tenure options from 1 to 5 years', 'Section 80C tax benefits for 5-year deposits', 'Quarterly compounding payouts'],
      interestRate: 7.5
    },
    {
      schemeCode: 'MIS',
      name: 'Monthly Income Scheme (MIS)',
      description: 'Provides a secure monthly interest payout on lump-sum capital investments.',
      eligibilityCriteria: { minAge: 10, maxAge: 100, allowedGenders: ['Male', 'Female', 'Other'] },
      targetAudience: 'Retirees, senior citizens seeking regular payouts',
      benefits: ['Monthly interest payout to linked savings account', 'Sovereign capital protection', 'Maximum deposit limit of ₹9 Lakh for single accounts'],
      interestRate: 7.4
    },
    {
      schemeCode: 'PPF',
      name: 'Public Provident Fund (PPF)',
      description: 'Long-term tax-exempt wealth accumulation and retirement savings asset.',
      eligibilityCriteria: { minAge: 18, maxAge: 100, allowedGenders: ['Male', 'Female', 'Other'] },
      targetAudience: 'Taxpayers, self-employed professionals',
      benefits: ['EEE tax status (exempt on contribution, interest, and maturity)', 'Section 80C deduction benefits', 'Sovereign protection with a 15-year tenure'],
      interestRate: 7.1
    },
    {
      schemeCode: 'SCSS',
      name: 'Senior Citizens Savings Scheme (SCSS)',
      description: 'Regular high-yield income scheme for retired senior citizens.',
      eligibilityCriteria: { minAge: 60, maxAge: 100, allowedGenders: ['Male', 'Female', 'Other'] },
      targetAudience: 'Retirees aged 60+ (or retired civilian employees aged 55-60)',
      benefits: ['Attractive quarterly interest yield', 'Sovereign capital security', 'Section 80C tax deduction benefits'],
      interestRate: 8.2
    },
    {
      schemeCode: 'SSA',
      name: 'Sukanya Samriddhi Account (SSA)',
      description: 'Dedicated high-yield savings scheme for the education and marriage of a girl child.',
      eligibilityCriteria: { minAge: 0, maxAge: 10, allowedGenders: ['Female'] },
      targetAudience: 'Parents/guardians of girl children under 10 years',
      benefits: ['Highest interest rate among POSB schemes', 'Tax exemptions under Section 80C', 'Matures on girl child reaching 21 years of age'],
      interestRate: 8.2
    },
    {
      schemeCode: 'NSC',
      name: 'National Savings Certificate (NSC)',
      description: 'Low-risk 5-year fixed return certificate popular for tax saving.',
      eligibilityCriteria: { minAge: 10, maxAge: 100, allowedGenders: ['Male', 'Female', 'Other'] },
      targetAudience: 'Middle-class savers, taxpayers',
      benefits: ['Guaranteed 5-year returns', 'Section 80C tax deduction', 'Collateral capability to secure bank credit'],
      interestRate: 7.7
    },
    {
      schemeCode: 'KVP',
      name: 'Kisan Vikas Patra (KVP)',
      description: 'Sovereign certificate scheme that doubles the principal investment over a fixed period.',
      eligibilityCriteria: { minAge: 10, maxAge: 100, allowedGenders: ['Male', 'Female', 'Other'] },
      targetAudience: 'Farmers, rural populations, risk-averse investors',
      benefits: ['Doubles capital investment deterministically', 'Zero market risk', 'Easy transferability and nomination facilities'],
      interestRate: 7.5
    },
    {
      schemeCode: 'MSSC',
      name: 'Mahila Samman Savings Certificate (MSSC)',
      description: 'Short-term savings scheme empowering women with high fixed interest.',
      eligibilityCriteria: { minAge: 0, maxAge: 100, allowedGenders: ['Female'] },
      targetAudience: 'Women of all ages, guardians of minor girls',
      benefits: ['High fixed interest rate of 7.5%', '2-year short tenure limit', 'Flexible partial withdrawal option (up to 40%)'],
      interestRate: 7.5
    },
    {
      schemeCode: 'PMCARES',
      name: 'PM CARES for Children Scheme',
      description: 'Comprehensive welfare and financial scheme for children orphaned by the COVID-19 pandemic.',
      eligibilityCriteria: { minAge: 0, maxAge: 18, allowedGenders: ['Male', 'Female', 'Other'] },
      targetAudience: 'Minors orphaned during the COVID-19 pandemic',
      benefits: ['Comprehensive educational stipend support', 'Free health insurance under PM-JAY', 'Lump sum corpus and monthly payout at age 23'],
      interestRate: 7.3
    },
    // 2. India Post Payments Bank (IPPB) Accounts
    {
      schemeCode: 'IPPB_REG',
      name: 'Regular Savings Account',
      description: 'Digital-first payments account focusing on day-to-day transactions and doorstep banking.',
      eligibilityCriteria: { minAge: 10, maxAge: 100, allowedGenders: ['Male', 'Female', 'Other'] },
      targetAudience: 'Mobile users, rural and semi-urban populations',
      benefits: ['Instant onboarding via Aadhaar & PAN KYC', 'Direct utility and merchant payment integration', 'Accidental insurance and sweep options'],
      interestRate: 2.0
    },
    {
      schemeCode: 'IPPB_BAS',
      name: 'Basic Savings Account',
      description: 'Zero-minimum balance digital account with limits on monthly cash withdrawals.',
      eligibilityCriteria: { minAge: 10, maxAge: 100, allowedGenders: ['Male', 'Female', 'Other'] },
      targetAudience: 'Low-income earners, DBT subsidy recipients',
      benefits: ['No minimum balance required', 'Primary link for DBT subsidy sweeps', 'Free cash withdrawals up to four times per month'],
      interestRate: 2.0
    },
    {
      schemeCode: 'IPPB_DIGI',
      name: 'DigiSmart Savings Account',
      description: 'App-based mobile transaction account offering merchant cashbacks and discounts.',
      eligibilityCriteria: { minAge: 18, maxAge: 100, allowedGenders: ['Male', 'Female', 'Other'] },
      targetAudience: 'Tech-savvy youth, online shoppers',
      benefits: ['Onboarding via IPPB Mobile App', 'Attractive merchant discounts and virtual debit cards', 'Instant sweep options'],
      interestRate: 2.0
    },
    {
      schemeCode: 'IPPB_PREM',
      name: 'Premium Savings Account',
      description: 'Value-added transactional account offering premium cashbacks and zero fee services.',
      eligibilityCriteria: { minAge: 10, maxAge: 100, allowedGenders: ['Male', 'Female', 'Other'] },
      targetAudience: 'Regular digital banking users',
      benefits: ['Cashbacks on merchant transactions', 'Free virtual debit cards', 'No charges on sweep operations or doorstep deposits'],
      interestRate: 2.5
    },
    {
      schemeCode: 'IPPB_AAR',
      name: 'Premium Aarogya Savings Account',
      description: 'Transactional account that bundles banking services with online healthcare benefits.',
      eligibilityCriteria: { minAge: 10, maxAge: 100, allowedGenders: ['Male', 'Female', 'Other'] },
      targetAudience: 'Health-conscious families, seniors',
      benefits: ['Bundled telehealth online doctor consultations', 'Discounts on diagnostics and pharmacy purchases', 'Inbuilt accidental insurance cover'],
      interestRate: 2.5
    },
    {
      schemeCode: 'IPPB_SHG',
      name: 'SHG Savings Account',
      description: 'Group savings account designed for Self-Help Groups to manage collective finance.',
      eligibilityCriteria: { minAge: 18, maxAge: 100, allowedGenders: ['Male', 'Female', 'Other'] },
      targetAudience: 'Registered Self-Help Groups (SHGs) and rural entrepreneurs',
      benefits: ['Supports group micro-finance and joint savings', 'Direct linkage to government agricultural credit', 'Easy disbursement rules'],
      interestRate: 2.0
    },
    {
      schemeCode: 'IPPB_CURR',
      name: 'Current Account',
      description: 'Transactional account tailored for small merchants and self-employed entities.',
      eligibilityCriteria: { minAge: 18, maxAge: 100, allowedGenders: ['Male', 'Female', 'Other'] },
      targetAudience: 'Small merchants, retail store owners, self-employed traders',
      benefits: ['Unlimited cash transactions and daily deposits', 'Merchant QR payment integrations', 'Nomination and doorstep support options'],
      interestRate: 0.0
    },
    // 3. Third-Party Government Schemes (Facilitated via IPPB)
    {
      schemeCode: 'PMJJBY',
      name: 'Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)',
      description: 'Term life insurance policy offering security for active earning members of households.',
      eligibilityCriteria: { minAge: 18, maxAge: 50, allowedGenders: ['Male', 'Female', 'Other'] },
      targetAudience: 'Working adults aged 18 to 50 years',
      benefits: ['₹2 Lakh term life insurance cover', 'Extremely low premium of ₹436 per year', 'Auto-debit setup from linked savings accounts'],
      interestRate: 0.0
    },
    {
      schemeCode: 'PMSBY',
      name: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY)',
      description: 'Extremely affordable accident and disability insurance cover.',
      eligibilityCriteria: { minAge: 18, maxAge: 70, allowedGenders: ['Male', 'Female', 'Other'] },
      targetAudience: 'Adults aged 18 to 70 years',
      benefits: ['₹2 Lakh cover for accidental death or total disability', '₹1 Lakh cover for partial disability', 'Ultra low premium of only ₹20 per year'],
      interestRate: 0.0
    },
    {
      schemeCode: 'APY',
      name: 'Atal Pension Yojana (APY)',
      description: 'Guaranteed pension scheme targeting workers in the unorganized sector.',
      eligibilityCriteria: { minAge: 18, maxAge: 40, allowedGenders: ['Male', 'Female', 'Other'] },
      targetAudience: 'Unorganized sector workers aged 18 to 40 years',
      benefits: ['Guaranteed lifetime monthly pension of ₹1000 - ₹5000', 'Spouse pension transfer on death', 'Co-contribution option from government'],
      interestRate: 0.0
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
      schemeCode: 'KVP',
      type: 'farming',
      timeRange: 'June-July',
      description: 'Kharif crop sowing season. Farmers invest post-harvest income into secure capital doubling certificates.'
    },
    {
      schemeCode: 'KVP',
      type: 'farming',
      timeRange: 'October-November',
      description: 'Rabi crop sowing season. High demand for agricultural savings opportunities.'
    },
    {
      schemeCode: 'SSA',
      type: 'seasonal',
      timeRange: 'June',
      description: 'School admission period. Parents planning girl children education expenses.'
    },
    {
      schemeCode: 'SB',
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
          { schemeCode: 'SCSS', name: 'Senior Citizens Savings Scheme (SCSS)', confidence: 0.95, reason: 'Age is 60+ (retiree / senior)' },
          { schemeCode: 'KVP', name: 'Kisan Vikas Patra (KVP)', confidence: 0.88, reason: 'Owns 4.5 acres of agricultural land' },
          { schemeCode: 'SB', name: 'Post Office Savings Account (SB)', confidence: 0.80, reason: 'General safe savings account' }
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
          { schemeCode: 'SSA', name: 'Sukanya Samriddhi Account (SSA)', confidence: 0.99, reason: 'Has 2 girl children under the age of 10' },
          { schemeCode: 'PPF', name: 'Public Provident Fund (PPF)', confidence: 0.85, reason: 'Stable salaried income with tax saving needs' },
          { schemeCode: 'RD', name: 'National Savings Recurring Deposit (RD)', confidence: 0.78, reason: 'High digital usage, steady monthly savings candidate' }
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
      schemeCode: 'KVP',
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
      description: 'Major gathering of local residents for ritual bath. Perfect time to promote general savings (SB) and APY.',
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
      description: 'Weekly meeting of cotton and sugarcane cultivators. Ideal for KVP savings promotion.',
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
