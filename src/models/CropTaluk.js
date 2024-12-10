import mongoose from 'mongoose';

// Define the schema for villages and their crops
const villageCropSchema = new mongoose.Schema({
  village: { type: String, required: true },
  crops: { type: [String], required: true }, // Array of crop names
});

// Define the schema for the district and its subdistricts
const cropTalukSchema = new mongoose.Schema({
  district: { type: String, required: true }, // District name
  subdistrict: { type: [villageCropSchema], required: true }, // Array of subdistricts
});

// Create and export the model for the 'crop_taluk' collection
const CropTaluk = mongoose.models.CropTaluk || mongoose.model('CropTaluk', cropTalukSchema, 'crop_taluk');

export default CropTaluk;
