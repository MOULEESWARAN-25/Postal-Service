import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEnrollment extends Document {
  citizenAadhaar: string;
  schemeCode: string;
  status: 'Enrolled' | 'Not Enrolled' | 'Pending';
  enrollmentDate?: Date;
  village?: string;
  campaignId?: string;
}

const EnrollmentSchema: Schema = new Schema({
  citizenAadhaar: { type: String, required: true },
  schemeCode: { type: String, required: true },
  status: { type: String, enum: ["Enrolled", "Not Enrolled", "Pending"], required: true },
  enrollmentDate: { type: Date },
  village: { type: String },
  campaignId: { type: String }
});

EnrollmentSchema.index({ citizenAadhaar: 1 });
EnrollmentSchema.index({ schemeCode: 1 });
EnrollmentSchema.index({ village: 1 });
EnrollmentSchema.index({ campaignId: 1 });

const Enrollment: Model<IEnrollment> =
  mongoose.models.Enrollment ||
  mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema, 'enrollments');

export default Enrollment;
