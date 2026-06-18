import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IScheme extends Document {
  schemeCode: string;
  name: string;
  description: string;
  eligibilityCriteria: {
    minAge: number;
    maxAge: number;
    allowedGenders: string[];
    maxLandAcres?: number;
    maxIncome?: number;
  };
  targetAudience: string;
  benefits: string[];
  interestRate: number;
}

const SchemeSchema: Schema = new Schema({
  schemeCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  eligibilityCriteria: {
    minAge: { type: Number, required: true },
    maxAge: { type: Number, required: true },
    allowedGenders: [{ type: String }],
    maxLandAcres: { type: Number },
    maxIncome: { type: Number }
  },
  targetAudience: { type: String, required: true },
  benefits: [{ type: String }],
  interestRate: { type: Number, required: true }
});

const Scheme: Model<IScheme> =
  mongoose.models.Scheme ||
  mongoose.model<IScheme>('Scheme', SchemeSchema, 'schemes');

export default Scheme;
