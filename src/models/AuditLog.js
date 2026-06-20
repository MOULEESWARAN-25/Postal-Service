import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
  actionType: { type: String, required: true }, // VIEW_RECOMMENDATION, COMPARE_VILLAGES, RUN_BENEFICIARY_ANALYSIS, LAUNCH_CAMPAIGN, EXPORT_REPORT
  location: { type: String, required: true },
  recommendation: { type: String },
  opportunityIndex: { type: Number },
  userActionTime: { type: Date, default: Date.now }
}, { collection: 'audit_logs' });

const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);

export default AuditLog;
