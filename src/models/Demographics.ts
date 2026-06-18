import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDemographics extends Document {
  regionCode: string;
  regionType: 'village' | 'postoffice' | 'district' | 'state';
  snapshotDate: Date;
  totalPopulation: number;
  totalSchemeEnrollments: number;
  literacyRate: {
    literate: number;
    illiterate: number;
  };
  genderDistribution: {
    male: number;
    female: number;
    other: number;
  };
  occupationDistribution: {
    agriculture: number;
    salaried: number;
    selfEmployed: number;
    unemployed: number;
  };
  incomeDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  workTypeDistribution: {
    mainWorkers: number;
    marginalWorkers: number;
    nonWorkers: number;
  };
  ageGenderDistribution: Array<{
    ageRange: string;
    maleCount: number;
    femaleCount: number;
  }>;
}

const DemographicsSchema: Schema = new Schema({
  regionCode: { type: String, required: true },
  regionType: { type: String, enum: ["village", "postoffice", "district", "state"], required: true },
  snapshotDate: { type: Date, default: Date.now },
  totalPopulation: { type: Number, required: true },
  totalSchemeEnrollments: { type: Number, default: 0 },
  literacyRate: {
    literate: { type: Number, required: true },
    illiterate: { type: Number, required: true }
  },
  genderDistribution: {
    male: { type: Number, required: true },
    female: { type: Number, required: true },
    other: { type: Number, required: true }
  },
  occupationDistribution: {
    agriculture: { type: Number, required: true },
    salaried: { type: Number, required: true },
    selfEmployed: { type: Number, required: true },
    unemployed: { type: Number, required: true }
  },
  incomeDistribution: {
    low: { type: Number, required: true },
    medium: { type: Number, required: true },
    high: { type: Number, required: true }
  },
  workTypeDistribution: {
    mainWorkers: { type: Number, required: true },
    marginalWorkers: { type: Number, required: true },
    nonWorkers: { type: Number, required: true }
  },
  ageGenderDistribution: [{
    ageRange: { type: String, required: true },
    maleCount: { type: Number, required: true },
    femaleCount: { type: Number, required: true }
  }]
});

// Index for lookup and trend snapshots
DemographicsSchema.index({ regionCode: 1, regionType: 1, snapshotDate: -1 });

const Demographics: Model<IDemographics> =
  mongoose.models.Demographics ||
  mongoose.model<IDemographics>('Demographics', DemographicsSchema, 'demographics');

export default Demographics;
