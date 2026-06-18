import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISchemePerformance extends Document {
  regionCode: string;
  regionType: 'village' | 'postoffice' | 'district' | 'state';
  schemeCode: string;
  activeEnrollments: number;
  targetEnrollments: number;
  successRate: number;
  adoptionTrend: Array<{
    month: string;
    count: number;
  }>;
}

const SchemePerformanceSchema: Schema = new Schema({
  regionCode: { type: String, required: true },
  regionType: { type: String, enum: ["village", "postoffice", "district", "state"], required: true },
  schemeCode: { type: String, required: true },
  activeEnrollments: { type: Number, required: true },
  targetEnrollments: { type: Number, required: true },
  successRate: { type: Number, required: true },
  adoptionTrend: [{
    month: { type: String, required: true },
    count: { type: Number, required: true }
  }]
});

// Indexes for performance queries
SchemePerformanceSchema.index({ regionCode: 1, schemeCode: 1 });

const SchemePerformance: Model<ISchemePerformance> =
  mongoose.models.SchemePerformance ||
  mongoose.model<ISchemePerformance>('SchemePerformance', SchemePerformanceSchema, 'scheme_performance');

export default SchemePerformance;
