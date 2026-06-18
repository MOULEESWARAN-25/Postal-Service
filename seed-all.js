const mongoose = require('mongoose');
const fs = require('fs');

if (fs.existsSync('.env.local')) {
  const envFile = fs.readFileSync('.env.local', 'utf-8');
  envFile.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length > 1) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/(^['"]|['"]$)/g, '');
      process.env[key] = val;
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/postal_service';

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected.');

  const db = mongoose.connection.db;

  // Define schemas inline
  const villageSchema = new mongoose.Schema({}, { strict: false });
  const DemographicsTamilNadu = mongoose.models.DemographicsTamilNadu || mongoose.model('DemographicsTamilNadu', villageSchema, 'demographic_tamilnadu');

  const PersonalInfoSchema = new mongoose.Schema({}, { strict: false });
  const PersonalInfo = mongoose.models.PersonalInfo || mongoose.model('PersonalInfo', PersonalInfoSchema, 'personal_info');

  const CropSubDistrictSchema = new mongoose.Schema({}, { strict: false });
  const CropSubDistrict = mongoose.models.CropSubDistrict || mongoose.model('CropSubDistrict', CropSubDistrictSchema, 'cropsubdistricts');

  const CropTimingSchema = new mongoose.Schema({}, { strict: false });
  const CropTiming = mongoose.models.CropTiming || mongoose.model('CropTiming', CropTimingSchema, 'croptimings');

  const EventSchema = new mongoose.Schema({
    eventName: String,
    date: Date,
    location: String,
    eventType: String,
    description: String,
    villageCode: String,
    postOfficeCode: String,
    district: String,
    scrapedSource: String,
    expectedCrowd: String,
    suggestedSchemes: String,
    status: { type: String, default: 'Planned' },
    attendees: { type: Number, default: 0 },
    enrollments: { type: Number, default: 0 }
  }, { collection: 'events' });
  const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);

  const CampaignRecommendationSchema = new mongoose.Schema({}, { strict: false });
  const CampaignRecommendation = mongoose.models.CampaignRecommendation || mongoose.model('CampaignRecommendation', CampaignRecommendationSchema, 'campaign_recommendations');

  const CampaignFeedbackSchema = new mongoose.Schema({}, { strict: false });
  const CampaignFeedback = mongoose.models.CampaignFeedback || mongoose.model('CampaignFeedback', CampaignFeedbackSchema, 'campaign_feedback');

  const EnrollmentSchema = new mongoose.Schema({
    citizenAadhaar: String,
    schemeCode: String,
    status: { type: String, enum: ['Enrolled', 'Not Enrolled', 'Pending'] },
    enrollmentDate: Date,
    village: String,
    campaignId: String
  }, { collection: 'enrollments' });
  const Enrollment = mongoose.models.Enrollment || mongoose.model('Enrollment', EnrollmentSchema);

  const SchemeSchema = new mongoose.Schema({}, { strict: false });
  const Scheme = mongoose.models.Scheme || mongoose.model('Scheme', SchemeSchema, 'schemes');

  const PostOfficeSchema = new mongoose.Schema({}, { strict: false });
  const PostOffice = mongoose.models.PostOffice || mongoose.model('PostOffice', PostOfficeSchema, 'postoffices');

  const DemographicsSchema = new mongoose.Schema({}, { strict: false });
  const Demographics = mongoose.models.Demographics || mongoose.model('Demographics', DemographicsSchema, 'demographics');

  console.log('Cleaning collections...');
  await Promise.all([
    DemographicsTamilNadu.deleteMany({}),
    PersonalInfo.deleteMany({}),
    CropSubDistrict.deleteMany({}),
    CropTiming.deleteMany({}),
    Event.deleteMany({}),
    CampaignRecommendation.deleteMany({}),
    CampaignFeedback.deleteMany({}),
    Enrollment.deleteMany({}),
    Scheme.deleteMany({}),
    PostOffice.deleteMany({}),
    Demographics.deleteMany({})
  ]);

  console.log('Seeding demographic_tamilnadu...');
  // Helper to generate full Census PCA data for villages, sub-postoffices, districts, state, and INDIA
  const baseIndiaTotal = {
    totP: 1210854977, totM: 623270258, totF: 587584719,
    mLit: 82.1, mIll: 17.9, fLit: 65.5, fIll: 34.5,
    totWorkP: 481608000, totWorkM: 331808000, totWorkF: 149800000,
    nonWorkM: 291462000, nonWorkF: 437784000,
    mainworkP: 362400000, mainClP: 95800000, mainAlP: 82700000, mainHhP: 13200000, mainOtP: 170700000,
    margworkP: 119200000, margClP: 22000000, margAlP: 61800000, margHhP: 3800000, margOtP: 31600000,
    noHh: 249253000, population717: 230000000, population1824: 140000000,
    population2540: 310000000, population4060: 250000000, population60Plus: 104000000
  };

  const createLocationPCA = (name, district, subDistrict, tru, pRatio) => ({
    name,
    district,
    subDistrict,
    tru,
    totP: Math.round(baseIndiaTotal.totP * pRatio),
    totM: Math.round(baseIndiaTotal.totM * pRatio),
    totF: Math.round(baseIndiaTotal.totF * pRatio),
    mLit: baseIndiaTotal.mLit,
    mIll: baseIndiaTotal.mIll,
    fLit: baseIndiaTotal.fLit,
    fIll: baseIndiaTotal.fIll,
    totWorkP: Math.round(baseIndiaTotal.totWorkP * pRatio),
    totWorkM: Math.round(baseIndiaTotal.totWorkM * pRatio),
    totWorkF: Math.round(baseIndiaTotal.totWorkF * pRatio),
    nonWorkM: Math.round(baseIndiaTotal.nonWorkM * pRatio),
    nonWorkF: Math.round(baseIndiaTotal.nonWorkF * pRatio),
    mainworkP: Math.round(baseIndiaTotal.mainworkP * pRatio),
    mainClP: Math.round(baseIndiaTotal.mainClP * pRatio),
    mainAlP: Math.round(baseIndiaTotal.mainAlP * pRatio),
    mainHhP: Math.round(baseIndiaTotal.mainHhP * pRatio),
    mainOtP: Math.round(baseIndiaTotal.mainOtP * pRatio),
    margworkP: Math.round(baseIndiaTotal.margworkP * pRatio),
    margClP: Math.round(baseIndiaTotal.margClP * pRatio),
    margAlP: Math.round(baseIndiaTotal.margAlP * pRatio),
    margHhP: Math.round(baseIndiaTotal.margHhP * pRatio),
    margOtP: Math.round(baseIndiaTotal.margOtP * pRatio),
    noHh: Math.round(baseIndiaTotal.noHh * pRatio),
    population717: Math.round(baseIndiaTotal.population717 * pRatio),
    population1824: Math.round(baseIndiaTotal.population1824 * pRatio),
    population2540: Math.round(baseIndiaTotal.population2540 * pRatio),
    population4060: Math.round(baseIndiaTotal.population4060 * pRatio),
    population60Plus: Math.round(baseIndiaTotal.population60Plus * pRatio)
  });

  const demographicVillages = [
    // INDIA totals
    { ...baseIndiaTotal, name: 'INDIA', district: 'INDIA', subDistrict: 'INDIA', tru: 'Total' },
    { ...createLocationPCA('INDIA', 'INDIA', 'INDIA', 'Rural', 0.68), name: 'INDIA', district: 'INDIA', subDistrict: 'INDIA' },
    { ...createLocationPCA('INDIA', 'INDIA', 'INDIA', 'Urban', 0.32), name: 'INDIA', district: 'INDIA', subDistrict: 'INDIA' },
    
    // Tamil Nadu state
    { ...createLocationPCA('Tamil Nadu', 'Tamil Nadu', 'Tamil Nadu', 'Total', 0.060), name: 'Tamil Nadu' },
    { ...createLocationPCA('Tamil Nadu', 'Tamil Nadu', 'Tamil Nadu', 'Rural', 0.032), name: 'Tamil Nadu' },
    { ...createLocationPCA('Tamil Nadu', 'Tamil Nadu', 'Tamil Nadu', 'Urban', 0.028), name: 'Tamil Nadu' },

    // Erode district
    { ...createLocationPCA('Erode', 'Erode', 'Erode', 'Total', 0.0019), name: 'Erode' },
    { ...createLocationPCA('Erode', 'Erode', 'Erode', 'Rural', 0.0010), name: 'Erode' },
    { ...createLocationPCA('Erode', 'Erode', 'Erode', 'Urban', 0.0009), name: 'Erode' },

    // Sub Post Offices as aggregate regions
    { ...createLocationPCA('Sathyamangalam', 'Erode', 'Sathyamangalam', 'Total', 0.00032), name: 'Sathyamangalam' },
    { ...createLocationPCA('Bhavani', 'Erode', 'Bhavani', 'Total', 0.00028), name: 'Bhavani' },
    { ...createLocationPCA('Thingalur', 'Erode', 'Thingalur', 'Total', 0.00018), name: 'Thingalur' },

    // Individual Villages
    { ...createLocationPCA('Arasur', 'Erode', 'Sathyamangalam', 'Total', 0.000015) },
    { ...createLocationPCA('Ayyampalayam', 'Erode', 'Sathyamangalam', 'Total', 0.000012) },
    { ...createLocationPCA('Bannari', 'Erode', 'Sathyamangalam', 'Total', 0.000018) },
    { ...createLocationPCA('Rajan Nagar', 'Erode', 'Sathyamangalam', 'Total', 0.000014) },
    { ...createLocationPCA('Pudupeerkadavu', 'Erode', 'Sathyamangalam', 'Total', 0.000016) },
    { ...createLocationPCA('Bhavanisagar', 'Erode', 'Sathyamangalam', 'Total', 0.000022) },
    { ...createLocationPCA('Bhavani Village A', 'Erode', 'Bhavani', 'Total', 0.000015) },
    { ...createLocationPCA('Bhavani Village B', 'Erode', 'Bhavani', 'Total', 0.000013) },
    { ...createLocationPCA('Komarapalayam', 'Erode', 'Bhavani', 'Total', 0.000035) },
    { ...createLocationPCA('Thingalur Village', 'Erode', 'Thingalur', 'Total', 0.000014) },
    { ...createLocationPCA('Thoppampalayam', 'Erode', 'Thingalur', 'Total', 0.000011) }
  ];

  await DemographicsTamilNadu.insertMany(demographicVillages);

  console.log('Seeding personal_info...');
  const personalInfos = [
    {
      Name: "Muthusamy K", PhoneNumber: "9876543210", pan_id: "ABCDE1234F", aadhaar_id: 123456789012,
      Address: "12, Main Street, Arasur", Age: 64, Gender: "Male", Location: "Erode", Area: "Arasur",
      MaritalStatus: "Married", Occupation: "Agriculture", MonthlyIncome: 8500, EducationLevel: "Secondary",
      NoOfChildrenInTheHouse: 2, NoOfGirlChildrenUnder10: 0, OwnLandForAgriculture: "Yes", DigitalUsage: "Low",
      CreditScore: 680, BankAccount: "Yes", AlreadyInLoan: "No", NeedNewLoan: "Yes", TaxPayer: "No",
      NeedEducationLoan: "No", DateOfBirth: "1962-05-15", GirlChildAges: 0, CreditScore: 680,
      RecommendedSchemes: ["Kisan Credit Card (KCC)", "Senior Citizen Savings Scheme (SCSS)", "Post Office Savings Account (POSA)"],
      RecommendedScheme1: "Kisan Credit Card (KCC)", RecommendedScheme2: "Senior Citizen Savings Scheme (SCSS)", RecommendedScheme3: "Post Office Savings Account (POSA)",
      Scheme1: 0, Scheme2: 1, Scheme3: 0, DaysLeftScheme1: 30, DaysLeftScheme2: 120, DaysLeftScheme3: 0
    },
    {
      Name: "Anjali Devi", PhoneNumber: "9944332211", pan_id: "XYZWV9876A", aadhaar_id: 987654321098,
      Address: "45, Temple Street, Bannari", Age: 32, Gender: "Female", Location: "Erode", Area: "Bannari",
      MaritalStatus: "Married", Occupation: "Housewife", MonthlyIncome: 12000, EducationLevel: "Graduate",
      NoOfChildrenInTheHouse: 2, NoOfGirlChildrenUnder10: 2, OwnLandForAgriculture: "No", DigitalUsage: "High",
      CreditScore: 740, BankAccount: "Yes", AlreadyInLoan: "No", NeedNewLoan: "No", TaxPayer: "No",
      NeedEducationLoan: "No", DateOfBirth: "1994-10-20", GirlChildAges: 6, CreditScore: 740,
      RecommendedSchemes: ["Sukanya Samriddhi Yojana (SSA)", "Mahila Samman Savings Certificate", "Recurring Deposit Scheme (RD)"],
      RecommendedScheme1: "Sukanya Samriddhi Yojana (SSA)", RecommendedScheme2: "Mahila Samman Savings Certificate", RecommendedScheme3: "Recurring Deposit Scheme (RD)",
      Scheme1: 0, Scheme2: 0, Scheme3: 1, DaysLeftScheme1: 15, DaysLeftScheme2: 45, DaysLeftScheme3: 0
    },
    {
      Name: "Ramasamy P", PhoneNumber: "9753124680", pan_id: "DFGHI5678B", aadhaar_id: 111122223333,
      Address: "10, Mariamman St, Arasur", Age: 42, Gender: "Male", Location: "Erode", Area: "Arasur",
      MaritalStatus: "Married", Occupation: "Agriculture", MonthlyIncome: 9000, EducationLevel: "Primary",
      NoOfChildrenInTheHouse: 1, NoOfGirlChildrenUnder10: 0, OwnLandForAgriculture: "Yes", DigitalUsage: "Low",
      CreditScore: 660, BankAccount: "Yes", AlreadyInLoan: "No", NeedNewLoan: "No", TaxPayer: "No",
      NeedEducationLoan: "No", DateOfBirth: "1984-03-12", GirlChildAges: 0,
      RecommendedSchemes: ["Kisan Credit Card (KCC)", "Post Office Savings Account (POSA)", "Kisan Vikas Patra (KVP)"],
      RecommendedScheme1: "Kisan Credit Card (KCC)", RecommendedScheme2: "Post Office Savings Account (POSA)", RecommendedScheme3: "Kisan Vikas Patra (KVP)",
      Scheme1: 1, Scheme2: 0, Scheme3: 0, DaysLeftScheme1: 0, DaysLeftScheme2: 0, DaysLeftScheme3: 90
    },
    {
      Name: "Karthik R", PhoneNumber: "9865432101", pan_id: "JKLMN9012C", aadhaar_id: 444455556666,
      Address: "18, Cross Rd, Komarapalayam", Age: 28, Gender: "Male", Location: "Erode", Area: "Komarapalayam",
      MaritalStatus: "Single", Occupation: "Salaried", MonthlyIncome: 28000, EducationLevel: "Graduate",
      NoOfChildrenInTheHouse: 0, NoOfGirlChildrenUnder10: 0, OwnLandForAgriculture: "No", DigitalUsage: "High",
      CreditScore: 780, BankAccount: "Yes", AlreadyInLoan: "Yes", NeedNewLoan: "No", TaxPayer: "Yes",
      NeedEducationLoan: "No", DateOfBirth: "1998-08-04", GirlChildAges: 0,
      RecommendedSchemes: ["Public Provident Fund (PPF)", "National Savings Certificate (NSC)", "Recurring Deposit Scheme (RD)"],
      RecommendedScheme1: "Public Provident Fund (PPF)", RecommendedScheme2: "National Savings Certificate (NSC)", RecommendedScheme3: "Recurring Deposit Scheme (RD)",
      Scheme1: 0, Scheme2: 0, Scheme3: 0, DaysLeftScheme1: 300, DaysLeftScheme2: 150, DaysLeftScheme3: 50
    },
    {
      Name: "Sumathi M", PhoneNumber: "9123456789", pan_id: "OPQRS3456D", aadhaar_id: 777788889999,
      Address: "5, Weaver Colony, Bhavani Village A", Age: 36, Gender: "Female", Location: "Erode", Area: "Bhavani Village A",
      MaritalStatus: "Married", Occupation: "Self-Employed", MonthlyIncome: 14000, EducationLevel: "Secondary",
      NoOfChildrenInTheHouse: 3, NoOfGirlChildrenUnder10: 1, OwnLandForAgriculture: "No", DigitalUsage: "Medium",
      CreditScore: 710, BankAccount: "Yes", AlreadyInLoan: "No", NeedNewLoan: "No", TaxPayer: "No",
      NeedEducationLoan: "Yes", DateOfBirth: "1990-11-23", GirlChildAges: 8,
      RecommendedSchemes: ["Sukanya Samriddhi Yojana (SSA)", "Mahila Samman Savings Certificate", "Recurring Deposit Scheme (RD)"],
      RecommendedScheme1: "Sukanya Samriddhi Yojana (SSA)", RecommendedScheme2: "Mahila Samman Savings Certificate", RecommendedScheme3: "Recurring Deposit Scheme (RD)",
      Scheme1: 1, Scheme2: 0, Scheme3: 0, DaysLeftScheme1: 0, DaysLeftScheme2: 30, DaysLeftScheme3: 0
    }
  ];

  // Let's create another 10 profiles programmatically
  const occupationList = ['Agriculture', 'Salaried', 'Self-Employed', 'Housewife', 'Student'];
  const eduList = ['Primary', 'Secondary', 'Graduate'];
  const villagesList = ['Arasur', 'Bannari', 'Komarapalayam', 'Bhavani Village A', 'Thingalur Village', 'Thoppampalayam'];

  for (let i = 0; i < 10; i++) {
    const age = 20 + Math.floor(Math.random() * 50);
    const gender = Math.random() > 0.4 ? 'Male' : 'Female';
    const isMarried = Math.random() > 0.3 ? 'Married' : 'Single';
    const children = Math.random() > 0.5 ? (Math.random() > 0.5 ? 2 : 1) : 0;
    const girlChildren = gender === 'Female' && children > 0 ? (Math.random() > 0.5 ? 1 : 0) : 0;
    const land = Math.random() > 0.5 ? 'Yes' : 'No';
    const income = 8000 + Math.floor(Math.random() * 25000);
    const area = villagesList[i % villagesList.length];

    personalInfos.push({
      Name: `Citizen ${i + 1}`,
      PhoneNumber: `98765${i}1234`,
      pan_id: `PAN${i}000${i}K`,
      aadhaar_id: 200000000000 + i * 111111111,
      Address: `${10 + i}, Village St, ${area}`,
      Age: age,
      Gender: gender,
      Location: "Erode",
      Area: area,
      MaritalStatus: isMarried,
      Occupation: land === 'Yes' ? 'Agriculture' : occupationList[i % occupationList.length],
      MonthlyIncome: income,
      EducationLevel: eduList[i % eduList.length],
      NoOfChildrenInTheHouse: children,
      NoOfGirlChildrenUnder10: girlChildren,
      OwnLandForAgriculture: land,
      DigitalUsage: Math.random() > 0.6 ? 'High' : (Math.random() > 0.4 ? 'Medium' : 'Low'),
      CreditScore: 600 + Math.floor(Math.random() * 200),
      BankAccount: "Yes",
      AlreadyInLoan: Math.random() > 0.7 ? 'Yes' : 'No',
      NeedNewLoan: Math.random() > 0.8 ? 'Yes' : 'No',
      TaxPayer: income > 20000 ? 'Yes' : 'No',
      NeedEducationLoan: children > 0 && Math.random() > 0.7 ? 'Yes' : 'No',
      DateOfBirth: new Date(2026 - age, 5, 15).toISOString().split('T')[0],
      GirlChildAges: girlChildren > 0 ? 5 : 0,
      RecommendedSchemes: ["Post Office Savings Account (POSA)", "Recurring Deposit Scheme (RD)", "Public Provident Fund (PPF)"],
      RecommendedScheme1: "Post Office Savings Account (POSA)",
      RecommendedScheme2: "Recurring Deposit Scheme (RD)",
      RecommendedScheme3: "Public Provident Fund (PPF)",
      Scheme1: Math.random() > 0.5 ? 1 : 0,
      Scheme2: Math.random() > 0.7 ? 1 : 0,
      Scheme3: Math.random() > 0.8 ? 1 : 0,
      DaysLeftScheme1: 0,
      DaysLeftScheme2: 0,
      DaysLeftScheme3: 0
    });
  }

  await PersonalInfo.insertMany(personalInfos);

  console.log('Seeding cropsubdistricts & croptimings...');
  const cropsubdistricts = [
    { village: 'bhavani', district: 'Erode', crops: [{ village: 'bhavani', crops: ['Rice', 'Banana', 'Sugarcane'] }] },
    { village: 'arasur', district: 'Erode', crops: [{ village: 'arasur', crops: ['Cotton', 'Maize', 'Turmeric'] }] },
    { village: 'bannari', district: 'Erode', crops: [{ village: 'bannari', crops: ['Turmeric', 'Sugarcane', 'Rice'] }] },
    { village: 'komarapalayam', district: 'Erode', crops: [{ village: 'komarapalayam', crops: ['Rice', 'Banana'] }] },
    { village: 'thingalur village', district: 'Erode', crops: [{ village: 'thingalur village', crops: ['Cotton', 'Turmeric'] }] },
    { village: 'thoppampalayam', district: 'Erode', crops: [{ village: 'thoppampalayam', crops: ['Maize', 'Turmeric'] }] }
  ];
  await CropSubDistrict.insertMany(cropsubdistricts);

  const croptimings = [
    { cropname: 'Rice', timing: [{ district: 'Erode', seasons: { sowing: ['June', 'July'], harvesting: ['November', 'December'] } }] },
    { cropname: 'Banana', timing: [{ district: 'Erode', seasons: { sowing: ['April', 'May'], harvesting: ['December', 'January'] } }] },
    { cropname: 'Sugarcane', timing: [{ district: 'Erode', seasons: { sowing: ['January', 'February'], harvesting: ['December', 'January'] } }] },
    { cropname: 'Cotton', timing: [{ district: 'Erode', seasons: { sowing: ['July', 'August'], harvesting: ['February', 'March'] } }] },
    { cropname: 'Turmeric', timing: [{ district: 'Erode', seasons: { sowing: ['June'], harvesting: ['January', 'February'] } }] },
    { cropname: 'Maize', timing: [{ district: 'Erode', seasons: { sowing: ['June', 'July'], harvesting: ['October', 'November'] } }] }
  ];
  await CropTiming.insertMany(croptimings);

  console.log('Seeding events...');
  const events = [
    { eventName: 'Bhavani Kooduthurai Mela', date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), location: 'Bhavani Temple Grounds', district: 'Erode', eventType: 'Festival', description: 'Huge annual gathering at the holy river confluence. Ideal for mass savings and APY enrollment campaigns.', expectedCrowd: 'High', suggestedSchemes: 'POSA, APY, SSA', status: 'Planned', attendees: 0, enrollments: 0, scrapedSource: 'Erode Admin Portal' },
    { eventName: 'Sathy Farmers Cooperative Meet', date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), location: 'Sathyamangalam Market', district: 'Erode', eventType: 'Community Event', description: 'Weekly meeting of cotton and turmeric cultivators. Ideal for crop loans and investment schemes.', expectedCrowd: 'High', suggestedSchemes: 'KCC, KVP, PPF', status: 'Planned', attendees: 0, enrollments: 0, scrapedSource: 'Erode Agri Portal' },
    { eventName: 'Thingalur Mariamman Festival', date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), location: 'Thingalur Temple', district: 'Erode', eventType: 'Festival', description: 'Annual village temple chariot festival. High crowd density.', expectedCrowd: 'High', suggestedSchemes: 'RD, SSA, MSSC', status: 'Planned', scrapedSource: 'Tamil Nadu Tourism Portal' }
  ];
  await Event.insertMany(events);

  console.log('Seeding campaign_recommendations...');
  const recommendations = [
    { village: 'Arasur', recommendedScheme: 'Sukanya Samriddhi Yojana (SSA)', opportunityScore: 92, campaignWindow: 'July 10 - July 20', keyDrivers: ['High girl child population under 10', 'Upcoming school reopening season', 'Low current enrollment rate (12%)'], estimatedEligibleCitizens: '~120' },
    { village: 'Bannari', recommendedScheme: 'Kisan Credit Card (KCC)', opportunityScore: 88, campaignWindow: 'June 25 - July 05', keyDrivers: ['Large agricultural population', 'Sowing season starting in June', 'Availability of arable land'], estimatedEligibleCitizens: '~85' },
    { village: 'Komarapalayam', recommendedScheme: 'Senior Citizen Savings Scheme (SCSS)', opportunityScore: 85, campaignWindow: 'July 15 - July 25', keyDrivers: ['Higher concentration of 60+ age group', 'Interest payout cycle start', 'Safe investment preference in rural area'], estimatedEligibleCitizens: '~60' },
    { village: 'Bhavani Village A', recommendedScheme: 'Recurring Deposit Scheme (RD)', opportunityScore: 90, campaignWindow: 'June 28 - July 05', keyDrivers: ['Steady small household incomes', 'Upcoming temple mela crowd', 'Low current RD counts'], estimatedEligibleCitizens: '~150' }
  ];
  await CampaignRecommendation.insertMany(recommendations);

  console.log('Seeding campaign_feedback...');
  const feedbacks = [
    { campaignId: 'CMP001', village: 'Arasur', scheme: 'Sukanya Samriddhi Yojana (SSA)', attendees: 180, newEnrollments: 34, feedbackScore: 4.2, remarks: 'High interest among women beneficiaries', status: 'Completed', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
    { campaignId: 'CMP002', village: 'Bannari', scheme: 'Kisan Credit Card (KCC)', attendees: 120, newEnrollments: 22, feedbackScore: 4.5, remarks: 'Farmers requested loan application simplification', status: 'Completed', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
    { campaignId: 'CMP003', village: 'Komarapalayam', scheme: 'Senior Citizen Savings Scheme (SCSS)', attendees: 50, newEnrollments: 12, feedbackScore: 4.0, remarks: 'Retirees preferred higher interest rates', status: 'Completed', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
  ];
  await CampaignFeedback.insertMany(feedbacks);

  console.log('Seeding enrollments...');
  const enrollmentsList = [
    // Direct link to known profiles
    { citizenAadhaar: '123456789012', schemeCode: 'SCSS', status: 'Enrolled', enrollmentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), village: 'Arasur', campaignId: 'CMP003' },
    { citizenAadhaar: '987654321098', schemeCode: 'RD', status: 'Enrolled', enrollmentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), village: 'Bannari', campaignId: 'CMP001' },
    { citizenAadhaar: '111122223333', schemeCode: 'KCC', status: 'Enrolled', enrollmentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), village: 'Arasur', campaignId: 'CMP002' },
    { citizenAadhaar: '777788889999', schemeCode: 'SSA', status: 'Enrolled', enrollmentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), village: 'Bhavani Village A', campaignId: 'CMP001' }
  ];

  // Populate remaining enrollments dynamically to match the campaign outcomes:
  // CMP001 has 34 enrollments for SSA in Arasur (feedback village is Arasur in feedbacks array)
  for (let i = 0; i < 33; i++) {
    enrollmentsList.push({
      citizenAadhaar: `300000000${100 + i}`,
      schemeCode: 'SSA',
      status: 'Enrolled',
      enrollmentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      village: 'Arasur',
      campaignId: 'CMP001'
    });
  }

  // CMP002 has 22 enrollments for KCC in Bannari
  for (let i = 0; i < 21; i++) {
    enrollmentsList.push({
      citizenAadhaar: `400000000${100 + i}`,
      schemeCode: 'KCC',
      status: 'Enrolled',
      enrollmentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      village: 'Bannari',
      campaignId: 'CMP002'
    });
  }

  // CMP003 has 12 enrollments for SCSS in Komarapalayam
  for (let i = 0; i < 11; i++) {
    enrollmentsList.push({
      citizenAadhaar: `500000000${100 + i}`,
      schemeCode: 'SCSS',
      status: 'Enrolled',
      enrollmentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      village: 'Komarapalayam',
      campaignId: 'CMP003'
    });
  }

  // Add some pending/not-enrolled entries for other citizens in villages
  for (let i = 0; i < 15; i++) {
    const schemeCodes = ['RD', 'PPF', 'SSA', 'APY', 'KCC'];
    const villages = ['Arasur', 'Bannari', 'Komarapalayam', 'Bhavani Village A', 'Thingalur Village'];
    enrollmentsList.push({
      citizenAadhaar: `600000000${100 + i}`,
      schemeCode: schemeCodes[i % schemeCodes.length],
      status: Math.random() > 0.4 ? 'Pending' : 'Not Enrolled',
      enrollmentDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      village: villages[i % villages.length],
      campaignId: `CMP00${(i % 3) + 1}`
    });
  }

  await Enrollment.insertMany(enrollmentsList);

  console.log('Seeding schemes...');
  const schemesList = [
    { schemeCode: 'POSA', name: 'Post Office Savings Account', description: 'A basic savings account offering safe returns and liquidity.', eligibilityCriteria: { minAge: 0, maxAge: 100, allowedGenders: ['Male', 'Female', 'Other'] }, targetAudience: 'General public, rural and semi-urban populations', benefits: ['Low minimum balance of ₹500', 'Tax-free interest up to ₹10,000 per year', 'Safe government backing'], interestRate: 4.0 },
    { schemeCode: 'RD', name: 'Recurring Deposit Scheme (RD)', description: 'Disciplined monthly savings scheme with guaranteed returns.', eligibilityCriteria: { minAge: 18, maxAge: 100, allowedGenders: ['Male', 'Female', 'Other'] }, targetAudience: 'Salaried individuals, daily wage earners', benefits: ['Fixed monthly deposits starting from ₹100', '5-year maturity period', 'Loan facility up to 50% of balance'], interestRate: 6.7 },
    { schemeCode: 'PPF', name: 'Public Provident Fund (PPF)', description: 'Long-term tax saving and wealth accumulation scheme.', eligibilityCriteria: { minAge: 18, maxAge: 100, allowedGenders: ['Male', 'Female', 'Other'] }, targetAudience: 'Taxpayers, self-employed professionals', benefits: ['Section 80C tax deduction', 'Completely tax-free interest and maturity', '15-year tenure lock-in'], interestRate: 7.1 },
    { schemeCode: 'SSA', name: 'Sukanya Samriddhi Yojana (SSA)', description: 'Savings scheme targeted exclusively for the welfare of the girl child.', eligibilityCriteria: { minAge: 0, maxAge: 10, allowedGenders: ['Female'] }, targetAudience: 'Parents of girl children under 10', benefits: ['Highest interest rate among POSB schemes', 'Tax deduction under Section 80C', 'Matures on girl child reaching 21 years'], interestRate: 8.2 },
    { schemeCode: 'SCSS', name: 'Senior Citizen Savings Scheme (SCSS)', description: 'Regular income scheme for seniors with sovereign security.', eligibilityCriteria: { minAge: 60, maxAge: 100, allowedGenders: ['Male', 'Female', 'Other'] }, targetAudience: 'Retirees and senior citizens', benefits: ['Quarterly interest payout', 'Section 80C tax deduction', 'Maturity period of 5 years'], interestRate: 8.2 },
    { schemeCode: 'KCC', name: 'Kisan Credit Card (KCC)', description: 'Short-term credit for farmers to meet cultivation and maintenance needs.', eligibilityCriteria: { minAge: 18, maxAge: 75, allowedGenders: ['Male', 'Female', 'Other'], maxLandAcres: 50 }, targetAudience: 'Farmers and agricultural landowners', benefits: ['Low-interest crop loans', 'Flexible repayment based on harvest cycle', 'Inbuilt crop insurance protection'], interestRate: 7.0 }
  ];
  await Scheme.insertMany(schemesList);

  console.log('Seeding postoffices...');
  const postOfficesData = [
    {
      postOfficeCode: 'PO-SATHY-01', state: 'Tamil Nadu', district: 'Erode', headPostOffice: 'Erode HPO', postOffice: 'Sathyamangalam PO', pincode: '638401',
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
      postOfficeCode: 'PO-BHV-01', state: 'Tamil Nadu', district: 'Erode', headPostOffice: 'Bhavani HPO', postOffice: 'Bhavani PO', pincode: '638301',
      villages: [
        { villageCode: 'VIL-BHV-201', name: 'Bhavani Village A' },
        { villageCode: 'VIL-BHV-202', name: 'Bhavani Village B' },
        { villageCode: 'VIL-BHV-203', name: 'Komarapalayam' }
      ]
    },
    {
      postOfficeCode: 'PO-THNG-01', state: 'Tamil Nadu', district: 'Erode', headPostOffice: 'Erode HPO', postOffice: 'Thingalur PO', pincode: '638055',
      villages: [
        { villageCode: 'VIL-THNG-301', name: 'Thingalur Village' },
        { villageCode: 'VIL-THNG-302', name: 'Thoppampalayam' }
      ]
    }
  ];
  await PostOffice.insertMany(postOfficesData);

  console.log('Seeding demographics...');
  const demographicsData = [
    {
      regionCode: 'VIL-BHV-201', regionType: 'village', snapshotDate: new Date(), totalPopulation: 2500, totalSchemeEnrollments: 820,
      literacyRate: { literate: 1800, illiterate: 700 }, genderDistribution: { male: 1220, female: 1280, other: 0 },
      occupationDistribution: { agriculture: 1100, salaried: 300, selfEmployed: 500, unemployed: 600 },
      incomeDistribution: { low: 1500, medium: 800, high: 200 }, workTypeDistribution: { mainWorkers: 1500, marginalWorkers: 400, nonWorkers: 600 },
      ageGenderDistribution: [
        { ageRange: '0-10', maleCount: 150, femaleCount: 170 },
        { ageRange: '11-18', maleCount: 200, femaleCount: 190 },
        { ageRange: '19-60', maleCount: 700, femaleCount: 720 },
        { ageRange: '60+', maleCount: 170, femaleCount: 200 }
      ]
    },
    {
      regionCode: 'PO-BHV-01', regionType: 'postoffice', snapshotDate: new Date(), totalPopulation: 15000, totalSchemeEnrollments: 4500,
      literacyRate: { literate: 11500, illiterate: 3500 }, genderDistribution: { male: 7400, female: 7600, other: 0 },
      occupationDistribution: { agriculture: 5200, salaried: 3100, selfEmployed: 3700, unemployed: 3000 },
      incomeDistribution: { low: 8000, medium: 5200, high: 1800 }, workTypeDistribution: { mainWorkers: 9500, marginalWorkers: 2500, nonWorkers: 3000 },
      ageGenderDistribution: [
        { ageRange: '0-10', maleCount: 950, femaleCount: 970 },
        { ageRange: '11-18', maleCount: 1200, femaleCount: 1150 },
        { ageRange: '19-60', maleCount: 4250, femaleCount: 4300 },
        { ageRange: '60+', maleCount: 1000, femaleCount: 1180 }
      ]
    },
    {
      regionCode: 'Erode', regionType: 'district', snapshotDate: new Date(), totalPopulation: 2250000, totalSchemeEnrollments: 680000,
      literacyRate: { literate: 1720000, illiterate: 530000 }, genderDistribution: { male: 1115000, female: 1135000, other: 0 },
      occupationDistribution: { agriculture: 850000, salaried: 540000, selfEmployed: 420000, unemployed: 440000 },
      incomeDistribution: { low: 1150000, medium: 810000, high: 290000 }, workTypeDistribution: { mainWorkers: 1390000, marginalWorkers: 380000, nonWorkers: 480000 },
      ageGenderDistribution: [
        { ageRange: '0-10', maleCount: 145000, femaleCount: 152000 },
        { ageRange: '11-18', maleCount: 195000, femaleCount: 188000 },
        { ageRange: '19-60', maleCount: 615000, femaleCount: 620000 },
        { ageRange: '60+', maleCount: 160000, femaleCount: 175000 }
      ]
    },
    {
      regionCode: 'Tamil Nadu', regionType: 'state', snapshotDate: new Date(), totalPopulation: 72147000, totalSchemeEnrollments: 22500000,
      literacyRate: { literate: 58000000, illiterate: 14147000 }, genderDistribution: { male: 36137000, female: 36010000, other: 0 },
      occupationDistribution: { agriculture: 25000000, salaried: 18000000, selfEmployed: 16000000, unemployed: 13147000 },
      incomeDistribution: { low: 35000000, medium: 26000000, high: 11147000 }, workTypeDistribution: { mainWorkers: 42000000, marginalWorkers: 11000000, nonWorkers: 19147000 },
      ageGenderDistribution: [
        { ageRange: '0-10', maleCount: 4500000, femaleCount: 4600000 },
        { ageRange: '11-18', maleCount: 5800000, femaleCount: 5700000 },
        { ageRange: '19-60', maleCount: 20200000, femaleCount: 20100000 },
        { ageRange: '60+', maleCount: 5637000, femaleCount: 5610000 }
      ]
    }
  ];
  await Demographics.insertMany(demographicsData);

  console.log('Database seeded successfully! 🎉');
  await mongoose.connection.close();
  console.log('Connection closed.');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
