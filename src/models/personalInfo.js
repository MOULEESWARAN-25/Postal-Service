// Schema definition for personal_info using Mongoose
import mongoose from 'mongoose';

const PersonalInfoSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  PhoneNumber: { type: String, required: true },
  pan_id: { type: String },
  aadhaar_id: { type: Number },
  Address: { type: String },
  Age: { type: Number },
  Gender: { type: String },
  Location: { type: String },
  Area: { type: String },
  MaritalStatus: { type: String },
  Occupation: { type: String },
  MonthlyIncome: { type: Number },
  EducationLevel: { type: String },
  FinancialGoal: { type: String },
  RiskAppetite: { type: String },
  Duration: { type: String },
  BankAccount: { type: String },
  DigitalUsage: { type: String },
  OwnLandForAgriculture: { type: String },
  AlreadyInLoan: { type: String },
  NeedNewLoan: { type: String },
  TaxPayer: { type: String },
  NeedEducationLoan: { type: String },
  NoOfChildrenInTheHouse: { type: Number },
  NoOfGirlChildrenUnder10: { type: Number },
  CreditScore: { type: Number },
  RecommendedSchemes: { type: [String] },
  RecommendedScheme1: { type: String },
  RecommendedScheme2: { type: String },
  RecommendedScheme3: { type: String },
  DateOfBirth: { type: String },
  GirlChildAges: { type: Number },
  DaysLeftScheme1: { type: Number },
  DaysLeftScheme2: { type: Number },
  DaysLeftScheme3: { type: Number },
  Scheme1: { type: Number },
  Scheme2: { type: Number },
  Scheme3: { type: Number },
}, { collection: 'personal_info' });

const PersonalInfo = mongoose.models.PersonalInfo || mongoose.model('PersonalInfo', PersonalInfoSchema);

export default PersonalInfo;