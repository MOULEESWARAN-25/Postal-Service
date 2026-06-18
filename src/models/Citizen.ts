import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICitizen extends Document {
  aadhaarId: string;
  name: string;
  age: number;
  gender: string;
  numberOfChildren: number;
  numberOfGirlChildrenUnder10: number;
  education: string;
  occupation: string;
  maritalStatus: string;
  landOwnershipAcres: number;
  digitalUsage: 'Low' | 'Medium' | 'High';
  annualIncome: number;
  villageCode: string;
  postOfficeCode: string;
  phoneNumber?: string;
  recommendations?: {
    topSchemes: Array<{
      schemeCode: string;
      name: string;
      confidence: number;
      reason: string;
    }>;
    generatedAt: Date;
  };
}

const CitizenSchema: Schema = new Schema({
  aadhaarId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  numberOfChildren: { type: Number, default: 0 },
  numberOfGirlChildrenUnder10: { type: Number, default: 0 },
  education: { type: String, required: true },
  occupation: { type: String, required: true },
  maritalStatus: { type: String, required: true },
  landOwnershipAcres: { type: Number, required: true },
  digitalUsage: { type: String, enum: ["Low", "Medium", "High"], required: true },
  annualIncome: { type: Number, required: true },
  villageCode: { type: String, required: true },
  postOfficeCode: { type: String, required: true },
  phoneNumber: { type: String },
  recommendations: {
    topSchemes: [{
      schemeCode: { type: String },
      name: { type: String },
      confidence: { type: Number },
      reason: { type: String }
    }],
    generatedAt: { type: Date, default: Date.now }
  }
});

// Indexes for filtration and lookups
CitizenSchema.index({ aadhaarId: 1 });
CitizenSchema.index({ villageCode: 1 });
CitizenSchema.index({ age: 1, gender: 1 });

const Citizen: Model<ICitizen> =
  mongoose.models.Citizen ||
  mongoose.model<ICitizen>('Citizen', CitizenSchema, 'citizens');

export default Citizen;
