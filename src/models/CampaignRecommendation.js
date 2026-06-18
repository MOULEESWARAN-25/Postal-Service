import mongoose from 'mongoose';

const CampaignRecommendationSchema = new mongoose.Schema({
  village: { type: String, required: true },
  recommendedScheme: { type: String, required: true },
  opportunityScore: { type: Number, required: true },
  campaignWindow: { type: String, required: true },
  keyDrivers: [{ type: String }],
  estimatedEligibleCitizens: { type: String, required: true },
  generatedAt: { type: Date, default: Date.now }
}, { collection: 'campaign_recommendations' });

const CampaignRecommendation = mongoose.models.CampaignRecommendation || mongoose.model('CampaignRecommendation', CampaignRecommendationSchema);

export default CampaignRecommendation;
