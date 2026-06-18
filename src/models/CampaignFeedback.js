import mongoose from 'mongoose';

const CampaignFeedbackSchema = new mongoose.Schema({
  campaignId: { type: String, required: true, unique: true },
  village: { type: String, required: true },
  scheme: { type: String, required: true },
  attendees: { type: Number, required: true },
  newEnrollments: { type: Number, required: true },
  feedbackScore: { type: Number, min: 1, max: 5, required: true },
  remarks: { type: String },
  status: { type: String, enum: ['Planned', 'In Progress', 'Completed'], default: 'Completed' },
  date: { type: Date, default: Date.now }
}, { collection: 'campaign_feedback' });

const CampaignFeedback = mongoose.models.CampaignFeedback || mongoose.model('CampaignFeedback', CampaignFeedbackSchema);

export default CampaignFeedback;
