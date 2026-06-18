import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISchemeTimeline extends Document {
  schemeCode: string;
  type: 'seasonal' | 'farming' | 'financial' | 'festive';
  timeRange: string;
  regionCode?: string;
  description: string;
}

const SchemeTimelineSchema: Schema = new Schema({
  schemeCode: { type: String, required: true },
  type: { type: String, enum: ["seasonal", "farming", "financial", "festive"], required: true },
  timeRange: { type: String, required: true },
  regionCode: { type: String },
  description: { type: String, required: true }
});

// Indexes for query lookups
SchemeTimelineSchema.index({ type: 1 });
SchemeTimelineSchema.index({ schemeCode: 1 });

const SchemeTimeline: Model<ISchemeTimeline> =
  mongoose.models.SchemeTimeline ||
  mongoose.model<ISchemeTimeline>('SchemeTimeline', SchemeTimelineSchema, 'scheme_timeline');

export default SchemeTimeline;
