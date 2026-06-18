import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPostOffice extends Document {
  postOfficeCode: string;
  state: string;
  district: string;
  headPostOffice: string;
  postOffice: string;
  pincode: string;
  villages: Array<{
    villageCode: string;
    name: string;
  }>;
}

const PostOfficeSchema: Schema = new Schema({
  postOfficeCode: { type: String, required: true, unique: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  headPostOffice: { type: String, required: true },
  postOffice: { type: String, required: true },
  pincode: { type: String, required: true },
  villages: [{
    villageCode: { type: String, required: true },
    name: { type: String, required: true }
  }]
});

// Indexes for hierarchy search performance
PostOfficeSchema.index({ state: 1, district: 1, headPostOffice: 1, postOffice: 1 });

const PostOffice: Model<IPostOffice> =
  mongoose.models.PostOffice ||
  mongoose.model<IPostOffice>('PostOffice', PostOfficeSchema, 'postoffices');

export default PostOffice;
