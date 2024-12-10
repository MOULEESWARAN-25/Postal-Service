import mongoose from 'mongoose';

// Define the schema for village demographic data
const villageSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Village name
  district: { type: String, required: true }, // District name
  subDistrict: { type: String, required: true }, // Sub-district name
  tru: { type: String }, // Rural or Urban classification
  noHh: { type: Number }, // Number of households
  population717: { type: Number }, // Population between 7 to 17 years
  population1824: { type: Number }, // Population between 18 to 24 years
  // Additional fields can be added as needed
});

// Define the schema for district-level demographics
const districtDemographicsSchema = new mongoose.Schema({
  district: { type: String, required: true }, // District name
  villages: { type: [villageSchema], required: true }, // Array of villages in the district
});

// Create and export the model for the `demographic_tamilnadu` collection
const DemographicsTamilNadu =
  mongoose.models.DemographicsTamilNadu ||
  mongoose.model('DemographicsTamilNadu', villageSchema, 'demographic_tamilnadu');

export default DemographicsTamilNadu;
