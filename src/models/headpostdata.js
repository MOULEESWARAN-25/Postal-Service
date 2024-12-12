const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the "HeadPostData" collection
const headPostDataSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    panId: { type: String, required: true },
    aadharId: { type: Number, required: true },
    address: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    location: { type: String, required: true },
    area: { type: String, required: true },
    maritalStatus: { type: String, required: true },
    occupation: { type: String, required: true },
    monthlyIncome: { type: Number, required: true },
    educationLevel: { type: String, required: true },
    financialGoal: { type: String, required: true },
    riskAppetite: { type: String, required: true },
    duration: { type: String, required: true },
    bankAccount: { type: String, required: true },
    digitalUsage: { type: String, required: true },
    ownLandForAgriculture: { type: String, required: true },
    alreadyInLoan: { type: String, required: true },
    needNewLoan: { type: String, required: true },
    taxPayer: { type: String, required: true },
    needEducationLoan: { type: String, required: true },
    numberOfChildren: { type: Number, required: true },
    numberOfGirlChildrenUnder10: { type: Number, required: true },
    creditScore: { type: Number, required: true },
    recommendedScheme1: { type: String, required: true },
    recommendedScheme2: { type: String, required: true },
    recommendedScheme3: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    girlChildAges: { type: Number, required: true },
    daysLeftScheme1: { type: Number, required: true },
    daysLeftScheme2: { type: Number, required: true },
    daysLeftScheme3: { type: Number, required: true },
    scheme1: { type: Number, required: true },
    scheme2: { type: Number, required: true },
    scheme3: { type: Number, required: true },
    recommandendSchemes: { type: [String], required: true },
    Area: { type: String, required: true },
    BranchPostOffice: { type: String, required: true },
    SubPostOffice: { type: String, required: true }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Check if the model is already defined before defining it again
const HeadPostData = mongoose.models.HeadPostData || mongoose.model('HeadPostData', headPostDataSchema, 'HeadPostData');

module.exports = HeadPostData;
