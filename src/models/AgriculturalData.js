import mongoose from 'mongoose';

const AgriculturalDataSchema = new mongoose.Schema({
  areas: { type: String, required: true },
  crop: { type: String, required: true },
  landArea: { type: Number, required: true },
  amount: { type: Number, required: true },
  startMonth: { type: String, required: true },
  endMonth: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'agricultural_data' });

const AgriculturalData = mongoose.models.AgriculturalData || mongoose.model('AgriculturalData', AgriculturalDataSchema);

export default AgriculturalData;
